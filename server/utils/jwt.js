import * as dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { SessionToken } from "../Models/SessionToken.Model.mjs";

export const authoriseUser = async function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    try {
        // preveri veljavnost
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // preveri, ali je v DB
        const session = await SessionToken.findOne({ token });
        if (!session) {
            throw new Error("Neveljaven žeton");
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Neveljaven ali potekel žeton" });
    }
};

export const genJWT = function (data) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "4h" });
};

export const decodeJWT = function (token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        throw new Error('Neveljaven JWT');
    }
};