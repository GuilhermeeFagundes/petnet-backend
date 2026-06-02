import jwt from 'jsonwebtoken';

/**
 * Gera um token JWT com o payload fornecido.
 * As configurações de segredo e expiração vêm do .env (JWT_SECRET, JWT_EXPIRES_IN).
 * O algoritmo é fixado em HS256 para prevenir algorithm confusion attacks.
 *
 * @param {{ cpf: string, type: string }} payload - Dados do usuário embutidos no token
 * @returns {string} Token JWT assinado
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

/**
 * Verifica e decodifica um token JWT.
 * Aceita exclusivamente o algoritmo HS256 — rejeita 'none', RS256 e outros.
 * Lança um erro (JsonWebTokenError / TokenExpiredError) se inválido ou expirado.
 *
 * @param {string} token - Token JWT vindo do cookie
 * @returns {{ cpf: string, type: string, iat: number, exp: number }} Payload decodificado
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
};
