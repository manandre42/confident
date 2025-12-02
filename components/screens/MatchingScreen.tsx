import React from 'react';
import { User as UserIcon } from 'lucide-react';

interface MatchingScreenProps {
  onCancel: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-6 text-center">
      <div className="relative mb-8">
         <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
         <div className="w-24 h-24 rounded-full border-4 border-blue-50 border-t-blue-500 animate-spin relative z-10"></div>
         <div className="absolute inset-0 flex items-center justify-center z-20">
           <UserIcon size={32} className="text-blue-300" />
         </div>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Procurando alguém...</h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
        Buscando uma pessoa disposta a ouvir agora.<br/>Isso leva poucos segundos.
      </p>
      <button onClick={onCancel} className="mt-12 text-slate-400 text-sm hover:text-red-500 transition-colors font-medium">
        Cancelar busca
      </button>
    </div>
  );
};