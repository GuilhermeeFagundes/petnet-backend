import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
    listUnreadNotificationsService,
    createNotificationService,
    markAsReadService
} from './notification.service.js';
import * as notificationRepository from '../repository/notification.repository.js';
import * as userRepository from '../repository/user.repository.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();

jest.mock('../repository/notification.repository.js');
jest.mock('../repository/user.repository.js');

describe('Notification Service (notification.service.js)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('listUnreadNotificationsService', () => {
        it('deve listar as notificações não lidas de um usuário', async () => {
            const mockNotifications = [{ id: 1, topic: 'Aviso', viewed: false }];
            notificationRepository.findUnreadNotificationsByCpf.mockResolvedValue(mockNotifications);

            const result = await listUnreadNotificationsService(TEST_CPF_1);

            expect(notificationRepository.findUnreadNotificationsByCpf).toHaveBeenCalledWith(TEST_CPF_1);
            expect(result).toEqual(mockNotifications);
        });
    });



    describe('createNotificationService', () => {
        const validData = { user_cpf: TEST_CPF_1, topic: 'Promoção', message: 'Desconto!' };

        it('deve criar uma notificação com sucesso', async () => {
            userRepository.findUserByCpf.mockResolvedValue({ cpf: TEST_CPF_1 });
            notificationRepository.createNotification.mockResolvedValue({ id: 1, ...validData });

            const result = await createNotificationService(validData);

            expect(userRepository.findUserByCpf).toHaveBeenCalledWith(TEST_CPF_1);
            expect(notificationRepository.createNotification).toHaveBeenCalledWith(validData);
            expect(result.id).toBe(1);
        });

        it('deve retornar false e logar erro se faltarem campos obrigatórios', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await createNotificationService({ topic: 'Promoção' });
            
            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('deve retornar false e logar erro se o usuário não for encontrado', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            userRepository.findUserByCpf.mockResolvedValue(null);
            
            const result = await createNotificationService(validData);
            
            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('markAsReadService', () => {
        it('deve marcar a notificação como lida se pertencer ao usuário', async () => {
            const mockNotification = { id: 1, user_cpf: TEST_CPF_1, viewed: false };
            notificationRepository.findNotificationById.mockResolvedValue(mockNotification);
            notificationRepository.updateNotificationViewed.mockResolvedValue({ ...mockNotification, viewed: true });

            const result = await markAsReadService(1, TEST_CPF_1);

            expect(notificationRepository.findNotificationById).toHaveBeenCalledWith(1);
            expect(notificationRepository.updateNotificationViewed).toHaveBeenCalledWith(1, true);
            expect(result.viewed).toBe(true);
        });

        it('deve retornar a notificação sem alterar se já estiver lida', async () => {
            const mockNotification = { id: 1, user_cpf: TEST_CPF_1, viewed: true };
            notificationRepository.findNotificationById.mockResolvedValue(mockNotification);

            const result = await markAsReadService(1, TEST_CPF_1);

            expect(notificationRepository.updateNotificationViewed).not.toHaveBeenCalled();
            expect(result.viewed).toBe(true);
        });

        it('deve lançar erro se a notificação não existir', async () => {
            notificationRepository.findNotificationById.mockResolvedValue(null);
            await expect(markAsReadService(1, TEST_CPF_1)).rejects.toThrow('Notificação não encontrada.');
        });

        it('deve lançar erro se a notificação não pertencer ao usuário', async () => {
            const mockNotification = { id: 1, user_cpf: '00000000000', viewed: false };
            notificationRepository.findNotificationById.mockResolvedValue(mockNotification);
            
            await expect(markAsReadService(1, TEST_CPF_1)).rejects.toThrow('Sem permissão para acessar esta notificação.');
        });
    });
});
