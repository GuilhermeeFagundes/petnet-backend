import { Router } from 'express';
import userRouter from './user.routes.js';
import petRouter from './pet.routes.js';
import authRouter from './auth.routes.js';
import serviceRouter from './service.routes.js';
import scheduleRouter from './schedule.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/pets', petRouter);
router.use('/services', serviceRouter);
router.use('/schedules', scheduleRouter);

export default router;