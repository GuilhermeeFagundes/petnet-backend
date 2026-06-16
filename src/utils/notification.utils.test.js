import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { sendNotification, notifyScheduleStatusChange } from './notification.utils.js';
import * as notificationService from '../services/notification.service.js';
import * as scheduleRepository from '../repository/schedule.repository.js';
import * as userRepository from '../repository/user.repository.js';
import * as logUtils from './log.utils.js';

jest.mock('../services/notification.service.js');
jest.mock('../repository/schedule.repository.js');
jest.mock('../repository/user.repository.js');
jest.mock('./log.utils.js');

describe('Notification Utils (notification.utils.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma notificação com sucesso', async () => {
    const mockNotification = { id: 1, user_cpf: '12345678901', topic: 'Test', message: 'Message' };
    notificationService.createNotificationService.mockResolvedValue(mockNotification);

    const result = await sendNotification('12345678901', 'Test', 'Message');

    expect(notificationService.createNotificationService).toHaveBeenCalledWith({
      user_cpf: '12345678901',
      topic: 'Test',
      message: 'Message',
      responsible: null
    });
    expect(result).toEqual(mockNotification);
  });

  it('deve retornar false e logar erro se a criação falhar', async () => {
    notificationService.createNotificationService.mockRejectedValue(new Error('Test Error'));

    const result = await sendNotification('12345678901', 'Test', 'Message');

    expect(result).toBe(false);
    expect(logUtils.sendLog).toHaveBeenCalledWith(expect.objectContaining({
      entity: 'notification',
      status: 'error',
      details: 'Test Error'
    }));
  });

  describe('notifyScheduleStatusChange', () => {
    it('deve notificar admins e cliente', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1, pet: { name: 'Rex' }, client_cpf: '12345678901', date_time: '2023-10-10T10:00:00Z' });
      userRepository.findUsersByType.mockResolvedValue([{ cpf: 'admin_cpf' }]);
      notificationService.createNotificationService.mockResolvedValue({ id: 1 });

      await notifyScheduleStatusChange(1, 'SCHEDULED');
      
      expect(userRepository.findUsersByType).toHaveBeenCalledWith('MANAGER');
      expect(notificationService.createNotificationService).toHaveBeenCalledWith(expect.objectContaining({
        user_cpf: 'admin_cpf',
        topic: 'Atualização de Agendamento',
        message: expect.stringContaining('O agendamento de Rex para')
      }));
      expect(notificationService.createNotificationService).toHaveBeenCalledWith(expect.objectContaining({
        user_cpf: '12345678901',
        topic: 'Atualização de Agendamento',
        message: expect.stringContaining('O agendamento de Rex para')
      }));
    });

    it('não deve estourar erro caso a notificação falhe (DB Error)', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1, client_cpf: '12345678901', date_time: '2023-10-10T10:00:00Z' });
      userRepository.findUsersByType.mockRejectedValue(new Error('DB error'));

      await expect(notifyScheduleStatusChange(1, 'SCHEDULED')).resolves.not.toThrow();

      expect(logUtils.sendLog).toHaveBeenCalledWith(expect.objectContaining({
        entity: 'notification',
        status: 'error',
        details: 'DB error'
      }));
    });

    it('não deve fazer nada se o agendamento não for encontrado', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue(null);
      await notifyScheduleStatusChange(1, 'SCHEDULED');
      expect(userRepository.findUsersByType).not.toHaveBeenCalled();
    });

    it('deve usar valores padrão para nome do pet e status se não houver traduções ou dados do pet', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1, client_cpf: '12345678901', date_time: '2023-10-10T10:00:00Z' }); // Sem pet definido
      userRepository.findUsersByType.mockResolvedValue([]);
      notificationService.createNotificationService.mockResolvedValue({ id: 1 });

      await notifyScheduleStatusChange(1, 'INVALID_STATUS');
      
      expect(notificationService.createNotificationService).toHaveBeenCalledWith(expect.objectContaining({
        user_cpf: '12345678901',
        topic: 'Atualização de Agendamento',
        message: expect.stringContaining('O agendamento de seu pet para') // "seu pet" é o fallback
      }));
      expect(notificationService.createNotificationService).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('status: INVALID_STATUS') // INVALID_STATUS é o fallback do enum
      }));
    });

    it('não deve notificar cliente se o client_cpf não estiver presente no agendamento', async () => {
      scheduleRepository.findScheduleById.mockResolvedValue({ id: 1, date_time: '2023-10-10T10:00:00Z' }); // Sem client_cpf
      userRepository.findUsersByType.mockResolvedValue([{ cpf: 'admin_cpf' }]);
      notificationService.createNotificationService.mockResolvedValue({ id: 1 });

      await notifyScheduleStatusChange(1, 'SCHEDULED');
      
      expect(notificationService.createNotificationService).toHaveBeenCalledTimes(1);
      expect(notificationService.createNotificationService).toHaveBeenCalledWith(expect.objectContaining({
        user_cpf: 'admin_cpf'
      }));
    });
  });
});
