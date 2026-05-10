import { ResponseError } from "../errors/ResponseError.js";

/**
 * Valida se todos os campos obrigatórios estão presentes no objeto de dados.
 * Lança ResponseError 400 informando quais campos estão faltando.
 *
 * @param {object} data - Objeto com os dados recebidos (ex: req.body)
 * @param {string[]} fields - Lista de nomes dos campos obrigatórios
 * @throws {ResponseError} Se algum campo obrigatório estiver ausente
 */
export const requireFields = (data, fields) => {
    const missing = fields.filter(field => data[field] === undefined || data[field] === null || data[field] === '');

    if (missing.length > 0) {
        throw new ResponseError(
            `Campos obrigatórios faltando: ${missing.join(', ')}`,
            400
        );
    }
};

/**
 * Converte e valida um ID de rota (req.params) para número inteiro.
 * Lança ResponseError 400 se o valor não for um número válido.
 *
 * @param {string} value - Valor do parâmetro de rota
 * @param {string} [label='ID'] - Nome do campo para a mensagem de erro
 * @returns {number} Valor convertido para inteiro
 * @throws {ResponseError} Se o valor não for numérico
 */
export const parseId = (value, label = 'ID') => {
    const id = Number(value);

    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new ResponseError(`${label} inválido: '${value}'`, 400);
    }

    return id;
};

/**
 * Limpa um CPF removendo caracteres não numéricos e valida o comprimento.
 * Lança ResponseError 400 se não tiver 11 dígitos.
 *
 * @param {string} cpf - CPF com ou sem máscara
 * @returns {string} CPF limpo (apenas dígitos)
 * @throws {ResponseError} Se o CPF não tiver 11 dígitos
 */
export const cleanCpf = (cpf) => {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) {
        throw new ResponseError("CPF deve conter exatamente 11 dígitos", 400);
    }

    return digits;
};

/**
 * Valida se a senha atende aos requisitos mínimos de segurança:
 * - Mínimo de 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 *
 * @param {string} password - Senha em texto plano
 * @throws {ResponseError} Se a senha não atender algum requisito
 */
export const validatePassword = (password) => {
    if (!password || password.length < 8) {
        throw new ResponseError('A senha deve ter no mínimo 8 caracteres.', 400);
    }
    if (!/[A-Z]/.test(password)) {
        throw new ResponseError('A senha deve conter pelo menos 1 letra maiúscula.', 400);
    }
    if (!/[a-z]/.test(password)) {
        throw new ResponseError('A senha deve conter pelo menos 1 letra minúscula.', 400);
    }
    if (!/[0-9]/.test(password)) {
        throw new ResponseError('A senha deve conter pelo menos 1 número.', 400);
    }
};
