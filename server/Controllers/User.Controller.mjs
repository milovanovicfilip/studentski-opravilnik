import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../Models/User.Model.mjs";
import { SessionToken } from "../Models/SessionToken.Model.mjs";
import { genJWT } from "../utils/jwt.js";
dotenv.config();
export default class UserController {
  constructor() {}

  // Add user
  addUser = async (request, response) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ error: "Vsa polja so obvezna!" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ error: "Uporabnik že obstaja!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      return response.status(201).json({ message: "Registracija uspešna" });
    } catch (error) {
      console.error("Error during user registration:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Login user
  loginUser = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Vsa polja so obvezna" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return response
          .status(400)
          .json({ error: "Neveljaven email ali geslo" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response
          .status(400)
          .json({ error: "Neveljaven email ali geslo" });
      }

      const token = genJWT({ userId: user._id });
      const sessionToken = new SessionToken({ userId: user._id, token });
      await sessionToken.save();

      return response.status(200).json({ token });
    } catch (error) {
      console.error("Error during user login:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Logout user
  logoutUser = async (request, response) => {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(400).json({ error: "Žeton ni podan!" });
    }

    try {
      const result = await SessionToken.deleteOne({ token });
      if (result.deletedCount === 0) {
        return response.status(400).json({ error: "Žeton ne obstaja" });
      }
      return response
        .status(200)
        .json({ message: "Uporabnik uspešno odjavljen" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Update profile
  updateProfile = async (request, response) => {
    const { username, email, password } = request.body;

    if (!username && !email && !password) {
      return response.status(400).json({ error: "Ni podatkov za posodobitev" });
    }

    try {
      const userId = request.user.userId;
      const updates = {};
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (password) updates.password = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });
      return response
        .status(200)
        .json({ message: "Profil uspešno posodobljen", user: updatedUser });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Fetch user posts
  getUserPosts = async (request, response) => {
    try {
      const userId = request.params.id;
      const user = await User.findById(userId).populate("tasks");
      if (!user) {
        return response.status(404).json({ error: "Uporabnik ne obstaja" });
      }

      return response.status(200).json({ posts: user.tasks });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Fetch user data
  getUserData = async (request, response) => {
    try {
      const userId = request.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return response.status(404).json({ error: "Uporabnik ne obstaja" });
      }

      return response.status(200).json(user);
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };

  // Remove user
  removeUser = async (request, response) => {
    try {
      const userId = request.params.id;
      const result = await User.findByIdAndDelete(userId);
      if (!result) {
        return response.status(404).json({ error: "Uporabnik ne obstaja" });
      }

      return response
        .status(200)
        .json({ message: "Uporabnik uspešno odstranjen" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  };
}
