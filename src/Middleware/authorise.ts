import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRole } from "../Schema/user";

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ success: false, msg: "Your role is not allowed" });
    }

    next();
  };
};