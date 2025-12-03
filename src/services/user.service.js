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

    const { cpf, email } = createData;

    const cpfExist = await findUserByCpf(cpf);
    if (cpfExist) { throw new Error("CPF já cadastrado no sistema!"); }

    const emailExist = await findUserByEmail(email);
    if (emailExist) { throw new Error("Email já cadastrado no sistema!"); }

    return await createUser(createData);
}

export const updateUserService = async (userCPF, userData) => {

    const allowedFields = ["email", "name", "password", "type", "picture_url",];
    const updateData = sanitizeData(allowedFields, userData);

    if (!updateData) {
        throw new Error("Nenhum campo válido enviado");
    }

    const userExists = await findUserByCpf(userCPF);
    if (!userExists) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    // validar se o novo e-mail já não pertence a outra pessoa.
    if (email && email !== userExists.email) {
        const emailTaken = await findUserByEmail(email);
        if (emailTaken) {
            throw new Error("Este novo e-mail já está em uso.");
        }
    }

    return await updateUser(userCPF, updateData);
};

export const deleteUserService = async (userCPF) => {
    const findUser = await findUserByCpf(userCPF);

    if (!findUser) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    return await deleteUser(userCPF);
}

export const createAddressService = async (userCPF, addressData) => {
    const allowedFields = ["type", "cep", "location", "complement", "picture_url",];
    const createData = sanitizeData(allowedFields, addressData);

    const findUser = await findUserByCpf(userCPF);

    if (!findUser) {
        throw new Error("CPF não existe!");
    }

    return await createAddress(userCPF, createData);
}


