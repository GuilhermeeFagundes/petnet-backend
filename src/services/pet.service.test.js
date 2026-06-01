import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import {
  listPetsService,
  findPetsByUserService,
  findPetByIdService,
  createPetService,
  updatePetService,
  deletePetService
} from './pet.service.js';
import * as petRepository from '../repository/pet.repository.js';
import { ResponseError } from '../errors/ResponseError.js';
import { generateCpf } from "../utils/test.utils.js";

const TEST_CPF_1 = generateCpf();
const TEST_CPF_2 = generateCpf();

jest.mock('../repository/pet.repository.js');

describe('Pet Service (pet.service.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listPetsService', () => {
    it('deve listar todos os pets', async () => {
      const mockPets = [{ id: 1, name: 'Rex' }];
      petRepository.listPets.mockResolvedValue(mockPets);

      const result = await listPetsService();

      expect(petRepository.listPets).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findPetsByUserService', () => {
    it('deve buscar pets por CPF do usuário', async () => {
      const mockPets = [{ id: 1, name: 'Rex' }];
      petRepository.findPetsByUserCpf.mockResolvedValue(mockPets);

      const result = await findPetsByUserService(TEST_CPF_2);

      expect(petRepository.findPetsByUserCpf).toHaveBeenCalledWith(TEST_CPF_2);
      expect(result).toHaveLength(1);
    });
  });

  describe('findPetByIdService', () => {
    it('deve retornar o pet se ele existir', async () => {
      const mockPet = { id: 1, name: 'Rex' };
      petRepository.findPetById.mockResolvedValue(mockPet);

      const result = await findPetByIdService(1);

      expect(petRepository.findPetById).toHaveBeenCalledWith(1);
      expect(result.name).toBe('Rex');
    });

    it('deve lançar erro 404 se o pet não existir', async () => {
      petRepository.findPetById.mockResolvedValue(null);
      await expect(findPetByIdService(1)).rejects.toThrow(ResponseError);
    });
  });

  describe('createPetService', () => {
    it('deve criar um pet com sucesso', async () => {
      const petData = { user_cpf: TEST_CPF_1, name: 'Rex', species: 'Cachorro' };
      petRepository.createPet.mockResolvedValue({ id: 1, ...petData });

      const result = await createPetService(petData);

      expect(petRepository.createPet).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('deve lançar erro se os dados forem inválidos', async () => {
      await expect(createPetService({})).rejects.toThrow('Dados inválidos para criação do pet');
    });
  });

  describe('updatePetService', () => {
    it('deve atualizar o pet com sucesso', async () => {
      petRepository.findPetById.mockResolvedValue({ id: 1 });
      petRepository.updatePet.mockResolvedValue({ id: 1, name: 'Novo' });

      const result = await updatePetService(1, { name: 'Novo' });

      expect(petRepository.updatePet).toHaveBeenCalled();
      expect(result.name).toBe('Novo');
    });

    it('deve lançar erro se o pet não existir', async () => {
      petRepository.findPetById.mockResolvedValue(null);
      await expect(updatePetService(1, { name: 'Novo' })).rejects.toThrow('Pet não encontrado');
    });

    it('deve lançar erro se não houver campos válidos para atualização', async () => {
      await expect(updatePetService(1, { invalid_field: 'val' })).rejects.toThrow('Nenhum campo válido enviado para atualização');
    });
  });

  describe('deletePetService', () => {
    it('deve excluir o pet se ele existir', async () => {
      petRepository.findPetById.mockResolvedValue({ id: 1 });
      await deletePetService(1);
      expect(petRepository.deletePet).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro se o pet não existir ao tentar excluir', async () => {
      petRepository.findPetById.mockResolvedValue(null);
      await expect(deletePetService(1)).rejects.toThrow('Pet não encontrado');
    });
  });
});
