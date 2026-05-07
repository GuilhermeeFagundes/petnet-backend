import { listServicesService, findServiceByIdService, createServiceService, updateServiceService, deleteServiceService, reactivateServiceService,
} from "../services/service.service.js";
import { ResponseError } from "../errors/ResponseError.js";

// List all services
export const listServicesController = async (req, res) => {
  const services = await listServicesService();
  return res.status(200).json(services);
}

// Get service by ID
export const findServiceByIdController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ResponseError("ID do serviço não informado", 400);
  }

  const service = await findServiceByIdService(Number(id));
  return res.status(200).json(service);
}

// Create new service
export const createServiceController = async (req, res) => {
  const serviceData = req.body;
  const { name, description } = serviceData;

  // Validate required fields
  if (!name || !description) {
    throw new ResponseError("Campos obrigatórios faltando (name e description)", 400);
  }

  const newService = await createServiceService(serviceData);
  return res.status(201).json(newService);
}

// Update service
export const updateServiceController = async (req, res) => {
  const { id } = req.params;
  const serviceData = req.body;

  if (!id) {
    throw new ResponseError("ID não informado na URL.", 400);
  }

  const updatedService = await updateServiceService(Number(id), serviceData);
  return res.status(200).json(updatedService);
}

// Delete service (soft delete)
export const deleteServiceController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ResponseError("ID do serviço não informado", 400);
  }

  await deleteServiceService(Number(id));
  return res.status(200).json({ message: "Serviço excluído com sucesso" });
}

// Reactivate service
export const reactivateServiceController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ResponseError("ID do serviço não informado", 400);
  }

  await reactivateServiceService(Number(id));
  return res.status(200).json({ message: "Serviço reativado com sucesso" });
}
