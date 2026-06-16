import { sendScheduleRemindersService } from '../services/schedule_reminder.service.js';

/**
 * Registro centralizado de todos os cron jobs do sistema.
 *
 * Para adicionar um novo job, basta incluir uma nova entrada neste array —
 * não é necessário alterar `scheduler.js`, que apenas itera essa lista e
 * é o único arquivo do projeto que conhece a biblioteca `node-cron`.
 *
 * Campos de cada job:
 * - name: identificador único do job (usado em logs/observabilidade)
 * - description: o que o job faz e por quê (documentação para humanos)
 * - expression: expressão cron no formato `minuto hora dia mês dia-da-semana`
 * - timezone: fuso horário usado para interpretar a expressão (nome IANA)
 * - handler: função assíncrona executada quando o job dispara — não deve
 *            conhecer node-cron, apenas a lógica de negócio do job
 */
export const CRON_JOBS = [
  {
    name: 'schedule-reminder',
    description: 'Envia e-mail de lembrete para agendamentos não confirmados ',
    expression: '0 14 * * *', // todos os dias às 14h
    timezone: 'America/Sao_Paulo',
    handler: sendScheduleRemindersService,
  },
];
