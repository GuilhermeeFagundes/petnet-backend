import cron from 'node-cron';
import { CRON_JOBS } from './cron_jobs.js';

/**
 * Único arquivo do projeto que conhece node-cron.
 * Registra todos os jobs definidos no registro centralizado (`cron_jobs.js`).
 * Novos jobs não exigem alterações aqui — apenas uma nova entrada em CRON_JOBS.
 */
export const startScheduler = () => {
  CRON_JOBS.forEach(({ expression, timezone, handler }) => {
    cron.schedule(expression, () => {
      handler();
    }, { timezone });
  });
};
