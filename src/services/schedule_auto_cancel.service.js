import { cancelOverdueSchedules } from '../repository/schedule.repository.js';
import { sendLog } from '../utils/log.utils.js';

/**
 * Cancela automaticamente agendamentos ainda pendentes (status SCHEDULED)
 * cujo horário já passou.
 */
export const cancelOverdueSchedulesService = async () => {
  const { count } = await cancelOverdueSchedules(new Date());

  if (count === 0) return;

  await sendLog({
    entity: 'schedule', action: 'auto_cancel', status: 'success',
    responsible: null, details: `${count} agendamento(s) pendente(s) com horário vencido cancelado(s) automaticamente`
  });
};
