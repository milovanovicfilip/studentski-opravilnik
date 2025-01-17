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

  async getCurrentUser(req, res) {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await User.findById(req.session.user.id).select("-password"); // Exclude password from response
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }

  async logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful!" });
    });
  }

  updateProfile = async function (req, res) {
    try {
      const { username, email, avatarUrl, emailNotifications } = req.body;

      // Check if user is authenticated
      if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check for unique email
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already in use" });
        }
        user.email = email;
      }

      // Update fields if provided
      if (username) user.username = username;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;

      await user.save();

      // Update session data
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        emailNotifications: user.emailNotifications
      };

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An unexpected error occurred", details: error.message });
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
