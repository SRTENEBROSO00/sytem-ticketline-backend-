// Controller
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

export class UserController {
  private userRepo = AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<any> {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name || !role)
        return res.status(400).json({ message: "Fields required." });

      const existingUser = await this.userRepo.findOneBy({ email });
      if (existingUser)
        return res.status(409).json({ mensaje: "User is alreday registed." });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepo.create({
        email,
        password: hashedPassword,
        name: name,
        role: role,
        // tickets: ticket,
      });
      //Crear DTO para no enviar la contrasena hasheada al front
      await this.userRepo.save(newUser);
      res.status(200).json({ message: "✔ User registed successfully!" });
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error}` });
    }
  }

  async updateUserData(req: Request, res: Response): Promise<any> {
    
  }
  
}
