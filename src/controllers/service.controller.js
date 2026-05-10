import {
  listServicesService, findServiceByIdService, createServiceService,
  updateServiceService, deleteServiceService, reactivateServiceService,
} from "../services/service.service.js";
import { requireFields, parseId } from "../utils/validators.utils.js";

export const listServicesController = async (req, res) => {
  const services = await listServicesService();
  return res.status(200).json(services);
};

export const findServiceByIdController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do serviço');
  const service = await findServiceByIdService(id);
  return res.status(200).json(service);
};

export const createServiceController = async (req, res) => {
  requireFields(req.body, ['name', 'description']);

  const newService = await createServiceService(req.body);
  return res.status(201).json(newService);
};

export const updateServiceController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do serviço');
  const updatedService = await updateServiceService(id, req.body);
  return res.status(200).json(updatedService);
};

export const deleteServiceController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do serviço');
  await deleteServiceService(id);
  return res.status(200).json({ message: "Serviço excluído com sucesso" });
};

export const reactivateServiceController = async (req, res) => {
  const id = parseId(req.params.id, 'ID do serviço');
  await reactivateServiceService(id);
  return res.status(200).json({ message: "Serviço reativado com sucesso" });
};
