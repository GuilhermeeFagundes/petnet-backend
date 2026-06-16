import bcrypt from 'bcrypt';
import { mapBlobToField, mapFieldToBlob } from "../utils/image.utils.js";
import { sanitizeData, sanitizeDataList } from "../utils/sanitize.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums, translateEnums } from "../utils/enum.utils.js";
import { cleanCpf, validatePassword, requireFields } from "../utils/validators.utils.js";
import { UserEnums } from "../enums/user.enums.js";
import {
    listUsers,
    findUserByCpf,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    reactivateUser,
    clearUserPicture
} from '../repository/user.repository.js';

import { sendLog } from "../utils/log.utils.js";

const ALLOWED_USER_FIELDS = ["cpf", "email", "name", "password", "type", "picture_blob"];
const ALLOWED_ADDRESS_FIELDS = ["type", "cep", "locaticion", "neighborhood", "address", "number", "complement"];
const ALLOWED_CONTACT_FIELDS = ["number", "name"];

// Campos obrigatórios por item ao sincronizar arrays de address/contact na atualização.
// "type" e "name" funcionam como chave única por usuário (find-or-update-or-create).
const REQUIRED_ADDRESS_FIELDS = ["type", "cep", "locaticion", "neighborhood", "address", "number"];
const REQUIRED_CONTACT_FIELDS = ["name"];

// Garante que cada item do array tenha os campos mínimos para identificar e persistir o registro.
const requireFieldsInEach = (items, fields) => {
    items?.forEach(item => requireFields(item, fields));
};

export const listUsersService = async () => {
    const users = await listUsers();
    return users.map(user => {
        mapBlobToField(user, 'userPicture');
        return translateEnums(user, UserEnums);
    });
};

export const showUserService = async (userCPF) => {
    const cpf = cleanCpf(userCPF);
    const user = await findUserByCpf(cpf);

    if (!user) {
        throw new ResponseError("Usuário não encontrado.", 404);
    }

    mapBlobToField(user, 'userPicture');
    return translateEnums(user, UserEnums);
};

export const createUserService = async (fullData) => {
    const { contact, address, userPicture, ...user } = fullData;

    const userWithPicture = mapFieldToBlob({ ...user, userPicture }, 'userPicture');

    const userData = sanitizeData(ALLOWED_USER_FIELDS, userWithPicture);
    const addressData = sanitizeData(ALLOWED_ADDRESS_FIELDS, address);
    const contactData = sanitizeData(ALLOWED_CONTACT_FIELDS, contact);

    userData.cpf = cleanCpf(userData.cpf);

    const userExists = await findUserByCpf(userData.cpf);
    if (userExists) {
        throw new ResponseError("CPF já cadastrado no sistema.", 409);
    }

    const emailExists = await findUserByEmail(userData.email);
    if (emailExists) {
        throw new ResponseError("E-mail já cadastrado no sistema.", 409);
    }

    validateAndConvertEnums(userData, UserEnums);

    userData.password = await bcrypt.hash(userData.password, 10);

    const newUser = await createUser(userData, addressData, contactData);
    await sendLog({ entity: 'user', action: 'create', status: 'success', responsible: newUser.cpf });
    return translateEnums(newUser, UserEnums);
};

export const updateUserService = async (userCPF, fullData) => {
    const { contact, address, userPicture, ...user } = fullData;

    const userWithPicture = mapFieldToBlob({ ...user, userPicture }, 'userPicture');

    const userData = sanitizeData(["email", "name", "password", "type", "picture_blob"], userWithPicture);
    const addressData = sanitizeDataList(ALLOWED_ADDRESS_FIELDS, address);
    const contactData = sanitizeDataList(ALLOWED_CONTACT_FIELDS, contact);

    const cpf = cleanCpf(userCPF);

    if (!userData) {
        throw new ResponseError("Estrutura de dados inválida para atualização.", 400);
    }

    requireFieldsInEach(addressData, REQUIRED_ADDRESS_FIELDS);
    requireFieldsInEach(contactData, REQUIRED_CONTACT_FIELDS);

    validateAndConvertEnums(userData, UserEnums);

    const userExists = await findUserByCpf(cpf);
    if (!userExists) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    // Impede atualização de usuário excluído logicamente
    if (userExists.excluded_at) {
        throw new ResponseError("Usuário inativo. Reative-o antes de atualizar.", 409);
    }

    if (userData.email && userData.email !== userExists.email) {
        const emailTaken = await findUserByEmail(userData.email);
        if (emailTaken) {
            throw new ResponseError("Este novo e-mail já está em uso.", 409);
        }
    }

    if (userData.password) {
        validatePassword(userData.password); // Garante política de senha também na atualização
        userData.password = await bcrypt.hash(userData.password, 10);
    }


    const updatedUser = await updateUser(cpf, userData, addressData, contactData);
    await sendLog({ entity: 'user', action: 'update', status: 'success', responsible: cpf });
    return translateEnums(updatedUser, UserEnums);
};

export const deleteUserService = async (userCPF) => {
    const cpf = cleanCpf(userCPF);

    const user = await findUserByCpf(cpf);
    if (!user) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    const result = await deleteUser(cpf);
    await sendLog({ entity: 'user', action: 'delete', status: 'success', responsible: cpf });
    return result;
};

export const reactivateUserService = async (userCPF) => {
    const cpf = cleanCpf(userCPF);

    const user = await findUserByCpf(cpf);
    if (!user) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    return await reactivateUser(cpf);
};

export const clearUserPictureService = async (userCPF) => {
    const cpf = cleanCpf(userCPF);

    const user = await findUserByCpf(cpf);
    if (!user) {
        throw new ResponseError("Usuário não cadastrado no sistema.", 404);
    }

    await clearUserPicture(cpf);
    await sendLog({ entity: 'user', action: 'clear_picture', status: 'success', responsible: cpf });
};
