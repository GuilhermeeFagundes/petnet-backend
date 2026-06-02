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

            // 1 cancelado de 3 = 33% (Wait, user changed it to use flat number of cancelled in their diff)
            // User modified processPeriodData in their commit to:
            // { titulo: "Cancelamento", valor: cancelados.toString(), detalhe: "cancelados", tipo: "vermelho" },
            expect(result.Diario.cards[1].titulo).toBe('Cancelamento');
            expect(result.Diario.cards[1].valor).toBe('1');

            expect(result.Diario.cards[2].titulo).toBe('Finalizados');
            expect(result.Diario.cards[2].valor).toBe('1');

            expect(result.Diario.statusPorColaborador.length).toBe(2);
            
            // Validate fluxo
            const idx10h = result.Diario.fluxoLabels.indexOf('10h');
            const idx14h = result.Diario.fluxoLabels.indexOf('14h');
            expect(result.Diario.fluxo[idx10h]).toBe(2);
            expect(result.Diario.fluxo[idx14h]).toBe(1);
        });
    });
});
