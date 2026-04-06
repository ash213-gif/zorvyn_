import { Request, Response } from "express";
import { User } from "../Schema/user";


//access all users 
// update all users
// get particular user 
// delete particular user 

// admin can control user and delete user with particular id 


export const getallusers = async (req: Request, res: Response) => {
  try {
    // Pagination params with defaults
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10)); // Max 50 per page
    const skip = (page - 1) * limit;

    // Fetch users with pagination and total count
    const users = await User.find().select("-password").skip(skip).limit(limit);
    const total = await User.countDocuments();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      current: page,
      pages: totalPages,
      total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    res.status(200).json({ 
      success: true, 
      data: users, 
      pagination 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getuserid = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const upadatestatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const delteuser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.status(200).json({ success: true, msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};