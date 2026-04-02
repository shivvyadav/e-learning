const enroll = require("../../../models/enrollment");

exports.getAllEnrollments = async (req, res) => {
  const enrollments = await enroll.find().populate("user").populate("course");

  res.status(200).json({
    message: "enrollment fetched successfully",
    data: enrollments,
  });
};
