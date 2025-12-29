
import React, { useState, useMemo } from 'react';
import { MOCK_SAVED_CASES, MOCK_OFFICIALS, REGIONAL_UNITS } from '../constants';
import { ProtectionMission, ProtectionCaseForm } from '../types';
import { InputField, SelectField, TextAreaField } from '../components/FormComponents';

interface AssignedMissionsPageProps {
  missions: ProtectionMission[];
  onUpdateMission: (mission: ProtectionMission) => void;
}

const AssignedMissionsPage: React.FC<AssignedMissionsPageProps> = ({ missions, onUpdateMission }) => {
  const [view, setView] = useState<'LIST' | 'EDIT' | 'DETAIL'>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);

  // FILTRO: Misiones NO PENDIENTES
  const assignedMissionsList = useMemo(() => {
    const casesMap = new Map(MOCK_SAVED_CASES.map(c => [c.radicado, c]));
    return missions
      .filter(m => m.status !== 'PENDIENTE')
      .map(m => {
        const caseData = casesMap.get(m.caseRadicado);
        return {
          ...m,
          subject: caseData?.subject || "EVALUACIÓN Y TRÁMITE DE PROTECCIÓN",
          caseId: caseData?.caseId || "N/A"
        };
      });
  }, [missions]);

  const filteredMissions = useMemo(() => {
    if (!searchTerm.trim()) return assignedMissionsList;
    const term = searchTerm.toLowerCase();
    return assignedMissionsList.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.caseRadicado.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, assignedMissionsList]);

  const handleAnular = (id: string) => {
    if (window.confirm("¿Está seguro de que desea anular esta misión? Esta acción no se puede deshacer.")) {
        const mission = missions.find(m => m.id === id);
        if (mission) {
            onUpdateMission({ ...mission, status: 'ANULADA' });
        }
    }
  };

  const handleEdit = (mission: ProtectionMission) => {
    setSelectedMission(mission);
    setView('EDIT');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMission) {
        onUpdateMission(selectedMission);
        setView('LIST');
    }
  };

  const StatusBadge = ({ status }: { status: ProtectionMission['status'] }) => {
    const styles = {
        'ACTIVA': 'bg-blue-50 text-blue-700 border-blue-200',
        'ASIGNADA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'FINALIZADA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'ANULADA': 'bg-slate-100 text-slate-500 border-slate-300',
        'PENDIENTE': 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${styles[status]}`}>
            {status}
        </span>
    );
  };

  if (view === 'EDIT' && selectedMission) {
      return (
          <div className="max-w-4xl mx-auto p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                      <h2 className="text-xl font-black uppercase">Editar Misión: {selectedMission.missionNo}</h2>
                      <button onClick={() => setView('LIST')} className="hover:opacity-70"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                  </div>
                  <form onSubmit={handleUpdate} className="p-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <SelectField 
                            label="Funcionario" 
                            options={MOCK_OFFICIALS} 
                            value={selectedMission.assignedOfficial || ''} 
                            onChange={e => setSelectedMission({...selectedMission, assignedOfficial: e.target.value})}
                          />
                          <SelectField 
                            label="Regional" 
                            options={REGIONAL_UNITS} 
                            value={selectedMission.regional || ''} 
                            onChange={e => setSelectedMission({...selectedMission, regional: e.target.value})}
                          />
                          <SelectField 
                            label="Estado de la Misión" 
                            options={['ACTIVA', 'ASIGNADA', 'FINALIZADA', 'ANULADA']} 
                            value={selectedMission.status} 
                            onChange={e => setSelectedMission({...selectedMission, status: e.target.value as any})}
                          />
                          <InputField 
                            label="Fecha de Vencimiento" 
                            type="date" 
                            value={selectedMission.dueDate} 
                            onChange={e => setSelectedMission({...selectedMission, dueDate: e.target.value})}
                          />
                      </div>
                      <TextAreaField 
                        label="Observaciones de Gestión" 
                        value={selectedMission.observations || ''} 
                        onChange={e => setSelectedMission({...selectedMission, observations: e.target.value})}
                      />
                      <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                          <button type="button" onClick={() => setView('LIST')} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                          <button type="submit" className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">Actualizar Misión</button>
                      </div>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Misiones Asignadas</h1>
          <p className="text-slate-500 font-medium italic">Seguimiento y control de misiones en ejecución y finalizadas.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por número o radicado..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <svg className="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Fecha Generación</th>
                <th className="px-8 py-6">Número Misión</th>
                <th className="px-8 py-6">Asunto</th>
                <th className="px-8 py-6">Radicado</th>
                <th className="px-8 py-6">No. Caso</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{m.creationDate}</td>
                    <td className="px-8 py-6 font-mono font-black text-blue-700 text-sm">{m.missionNo}</td>
                    <td className="px-8 py-6 text-[11px] font-black text-slate-900 uppercase leading-tight max-w-[180px]">{m.subject}</td>
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">{m.caseRadicado}</td>
                    <td className="px-8 py-6 font-mono text-xs font-black text-indigo-600">{m.caseId}</td>
                    <td className="px-8 py-6 text-center">
                        <StatusBadge status={m.status} />
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                             <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Visualizar"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                             <button onClick={() => handleAnular(m.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Anular"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg></button>
                             <button 
                                onClick={() => handleEdit(m)}
                                className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-black transition-all"
                             >
                                Editar
                             </button>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={7} className="px-8 py-20 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay misiones asignadas registradas</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedMissionsPage;
