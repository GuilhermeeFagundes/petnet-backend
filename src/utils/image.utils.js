const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

import { ResponseError } from '../errors/ResponseError.js';

/**
 * Converte uma string Base64 (com ou sem prefixo data:image/...) para um Buffer do Node.js.
 * Valida o tipo MIME (apenas jpeg, png, webp, gif) e o tamanho máximo (5MB).
 * Rejeita SVG para prevenir XSS via imagens vetoriais com JavaScript embutido.
 *
 * @param {string} base64String - String Base64 da imagem
 * @returns {Buffer|null} Buffer pronto para armazenamento ou null se ausente
 * @throws {ResponseError} Se o tipo MIME ou tamanho for inválido
 */
export const base64ToBuffer = (base64String) => {
    if (!base64String) return null;

    // Extrair tipo MIME e validar contra a allowlist
    const match = base64String.match(/^data:(image\/[a-z+]+);base64,/);
    if (!match || !ALLOWED_MIME_TYPES.includes(match[1])) {
        throw new ResponseError(
            'Tipo de imagem não suportado. Use JPEG, PNG, WebP ou GIF.',
            400
        );
    }

    const base64Data = base64String.replace(/^data:image\/[a-z+]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
        throw new ResponseError('Imagem muito grande. Limite máximo de 5MB.', 413);
    }

    return buffer;
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
