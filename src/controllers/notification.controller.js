import {
    listUnreadNotificationsService,
    createNotificationService,
    markAsReadService
} from '../services/notification.service.js';

export const listNotificationsController = async (req, res) => {
    const userCPF = req.user.cpf; // injetado pelo ensureAuthenticated
    const notifications = await listUnreadNotificationsService(userCPF);
    return res.status(200).json(notifications);
};

export const createNotificationController = async (req, res) => {
    const notification = await createNotificationService(req.body);
    return res.status(201).json(notification);
};

export const readNotificationController = async (req, res) => {
    const { id } = req.params;
    const userCPF = req.user.cpf;
    const notification = await markAsReadService(id, userCPF);
    return res.status(200).json(notification);
};
