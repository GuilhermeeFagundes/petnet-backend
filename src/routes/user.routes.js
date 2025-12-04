import { Router } from 'express';
import { createUserController, showUserController, listUsersController, deleteUserController, reactivateUserController, updateUserController } from '../controllers/user.controller.js';
// import { ensureAuthenticated, ensureAdministrator, ensureAdministratorOrSelf } from '../middlewares/auth';

const userRouter = Router();

userRouter.get('/', listUsersController);
userRouter.get('/:user_cpf', showUserController);
userRouter.post('/', createUserController);
userRouter.put('/:user_cpf', updateUserController);
userRouter.delete('/:user_cpf', deleteUserController);
userRouter.patch('/reactivate/:user_cpf', reactivateUserController);

// TODO: MARIANA - Rotas de Endereço e Contato podem ser adicionadas aqui no futuro.

export default userRouter;