import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerController);                    // público
authRouter.post('/login', loginController);                          // público
authRouter.post('/logout', ensureAuthenticated, logoutController);   // só logado pode deslogar

export default authRouter;
