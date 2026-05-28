import { Router } from 'express';
import {
    listNotificationsController,
    createNotificationController,
    readNotificationController
} from '../controllers/notification.controller.js';
import { ensureAuthenticated, ensureAdmin } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

// Filtra por usuário ativo e apenas notificações não lidas
notificationRouter.get('/', ensureAuthenticated, listNotificationsController);

// Apenas ADM pode criar e vincular qualquer user
notificationRouter.post('/', ensureAdmin, createNotificationController);

// Marca como lida para o usuário ativo
notificationRouter.put('/:id/read', ensureAuthenticated, readNotificationController);

export default notificationRouter;
