# PetNet Backend — Guia para o Agente

Sistema de agendamento para pet shop. Projeto de faculdade (FATEC), desenvolvido em família.

## Stack

- **Runtime:** Node.js 22 (ES Modules — `"type": "module"`)
- **Framework:** Express 5
- **ORM:** Prisma 5 → MySQL 8.4
- **Testes:** Jest 30 + Supertest + fast-check
- **Auth:** JWT em cookies HTTP-only (algoritmo HS256, obrigatório)
- **Dev:** Docker Compose + Nodemon

## Arquitetura

```
Routes → Middlewares → Controllers → Services → Repositories → Prisma → MySQL
```

Cada camada tem responsabilidade única e bem definida:

| Camada | Responsabilidade |
|--------|-----------------|
| **Routes** | Mapear URI + método HTTP para controller + middlewares |
| **Middlewares** | Auth, autorização, rate limit, error handling |
| **Controllers** | Receber req/res, extrair dados, chamar service, responder |
| **Services** | Lógica de negócio, validação, transformação, audit log |
| **Repositories** | Queries Prisma puras — sem lógica, sem transformação |
| **Utils** | Funções puras reutilizáveis entre camadas |

**Regras de ouro:**
- Controllers não têm lógica de negócio
- Services não conhecem `req`/`res`
- Repositories não fazem nada além de chamar o Prisma

## Princípios

- **TDD** — testes antes ou junto com o código, nunca depois
- **KISS** — funções pequenas, com uma única responsabilidade
- **DRY** — antes de criar uma função nova, verificar se já existe em `src/utils/`
- **Clean Code** — nomes descritivos; comentários só quando o porquê não é óbvio

## Convenções de nomenclatura

```js
// Services
createPetService, updatePetService, deletePetService

// Controllers
createPetController, updatePetController

// Repositories
createPet, findPetById, findPetsByUserCpf, updatePet, deletePet
```

- **JS:** camelCase para variáveis e funções
- **Banco:** snake_case para colunas (ex: `birth_date`, `user_cpf`)
- **Constantes de campos permitidos** definidas no service:
  ```js
  const ALLOWED_CREATE_FIELDS = ['user_cpf', 'name', 'species', ...]
  const ALLOWED_UPDATE_FIELDS = ['name', 'species', ...]
  ```

## Utilitários existentes — verificar antes de criar novos

> `src/utils/` — todos com testes colocalizados (`*.test.js`)

| Arquivo | Funções principais |
|---------|-------------------|
| `validators.utils.js` | `requireFields`, `parseId`, `cleanCpf`, `validateEmail`, `validatePassword` |
| `sanitize.utils.js` | `sanitizeData(allowedFields, data)` — whitelist de campos |
| `enum.utils.js` | `validateAndConvertEnums`, `translateEnums` |
| `date.utils.js` | `parseDateField`, `ensureDate` |
| `image.utils.js` | `mapBlobToField`, `mapFieldToBlob` |
| `log.utils.js` | `sendLog({ entity, action, status, responsible, details })` |
| `auth.utils.js` | `isAdmin`, `isSelf`, `isCollaboratorOrAdmin`, `isAdminOrPetOwner` |
| `jwt.utils.js` | Criação e verificação de tokens JWT |
| `cookie.utils.js` | Opções de cookie por ambiente (dev/prod) |
| `test.utils.js` | `generateCpf()` — CPF válido com dígito verificador |

## Tratamento de erros

```js
// src/errors/ResponseError.js
throw new ResponseError('Mensagem para o cliente', 404)
```

- Todos os erros de negócio usam `ResponseError`
- `error.middleware.js` captura tudo:
  - `ResponseError` → usa `httpCode` da instância
  - Prisma `P2002` → 409 Conflict
  - Prisma `P2025` → 404 Not Found
  - Resto → 500 genérico (sem detalhes internos)
- **Nunca** expor SQL, stack trace ou PII ao cliente

## Middlewares de autenticação e autorização

```js
// src/middlewares/auth.middleware.js
ensureAuthenticated          // base — valida JWT, injeta req.user = { cpf, type }
ensureAdmin                  // apenas MANAGER
ensureAdminOrSelf            // MANAGER ou dono do recurso (por CPF)
ensureCollaborator           // COLLABORATOR ou MANAGER
ensureAdminOrPetOwner        // MANAGER ou dono do pet (query async)
ensureAdminOrCollaboratorOwner // MANAGER ou colaborador dono do agendamento
```

## Padrões de teste

### Estrutura dos arquivos
- Colocalizados com o source: `src/controllers/pet.controller.test.js`
- **Excluídos da cobertura:** repositories, routes, enums, `server.js`
- **Meta:** 100% de cobertura nos arquivos elegíveis

### Estrutura de um teste

```js
describe('Pet Service (pet.service.js)', () => {
  describe('createPetService', () => {
    it('deve criar um pet com dados válidos', async () => {
      // 1. Arrange
      const petData = { name: 'Rex', species: 'DOG' }
      petRepository.createPet.mockResolvedValue({ id: 1, ...petData })

      // 2. Act
      const result = await createPetService(petData, { cpf: '12345678901' })

      // 3. Assert
      expect(petRepository.createPet).toHaveBeenCalledOnce()
      expect(result.name).toBe('Rex')
    })
  })
})
```

- Descrições em **português**: `deve...`
- Padrão **AAA** com linha em branco separando as seções
- Services mocam repositories; controllers mocam services

### Property-based testing (fast-check)

Usar para funções puras com muitas combinações de entrada:

```js
it('PROPRIEDADE: cleanCpf deve retornar apenas os 11 dígitos numéricos', () => {
  fc.assert(
    fc.property(fc.constant('12345678901'), (cpf) => {
      return cleanCpf(cpf).length === 11
    })
  )
})
```

### Setup típico de controller test

```js
import { jest } from '@jest/globals'
import * as petService from '../services/pet.service.js'

jest.mock('../services/pet.service.js')
jest.mock('../utils/log.utils.js')

let req, res
beforeEach(() => {
  req = { params: {}, body: {}, user: { cpf: '12345678901' } }
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
  jest.clearAllMocks()
})
```

## Audit logging

Todo service deve chamar `sendLog` após operações de escrita:

```js
await sendLog({ entity: 'pet', action: 'create', status: 'success', responsible: user.cpf })
```

## Scripts

```bash
npm run dev          # servidor com hot-reload (nodemon)
npm test             # todos os testes
npm run test:watch   # modo watch
docker compose watch # ambiente completo com hot-reload
```

## Documentação de endpoints (Postman)

Ao criar ou remover qualquer endpoint, atualizar **obrigatoriamente**:

1. **`postman/petnet_collection.json`** — adicionar/remover o request na pasta correspondente, com scripts de teste (`pm.test`) cobrindo o caminho feliz e capturando variáveis dinâmicas quando necessário.
2. **`postman/README.md`** — adicionar/remover a linha na tabela da seção correspondente (método, endpoint, auth, resultado esperado).

Nunca encerrar uma tarefa de endpoint sem essas duas atualizações.

## O que NÃO fazer

- Criar util sem antes verificar `src/utils/` — DRY
- Colocar lógica de negócio em controller ou repository
- Usar `algorithm: 'none'` ou qualquer algo diferente de HS256 no JWT
- Expor stack trace ou query SQL ao cliente
- Escrever testes para repositories, routes ou enums (excluídos do jest.config.js)
- Omitir `sendLog` em operações de escrita nos services
- Criar endpoint sem atualizar `postman/petnet_collection.json` e `postman/README.md`
