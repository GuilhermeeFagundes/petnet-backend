import { Router } from 'express';
import {
    listNotificationsController,
    readNotificationController
} from '../controllers/notification.controller.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

// Filtra por usuário ativo e apenas notificações não lidas
notificationRouter.get('/', ensureAuthenticated, listNotificationsController);

// Marca como lida para o usuário ativo
notificationRouter.put('/:id/read', ensureAuthenticated, readNotificationController);

export default notificationRouter;
