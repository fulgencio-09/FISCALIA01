
import React, { useState, useMemo } from 'react';
import { 
  MOCK_SAVED_CASES, 
  DOC_TYPES, 
  MISSION_TYPES,
  REGIONAL_UNITS,
  ENTITIES,
  CANDIDATE_CLASSIFICATIONS,
  DEPARTMENTS,
  CITIES,
  SUBJECTS,
  AREAS,
  ORIGINS,
  MOCK_MISSIONS
} from '../constants';
import { FamilyMember, ProtectionMission, ProtectionCaseForm } from '../types';
import { InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';

const INITIAL_FAMILY_DATA: Record<string, FamilyMember[]> = {
  "CASE-2024-001": [
    {
      id: "fam-1",
      firstName: "MARIA",
      secondName: "ISABEL",
      firstSurname: "PEREZ",
      secondSurname: "RODRIGUEZ",
      docType: "Cédula de Ciudadanía",
      docNumber: "10203040",
      relationship: "CÓNYUGE",
      birthDate: "1992-03-15",
      isActive: true
    },
    {
      id: "fam-2",
      firstName: "JUAN",
      secondName: "ESTEBAN",
      firstSurname: "PEREZ",
      secondSurname: "PEREZ",
      docType: "Tarjeta de Identidad",
      docNumber: "1105123456",
      relationship: "HIJO/A",
      birthDate: "2015-08-20",
      isActive: true
    }
  ]
};

const SavedCasesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<{ type: 'MISSION' | 'FAMILY' | 'LIST_FAMILY' | 'LIST_MISSIONS' | 'MISSION_DETAIL' | 'EDIT_MISSION' | 'NONE', caseId: string }>({ type: 'NONE', caseId: '' });
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ show: boolean, memberId: string, caseId: string } | null>(null);
  
  // States for dynamic data
  const [allSavedCases, setAllSavedCases] = useState<ProtectionCaseForm[]>(MOCK_SAVED_CASES);
  const [allFamilyData, setAllFamilyData] = useState<Record<string, FamilyMember[]>>(INITIAL_FAMILY_DATA);
  const [missionsList, setMissionsList] = useState<ProtectionMission[]>(MOCK_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);
  const [editAttachments, setEditAttachments] = useState<File[]>([]);
  
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const filteredCases = useMemo(() => {
    if (!searchTerm.trim()) return allSavedCases;
    const term = searchTerm.toLowerCase();
    return allSavedCases.filter(c => 
      c.radicado.toLowerCase().includes(term) || 
      (c.caseId && c.caseId.toLowerCase().includes(term)) ||
      c.docNumber.includes(term) ||
      `${c.firstName} ${c.firstSurname}`.toLowerCase().includes(term)
    );
  }, [searchTerm, allSavedCases]);

  const showNotification = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  const closeModal = () => {
    setActiveModal({ type: 'NONE', caseId: '' });
    setEditingMember(null);
    setSelectedMission(null);
    setEditAttachments([]);
  };

  const handleToggleFamilyStatus = () => {
    if (!confirmDeactivate) return;
    const { caseId, memberId } = confirmDeactivate;
    
    setAllFamilyData(prev => {
      const list = prev[caseId] || [];
      const updatedList = list.map(m => 
        m.id === memberId ? { ...m, isActive: !m.isActive } : m
      );
      return { ...prev, [caseId]: updatedList };
    });

    const member = (allFamilyData[caseId] || []).find(m => m.id === memberId);
    showNotification(`Integrante ${member?.isActive ? 'desactivado' : 'activado'} correctamente.`);
    setConfirmDeactivate(null);
  };

  const handleFamilySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const caseId = activeModal.caseId;
    
    const memberData: Partial<FamilyMember> = {
      firstName: (formData.get('firstName') as string).toUpperCase(),
      secondName: (formData.get('secondName') as string || "").toUpperCase(),
      firstSurname: (formData.get('firstSurname') as string).toUpperCase(),
      secondSurname: (formData.get('secondSurname') as string || "").toUpperCase(),
      docType: formData.get('docType') as string,
      docNumber: formData.get('docNumber') as string,
      relationship: (formData.get('relationship') as string).toUpperCase(),
      birthDate: formData.get('birthDate') as string,
    };

    setAllFamilyData(prev => {
      const members = prev[caseId] || [];
      let updated;
      if (editingMember) {
        updated = members.map(m => m.id === editingMember.id ? { ...m, ...memberData } : m);
        showNotification("Datos actualizados correctamente.");
      } else {
        updated = [...members, { id: `fam-${Date.now()}`, isActive: true, ...memberData as any }];
        showNotification("Nuevo integrante vinculado.");
      }
      return { ...prev, [caseId]: updated };
    });
    setEditingMember(null);
    setActiveModal({ type: 'LIST_FAMILY', caseId });
  };

  const handleEditMissionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMission || !associatedCase) return;
    
    const formData = new FormData(e.currentTarget);
    
    // 1. Update Case Data
    const updatedCase: ProtectionCaseForm = {
      ...associatedCase,
      destinationUnit: formData.get('destinationUnit') as string,
      remittingEntity: formData.get('remittingEntity') as string,
      candidateClassification: formData.get('candidateClassification') as string,
      origin: formData.get('origin') as string,
      remitterName: (formData.get('remitterName') as string).toUpperCase(),
      requestDepartment: formData.get('requestDepartment') as string,
      requestCity: formData.get('requestCity') as string,
      docType: formData.get('docType') as string,
      docNumber: formData.get('docNumber') as string,
      firstName: (formData.get('firstName') as string).toUpperCase(),
      secondName: (formData.get('secondName') as string || "").toUpperCase(),
      firstSurname: (formData.get('firstSurname') as string).toUpperCase(),
      secondSurname: (formData.get('secondSurname') as string || "").toUpperCase(),
      assignedArea: formData.get('assignedArea') as string,
      missionStartDate: formData.get('missionStartDate') as string,
      missionType: formData.get('missionType') as string,
      dueDate: formData.get('dueDate') as string,
      observations: (formData.get('observations') as string).toUpperCase(),
      attachments: editAttachments // Sync edit attachments
    };

    setAllSavedCases(prev => prev.map(c => c.caseId === associatedCase.caseId ? updatedCase : c));

    // 2. Update Mission Data (Syncing shared fields)
    const updatedMission: ProtectionMission = {
      ...selectedMission,
      type: updatedCase.missionType,
      status: formData.get('status') as any,
      dueDate: updatedCase.dueDate,
      assignedArea: updatedCase.assignedArea,
      petitionerName: `${updatedCase.firstName} ${updatedCase.firstSurname}`,
      petitionerDoc: updatedCase.docNumber,
      observations: updatedCase.observations
    };

    setMissionsList(prev => prev.map(m => m.id === selectedMission.id ? updatedMission : m));
    
    showNotification("Expediente y Misión actualizados exitosamente.");
    setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId });
  };

  const handleEditFilesSelected = (files: File[]) => {
    setEditAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveEditFile = (index: number) => {
    setEditAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const currentFamilyMembers = useMemo(() => {
    return activeModal.caseId ? (allFamilyData[activeModal.caseId] || []) : [];
  }, [allFamilyData, activeModal.caseId]);

  const relatedMissions = useMemo(() => {
    if (!activeModal.caseId) return [];
    const currentCase = allSavedCases.find(c => c.caseId === activeModal.caseId);
    const radicado = currentCase?.radicado || activeModal.caseId;
    return missionsList.filter(m => m.caseRadicado === radicado);
  }, [activeModal.caseId, missionsList, allSavedCases]);

  const associatedCase = useMemo(() => {
    if (!activeModal.caseId) return null;
    return allSavedCases.find(c => c.caseId === activeModal.caseId) || null;
  }, [activeModal.caseId, allSavedCases]);

  const handleOpenEditMission = (m: ProtectionMission) => {
    setSelectedMission(m);
    const currentCase = allSavedCases.find(c => c.radicado === m.caseRadicado);
    if (currentCase) {
        setEditAttachments(currentCase.attachments || []);
    }
    setActiveModal({ type: 'EDIT_MISSION', caseId: currentCase?.caseId || '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative min-h-screen">
      {/* Notificaciones */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-[250] animate-in slide-in-from-right duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border-l-4 border-blue-500 flex items-center gap-3">
            <svg className="text-blue-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modal Confirm Deactivate */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Confirmar desactivar</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    ¿Está seguro que desea desactivar a este integrante? Esta acción afectará su visualización en el expediente oficial.
                 </p>
                 <div className="flex gap-3">
                    <button onClick={() => setConfirmDeactivate(null)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                    <button onClick={handleToggleFamilyStatus} className="flex-1 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Confirmar</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Expedientes en Custodia</h1>
          <p className="text-slate-500 text-sm font-medium">Administración de expedientes digitalizados y gestión de misiones oficiales.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por radicado, caso o titular..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          <svg className="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Radicado</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Caso</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Titular</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidad</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones de Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCases.map((c) => (
              <tr key={c.caseId} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">{c.radicado}</td>
                <td className="px-6 py-5 font-mono text-xs font-bold text-slate-600 uppercase">{c.caseId}</td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 uppercase">{c.firstName} {c.firstSurname}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{c.docType}: {c.docNumber}</div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{c.destinationUnit}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => { setEditingMember(null); setActiveModal({ type: 'FAMILY', caseId: c.caseId || '' }); }}
                      className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100"
                      title="Vincular Nuevo Integrante Familiar"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>
                    </button>
                    <button 
                      onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: c.caseId || '' })}
                      className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100"
                      title="Ver/Gestionar Núcleo Familiar"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </button>
                    <button 
                      onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: c.caseId || '' })}
                      className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-100"
                      title="Ver Misiones Relacionadas"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL: LISTADO NÚCLEO FAMILIAR --- */}
      {activeModal.type === 'LIST_FAMILY' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight">NÚCLEO FAMILIAR</h3>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-90">ASOCIADO AL CASO: {activeModal.caseId}</p>
                    </div>
                 </div>
                 <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>

              <div className="p-8">
                 <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-sm text-left">
                       <thead className="text-[9px] uppercase font-black text-slate-400 tracking-[0.15em] border-b border-slate-50">
                          <tr>
                             <th className="px-8 py-4">INTEGRANTE</th>
                             <th className="px-8 py-4">DOCUMENTO</th>
                             <th className="px-8 py-4">VÍNCULO</th>
                             <th className="px-8 py-4">ESTADO</th>
                             <th className="px-8 py-4 text-center">GESTIÓN</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {currentFamilyMembers.map(fam => (
                             <tr key={fam.id} className={`transition-all ${!fam.isActive ? 'opacity-50' : ''}`}>
                                <td className="px-8 py-5 font-black text-slate-800 uppercase tracking-tight text-xs">
                                    {fam.firstName} {fam.secondName} {fam.firstSurname} {fam.secondSurname}
                                </td>
                                <td className="px-8 py-5 font-mono text-xs text-slate-500">{fam.docNumber}</td>
                                <td className="px-8 py-5">
                                   <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                      {fam.relationship}
                                   </span>
                                </td>
                                <td className="px-8 py-5">
                                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${fam.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                      {fam.isActive ? 'ACTIVO' : 'INACTIVO'}
                                   </span>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center justify-center gap-3">
                                      <button onClick={() => { if (fam.isActive) { setEditingMember(fam); setActiveModal({ type: 'FAMILY', caseId: activeModal.caseId }); } }} className={`p-1 transition-all ${fam.isActive ? 'text-blue-500 hover:scale-110' : 'text-slate-200 cursor-not-allowed'}`} title="Editar datos del integrante"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                      <button onClick={() => { if (fam.isActive) { setConfirmDeactivate({ show: true, memberId: fam.id, caseId: activeModal.caseId }); } else { setAllFamilyData(prev => ({ ...prev, [activeModal.caseId]: (prev[activeModal.caseId] || []).map(m => m.id === fam.id ? { ...m, isActive: true } : m) })); showNotification("Integrante activado correctamente."); } }} className={`p-1 transition-all ${fam.isActive ? 'text-orange-500 hover:scale-110' : 'text-emerald-500 hover:scale-110'}`} title={fam.isActive ? 'Desactivar Integrante' : 'Activar Integrante'}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="mt-8 flex justify-end">
                    <button onClick={closeModal} className="px-10 py-3 bg-[#0d1117] text-white font-black rounded-xl uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-black active:scale-95 shadow-xl shadow-slate-200">CERRAR</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: LISTADO DE MISIONES RELACIONADAS --- */}
      {activeModal.type === 'LIST_MISSIONS' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 bg-gradient-to-r from-indigo-700 to-purple-800 text-white flex justify-between items-center">
                 <div className="flex items-center gap-5">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Misiones Relacionadas al Expediente</h3>
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Radicado del Caso: {activeModal.caseId}</p>
                    </div>
                 </div>
                 <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="p-10">
                 {relatedMissions.length > 0 ? (
                    <div className="border border-slate-100 rounded-[1.5rem] overflow-hidden bg-slate-50/30 p-1">
                        <table className="w-full text-sm text-left">
                           <thead className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                              <tr>
                                 <th className="px-8 py-5">No. Misión</th>
                                 <th className="px-8 py-5">Tipo de Actuación</th>
                                 <th className="px-8 py-5">Fecha Generación</th>
                                 <th className="px-8 py-5">Vencimiento</th>
                                 <th className="px-8 py-5 text-center">Estado</th>
                                 <th className="px-8 py-5 text-center">Gestión</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-slate-50">
                              {relatedMissions.map(m => (
                                 <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5 font-mono font-bold text-indigo-600">{m.missionNo}</td>
                                    <td className="px-8 py-5 font-black text-slate-800 uppercase tracking-tight text-xs">{m.type}</td>
                                    <td className="px-8 py-5 text-slate-500 text-xs">{m.creationDate}</td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{m.dueDate}</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${m.status === 'PENDIENTE' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{m.status}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center justify-center gap-2">
                                          <button onClick={() => { setSelectedMission(m); setActiveModal({ type: 'MISSION_DETAIL', caseId: activeModal.caseId }); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Visualizar Misión"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                                          <button onClick={() => handleOpenEditMission(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar Misión"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>
                 ) : (
                    <div className="p-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <svg className="mx-auto text-slate-300 mb-4" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se han generado misiones para este expediente aún.</p>
                    </div>
                 )}
                 <div className="mt-10 flex justify-end">
                    <button onClick={closeModal} className="px-12 py-3.5 bg-[#101420] text-white font-black rounded-xl uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-black active:scale-95 shadow-xl">Cerrar</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: VISTA PREVIA DE MISIÓN (SIDPA) --- */}
      {activeModal.type === 'MISSION_DETAIL' && selectedMission && associatedCase && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
              <div className="bg-slate-100 p-4 flex justify-between items-center border-b border-slate-200 print:hidden sticky top-0 z-20">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-700">VISTA PREVIA DE MISIÓN</h3>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={() => window.print()} className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-[10px] uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>Imprimir Documento</button>
                    <button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                 </div>
              </div>
              <div className="p-10 font-sans text-slate-900 bg-white print:p-0">
                  <div className="border border-slate-900 grid grid-cols-[1fr,2fr,1.2fr] mb-10">
                      <div className="border-r border-slate-900 p-4 flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png" alt="FGN" className="h-14" /></div>
                      <div className="border-r border-slate-900 flex flex-col text-center divide-y divide-slate-900"><div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div><div className="p-2 text-sm font-black uppercase flex-1 flex items-center justify-center">MISIÓN DE TRABAJO</div></div>
                      <div className="p-0 text-[8px] font-bold uppercase divide-y divide-slate-900"><div className="p-2">CÓDIGO: FGN-MS01-F-03</div><div className="p-2">VERSIÓN: 01</div><div className="p-2 text-right tracking-tighter">PÁGINA 1 DE 1</div></div>
                  </div>
                  <div className="space-y-4 text-[11px]">
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">FECHA:</span><span>{selectedMission.creationDate} 15:34:57</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">MISIÓN DE TRABAJO No.:</span><span className="font-bold text-sm tracking-tight">{selectedMission.missionNo}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4 items-start"><span className="font-bold uppercase leading-tight">RADICADO DE<br/>CORRESPONDENCIA:</span><div><span className="font-bold">{selectedMission.caseRadicado}</span><span className="block text-[9px] italic text-slate-500 mt-0.5">Al contestar cíte este número</span></div></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">CASO NÚMERO:</span><span>{associatedCase.caseId || "EN TRÁMITE"}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">ASIGNADO A:</span><span className="uppercase font-semibold">{selectedMission.assignedOfficial || "PERFIL PRUEBAS"}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">A SOLICITUD DE:</span><span className="uppercase">{associatedCase.remittingEntity || "TITULAR DEL CASO"}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">CIUDAD DE SOLICITUD:</span><span className="uppercase">{associatedCase.requestCity}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">TIPO DE MISIÓN:</span><span className="uppercase font-bold">{selectedMission.type}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">NOMBRES:</span><span className="uppercase">{associatedCase.firstName} {associatedCase.secondName || ""}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">PRIMER APELLIDO:</span><span className="uppercase">{associatedCase.firstSurname}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">SEGUNDO APELLIDO:</span><span className="uppercase">{associatedCase.secondSurname || ""}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold leading-tight">TIPO DE DOCUMENTO DE<br/>IDENTIDAD:</span><span className="uppercase">{associatedCase.docType}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold uppercase leading-tight">DOCUMENTO DE IDENTIDAD No.:</span><span className="font-bold">{associatedCase.docNumber}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">UNIDAD ASIGNADA:</span><span className="uppercase">{selectedMission.assignedArea}</span></div>
                      <div className="mt-8 pt-6 border-t border-slate-200"><span className="font-bold uppercase mb-4 block underline">INSTRUCCIONES:</span><ol className="list-decimal pl-6 space-y-2 uppercase text-[11px] font-medium leading-tight"><li>ENTREVISTAR AL CANDIDATO Y A LOS ADULTOS INTEGRANTES DE SU NÚCLEO FAMILIAR, SOLICITARLES ANTECEDENTES.</li><li>REALIZAR VISITA AL PROCESO Y ENTREVISTAR AL FUNCIONARIO JUDICIAL DE CONOCIMIENTO.</li><li>ESTABLECER Y VERIFICAR NIVELES DE RIESGO Y AMENAZA.</li><li>RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</li></ol><div className="mt-4 pl-6 uppercase text-[11px] font-medium">1. RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</div></div>
                      <div className="mt-8 pt-4"><span className="font-bold uppercase block mb-2">OBSERVACIONES:</span><div className="p-4 border border-slate-300 min-h-[100px] text-justify leading-relaxed whitespace-pre-wrap uppercase">{associatedCase.observations || "SIN OBSERVACIONES REGISTRADAS."}</div></div>
                      <div className="mt-8 pt-8"><span className="font-black text-sm uppercase">LOS TÉRMINOS VENCEN: {selectedMission.dueDate}</span></div>
                      <div className="mt-24 pt-10 border-t border-slate-900 max-w-sm mx-auto text-center"><span className="font-bold uppercase text-[10px] block">FIRMA FUNCIONARIO ASIGNADO</span><div className="mt-4 flex flex-col items-center gap-1 text-[9px] font-semibold text-slate-500 uppercase"><span>Fecha de Asignación: {selectedMission.creationDate}</span><span>Generó: {selectedMission.assignedOfficial || "SGP SISTEMA CENTRAL"}</span></div></div>
                      <div className="mt-20 border border-slate-900 grid grid-cols-[3fr,1fr,1fr] text-[8px] font-bold text-center divide-x divide-slate-900 print:mt-10"><div className="p-2 uppercase">Documento no normalizado en el Sistema de Gestión Integral</div><div className="p-2">Versión 01</div><div className="p-2">2023-02-01</div></div>
                  </div>
              </div>
              <div className="bg-slate-50 p-6 flex justify-end print:hidden"><button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="px-12 py-3 bg-[#0d1117] text-white font-black rounded-xl uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-black shadow-xl">VOLVER AL LISTADO</button></div>
           </div>
        </div>
      )}

      {/* --- MODAL: EDICIÓN DE MISIÓN (FULL CASE FIELDS) --- */}
      {activeModal.type === 'EDIT_MISSION' && selectedMission && associatedCase && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-8 bg-blue-600 text-white flex justify-between items-center flex-shrink-0">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">EDITAR EXPEDIENTE Y MISIÓN</h3>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">EXPEDIENTE: {associatedCase.caseId} | MISIÓN: {selectedMission.missionNo}</p>
                 </div>
                 <button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="text-white hover:opacity-70"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              
              <form className="p-10 space-y-10 overflow-y-auto" onSubmit={handleEditMissionSubmit}>
                 {/* Sección 1: Correspondencia */}
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">I. DATOS DE CORRESPONDENCIA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Unidad Regional Destino" name="destinationUnit" options={REGIONAL_UNITS} defaultValue={associatedCase.destinationUnit} required />
                        <SelectField label="Entidad Remitente" name="remittingEntity" options={ENTITIES} defaultValue={associatedCase.remittingEntity} required />
                        <SelectField label="Clasificación del Candidato" name="candidateClassification" options={CANDIDATE_CLASSIFICATIONS} defaultValue={associatedCase.candidateClassification} required />
                        <SelectField label="Procedencia" name="origin" options={ORIGINS} defaultValue={associatedCase.origin} required />
                        <InputField label="Nombre del Remitente" name="remitterName" defaultValue={associatedCase.remitterName} required />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Dpto Solicitud" name="requestDepartment" options={DEPARTMENTS} defaultValue={associatedCase.requestDepartment} required />
                            <SelectField label="Ciudad Solicitud" name="requestCity" options={CITIES} defaultValue={associatedCase.requestCity} required />
                        </div>
                    </div>
                 </div>

                 {/* Sección 2: Titular */}
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">II. INFORMACIÓN DEL TITULAR</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Tipo de Documento" name="docType" options={DOC_TYPES} defaultValue={associatedCase.docType} required />
                        <InputField label="Número de Documento" name="docNumber" defaultValue={associatedCase.docNumber} required />
                        <InputField label="Primer Nombre" name="firstName" defaultValue={associatedCase.firstName} required />
                        <InputField label="Segundo Nombre" name="secondName" defaultValue={associatedCase.secondName} />
                        <InputField label="Primer Apellido" name="firstSurname" defaultValue={associatedCase.firstSurname} required />
                        <InputField label="Segundo Apellido" name="secondSurname" defaultValue={associatedCase.secondSurname} />
                    </div>
                 </div>

                 {/* Sección 3: Misión */}
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">III. ASIGNACIÓN Y MISIÓN</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Área Asignada" name="assignedArea" options={AREAS} defaultValue={associatedCase.assignedArea} required />
                        <InputField label="Inicio Misión" name="missionStartDate" type="date" defaultValue={associatedCase.missionStartDate} required />
                        <SelectField label="Tipo de Misión" name="missionType" options={MISSION_TYPES} defaultValue={associatedCase.missionType} required />
                        <InputField label="Vencimiento Términos" name="dueDate" type="date" defaultValue={associatedCase.dueDate} required />
                        <SelectField label="Estado de Misión" name="status" options={['PENDIENTE', 'ASIGNADA', 'ACTIVA', 'FINALIZADA', 'ANULADA']} defaultValue={selectedMission.status} required />
                        <div className="md:col-span-2">
                           <TextAreaField label="Observaciones" name="observations" defaultValue={associatedCase.observations} className="min-h-[100px]" />
                        </div>
                    </div>
                 </div>

                 {/* Sección 4: Anexos (No requeridos, Max 30MB) */}
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">IV. ANEXOS Y SOPORTES (MÁX 30MB)</h4>
                    <FileUpload 
                        label="Adjuntar nuevos anexos o soportes"
                        files={editAttachments}
                        onFilesSelected={handleEditFilesSelected}
                        onRemoveFile={handleRemoveEditFile}
                        maxSizeMB={30}
                        required={false}
                    />
                 </div>

                 <div className="flex justify-end gap-4 border-t border-slate-100 pt-8 flex-shrink-0">
                    <button type="button" onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                    <button type="submit" className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">
                        Guardar Cambios
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Modal Family Member Form */}
      {activeModal.type === 'FAMILY' && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
              <div className={`p-8 bg-gradient-to-r ${editingMember ? 'from-indigo-600 to-blue-600' : 'from-emerald-600 to-teal-600'} text-white flex justify-between items-center`}>
                 <h3 className="text-xl font-black uppercase tracking-tight">{editingMember ? 'Actualizar Datos' : 'Vincular Integrante'}</h3>
                 <button onClick={() => { setEditingMember(null); setActiveModal({type: 'LIST_FAMILY', caseId: activeModal.caseId}); }} className="text-white hover:opacity-70"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <form className="p-10 space-y-8" onSubmit={handleFamilySubmit}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Primer Nombre" name="firstName" defaultValue={editingMember?.firstName} required placeholder="EJ: JUAN" />
                    <InputField label="Segundo Nombre" name="secondName" defaultValue={editingMember?.secondName} placeholder="EJ: ANDRES" />
                    <InputField label="Primer Apellido" name="firstSurname" defaultValue={editingMember?.firstSurname} required placeholder="EJ: PEREZ" />
                    <InputField label="Segundo Apellido" name="secondSurname" defaultValue={editingMember?.secondSurname} placeholder="EJ: RODRIGUEZ" />
                    <SelectField label="Tipo Documento" name="docType" options={DOC_TYPES} defaultValue={editingMember?.docType} required />
                    <InputField label="Número Documento" name="docNumber" defaultValue={editingMember?.docNumber} required placeholder="Sin puntos ni comas" />
                    <SelectField label="Parentesco" name="relationship" options={["CÓNYUGE", "HIJO/A", "PADRE/MADRE", "HERMANO/A", "TÍO/A", "SOBRINO/A", "ABUELO/A", "OTRO"]} defaultValue={editingMember?.relationship} required />
                    <InputField label="Fecha de Nacimiento" name="birthDate" type="date" defaultValue={editingMember?.birthDate} required />
                 </div>
                 <div className="flex justify-end gap-4 border-t border-slate-100 pt-8">
                    <button type="button" onClick={() => { setEditingMember(null); setActiveModal({type: 'LIST_FAMILY', caseId: activeModal.caseId}); }} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                    <button type="submit" className={`px-10 py-3 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg ${editingMember ? 'bg-indigo-600' : 'bg-emerald-600'}`}>{editingMember ? 'Guardar Cambios' : 'Confirmar Vínculo'}</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SavedCasesPage;
