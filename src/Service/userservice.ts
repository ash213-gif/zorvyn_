import { Request, Response } from "express";
import { User } from "../Schema/user";
import jwt from 'jsonwebtoken';


export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, msg: "Request body is missing or empty" });
    }
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, msg: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, msg: "Request body is missing or empty" });
    }
    const { email, password } = req.body;
    

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, msg: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, msg: "Your account is currently inactive" });
    }
    
    user.lastLogin = new Date();
    await user.save();

    const jwtSecret = process.env.jwtSecret;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      process.exit(1)
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });

    res.status(200).json({ success: true, msg: "Login successful", data: user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};