# PetNet Postman Collection

Esta pasta contém a coleção oficial do Postman para testar a API do PetNet.

## Como usar

1.  **Importar**: Abra o Postman e clique em `Import`. Selecione o arquivo `petnet_collection.json`.
2.  **Variáveis**: A coleção já vem com a variável `baseUrl` configurada como `http://localhost:3000`. Você pode alterar esse valor nas configurações da coleção se necessário.
3.  **Autenticação**:
    *   A API utiliza **Cookies** para autenticação (o cookie `token` é definido no login/registro).
    *   O Postman gerencia cookies automaticamente. Basta realizar o **Login** ou **Register** e as chamadas subsequentes que requerem autenticação funcionarão automaticamente.
4.  **Fluxo Recomendado**:
    *   Execute o `Health Check` para garantir que o servidor está online.
    *   Use o endpoint `Register` ou `Login` para obter acesso.
    *   Explore os endpoints de `Users` e `Pets`.

## Endpoints Disponíveis

### Auth
*   `POST /api/auth/register`: Cadastro de novo usuário.
*   `POST /api/auth/login`: Autenticação.
*   `POST /api/auth/logout`: Encerramento de sessão.

### Users
*   `GET /api/users`: Lista todos os usuários (Requer tipo Gerente).
*   `GET /api/users/:user_cpf`: Busca dados de um usuário específico.
*   `PUT /api/users/:user_cpf`: Atualiza dados do usuário.
*   `DELETE /api/users/:user_cpf`: Remove o usuário (Soft Delete).
*   `PATCH /api/users/reactivate/:user_cpf`: Reativa um usuário deletado (Requer tipo Gerente).

### Pets
*   `GET /api/pets`: Lista todos os pets do sistema (Requer tipo Gerente).
*   `GET /api/pets/meus-pets`: Lista apenas os pets do usuário logado.
*   `GET /api/pets/:id`: Busca detalhes de um pet.
*   `POST /api/pets`: Cadastra um novo pet.
*   `PUT /api/pets/:id`: Atualiza dados do pet.
*   `DELETE /api/pets/:id`: Remove o pet.
