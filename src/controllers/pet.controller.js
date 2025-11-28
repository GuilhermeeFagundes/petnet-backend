import { listPetsService, findPetByIdService, createPetService } from "../services/pet.service.js";


export const listPetsController = async (req, res) => {
    const pets = await listPetsService();
    res.json(pets);
}

export const findPetByIdController = async (req, res) => {
    const id = req.params.id;
    try {
        const pet = await findPetByIdService(id);
        return res.json(pet);
    } catch (err) {
        res.status(404).json({ erro: err.message });
    }

}

export const createPetController = async (req, res) => {
    try {
        const newPet = await createPetService(req.body);
        res.status(201).json(newPet);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}