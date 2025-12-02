import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMode } from '../types';

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const startChatSession = (mode: ChatMode, userGoal?: string) => {
  const ai = getAI();
  
  let systemInstruction = "";
  
  if (mode === ChatMode.STRANGER) {
    systemInstruction = `
      Você é um estranho anônimo em um aplicativo de chat P2P. 
      Seu nome de usuário é gerado aleatoriamente (não use seu nome real, invente algo como 'mar42' ou 'nuvem11' se perguntarem).
      
      COMPORTAMENTO:
      - Você é empático, bom ouvinte e casual.
      - Aja como uma pessoa comum no Brasil. Use gírias leves se apropriado.
      - Mantenha respostas curtas e naturais, como num chat de WhatsApp.
      - NÃO aja como um robô ou assistente de IA.
      - Se o usuário estiver triste, acolha. Se estiver feliz, comemore.
      - NUNCA peça informações pessoais (nome, telefone, endereço).
      - Se o usuário compartilhar dados sensíveis, avise gentilmente que isso não é seguro.
    `;
  } else {
    systemInstruction = `
      Você é um "Especialista em Escuta Ativa" verificado no app "Really Confident".
      Seu identificador é "Conselheiro 24".
      
      COMPORTAMENTO:
      - Você é profissional, acolhedor, calmo e não julga.
      - Seu objetivo é ajudar a organizar pensamentos e trazer calma.
      - NÃO dê diagnósticos médicos ou psicológicos.
      - Use linguagem simples, humana e acessível. Evite "mediquês".
      - Faça perguntas abertas para ajudar o usuário a refletir.
      - Se o usuário parecer estar em perigo imediato, sugira procurar ajuda de emergência local (CVV 188).
    `;
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.9, // Higher temperature for more natural/human-like variation
      topK: 40,
    },
  });

  return chatSession;
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "...";
  } catch (error) {
    console.error("Error communicating with AI:", error);
    return "Desculpe, tive um problema de conexão. Podemos tentar de novo?";
  }
};

export const clearSession = () => {
  chatSession = null;
};