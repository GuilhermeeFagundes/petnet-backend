import { sanitizeData } from "../utils/sanitize.utils.js";
import { mapBlobToField, mapFieldToBlob } from "../utils/image.utils.js";
import { ResponseError } from "../errors/ResponseError.js";
import {
  listServices, findServiceById, createService, updateService, deleteService, reactivateService, clearServicePicture
} from '../repository/service.repository.js';

const ALLOWED_FIELDS = ["name", "description", "picture_blob"];

export const listServicesService = async () => {
  const services = await listServices();
  return services.map(service => mapBlobToField(service, 'servicePicture'));
};

export const findServiceByIdService = async (serviceId) => {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new ResponseError("Serviço não encontrado", 404);
  }

  return mapBlobToField(service, 'servicePicture');
};

export const createServiceService = async (serviceData) => {
  const dataWithBlob = mapFieldToBlob(serviceData, 'servicePicture');
  const createData = sanitizeData(ALLOWED_FIELDS, dataWithBlob);

  if (!createData) {
    throw new ResponseError("Dados inválidos para criação do serviço", 400);
  }

  const newService = await createService(createData);
  return mapBlobToField(newService, 'servicePicture');
};

export const updateServiceService = async (serviceId, serviceData) => {
  const dataWithBlob = mapFieldToBlob(serviceData, 'servicePicture');
  const updateData = sanitizeData(ALLOWED_FIELDS, dataWithBlob);

  if (!updateData) {
    throw new ResponseError("Nenhum campo válido enviado para atualização", 400);
  }

  const serviceExists = await findServiceById(serviceId);
  if (!serviceExists) {
    throw new ResponseError("Serviço não encontrado", 404);
  }

  const updatedService = await updateService(serviceId, updateData);
  return mapBlobToField(updatedService, 'servicePicture');
};

export const deleteServiceService = async (serviceId) => {
  await deleteService(serviceId);
};

export const reactivateServiceService = async (serviceId) => {
  await reactivateService(serviceId);
};

export const clearServicePictureService = async (serviceId) => {
  const service = await findServiceById(serviceId);
  if (!service) throw new ResponseError("Serviço não encontrado", 404);
  await clearServicePicture(serviceId);
};
