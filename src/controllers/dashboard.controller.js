import { getDashboardDataService } from '../services/dashboard.service.js';

export const getDashboardController = async (req, res) => {
    const dashboardData = await getDashboardDataService();
    return res.status(200).json(dashboardData);
};
