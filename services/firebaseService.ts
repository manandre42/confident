import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  orderBy, 
  limit,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { Message, MessageType } from '../types';

// Coleções
const ROOMS_COLLECTION = 'rooms';
const MESSAGES_COLLECTION = 'messages';

// --- MATCHING LOGIC ---

export const findOrCreateRoom = async (userId: string): Promise<{ roomId: string, status: 'waiting' | 'active', isCreator: boolean }> => {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  
  // 1. Tenta achar uma sala 'waiting' que NÃO foi criada por mim
  const q = query(
    roomsRef, 
    where("status", "==", "waiting"), 
    where("createdBy", "!=", userId), // Não entrar na própria sala
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Sala encontrada! Entrar nela.
    const roomDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, ROOMS_COLLECTION, roomDoc.id), {
      status: 'active',
      joinedBy: userId
    });
    return { roomId: roomDoc.id, status: 'active', isCreator: false };
  } else {
    // Nenhuma sala livre. Criar uma nova.
    const newRoom = await addDoc(roomsRef, {
      status: 'waiting',
      createdBy: userId,
      createdAt: serverTimestamp()
    });
    return { roomId: newRoom.id, status: 'waiting', isCreator: true };
  }
};

// --- LISTENERS ---

export const subscribeToRoomStatus = (roomId: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, ROOMS_COLLECTION, roomId), (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data());
    } else {
      callback(null); // Sala deletada
    }
  });
};

export const subscribeToMessages = (roomId: string, currentUserId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, ROOMS_COLLECTION, roomId, MESSAGES_COLLECTION);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.senderId === currentUserId ? 'me' : 'partner',
        senderId: data.senderId,
        content: data.content,
        type: data.type as MessageType,
        timestamp: data.createdAt ? data.createdAt.toDate() : new Date()
      };
    });
    callback(messages);
  });
};

// --- ACTIONS ---

export const sendMessageToFirebase = async (roomId: string, userId: string, content: string, type: MessageType = MessageType.TEXT) => {
  const messagesRef = collection(db, ROOMS_COLLECTION, roomId, MESSAGES_COLLECTION);
  await addDoc(messagesRef, {
    senderId: userId,
    content,
    type,
    createdAt: serverTimestamp()
  });
};

// --- AUTO DESTRUCTION ---

export const deleteChatRoom = async (roomId: string) => {
  if (!roomId) return;

  try {
    // 1. Deletar todas as mensagens da subcoleção (Firestore não deleta em cascata automaticamente no cliente)
    const messagesRef = collection(db, ROOMS_COLLECTION, roomId, MESSAGES_COLLECTION);
    const messagesSnapshot = await getDocs(messagesRef);
    
    const batch = writeBatch(db);
    messagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();

    // 2. Deletar a sala
    await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
    
  } catch (error) {
    console.error("Erro ao deletar sala:", error);
  }
};