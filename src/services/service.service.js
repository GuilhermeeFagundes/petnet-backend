import { sanitizeData } from "../middlewares/utils.middleware.js";
import { base64ToBuffer, bufferToBase64 } from "../utils/image.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import {
  listServices, findServiceById, createService, updateService, deleteService, reactivateService
} from '../repository/service.repository.js';

/**
 * Transforma o buffer da imagem em string Base64 e remove o campo original.
 * Função privada para evitar repetição de código.
 */
const _mapBlobToPicture = (service) => {
  if (service?.picture_blob) {
    service.servicePicture = bufferToBase64(service.picture_blob);
    delete service.picture_blob;
  }
  return service;
};

/**
 * Converte a string Base64 da imagem em Buffer para o banco.
 * Função privada para evitar repetição de código.
 */
const _mapPictureToBlob = (serviceData) => {
  const { servicePicture, ...rest } = serviceData;
  return {
    ...rest,
    picture_blob: servicePicture ? base64ToBuffer(servicePicture) : undefined
  };
};

// List all services with image conversion
export const listServicesService = async () => {
  const services = await listServices();
  return services.map(_mapBlobToPicture);
}

// Find service by ID with image conversion
export const findServiceByIdService = async (serviceId) => {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new ResponseError("Serviço não encontrado", 404);
  }

  return _mapBlobToPicture(service);
}

// Create service with validation and sanitization
export const createServiceService = async (serviceData) => {
  const serviceWithPicture = _mapPictureToBlob(serviceData);

  const allowedFields = ["name", "description", "picture_blob"];
  const createData = sanitizeData(allowedFields, serviceWithPicture);

  if (!createData || Object.keys(createData).length === 0) {
    throw new ResponseError("Dados inválidos para criação do serviço", 400);
  }

  // Validate required fields
  if (!createData.name || !createData.description) {
    throw new ResponseError("Nome e descrição são obrigatórios", 400);
  }

  const newService = await createService(createData);
  return _mapBlobToPicture(newService);
}

// Update service with validation and sanitization
export const updateServiceService = async (serviceId, serviceData) => {
  const serviceWithPicture = _mapPictureToBlob(serviceData);

  const allowedFields = ["name", "description", "picture_blob"];
  const updateData = sanitizeData(allowedFields, serviceWithPicture);

  // Validate at least one field is present
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new ResponseError("Nenhum campo válido enviado para atualização", 400);
  }

  // Check service exists
  const serviceExists = await findServiceById(serviceId);

  if (!serviceExists) {
    throw new ResponseError("Serviço não encontrado", 404);
  }

  const updatedService = await updateService(serviceId, updateData);
  return _mapBlobToPicture(updatedService);
}

// Soft delete service
export const deleteServiceService = async (serviceId) => {
  await deleteService(serviceId);
}

// Reactivate soft-deleted service
export const reactivateServiceService = async (serviceId) => {
  await reactivateService(serviceId);
}


