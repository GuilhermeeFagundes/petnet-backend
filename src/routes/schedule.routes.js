import { Router } from 'express';
import {
  createScheduleController, listSchedulesController, findScheduleByIdController, updateScheduleController, deleteScheduleController, deliverScheduleController
} from '../controllers/schedule.controller.js';
import { ensureAdmin, ensureAdminOrCollaboratorOwner, ensureAuthenticated } from '../middlewares/auth.middleware.js';

const scheduleRouter = Router();

// GERAL: Listar e ver detalhes (a filtragem por perfil ocorre no service)
scheduleRouter.get('/', ensureAuthenticated, listSchedulesController);
scheduleRouter.get('/:id', ensureAuthenticated, findScheduleByIdController);

// ADMIN: Criar, atualizar ou deletar agendamentos
scheduleRouter.post('/', ensureAdmin, createScheduleController);
scheduleRouter.delete('/:id', ensureAdmin, deleteScheduleController);

// ATUALIZAÇÃO: admin ou colaborador dono do agendamento
scheduleRouter.put('/:id', ensureAdminOrCollaboratorOwner, updateScheduleController);
scheduleRouter.patch('/:id/deliver', ensureAdminOrCollaboratorOwner, deliverScheduleController);

export default scheduleRouter;
