import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Account Info
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },

    // Profile Info
    fullName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Friends/Contacts
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Security Tokens
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// ✅ Use capitalized model name
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
