import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Vá em: Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh4adYbp_kMjXwiLUROf9wSnc4IQ_Y_cc",
  authDomain: "really-confident-chat.firebaseapp.com",
  databaseURL: "https://really-confident-chat-default-rtdb.firebaseio.com",
  projectId: "really-confident-chat",
  storageBucket: "really-confident-chat.firebasestorage.app",
  messagingSenderId: "53114981420",
  appId: "1:53114981420:web:d5a80f9e03bf72e4ee1589"
};

// Inicializa o Firebase
// Nota: Em um ambiente real, usamos variáveis de ambiente, 
// mas aqui deixamos a config exposta para facilitar a configuração inicial.
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export const auth = getAuth(app);
export const db = getFirestore(app);