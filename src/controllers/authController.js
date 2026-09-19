import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCokies } from "../services/auth.js";

export async function registerUser(req, res) {
    const {email, password} = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new createHttpError(400, "This email in use.");
    }

    const hashedPasswod = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPasswod});
    const newSession = await createSession(newUser._id);
    setSessionCokies(res, newSession);
    res.status(201).json(newUser);
}
