// Controller
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { User } from "../entity/User";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      if(!email || !password) return res.status(401).json({ message: "Fields required." });

      const resUser = await this.userRepo.findOneBy({ email });

      // Verify user
      if (!resUser) return res.status(401).json({ message: "User no found" });

      // Decode password
      const isMatch = await bcrypt.compare(password, resUser.password);
      if(!isMatch) res.status(401).json({message: 'Wrong password.'});
      
      //Gen token 
      // const token = genToken({email: resUser.email, id: resUser.id})
      // // return res.json({token: token, userData: resUser});

      //Gen token 
      const jsonSecretKey = process.env.JWT_SECRET;
      if(!jsonSecretKey) {
        throw new Error('Variable de entorno no definida.')
      }
      const token = jwt.sign(
        {id: resUser.id, email: resUser.email},
        jsonSecretKey,
        {expiresIn: '1h'},
      )


      res.cookie('token', token, {
        httpOnly: true, //Evitar que JS accesa a la cookie
        secure: process.env.NODE_ENV === 'production', // Cambia a true en despliegue
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, //1H
      });
      
      return res.json({message: "Login successful", user: { id: resUser.id, email: resUser.email, role: resUser.role, name: resUser.name }})
    } catch (error) { 
        console.error('Logging error', error)
      res.status(500).json({ message: `Server error: ${error}` });
    }
  }
}
