import prisma from '../../prisma/prisma.js';

// List all active services
export const listServices = async () => {
  return await prisma.service.findMany({
    where: { excluded_at: null }
  });
}

// Find service by ID (active only)
export const findServiceById = async (serviceId) => {
  return await prisma.service.findFirst({
    where: {
      id: Number(serviceId),
      excluded_at: null
    }
  });
}

// Create new service
export const createService = async (serviceData) => {
  return await prisma.service.create({
    data: serviceData
  });
}

// Update existing service
export const updateService = async (serviceId, serviceData) => {
  return await prisma.service.update({
    where: { id: Number(serviceId) },
    data: serviceData
  });
}

// Soft delete service
export const deleteService = async (serviceId) => {
  return await prisma.service.update({
    where: { id: Number(serviceId) },
    data: { excluded_at: new Date() }
  });
}

// Reactivate soft-deleted service
export const reactivateService = async (serviceId) => {
  return await prisma.service.update({
    where: { id: Number(serviceId) },
    data: { excluded_at: null }
  });
}
