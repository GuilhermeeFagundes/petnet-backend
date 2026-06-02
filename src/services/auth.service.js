import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils.js';
import { findUserByEmailForAuth } from '../repository/auth.repository.js';
import { findUserByCpf, findUserByEmail, createUser } from '../repository/user.repository.js';
import { sanitizeData } from '../utils/sanitize.utils.js';
import { validatePassword, cleanCpf } from '../utils/validators.utils.js';
import { ResponseError } from '../errors/ResponseError.js';
import { validateAndConvertEnums, translateEnums } from '../utils/enum.utils.js';
import { UserEnums } from '../enums/user.enums.js';
import { sendLog } from '../utils/log.utils.js';

/**
 * Registra um novo usuário e retorna o token JWT.
 * Realiza login automático após o cadastro.
 *
 * @param {object} fullData - Dados crus vindos do req.body
 * @returns {{ token: string, user: object }}
 */
export const registerService = async (fullData) => {
    const { contact, address, ...user } = fullData;

    const allowedUserFields = ["cpf", "email", "name", "password", "type"];
    const userData = sanitizeData(allowedUserFields, user);

    const allowedAddressFields = ["type", "cep", "locaticion", "neighborhood", "address", "number", "complement"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);

    if (!userData) throw new ResponseError('Dados inválidos para cadastro.');

    userData.cpf = cleanCpf(userData.cpf);

    validatePassword(userData.password);

    const cpfExists = await findUserByCpf(userData.cpf);
    if (cpfExists) throw new ResponseError('CPF já cadastrado no sistema.', 409);

    const emailExists = await findUserByEmail(userData.email);
    if (emailExists) throw new ResponseError('E-mail já cadastrado no sistema.', 409);

    validateAndConvertEnums(userData, UserEnums);

    userData.password = await bcrypt.hash(userData.password, 10);

    const newUser = await createUser(userData, addressData, contactData);
    await sendLog({ entity: 'auth', action: 'register', status: 'success', responsible: newUser.cpf });

    const returnUser = {
        cpf: newUser.cpf,
        name: newUser.name,
        type: newUser.type,
        email: newUser.email,
        address: addressData,
        contact: contactData,
    };

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

    if (!user) {
        await sendLog({ entity: 'auth', action: 'login', status: 'failed', details: 'Usuário não encontrado' });
        throw new ResponseError('Credenciais inválidas.', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        await sendLog({ entity: 'auth', action: 'login', status: 'failed', responsible: user.cpf, details: 'Senha incorreta' });
        throw new ResponseError('Credenciais inválidas.', 401);
    }


    const token = generateToken({ cpf: user.cpf, type: user.type });
    await sendLog({ entity: 'auth', action: 'login', status: 'success', responsible: user.cpf });
    return { token, user: translateEnums({ cpf: user.cpf, name: user.name, type: user.type }, UserEnums) };
};
