import { findSchedulesForReminder } from '../repository/schedule.repository.js';
import { sendScheduleReminderEmail } from './email.service.js';
import { getReminderDateRange } from '../utils/date.utils.js';
import { sendLog } from '../utils/log.utils.js';

/**
 * Envia um e-mail de lembrete para cada agendamento não confirmado
 * (status SCHEDULED) marcado para o dia seguinte.
 */
export const sendScheduleRemindersService = async () => {
  const { start, end } = getReminderDateRange();
  const schedules = await findSchedulesForReminder(start, end);

  if (schedules.length === 0) return;

  let successCount = 0;
  for (const schedule of schedules) {
    try {
      await sendScheduleReminderEmail(schedule);
      successCount++;
    } catch (error) {
      await sendLog({
        entity: 'schedule', action: 'reminder', status: 'error',
        responsible: null, details: `Falha ao enviar lembrete do agendamento ${schedule.id}: ${error.message}`
      });
    }
  }

  await sendLog({
    entity: 'schedule', action: 'reminder', status: 'success',
    responsible: null, details: `${successCount}/${schedules.length} lembretes enviados com sucesso`
  });
};
