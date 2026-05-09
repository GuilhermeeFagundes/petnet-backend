import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';
import { forgotPasswordController, resetPasswordController } from '../controllers/password_reset.controller.js';

const authRouter = Router();

authRouter.post('/register', registerController);                    // público
authRouter.post('/login', loginController);                          // público
authRouter.post('/logout', ensureAuthenticated, logoutController);   // só logado pode deslogar

// Recuperação de senha
authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/reset-password', resetPasswordController);

export default authRouter;
