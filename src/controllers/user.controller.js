import {
    listUsersService,
    showUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    reactivateUserService,
    clearUserPictureService,
} from "../services/user.service.js";
import { requireFields, validateEmail } from "../utils/validators.utils.js";

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
    validateEmail(req.body.email);

    const newUser = await createUserService(req.body);
    return res.status(201).json(newUser);
};

export const updateUserController = async (req, res) => {
    if (req.body.email) {
        validateEmail(req.body.email);
    }
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

export const clearUserPictureController = async (req, res) => {
    await clearUserPictureService(req.params.user_cpf);
    return res.status(200).json({ message: "Foto do usuário removida com sucesso" });
};
