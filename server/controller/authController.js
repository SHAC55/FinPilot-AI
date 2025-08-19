import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Validate inputs
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create user with OTP (unverified)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: {
        code: otpCode,
        expiresAt: otpExpiry,
      },
    });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "FinPilot - AI Verify your account",
      text: `Your OTP code is: ${otpCode}`,
    });

    res.status(201).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If not verified, send OTP
    if (!user.isVerified) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      // Save OTP
      user.otp = {
        code: otpCode,
        expiresAt: otpExpiry,
      };
      await user.save();

      // Send OTP to email
      await sendEmail({
        to: user.email,
        subject: "Verify Your FinPilot Account",
        text: `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`,
      });

      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: "Your account is not verified. OTP has been sent to your email.",
      });
    }

    // If verified, login success
    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email query is required",
      });
    }

    // Search users by email (case-insensitive)
    const users = await User.find({
      email: { $regex: email, $options: "i" },
    }).select("_id username email");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// export const requestOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email || !validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Invalid email" });
//     }

//     let user = await User.findOne({ email });

//     // Optionally create user if not found (registration flow)
//     if (!user) {
//       user = await User.create({
//         email,
//         username: email.split("@")[0],
//       });
//     }

//     // Generate OTP
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//     user.otp = {
//       code: otpCode,
//       expiresAt: otpExpiry,
//     };
//     await user.save();

//     // Send OTP via email
//     await sendEmail(
//       email,
//       "Your OTP Code",
//       `Your verification code is: ${otpCode}. It will expire in 5 minutes.`
//     );

//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//     console.error("OTP Request Error:", err);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// };

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // OTP valid – clear it
    user.otp = undefined;
    await user.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
  }
};
