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
