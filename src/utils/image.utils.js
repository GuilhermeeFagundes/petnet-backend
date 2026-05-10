
 /** Converte uma string Base64(pode conter o prefixo data: image /...) para um Buffer do Node.js
  */
export const base64ToBuffer = (base64String) => {
    if (!base64String) return null;

    // Remove o prefixo se existir (ex: data:image/png;base64,)
    const base64Data = base64String.replace(/^data:image\/[a-z+]+;base64,/, "");
    return Buffer.from(base64Data, "base64");
};

/**
 * Converte um Buffer do banco de dados para uma string Base64 (Data URI)
 */
export const bufferToBase64 = (buffer, mimeType = "image/png") => {
  if (!buffer) return null;
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

/**
 * Converte o picture_blob do banco para um campo legível na resposta da API.
 * Remove o campo original para não vazar dados binários.
 *
 * @param {object} entity - Objeto vindo do banco de dados
 * @param {string} [fieldName='picture'] - Nome do campo de saída (ex: 'petPicture')
 * @returns {object} Objeto com o campo de imagem convertido
 */
export const mapBlobToField = (entity, fieldName = 'picture') => {
  if (!entity) return entity;

  if (entity.picture_blob) {
    entity[fieldName] = bufferToBase64(entity.picture_blob);
    delete entity.picture_blob;
  }

  return entity;
};

/**
 * Converte o campo de imagem Base64 da requisição para picture_blob (Buffer).
 * Remove o campo original para não enviar dados desnecessários ao banco.
 *
 * @param {object} data - Dados da requisição
 * @param {string} [fieldName='picture'] - Nome do campo de entrada (ex: 'petPicture')
 * @returns {object} Objeto com picture_blob pronto para o banco
 */
export const mapFieldToBlob = (data, fieldName = 'picture') => {
  if (!data) return data;

  const { [fieldName]: pictureValue, ...rest } = data;

  return {
    ...rest,
    picture_blob: pictureValue ? base64ToBuffer(pictureValue) : undefined,
  };
};
