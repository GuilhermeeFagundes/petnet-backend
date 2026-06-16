import { describe, it, expect } from '@jest/globals';
import { CRON_JOBS } from './cron_jobs.js';
import { sendScheduleRemindersService } from '../services/schedule_reminder.service.js';

describe('Cron Jobs Registry (cron_jobs.js)', () => {
  it('deve conter o job de lembrete de agendamento corretamente configurado', () => {
    const reminderJob = CRON_JOBS.find(job => job.name === 'schedule-reminder');

    expect(reminderJob).toEqual(expect.objectContaining({
      name: 'schedule-reminder',
      expression: '30 14 * * *',
      timezone: 'America/Sao_Paulo',
      handler: sendScheduleRemindersService
    }));
    expect(typeof reminderJob.description).toBe('string');
    expect(reminderJob.description.length).toBeGreaterThan(0);
  });

  it('cada job registrado deve ter os campos obrigatórios (name, description, expression, timezone, handler)', () => {
    CRON_JOBS.forEach(job => {
      expect(typeof job.name).toBe('string');
      expect(typeof job.description).toBe('string');
      expect(typeof job.expression).toBe('string');
      expect(typeof job.timezone).toBe('string');
      expect(typeof job.handler).toBe('function');
    });
  });
});
