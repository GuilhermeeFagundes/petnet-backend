
 /** Converte uma string Base64(pode conter o prefixo data: image /...) para um Buffer do Node.js
  */
export const base64ToBuffer = (base64String) => {
    if (!base64String) return null;

    // Remove o prefixo se existir (ex: data:image/png;base64,)
    // O regex agora é mais robusto para diferentes extensões
    const base64Data = base64String.replace(/^data:image\/[a-z+]+;base64,/, "");
    return Buffer.from(base64Data, "base64");
};

/**
 * Converte um Buffer do banco de dados para uma string Base64 (Data URI)
 */
export const bufferToBase64 = (buffer, mimeType = "image/png") => {
  if (!buffer) return null;
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};
