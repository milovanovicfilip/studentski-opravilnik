import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../Models/User.Model.mjs";
dotenv.config();

/*import crypto from "crypto";
function generateRandom(length){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function Hash(data, salt){
    const pepper = process.env.PEPPER;
    let cypher = data + salt;

    for (let i = 0; i < 1000; i++) {
        cypher = crypto.createHash('sha512', pepper).update(cypher).digest('base64');
    }

    return cypher;
}*/

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
                return res.status(400).json({ error: "Uporabnik že obstaja!" });
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

            return response.status(201).json({ message: "Registracija uspešna", token: genJWT(user.id) });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ error: "Napaka na strežniku", details: error.message });
        }
    }

    addUser = async function (request, response) {
        try {

            return response.status(200).json({ message: "User created successfully", token: genJWT(user.id) });
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({ message: 'An unexpected error occurred' });
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

    loginUser = async function (request, response) {
        try {


            return response.status(200).json({ message: "User sucessfully logged in", token: genJWT() });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "An unexpected error occurred" });
        }
    }

    logoutUser = async function (request, response) {
        try {

            return response.status(200).json({ message: "User sucessfully logged out" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "An unexpected error occurred" });
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
