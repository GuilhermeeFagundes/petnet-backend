import { listPets, findPetById, createPet, updatePet, deletePet, findPetsByUserCpf } from "../repository/pet.repository.js";
import { sanitizeData } from "../utils/sanitize.utils.js";
import { parseDateField } from "../utils/date.utils.js";
import { mapBlobToField, mapFieldToBlob } from "../utils/image.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import { validateAndConvertEnums, translateEnums } from "../utils/enum.utils.js";
import { PetEnums } from "../enums/pet.enums.js";
import { sendLog } from "../utils/log.utils.js";

const ALLOWED_CREATE_FIELDS = ["user_cpf", "name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];
const ALLOWED_UPDATE_FIELDS = ["name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];

/**
 * Converte blob e traduz enums de um pet (ou lista de pets).
 */
const formatPet = (pet) => {
    mapBlobToField(pet, 'petPicture');
    return translateEnums(pet, PetEnums);
};

export const listPetsService = async () => {
    const pets = await listPets();
    return pets.map(formatPet);
};

export const findPetsByUserService = async (userCpf) => {
    const pets = await findPetsByUserCpf(userCpf);
    return pets.map(formatPet);
};

export const findPetByIdService = async (petId) => {
    const pet = await findPetById(petId);
    if (!pet) throw new ResponseError("Pet não encontrado", 404);

    return formatPet(pet);
};

export const createPetService = async (petData, user) => {
    const dataWithBlob = mapFieldToBlob(petData, 'petPicture');
    const createData = sanitizeData(ALLOWED_CREATE_FIELDS, dataWithBlob);

    if (!createData) {
        throw new ResponseError("Dados inválidos para criação do pet", 400);
    }

    validateAndConvertEnums(createData, PetEnums);
    parseDateField(createData, 'birth_date');

    const newPet = await createPet(createData);
    await sendLog({ entity: 'pet', action: 'create', status: 'success', responsible: user.cpf });
    return formatPet(newPet);
};

export const updatePetService = async (petId, petData, user) => {
    const dataWithBlob = mapFieldToBlob(petData, 'petPicture');
    const updateData = sanitizeData(ALLOWED_UPDATE_FIELDS, dataWithBlob);
    
    if (!updateData) throw new ResponseError("Nenhum campo válido enviado para atualização", 400);

    validateAndConvertEnums(updateData, PetEnums);
    parseDateField(updateData, 'birth_date');

    const petExists = await findPetById(petId);
    if (!petExists) throw new ResponseError("Pet não encontrado", 404);

    const updatedPet = await updatePet(petId, updateData);
    await sendLog({ entity: 'pet', action: 'update', status: 'success', responsible: user.cpf });
    return formatPet(updatedPet);
};

export const deletePetService = async (petId, user) => {
    const pet = await findPetById(petId);
    if (!pet) throw new ResponseError("Pet não encontrado", 404);
    await deletePet(petId);
    await sendLog({ entity: 'pet', action: 'delete', status: 'success', responsible: user.cpf });
};