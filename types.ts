export interface User {
  id: string;
  username: string;
}

export enum MessageType {
  TEXT = 'text',
  AUDIO = 'audio',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  sender: 'me' | 'partner' | 'system';
  senderId?: string; // ID real do usuário para diferenciar no Firebase
  content: string; // Text content or Audio duration/placeholder
  type: MessageType;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  status: 'waiting' | 'active';
  createdBy: string;
  joinedBy?: string;
  createdAt: any; // Firestore Timestamp
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  MATCHING = 'MATCHING',
  CHAT = 'CHAT',
  EXPERT_INTRO = 'EXPERT_INTRO',
  EXPERT_CHAT = 'EXPERT_CHAT',
  FINISHED = 'FINISHED',
  HELP = 'HELP'
}

export enum ChatMode {
  STRANGER = 'STRANGER',
  EXPERT = 'EXPERT'
}