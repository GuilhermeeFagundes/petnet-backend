# PetNet API - Test Cases & Scenarios

Este documento descreve os principais casos de teste (Caminho Feliz e Casos de Erro) para cada recurso da API PetNet, garantindo o funcionamento esperado das validações e regras de negócio. Todos esses endpoints estão configurados na [Collection do Postman](./petnet_collection.json).

## 1. Health Check
- **`GET /healthcheck`**
  - ✅ **Sucesso (200):** Verifica se a API está online, operante e com comunicação no banco de dados.

## 2. Auth (Autenticação)
- **`POST /api/auth/register`**
  - ✅ **Sucesso (201):** Criar um usuário passando dados válidos (endereço, contato, cpf, senha).
  - ❌ **Erro (400):** Passar CPF com formato incorreto (diferente de 11 dígitos numéricos).
  - ❌ **Erro (409):** Tentar cadastrar um usuário com CPF ou e-mail já existente.
- **`POST /api/auth/login`**
  - ✅ **Sucesso (200):** Logar com credenciais corretas. Deve retornar um Token JWT e dados essenciais do user.
  - ❌ **Erro (401):** Inserir uma senha errada ou e-mail inexistente (Erro genérico "Credenciais inválidas").
- **`POST /api/auth/logout`**
  - ✅ **Sucesso (200):** Invalida a sessão/token.

## 3. Users (Usuários)
- **`GET /api/users`**
  - ✅ **Sucesso (200):** (Apenas Admin) Deve listar todos os usuários da base.
  - ❌ **Erro (403/401):** Tentar acessar com um token de Cliente ou Colaborador (Validação de cargo).
- **`GET /api/users/:cpf`**
  - ✅ **Sucesso (200):** Deve exibir os dados de um usuário ativo específico.
  - ❌ **Erro (404):** Buscar um CPF inexistente.
- **`PUT /api/users/:cpf`**
  - ✅ **Sucesso (200):** Atualizar o endereço, e-mail ou senha do usuário.
  - ❌ **Erro (409):** Tentar atualizar para um e-mail que já pertence a outra pessoa.
- **`DELETE /api/users/:cpf`**
  - ✅ **Sucesso (200):** Realiza o *soft delete* do usuário no sistema. (Apenas Admin).
- **`PATCH /api/users/reactivate/:cpf`**
  - ✅ **Sucesso (200):** Reativa um usuário que sofreu *soft delete*. (Apenas Admin).

## 4. Pets
- **`POST /api/pets`**
  - ✅ **Sucesso (201):** Cadastrar um Pet vinculando o CPF do dono e validando se os Enums de espécie e tamanho funcionam em inglês.
  - ❌ **Erro (400):** Não enviar campos obrigatórios como `name` e `species`.
- **`GET /api/pets`**
  - ✅ **Sucesso (200):** Listar todos os pets. (Apenas Admin).
- **`GET /api/pets/meus-pets`**
  - ✅ **Sucesso (200):** O Cliente logado deve ver apenas a lista de pets cujo `user_cpf` é igual ao seu próprio.
- **`PUT /api/pets/:id`**
  - ✅ **Sucesso (200):** Modificar características específicas do Pet (como peso ou observações).
- **`DELETE /api/pets/:id`**
  - ✅ **Sucesso (200):** Deletar permanentemente o pet do banco.

## 5. Services (Serviços)
- **`POST /api/services`**
  - ✅ **Sucesso (201):** Cadastrar um novo tipo de serviço (ex: Banho VIP). (Apenas Admin).
  - ❌ **Erro (400):** Tentar enviar dados incompletos (sem `name` ou `description` interceptado no controller/service).
- **`GET /api/services`**
  - ✅ **Sucesso (200):** Qualquer usuário pode listar o cardápio de serviços (inclui tratamento automático para Base64 da imagem).
- **`PUT /api/services/:id`**
  - ✅ **Sucesso (200):** Modificar a descrição ou valor de um serviço já existente.
- **`DELETE /api/services/:id`**
  - ✅ **Sucesso (200):** Soft delete do serviço.
- **`PATCH /api/services/:id/reactivate`**
  - ✅ **Sucesso (200):** Retornar o serviço ao estado ativo.

## 6. Schedules (Agendamentos)
- **`POST /api/schedules`**
  - ✅ **Sucesso (201):** Marcar um agendamento com um array de IDs de `services`. Relação M:N salva e atrelada corretamente!
  - ❌ **Erro (400):** Não enviar campos obrigatórios interceptados pelo `Controller`.
- **`GET /api/schedules?initial_date=X&final_date=Y`**
  - ✅ **Sucesso (200):** 
    - **Cenário Admin (`Gerente`):** Traz a agenda completa de todos.
    - **Cenário Funcionario (`Colaborador`):** Traz a agenda *exclusiva* do colaborador que disparou a requisição.
    - **Cenário Cliente (`Cliente`):** Traz *exclusivamente* os agendamentos feitos por si próprio.
- **`GET /api/schedules/:id`**
  - ✅ **Sucesso (200):** Ver o extrato e detalhes completos do agendamento (Pets, Serviços vinculados, Colaborador e Cliente).
  - ❌ **Erro (403 - Forbidden):** Se um Cliente ou Colaborador tentar acessar o ID de um agendamento que pertence a outra pessoa.
- **`PUT /api/schedules/:id`**
  - ✅ **Sucesso (200):** Atualizar o status do agendamento (Ex: de `SCHEDULED` para `CONFIRMED` usando padrões de Enum) ou trocar os serviços (`services`).
- **`DELETE /api/schedules/:id`**
  - ✅ **Sucesso (200):** Deletar permanentemente o agendamento (Acesso controlado).
