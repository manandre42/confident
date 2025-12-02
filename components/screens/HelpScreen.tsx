import React from 'react';
import { ArrowLeft, Shield, HeartHandshake, AlertTriangle } from 'lucide-react';
import { User } from '../../types';

interface HelpScreenProps {
  user: User | null;
  onBack: () => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({ user, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h2 className="font-bold text-lg text-slate-800">Ajuda & Segurança</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        <section>
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Shield size={20} />
            <h3 className="font-bold">Segurança e Anonimato</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 space-y-3">
            <p><strong>Como funciona o anonimato?</strong><br/>Você não usa email, telefone ou nome real. O app gera um apelido (ex: @{user?.username}) para você.</p>
            <p><strong>Minhas conversas são salvas?</strong><br/>Não. Assim que você clica em "Sair" ou "Terminar Conversa", todo o histórico é apagado permanentemente de todos os dispositivos.</p>
            <p><strong>Censura automática:</strong><br/>Nosso sistema bloqueia automaticamente tentativas de enviar nomes reais, telefones ou endereços para sua proteção.</p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-teal-600">
            <HeartHandshake size={20} />
            <h3 className="font-bold">Comunidade</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 space-y-3">
            <p><strong>O que é o Really Confident?</strong><br/>É um lugar para conversar casualmente, desabafar e ser ouvido sem julgamentos.</p>
            <p><strong>Regras de Ouro:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Seja gentil e respeitoso.</li>
              <li>Não peça dados pessoais.</li>
              <li>Não compartilhe seus dados pessoais.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Emergências (Angola)</h3>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm text-slate-700">
            <p className="mb-2">Este aplicativo <strong>não é terapia</strong> e não substitui ajuda profissional médica.</p>
            <p>Se você ou alguém estiver em perigo imediato, ligue para os serviços de emergência.</p>
            <div className="mt-4 font-bold text-red-700 bg-white p-3 rounded-lg text-center border border-red-100">
              Emergência (CISP): Ligue 111
              <span className="block text-xs font-normal text-slate-500 mt-1">Atendimento de Emergência Nacional</span>
            </div>
          </div>
        </section>

        <div className="text-center text-xs text-slate-400 pt-4">
          Versão 1.1.0 • Really Confident
        </div>
      </div>
    </div>
  );
};