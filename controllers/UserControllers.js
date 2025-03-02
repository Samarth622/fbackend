import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const register = async (req, res) => {
  try {
    const { name, email, mobile, password, gender } = req.body;

    const nameRegex = /^[a-zA-Z\s'-]{3,50}$/;
    if(!name || !nameRegex.test(name)){
      return res.status(401).json({ message: "Please give valid name and minimum length 3" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if(!email || !emailRegex.test(email)){
      return res.status(401).json({ message: "Please give valid email" });
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if(!mobile || !mobileRegex.test(mobile)){
      return res.status(401).json({ message: "Please give valid mobile" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/;
    if(!password || !passwordRegex.test(password)){
      return res.status(401).json({ message: "Password contain atleast one Uppercase, one lowercase, one number and one special character. length is atleast 7." })
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile)
      return res.status(400).json({ message: "Mobile number already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      gender,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const mobileRegex = /^[6-9]\d{9}$/;
    if(!mobile && !mobileRegex.test(mobile)){
      return res.status(402).json({ message: "Please give valid mobile" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/;
    if(!password && !passwordRegex.test(password)){
      return res.status(402).json({ message: "Password contain atleast one Uppercase, one lowercase, one number and one special character." })
    }

    const user = await User.findOne({ where: { mobile } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { uid: user.uid, mobile: user.mobile },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.uid, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not found" });


    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { register, login, getProfile, updateProfile, logout };
