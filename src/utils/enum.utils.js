import { ResponseError } from "../errors/ResponseError.js";

/**
 * Valida e converte um valor para o valor canônico do enum.
 * Suporta busca por chave, valor ou tradução (case-insensitive).
 */
export const validateEnum = (metadata, value) => {
  if (value === undefined || value === null) return value;

  if (!metadata || !metadata.values) {
    throw new Error(`Objeto de metadados inválido fornecido para validação.`);
  }

  const input = String(value).trim().toLowerCase();
  const canonicalValues = Object.values(metadata.values);
  const keys = Object.keys(metadata.values);

  let foundValue = canonicalValues.find(v => String(v).toLowerCase() === input);

  if (!foundValue) {
    const foundKey = keys.find(k => k.toLowerCase() === input);
    if (foundKey) foundValue = metadata.values[foundKey];
  }

  if (!foundValue && metadata.translations) {
    const translationEntry = Object.entries(metadata.translations).find(
      ([canonical, label]) => String(label).toLowerCase() === input
    );
    if (translationEntry) foundValue = translationEntry[0];
  }

  if (!foundValue) {
    const fieldLabel = metadata.label;
    const allowedOptions = canonicalValues
      .map(v => `${v} (${metadata.translations[v] || v})`)
      .join(', ');

    throw new ResponseError(
      `Valor '${value}' inválido para o campo '${fieldLabel}'. Opções permitidas: ${allowedOptions}.`,
      400
    );
  }

  return foundValue;
};

/**
 * Valida e converte múltiplos enums em um objeto.
 * Agora aceita um array de metadados que já possuem a propriedade 'key'.
 * 
 * @param {object} data - Objeto contendo os dados (ex: req.body)
 * @param {Array<object>} metadatas - Array de metadados do enum (ex: PetEnums)
 */
export const validateAndConvertEnums = (data, metadatas) => {
  if (!data || !Array.isArray(metadatas)) return data;

  metadatas.forEach((meta) => {
    const key = meta.key;
    if (data[key] !== undefined) {
      data[key] = validateEnum(meta, data[key]);
    }
  });

  return data;
};

/**
 * Traduz os valores de enum de um objeto ou array de objetos.
 * Agora aceita um array de metadados que já possuem a propriedade 'key'.
 * 
 * @param {object|Array} data - Dados vindos do banco
 * @param {Array<object>} metadatas - Array de metadados do enum (ex: PetEnums)
 */
export const translateEnums = (data, metadatas) => {
  if (!data || !Array.isArray(metadatas)) return data;

  const translateObject = (obj) => {
    const newObj = { ...obj };
    metadatas.forEach((meta) => {
      const key = meta.key;
      const rawValue = newObj[key];
      if (rawValue !== undefined && rawValue !== null && meta.translations) {
        const translation = meta.translations[rawValue];
        if (translation) {
          newObj[`${key}_code`] = rawValue;
          newObj[key] = translation;
        }
      }
    });
    return newObj;
  };

  return Array.isArray(data) ? data.map(translateObject) : translateObject(data);
};
