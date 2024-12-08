import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../Models/User.Model.mjs";
import { SessionToken } from "../Models/SessionToken.Model.mjs";
import { genJWT } from "../utils/jwt.js";

dotenv.config();

export default class UserController {
  constructor() {}

  async addUser(request, response) {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ error: "Vsa polja so obvezna!" });
    }

    try {
      console.log("Checking if user already exists...");
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ error: "Uporabnik že obstaja!" });
      }

      // Hash the password
      console.log("Hashing the password...");
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("Saving new user to the database...");
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
  }

  async loginUser(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Vsa polja so obvezna" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.error("User not found for email:", email);
        return response
          .status(400)
          .json({ error: "Neveljaven email ali geslo" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.error("Password mismatch for email:", email);
        return response
          .status(400)
          .json({ error: "Neveljaven email ali geslo" });
      }

      const token = genJWT({ userId: user._id });
      const sessionToken = new SessionToken({ userId: user._id, token });
      await sessionToken.save();

      console.log("User login successful:", user.username);
      return response.status(200).json({ token });
    } catch (error) {
      console.error("Error during user login:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  }

  async logoutUser(request, response) {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(400).json({ error: "Žeton ni podan!" });
    }

    try {
      console.log("Deleting session token...");
      const result = await SessionToken.deleteOne({ token });
      if (result.deletedCount === 0) {
        return response.status(400).json({ error: "Žeton ne obstaja" });
      }
      return response
        .status(200)
        .json({ message: "Uporabnik uspešno odjavljen" });
    } catch (error) {
      console.error("Error during logout:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  }

  async updateProfile(request, response) {
    const { username, email, password } = request.body;

    if (!username && !email && !password) {
      return response.status(400).json({ error: "Ni podatkov za posodobitev" });
    }

    try {
      const userId = request.user.userId; // Assuming `authoriseUser` middleware adds `user` to the request object
      console.log("Updating user profile for:", userId);

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
      console.error("Error during profile update:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  }

  async getUserPosts(request, response) {
    try {
      const userId = request.params.id;
      console.log("Fetching posts for user:", userId);

      const user = await User.findById(userId).populate("tasks");
      if (!user) {
        return response.status(404).json({ error: "Uporabnik ne obstaja" });
      }

      return response.status(200).json({ posts: user.tasks });
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  }

  async getUserData(request, response) {
    try {
      const userId = request.params.id;
      console.log("Fetching user data for ID:", userId);

      const user = await User.findById(userId);
      if (!user) {
        return response.status(404).json({ error: "Uporabnik ne obstaja" });
      }

      return response.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return response
        .status(500)
        .json({ error: "Napaka na strežniku", details: error.message });
    }
  }
}
