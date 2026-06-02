import { getSchedulesForDashboard } from '../repository/dashboard.repository.js';

export const getDashboardDataService = async () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Pega todos os agendamentos do ano para processamento em memoria
    const schedules = await getSchedulesForDashboard(startOfYear, now);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const filterByDate = (start, end) => schedules.filter(s => {
        const dt = new Date(s.date_time);
        return dt >= start && dt <= end;
    });

    const diarioSchedules = filterByDate(startOfToday, now);
    const mensalSchedules = filterByDate(startOfMonth, now);
    const anualSchedules = schedules;

    return {
        Diario: processPeriodData(diarioSchedules, 'diario'),
        Mensal: processPeriodData(mensalSchedules, 'mensal'),
        Anual: processPeriodData(anualSchedules, 'anual')
    };
};

const processPeriodData = (periodSchedules, type) => {
    const total = periodSchedules.length;

    const cancelados = periodSchedules.filter(s => s.status === 'CANCELED').length;
    const finalizados = periodSchedules.filter(s => s.status === 'FINISHED').length;
    const entregues = periodSchedules.filter(s => s.status === 'DELIVERED').length;

    const txCancelamento = total > 0 ? Math.round((cancelados / total) * 100) : 0;

    const cards = [
        { titulo: "Total Agendamentos", valor: total.toString(), detalhe: "no período", tipo: "azul" },
        { titulo: "Cancelamento", valor: cancelados.toString(), detalhe: "cancelados", tipo: "vermelho" },
        { titulo: "Finalizados", valor: finalizados.toString(), detalhe: "agendamentos", tipo: "verde" },
        { titulo: "Entregues", valor: entregues.toString(), detalhe: "pets enviados", tipo: "roxo" }
    ];

    const { fluxo, fluxoLabels } = getFluxo(periodSchedules, type);
    const { servicos, servicosLabels } = getTopServicos(periodSchedules);
    const statusPorColaborador = getStatusPorColaborador(periodSchedules);

    return {
        cards,
        fluxo,
        fluxoLabels,
        servicos,
        servicosLabels,
        statusPorColaborador
    };
};

const getFluxo = (schedules, type) => {
    let fluxoMap = {};
    let fluxoLabels = [];
    let fluxo = [];

    if (type === 'diario') {
        const hours = ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'];
        fluxoLabels = hours;
        hours.forEach(h => fluxoMap[h] = 0);
        
        schedules.forEach(s => {
            const h = new Date(s.date_time).getHours();
            const label = `${h.toString().padStart(2, '0')}h`;
            if (fluxoMap[label] !== undefined) {
                fluxoMap[label]++;
            }
        });
        fluxo = hours.map(h => fluxoMap[h]);
    } else if (type === 'mensal') {
        const now = new Date();
        const daysInMonth = now.getDate(); // up to current day
        for (let i = 1; i <= daysInMonth; i++) {
            const dayLabel = i.toString().padStart(2, '0');
            fluxoLabels.push(dayLabel);
            fluxoMap[dayLabel] = 0;
        }

        schedules.forEach(s => {
            const dt = new Date(s.date_time);
            const dayLabel = dt.getDate().toString().padStart(2, '0');
            if (fluxoMap[dayLabel] !== undefined) {
                fluxoMap[dayLabel]++;
            }
        });
        fluxo = fluxoLabels.map(l => fluxoMap[l]);
    } else if (type === 'anual') {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based
        for (let i = 0; i <= currentMonth; i++) {
            fluxoLabels.push(months[i]);
            fluxoMap[months[i]] = 0;
        }

        schedules.forEach(s => {
            const dt = new Date(s.date_time);
            const m = dt.getMonth();
            if (m <= currentMonth) {
                fluxoMap[months[m]]++;
            }
        });
        fluxo = fluxoLabels.map(l => fluxoMap[l]);
    }

    return { fluxo, fluxoLabels };
};

const getTopServicos = (schedules) => {
    const servicosCount = {};
    schedules.forEach(s => {
        if (s.services && s.services.length > 0) {
            s.services.forEach(srv => {
                servicosCount[srv.name] = (servicosCount[srv.name] || 0) + 1;
            });
        }
    });

    const sorted = Object.entries(servicosCount).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return {
        servicos: sorted.map(i => i[1]),
        servicosLabels: sorted.map(i => i[0])
    };
};

const getStatusPorColaborador = (schedules) => {
    const colabMap = {};

    schedules.forEach(s => {
        const c = s.collaborator;
        if (!c) return;

        const name = c.name;
        if (!colabMap[name]) {
            colabMap[name] = { name: name, SCHEDULED: 0, CONFIRMED: 0, CANCELED: 0, FINISHED: 0, DELIVERED: 0 };
        }
        if (colabMap[name][s.status] !== undefined) {
            colabMap[name][s.status]++;
        }
    });

    return Object.values(colabMap).map(c => ({
        nome: c.name,
        agendados: c.SCHEDULED,
        confirmados: c.CONFIRMED,
        cancelados: c.CANCELED,
        finalizados: c.FINISHED,
        entregues: c.DELIVERED
    }));
};
