


const { getAllEnrollments } = require("../../controllers/admin/enroll/enrollementcontroller")
const isAuthenticated = require("../../middlewares/authMiddleware")
const restrictto = require("../../middlewares/restrict")
const catchasync = require("../../services/catchasync")



const router = require("express").Router()
router.route("/enroll").get(isAuthenticated,restrictto("admin"),catchasync(getAllEnrollments))

module.exports =router