import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as notificationController from './notification.controller.js';
import * as notificationService from '../services/notification.service.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('../services/notification.service.js');

describe('Notification Controller (notification.controller.js)', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: {}, 
            body: {}, 
            user: { cpf: TEST_CPF_1 } 
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

            expect(notificationService.listUnreadNotificationsService).toHaveBeenCalledWith(TEST_CPF_1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockNotifications);
        });
    });



    describe('readNotificationController', () => {
        it('deve marcar a notificação como lida e retornar status 200', async () => {
            req.params.id = '1';
            const mockNotification = { id: 1, viewed: true };
            notificationService.markAsReadService.mockResolvedValue(mockNotification);

            await notificationController.readNotificationController(req, res);

            expect(notificationService.markAsReadService).toHaveBeenCalledWith('1', TEST_CPF_1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockNotification);
        });
    });
});
