/**
 * Filtra um objeto mantendo apenas os campos permitidos.
 * Remove propriedades undefined e null para evitar sobrescritas acidentais.
 *
 * @param {string[]} allowedFields - Lista de campos permitidos
 * @param {object} data - Objeto com os dados a filtrar
 * @returns {object|null} Objeto filtrado ou null se nenhum campo válido
 */
export const sanitizeData = (allowedFields, data) => {
  if (!data) return null;

  const cleanedData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      cleanedData[field] = data[field];
    }
  });

  return Object.keys(cleanedData).length === 0 ? null : cleanedData;
};
