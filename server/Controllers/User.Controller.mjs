import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../Models/User.Model.mjs";
import { SessionToken } from "../Models/SessionToken.Model.mjs";
import { genJWT } from "../utils/jwt.js";
dotenv.config();

export default class UserController {
    constructor() { }
    async addUser(request, response) {
        const { username, email, password } = request.body;

        if (!username || !email || !password) {
            return response.status(400).json({ error: "Vsa polja so obvezna!" });
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return response.status(400).json({ error: "Uporabnik že obstaja!" });
            }

            // hash gesla
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            // shrani uporabnika v bazo
            await newUser.save();

            return response.status(201).json({ message: "Registracija uspešna" });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ error: "Napaka na strežniku", details: error.message });
        }
    }

    removeUser = async function (request, response) {
        try {

            return response.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "An unexpected error occurred" });
        }
    }

    async loginUser(request, response) {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ error: "Vsa polja so obvezna" });
        }

        try {
            // preveri DB
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return response.status(400).json({ error: "Neveljaven email ali geslo" });
            }

            // ustvari žeton
            const token = genJWT({ userId: user._id });
            const sessionToken = new SessionToken({ userId: user._id, token });
            await sessionToken.save();

            return response.status(200).json({ token });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Napaka na strežniku", details: error.message });
        }
    }

    async logoutUser(request, response) {
        const token = request.headers.authorization?.split(" ")[1];

        try {
            await SessionToken.deleteOne({ token });
            return response.status(200).json({ message: "Uporabnik uspešno odjavljen" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Napaka na strežniku", details: error.message });
        }
    }

    updateProfile = async function (request, response) {
        try {


            return response.status(200).json({ message: "Sucessfully updated profile" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "An unexpected error occurred" });
        }
    }

    getUserPosts = async function (request, response) {
        try {

            return response.status(200).json(posts);
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({ message: 'An unexpexted error occurred' });
        }
    }

    getUserData = async function (request, response) {
        try {

            return response.status(200).json(user);
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({ message: 'An unexpexted error occurred' });
        }
    }
}
