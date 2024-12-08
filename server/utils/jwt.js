import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { SessionToken } from "../Models/SessionToken.Model.mjs";

export const authoriseUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded user data to req.user
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const genJWT = function (data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "4h" });
};

export const decodeJWT = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Neveljaven JWT");
  }
};

export const injectUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    req.user = null; // No token means no user is logged in
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded user data to req.user
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    req.user = null; // Invalid token
    next();
  }
};
