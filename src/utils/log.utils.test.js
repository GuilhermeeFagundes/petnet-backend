import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { sendLog } from './log.utils.js';

global.fetch = jest.fn();

describe('Log Utils (log.utils.js)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve enviar o log com os dados corretos', async () => {
        fetch.mockResolvedValue({ ok: true });

        await sendLog({
            entity: 'user',
            action: 'create',
            status: 'success',
            responsible: '12345678901',
            details: 'Usuário criado.',
        });

        expect(fetch).toHaveBeenCalledWith(
            process.env.LOG_API_URL,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': process.env.LOG_API_TOKEN,
                }),
            })
        );
    });

    it('deve falhar silenciosamente se o fetch lançar erro', async () => {
        fetch.mockRejectedValue(new Error('API indisponível'));
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        await expect(sendLog({ entity: 'user', action: 'create', status: 'error' })).resolves.not.toThrow();

        expect(consoleSpy).toHaveBeenCalledWith('[LOG] Falha ao enviar log:', 'API indisponível');
        consoleSpy.mockRestore();
    });
});