import React, { useState, useEffect, useRef } from 'react';
import { AppView, ChatMode } from './types';
import { clearSession } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { useIdentity } from './hooks/useIdentity';
import { findOrCreateRoom, subscribeToRoomStatus } from './services/firebaseService';

// SCREENS
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MatchingScreen } from './components/screens/MatchingScreen';
import { ExpertIntroScreen } from './components/screens/ExpertIntroScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { FinishedScreen } from './components/screens/FinishedScreen';

const App: React.FC = () => {
  const { user, isInitializing, logout } = useIdentity();
  
  // App Navigation State
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  
  // Chat State
  const [partnerName, setPartnerName] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.STRANGER);
  const [roomId, setRoomId] = useState<string | null>(null);

  // Ref para guardar a assinatura do listener da sala
  const roomSubscriptionRef = useRef<(() => void) | null>(null);

  // Sync Onboarding/Home based on initialization
  useEffect(() => {
    if (!isInitializing && currentView === AppView.ONBOARDING) {
      setCurrentView(AppView.HOME);
    }
  }, [isInitializing, currentView]);

  // --- ACTIONS ---

  const startMatching = async () => {
    if (!user) return;
    
    setCurrentView(AppView.MATCHING);
    setChatMode(ChatMode.STRANGER);
    setPartnerName("Alguém"); // Nome genérico até conectar

    try {
      const { roomId: newRoomId, status, isCreator } = await findOrCreateRoom(user.id);
      setRoomId(newRoomId);

      if (status === 'active') {
        // Entrou numa sala existente
        setCurrentView(AppView.CHAT);
      } else {
        // Criou uma sala e está esperando (status === 'waiting')
        // Fica na tela MATCHING, mas escuta mudanças na sala
        roomSubscriptionRef.current = subscribeToRoomStatus(newRoomId, (roomData) => {
          if (roomData && roomData.status === 'active') {
             // Alguém entrou!
             setCurrentView(AppView.CHAT);
             // Limpa o listener de status pois o ChatInterface vai gerenciar agora
             if (roomSubscriptionRef.current) roomSubscriptionRef.current();
          }
        });
      }

    } catch (error) {
      console.error("Erro no matching:", error);
      alert("Erro ao conectar. Tente novamente.");
      setCurrentView(AppView.HOME);
    }
  };

  const cancelMatching = () => {
    // Se cancelar enquanto espera, idealmente deveríamos deletar a sala criada.
    // Simplificação: apenas volta para home. A sala ficará 'waiting' órfã (pode ser limpa por Cloud Functions depois)
    if (roomSubscriptionRef.current) roomSubscriptionRef.current();
    setRoomId(null);
    setCurrentView(AppView.HOME);
  };

  const startExpertSession = () => {
    setChatMode(ChatMode.EXPERT);
    setPartnerName("Conselheiro 24");
    setRoomId(null); // Expert não usa Firebase Rooms por enquanto (usa Gemini local)
    setCurrentView(AppView.CHAT);
  };

  const handleEndChat = () => {
    // Se for expert, limpa memória AI
    if (chatMode === ChatMode.EXPERT) {
      clearSession();
    }
    // Se for Firebase, a lógica de deletar está dentro do ChatInterface ou deve ser chamada aqui?
    // Vamos deixar o ChatInterface lidar com a chamada de deleteChatRoom, pois ele tem o roomId.
    
    setRoomId(null);
    setCurrentView(AppView.FINISHED);
  };

  const returnToHome = () => {
    setCurrentView(AppView.HOME);
  };

  // --- RENDERER (ROUTER) ---

  if (currentView === AppView.ONBOARDING || isInitializing) {
    return <OnboardingScreen />;
  }

  if (currentView === AppView.HOME) {
    return (
      <HomeScreen 
        user={user}
        onStartMatching={startMatching}
        onOpenExpertIntro={() => setCurrentView(AppView.EXPERT_INTRO)}
        onOpenHelp={() => setCurrentView(AppView.HELP)}
        onExit={logout}
      />
    );
  }

  if (currentView === AppView.HELP) {
    return (
      <HelpScreen 
        user={user}
        onBack={returnToHome}
      />
    );
  }

  if (currentView === AppView.MATCHING) {
    return <MatchingScreen onCancel={cancelMatching} />;
  }

  if (currentView === AppView.EXPERT_INTRO) {
    return (
      <ExpertIntroScreen 
        onBack={returnToHome}
        onStartSession={startExpertSession}
      />
    );
  }

  if (currentView === AppView.CHAT) {
    return (
      <ChatInterface 
        mode={chatMode} 
        partnerName={partnerName}
        roomId={roomId}
        user={user}
        onEndChat={handleEndChat} 
      />
    );
  }

  if (currentView === AppView.FINISHED) {
    return <FinishedScreen onComplete={returnToHome} />;
  }

  return null;
};

export default App;