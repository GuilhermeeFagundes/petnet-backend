import { createNotificationService } from '../services/notification.service.js';
import { findScheduleById } from '../repository/schedule.repository.js';
import { findUsersByType } from '../repository/user.repository.js';
import { ScheduleEnums } from '../enums/schedule.enums.js';
import { sendLog } from './log.utils.js';

/**
 * Utilitário para o envio interno de notificações automatizadas no sistema.
 * @param {string} userCpf CPF do usuário alvo
 * @param {string} topic Tópico/Título da notificação
 * @param {string} message Mensagem da notificação
 * @returns Retorna a notificação criada ou false em caso de erro.
 */
export const sendNotification = async (userCpf, topic, message, responsibleCpf = null) => {
    try {
        const notification = await createNotificationService({
            user_cpf: userCpf,
            topic,
            message,
            responsible: responsibleCpf
        });

        return notification;
    } catch (error) {
        await sendLog({ entity: 'notification', action: 'create', status: 'error', responsible: responsibleCpf, details: error.message });
        return false;
    }
};

export const notifyScheduleStatusChange = async (scheduleId, statusEnumKey, responsibleCpf = null) => {
  try {
    const schedule = await findScheduleById(scheduleId);
    if (!schedule) return;

    const statusObj = ScheduleEnums.find(e => e.key === 'status');
    const statusName = statusObj.translations[statusEnumKey] || statusEnumKey;
    const petName = schedule.pet?.name || 'seu pet';

    const dataAgendamento = new Date(schedule.date_time);
    const dateFormatted = dataAgendamento.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    const topic = 'Atualização de Agendamento';
    const message = `O agendamento para ${petName}, as ${dateFormatted} esta ${statusName}`;

    const admins = await findUsersByType('MANAGER');
    const notifications = admins.map(admin => sendNotification(admin.cpf, topic, message, responsibleCpf));

    if (schedule.client_cpf) {
      notifications.push(sendNotification(schedule.client_cpf, topic, message, responsibleCpf));
    }

    await Promise.all(notifications);
  } catch (error) {
    await sendLog({ entity: 'notification', action: 'create', status: 'error', responsible: responsibleCpf, details: error.message });
  }
};
