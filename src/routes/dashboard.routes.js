import { Router } from 'express';
import { getDashboardController } from '../controllers/dashboard.controller.js';
import { ensureAdmin } from '../middlewares/auth.middleware.js';

const dashboardRouter = Router();

// Endpoint que retorna as estatisticas pro dashboard
dashboardRouter.get('/', ensureAdmin, getDashboardController);

export default dashboardRouter;
