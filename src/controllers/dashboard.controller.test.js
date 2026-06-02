import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getDashboardController } from './dashboard.controller.js';
import * as dashboardService from '../services/dashboard.service.js';

describe('Dashboard Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.spyOn(dashboardService, 'getDashboardDataService').mockResolvedValue({ Diario: {}, Mensal: {}, Anual: {} });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve retornar 200 e os dados do dashboard', async () => {
        await getDashboardController(mockReq, mockRes);
        expect(dashboardService.getDashboardDataService).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ Diario: {}, Mensal: {}, Anual: {} });
    });
});
