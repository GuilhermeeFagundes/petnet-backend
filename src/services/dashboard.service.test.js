import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getDashboardDataService } from './dashboard.service.js';
import * as dashboardRepository from '../repository/dashboard.repository.js';

describe('Dashboard Service', () => {
    beforeEach(() => {
        // Freeze time to Jun 15, 2026, 15:00:00 Local time
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2026, 5, 15, 15, 0, 0));

        const today10h = new Date(2026, 5, 15, 10, 0, 0);
        const today14h = new Date(2026, 5, 15, 14, 0, 0);

        jest.spyOn(dashboardRepository, 'getSchedulesForDashboard').mockResolvedValue([
            {
                status: 'FINISHED',
                date_time: today10h.toISOString(),
                collaborator: { name: 'João', cpf: '123' },
                services: [{ name: 'Banho' }]
            },
            {
                status: 'CANCELED',
                date_time: today14h.toISOString(),
                collaborator: { name: 'Maria', cpf: '456' },
                services: [{ name: 'Tosa' }]
            },
            {
                status: 'DELIVERED',
                date_time: today10h.toISOString(),
                // test without collaborator and services for edge cases
            }
        ]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    describe('getDashboardDataService', () => {
        it('deve retornar métricas para os 3 períodos', async () => {
            const result = await getDashboardDataService();

            expect(result).toHaveProperty('Diario');
            expect(result).toHaveProperty('Mensal');
            expect(result).toHaveProperty('Anual');

            expect(result.Diario.cards.length).toBe(4);
            expect(result.Diario.cards[0].titulo).toBe('Total Agendamentos');
            expect(result.Diario.cards[0].valor).toBe('3');

            expect(result.Diario.cards[1].titulo).toBe('Cancelamento');
            expect(result.Diario.cards[1].valor).toBe('1');

            expect(result.Diario.cards[2].titulo).toBe('Finalizados');
            expect(result.Diario.cards[2].valor).toBe('1');

            expect(result.Diario.statusPorColaborador.length).toBe(2);

            const idx10h = result.Diario.fluxoLabels.indexOf('10h');
            const idx14h = result.Diario.fluxoLabels.indexOf('14h');
            expect(result.Diario.fluxo[idx10h]).toBe(2);
            expect(result.Diario.fluxo[idx14h]).toBe(1);
        });

        it('deve cobrir: hora fora do range diário, mês futuro no anual, colaborador duplicado e status desconhecido', async () => {
            const today7h = new Date(2026, 5, 15, 7, 0, 0);    // 07h → fora do map 08h-18h (linha 72 false)
            const yesterday = new Date(2026, 5, 14, 10, 0, 0);  // mesmo colaborador duas vezes (linha 141 false)
            const futureMonth = new Date(2026, 8, 10, 10, 0, 0); // setembro → m=8 > currentMonth=5 (linha 106 false)

            dashboardRepository.getSchedulesForDashboard.mockResolvedValue([
                { status: 'SCHEDULED',      date_time: today7h.toISOString(),    collaborator: { name: 'João', cpf: '123' }, services: [] },
                { status: 'SCHEDULED',      date_time: yesterday.toISOString(),  collaborator: { name: 'João', cpf: '123' }, services: [] },
                { status: 'INVALID_STATUS', date_time: yesterday.toISOString(),  collaborator: { name: 'Maria', cpf: '456' }, services: [] },
                { status: 'SCHEDULED',      date_time: futureMonth.toISOString(), collaborator: null, services: [] },
            ]);

            const result = await getDashboardDataService();

            // 07h não cai no mapa do fluxo diário → fluxo zerado para essa hora
            const idx7h = result.Diario.fluxoLabels.indexOf('07h');
            expect(idx7h).toBe(-1);

            // Anual: setembro está além do mês corrente, não contabilizado no fluxo
            expect(result.Anual.fluxoLabels).not.toContain('Set');

            // Colaborador 'João' aparece nos dois períodos
            const joao = result.Anual.statusPorColaborador.find(c => c.nome === 'João');
            expect(joao.agendados).toBe(2);

            // Status desconhecido não quebra o processamento
            const maria = result.Anual.statusPorColaborador.find(c => c.nome === 'Maria');
            expect(maria).toBeDefined();
        });

        it('deve retornar total zero no período diário quando não há agendamentos hoje (branch total=0)', async () => {
            const yesterday = new Date(2026, 5, 14, 10, 0, 0);

            dashboardRepository.getSchedulesForDashboard.mockResolvedValue([
                { status: 'FINISHED', date_time: yesterday.toISOString(), collaborator: { name: 'João', cpf: '123' }, services: [] },
            ]);

            const result = await getDashboardDataService();

            expect(result.Diario.cards[0].valor).toBe('0');
            expect(result.Diario.fluxo.every(v => v === 0)).toBe(true);
        });
    });
});
