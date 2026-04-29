export const UserType = {
  CLIENTE: 'Cliente',
  GERENTE: 'Gerente',
  COLABORADOR: 'Colaborador'
};

export const UserTypeMetadata = {
  key: 'type',
  label: 'Tipo de Usuário',
  values: UserType,
  translations: {
    [UserType.CLIENTE]: 'Cliente',
    [UserType.GERENTE]: 'Gerente',
    [UserType.COLABORADOR]: 'Colaborador'
  }
};

export const UserEnums = [UserTypeMetadata];
