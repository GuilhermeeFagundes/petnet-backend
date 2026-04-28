import { ResponseError } from "../errors/ResponseError.js";

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
