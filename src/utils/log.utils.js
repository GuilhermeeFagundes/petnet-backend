const LOG_API_URL = process.env.LOG_API_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

/**
 * Envia um log para a API PHP de logs.
 * @param {object} data
 * @param {'user'|'pet'|'schedule'|'auth'} data.entity
 * @param {'create'|'update'|'delete'|'login'|'logout'|'register'} data.action
 * @param {'success'|'error'} data.status
 * @param {string|null} data.responsible 
 * @param {string|null} data.details
 */
export const sendLog = async (data) => {
    try {
        await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': LOG_API_TOKEN,
            },
            body: JSON.stringify({
                entity: data.entity,
                action: data.action,
                status: data.status,
                responsible: data.responsible,
                details: data.details,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            }),
        });
    } catch (error) {
        console.warn('[LOG] Falha ao enviar log:', error.message);
    }
};