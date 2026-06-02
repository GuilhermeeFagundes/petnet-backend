import { createNotificationService } from '../services/notification.service.js';
import { findScheduleById } from '../repository/schedule.repository.js';
import { findUsersByType } from '../repository/user.repository.js';
import { ScheduleEnums } from '../enums/schedule.enums.js';

/**
 * Utilitário para o envio interno de notificações automatizadas no sistema.
 * @param {string} userCpf CPF do usuário alvo
 * @param {string} topic Tópico/Título da notificação
 * @param {string} message Mensagem da notificação
 * @returns Retorna a notificação criada ou false em caso de erro.
 */
export const sendNotification = async (userCpf, topic, message) => {
    try {
        const notification = await createNotificationService({
            user_cpf: userCpf,
            topic,
            message
        });

        return notification;
    } catch (error) {
        // Loga o erro mas não quebra o fluxo onde foi chamado (será integrado via API futuramente)
        console.error(`[Notificação] Erro ao criar notificação interna: ${error.message}`);
        return false;
    }
};

export const notifyScheduleStatusChange = async (scheduleId, statusEnumKey) => {
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

    const admins = await findUsersByType('ADMIN');
    const notifications = admins.map(admin => sendNotification(admin.cpf, topic, message));
    
    if (schedule.client_cpf) {
      notifications.push(sendNotification(schedule.client_cpf, topic, message));
    }

    await Promise.all(notifications);
  } catch (error) {
    console.error(`Erro ao notificar mudança de status de agendamento: ${error.message}`);
  }
};
