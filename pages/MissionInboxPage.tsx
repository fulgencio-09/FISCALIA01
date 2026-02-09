
import React, { useState, useMemo, useEffect } from 'react';
import { ProtectionMission, UserRole } from '../types';
import { MOCK_OFFICIALS, REGIONAL_UNITS, SECCIONES, MISSION_TYPES, EVALUATION_MISSION_TYPES, MISSION_CLASSIFICATIONS } from '../constants';
import { InputField, TextAreaField, SelectField, FileUpload } from '../components/FormComponents';

interface MissionInboxPageProps {
  missions: ProtectionMission[];
  userRole: UserRole;
  filterMode?: 'PENDING' | 'WORK' | 'CANCELED' | 'RETURNED';
  onStartInterview: (mission: ProtectionMission) => void;
  onStartITVR: (mission: ProtectionMission) => void;
  onViewMission: (mission: ProtectionMission) => void;
  onAcceptMission: (mission: ProtectionMission) => void;
  onRejectMission: (mission: ProtectionMission) => void;
  onUpdateMission: (mission: ProtectionMission) => void;
}

const PRORROGA_CAUSALES = [
  "Cuando se generen hechos sobrevinientes que requieran verificación.",
  "Caso fortuito o fuerza mayor que impida el desplazamiento del evaluador o del candidato a protección.",
  "Una vez agotados todos los procedimientos posibles para la ubicación del candidato y este se ubica con proximidad al vencimiento de la MT.",
  "Por dificultad del candidato a protección en suministrar documentación y trámites esenciales para la vinculación."
];

