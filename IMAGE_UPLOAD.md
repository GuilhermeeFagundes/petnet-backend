# IMAGE_UPLOAD.md - Guia de Implementação de Upload de Imagens

Este documento descreve os passos para implementar o armazenamento de imagens como BLOB no banco de dados utilizando Prisma e Node.js.

## 1. Alteração no Banco de Dados (Prisma)

Modifique o campo `picture_url` para sero tipo `Bytes` nos modelos `user` e `pet`.

```prisma
model user {
  // ... campos existentes
  picture_blob Bytes?
}

model pet {
  // ... campos existentes
  picture_blob Bytes?
}
```

Após alterar o arquivo `prisma/schema.prisma`, execute a migration:

```bash
npx prisma migrate dev --name add_picture_blob
```

## 2. Utilitários de Conversão

Crie o arquivo `src/utils/image.utils.js` para centralizar a lógica de conversão entre Base64 e Buffer.

```javascript
/**
 * Converte uma string Base64 (pode conter o prefixo data:image/...) para um Buffer do Node.js
 */
export const base64ToBuffer = (base64String) => {
    if (!base64String) return null;
    
    // Remove o prefixo se existir (ex: data:image/png;base64,)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(base64Data, "base64");
};

/**
 * Converte um Buffer do banco de dados para uma string Base64 (Data URI)
 */
export const bufferToBase64 = (buffer, mimeType = "image/png") => {
    if (!buffer) return null;
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
};
```

## 3. Fluxo de Criação e Edição (Create/Update)

No seu `Service`, importe o utilitário e converta o dado recebido do frontend antes de enviar para o `Repository`.

```javascript
// src/services/user.service.js
import { base64ToBuffer } from "../utils/image.utils.js";

export const createUserService = async (fullData) => {
    const { picture_base64, ...rest } = fullData;
    
    const userData = {
        ...rest,
        picture_blob: base64ToBuffer(picture_base64)
    };
    
    // ... lógica de persistência
};
```

## 4. Fluxo de Visualização (Show/List)

Ao retornar os dados para o frontend, você deve converter o `Buffer` de volta para Base64. Isso permite que o frontend use diretamente na tag `<img src="...">`.

```javascript
// src/controllers/user.controller.js
import { bufferToBase64 } from "../utils/image.utils.js";

export const showUserController = async (req, res) => {
    const user = await showUserService(req.params.user_cpf);
    
    if (user.picture_blob) {
        user.picture_base64 = bufferToBase64(user.picture_blob);
        delete user.picture_blob; // Opcional: remover o buffer bruto da resposta
    }
    
    return res.status(200).json(user);
};
```

## Boas Práticas Utilizadas

- **SOLID (Single Responsibility)**: A lógica de conversão está isolada em um utilitário.
- **DRY (Don't Repeat Yourself)**: O mesmo componente de utilitário é usado para `user` e `pet`.
- **KISS (Keep It Simple, Stupid)**: Uso nativo de `Buffer` do Node.js sem dependências externas complexas para manipulação básica de Base64.
