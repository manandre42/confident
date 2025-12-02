import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Message, MessageType, ChatMode, User } from '../types';
import { startChatSession, sendMessageToAI } from '../services/geminiService';
import { censorText, containsPII } from '../services/utils';
import { 
  sendMessageToFirebase, 
  subscribeToMessages, 
  deleteChatRoom, 
  subscribeToRoomStatus 
} from '../services/firebaseService';

interface ChatInterfaceProps {
  mode: ChatMode;
  onEndChat: () => void;
  partnerName: string;
  roomId: string | null; // Null se for Expert
  user: User | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode, onEndChat, partnerName, roomId, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- LOGIC: EXPERT (AI) ---
  useEffect(() => {
    if (mode === ChatMode.EXPERT) {
      startChatSession(ChatMode.EXPERT);
      
      const initialGreeting = async () => {
        setIsTyping(true);
        setTimeout(async () => {
          try {
            const greeting = await sendMessageToAI(
              "(O usuário entrou na sala. Apresente-se brevemente como Conselheiro e ofereça escuta.)"
            );
            setMessages([{
              id: 'init',
              sender: 'partner',
              content: greeting,
              type: MessageType.TEXT,
              timestamp: new Date()
            }]);
          } finally {
            setIsTyping(false);
          }
        }, 1500);
      };
      initialGreeting();
    }
  }, [mode]);

  // --- LOGIC: STRANGER (FIREBASE) ---
  useEffect(() => {
    if (mode === ChatMode.STRANGER && roomId && user) {
      
      // 1. Escutar Mensagens
      const unsubscribeMessages = subscribeToMessages(roomId, user.id, (newMessages) => {
        setMessages(newMessages);
      });

      // 2. Escutar Status da Sala (Para detectar se o outro saiu/deletou)
      const unsubscribeRoom = subscribeToRoomStatus(roomId, (roomData) => {
        if (!roomData) {
          // Se roomData for null, a sala foi deletada (o outro saiu)
          alert("O outro usuário desconectou. A conversa foi apagada.");
          onEndChat(); // Isso vai levar para a tela FINISHED, mas sem chamar deleteChatRoom de novo
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeRoom();
      };
    }
  }, [mode, roomId, user, onEndChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- HANDLERS ---

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Safety Check
    if (containsPII(inputText)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }

    if (mode === ChatMode.EXPERT) {
      // AI Logic
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'me',
        content: inputText,
        type: MessageType.TEXT,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setIsTyping(true);

      try {
        const responseText = await sendMessageToAI(inputText);
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'partner',
          content: responseText,
          type: MessageType.TEXT,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, replyMessage]);
      } catch (error) {
         console.error(error);
      } finally {
        setIsTyping(false);
      }

    } else {
      // Firebase Logic
      if (roomId && user) {
        await sendMessageToFirebase(roomId, user.id, inputText, MessageType.TEXT);
        setInputText('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExitClick = async () => {
    if (mode === ChatMode.STRANGER && roomId) {
      // DELETAR TUDO
      await deleteChatRoom(roomId);
    }
    onEndChat();
  };

  // Simulated Audio (Mock for now, easy to replace with Blob in future)
  const handleAudioRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      
      // Send logic
      if (mode === ChatMode.EXPERT) {
         // Mock AI audio response
         const audioMsg: Message = { id: Date.now().toString(), sender: 'me', content: "15s", type: MessageType.AUDIO, timestamp: new Date() };
         setMessages(prev => [...prev, audioMsg]);
         setIsTyping(true);
         setTimeout(async () => {
           const responseText = await sendMessageToAI("[O usuário enviou áudio.]");
           setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'partner', content: responseText, type: MessageType.TEXT, timestamp: new Date() }]);
           setIsTyping(false);
         }, 2000);
      } else {
         // Firebase Mock Audio
         if (roomId && user) {
           await sendMessageToFirebase(roomId, user.id, "15s", MessageType.AUDIO);
         }
      }

    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${mode === ChatMode.EXPERT ? 'bg-teal-700 text-white' : 'bg-white text-slate-800 shadow-sm'} z-10`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === ChatMode.EXPERT ? 'bg-teal-600' : 'bg-gradient-to-tr from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
            {mode === ChatMode.EXPERT ? <ShieldCheck size={20} /> : <span className="font-bold text-lg">{partnerName.charAt(0).toUpperCase()}</span>}
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight">{partnerName}</h2>
            <p className={`text-xs ${mode === ChatMode.EXPERT ? 'text-teal-200' : 'text-slate-500'}`}>
              {mode === ChatMode.EXPERT ? 'Verificado • Seguro' : 'Online agora • Anônimo'}
            </p>
          </div>
        </div>
        <button onClick={handleExitClick} className={`p-2 rounded-full hover:bg-black/10 transition-colors`}>
          <X size={24} />
        </button>
      </div>

      {/* Warning Toast */}
      {showWarning && (
        <div className="absolute top-20 left-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-start gap-3 animate-bounce">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="font-bold">Segurança:</p>
            <p>Por favor, não compartilhe informações pessoais como telefone, email ou endereço. Mantenha seu anonimato.</p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-slate-400 my-4">
          <p>A conversa é criptografada e anônima.</p>
          <p>O histórico será apagado permanentemente ao sair.</p>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-5 py-3 text-[15px] shadow-sm ${
                msg.sender === 'me' 
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-[22px] rounded-br-none shadow-indigo-200' 
                  : (mode === ChatMode.EXPERT 
                      ? 'bg-white text-slate-700 border-l-4 border-teal-500 rounded-r-xl shadow-sm' 
                      : 'bg-white text-slate-800 rounded-[22px] rounded-bl-none border border-slate-100')
              }`}
            >
              {msg.type === MessageType.AUDIO ? (
                <div className="flex items-center gap-3 min-w-[140px]">
                  <button className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'me' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                     <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent ml-0.5"></div>
                  </button>
                  <div className="flex flex-col gap-1 w-full">
                     <div className="flex items-end gap-0.5 h-4 opacity-80">
                        <div className="w-1 bg-current h-2 rounded-full animate-pulse"></div>
                        <div className="w-1 bg-current h-4 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 bg-current h-3 rounded-full animate-pulse delay-150"></div>
                        <div className="w-1 bg-current h-2 rounded-full animate-pulse"></div>
                        <div className="w-1 bg-current h-3 rounded-full animate-pulse delay-100"></div>
                     </div>
                     <span className="text-[10px] opacity-70 font-medium">15s • Áudio</span>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              )}
              <span className={`text-[10px] block text-right mt-1.5 ${msg.sender === 'me' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2">
           <button 
             className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
             onClick={handleAudioRecord}
           >
             <Mic size={20} />
           </button>
           
           <div className="flex-1 bg-slate-100 rounded-[24px] px-4 py-2 min-h-[48px] flex items-center border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
             <textarea
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={isRecording ? "Gravando..." : "Digite sua mensagem..."}
               className="bg-transparent w-full outline-none text-slate-700 resize-none max-h-24 no-scrollbar text-[15px]"
               rows={1}
               disabled={isRecording}
             />
           </div>

           <button 
             onClick={handleSendMessage}
             disabled={!inputText.trim() && !isRecording}
             className={`p-3 rounded-full transition-all shadow-md ${
               inputText.trim() 
                 ? (mode === ChatMode.EXPERT ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200') 
                 : 'bg-slate-100 text-slate-300 shadow-none'
             }`}
           >
             <Send size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};