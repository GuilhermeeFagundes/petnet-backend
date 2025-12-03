import bcrypt from 'bcrypt';
import { sanitizeData } from "../middlewares/utils.middleware.js";
import { 
    listUsers, 
    findUserByCpf, 
    findUserByEmail, 
    createUser, 
    updateUser, 
    deleteUser,
    createAddress,
    updateAddress,
    removeAddress,
    createContact,
    updateContact,
    removeContact
} from '../repository/user.repository.js';

// --- USUÁRIOS ---

export const listUsersService = async () => {
    return await listUsers();
}
export const createUserService = async (userData, addressData) => {
    // 1. Validação e Sanitização do Usuário
    const allowedFields = ["cpf", "email", "name", "password", "type", "picture_url"];
    const createData = sanitizeData(allowedFields, userData);

    if (!createData) {
        throw new Error("Nenhum campo de usuário válido enviado");
    }

    const { cpf, email, password } = createData;

    // Limpa CPF (mantém apenas números)
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    // 2. Verificações de Duplicidade (Regra de Negócio)
    const cpfExist = await findUserByCpf(cleanCpf);
    if (cpfExist) { throw new Error("CPF já cadastrado no sistema!"); }

    const emailExist = await findUserByEmail(email);
    if (emailExist) { throw new Error("Email já cadastrado no sistema!"); }

    // 3. Validação e Sanitização do Endereço
    const addressFields = ["cep", "complement", "location"];
    const cleanAddressData = sanitizeData(addressFields, addressData);

    if (!cleanAddressData) {
        throw new Error("É necessário fornecer os dados de endereço para o cadastro.");
    }

    // Limpa o CEP (remove traço)
    if (cleanAddressData.cep) {
        cleanAddressData.cep = cleanAddressData.cep.replace(/\D/g, '');
    }

    // 4. Hash da Senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createDataWithHashedPassword = {
        ...createData,
        cpf: cleanCpf,
        password: hashedPassword
    };

    // 5. CRIAÇÃO DO USUÁRIO (PRIMEIRO)
    // Precisamos criar o usuário primeiro para que o CPF exista no banco
    const newUser = await createUser(createDataWithHashedPassword);

    // 6. CRIAÇÃO DO ENDEREÇO (DEPOIS)
    // Agora que o usuário existe, podemos vincular o endereço a ele
    try {
        await createAddress(cleanCpf, cleanAddressData);
    } catch (error) {
        // Opcional: Se der erro no endereço, você poderia deletar o usuário criado para não ficar "zumbi"
        // await deleteUser(cleanCpf); 
        throw new Error("Erro ao cadastrar endereço: " + error.message);
    }

    // 7. Retorno
    // Retornamos o usuário criado. Se quiser retornar o endereço junto, 
    // precisaria fazer uma nova busca ou montar o objeto manualmente.
    return {
        message: "Usuário e endereço criados com sucesso!",
        user: newUser,
        address: cleanAddressData
    };
}

export const updateUserService = async (userCPF, userData) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    const allowedFields = ["email", "name", "password", "type", "picture_url"];
    const updateData = sanitizeData(allowedFields, userData);

    if (!updateData) {
        throw new Error("Nenhum campo válido enviado");
    }

    const userExists = await findUserByCpf(cleanCpf);
    if (!userExists) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    // Valida se o novo e-mail já não pertence a outra pessoa
    if (updateData.email && updateData.email !== userExists.email) {
        const emailTaken = await findUserByEmail(updateData.email);
        if (emailTaken) {
            throw new Error("Este novo e-mail já está em uso.");
        }
    }

    // Se houver atualização de senha, refazer o hash
    if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return await updateUser(cleanCpf, updateData);
};

export const deleteUserService = async (userCPF) => {
    // CORREÇÃO: Declarar cleanCpf antes de usar
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);

    if (!findUser) {
        throw new Error("CPF não cadastrado no sistema.");
    }

    return await deleteUser(cleanCpf);
}

// --- ENDEREÇOS ---

export const createAddressService = async (userCPF, addressData) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    if (cleanCpf.length !== 11) {
        throw new Error("CPF deve conter exatamente 11 dígitos");
    }

    // Ajuste os campos conforme seu banco de dados (ex: logradouro, numero, etc)
    const allowedFields = ["type", "cep", "street", "number", "neighborhood", "city", "state", "complement"];
    const createData = sanitizeData(allowedFields, addressData);

    const findUser = await findUserByCpf(cleanCpf);
    if (!findUser) {
        throw new Error("CPF não existe!");
    }

    // Sanitização de CEP (Remove traço)
    if (createData.cep) {
        createData.cep = createData.cep.replace(/\D/g, '');
    }

    return await createAddress(cleanCpf, createData);
}

export const updateAddressService = async (userCPF, addressId, addressData) => {
    const cleanCpf = userCPF.replace(/\D/g, '');

    const findUser = await findUserByCpf(cleanCpf);
    if (!findUser) {
        throw new Error("CPF não existe!");
    }

    const allowedFields = ["type", "cep", "street", "number", "neighborhood", "city", "state", "complement"];
    const updateData = sanitizeData(allowedFields, addressData);

    if (!updateData) {
        throw new Error("Nenhum dado válido para atualização.");
    }

    // Sanitização de CEP
    if (updateData.cep) {
        updateData.cep = updateData.cep.replace(/\D/g, '');
    }

    const result = await updateAddress(cleanCpf, addressId, updateData);

    if (result.count === 0) {
        throw new Error("Endereço não encontrado ou não pertence a este usuário.");
    }

    return result;
}

export const removeAddressService = async (userCPF, addressId) => {
    // Verifica se o usuário existe (Opcional, mas boa prática)
    const cleanCpf = userCPF.replace(/\D/g, '');
    const user = await findUserByCpf(cleanCpf);
    if (!user) throw new Error("Usuário não encontrado.");

    // Nota: O ideal seria verificar se o endereço pertence ao usuário antes de deletar,
    // mas o removeAddress do repo atual deleta direto pelo ID.
    // Se quiser segurança total, teria que implementar deleteAddressMany ou verificar antes.
    return await removeAddress(addressId);
}

// --- CONTATOS ---

export const createContactService = async (userCPF, contactData) => {
    const cleanCpf = userCPF.replace(/\D/g, '');
    
    const findUser = await findUserByCpf(cleanCpf);
    if (!findUser) throw new Error("CPF não existe!");

    const allowedFields = ["name", "phone_number", "type"];
    const createData = sanitizeData(allowedFields, contactData);

    // Limpa telefone
    if (createData.phone_number) {
        createData.phone_number = createData.phone_number.replace(/\D/g, '');
    }

    return await createContact(cleanCpf, createData);
}

export const updateContactService = async (userCPF, contactId, contactData) => {
    const cleanCpf = userCPF.replace(/\D/g, '');
    
    const findUser = await findUserByCpf(cleanCpf);
    if (!findUser) throw new Error("CPF não existe!");

    const allowedFields = ["name", "phone_number", "type"];
    const updateData = sanitizeData(allowedFields, contactData);

    if (updateData.phone_number) {
        updateData.phone_number = updateData.phone_number.replace(/\D/g, '');
    }

    const result = await updateContact(cleanCpf, contactId, updateData);

    if (result.count === 0) {
        throw new Error("Contato não encontrado ou não pertence a este usuário.");
    }

    return result;
}

export const removeContactService = async (userCPF, contactId) => {
    const cleanCpf = userCPF.replace(/\D/g, '');
    const user = await findUserByCpf(cleanCpf);
    if (!user) throw new Error("Usuário não encontrado.");

    return await removeContact(contactId);
}