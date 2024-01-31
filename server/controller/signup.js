import User from "../modules/user.module.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedpassword = bcryptjs.hashSync(password, 10);
    const newuser = new User({ username, email, password: hashedpassword });

    try {
        await newuser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error (unique constraint violated)
            if (error.keyPattern.email) {
                res.status(409).json('Email already exists');
            } else if (error.keyPattern.username) {
                res.status(409).json('Username already exists');
            } else {
                res.status(409).json('Duplicate key violation');
            }
        } else {
            // Other errors
            res.status(500).json(error.message);
        }
    }
};
