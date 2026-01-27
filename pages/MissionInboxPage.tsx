
import React, { useState, useMemo } from 'react';
import { ProtectionMission, UserRole } from '../types';

interface MissionInboxPageProps {
  missions: ProtectionMission[];
  userRole: UserRole;
  onStartInterview: (mission: ProtectionMission) => void;
  onStartITVR: (mission: ProtectionMission) => void;
  onViewMission: (mission: ProtectionMission) => void;
  onAcceptMission: (mission: ProtectionMission) => void;
  onRejectMission: (mission: ProtectionMission) => void;
}

const MissionInboxPage: React.FC<MissionInboxPageProps> = ({ 
  missions, 
  userRole,
  onStartInterview, 
  onStartITVR,
  onViewMission,
  onAcceptMission,
  onRejectMission
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Misiones en bandeja: Incluimos ASIGNADA (Creada), ACTIVA (Aceptada) y ANULADA (Rechazada) 
  const inboxMissions = useMemo(() => {
    return missions.filter(m => ['ASIGNADA', 'ACTIVA', 'ANULADA'].includes(m.status));
  }, [missions]);

  const filteredMissions = useMemo(() => {
    if (!searchTerm.trim()) return inboxMissions;
    const term = searchTerm.toLowerCase();
    return inboxMissions.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.petitionerName.toLowerCase().includes(term) ||
      m.petitionerDoc.includes(term)
    );
  }, [searchTerm, inboxMissions]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ASIGNADA': return { label: 'CREADA', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'ACTIVA': return { label: 'ACEPTADA', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'ANULADA': return { label: 'RECHAZADA', color: 'bg-rose-100 text-rose-700 border-rose-200' };
      default: return { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bandeja de Ordenes de Trabajo</h1>
          <p className="text-slate-500 font-medium italic">
            Ejecución de entrevista técnica y valoración de riesgo para órdenes de trabajo activas.
          </p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar orden..." 
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
                <th className="px-8 py-6">Orden No.</th>
                <th className="px-8 py-6">Candidato</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((m) => {
                  const statusInfo = getStatusDisplay(m.status);
                  const isInitial = m.status === 'ASIGNADA';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{m.reassignmentDate || m.creationDate}</td>
                      <td className="px-8 py-6 font-mono font-black text-indigo-700 text-sm">{m.missionNo}</td>
                      <td className="px-8 py-6">
                          <div className="font-black text-slate-900 uppercase text-[11px] leading-tight">{m.petitionerName}</div>
                          <div className="text-[9px] text-slate-400 font-bold">{m.petitionerDoc}</div>
                      </td>
                      <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${statusInfo.color}`}>
                              {statusInfo.label}
                          </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                              {isInitial || m.status === 'ACTIVA' ? (
                                <>
                                  <button 
                                      onClick={() => onStartInterview(m)}
                                      className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                      title="Crear Entrevista Técnica"
                                  >
                                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                      Entrevista
                                  </button>
                                  <button 
                                      onClick={() => onStartITVR(m)}
                                      className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                                      title="Valoración Técnica de Riesgo (Matriz ITVR)"
                                  >
                                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                      ITVR
                                  </button>
                                  <button 
                                      onClick={() => onViewMission(m)}
                                      className="bg-white text-slate-600 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white active:scale-95 transition-all border border-slate-200 flex items-center gap-2"
                                      title="Visualizar Orden"
                                  >
                                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                      Ver
                                  </button>
                                </>
                              ) : (
                                <span className="text-[9px] font-black text-slate-400 italic">PROCESO CERRADO</span>
                              )}
                          </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay órdenes registradas en bandeja</p>
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
