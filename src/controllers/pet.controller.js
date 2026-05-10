import { listPetsService, findPetByIdService, createPetService, updatePetService, deletePetService, findPetsByUserService } from "../services/pet.service.js";
import { ResponseError } from "../errors/ResponseError.js";
import { requireFields } from "../utils/validators.utils.js";

// puxa pets do usuário
export const findPetsByUserController = async (req, res) => {
    const cpf = req.user.cpf; // vem do token JWT
    const pets = await findPetsByUserService(cpf);
    return res.status(200).json(pets);
}

//Listar todos
export const listPetsController = async (req, res) => {
    const pets = await listPetsService();
    return res.status(200).json(pets);
}

//Buscar por ID
export const findPetByIdController = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ResponseError("ID do pet não informado", 400);
    }

    const pet = await findPetByIdService(id);
    return res.status(200).json(pet);
}

// Criar Pet
export const createPetController = async (req, res) => {
    requireFields(req.body, ['user_cpf', 'name', 'species', 'size']);

    const newPet = await createPetService(req.body);
    return res.status(201).json(newPet);
}

// Atualizar Pet
export const updatePetController = async (req, res) => {
    const { id } = req.params;
    const petParams = req.body;

    if (!id) {
        throw new ResponseError("ID não informado na URL.", 400);
    }

    const updatedPet = await updatePetService(id, petParams);
    return res.status(200).json(updatedPet);
}

// Deletar Pet
export const deletePetController = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ResponseError("ID não informado na URL.", 400);
    }

    await deletePetService(id);
    return res.status(200).json({ message: "Pet excluído com sucesso" });
}