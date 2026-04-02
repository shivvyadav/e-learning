const course = require("../../../models/coursemodel");
const courseselect = require("../../../models/courserelated");
const review = require("../../../models/review");
const User = require("../../../models/User");
const enrollment = require("../../../models/enrollment");

exports.getdata = async (req, res) => {
  // const courses = (await course.find()).length
  // const users = (await User.find()).length
  // const reviews = await review.find()
  // const reviewlength =  reviews.length
  // const allcourseselect = await courseselect.find().populate('user').populate('course')
  // const courseselected = allcourseselect.length

  const courses = await course.find();
  const users = await User.find();
  const reviews = await review.find().populate("userId").populate("courseId");
  const enrollments = await enrollment.find().populate("user").populate("course");

  res.status(200).json({
    message: "data fetched successfully",
    data: {
      //   courses,
      //   users,
      //   courseselected,
      //   allcourseselect,
      //   reviews,
      // reviewlength
      courses,
      users,
      enrollments,
      reviews,
    },
  });
};
