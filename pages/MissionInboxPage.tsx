
import React, { useState, useMemo } from 'react';
import { ProtectionMission } from '../types';

interface MissionInboxPageProps {
  missions: ProtectionMission[];
  onStartInterview: (mission: ProtectionMission) => void;
}

const MissionInboxPage: React.FC<MissionInboxPageProps> = ({ missions, onStartInterview }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Missions with status 'ASIGNADA' (Reassigned)
  const reassignedMissions = useMemo(() => {
    return missions.filter(m => m.status === 'ASIGNADA');
  }, [missions]);

  const filteredMissions = useMemo(() => {
    if (!searchTerm.trim()) return reassignedMissions;
    const term = searchTerm.toLowerCase();
    return reassignedMissions.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.petitionerName.toLowerCase().includes(term) ||
      m.petitionerDoc.includes(term)
    );
  }, [searchTerm, reassignedMissions]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bandeja de Misiones</h1>
          <p className="text-slate-500 font-medium italic">Listado de misiones reasignadas para ejecución de entrevista técnica.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar misión..." 
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
                <th className="px-8 py-6">Fecha Asignación</th>
                <th className="px-8 py-6">Misión No.</th>
                <th className="px-8 py-6">Candidato</th>
                <th className="px-8 py-6">Evaluador</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{m.reassignmentDate || m.creationDate}</td>
                    <td className="px-8 py-6 font-mono font-black text-indigo-700 text-sm">{m.missionNo}</td>
                    <td className="px-8 py-6">
                        <div className="font-black text-slate-900 uppercase text-[11px] leading-tight">{m.petitionerName}</div>
                        <div className="text-[9px] text-slate-400 font-bold">{m.petitionerDoc}</div>
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{m.assignedOfficial || 'POR ASIGNAR'}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <button 
                            onClick={() => onStartInterview(m)}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 mx-auto"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Crear Entrevista
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay misiones reasignadas en bandeja</p>
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

export default MissionInboxPage;
