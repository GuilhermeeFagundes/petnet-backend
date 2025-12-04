export const sanitizeData = (allowedFields, data) => {
  // ADICIONE ISTO: Se data não existir, retorna null imediatamente
  if (!data) return null;

  const cleanedData = {};

  allowedFields.forEach(field => {
    // Verifica se a propriedade existe dentro do objeto data
    if (data[field] !== undefined && data[field] !== null) {
      cleanedData[field] = data[field];
    }
  });

  return Object.keys(cleanedData).length === 0 ? null : cleanedData;
};