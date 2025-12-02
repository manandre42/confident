import React from 'react';
import { Button } from '../Button';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface ExpertIntroScreenProps {
  onBack: () => void;
  onStartSession: () => void;
}

export const ExpertIntroScreen: React.FC<ExpertIntroScreenProps> = ({ onBack, onStartSession }) => {
  return (
    <div className="flex flex-col h-full bg-teal-50">
      <div className="p-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 mb-4 rounded-full hover:bg-teal-100/50 transition-colors w-fit">
          <ArrowLeft size={24} />
        </button>
        
        <div className="mb-8">
          <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 mb-5 shadow-sm">
             <Sparkles size={28} />
          </div>
          <h1 className="text-2xl font-bold text-teal-900 mb-3">Apoio Extra</h1>
          <p className="text-teal-800/70 leading-relaxed text-sm">
            Às vezes, conversar com alguém treinado pode ajudar a clarear as ideias, organizar pensamentos e trazer calma.
            <br/><br/>
            Aqui você fala com especialistas (conselheiros) de forma segura, humana e sem julgamentos. Como um amigo experiente.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-teal-100 mb-8">
          <h3 className="font-semibold text-teal-900 text-sm mb-3">Como funciona:</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 text-[10px]">✓</div>
              <span>Profissionais verificados</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 text-[10px]">✓</div>
              <span>Foco em escuta ativa e orientação</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 text-[10px]">✓</div>
              <span>Totalmente confidencial</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-auto p-6 bg-white border-t border-teal-100 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
         <Button onClick={onStartSession} variant="expert" fullWidth>
           Conversar com Especialista
         </Button>
         <p className="text-center text-[10px] text-slate-400 mt-3">
           Não substitui tratamento clínico. Em caso de emergência, ligue 111 (Angola).
         </p>
      </div>
    </div>
  );
};