const MissionInboxPage: React.FC<MissionInboxPageProps> = ({ 
  missions, 
  userRole,
  filterMode = 'WORK',
  onStartInterview, 
  onStartITVR,
  onViewMission,
  onAcceptMission,
  onRejectMission,
  onUpdateMission
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<{ type: 'ASSIGN' | 'RETURN' | 'REASSIGN' | 'VIEW_REASON' | 'CANCEL' | 'REACTIVATE' | 'PRORROGA' | 'NONE', mission: ProtectionMission | null }>({ type: 'NONE', mission: null });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [successAlert, setSuccessAlert] = useState<{ show: boolean; message: string } | null>(null);
  
  // Form States
  const [returnReason, setReturnReason] = useState('');
  const [selectedOfficial, setSelectedOfficial] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [reactivateReason, setReactivateReason] = useState('');
  const [prorrogaReason, setProrrogaReason] = useState('');

  // Reassignment States (National Leader)
  const [reassignRegional, setReassignRegional] = useState('');
  const [reassignDate, setReassignDate] = useState(new Date().toISOString().split('T')[0]);
  const [reassignObservations, setReassignObservations] = useState('');

  useEffect(() => {
    if (successAlert?.show) {
      const timer = setTimeout(() => setSuccessAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successAlert]);

  const inboxMissions = useMemo(() => {
    switch (filterMode) {
      case 'PENDING':
        return missions.filter(m => m.status === 'ACTIVA');
      case 'CANCELED':
        return missions.filter(m => m.status === 'ANULADA');
      case 'RETURNED':
        return missions.filter(m => m.status === 'DEVUELTA');
      case 'WORK':
      default:
        if (userRole === 'LIDER_REGIONAL') {
            return missions.filter(m => ['ACTIVA', 'ASIGNADA'].includes(m.status));
        }
        if (userRole === 'USUARIO') {
            return missions.filter(m => m.status === 'ASIGNADA');
        }
        return missions.filter(m => ['ACTIVA', 'ASIGNADA'].includes(m.status));
    }
  }, [missions, filterMode, userRole]);

  const filteredMissions = useMemo(() => {
    if (!searchTerm.trim()) return inboxMissions;
    const term = searchTerm.toLowerCase();
    return inboxMissions.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.petitionerName.toLowerCase().includes(term) ||
      m.petitionerDoc.includes(term) ||
      m.caseRadicado.toLowerCase().includes(term)
    );
  }, [searchTerm, inboxMissions]);

  const closeModal = () => {
    setActiveModal({ type: 'NONE', mission: null });
    setShowCancelConfirm(false);
    setShowReactivateConfirm(false);
    setShowReturnConfirm(false);
    setReturnReason('');
    setSelectedOfficial('');
    setCancelReason('');
    setReactivateReason('');
    setReassignRegional('');
    setReassignObservations('');
    setProrrogaReason('');
  };

  const handleProcessAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal.mission || !selectedOfficial) return;
    
    onUpdateMission({
      ...activeModal.mission,
      status: 'ASIGNADA',
      assignedOfficial: selectedOfficial
    });
    setSuccessAlert({ show: true, message: `Orden ${activeModal.mission.missionNo} asignada correctamente.` });
    closeModal();
  };

  const handleProcessProrroga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal.mission || !prorrogaReason) return;

    const currentDue = new Date(activeModal.mission.dueDate);
    currentDue.setDate(currentDue.getDate() + 15);
    const newDueDate = currentDue.toISOString().split('T')[0];

    onUpdateMission({
      ...activeModal.mission,
      dueDate: newDueDate,
      extensionRequested: true,
      extensionReason: prorrogaReason,
      observations: `${activeModal.mission.observations || ''}\n[PRÓRROGA APLICADA - ${new Date().toLocaleDateString()}]: ${prorrogaReason}`
    });

    setSuccessAlert({ show: true, message: `Prórroga de 15 días concedida. Nuevo vencimiento: ${newDueDate}` });
    closeModal();
  };

  const handleFinalReturn = () => {
    if (!activeModal.mission) return;
    onUpdateMission({
      ...activeModal.mission,
      status: 'DEVUELTA',
      returnReason: returnReason
    });
    setSuccessAlert({ show: true, message: `Orden ${activeModal.mission.missionNo} devuelta al Nivel Central.` });
    closeModal();
  };

  const handleFinalAnular = () => {
    if (!activeModal.mission) return;
    const roleTag = userRole === 'LIDER' ? 'NACIONAL' : 'REGIONAL';
    onUpdateMission({
      ...activeModal.mission,
      status: 'ANULADA',
      observations: `${activeModal.mission.observations || ''}\n[ANULACIÓN POR LÍDER ${roleTag} - ${new Date().toLocaleDateString()}]: ${cancelReason}`
    });
    setSuccessAlert({ show: true, message: `Orden ${activeModal.mission.missionNo} anulada exitosamente.` });
    closeModal();
  };

  const handleFinalReactivate = () => {
    if (!activeModal.mission) return;
    const roleTag = userRole === 'LIDER' ? 'NACIONAL' : 'REGIONAL';
    onUpdateMission({
      ...activeModal.mission,
      status: 'ACTIVA',
      observations: `${activeModal.mission.observations || ''}\n[REACTIVACIÓN POR LÍDER ${roleTag} - ${new Date().toLocaleDateString()}]: ${reactivateReason}`
    });
    setSuccessAlert({ show: true, message: `Orden ${activeModal.mission.missionNo} reactivada correctamente.` });
    closeModal();
  };

  const handleProcessReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal.mission || !reassignRegional) return;
    onUpdateMission({
      ...activeModal.mission,
      status: 'ACTIVA',
      regional: reassignRegional,
      reassignmentDate: reassignDate,
      observations: `${activeModal.mission.observations || ''}\n[REASIGNACIÓN POST-DEVOLUCIÓN ${new Date().toLocaleDateString()}]: ${reassignObservations}`,
      returnReason: undefined, 
      assignedOfficial: undefined 
    });
    setSuccessAlert({ show: true, message: `Orden ${activeModal.mission.missionNo} reasignada a regional.` });
    closeModal();
  };

  const canRequestExtension = (mission: ProtectionMission) => {
    if (userRole !== 'LIDER_REGIONAL' || mission.extensionRequested) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(mission.dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 3;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'ACTIVA': 'bg-blue-100 text-blue-700 border-blue-200',
      'ASIGNADA': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'DEVUELTA': 'bg-amber-100 text-amber-700 border-amber-200',
      'ANULADA': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const labels: Record<string, string> = {
      'ACTIVA': 'PENDIENTE ASIGNACIÓN',
      'ASIGNADA': 'ASIGNADA',
      'DEVUELTA': 'DEVUELTA',
      'ANULADA': 'ANULADA',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const isAnyLeader = userRole === 'LIDER' || userRole === 'LIDER_REGIONAL';

  // Componente informativo de progreso para líderes
  const TechnicalProgress = ({ mission }: { mission: ProtectionMission }) => (
    <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Proceso Técnico</span>
            <div className="flex gap-1.5">
                <div title="Entrevista" className={`w-3 h-3 rounded-full flex items-center justify-center border ${mission.status === 'FINALIZADA' ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-100 border-slate-300'}`}>
                    {mission.status === 'FINALIZADA' && <svg width="6" height="6" fill="white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <div title="ITVR" className={`w-3 h-3 rounded-full flex items-center justify-center border ${mission.status === 'FINALIZADA' ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-100 border-slate-300'}`}>
                    {mission.status === 'FINALIZADA' && <svg width="6" height="6" fill="white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
            </div>
        </div>
        <div className="h-6 w-px bg-slate-100"></div>
        <div className="text-[8px] font-bold text-slate-400 italic">
            {mission.status === 'ACTIVA' ? 'Por iniciar' : mission.status === 'ASIGNADA' ? 'En ejecución' : 'Completado'}
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {pageTitles[filterMode].title}
          </h1>
          <p className="text-slate-500 font-medium italic">
            {pageTitles[filterMode].sub}
          </p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por Orden..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <svg className="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" cy="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {successAlert?.show && (
        <div className="mb-6 p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center gap-4 animate-in slide-in-from-top duration-300">
           <div className="bg-white/20 p-2 rounded-xl">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
           </div>
           <p className="text-sm font-bold uppercase tracking-tight flex-1">{successAlert.message}</p>
           <button onClick={() => setSuccessAlert(null)} className="hover:opacity-50 transition-opacity">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </button>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Orden No.</th>
                <th className="px-6 py-6">Vencimiento</th>
                <th className="px-6 py-6">Solicitante</th>
                {filterMode === 'PENDING' && <th className="px-6 py-6">Progreso</th>}
                <th className="px-6 py-6">Regional</th>
                <th className="px-6 py-6">Estado</th>
                <th className="px-6 py-6">Funcionario</th>
                <th className="px-6 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6 font-mono font-black text-blue-700">{m.missionNo}</td>
                  <td className="px-6 py-6">
                    <div className={`font-bold text-[10px] ${new Date(m.dueDate) <= new Date() ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>
                      {m.dueDate}
                      {m.extensionRequested && <span className="block text-[7px] text-indigo-500 font-black uppercase mt-0.5 tracking-tighter">Prórroga Solicitada</span>}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-black text-slate-900 uppercase text-[10px]">{m.petitionerName}</div>
                    <div className="text-[9px] text-slate-400 font-bold">{m.petitionerDoc}</div>
                  </td>
                  {filterMode === 'PENDING' && (
                    <td className="px-6 py-6">
                        <TechnicalProgress mission={m} />
                    </td>
                  )}
                  <td className="px-6 py-6 font-black text-[9px] uppercase text-indigo-600 max-w-[120px]">
                    {m.regional || <span className="text-slate-300 italic">No asignada</span>}
                  </td>
                  <td className="px-6 py-6"><StatusBadge status={m.status} /></td>
                  <td className="px-6 py-6 font-bold text-slate-600 text-[10px] uppercase">
                    {m.assignedOfficial || <span className="text-slate-300 italic">Sin asignar</span>}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {filterMode === 'PENDING' && canRequestExtension(m) && (
                        <button 
                          onClick={() => setActiveModal({ type: 'PRORROGA', mission: m })}
                          className="bg-amber-500 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-amber-600 transition-all shadow-md shadow-amber-100 flex items-center gap-1"
                        >
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 2v10M12 2L9 5M12 2l3 3M12 22a10 10 0 1 1 0-20"/></svg>
                          Prorroga
                        </button>
                      )}

                      {filterMode === 'CANCELED' && (
                        <>
                          <button 
                            onClick={() => setActiveModal({ type: 'VIEW_REASON', mission: m })}
                            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-slate-200 transition-all"
                          >
                            Ver Motivo
                          </button>
                          {isAnyLeader && (
                            <button 
                                onClick={() => setActiveModal({ type: 'REACTIVATE', mission: m })}
                                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
                            >
                                Reactivar
                            </button>
                          )}
                        </>
                      )}

                      {filterMode === 'RETURNED' ? (
                        <>
                          <div className="flex gap-1">
                            <button 
                                onClick={() => setActiveModal({ type: 'VIEW_REASON', mission: m })}
                                className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Ver Motivo
                            </button>
                            {isAnyLeader && (
                                <>
                                    {userRole === 'LIDER' && (
                                      <button 
                                          onClick={() => setActiveModal({ type: 'REASSIGN', mission: m })}
                                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-indigo-700 transition-all shadow-sm"
                                      >
                                          Reasignar
                                      </button>
                                    )}
                                    <button 
                                        onClick={() => setActiveModal({ type: 'CANCEL', mission: m })}
                                        className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-rose-700 transition-all shadow-sm"
                                    >
                                        Anular
                                    </button>
                                </>
                            )}
                          </div>
                          <button 
                            onClick={() => onViewMission(m)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          </button>
                        </>
                      ) : (filterMode === 'WORK' || filterMode === 'PENDING') && (
                        <>
                          <div className="flex gap-1 items-center">
                            {/* BOTONES TÉCNICOS: SOLO PERFIL USUARIO */}
                            {(m.status === 'ASIGNADA' || m.status === 'ACTIVA') && (userRole === 'USUARIO') && (
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => onStartInterview(m)}
                                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                                >
                                  Entrevista
                                </button>
                                <button 
                                  onClick={() => onStartITVR(m)}
                                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1"
                                >
                                  ITVR
                                </button>
                              </div>
                            )}

                            {isAnyLeader && (
                                <button 
                                  onClick={() => setActiveModal({ type: 'CANCEL', mission: m })}
                                  className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-rose-700 transition-all shadow-sm"
                                >
                                  Anular
                                </button>
                            )}
                            
                            {userRole === 'LIDER_REGIONAL' && m.status === 'ACTIVA' && (
                                <>
                                    <button 
                                      onClick={() => setActiveModal({ type: 'ASSIGN', mission: m })}
                                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                    >
                                      Asignar
                                    </button>
                                    <button 
                                      onClick={() => setActiveModal({ type: 'RETURN', mission: m })}
                                      className="bg-amber-600 text-white px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-amber-700 transition-all"
                                    >
                                      Devolver
                                    </button>
                                </>
                            )}
                          </div>
                          <button 
                            onClick={() => onViewMission(m)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: VER MOTIVO (ANULACIÓN / DEVOLUCIÓN / REASIGNACIÓN) */}
      {activeModal.type === 'VIEW_REASON' && activeModal.mission && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-slate-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Detalle de Justificación</h3>
                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission.missionNo}</p>
              </div>
              <button onClick={closeModal} className="text-white hover:opacity-50 transition-opacity"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              {activeModal.mission.status === 'DEVUELTA' ? (
                <div>
                   <span className="text-[10px] font-black text-blue-600 uppercase block mb-2 tracking-widest">Motivo de Devolución a Nivel Central:</span>
                   <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-slate-800 text-sm font-medium leading-relaxed italic">
                      {activeModal.mission.returnReason || "Sin motivo registrado explícitamente."}
                   </div>
                </div>
              ) : activeModal.mission.status === 'ANULADA' ? (
                <div>
                   <span className="text-[10px] font-black text-rose-600 uppercase block mb-2 tracking-widest">Justificación de Anulación:</span>
                   <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-slate-800 text-sm font-medium leading-relaxed italic">
                      {activeModal.mission.observations?.split('[ANULACIÓN')[1]?.split(']')[1] || "Sin motivo registrado en observaciones."}
                   </div>
                </div>
              ) : (
                <div>
                   <span className="text-[10px] font-black text-indigo-600 uppercase block mb-2 tracking-widest">Nota de Gestión:</span>
                   <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-slate-800 text-sm font-medium leading-relaxed italic">
                      {activeModal.mission.observations || "Sin historial disponible."}
                   </div>
                </div>
              )}
              
              <div>
                 <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Historial de Observaciones Completas:</span>
                 <div className="max-h-40 overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-mono text-slate-500 whitespace-pre-wrap">
                    {activeModal.mission.observations || "Sin observaciones adicionales registradas."}
                 </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end border-t border-slate-100">
              <button onClick={closeModal} className="px-10 py-3 bg-slate-900 text-white font-black rounded-xl uppercase text-[10px] tracking-widest">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REACTIVAR ORDEN */}
      {activeModal.type === 'REACTIVATE' && activeModal.mission && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Reactivación de Misión ({userRole === 'LIDER' ? 'Líder Nacional' : 'Líder Regional'})</h3>
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission.missionNo}</p>
              </div>
              <button onClick={closeModal} className="text-white hover:opacity-50 transition-opacity"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              <TextAreaField 
                label="Justificación de la Reactivación" 
                required 
                value={reactivateReason} 
                onChange={e => setReactivateReason(e.target.value)}
                placeholder="Indique los motivos técnicos para reactivar esta orden..."
                className="min-h-[150px]"
              />
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
               {!showReactivateConfirm ? (
                 <button onClick={() => setShowReactivateConfirm(true)} className="px-12 py-3 bg-emerald-700 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200">Procesar Reactivación</button>
               ) : (
                 <div className="flex items-center gap-4 animate-in slide-in-from-right-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">¿Confirma reactivar esta orden?</span>
                    <button onClick={() => setShowReactivateConfirm(false)} className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">No</button>
                    <button onClick={handleFinalReactivate} className="px-8 py-2 bg-slate-900 text-white font-black rounded-lg uppercase text-[10px] tracking-widest">Sí, Reactivar</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SOLICITAR PRORROGA */}
      {activeModal.type === 'PRORROGA' && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleProcessProrroga} className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-amber-500 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Solicitud de Prórroga</h3>
                <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission?.missionNo}</p>
              </div>
              <button type="button" onClick={closeModal} className="text-white hover:opacity-50 transition-opacity"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-[11px] font-medium text-blue-800 leading-relaxed italic">
                De acuerdo con la normativa, la prórroga otorga 15 días calendario adicionales. Esta opción solo puede ser utilizada una vez.
              </div>
              <SelectField 
                label="Causal de la Solicitud de Prórroga" 
                options={PRORROGA_CAUSALES} 
                required 
                value={prorrogaReason}
                onChange={e => setProrrogaReason(e.target.value)}
              />
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Nuevo Vencimiento Estimado:</span>
                  <span className="text-sm font-black text-slate-800">
                    {activeModal.mission ? (() => {
                      const d = new Date(activeModal.mission.dueDate);
                      d.setDate(d.getDate() + 15);
                      return d.toISOString().split('T')[0];
                    })() : '-'}
                  </span>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
              <button type="button" onClick={closeModal} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Descartar</button>
              <button type="submit" className="px-12 py-3 bg-amber-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-amber-200 active:scale-95 transition-all">Formalizar Prórroga</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: REASIGNAR (Líder Nacional) */}
      {activeModal.type === 'REASSIGN' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleProcessReassign} className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Reasignación de Orden</h3>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission?.missionNo}</p>
              </div>
              <button type="button" onClick={closeModal} className="text-white hover:opacity-50 transition-opacity"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <SelectField label="Regional Destino" options={REGIONAL_UNITS} required value={reassignRegional} onChange={e => setReassignRegional(e.target.value)} />
                 <InputField label="Fecha de Reasignación" type="date" value={reassignDate} onChange={e => setReassignDate(e.target.value)} />
              </div>
              <TextAreaField 
                label="Observaciones de la Reasignación" 
                required 
                value={reassignObservations} 
                onChange={e => setReassignObservations(e.target.value)}
                placeholder="Instrucciones para la nueva regional..."
                className="min-h-[120px]"
              />
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
              <button type="button" onClick={closeModal} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              <button type="submit" className="px-12 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200">Confirmar Reasignación</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ASIGNAR FUNCIONARIO (REGIONAL) */}
      {activeModal.type === 'ASSIGN' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleProcessAssign} className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Asignar Funcionario Evaluador</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Orden No. {activeModal.mission?.missionNo}</p>
            </div>
            <div className="p-8">
              <SelectField 
                label="Seleccione el evaluador responsable" 
                options={MOCK_OFFICIALS} 
                required 
                value={selectedOfficial}
                onChange={e => setSelectedOfficial(e.target.value)}
              />
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4">
              <button type="button" onClick={closeModal} className="px-6 py-2 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100">Confirmar Asignación</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: DEVOLVER ORDEN (REGIONAL A NACIONAL) */}
      {activeModal.type === 'RETURN' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-amber-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Devolución a Nivel Central</h3>
                <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission?.missionNo}</p>
              </div>
              <button onClick={closeModal} className="text-white hover:opacity-50"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              <TextAreaField 
                label="Motivo detallado de la devolución" 
                required 
                value={returnReason} 
                onChange={e => setReturnReason(e.target.value)}
                placeholder="Indique las razones técnicas o administrativas por las cuales se devuelve la misión..."
                className="min-h-[150px]"
              />
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
               {!showReturnConfirm ? (
                 <button onClick={() => setShowReturnConfirm(true)} className="px-12 py-3 bg-amber-700 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-amber-200">Procesar Devolución</button>
               ) : (
                 <div className="flex items-center gap-4 animate-in slide-in-from-right-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">¿Confirma el retorno de la orden?</span>
                    <button onClick={() => setShowReturnConfirm(false)} className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">No</button>
                    <button onClick={handleFinalReturn} className="px-8 py-2 bg-slate-900 text-white font-black rounded-lg uppercase text-[10px] tracking-widest">Sí, Confirmar</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ANULAR ORDEN */}
      {activeModal.type === 'CANCEL' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-rose-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Anulación de Orden de Trabajo</h3>
                <p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest">Orden de Trabajo No. {activeModal.mission?.missionNo}</p>
              </div>
              <button onClick={closeModal} className="text-white hover:opacity-50"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="p-10 space-y-6">
              <TextAreaField 
                label="Justificación de la Anulación" 
                required 
                value={cancelReason} 
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Diligencie los motivos de la anulación permanente del documento..."
                className="min-h-[150px]"
              />
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
               {!showCancelConfirm ? (
                 <button onClick={() => setShowCancelConfirm(true)} className="px-12 py-3 bg-rose-700 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-rose-200">Ejecutar Anulación</button>
               ) : (
                 <div className="flex items-center gap-4 animate-in slide-in-from-right-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">¿Está seguro de anular permanentemente la orden?</span>
                    <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">No</button>
                    <button onClick={handleFinalAnular} className="px-8 py-2 bg-slate-900 text-white font-black rounded-lg uppercase text-[10px] tracking-widest">Sí, Anular</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const pageTitles = {
  'PENDING': { title: 'Bandeja de Trabajos Pendiente', sub: 'Gestión de órdenes esperando asignación inicial y seguimiento de términos.' },
  'WORK': { title: 'Bandeja de Órdenes', sub: 'Gestión de órdenes de trabajo en ejecución y seguimiento institucional.' },
  'CANCELED': { title: 'Bandeja de Órdenes Anuladas', sub: 'Historial de misiones canceladas que pueden ser reactivadas por el Nivel Central o Regional.' },
  'RETURNED': { title: 'Bandeja de Órdenes Devueltas', sub: 'Misiones retornadas por la regional para reasignación o anulación por los Líderes.' }
};

export default MissionInboxPage;
