import { createUserService, listUsersService, deleteUserService, updateUserService, createAddressService } from "../services/user.service.js";

export const listUsersController = async (req, res) => {
    try {
        const users = await listUsersService();
        return res.status(200).json(users)

    } catch (error) {
        return res.status(400).json({ error: "Erro ao listar usuários" });
    }
}

export const createUserController = async (req, res) => {
    try {
        const userParams = req.body;
        const { cpf, email, name, password } = userParams;

        // validação da entrada dos campos obrigatórios
        if (!cpf || !email || !name || !password) {
            return res.status(400).json({ error: "Campos obrigatórios faltando. (cpf, name, email e password)" });
        }

        const newUser = await createUserService(userParams);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const updateUserController = async (req, res) => {
    try {
        // Dados da URL
        const { user_cpf } = req.params;

        // Dados do JSON (corpo da requisição)
        const userParams = req.body;

        // Valida se a rota não passar o CPF
        if (!user_cpf) {
            return res.status(400).json({ erro: "CPF não informado na URL." });
        }

        // Valida se o corpo vier vazio
        if (Object.keys(userParams).length === 0) {
            return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
        }

        const updatedUser = await updateUserService(user_cpf, userParams);
        return res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const createAddressController = async (req, res) => {
    try {
        // Dados da URL
        const { user_cpf } = req.params;

        // Dados do JSON (corpo da requisição)
        const addressData = req.body;
        const { type, cep, location, complement } = addressData;

        if (Object.keys(addressData).length === 0) {
            return res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
        }

        if (!type || !cep || !location || !complement) {
            return res.status(400).json({ error: "Campos obrigatórios faltando. (type, cep, location, complement)" });
        }

        const createdAddress = await createAddressService(user_cpf, addressData);
        return res.status(200).json(createdAddress)

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const { user_cpf } = req.params;

        if (!user_cpf) {
            return res.status(400).json({ error: "Campo CPF do usuário faltando" });
        }

        await deleteUserService(user_cpf);

        return res.status(200).json({ message: "Usuário excluído com sucesso" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


