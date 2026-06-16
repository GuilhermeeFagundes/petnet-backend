/**
 * Converte um campo específico de um objeto para o tipo Date se for uma string.
 * @param {object} data - Objeto contendo os dados.
 * @param {string} field - Nome do campo a ser convertido.
 * @returns {object} O objeto original com o campo convertido.
 */
export const parseDateField = (data, field) => {
  if (data[field] && typeof data[field] === 'string') {
    data[field] = new Date(data[field]);
  }
  return data;
};

/**
 * Garante que um valor seja um objeto Date.
 * @param {any} value - Valor a ser convertido.
 * @returns {Date} Objeto Date.
 */
export const ensureDate = (value) => {
  return value instanceof Date ? value : new Date(value);
};

const BRT_OFFSET_MS = 3 * 60 * 60 * 1000;

/**
 * Calcula o intervalo usado para buscar agendamentos a lembrar: do momento
 * em que a função é chamada até o fim do dia de amanhã em horário de
 * Brasília (UTC-3). O Brasil não adota mais horário de verão, então o
 * offset fixo é seguro.
 * @returns {{ start: Date, end: Date }} `start` é o instante atual; `end` é o instante UTC equivalente a 23:59:59.999 de amanhã em Brasília.
 */
export const getReminderDateRange = () => {
  const start = new Date();

  const brtNow = new Date(start.getTime() - BRT_OFFSET_MS);
  const tomorrowBrtMidnight = new Date(Date.UTC(
    brtNow.getUTCFullYear(), brtNow.getUTCMonth(), brtNow.getUTCDate() + 1
  ));
  const startOfTomorrow = new Date(tomorrowBrtMidnight.getTime() + BRT_OFFSET_MS);
  const end = new Date(startOfTomorrow.getTime() + 24 * 60 * 60 * 1000 - 1);

  return { start, end };
};
