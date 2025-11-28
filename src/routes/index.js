import { Router } from 'express';
import userRouter from './user.routes.js';
// // import { authRortes } from './auth.routes';

const router = Router();

// // routes.use('/auth', authRortes);
router.use('/users', userRouter);

export default router;