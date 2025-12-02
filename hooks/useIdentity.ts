import { useState, useEffect } from 'react';
import { User } from '../types';
import { generateUsername } from '../services/utils';
import { signInAnonymously, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export const useIdentity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Escuta mudanças na autenticação do Firebase (Login/Logout/Recarregamento)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuário está logado no Firebase
        // Recupera ou cria um username local (já que Auth Anônimo não salva dados customizados nativamente sem Firestore)
        let storedUsername = localStorage.getItem('rc_username');
        
        if (!storedUsername) {
          storedUsername = generateUsername();
          localStorage.setItem('rc_username', storedUsername);
        }

        setUser({
          id: firebaseUser.uid, // ID seguro do Firebase
          username: storedUsername
        });
        
        // Pequeno delay para a UI não piscar muito rápido
        setTimeout(() => setIsInitializing(false), 1000);
      } else {
        // Usuário não está logado, tenta logar anonimamente
        signInAnonymously(auth)
          .catch((error) => {
            console.error("Erro ao entrar anonimamente no Firebase:", error);
            // Fallback: Se o Firebase falhar (ex: sem chaves de config), avisa no console
            // Para não quebrar o app totalmente, poderíamos usar o mock aqui,
            // mas é melhor que o erro apareça para forçar a configuração correta.
            setIsInitializing(false);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (window.confirm("Deseja sair? Isso apagará sua identidade atual.")) {
      try {
        // Remove dados locais
        localStorage.removeItem('rc_username');
        // Desloga do Firebase
        await signOut(auth);
        // O onAuthStateChanged vai disparar e logar de novo com um NOVO UID (nova identidade)
        window.location.reload();
      } catch (error) {
        console.error("Erro ao sair:", error);
      }
    }
  };

  return { user, isInitializing, logout };
};