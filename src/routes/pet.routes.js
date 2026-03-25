import { Router } from 'express';
import { listPetsController, findPetByIdController, createPetController, updatePetController, deletePetController, findPetsByUserController } from '../controllers/pet.controller.js';
import { ensureAuthenticated, ensureAdmin, ensureAdminOrPetOwner } from '../middlewares/auth.middleware.js';

const petRouter = Router();

petRouter.get('/', ensureAdmin, listPetsController);                    // só admin lista todos os pets
petRouter.get('/meus-pets', ensureAuthenticated, findPetsByUserController)   // listar pets do usuário
petRouter.get('/:id', ensureAdminOrPetOwner, findPetByIdController);   // dono ou admin
petRouter.post('/', ensureAuthenticated, createPetController);         // qualquer usuário logado
petRouter.put('/:id', ensureAdminOrPetOwner, updatePetController);     // dono ou admin
petRouter.delete('/:id', ensureAdminOrPetOwner, deletePetController);  // dono ou admin

export default petRouter;