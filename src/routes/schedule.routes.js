import { Router } from 'express';
import {
  createScheduleController, listSchedulesController, findScheduleByIdController, updateScheduleController, deleteScheduleController
} from '../controllers/schedule.controller.js';
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middleware.js';

const scheduleRouter = Router();

// GERAL: Listar e ver detalhes (a filtragem por perfil ocorre no service)
scheduleRouter.get('/', ensureAuthenticated, listSchedulesController);
scheduleRouter.get('/:id', ensureAuthenticated, findScheduleByIdController);

// ADMIN: Criar, atualizar ou deletar agendamentos
scheduleRouter.post('/', ensureAdmin, createScheduleController);
scheduleRouter.put('/:id', ensureAdmin, updateScheduleController);
scheduleRouter.delete('/:id', ensureAdmin, deleteScheduleController);

export default scheduleRouter;
