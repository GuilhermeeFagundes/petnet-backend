import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';
import { forgotPasswordController, resetPasswordController } from '../controllers/password_reset.controller.js';
import { authLimiter } from '../middlewares/rate_limit.middleware.js';

const authRouter = Router();

authRouter.post('/register', authLimiter, registerController);                    // público
authRouter.post('/login', authLimiter, loginController);                          // público
authRouter.post('/logout', ensureAuthenticated, logoutController);   // só logado pode deslogar

// Recuperação de senha
authRouter.post('/forgot-password', authLimiter, forgotPasswordController);
authRouter.post('/reset-password', authLimiter, resetPasswordController);

export default authRouter;
