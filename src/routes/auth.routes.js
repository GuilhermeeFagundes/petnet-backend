import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', registerController); // Criar conta + login automático
authRouter.post('/login', loginController);        // Login
authRouter.post('/logout', logoutController);      // Logout (limpa cookie)

export default authRouter;
