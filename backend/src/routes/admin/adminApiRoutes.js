const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { multer, storage } = require("../../middlewares/multerconfig");
const courseModel = require("../../models/coursemodel");
const User = require("../../models/User");
const Enrollment = require("../../models/enrollment");

const router = express.Router();
const upload = multer({ storage });

const makeFileUrl = (value) => {
  if (!value) return "";
  const trimmed = value.toString().trim();
  if (/^https?:\/\//i.test(trimmed)) {
    const badPrefix = "http://localhost:3000/https://";
    const badPrefixHttps = "https://localhost:3000/https://";
    if (trimmed.startsWith(badPrefix)) return trimmed.replace(badPrefix, "https://");
    if (trimmed.startsWith(badPrefixHttps)) return trimmed.replace(badPrefixHttps, "https://");

    const localMatch = trimmed.match(/^https?:\/\/localhost:3000\/(.*)$/i);
    if (localMatch) {
      const rest = localMatch[1];
      if (rest.startsWith("uploads/")) return trimmed;
      return `http://localhost:3000/uploads/${rest.replace(/^\//, "")}`;
    }

    return trimmed;
  }

  // Default to localhost base so clients can resolve URLs without needing an env var.
  const base = (process.env.localhost_url || "http://localhost:8000").replace(/\/+$/, "");
  const filename = trimmed.replace(/^\//, "");

  // If the stored value already includes the uploads folder, avoid doubling it.
  if (filename.toLowerCase().startsWith("uploads/")) {
    return `${base}/${filename}`;
  }

  return `${base}/uploads/${filename}`;
};

const normalizeCourse = (course) => {
  if (!course) return course;
  const data = course.toObject ? course.toObject() : { ...course };
  data.coursethumbnail = makeFileUrl(data.coursethumbnail);
  if (Array.isArray(data.modules)) {
    data.modules = data.modules.map((m) => {
      const mod = { ...m };
      if (Array.isArray(mod.videos)) {
        mod.videos = mod.videos.map((v) => ({ ...v, videoUrl: makeFileUrl(v.videoUrl) }));
      }
      if (Array.isArray(mod.pdfs)) {
        mod.pdfs = mod.pdfs.map((p) => ({ ...p, pdfUrl: makeFileUrl(p.pdfUrl) }));
      }
      return mod;
    });
  }
  return data;
};

const getLocalFilePath = (urlString) => {
  if (!urlString) return null;
  try {
    const parsed = new URL(urlString);
    if (!["localhost", "127.0.0.1"].includes(parsed.hostname)) return null;
    const relativePath = parsed.pathname.replace(/^\//, "");
    return path.join(__dirname, "../../..", relativePath);
  } catch (_e) {
    const relativePath = urlString.replace(/^\//, "");
    return path.join(__dirname, "../../..", relativePath);
  }
};

const deleteLocalFileIfExists = (url) => {
  const filePath = getLocalFilePath(url);
  if (!filePath) return;
  fs.unlink(filePath, () => {});
};

// Courses
router.get("/courses", async (req, res) => {
  const courses = await courseModel.find();
  res.json({ message: "ok", data: courses.map(normalizeCourse) });
});

router.get("/course/:id", async (req, res) => {
  const course = await courseModel.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Not found" });
  
  let isEnrolled = false;
  if (req.user) {
    const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.id });
    isEnrolled = !!enrollment;
  }
  
  const normalized = normalizeCourse(course);
  normalized.isEnrolled = isEnrolled;
  
  res.json({ message: "ok", data: [normalized] });
});

router.post(
  "/course",
  upload.fields([
    { name: "coursethumbnail", maxCount: 1 },
    { name: "coursevideo", maxCount: 1 },
  ]),
  async (req, res) => {
    const { Coursename, Coursedescription, category, CoursePrice, lessonTitle } = req.body;

    const thumbnailFile = req.files?.coursethumbnail?.[0];
    const videoFile = req.files?.coursevideo?.[0];

    const modules = [];
    if (videoFile) {
      modules.push({
        title: lessonTitle || "Lesson 1",
        videos: [
          {
            title: lessonTitle || "Lesson 1",
            videoUrl: videoFile.filename,
            duration: 0,
          },
        ],
        pdfs: [],
      });
    }

    const payload = {
      Coursename,
      Coursedescription,
      category,
      CoursePrice: Number(CoursePrice) || 0,
      coursethumbnail: thumbnailFile ? thumbnailFile.filename : "",
      modules,
    };

    const created = await courseModel.create(payload);
    res.json({ message: "created", data: normalizeCourse(created) });
  }
);

router.put(
  "/course/:id",
  upload.fields([{ name: "coursethumbnail", maxCount: 1 }]),
  async (req, res) => {
    const { id } = req.params;
    const { Coursename, Coursedescription, category, CoursePrice } = req.body;

    const course = await courseModel.findById(id);
    if (!course) return res.status(404).json({ message: "Not found" });

    if (Coursename) course.Coursename = Coursename;
    if (Coursedescription) course.Coursedescription = Coursedescription;
    if (category) course.category = category;
    if (CoursePrice) course.CoursePrice = Number(CoursePrice);

    const thumbnailFile = req.files?.coursethumbnail?.[0];
    if (thumbnailFile) course.coursethumbnail = thumbnailFile.filename;

    await course.save();
    res.json({ message: "updated", data: normalizeCourse(course) });
  }
);

router.delete("/course/:id", async (req, res) => {
  const { id } = req.params;
  const course = await courseModel.findById(id);
  if (course) {
    deleteLocalFileIfExists(course.coursethumbnail);
    (course.modules || []).forEach((mod) => {
      (mod.videos || []).forEach((video) => {
        deleteLocalFileIfExists(video.videoUrl);
      });
      (mod.pdfs || []).forEach((pdf) => {
        deleteLocalFileIfExists(pdf.pdfUrl);
      });
    });
  }

  await courseModel.findByIdAndDelete(id);
  res.json({ message: "deleted" });
});

// Lessons (admin-only)
router.post(
  "/course/:courseId/lesson",
  upload.single("video"),
  async (req, res) => {
    const { courseId } = req.params;
    const { lessonTitle, order } = req.body;
    const videoFile = req.file;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    if (!videoFile) {
      return res.status(400).json({ message: "video file is required" });
    }

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const videoUrl = makeFileUrl(videoFile.filename);
    const newModule = {
      title: lessonTitle,
      videos: [{ title: lessonTitle, videoUrl, duration: 0 }],
      pdfs: [],
    };

    let index = course.modules.length;
    if (order !== undefined && order !== null && order !== "" && !Number.isNaN(Number(order))) {
      index = Math.max(0, Math.min(course.modules.length, Number(order)));
    }

    course.modules.splice(index, 0, newModule);
    await course.save();

    const savedVideo = course.modules[index].videos[0];
    res.json({
      message: "created",
      data: {
        _id: savedVideo._id,
        lessonTitle: savedVideo.title,
        videoUrl: makeFileUrl(savedVideo.videoUrl),
        order: index,
      },
    });
  }
);

router.put(
  "/lesson/:lessonId",
  upload.single("video"),
  async (req, res) => {
    const { lessonId } = req.params;
    const { lessonTitle, order } = req.body;
    const videoFile = req.file;

    const course = await courseModel.findOne({ "modules.videos._id": lessonId });
    if (!course) return res.status(404).json({ message: "Lesson not found" });

    let moduleIndex = -1;
    let videoIndex = -1;
    for (let i = 0; i < course.modules.length; i++) {
      const mod = course.modules[i];
      const vidIndex = mod.videos.findIndex((v) => v._id && v._id.toString() === lessonId);
      if (vidIndex !== -1) {
        moduleIndex = i;
        videoIndex = vidIndex;
        break;
      }
    }

    if (moduleIndex === -1) return res.status(404).json({ message: "Lesson not found" });

    const module = course.modules[moduleIndex];
    const video = module.videos[videoIndex];

    if (lessonTitle) {
      video.title = lessonTitle;
      module.title = lessonTitle;
    }

    if (videoFile) {
      deleteLocalFileIfExists(video.videoUrl);
      video.videoUrl = videoFile.filename;
    }

    // Reorder module if requested
    if (order !== undefined && order !== null && order !== "") {
      const newIndex = Math.max(0, Math.min(course.modules.length - 1, Number(order)));
      if (!Number.isNaN(newIndex) && newIndex !== moduleIndex) {
        const [moved] = course.modules.splice(moduleIndex, 1);
        course.modules.splice(newIndex, 0, moved);
        moduleIndex = newIndex;
      }
    }

    await course.save();

    const updatedModule = course.modules[moduleIndex];
    const updatedVideo = updatedModule.videos[videoIndex];

    res.json({
      message: "updated",
      data: {
        _id: updatedVideo._id,
        lessonTitle: updatedVideo.title,
        videoUrl: makeFileUrl(updatedVideo.videoUrl),
        order: moduleIndex,
      },
    });
  }
);

router.delete("/lesson/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  const course = await courseModel.findOne({ "modules.videos._id": lessonId });
  if (!course) return res.status(404).json({ message: "Lesson not found" });

  let moduleIndex = -1;
  let videoIndex = -1;
  for (let i = 0; i < course.modules.length; i++) {
    const mod = course.modules[i];
    const vidIndex = mod.videos.findIndex((v) => v._id && v._id.toString() === lessonId);
    if (vidIndex !== -1) {
      moduleIndex = i;
      videoIndex = vidIndex;
      break;
    }
  }

  if (moduleIndex === -1) return res.status(404).json({ message: "Lesson not found" });

  const module = course.modules[moduleIndex];
  const video = module.videos[videoIndex];
  deleteLocalFileIfExists(video.videoUrl);

  course.modules.splice(moduleIndex, 1);
  await course.save();

  res.json({ message: "deleted" });
});

// Users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json({ message: "ok", data: users });
});

router.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

// Enrollments
router.get("/enrollments", async (req, res) => {
  const enrollments = await Enrollment.find().populate("user").populate("course");
  res.json({ message: "ok", data: enrollments });
});

module.exports = router;
