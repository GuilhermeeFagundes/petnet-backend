import { Router } from 'express';
import {
  listServicesController, findServiceByIdController, createServiceController, updateServiceController, deleteServiceController, reactivateServiceController
} from '../controllers/service.controller.js';
import { ensureAdmin } from '../middlewares/auth.middleware.js';

const serviceRouter = Router();

serviceRouter.get('/', listServicesController);                           // open route - no middleware
serviceRouter.get('/:id', ensureAdmin, findServiceByIdController);        // admin only
serviceRouter.post('/', ensureAdmin, createServiceController);            // admin only
serviceRouter.put('/:id', ensureAdmin, updateServiceController);          // admin only
serviceRouter.delete('/:id', ensureAdmin, deleteServiceController);       // admin only
serviceRouter.patch('/:id/reactivate', ensureAdmin, reactivateServiceController); // admin only

export default serviceRouter;
