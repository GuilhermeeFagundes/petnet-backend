/**
 * Verifica se o usuário logado é Gerente (administrador).
 * @param {{ type: string }} user - req.user injetado pelo ensureAuthenticated
 */
export const isAdmin = (user) => user.type === 'Gerente';

/**
 * Verifica se o usuário logado é o dono do recurso (mesmo CPF da rota).
 * @param {{ cpf: string }} user - req.user injetado pelo ensureAuthenticated
 * @param {string} paramCpf - req.params.user_cpf da rota
 */
export const isSelf = (user, paramCpf) => user.cpf === paramCpf;

/**
 * Verifica se o usuário logado é Colaborador ou Gerente.
 * @param {{ type: string }} user - req.user injetado pelo ensureAuthenticated
 */
export const isCollaboratorOrAdmin = (user) =>
    ['Colaborador', 'Gerente'].includes(user.type);
