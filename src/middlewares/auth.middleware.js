import { verifyToken } from '../utils/jwt.utils.js';
import { isAdmin, isSelf, isCollaboratorOrAdmin } from '../utils/auth.utils.js';
import { findPetOwner } from '../repository/pet.repository.js';

/**
 * Middleware base: verifica se o token JWT no cookie é válido.
 * Injeta `req.user = { cpf, type }` para uso nos middlewares e controllers seguintes.
 * Deve ser usado como base para todos os outros middlewares de autorização.
 */
export const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Faça login.' });
    }

    try {
        req.user = verifyToken(token); // { cpf, type, iat, exp }
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};

/**
 * Apenas Gerente (admin) pode acessar a rota.
 */
export const ensureAdmin = [
    ensureAuthenticated,
    (req, res, next) => {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: 'Acesso restrito a administradores.' });
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
            return res.status(403).json({ error: 'Sem permissão para acessar este recurso.' });
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
            return res.status(403).json({ error: 'Acesso restrito a colaboradores.' });
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
            return res.status(404).json({ error: 'Pet não encontrado.' });
        }

        if (pet.user_cpf !== req.user.cpf) {
            return res.status(403).json({ error: 'Sem permissão para acessar este pet.' });
        }

        next();
    },
];
