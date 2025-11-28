import { Router } from 'express';
import userRouter from './user.routes.js';
import petRouter from './pet.routes.js';
// // import { authRortes } from './auth.routes';

const router = Router();

// // routes.use('/auth', authRortes);
router.use('/users', userRouter);
router.use('/pets', petRouter);

export default router;