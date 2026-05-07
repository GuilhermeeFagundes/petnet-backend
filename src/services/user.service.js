import bcrypt from 'bcrypt';
import { base64ToBuffer, bufferToBase64 } from "../utils/image.utils.js";
import { sanitizeData } from "../middlewares/utils.middleware.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums, translateEnums } from "../utils/enum.utils.js";
import { UserEnums } from "../enums/user.enums.js";
import {
    listUsers,
    findUserByCpf,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    reactivateUser
} from '../repository/user.repository.js';

// --- USUÁRIOS ---

export const listUsersService = async () => {
    const users = await listUsers();
    return users.map(user => {
        if (user.picture_blob) {
            user.userPicture = bufferToBase64(user.picture_blob);
            delete user.picture_blob;
        }
        return translateEnums(user, UserEnums);
    });
}

export const showUserService = async (userCPF) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new ResponseError("CPF deve conter exatamente 11 dígitos", 400);
    }
    const user = await findUserByCpf(cleanCpf);

    if (!user) {
        throw new ResponseError("Usuário não encontrado.", 404);
    }

    if (user.picture_blob) {
        user.userPicture = bufferToBase64(user.picture_blob);
        delete user.picture_blob;
    }

    return translateEnums(user, UserEnums);
}

export const createUserService = async (fullData) => {

    const { contact, address, userPicture, ...user } = fullData;

    const userWithPicture = {
        ...user,
        picture_blob: userPicture ? base64ToBuffer(userPicture) : undefined
    };

    const allowedUserFields = ["cpf", "email", "name", "password", "type", "picture_blob"];
    const userData = sanitizeData(allowedUserFields, userWithPicture);

    const allowedAddressFields = ["type", "cep", "locaticion", "neighborhood", "address", "number", "complement"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);


    const cleanCpf = userData.cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new ResponseError("CPF deve conter exatamente 11 dígitos", 400);
    }

    const userExists = await findUserByCpf(cleanCpf);
    if (userExists) {
        throw new ResponseError("CPF já cadastrado no sistema.", 409);
    }

    const emailExists = await findUserByEmail(userData.email);
    if (emailExists) {
        throw new ResponseError("E-mail já cadastrado no sistema.", 409);
    }

    // Validação e Conversão de Enum
    validateAndConvertEnums(userData, UserEnums);

    // Hash da senha
    userData.password = await bcrypt.hash(userData.password, 10);

    const newUser = await createUser(userData, addressData, contactData);
    return translateEnums(newUser, UserEnums);
}

export const updateUserService = async (userCPF, fullData) => {
    const { contact, address, userPicture, ...user } = fullData;

    const userWithPicture = {
        ...user,
        picture_blob: userPicture ? base64ToBuffer(userPicture) : undefined
    };

    const allowedUserFields = ["email", "name", "password", "type", "picture_blob"];
    const userData = sanitizeData(allowedUserFields, userWithPicture);

    const allowedAddressFields = ["type", "cep", "locaticion", "neighborhood", "address", "number", "complement"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);

    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new ResponseError("CPF deve conter exatamente 11 dígitos", 400);
    }

    if (!userData) {
        throw new ResponseError("Estrutura de dados inválida para atualização.", 400);
    }

    // Validação e Conversão de Enum
    validateAndConvertEnums(userData, UserEnums);

    const userExists = await findUserByCpf(cleanCpf);
    if (!userExists) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    // Valida se o novo e-mail já não pertence a outra pessoa
    if (userData.email && userData.email !== userExists.email) {
        const emailTaken = await findUserByEmail(userData.email);
        if (emailTaken) {
            throw new ResponseError("Este novo e-mail já está em uso.", 409);
        }
    }

    // Se houver atualização de senha, refazer o hash
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await updateUser(cleanCpf, userData, addressData, contactData);
    return translateEnums(updatedUser, UserEnums);
}

export const deleteUserService = async (userCPF) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    return await deleteUser(cleanCpf);
}

export const reactivateUserService = async (userCPF) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    return await reactivateUser(cleanCpf);
}
