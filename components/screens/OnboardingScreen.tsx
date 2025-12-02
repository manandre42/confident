import React from 'react';
import { User as UserIcon } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-2xl shadow-blue-900/50">
           <UserIcon size={40} className="text-white" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Really Confident</h1>
          <p className="text-slate-400 text-sm">Espaço seguro e anônimo.</p>
        </div>

        <div className="mt-12">
          <div className="flex space-x-2 justify-center items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          </div>
          <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest font-medium">Entrando...</p>
        </div>
      </div>
    </div>
  );
};