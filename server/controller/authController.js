const { User, UserSettings } = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

// Function to create a JWT token for a user
const createToken = (user) => {
  const tokenData = {
    userId: user._id,
    email: user.email,
    name: user.name,
    username: user.username,
    image: user.image,
  };

  const token = jwt.sign(tokenData, secretKey, { expiresIn: "1hr" });

  return token;
};

// verify email
const sendVerificationEmail = (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Send email with verification link
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification",
    html: `<div style="font-family: Arial, sans-serif;">
    <h1 style="color: #333;">Welcome to Our Website !</h1>

    <p>Thank you for registering with us. To complete your registration, please click the button below to verify your email:</p>
    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; cursor: pointer;">Verify Email</a>
    <p>If you didn't register on our website, you can ignore this email.</p>
    <p>Best regards,<br/>Your Website Team</p>
  </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const resendVerificationEmail = async (req, res, email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    sendVerificationEmail(user.email, verificationToken);

    return res
      .status(200)
      .json({ success: true, message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const defaultImageUrl =
      "https://res.cloudinary.com/djc5o8g94/image/upload/v1718324785/test/fnyb9c2etrvevalip9ph.jpg";

    let imageUrl = req.file ? req.file.path : defaultImageUrl;

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      verificationToken: verificationToken,
    });

    const token = createToken(user);
    user.tokens.push(token);

    await user.save();

    sendVerificationEmail(user.email, verificationToken);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).header("Authorization", `Bearer ${token}`).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed due to an internal error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      // Return response indicating email not verified and verification email resent
      return res.status(403).json({
        success: false,
        message: "Email not verified. Verification email resent.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = createToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Return success response with token and user information
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
      },
    });
  } catch (error) {
    // Handle any errors and return an error response
    console.error("Login failed:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }
    res.clearCookie("jwt");
    req.session.destroy();
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = token;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password Reset",
      html: `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link to reset your password. If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p><a href="${process.env.CLIENT_URL}/api/reset-password/${token}">Reset Password</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: error.message,
        });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Password reset email sent" });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.resetPasswordToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Password must be a string" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Return a success message with a 200 status code
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    // Handle server errors and return a 500 status code
    return res.status(500).json({ error: "Failed to update password" });
  }
};

const changeProfilePicture = async (req, res) => {
  try {
    const user = req.session.user;

    if (req.file) {
      const imageUrl = req.file.path;
      user.image = imageUrl;
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error changing profile picture:", error);
    return res.status(500).json({ error: "Failed to update profile picture" });
  }
};

// const updateUserDetails = async (req, res) => {
//   try {
//     const { username, name, email, phoneNumber, dob } = req.body;
//     const userId = req.session.user._id;

//     const existingUser = await User.findOne({
//       $or: [{ username }, { name }, { email }, { phoneNumber }],
//       _id: { $ne: userId },
//     });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ error: "Username, email, or phone number already exists" });
//     }

//     const user = await User.findById(userId);
//     user.username = username;
//     user.name = name;
//     user.email = email;
//     user.phoneNumber = phoneNumber;
//     user.dob = dob;
//     await user.save();

//     return res
//       .status(200)
//       .json({ message: "User details updated successfully" });
//   } catch (error) {
//     console.error("Error updating user details:", error);
//     return res.status(500).json({ error: "Failed to update user details" });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { name, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.bio = bio;
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { email, username, phoneNumber, dob } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email, username, or phone number already exists" });
    }

    const user = await User.findById(userId);
    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber;
    user.dob = dob;
    await user.save();

    return res
      .status(200)
      .json({ message: "Account details updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ error: "Failed to update account details" });
  }
};

// Testing
// Notification and privacy

// GET user settings
const getUserSettings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("err", message);
      return res.status(404).json({ message: "User not found" });
    }

    // Extract and send privacy settings
    const { profileVisibility, searchVisibility, dataSharing } = user.privacy;

    res.status(200).json({ profileVisibility, searchVisibility, dataSharing });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({ message: "Failed to fetch user settings" });
  }
};

// POST create or update notification settings
const updateNotificationSettings = async (req, res) => {
  const { emailNotifications, smsNotifications, pushNotifications } = req.body;
  const userId = req.session.user._id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notifications.emailNotifications = emailNotifications;
    user.notifications.smsNotifications = smsNotifications;
    user.notifications.pushNotifications = pushNotifications;

    await user.save();

    res.json({ user });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

// POST create or update privacy settings

const updatePrivacySettings = async (req, res) => {
  const userId = req.session.user._id; // Assuming you're using authentication middleware to get user info
  const { profileVisibility, searchVisibility, dataSharing } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's privacy settings
    user.privacy.profileVisibility = profileVisibility;
    user.privacy.searchVisibility = searchVisibility;
    user.privacy.dataSharing = dataSharing;

    // Save the updated user
    await user.save();
    res
      .status(200)
      .json({ message: "Privacy settings updated successfully", user });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    res.status(500).json({ message: "Failed to update privacy settings" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  updatePassword,
  updateAccount,
  updateProfile,
  changeProfilePicture,
  // test
  getUserSettings,
  updateNotificationSettings,
  updatePrivacySettings,
};
