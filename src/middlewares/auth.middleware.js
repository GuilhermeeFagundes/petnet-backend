import { verifyToken } from '../utils/jwt.utils.js';
import { isAdmin, isSelf, isCollaboratorOrAdmin } from '../utils/auth.utils.js';
import { findPetOwner } from '../repository/pet.repository.js';
import { ResponseError } from '../errors/ResponseError.js';

/**
 * Middleware base: verifica se o token JWT no cookie é válido.
 * Injeta `req.user = { cpf, type }` para uso nos middlewares e controllers seguintes.
 * Deve ser usado como base para todos os outros middlewares de autorização.
 */
export const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new ResponseError('Acesso negado. Faça login.', 401);
    }

    try {
        req.user = verifyToken(token); // { cpf, type, iat, exp }
        next();
    } catch {
        throw new ResponseError('Token inválido ou expirado.', 401);
    }
};

/**
 * Apenas Gerente (admin) pode acessar a rota.
 */
export const ensureAdmin = [
    ensureAuthenticated,
    (req, res, next) => {
        if (!isAdmin(req.user)) {
            throw new ResponseError('Acesso restrito a administradores.', 403);
        }
        next();
    },
];

/**
 * Gerente pode acessar qualquer recurso.
 * Outros usuários só acessam o próprio recurso (CPF da rota === CPF do token).
 */
export const ensureAdminOrSelf = [
    ensureAuthenticated,
    (req, res, next) => {
        if (!isAdmin(req.user) && !isSelf(req.user, req.params.user_cpf)) {
            throw new ResponseError('Sem permissão para acessar este recurso.', 403);
        }
        next();
    },
];

/**
 * Apenas Colaborador ou Gerente podem acessar a rota.
 */
export const ensureCollaborator = [
    ensureAuthenticated,
    (req, res, next) => {
        if (!isCollaboratorOrAdmin(req.user)) {
            throw new ResponseError('Acesso restrito a colaboradores.', 403);
        }
        next();
    },
];

/**
 * Gerente acessa qualquer pet.
 * Outros usuários só acessam pets que lhes pertencem.
 * Faz uma query leve (select user_cpf) para verificar o dono sem expor dados extras.
 * Requer que a rota tenha o parâmetro :id (id do pet).
 */
export const ensureAdminOrPetOwner = [
    ensureAuthenticated,
    async (req, res, next) => {
        // Admin passa direto — sem custo de I/O
        if (isAdmin(req.user)) return next();

        const pet = await findPetOwner(req.params.id);

        if (!pet) {
            throw new ResponseError('Pet não encontrado.', 404);
        }

        if (pet.user_cpf !== req.user.cpf) {
            throw new ResponseError('Sem permissão para acessar este pet.', 403);
        }

        next();
    },
];
