export default {
  // O ambiente de teste que será usado para testes (Node.js é o padrão para backend)
  testEnvironment: 'node',

  // Diretório raiz onde o Jest deve procurar por arquivos de teste
  roots: ['<rootDir>/src'],

  // Limpar mocks entre os testes automaticamente
  clearMocks: true,

  // Coleta de cobertura de código
  collectCoverage: true,

  // Onde os relatórios de cobertura serão gerados
  coverageDirectory: 'coverage',

  // Ignorar pastas e arquivos específicos na cobertura
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/repository/',
    '/src/routes/',
    '/prisma/',
    '/src/enums/', // Enums geralmente não precisam de testes
    '/src/server.js' // Ponto de entrada
  ],

  // Transformar arquivos com o Babel
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
