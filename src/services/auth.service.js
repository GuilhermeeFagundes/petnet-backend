import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils.js';
import { findUserByEmailForAuth } from '../repository/auth.repository.js';
import { findUserByCpf, findUserByEmail, createUser } from '../repository/user.repository.js';
import { sanitizeData } from '../middlewares/utils.middleware.js';
import { validatePassword } from '../utils/validators.utils.js';
import { ResponseError } from '../errors/ResponseError.js';
import { validateAndConvertEnums, translateEnums } from '../utils/enum.utils.js';
import { UserEnums } from '../enums/user.enums.js';

/**
 * Registra um novo usuário e retorna o token JWT.
 * Realiza login automático após o cadastro.
 *
 * @param {object} userData - Dados crus vindos do req.body
 * @returns {{ token: string, user: object }}
 */
export const registerService = async (fullData) => {
    //TODO: Receber todo o body
    const { contact, address, ...user } = fullData;

    const allowedUserFields = ["cpf", "email", "name", "password", "type"];
    const userData = sanitizeData(allowedUserFields, user);

    const allowedAddressFields = ["cep", "complement", "location", "type"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);


    if (!user) throw new ResponseError('Dados inválidos para cadastro.');

    // Sanitiza CPF (remove máscara)
    userData.cpf = userData.cpf.replace(/\D/g, '');
    if (userData.cpf.length !== 11) throw new ResponseError('CPF deve conter exatamente 11 dígitos.');

    // Valida requisitos mínimos de senha antes de qualquer consulta ao banco
    validatePassword(userData.password);

    const cpfExists = await findUserByCpf(userData.cpf);
    if (cpfExists) throw new ResponseError('CPF já cadastrado no sistema.', 409);

    const emailExists = await findUserByEmail(userData.email);
    if (emailExists) throw new ResponseError('E-mail já cadastrado no sistema.', 409);

    // Validação e Conversão de Enum
    validateAndConvertEnums(userData, UserEnums);

    userData.password = await bcrypt.hash(userData.password, 10);

    // Cria o usuário sem endereço/contato — podem ser adicionados depois via /users
    // Nota: o tipo padrão é "Cliente" (definido no schema Prisma com @default(Cliente))
    const newUser = await createUser(userData, addressData, contactData);

    const returnUser = {
        cpf: newUser.cpf,
        name: newUser.name,
        type: newUser.type,
        email: newUser.email,
        address: addressData,
        contact: contactData
    }

    const token = generateToken({ cpf: newUser.cpf, type: newUser.type });
    return { token, user: translateEnums(returnUser, UserEnums) };
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
    if (!user) throw new ResponseError('Credenciais inválidas.', 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new ResponseError('Credenciais inválidas.', 401);

    const token = generateToken({ cpf: user.cpf, type: user.type });
    return { token, user: translateEnums({ cpf: user.cpf, name: user.name, type: user.type }, UserEnums) };
};
