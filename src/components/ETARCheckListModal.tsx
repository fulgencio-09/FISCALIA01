
import React, { useState } from 'react';
import { ETARReport, UserRole, ETARCheckList } from '../types';
import { TextAreaField } from '../components/FormComponents';

interface ETARCheckListModalProps {
  report: ETARReport;
  userRole: UserRole;
  onSave: (checkList: ETARCheckList) => void;
  onReturn: (observations: string) => void;
  onClose: () => void;
}

const CHECKLIST_ITEMS = [
  "Información de correspondencia completa y correcta",
  "Referencia del caso y misión coinciden con el sistema",
  "Concepto técnico debidamente sustentado",
  "Antecedentes verificados y documentados",
  "Diligencias practicadas descritas detalladamente",
  "Análisis de información y nexo causal coherente",
  "Factores diferenciales y de género identificados",
  "Ortografía y redacción técnica adecuada"
];

const ETARCheckListModal: React.FC<ETARCheckListModalProps> = ({ report, userRole, onSave, onReturn, onClose }) => {
  const [items, setItems] = useState(CHECKLIST_ITEMS.map(item => ({ item, cumple: true, observacion: '' })));
  const [generalObservations, setGeneralObservations] = useState('');
  const [isConforme, setIsConforme] = useState(true);

  const handleSave = () => {
    const checkList: ETARCheckList = {
      id: Math.random().toString(36).substr(2, 9),
      reportId: report.id,
      evaluatorRole: userRole,
      evaluatorName: userRole === 'SERVIDOR' ? 'Servidor de Revisión' : 'Líder Nacional',
      date: new Date().toISOString(),
      isConforme,
      observations: generalObservations,
      items
    };
    onSave(checkList);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="p-8 bg-slate-800 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Check List de Evaluación ETAR</h3>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Rol Evaluador: {userRole === 'SERVIDOR' ? 'Servidor' : 'Líder Nacional'}</p>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-50 transition-opacity">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Criterios de Evaluación</h4>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">{item.item}</p>
                    {!item.cumple && (
                      <input 
                        type="text" 
                        placeholder="Describa la inconsistencia..."
                        className="w-full mt-2 text-[10px] border-b border-slate-200 outline-none focus:border-indigo-500 py-1"
                        value={item.observacion}
                        onChange={e => {
                          const newItems = [...items];
                          newItems[idx].observacion = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => {
                        const newItems = [...items];
                        newItems[idx].cumple = true;
                        setItems(newItems);
                      }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${item.cumple ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}
                    >
                      Cumple
                    </button>
                    <button 
                      onClick={() => {
                        const newItems = [...items];
                        newItems[idx].cumple = false;
                        setItems(newItems);
                        setIsConforme(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${!item.cumple ? 'bg-rose-500 text-white shadow-md shadow-rose-100' : 'bg-slate-100 text-slate-400'}`}
                    >
                      No Cumple
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado General</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsConforme(true)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${isConforme ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-50' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                Conforme / Aprobado
              </button>
              <button 
                onClick={() => setIsConforme(false)}
                className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-2 transition-all ${!isConforme ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-50' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                No Conforme / Inconsistencias
              </button>
            </div>
            <TextAreaField 
              label="Observaciones Generales" 
              value={generalObservations} 
              onChange={e => setGeneralObservations(e.target.value)}
              placeholder="Escriba aquí sus comentarios adicionales sobre el informe..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
          
          {!isConforme ? (
            <button 
              onClick={() => onReturn(generalObservations)}
              className="px-10 py-3 bg-rose-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18-6-6 6-6"/></svg>
              Realizar Devolución
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="px-12 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Guardar Check List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETARCheckListModal;
