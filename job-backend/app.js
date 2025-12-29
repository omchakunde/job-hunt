require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const userRoutes = require("./routes/user");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

/* =======================
   MIDDLEWARES
======================= */

app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://job-hunt-frontend-mu.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

/* =======================
   ROUTES
======================= */

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

/* =======================
   ERROR HANDLER
======================= */

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

/* =======================
   DATABASE & SERVER
======================= */

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });
