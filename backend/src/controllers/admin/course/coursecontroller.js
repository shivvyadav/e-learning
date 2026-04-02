
const fs = require("fs")
const course = require("../../../models/coursemodel")

require("dotenv").config()

const makeFileUrl = (value) => {
  if (!value) return "";
  const trimmed = value.toString().trim();

  if (/^https?:\/\//i.test(trimmed)) {
    // Fix broken double URL cases like "http://localhost:3000/https://..."
    const badPrefix = "http://localhost:3000/https://";
    const badPrefixHttps = "https://localhost:3000/https://";
    if (trimmed.startsWith(badPrefix)) return trimmed.replace(badPrefix, "https://");
    if (trimmed.startsWith(badPrefixHttps)) return trimmed.replace(badPrefixHttps, "https://");

    // Correct local URLs that miss /uploads/.
    const localMatch = trimmed.match(/^https?:\/\/localhost:3000\/(.*)$/i);
    if (localMatch) {
      const rest = localMatch[1];
      if (rest.startsWith("uploads/")) return trimmed;
      return `http://localhost:3000/uploads/${rest.replace(/^\//, "")}`;
    }

    return trimmed;
  }

  const base = process.env.localhost_url?.replace(/\/+$/, "") ?? "";
  const filename = trimmed.replace(/^\//, "");
  return `${base}/uploads/${filename}`;
};

exports.createcourse = async(req,res)=>{
    let  file = req.files.coursethumbnail[0]
    let videoFiles = req.files.videos||[]
    let  pdfFiles = req.files.pdfs||[]
    let filepath;
    if(!file){
        filepath ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1dQPM88-Vq0f-YM8xILMQdKktXgKBMN6XH9cCBleA&s"
    }else{
        filepath = file.filename
    }
   

    const {Coursename,Coursedescription,CoursePrice,category,modules} = req.body 

    //if we are uploading object or array from any kind of form in frontend then first we need to convert it into string and in
    //backend we need to again convert back it into its original form 
    // ## Why FormData can't handle objects/arrays?
    // Because **HTTP protocol** only understands:
    // text
    // files

   // That's it! No objects, no arrays — just plain text and files.

   // So the flow is always:
  
  // Object/Array
  // ↓
  // JSON.stringify()  ← convert to text
  // ↓
  // HTTP sends text
  // ↓
 // JSON.parse()  ← convert back to Object/Array

     let parsedmodules = JSON.parse(modules);
    let videoIndex =0
    let pdfIndex =0
    if(!Coursename ||!Coursedescription ||!CoursePrice || !modules ||!category) {
        return res.status(400).json({
            message:"please provide ,Coursedescription,CoursePrice,coursethumbnail, modules,category"
        })
    }
    parsedmodules = parsedmodules.map((mod)=>{
        const mappedvideos =(mod.videos ||[]).map((vid)=>{
            const file = videoFiles[videoIndex++];
            return {
                title:vid.title,
                videoUrl:file? makeFileUrl(file.filename) :"",
                duration:vid.duration||0
            }
        })
        const mappedPdfs = (mod.pdfs || []).map((pdf) => {
        const file = pdfFiles[pdfIndex++];
        return {
          title: pdf.title,
          pdfUrl: file ? makeFileUrl(file.filename) : ""
        };
      });
      return{
        title:mod.title,
        videos:mappedvideos,
        pdf:mappedPdfs
      }
    })



   const newCourse= await course.create({
        Coursename,
        Coursedescription,
        CoursePrice,
        coursethumbnail: makeFileUrl(filepath),
        modules:parsedmodules,
        category

    })
    return res.status(200).json({
      message: "Course created successfully",
      data:newCourse
    });


}

exports.deletecourse = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "please provide id" })
    }

    
    const olddata = await course.findById(id)
    if (!olddata) {
        return res.status(404).json({ message: "no data found with that id" })
    }

  
    const oldthumbnail = olddata.coursethumbnail
    const thumbnailPath = oldthumbnail.slice(process.env.localhost_url.length)
    fs.unlink("./" + thumbnailPath, (err) => {
        if (err) console.log("error deleting thumbnail", err)
        else console.log("thumbnail deleted successfully")
    })

    // delete videos and pdfs from each module
    olddata.modules.forEach(module => {

        // delete each video
        module.videos.forEach(video => {
            const videoPath = video.videoUrl.slice(process.env.localhost_url.length)
            fs.unlink("./" + videoPath, (err) => {
                if (err) console.log("error deleting video", err)
                else console.log("video deleted successfully")
            })
        })

        // delete each pdf
        module.pdfs.forEach(pdf => {
            const pdfPath = pdf.pdfUrl.slice(process.env.localhost_url.length)
            fs.unlink("./" + pdfPath, (err) => {
                if (err) console.log("error deleting pdf", err)
                else console.log("pdf deleted successfully")
            })
        })
    })

    // now delete from DB
    await course.findByIdAndDelete(id)

    res.status(200).json({ message: "course deleted successfully" })
}

