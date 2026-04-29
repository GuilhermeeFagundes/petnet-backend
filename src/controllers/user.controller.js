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

// Esta comentado pois futuramente será implementado

// --- ENDEREÇOS ---

// export const createAddressController = async (req, res) => {
//     try {
//         const { user_cpf } = req.params;
//         const addressData = req.body;

//         if (Object.keys(addressData).length === 0) {
//             return res.status(400).json({ error: "Nenhum dado fornecido." });
//         }

//         // A validação detalhada dos campos é feita no Service (sanitizeData),
//         // mas aqui garantimos que o CPF veio na URL.
//         const createdAddress = await createAddressService(user_cpf, addressData);
//         return res.status(201).json(createdAddress);

//     } catch (error) {
//         return res.status(400).json({ error: error.message })
//     }
// }

// export const updateAddressController = async (req, res) => {
//     try {
//         const { user_cpf, address_id } = req.params;
//         const addressData = req.body;

//         if (Object.keys(addressData).length === 0) {
//             return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
//         }

//         const updatedAddress = await updateAddressService(user_cpf, address_id, addressData);
//         return res.status(200).json(updatedAddress);

//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// export const removeAddressController = async (req, res) => {
//     try {
//         const { user_cpf, address_id } = req.params;

//         await removeAddressService(user_cpf, address_id);

//         return res.status(200).json({ message: "Endereço removido com sucesso." });
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// --- CONTATOS ---

// export const createContactController = async (req, res) => {
//     try {
//         const { user_cpf } = req.params;
//         const contactData = req.body;

//         if (Object.keys(contactData).length === 0) {
//             return res.status(400).json({ error: "Nenhum dado de contato fornecido." });
//         }

//         const newContact = await createContactService(user_cpf, contactData);
//         return res.status(201).json(newContact);

//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// export const updateContactController = async (req, res) => {
//     try {
//         const { user_cpf, contact_id } = req.params;
//         const contactData = req.body;

//         if (Object.keys(contactData).length === 0) {
//             return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
//         }

//         const updatedContact = await updateContactService(user_cpf, contact_id, contactData);
//         return res.status(200).json(updatedContact);

//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }

// export const removeContactController = async (req, res) => {
//     try {
//         const { user_cpf, contact_id } = req.params;

//         await removeContactService(user_cpf, contact_id);

//         return res.status(200).json({ message: "Contato removido com sucesso." });
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }