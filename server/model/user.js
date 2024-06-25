const mongoose = require("mongoose");
const slugify = require("slugify");
const crypto = require("crypto");

const NotificationSchema = new mongoose.Schema({
  emailNotifications: { type: Boolean, default: false },
  smsNotifications: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: false },
});

const PrivacySchema = new mongoose.Schema({
  profileVisibility: {
    type: String,
    enum: ["public", "friends", "private"],
    default: "public",
  },
  searchVisibility: { type: Boolean, default: false },
  dataSharing: { type: Boolean, default: false },
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  tokens: [
    {
      type: String,
    },
  ],
  username: {
    type: String,
    unique: true,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  phoneNumber: {
    type: String,
  },
  dob: {
    type: Date,
  },
  bio: {
    type: String,
  },
  notifications: {
    type: NotificationSchema,
    default: () => ({}),
  },
  privacy: {
    type: PrivacySchema,
    default: () => ({
      profileVisibility: "public",
      searchVisibility: false,
      dataSharing: false,
    }),
  },
});

// Generate username if not provided
schema.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    const initials = this.name.substring(0, 3);
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const randomUsername = `${initials}-${randomNumber}`;
    this.username = randomUsername;
  }
  next();
});

const User = mongoose.model("User", schema);

module.exports = { User };
