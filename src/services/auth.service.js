import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils.js';
import { findUserByEmailForAuth } from '../repository/auth.repository.js';
import { findUserByCpf, findUserByEmail } from '../repository/user.repository.js';
import { sanitizeData } from '../middlewares/utils.middleware.js';
import { validatePassword } from '../utils/validators.utils.js';
import prisma from '../../prisma/prisma.js';

/**
 * Registra um novo usuário e retorna o token JWT.
 * Realiza login automático após o cadastro.
 *
 * @param {object} userData - Dados crus vindos do req.body
 * @returns {{ token: string, user: object }}
 */
export const registerService = async (userData) => {
    const allowedFields = ['cpf', 'name', 'email', 'password'];
    const data = sanitizeData(allowedFields, userData);

    if (!data) throw new Error('Dados inválidos para cadastro.');

    // Sanitiza CPF (remove máscara)
    data.cpf = data.cpf.replace(/\D/g, '');
    if (data.cpf.length !== 11) throw new Error('CPF deve conter exatamente 11 dígitos.');

    // Valida requisitos mínimos de senha antes de qualquer consulta ao banco
    validatePassword(data.password);

    const cpfExists = await findUserByCpf(data.cpf);
    if (cpfExists) throw new Error('CPF já cadastrado no sistema.');

    const emailExists = await findUserByEmail(data.email);
    if (emailExists) throw new Error('E-mail já cadastrado no sistema.');

    data.password = await bcrypt.hash(data.password, 10);

    // Cria o usuário sem endereço/contato — podem ser adicionados depois via /users
    // Nota: o tipo padrão é "Cliente" (definido no schema Prisma com @default(Cliente))
    const newUser = await prisma.user.create({ data });

    const token = generateToken({ cpf: newUser.cpf, type: newUser.type });
    return { token, user: { cpf: newUser.cpf, name: newUser.name, type: newUser.type } };
};

/**
 * Autentica o usuário por e-mail e senha.
 * A mensagem de erro é propositalmente genérica para não revelar
 * qual campo está errado (boa prática de segurança).
 *
 * @param {string} email
 * @param {string} password - Senha em texto plano (será comparada com o hash)
 * @returns {{ token: string, user: object }}
 */
export const loginService = async (email, password) => {
    const user = await findUserByEmailForAuth(email);

    // Mensagem genérica: não revela se o e-mail não existe ou a senha está errada
    if (!user) throw new Error('Credenciais inválidas.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Credenciais inválidas.');

    const token = generateToken({ cpf: user.cpf, type: user.type });
    return { token, user: { cpf: user.cpf, name: user.name, type: user.type } };
};
