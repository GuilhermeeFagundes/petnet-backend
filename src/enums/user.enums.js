export const UserType = {
  CUSTOMER: 'CUSTOMER',
  MANAGER: 'MANAGER',
  COLLABORATOR: 'COLLABORATOR'
};

export const UserTypeMetadata = {
  key: 'type',
  label: 'Tipo de Usuário',
  values: UserType,
  translations: {
    [UserType.CUSTOMER]: 'Cliente',
    [UserType.MANAGER]: 'Gerente',
    [UserType.COLLABORATOR]: 'Colaborador'
  }
};

export const UserEnums = [UserTypeMetadata];
