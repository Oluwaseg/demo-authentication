const express = require("express");
const authController = require("../../controller/authController");
const {
  authenticateToken,
  checkSessionExpiration,
  verifyEmail,
} = require("../../middleware/authenticate");
const upload = require("../../middleware/image.config");
const { User } = require("../../model/user");
const router = express.Router();

router.post("/register", upload.single("image"), authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await authController.resendVerificationEmail(
      req,
      res,
      email
    );
  } catch (error) {
    console.error("Error in /resend-verification route:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.put(
  "/update-password",
  authenticateToken,
  authController.updatePassword
);
router.put(
  "/change-profile-picture",
  authenticateToken,
  upload.single("image"),
  authController.changeProfilePicture
);
router.put(
  "/update-user-profile",
  authenticateToken,
  authController.updateProfile
);
router.put(
  "/update-user-account",
  authenticateToken,
  authController.updateAccount
);

router.get("/home", authenticateToken, checkSessionExpiration, (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ user });
});

router.get("/forgot-password", (req, res) => {
  res.status(200).json({ message: "Forgot password page" });
});

router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.status(200).json({ token });
});

router.get("/verify-email", verifyEmail);

router.get("/resend-verification", authenticateToken, (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const email = user.email;
  res.status(200).json({ email });
});

router.get("/success", (req, res) => {
  res.status(200).json({ message: "Success page" });
});

// test

// ! Notification
// Get
router.get(
  "/notifications",
  authenticateToken,
  checkSessionExpiration,
  async (req, res) => {
    const userId = req.session.user._id; // Assuming user is authenticated
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { emailNotifications, smsNotifications, pushNotifications } =
        user.notifications;
      res.json({ emailNotifications, smsNotifications, pushNotifications });
    } catch (error) {
      console.error("Error fetching user notifications settings:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch user notifications settings" });
    }
  }
);
// POST create or update notification settings
router.post(
  "/notifications",
  authenticateToken,
  checkSessionExpiration,
  authController.updateNotificationSettings
);

// GET privacy settings
router.get(
  "/setting/:userId",
  authenticateToken,
  checkSessionExpiration,
  authController.getUserSettings
);

// POST create or update privacy settings
router.post(
  "/privacy",
  authenticateToken,
  checkSessionExpiration,
  authController.updatePrivacySettings
);

module.exports = router;
