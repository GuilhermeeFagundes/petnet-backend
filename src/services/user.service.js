import bcrypt from 'bcrypt';
import { sanitizeData } from "../middlewares/utils.middleware.js";
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
    return await listUsers();
}

export const showUserService = async (userCPF) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }
    return await findUserByCpf(cleanCpf);
}

export const createUserService = async (fullData) => {

    const { contact, address, ...user } = fullData;

    const allowedUserFields = ["cpf", "email", "name", "password", "type", "picture_url"];
    const userData = sanitizeData(allowedUserFields, user);

    const allowedAddressFields = ["cep", "complement", "location", "type"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);


    const cleanCpf = userData.cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const userExists = await findUserByCpf(cleanCpf);
    if (userExists) {
        throw new Error("CPF já cadastrado no sistema.");
    }

    const emailExists = await findUserByEmail(userData.email);
    if (emailExists) {
        throw new Error("E-mail já cadastrado no sistema.");
    }

    // Hash da senha
    userData.password = await bcrypt.hash(userData.password, 10);

    return await createUser(userData, addressData, contactData);
}

export const updateUserService = async (userCPF, fullData) => {
    const { contact, address, ...user } = fullData;

    const allowedUserFields = ["email", "name", "password", "type", "picture_url"];
    const userData = sanitizeData(allowedUserFields, user);

    const allowedAddressFields = ["cep", "complement", "location", "type"];
    const addressData = sanitizeData(allowedAddressFields, address);

    const allowedContactFields = ["number", "name"];
    const contactData = sanitizeData(allowedContactFields, contact);

    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    if (!userData) {
        throw new Error("Estrutura de dados inválida para atualização.");
    }

    const userExists = await findUserByCpf(cleanCpf);
    if (!userExists) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    // Valida se o novo e-mail já não pertence a outra pessoa
    if (userData.email && userData.email !== userExists.email) {
        const emailTaken = await findUserByEmail(userData.email);
        if (emailTaken) {
            throw new Error("Este novo e-mail já está em uso.");
        }
    }

    // Se houver atualização de senha, refazer o hash
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await updateUser(cleanCpf, userData, addressData, contactData);
}

export const deleteUserService = async (userCPF) => {
    // CORREÇÃO: Declarar cleanCpf antes de usar
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    return await deleteUser(cleanCpf);
}

export const reactivateUserService = async (userCPF) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    return await reactivateUser(cleanCpf);
}

// Esta comentado pois futuramente será implementado
// --- ENDEREÇOS ---

// export const createAddressService = async (userCPF, addressData) => {
//     const cleanCpf = userCPF.replace(/\D/g, '');

//     if (cleanCpf.length !== 11) {
//         throw new Error("CPF deve conter exatamente 11 dígitos");
//     }

//     // Ajuste os campos conforme seu banco de dados (ex: logradouro, numero, etc)
//     const allowedFields = ["type", "cep", "street", "number", "neighborhood", "city", "state", "complement"];
//     const createData = sanitizeData(allowedFields, addressData);

//     const findUser = await findUserByCpf(cleanCpf);
//     if (!findUser) {
//         throw new Error("CPF não existe!");
//     }

//     // Sanitização de CEP (Remove traço)
//     if (createData.cep) {
//         createData.cep = createData.cep.replace(/\D/g, '');
//     }

//     return await createAddress(cleanCpf, createData);
// }

// export const updateAddressService = async (userCPF, addressId, addressData) => {
//     const cleanCpf = userCPF.replace(/\D/g, '');

//     const findUser = await findUserByCpf(cleanCpf);
//     if (!findUser) {
//         throw new Error("CPF não existe!");
//     }

//     const allowedFields = ["type", "cep", "street", "number", "neighborhood", "city", "state", "complement"];
//     const updateData = sanitizeData(allowedFields, addressData);

//     if (!updateData) {
//         throw new Error("Nenhum dado válido para atualização.");
//     }

//     // Sanitização de CEP
//     if (updateData.cep) {
//         updateData.cep = updateData.cep.replace(/\D/g, '');
//     }

//     const result = await updateAddress(cleanCpf, addressId, updateData);

//     if (result.count === 0) {
//         throw new Error("Endereço não encontrado ou não pertence a este usuário.");
//     }

//     return result;
// }

// export const removeAddressService = async (userCPF, addressId) => {
//     // Verifica se o usuário existe (Opcional, mas boa prática)
//     const cleanCpf = userCPF.replace(/\D/g, '');
//     const user = await findUserByCpf(cleanCpf);
//     if (!user) throw new Error("Usuário não encontrado.");

//     // Nota: O ideal seria verificar se o endereço pertence ao usuário antes de deletar,
//     // mas o removeAddress do repo atual deleta direto pelo ID.
//     // Se quiser segurança total, teria que implementar deleteAddressMany ou verificar antes.
//     return await removeAddress(addressId);
// }

// --- CONTATOS ---

// export const createContactService = async (userCPF, contactData) => {
//     const cleanCpf = userCPF.replace(/\D/g, '');

//     const findUser = await findUserByCpf(cleanCpf);
//     if (!findUser) throw new Error("CPF não existe!");

//     const allowedFields = ["name", "phone_number", "type"];
//     const createData = sanitizeData(allowedFields, contactData);

//     // Limpa telefone
//     if (createData.phone_number) {
//         createData.phone_number = createData.phone_number.replace(/\D/g, '');
//     }

//     return await createContact(cleanCpf, createData);
// }

// export const updateContactService = async (userCPF, contactId, contactData) => {
//     const cleanCpf = userCPF.replace(/\D/g, '');

//     const findUser = await findUserByCpf(cleanCpf);
//     if (!findUser) throw new Error("CPF não existe!");

//     const allowedFields = ["name", "phone_number", "type"];
//     const updateData = sanitizeData(allowedFields, contactData);

//     if (updateData.phone_number) {
//         updateData.phone_number = updateData.phone_number.replace(/\D/g, '');
//     }

//     const result = await updateContact(cleanCpf, contactId, updateData);

//     if (result.count === 0) {
//         throw new Error("Contato não encontrado ou não pertence a este usuário.");
//     }

//     return result;
// }

// export const removeContactService = async (userCPF, contactId) => {
//     const cleanCpf = userCPF.replace(/\D/g, '');
//     const user = await findUserByCpf(cleanCpf);
//     if (!user) throw new Error("Usuário não encontrado.");

//     return await removeContact(contactId);
// }