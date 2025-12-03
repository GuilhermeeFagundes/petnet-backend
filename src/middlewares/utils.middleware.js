export const sanitizeData = (allowedFields, data) => {
  const cleanedData = {};

  allowedFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      cleanedData[field] = data[field];
    }
  });

  // Retorna null se nenhum campo válido foi encontrado
  return Object.keys(cleanedData).length === 0 ? null : cleanedData;
};