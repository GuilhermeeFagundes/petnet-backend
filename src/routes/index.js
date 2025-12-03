import { Router } from 'express';
import userRouter from './user.routes.js';
import petRouter from './pet.routes.js';
// import authRouter from './auth.routes.js';

const router = Router();

// router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/pets', petRouter);

export default router;