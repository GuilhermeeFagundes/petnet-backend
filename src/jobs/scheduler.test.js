import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { startScheduler } from './scheduler.js';
import cron from 'node-cron';
import { CRON_JOBS } from './cron_jobs.js';

jest.mock('node-cron');
jest.mock('./cron_jobs.js', () => ({
  CRON_JOBS: [
    { name: 'job-um', expression: '0 1 * * *', timezone: 'America/Sao_Paulo', handler: jest.fn() },
    { name: 'job-dois', expression: '0 2 * * *', timezone: 'America/Sao_Paulo', handler: jest.fn() },
  ]
}));

describe('Scheduler (scheduler.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startScheduler', () => {
    it('deve registrar um cron job para cada entrada do registro CRON_JOBS', () => {
      startScheduler();

      expect(cron.schedule).toHaveBeenCalledTimes(CRON_JOBS.length);
      CRON_JOBS.forEach((job, index) => {
        expect(cron.schedule).toHaveBeenNthCalledWith(
          index + 1,
          job.expression,
          expect.any(Function),
          { timezone: job.timezone }
        );
      });
    });

    it('deve chamar o handler de cada job quando o callback registrado é executado', () => {
      startScheduler();

      CRON_JOBS.forEach((job, index) => {
        const registeredCallback = cron.schedule.mock.calls[index][1];
        registeredCallback();

        expect(job.handler).toHaveBeenCalled();
      });
    });
  });
});
