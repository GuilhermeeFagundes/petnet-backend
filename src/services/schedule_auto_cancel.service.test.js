import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { cancelOverdueSchedulesService } from './schedule_auto_cancel.service.js';
import * as scheduleRepository from '../repository/schedule.repository.js';
import * as logUtils from '../utils/log.utils.js';

jest.mock('../repository/schedule.repository.js');
jest.mock('../utils/log.utils.js');

describe('Schedule Auto Cancel Service (schedule_auto_cancel.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('cancelOverdueSchedulesService', () => {
    it('deve cancelar os agendamentos pendentes com horário vencido usando o momento atual', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-03-15T21:00:00.000Z'));
      scheduleRepository.cancelOverdueSchedules.mockResolvedValue({ count: 3 });

      await cancelOverdueSchedulesService();

      expect(scheduleRepository.cancelOverdueSchedules).toHaveBeenCalledWith(new Date('2024-03-15T21:00:00.000Z'));
    });

    it('deve logar a quantidade de agendamentos cancelados', async () => {
      scheduleRepository.cancelOverdueSchedules.mockResolvedValue({ count: 3 });

      await cancelOverdueSchedulesService();

      expect(logUtils.sendLog).toHaveBeenCalledWith(expect.objectContaining({
        entity: 'schedule', action: 'auto_cancel', status: 'success', details: expect.stringContaining('3')
      }));
    });

    it('não deve logar quando não houver agendamentos vencidos', async () => {
      scheduleRepository.cancelOverdueSchedules.mockResolvedValue({ count: 0 });

      await cancelOverdueSchedulesService();

      expect(logUtils.sendLog).not.toHaveBeenCalled();
    });
  });
});
