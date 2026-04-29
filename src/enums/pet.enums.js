export const PetSpecies = {
  DOG: 'dog',
  CAT: 'cat'
};

export const PetSize = {
  S: 'S',
  M: 'M',
  L: 'L',
  G: 'G'
};

export const PetSex = {
  M: 'M',
  F: 'F'
};

export const PetSpeciesMetadata = {
  key: 'species',
  label: 'Espécie',
  values: PetSpecies,
  translations: {
    [PetSpecies.DOG]: 'Cachorro',
    [PetSpecies.CAT]: 'Gato'
  }
};

export const PetSizeMetadata = {
  key: 'size',
  label: 'Porte',
  values: PetSize,
  translations: {
    [PetSize.S]: 'Pequeno',
    [PetSize.M]: 'Médio',
    [PetSize.L]: 'Grande',
    [PetSize.G]: 'Gigante'
  }
};

export const PetSexMetadata = {
  key: 'sex',
  label: 'Sexo',
  values: PetSex,
  translations: {
    [PetSex.M]: 'Macho',
    [PetSex.F]: 'Fêmea'
  }
};

export const PetEnums = [PetSpeciesMetadata, PetSizeMetadata, PetSexMetadata];
