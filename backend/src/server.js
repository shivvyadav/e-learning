// TOP OF server.js - must be first!
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db.js");

const app = express();

// apply cors middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const path = require("path");

// Serve uploaded files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Legacy: also serve files at root for existing URLs (keep backwards compatibility)
app.use(express.static(path.join(__dirname, "../uploads")));

// Simple internal admin UI for development/testing
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin.html"));
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies parser
app.use(cookieParser());

// basic route
app.get("/", (req, res) => {
  return res.json({message: "Welcome to the E-learning API!"});
});

// import routes
const authroutes = require("./routes/auth/authroutes");
const courseaddRoute = require("./routes/admin/courseroute");
const courseselectadminRoute = require("./routes/admin/admincourseselectroute");
const dataserviceRoute = require("./routes/admin/dataservice");
const enrollmentadminRoute = require("./routes/admin/enrollmentadminroute");
const adminuserRoute = require("./routes/admin/adminuserroute.js");
const courseselectRoute = require("./routes/user/courseselectroute");
const paymentroute = require("./routes/user/paymentroute");
const profileroute = require("./routes/user/profileroute");
const reviewroute = require("./routes/user/reviewroute");
const enrollementroute = require("./routes/user/enrollementroute");
const progressroute = require("./routes/user/progrssroute.js");
const adminApiRoute = require("./routes/admin/adminApiRoutes");

app.use("/api/auth", authroutes);
app.use("/api", courseaddRoute);
app.use("/api", courseselectadminRoute);
app.use("/api", dataserviceRoute);
app.use("/api", adminuserRoute);
app.use("/api", enrollmentadminRoute);
app.use("/api", courseselectRoute);
app.use("/api", paymentroute);
app.use("/api", profileroute);
app.use("/api", reviewroute);
app.use("/api", enrollementroute);
app.use("/api", progressroute);
app.use("/api/admin", adminApiRoute);

const port = process.env.PORT || 8000;

connectDB().then(() => {
  console.log("Database connected, starting server...");
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});
