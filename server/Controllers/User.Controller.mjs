import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../Models/User.Model.mjs";
dotenv.config();

export default class UserController {
  constructor() { }
  async addUser(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  removeUser = async function (request, response) {
    try {
      return response
        .status(200)
        .json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ message: "An unexpected error occurred" });
    }
  };

  async loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Set user session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      res.status(200).json({ message: "Login successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  // Get Current User
  async getCurrentUser(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json(req.session.user);
  }

  // User Logout
  async logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful!" });
    });
  }

  updateProfile = async function (request, response) {
    try {
      return response
        .status(200)
        .json({ message: "Sucessfully updated profile" });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "An unexpected error occurred" });
    }
  };

  getUserPosts = async function (request, response) {
    try {
      return response.status(200).json(posts);
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ message: "An unexpexted error occurred" });
    }
  };

  getUserData = async function (request, response) {
    try {
      return response.status(200).json(user);
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ message: "An unexpexted error occurred" });
    }
  };
}
