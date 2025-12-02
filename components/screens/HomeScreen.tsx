import React from 'react';
import { User } from '../../types';
import { Button } from '../Button';
import { MessageCircle, Sparkles, HelpCircle, LogOut } from 'lucide-react';

interface HomeScreenProps {
  user: User | null;
  onStartMatching: () => void;
  onOpenExpertIntro: () => void;
  onOpenHelp: () => void;
  onExit: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  user, 
  onStartMatching, 
  onOpenExpertIntro, 
  onOpenHelp, 
  onExit 
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex-1 px-6 pt-10 pb-6 flex flex-col justify-center overflow-y-auto no-scrollbar">
        
        <div className="mb-8 text-center">
           <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-medium mb-6">
              Sua identidade: <span className="text-blue-600 font-bold text-sm ml-1">@{user?.username}</span>
           </div>
           <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Olá, {user?.username}.</h1>
           <p className="text-slate-500 leading-relaxed text-sm max-w-xs mx-auto">
             Precisa desabafar ou apenas conversar? Escolha como quer ser ouvido hoje.
           </p>
        </div>

        <div className="space-y-4">
          <Button onClick={onStartMatching} fullWidth className="h-28 text-lg shadow-lg shadow-blue-200/50 border border-blue-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-10 transform group-hover:scale-110 transition-transform">
               <MessageCircle size={80} />
             </div>
             <MessageCircle className="mr-3 shrink-0" size={28} />
             <div className="text-left relative z-10">
               <span className="block font-bold text-xl">Falar agora</span>
               <span className="block text-xs font-normal opacity-90 mt-1">Chat anônimo com alguém aleatório</span>
             </div>
          </Button>

          <Button onClick={onOpenExpertIntro} variant="secondary" fullWidth className="h-24 border-slate-200 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
             <Sparkles className="mr-3 text-teal-600 shrink-0" size={24} />
             <div className="text-left">
               <span className="block font-semibold text-slate-700">Espaço Guiado</span>
               <span className="block text-xs text-slate-400 mt-1">Apoio extra com especialistas</span>
             </div>
          </Button>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="bg-white border-t border-slate-100 p-4 flex justify-around pb-6">
         <button 
           onClick={onOpenHelp}
           className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-600 transition-colors"
         >
           <HelpCircle size={22} />
           <span className="text-[10px] font-medium">Ajuda</span>
         </button>
         
         <button 
           onClick={onExit}
           className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-red-500 transition-colors"
         >
           <LogOut size={22} />
           <span className="text-[10px] font-medium">Sair</span>
         </button>
      </div>
    </div>
  );
};