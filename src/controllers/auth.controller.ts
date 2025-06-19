import { Ticket } from './../entity/Ticket';
// Controller
import { Request, Response } from "express";
import { genToken } from "../config/jwt";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

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
      const token = genToken({email: resUser.email, id: resUser.id})
      return res.json({token: token, userData: resUser})
      
    } catch (error) {
        console.error('Logging error', error)
      res.status(500).json({ message: `Server error: ${error}` });
    }
  }
}
