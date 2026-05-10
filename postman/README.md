# PetNet API - Postman Collection & Guia de Testes

Este diretório contém a coleção oficial do Postman para a API PetNet e este guia detalhado para execução de testes manuais e fluxos de negócio.

## 🚀 Como começar

1. **Importar a Collection**: Importe o arquivo `petnet_collection.json` no seu Postman.
2. **Configurar Variáveis**: A coleção utiliza variáveis de coleção para facilitar os testes. Certifique-se de que os valores iniciais estão corretos:
   - `baseUrl`: Endereço da API (padrão: `http://localhost:3000`).
   - `adminCpf`: CPF de um usuário com perfil `Gerente`.
   - `clientCpf`: CPF de um usuário com perfil `Cliente`.
   - `resetToken`: Token gerado no fluxo de recuperação de senha.

3. **Autenticação**: A API utiliza cookies para gerenciar a sessão (`token`). Ao realizar o login ou registro, o Postman salvará automaticamente o cookie e o enviará nas requisições subsequentes.

---

## 🧪 Casos de Teste e Cenários

### 1. Fluxo de Autenticação e Conta
| Cenário | Método/Endpoint | Objetivo | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Registro de Cliente** | `POST /api/auth/register` | Criar nova conta de cliente | Usuário criado (201) e cookie definido. |
| **Login com Sucesso** | `POST /api/auth/login` | Acessar o sistema | Mensagem de sucesso (200) e dados do usuário. |
| **Login Inválido** | `POST /api/auth/login` | Tentar login com senha errada | Erro de credenciais (401). |
| **Logout** | `POST /api/auth/logout` | Encerrar sessão | Sessão encerrada e cookie limpo (200). |

### 2. Fluxo de Recuperação de Senha
| Cenário | Método/Endpoint | Objetivo | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Esqueci Senha** | `POST /api/auth/forgot-password` | Solicitar token de reset | Mensagem confirmando envio (200). |
| **Reset de Senha** | `POST /api/auth/reset-password` | Definir nova senha | Senha alterada com sucesso (200). |
| **Token Inválido** | `POST /api/auth/reset-password` | Usar token expirado/errado | Erro de token inválido (401). |

### 3. Gerenciamento de Usuários (Admin)
| Cenário | Método/Endpoint | Objetivo | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Listar Todos** | `GET /api/users` | Ver todos os cadastros | Lista completa de usuários (200). |
| **Criar Colaborador** | `POST /api/users` | Admin criando funcionário | Novo usuário criado pelo admin (201). |
| **Acesso Negado** | `GET /api/users` | Cliente tentando listar todos | Erro de permissão (403). |
| **Soft Delete** | `DELETE /api/users/:cpf` | Desativar conta | Usuário marcado como excluído (200). |
| **Reativação** | `PATCH /api/users/reactivate/:cpf` | Restaurar conta | Usuário ativo novamente (200). |

### 4. Gerenciamento de Pets
| Cenário | Método/Endpoint | Objetivo | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Criar Pet** | `POST /api/pets` | Cadastrar novo animal | Pet cadastrado e vinculado ao tutor (201). |
| **Listar Meus Pets** | `GET /api/pets/meus-pets` | Cliente vendo seus pets | Lista apenas os pets do usuário logado (200). |
| **Ver Pet de Outro** | `GET /api/pets/:id` | Tentar ver pet de outro cliente | Erro de permissão (403). |
| **Atualizar Dados** | `PUT /api/pets/:id` | Alterar peso ou observações | Dados atualizados no banco (200). |

### 5. Catálogo de Serviços
| Cenário | Método/Endpoint | Objetivo | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Listar Públicos** | `GET /api/services` | Ver serviços disponíveis | Lista de serviços ativos (200). |
| **Criar Serviço** | `POST /api/services` | Admin adicionar novo serviço | Serviço criado com descrição e imagem (201). |
| **Desativar Serviço** | `DELETE /api/services/:id` | Remover do catálogo | Serviço com `excluded_at` preenchido (200). |

### 6. Fluxo de Agendamento (Completo)
1. **Listar Serviços**: Identificar os IDs dos serviços desejados.
2. **Criar Agendamento**: `POST /api/schedules`
   - Enviar `client_cpf`, `pet_id`, `date_time` e array de `services`.
   - ✅ **Sucesso**: Retorna o agendamento com status `SCHEDULED`.
3. **Consultar Agenda**: `GET /api/schedules`
   - Aplicar filtros `initial_date` e `final_date`.
4. **Confirmar/Alterar**: `PUT /api/schedules/:id`
   - Mudar status para `CONFIRMED` ou `FINISHED`.
5. **Cancelar**: `DELETE /api/schedules/:id` ou atualizar status para `CANCELED`.

---

## 🛠 Boas Práticas na Coleção

- **Variáveis Dinâmicas**: Usamos `{{$randomFullName}}`, `{{$randomEmail}}`, etc., para gerar dados diferentes em cada teste.
- **Scripts de Teste**: 
  - O request de **Login** salva automaticamente o `userCpf` nas variáveis de coleção.
  - O request de **Create Pet** salva o `petId` recém-criado para uso nos endpoints de `Update` e `Delete`.
- **Bodies Pré-configurados**: Todos os corpos de requisição (`POST`/`PUT`) estão preenchidos com exemplos que seguem os Enums do banco de dados (ex: `ONE_HOUR`, `dog`, `L`).
