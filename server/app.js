const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./routes/api/auth");

const app = express();

app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "testing",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);
if (process.env.NODE_ENV === "production") {
  sessionOptions.cookie.secure = true; // Enable secure cookie in production
}

const logSession = (req, res, next) => {
  // console.log("Session Data:", req.session);
  next();
};
app.use(logSession);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use("/api", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const errorMessage =
    err.message || "Something went wrong. Please try again later.";
  res.locals.message = errorMessage;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page or send JSON response
  res.status(err.status || 500);
  res.json({
    message: errorMessage,
    error: req.app.get("env") === "development" ? err : {},
  });
});
module.exports = app;
