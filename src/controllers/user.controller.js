import {
    listUsersService,
    showUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    reactivateUserService,
} from "../services/user.service.js";
import { ResponseError } from "../errors/ResponseError.js";

// --- USUÁRIOS ---

export const listUsersController = async (req, res) => {
    const users = await listUsersService();
    return res.status(200).json(users);
}

export const showUserController = async (req, res) => {
    const { user_cpf } = req.params;

    if (!user_cpf) {
        throw new ResponseError("Campo CPF do usuário faltando", 400);
    }

    const user = await showUserService(user_cpf);
    return res.status(200).json(user);
}

export const createUserController = async (req, res) => {
    const fullData = req.body;
    const newUser = await createUserService(fullData);
    return res.status(201).json(newUser);
}

export const updateUserController = async (req, res) => {
    const fullData = req.body;
    const { user_cpf } = req.params;

    if (!user_cpf) {
        throw new ResponseError("CPF não informado na URL.", 400);
    }

    const updatedUser = await updateUserService(user_cpf, fullData);
    return res.status(200).json(updatedUser);
};

export const deleteUserController = async (req, res) => {
    const { user_cpf } = req.params;

    if (!user_cpf) {
        throw new ResponseError("Campo CPF do usuário faltando", 400);
    }

    await deleteUserService(user_cpf);
    return res.status(200).json({ message: "Usuário excluído com sucesso" })
}

export const reactivateUserController = async (req, res) => {
    const { user_cpf } = req.params;

    if (!user_cpf) {
        throw new ResponseError("Campo CPF do usuário faltando", 400);
    }

    await reactivateUserService(user_cpf);
    return res.status(200).json({ message: "Usuário reativado com sucesso" })
}
