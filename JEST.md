# Guia de Testes Unitários com Jest

Este documento define as diretrizes e melhores práticas para o desenvolvimento de testes unitários no PetNet Backend, utilizando o Jest. Nosso objetivo é garantir que a base de código seja testável, legível e de fácil manutenção.

---

## 1. Escopo dos Testes

O que **DEVE** ser testado:
- **Services (`src/services/`)**: Regras de negócio, cálculos, tratamentos de erro e integrações com o banco (mockadas).
- **Controllers (`src/controllers/`)**: Tratamento de requisições, respostas, status HTTP e validação de parâmetros de entrada.
- **Utils (`src/utils/`)**: Funções puras, validações isoladas (como CPFs) e helpers.

O que **NÃO PRECISA** ser testado (nesta camada unitária):
- **Repositories**: A lógica principal é do Prisma.
- **Routes**: Serão cobertas por testes E2E se necessário (não fazem sentido em testes unitários puros).

---

## 2. Padrões de Qualidade e Arquitetura

Nossos testes devem seguir os seguintes princípios:

- **Clean Code**: Nomes descritivos de variáveis, funções pequenas e asserts claros. O teste deve servir como documentação do comportamento esperado.
- **KISS (Keep It Simple, Stupid)**: Testes não devem ter lógica complexa (`ifs`, `loops` extensos). Eles devem focar em um único fluxo (Arrange -> Act -> Assert).
- **DRY (Don't Repeat Yourself)**: Use blocos `beforeEach` e `beforeAll` para setup de dependências comuns (mas sem exageros que deixem o teste obscuro). Utilize as funções utilitárias que já desenvolvemos.

---

## 3. Nomenclatura e Contextos em Português

Os blocos `describe` e `it` devem sempre ser escritos em **Português** e refletir as regras de negócio de forma natural. 

### Padrão de `describe`
Deve descrever o serviço, a função ou o módulo sendo testado.
```javascript
describe('Serviço de Agendamento (schedule.service.js)', () => { ... });
```

### Padrão de `it` ou `test`
Deve ser uma frase que complementa "Isto deve..." ou apenas a ação clara do comportamento esperado.
```javascript
// ✅ BOM
it('deve lançar um erro 400 se o cliente não informar a data_time', async () => { ... });

// ❌ RUIM (técnico demais, idioma misturado)
it('returns 400 when date is null', async () => { ... });
```

---

## 4. Estrutura de um Teste (Padrão AAA)

Todo teste unitário deve seguir a estrutura de 3 passos claros: **Arrange, Act, Assert** (Preparar, Agir, Verificar). Deixe uma linha em branco entre cada bloco.

```javascript
import { cleanCpf } from '../utils/validators.utils.js';

describe('Validator Utils: cleanCpf', () => {
  it('deve remover todos os caracteres não numéricos de um CPF válido', () => {
    // 1. Arrange (Preparar)
    const cpfComMascara = '123.456.789-00';
    const cpfEsperado = '12345678900';

    // 2. Act (Agir)
    const resultado = cleanCpf(cpfComMascara);

    // 3. Assert (Verificar)
    expect(resultado).toBe(cpfEsperado);
  });
});
```

---

## 5. Como Executar os Testes

Os scripts já estão configurados no seu `package.json` utilizando o recurso experimental de módulos ECMAScript do Node.

- **Rodar os testes uma única vez:**
  ```bash
  npm run test
  ```

- **Rodar os testes em modo "Watch" (fica aguardando alterações nos arquivos):**
  ```bash
  npm run test:watch
  ```

- **Gerar o relatório de Cobertura de Código (Coverage):**
  ```bash
  npm run test:coverage
  ```
  Isso mostrará a porcentagem de linhas, funções e branches testadas. Nosso `jest.config.js` já ignora arquivos desnecessários como repositories e routes para que a cobertura seja mais precisa.

---

## 6. Dicas Rápidas de Mock (Jest)

Como nossos repositories não são testados, sempre que um Service ou Controller for testado, o repository deve ser "mockado".

```javascript
import { findPetById } from '../repository/pet.repository.js';
import { findPetByIdService } from '../services/pet.service.js';

// Avisa ao jest para substituir esse arquivo real por funções de mentira
jest.mock('../repository/pet.repository.js');

describe('Busca de Pet por ID', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa as chamadas antes de cada teste
  });

  it('deve retornar o pet quando o ID existir', async () => {
    // Simula o retorno do banco de dados
    findPetById.mockResolvedValue({ id: 1, name: 'Rex', picture_blob: null });

    const pet = await findPetByIdService(1);

    expect(findPetById).toHaveBeenCalledWith(1);
    expect(pet.name).toBe('Rex');
  });
});
```

---

## 7. Testes de Propriedade (Property-Based Testing)

Para utilitários e funções puras, utilizamos o `fast-check`. Isso garante que a função funcione para uma vasta gama de entradas geradas aleatoriamente, não apenas para os casos que pensamos manualmente.

```javascript
import fc from 'fast-check';

it('PROPRIEDADE: para qualquer string de data ISO válida, parseDateField deve converter corretamente', () => {
  fc.assert(
    fc.property(fc.date(), (date) => {
      const isoString = date.toISOString();
      const data = { birth_date: isoString };
      const result = parseDateField(data, 'birth_date');
      return result.birth_date.getTime() === date.getTime();
    })
  );
});
```

---

## 8. Testes de Integração (Fluxo Real)

Diferente dos testes unitários, os testes de integração (E2E) testam o fluxo real da API, batendo no banco de dados e passando pelos middlewares. 

- **Ferramentas**: `supertest` e o `app.js` exportado.
- **Arquivo**: Nomeado como `*.int.test.js`.
- **Regra**: Limpar os dados criados no `afterAll` ou `beforeAll`.

Exemplo de fluxo real:
```javascript
import request from 'supertest';
import app from '../app.js';

describe('Integração: Fluxo de Usuário', () => {
  it('deve registrar um usuário e retornar 201', async () => {
    const res = await request(app).post('/api/auth/register').send({ ... });
    expect(res.status).toBe(201);
  });
});
```

---
**Bons testes! 🐶🐱🚀**
