import { createNotificationService } from '../services/notification.service.js';

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
