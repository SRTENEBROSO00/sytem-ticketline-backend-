import {Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";



const router = Router()
const userAuthentic = new AuthController;
const userController = new UserController;
// Configurar el inicio de seseion
 router.post('/login', userAuthentic.login.bind(userAuthentic));
 router.post('/register', userController.register.bind(userController));

export default router; 