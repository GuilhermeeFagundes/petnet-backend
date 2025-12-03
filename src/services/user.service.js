import bcrypt from 'bcrypt';

import { sanitizeData } from "../middlewares/utils.middleware.js";
import { listUsers, findUserByCpf, findUserByEmail, createUser, updateUser, deleteUser } from '../repository/user.repository.js';

export const listUsersService = async () => {
    return await listUsers();
}

export const createUserService = async (userData) => {
    const allowedFields = ["cpf", "email", "name", "password", "type", "picture_url"];
    const createData = sanitizeData(allowedFields, userData);

    if (!createData) {
        throw new Error("Nenhum campo válido enviado");
    }

    const { cpf, email, password } = createData;

    // Remove formatting from CPF (dots, dashes, spaces) - keep only digits
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const cpfExist = await findUserByCpf(cleanCpf);
    if (cpfExist) { throw new Error("CPF já cadastrado no sistema!"); }

    const emailExist = await findUserByEmail(email);
    if (emailExist) { throw new Error("Email já cadastrado no sistema!"); }

    const saltRounds = 10; // Custo do processamento (10 é o padrão seguro)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criamos um novo objeto com a senha já protegida e CPF limpo
    const createDataWithHashedPassword = {
        ...createData,             // Copia email, name, type, picture_url
        cpf: cleanCpf,             // CPF sem formatação
        password: hashedPassword   // Sobrescreve a senha original pela hash
    };

    return await createUser(createDataWithHashedPassword);
}

export const updateUserService = async (userCPF, userData) => {
    // Remove formatting from CPF (dots, dashes, spaces) - keep only digits
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const allowedFields = ["email", "name", "password", "type", "picture_url",];
    const updateData = sanitizeData(allowedFields, userData);

    if (!updateData) {
        throw new Error("Nenhum campo válido enviado");
    }

    const userExists = await findUserByCpf(cleanCpf);
    if (!userExists) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    // validar se o novo e-mail já não pertence a outra pessoa.
    if (updateData.email && updateData.email !== userExists.email) {
        const emailTaken = await findUserByEmail(updateData.email);
        if (emailTaken) {
            throw new Error("Este novo e-mail já está em uso.");
        }
    }

    return await updateUser(cleanCpf, updateData);
};

export const deleteUserService = async (userCPF) => {
    const findUser = await findUserByCpf(userCPF);

    if (!findUser) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    return await deleteUser(cleanCpf);
}

export const createAddressService = async (userCPF, addressData) => {
    // Remove formatting from CPF (dots, dashes, spaces) - keep only digits
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const allowedFields = ["type", "cep", "location", "complement", "picture_url",];
    const createData = sanitizeData(allowedFields, addressData);

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new Error("CPF não existe!");
    }

    return await createAddress(cleanCpf, createData);
}


