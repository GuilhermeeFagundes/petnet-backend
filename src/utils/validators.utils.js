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
 * Limpa um CPF removendo caracteres não numéricos, valida comprimento e
 * verifica os dígitos verificadores pelo algoritmo mod-11.
 * Lança ResponseError 400 se o CPF for inválido.
 *
 * @param {string} cpf - CPF com ou sem máscara
 * @returns {string} CPF limpo (apenas dígitos)
 * @throws {ResponseError} Se o CPF for inválido
 */
export const cleanCpf = (cpf) => {
    const digits = cpf.replace(/\D/g, '');

    if (digits.length !== 11) {
        throw new ResponseError("CPF deve conter exatamente 11 dígitos", 400);
    }

    // Rejeita sequências repetidas conhecidas (ex: 000.000.000-00, 111.111.111-11)
    if (/^(\d)\1{10}$/.test(digits)) {
        throw new ResponseError("CPF inválido.", 400);
    }

    // Valida os dois dígitos verificadores pelo algoritmo mod-11
    const calcDigit = (cpfStr, length) => {
        let sum = 0;
        for (let i = 0; i < length; i++) {
            sum += parseInt(cpfStr[i]) * (length + 1 - i);
        }
        const rem = (sum * 10) % 11;
        return rem === 10 || rem === 11 ? 0 : rem;
    };

    if (
        calcDigit(digits, 9) !== parseInt(digits[9]) ||
        calcDigit(digits, 10) !== parseInt(digits[10])
    ) {
        throw new ResponseError("CPF inválido.", 400);
    }

    return digits;
};

/**
 * Valida o formato de um endereço de e-mail.
 * Lança ResponseError 400 se o formato for inválido.
 *
 * @param {string} email - E-mail a ser validado
 * @throws {ResponseError} Se o e-mail não tiver formato válido
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        throw new ResponseError('Formato de e-mail inválido.', 400);
    }
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
