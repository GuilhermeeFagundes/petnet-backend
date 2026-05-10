import { listPetsService, findPetByIdService, createPetService, updatePetService, deletePetService, findPetsByUserService } from "../services/pet.service.js";
import { requireFields, parseId } from "../utils/validators.utils.js";

export const findPetsByUserController = async (req, res) => {
    const pets = await findPetsByUserService(req.user.cpf);
    return res.status(200).json(pets);
};

export const listPetsController = async (req, res) => {
    const pets = await listPetsService();
    return res.status(200).json(pets);
};

export const findPetByIdController = async (req, res) => {
    const id = parseId(req.params.id, 'ID do pet');
    const pet = await findPetByIdService(id);
    return res.status(200).json(pet);
};

export const createPetController = async (req, res) => {
    requireFields(req.body, ['user_cpf', 'name', 'species', 'size']);

    const newPet = await createPetService(req.body);
    return res.status(201).json(newPet);
};

export const updatePetController = async (req, res) => {
    const id = parseId(req.params.id, 'ID do pet');
    const updatedPet = await updatePetService(id, req.body);
    return res.status(200).json(updatedPet);
};

export const deletePetController = async (req, res) => {
    const id = parseId(req.params.id, 'ID do pet');
    await deletePetService(id);
    return res.status(200).json({ message: "Pet excluído com sucesso" });
};