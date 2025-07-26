import jwt from "jsonwebtoken"
import { verifyToken } from "../config/jwt";
import { Request, Response, NextFunction } from "express";
import { Any } from "typeorm";

// // Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any  => {
    const token = req.cookies.token;
    //Unauthorized
    if(!token) {
      return res.status(401).json({error: 'Token no provided'});
    }

    //Verificar el token
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret || typeof jwtSecret !== "string") {
        return res.status(500).json({ error: "JWT secret is not configured" });
      }
      const payload = jwt.verify(token, jwtSecret);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token no privides', error: err });
    } 
}

export const testAuthMiddleware = (req: Request, res: Response, next: NextFunction): any  => {
  req.user = {
    name: "Cristian",
    role: "Tecnico",
    email: "test@test.com",
    ticket: "12"

  };
  next();
}