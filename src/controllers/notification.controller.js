import {
    listUnreadNotificationsService,
    markAsReadService
} from '../services/notification.service.js';

export const listNotificationsController = async (req, res) => {
    const userCPF = req.user.cpf; // injetado pelo ensureAuthenticated
    const notifications = await listUnreadNotificationsService(userCPF);
    return res.status(200).json(notifications);
};

export const readNotificationController = async (req, res) => {
    const { id } = req.params;
    const userCPF = req.user.cpf;
    const notification = await markAsReadService(id, userCPF);
    return res.status(200).json(notification);
};
