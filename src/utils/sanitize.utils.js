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

/**
 * Aplica sanitizeData a cada item de um array, descartando os itens que
 * ficarem vazios após a filtragem. Usado quando uma lista inteira de
 * sub-itens (ex: address/contact) é recebida e precisa ser sincronizada.
 *
 * @param {string[]} allowedFields - Lista de campos permitidos
 * @param {object[]} dataList - Array de objetos com os dados a filtrar
 * @returns {object[]|null} Array filtrado ou null se vazio/sem itens válidos
 */
export const sanitizeDataList = (allowedFields, dataList) => {
  if (!dataList) return null;

  const cleanedItems = dataList
    .map(item => sanitizeData(allowedFields, item))
    .filter(item => item !== null);

  return cleanedItems.length === 0 ? null : cleanedItems;
};
