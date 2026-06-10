import { ResponseError } from "../errors/ResponseError.js";
import { cleanCpf } from "../utils/validators.utils.js";
import { sendLog } from "../utils/log.utils.js";
import { findUserByCpf } from "../repository/user.repository.js";
import {
    findUnreadNotificationsByCpf,
    createNotification,
    findNotificationById,
    updateNotificationViewed
} from "../repository/notification.repository.js";

export const listUnreadNotificationsService = async (userCPF) => {
    const cpf = cleanCpf(userCPF);
    return await findUnreadNotificationsByCpf(cpf);
};

export const createNotificationService = async (data) => {
    const { user_cpf, topic, message, responsible = null } = data;

    if (!user_cpf || !topic || !message) {
        await sendLog({ entity: 'notification', action: 'create', status: 'error', responsible, details: 'Campos obrigatórios ausentes: user_cpf, topic ou message.' });
        return false;
    }

    const cpf = cleanCpf(user_cpf);
    const userExists = await findUserByCpf(cpf);

    if (!userExists) {
        await sendLog({ entity: 'notification', action: 'create', status: 'error', responsible, details: `Usuário com CPF ${cpf} não encontrado.` });
        return false;
    }

    return await createNotification({
        user_cpf: cpf,
        topic,
        message
    });
};



export const markAsReadService = async (id, userCPF) => {
    const cpf = cleanCpf(userCPF);
    const notification = await findNotificationById(id);

    if (!notification) {
        throw new ResponseError("Notificação não encontrada.", 404);
    }

    if (notification.user_cpf !== cpf) {
        throw new ResponseError("Sem permissão para acessar esta notificação.", 403);
    }

    if (notification.viewed) {
        return notification;
    }

    return await updateNotificationViewed(id, true);
};
