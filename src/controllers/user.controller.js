import {
    listUsersService,
    showUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    reactivateUserService,
} from "../services/user.service.js";
import { requireFields } from "../utils/validators.utils.js";

export const listUsersController = async (req, res) => {
    const users = await listUsersService();
    return res.status(200).json(users);
};

export const showUserController = async (req, res) => {
    const user = await showUserService(req.params.user_cpf);
    return res.status(200).json(user);
};

export const createUserController = async (req, res) => {
    requireFields(req.body, ['cpf', 'email', 'name', 'password']);

    const newUser = await createUserService(req.body);
    return res.status(201).json(newUser);
};

export const updateUserController = async (req, res) => {
    const updatedUser = await updateUserService(req.params.user_cpf, req.body);
    return res.status(200).json(updatedUser);
};

export const deleteUserController = async (req, res) => {
    await deleteUserService(req.params.user_cpf);
    return res.status(200).json({ message: "Usuário excluído com sucesso" });
};

export const reactivateUserController = async (req, res) => {
    await reactivateUserService(req.params.user_cpf);
    return res.status(200).json({ message: "Usuário reativado com sucesso" });
};
