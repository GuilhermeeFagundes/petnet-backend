import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as notificationController from './notification.controller.js';
import * as notificationService from '../services/notification.service.js';

jest.mock('../services/notification.service.js');

describe('Notification Controller (notification.controller.js)', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: {}, 
            body: {}, 
            user: { cpf: '12345678901' } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('listNotificationsController', () => {
        it('deve retornar a lista de notificações com status 200', async () => {
            const mockNotifications = [{ id: 1, topic: 'Aviso', viewed: false }];
            notificationService.listUnreadNotificationsService.mockResolvedValue(mockNotifications);

            await notificationController.listNotificationsController(req, res);

            expect(notificationService.listUnreadNotificationsService).toHaveBeenCalledWith('12345678901');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockNotifications);
        });
    });

    describe('createNotificationController', () => {
        it('deve criar uma notificação e retornar status 201', async () => {
            req.body = { user_cpf: '12345678901', topic: 'Aviso', message: 'Teste' };
            const mockNotification = { id: 1, ...req.body };
            notificationService.createNotificationService.mockResolvedValue(mockNotification);

            await notificationController.createNotificationController(req, res);

            expect(notificationService.createNotificationService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockNotification);
        });
    });

    describe('readNotificationController', () => {
        it('deve marcar a notificação como lida e retornar status 200', async () => {
            req.params.id = '1';
            const mockNotification = { id: 1, viewed: true };
            notificationService.markAsReadService.mockResolvedValue(mockNotification);

            await notificationController.readNotificationController(req, res);

            expect(notificationService.markAsReadService).toHaveBeenCalledWith('1', '12345678901');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockNotification);
        });
    });
});
