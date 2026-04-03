const {default: axios} = require("axios");
const courseselect = require("../../../models/courserelated");

exports.intitialkhaltipayment = async (req, res) => {
  const {courseselectId, amount} = req.body;
  if (!courseselectId || !amount) {
    return res.status(400).json({
      message: "please provide courseselectedid ,amount",
    });
  }
  let courses = await courseselect.findById(courseselectId);
  if (!courses) {
    return res.status(400).json({
      message: "selected course with that id not found",
    });
  }
  if (courses.totalamount !== amount) {
    return res.status(400).json({
      message: "Amount must be equal to toalamount",
    });
  }
  const data = {
    return_url: "http://localhost:3000/success",
    purchase_order_id: courseselectId,
    amount: amount * 100,
    website_url: "http://localhost:3000/",
    purchase_order_name: "coursename_" + courseselectId,
  };
  const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
    headers: {
      Authorization: "key 503d66b404944ee787dd041aff687c5b",
    },
  });
  console.log("Khalti response:", response.data);
  console.log("pidx to save:", response.data.pidx);
  courses.paymentdetail.pidx = response.data.pidx;
  console.log(courses.paymentdetail.pidx);
  await courses.save();

  // res.redirect(response.data.payment_url)
  res.status(200).json({
    message: "payment successful",
    paymentUrl: response.data.payment_url,
  });
};

exports.verifypdx = async (req, res) => {
  const pidx = req.body.pidx;
  const userId = req.user.id;
  const response = await axios.post(
    "https://dev.khalti.com/api/v2/epayment/lookup/",
    {pidx},
    {
      headers: {
        Authorization: "key 503d66b404944ee787dd041aff687c5b",
      },
    },
  );
  if (response.data.status == "Completed") {
    console.log("searching for pidx:", pidx);
    let courses = await courseselect.find({"paymentdetail.pidx": pidx});
    console.log("found courses:", courses);
    courses[0].paymentdetail.method = "khalti";
    courses[0].paymentdetail.status = "paid";
    await courses[0].save();
    res.status(200).json({
      message: "payment verified successfully",
    });
  }
};
