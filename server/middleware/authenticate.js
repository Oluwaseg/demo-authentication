const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

const authenticateToken = (req, res, next) => {
  // const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  let token = req.headers.authorization?.split(" ")[1];

  if (!token && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await User.findById(decodedToken.userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.session.user = user;
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return next(error);
    }
  });
};

const checkSessionExpiration = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Session expired" });
  }

  next();
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.verificationToken = null;
    user.isVerified = true;
    await user.save();

    // Send success JSON response
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error("Verification failed:", error);
  }
};

module.exports = {
  authenticateToken,
  checkSessionExpiration,
  verifyEmail,
};
