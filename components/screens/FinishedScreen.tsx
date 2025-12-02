import React, { useState } from 'react';
import { HeartHandshake } from 'lucide-react';

interface FinishedScreenProps {
  onComplete: () => void;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({ onComplete }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = () => {
    setFeedbackGiven(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8 text-center animate-fade-in">
      
      {!feedbackGiven ? (
          <>
              <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Conversa Encerrada</h2>
                  <p className="text-slate-500 mb-12 text-sm max-w-[260px] mx-auto leading-relaxed">
                  Todo o histórico desta conversa foi apagado permanentemente para sua segurança.
                  </p>
              </div>

              <div className="w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <p className="text-sm font-medium text-slate-700 mb-8">Como se sente agora?</p>
                  <div className="flex justify-center gap-8">
                      <button 
                         onClick={handleFeedback} 
                         className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-2 active:scale-95 duration-300 focus:outline-none"
                      >
                          <span className="text-5xl filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">😊</span>
                          <span className="text-[10px] text-slate-400 font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Melhor</span>
                      </button>
                      
                      <button 
                         onClick={handleFeedback} 
                         className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-2 active:scale-95 duration-300 focus:outline-none"
                      >
                          <span className="text-5xl filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">😐</span>
                          <span className="text-[10px] text-slate-400 font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Igual</span>
                      </button>
                      
                      <button 
                         onClick={handleFeedback} 
                         className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-2 active:scale-95 duration-300 focus:outline-none"
                      >
                          <span className="text-5xl filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">😔</span>
                          <span className="text-[10px] text-slate-400 font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Pior</span>
                      </button>
                  </div>
              </div>
          </>
      ) : (
          <div className="flex flex-col items-center animate-scale-in">
               <div className="w-20 h-20 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-teal-200/50 animate-bounce">
                  <HeartHandshake size={36} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Obrigado por compartilhar</h3>
               <p className="text-slate-500 text-sm">Estamos te levando para o início...</p>
          </div>
      )}
    </div>
  );
};