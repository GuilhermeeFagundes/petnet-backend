import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { sendScheduleRemindersService } from './schedule_reminder.service.js';
import * as scheduleRepository from '../repository/schedule.repository.js';
import * as emailService from './email.service.js';
import * as dateUtils from '../utils/date.utils.js';
import * as logUtils from '../utils/log.utils.js';

jest.mock('../repository/schedule.repository.js');
jest.mock('./email.service.js');
jest.mock('../utils/date.utils.js');
jest.mock('../utils/log.utils.js');

const REMINDER_RANGE = { start: new Date('2024-03-15T15:00:00.000Z'), end: new Date('2024-03-17T02:59:59.999Z') };

describe('Schedule Reminder Service (schedule_reminder.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dateUtils.getReminderDateRange.mockReturnValue(REMINDER_RANGE);
  });

  describe('sendScheduleRemindersService', () => {
    it('não deve chamar sendScheduleReminderEmail nem sendLog se não houver agendamentos', async () => {
      scheduleRepository.findSchedulesForReminder.mockResolvedValue([]);

      await sendScheduleRemindersService();

      expect(emailService.sendScheduleReminderEmail).not.toHaveBeenCalled();
      expect(logUtils.sendLog).not.toHaveBeenCalled();
    });

    it('deve buscar os agendamentos do momento atual até o fim do dia de amanhã', async () => {
      scheduleRepository.findSchedulesForReminder.mockResolvedValue([]);

      await sendScheduleRemindersService();

      expect(scheduleRepository.findSchedulesForReminder).toHaveBeenCalledWith(REMINDER_RANGE.start, REMINDER_RANGE.end);
    });

    it('deve chamar sendScheduleReminderEmail uma vez para cada agendamento retornado', async () => {
      const schedules = [{ id: 1 }, { id: 2 }];
      scheduleRepository.findSchedulesForReminder.mockResolvedValue(schedules);
      emailService.sendScheduleReminderEmail.mockResolvedValue();

      await sendScheduleRemindersService();

      expect(emailService.sendScheduleReminderEmail).toHaveBeenCalledTimes(2);
      expect(emailService.sendScheduleReminderEmail).toHaveBeenNthCalledWith(1, schedules[0]);
      expect(emailService.sendScheduleReminderEmail).toHaveBeenNthCalledWith(2, schedules[1]);
    });

    it('deve continuar para o próximo agendamento e logar o erro quando o envio falhar', async () => {
      const schedules = [{ id: 1 }, { id: 2 }];
      scheduleRepository.findSchedulesForReminder.mockResolvedValue(schedules);
      emailService.sendScheduleReminderEmail
        .mockRejectedValueOnce(new Error('Falha no envio'))
        .mockResolvedValueOnce();

      await sendScheduleRemindersService();

      expect(emailService.sendScheduleReminderEmail).toHaveBeenCalledTimes(2);
      expect(logUtils.sendLog).toHaveBeenCalledWith(expect.objectContaining({
        entity: 'schedule', action: 'reminder', status: 'error', details: expect.stringContaining('1')
      }));
    });

    it('deve logar o resumo de sucesso ao final do processamento', async () => {
      const schedules = [{ id: 1 }, { id: 2 }];
      scheduleRepository.findSchedulesForReminder.mockResolvedValue(schedules);
      emailService.sendScheduleReminderEmail.mockResolvedValue();

      await sendScheduleRemindersService();

      expect(logUtils.sendLog).toHaveBeenCalledWith(expect.objectContaining({
        entity: 'schedule', action: 'reminder', status: 'success', details: expect.stringContaining('2/2')
      }));
    });
  });
});
