import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const verifytoken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token provided, authorization denied' });
  }

  try {
    const jwtSecret = process.env.jwtSecret;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ success: false, msg: 'Server configuration error' });
    }
    
    // const decoded = jwt.verify(token , jwtSecret);
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: 'Token is not valid' });
  }
};