exports.editcourse = async(req,res)=>{
    const {id}= req.params 
    const {Coursename,Coursedescription,CoursePrice,category,modules} = req.body 
    if(!Coursename ||!Coursedescription ||!CoursePrice || !modules ||!category ||!id) {
        return res.status(400).json({
            message:"please provide ,Coursedescription,CoursePrice,coursethumbnail, modules,category  and id"
        })
    }
    const olddata = await course.findById(id)
    if (!olddata) {
        return res.status(404).json(
            { message: "no data found with that id"

             })
    }
     const oldthumbnail = olddata.coursethumbnail 
    let  file = req.files.coursethumbnail ? req.files.coursethumbnail[0]:null
    let videoFiles = req.files.videos||[]
    let  pdfFiles = req.files.pdfs||[]
    
    let parsedmodules = JSON.parse(modules);
    let videoIndex =0
    let pdfIndex =0

    

    parsedmodules = parsedmodules.map((mod)=>{
        const mappedvideos =(mod.videos ||[]).map((vid)=>{
            const file = videoFiles[videoIndex++];
            return {
                title:vid.title,
                videoUrl:file? process.env.localhost_url+file.filename :vid.videoUrl,
                duration:vid.duration||0
            }
        })
        const mappedPdfs = (mod.pdfs || []).map((pdf) => {
        const file = pdfFiles[pdfIndex++];
        return {
          title: pdf.title,
          pdfUrl: file ? makeFileUrl(file.filename) : pdf.pdfUrl
        };
      });
      return{
        title:mod.title,
        videos:mappedvideos,
        pdf:mappedPdfs
      }
    })

   const updatedcourse = await course.findByIdAndUpdate(id,{
      Coursename,
        Coursedescription,
        CoursePrice,
        coursethumbnail : file && file.filename ? makeFileUrl(file.filename) : oldthumbnail,
        modules:parsedmodules,
        category

   },{new:true,runValidators:true})

   const getLocalFilePath = (urlString) => {
     if (!urlString) return null;
     try {
       const parsed = new URL(urlString);
       if (!["localhost", "127.0.0.1"].includes(parsed.hostname)) return null;
       const relativePath = parsed.pathname.replace(/^\//, "");
       return require("path").join(__dirname, "../../../../..", relativePath);
     } catch (_e) {
       const relativePath = urlString.replace(/^\//, "");
       return require("path").join(__dirname, "../../../../..", relativePath);
     }
   };

   if (file) {
     const oldproductimage = olddata.coursethumbnail;
     const oldPath = getLocalFilePath(oldproductimage);
     if (oldPath) {
       fs.unlink(oldPath, (err) => {
         if (err) {
           console.log("error deleting file", err);
         } else {
           console.log("file deleted successfully");
         }
       });
     }
   }

   if (videoFiles.length > 0 || pdfFiles.length > 0) {
     olddata.modules.forEach((module) => {
       // delete each video
       module.videos.forEach((video) => {
         const videoPath = getLocalFilePath(video.videoUrl);
         if (videoPath) {
           fs.unlink(videoPath, (err) => {
             if (err) console.log("error deleting video", err);
             else console.log("video deleted successfully");
           });
         }
       });

       // delete each pdf
       module.pdfs.forEach((pdf) => {
         const pdfPath = getLocalFilePath(pdf.pdfUrl);
         if (pdfPath) {
           fs.unlink(pdfPath, (err) => {
             if (err) console.log("error deleting pdf", err);
             else console.log("pdf deleted successfully");
           });
         }
       });
     });
   }
   
 
    res.status(200).json({
        message:"course updatted successfully",
        data:updatedcourse
    })
}


