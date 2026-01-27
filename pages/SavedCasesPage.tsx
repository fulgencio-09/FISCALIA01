
import React, { useState, useMemo } from 'react';
import { 
  MOCK_SAVED_CASES, 
  DOC_TYPES, 
  MISSION_TYPES,
  EVALUATION_MISSION_TYPES,
  MISSION_CLASSIFICATIONS,
  REGIONAL_UNITS,
  ENTITIES,
  CANDIDATE_CLASSIFICATIONS,
  DEPARTMENTS,
  CITIES,
  SECCIONES,
  ORIGINS,
  MOCK_MISSIONS,
  MOCK_FAMILY_DATA
} from '../constants';
import { FamilyMember, ProtectionMission, ProtectionCaseForm } from '../types';
import { InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';

const SavedCasesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<{ type: 'MISSION' | 'FAMILY' | 'LIST_FAMILY' | 'LIST_MISSIONS' | 'MISSION_DETAIL' | 'EDIT_MISSION' | 'TRANSFER_OWNER' | 'NONE', caseId: string }>({ type: 'NONE', caseId: '' });
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ show: boolean, memberId: string, caseId: string } | null>(null);
  
  // States for dynamic data
  const [allSavedCases, setAllSavedCases] = useState<ProtectionCaseForm[]>(MOCK_SAVED_CASES);
  const [allFamilyData, setAllFamilyData] = useState<Record<string, FamilyMember[]>>(MOCK_FAMILY_DATA);
  const [missionsList, setMissionsList] = useState<ProtectionMission[]>(MOCK_MISSIONS);
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);
  const [editAttachments, setEditAttachments] = useState<File[]>([]);
  const [selectedAssignedArea, setSelectedAssignedArea] = useState<string>('');
  
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

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
    setSelectedAssignedArea('');
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

  const handleTransferOwnership = (selectedMemberId: string) => {
    const caseId = activeModal.caseId;
    const currentCase = allSavedCases.find(c => c.caseId === caseId);
    const family = allFamilyData[caseId] || [];
    const newTitular = family.find(m => m.id === selectedMemberId);

    if (!currentCase || !newTitular) return;

    const formerRepAsFamiliar: FamilyMember = {
        id: `fam-former-${Date.now()}`,
        firstName: currentCase.firstName,
        secondName: currentCase.secondName,
        firstSurname: currentCase.firstSurname,
        secondSurname: currentCase.secondSurname,
        docType: currentCase.docType,
        docNumber: currentCase.docNumber,
        relationship: "PADRE/MADRE",
        birthDate: "1980-01-01",
        isActive: true,
        sex: "NO INFORMA",
        residencePlace: currentCase.requestCity
    };

    const updatedCase: ProtectionCaseForm = {
        ...currentCase,
        firstName: newTitular.firstName,
        secondName: newTitular.secondName || '',
        firstSurname: newTitular.firstSurname,
        secondSurname: newTitular.secondSurname || '',
        docType: "Cédula de Ciudadanía",
        docNumber: newTitular.docNumber,
        applicantRole: "TITULAR",
        observations: `${currentCase.observations}\n[TRASLADO TITULARIDAD ${new Date().toLocaleDateString()}] Cambio de titular por mayoría de edad o delegación.`
    };

    const updatedFamily = family
        .filter(m => m.id !== selectedMemberId)
        .concat(formerRepAsFamiliar);

    setAllSavedCases(prev => prev.map(c => c.caseId === caseId ? updatedCase : c));
    setAllFamilyData(prev => ({ ...prev, [caseId]: updatedFamily }));

    showNotification(`Titularidad trasladada exitosamente a ${newTitular.firstName} ${newTitular.firstSurname}.`);
    closeModal();
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
      sex: formData.get('sex') as string,
      residencePlace: (formData.get('residencePlace') as string || "").toUpperCase(),
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
    const updatedCase: ProtectionCaseForm = {
      ...associatedCase,
      docType: formData.get('docType') as string,
      docNumber: formData.get('docNumber') as string,
      firstName: (formData.get('firstName') as string).toUpperCase(),
      secondName: (formData.get('secondName') as string || "").toUpperCase(),
      firstSurname: (formData.get('firstSurname') as string).toUpperCase(),
      secondSurname: (formData.get('secondSurname') as string || "").toUpperCase(),
      assignedArea: formData.get('assignedArea') as string,
      missionStartDate: formData.get('missionStartDate') as string,
      missionType: formData.get('missionType') as string,
      missionClassification: formData.get('missionClassification') as string,
      dueDate: formData.get('dueDate') as string,
      observations: (formData.get('observations') as string).toUpperCase(),
      attachments: editAttachments
    };

    setAllSavedCases(prev => prev.map(c => c.caseId === associatedCase.caseId ? updatedCase : c));

    const updatedMission: ProtectionMission = {
      ...selectedMission,
      type: updatedCase.missionType,
      missionClassification: updatedCase.missionClassification,
      status: formData.get('status') as any,
      dueDate: updatedCase.dueDate,
      assignedArea: updatedCase.assignedArea,
      petitionerName: `${updatedCase.firstName} ${updatedCase.firstSurname}`,
      petitionerDoc: updatedCase.docNumber,
      observations: updatedCase.observations
    };

    setMissionsList(prev => prev.map(m => m.id === selectedMission.id ? updatedMission : m));
    showNotification("Información del expediente y orden actualizada.");
    setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId });
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
        setSelectedAssignedArea(currentCase.assignedArea);
    }
    setActiveModal({ type: 'EDIT_MISSION', caseId: currentCase?.caseId || '' });
  };

  const missionTypeOptions = selectedAssignedArea === 'Sección de Investigaciones y evaluaciones' 
    ? EVALUATION_MISSION_TYPES 
    : MISSION_TYPES;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-[250] animate-in slide-in-from-right duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border-l-4 border-blue-500 flex items-center gap-3">
            <svg className="text-blue-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Deactivation Modal */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
              <h3 className="text-lg font-black uppercase text-slate-900 mb-4 tracking-tight">¿Confirmar Acción?</h3>
              <p className="text-slate-500 text-sm mb-8">Esta acción cambiará el estado de vigencia del integrante en el núcleo familiar.</p>
              <div className="flex gap-4">
                 <button onClick={() => setConfirmDeactivate(null)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-400 font-black uppercase text-[10px] rounded-xl hover:bg-slate-50">Cancelar</button>
                 <button onClick={handleToggleFamilyStatus} className="flex-1 px-4 py-2 bg-blue-600 text-white font-black uppercase text-[10px] rounded-xl shadow-lg">Confirmar</button>
              </div>
           </div>
        </div>
      )}

      {/* Main List View */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Consulta de Expedientes</h1>
          <p className="text-slate-500 font-medium italic">Gestión de núcleos familiares y órdenes de trabajo por caso.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por Radicado, Caso o Documento..." 
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
                <th className="px-8 py-6">Número de Caso</th>
                <th className="px-8 py-6">Radicado</th>
                <th className="px-8 py-6">Titular</th>
                <th className="px-8 py-6">Rol</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">{c.caseId}</span>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">{c.radicado}</td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 uppercase text-[11px] leading-tight">{c.firstName} {c.firstSurname}</div>
                    <div className="text-[9px] text-slate-400 font-bold">{c.docNumber}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{c.applicantRole}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: c.caseId || '' })}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Familia
                      </button>
                      <button 
                        onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: c.caseId || '' })}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Órdenes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Listado de Familia */}
      {activeModal.type === 'LIST_FAMILY' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full overflow-hidden animate-in zoom-in-95">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Núcleo Familiar - Expediente {associatedCase?.caseId}</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Titular: {associatedCase?.firstName} {associatedCase?.firstSurname}</p>
                 </div>
                 <button onClick={closeModal} className="text-slate-300 hover:text-slate-900 transition-colors"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="p-8">
                 <div className="mb-6 flex justify-between gap-4">
                    <button onClick={() => setActiveModal({ type: 'FAMILY', caseId: activeModal.caseId })} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
                       <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                       Nuevo Integrante
                    </button>
                    {associatedCase?.applicantRole === 'REPRESENTANTE LEGAL' && (
                      <button onClick={() => setActiveModal({ type: 'TRANSFER_OWNER', caseId: activeModal.caseId })} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2">
                         <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
                         Traslado Titularidad
                      </button>
                    )}
                 </div>
                 <div className="overflow-hidden border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                          <tr>
                             <th className="px-6 py-4">Nombre Completo</th>
                             <th className="px-6 py-4">Parentesco</th>
                             <th className="px-6 py-4">Documento</th>
                             <th className="px-6 py-4 text-center">Estado</th>
                             <th className="px-6 py-4 text-center">Acciones</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {currentFamilyMembers.map(m => (
                             <tr key={m.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-black uppercase text-slate-800">{m.firstName} {m.firstSurname}</td>
                                <td className="px-6 py-4 font-bold text-blue-600 uppercase">{m.relationship}</td>
                                <td className="px-6 py-4 font-mono">{m.docNumber}</td>
                                <td className="px-6 py-4 text-center">
                                   <span className={`px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest ${m.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                      {m.isActive ? 'Activo' : 'Inactivo'}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => { setEditingMember(m); setActiveModal({ type: 'FAMILY', caseId: activeModal.caseId }); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                      <button onClick={() => setConfirmDeactivate({ show: true, memberId: m.id, caseId: activeModal.caseId })} className={`p-2 rounded-lg transition-all ${m.isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">{m.isActive ? <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/> : <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>}</svg></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Formulario Familia (Add/Edit) */}
      {activeModal.type === 'FAMILY' && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <form onSubmit={handleFamilySubmit} className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
              <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight">{editingMember ? 'Editar' : 'Vincular'} Integrante Familiar</h3>
                 <button type="button" onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: activeModal.caseId })} className="text-white hover:opacity-70 transition-opacity"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Primer Nombre" name="firstName" defaultValue={editingMember?.firstName} required />
                 <InputField label="Segundo Nombre" name="secondName" defaultValue={editingMember?.secondName} />
                 <InputField label="Primer Apellido" name="firstSurname" defaultValue={editingMember?.firstSurname} required />
                 <InputField label="Segundo Apellido" name="secondSurname" defaultValue={editingMember?.secondSurname} />
                 <SelectField label="Tipo Doc" name="docType" options={DOC_TYPES} defaultValue={editingMember?.docType} required />
                 <InputField label="No. Documento" name="docNumber" defaultValue={editingMember?.docNumber} required />
                 <InputField label="Parentesco" name="relationship" defaultValue={editingMember?.relationship} required placeholder="Hijo/a, Esposo/a, etc." />
                 <InputField label="Fecha Nacimiento" name="birthDate" type="date" defaultValue={editingMember?.birthDate} required />
                 <SelectField label="Sexo" name="sex" options={['MASCULINO', 'FEMENINO', 'OTRO', 'NO INFORMA']} defaultValue={editingMember?.sex} required />
                 <InputField label="Lugar Residencia" name="residencePlace" defaultValue={editingMember?.residencePlace} required />
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4">
                 <button type="button" onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: activeModal.caseId })} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                 <button type="submit" className="px-10 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">
                    {editingMember ? 'Guardar Cambios' : 'Vincular Integrante'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* MODAL: Listado de Órdenes */}
      {activeModal.type === 'LIST_MISSIONS' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full overflow-hidden animate-in zoom-in-95">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Bandeja de Órdenes - Expediente {associatedCase?.caseId}</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Radicado Principal: {associatedCase?.radicado}</p>
                 </div>
                 <button onClick={closeModal} className="text-slate-300 hover:text-slate-900 transition-colors"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="p-8">
                 <div className="overflow-hidden border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                          <tr>
                             <th className="px-6 py-4">No. Orden</th>
                             <th className="px-6 py-4">Fecha Gen</th>
                             <th className="px-6 py-4">Tipo de Misión</th>
                             <th className="px-6 py-4 text-center">Estado</th>
                             <th className="px-6 py-4 text-center">Acciones</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {relatedMissions.map(m => (
                             <tr key={m.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-mono font-black text-indigo-700">{m.missionNo}</td>
                                <td className="px-6 py-4 font-bold">{m.creationDate}</td>
                                <td className="px-6 py-4 font-black uppercase text-slate-700">{m.type}</td>
                                <td className="px-6 py-4 text-center">
                                   <span className="px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest bg-blue-900 text-white">
                                      {m.status}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => { setSelectedMission(m); setActiveModal({ type: 'MISSION_DETAIL', caseId: activeModal.caseId }); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Vista Previa Documento"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                                      <button onClick={() => handleOpenEditMission(m)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Editar Expediente y Orden"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Traslado de Titularidad */}
      {activeModal.type === 'TRANSFER_OWNER' && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95">
              <div className="p-8 border-b border-slate-100">
                 <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Traslado de Titularidad</h3>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Seleccione al integrante familiar que asumirá como Titular del caso.</p>
              </div>
              <div className="p-8 space-y-4">
                 {currentFamilyMembers.length === 0 && <p className="text-center italic text-slate-400 text-sm">No hay integrantes familiares vinculados para el traslado.</p>}
                 {currentFamilyMembers.map(m => (
                   <button 
                     key={m.id} 
                     onClick={() => handleTransferOwnership(m.id)}
                     className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-blue-600 group rounded-2xl transition-all border border-slate-100"
                   >
                     <div className="text-left">
                       <p className="font-black text-slate-800 group-hover:text-white uppercase text-xs">{m.firstName} {m.firstSurname}</p>
                       <p className="text-slate-400 group-hover:text-blue-100 font-bold text-[9px] uppercase tracking-widest">{m.relationship} | {m.docNumber}</p>
                     </div>
                     <svg className="text-slate-300 group-hover:text-white" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                   </button>
                 ))}
              </div>
              <div className="p-8 bg-slate-50 flex justify-end">
                 <button onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: activeModal.caseId })} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: VISTA PREVIA DE ORDEN (SIDPA) --- */}
      {activeModal.type === 'MISSION_DETAIL' && selectedMission && associatedCase && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
              <div className="bg-slate-100 p-4 flex justify-between items-center border-b border-slate-200 print:hidden sticky top-0 z-20">
                 <div className="flex items-center gap-3">
                    <img src={LOGO_URL} alt="FGN Header" className="h-10" />
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-700">SIDPA 3.0 - VISTA PREVIA</h3>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={() => window.print()} className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-[10px] uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>Imprimir</button>
                    <button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                 </div>
              </div>
              <div className="p-10 font-sans text-slate-900 bg-white print:p-0">
                  <div className="border border-slate-900 grid grid-cols-[1fr,2fr,1.2fr] mb-10">
                      <div className="border-r border-slate-900 p-4 flex items-center justify-center"><img src={LOGO_URL} alt="FGN" className="h-16 w-auto" /></div>
                      <div className="border-r border-slate-900 flex flex-col text-center divide-y divide-slate-900"><div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div><div className="p-2 text-sm font-black uppercase flex-1 flex items-center justify-center">ORDEN DE TRABAJO</div></div>
                      <div className="p-0 text-[8px] font-bold uppercase divide-y divide-slate-900"><div className="p-2">CÓDIGO: FGN-MS01-F-03</div><div className="p-2">VERSIÓN: 01</div><div className="p-2 text-right">PÁGINA 1 DE 1</div></div>
                  </div>
                  <div className="space-y-4 text-[11px]">
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">FECHA:</span><span>{selectedMission.creationDate} 15:34:57</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">ORDEN DE TRABAJO No.:</span><span className="font-bold text-sm tracking-tight">{selectedMission.missionNo}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4 items-start"><span className="font-bold uppercase leading-tight">RADICADO DE<br/>CORRESPONDENCIA:</span><div><span className="font-bold">{selectedMission.caseRadicado}</span><span className="block text-[9px] italic text-slate-500 mt-0.5">Al contestar cíte este número</span></div></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">CASO NÚMERO:</span><span>{associatedCase.caseId || "EN TRÁMITE"}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">A SOLICITUD DE:</span><span className="uppercase">{associatedCase.remittingEntity || "TITULAR DEL CASO"}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">CIUDAD DE SOLICITUD:</span><span className="uppercase">{associatedCase.requestCity}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">TIPO DE ORDEN DE TRABAJO:</span><span className="uppercase font-bold">{selectedMission.type}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">NOMBRES:</span><span className="uppercase">{associatedCase.firstName} {associatedCase.secondName || ""}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold">PRIMER APELLIDO:</span><span className="uppercase">{associatedCase.firstSurname}</span></div>
                      <div className="grid grid-cols-[220px,1fr] gap-x-4"><span className="font-bold uppercase leading-tight">DOCUMENTO DE IDENTIDAD No.:</span><span className="font-bold">{associatedCase.docNumber}</span></div>
                      <div className="mt-8 pt-6 border-t border-slate-200"><span className="font-bold uppercase mb-4 block underline tracking-widest">INSTRUCCIONES:</span><ol className="list-decimal pl-6 space-y-2 uppercase text-[10px] font-medium tracking-tight"><li>ENTREVISTAR AL CANDIDATO Y A LOS ADULTOS INTEGRANTES DE SU NÚCLEO FAMILIAR.</li><li>REALIZAR VISITA AL PROCESO Y ENTREVISTAR AL FUNCIONARIO JUDICIAL.</li><li>ESTABLECER Y VERIFICAR NIVELES DE RIESGO Y AMENAZA.</li><li>RENDIR INFORME EVALUACIÓN TÉCNICA.</li></ol></div>
                      <div className="mt-8 pt-4"><span className="font-bold uppercase block mb-2 underline">OBSERVACIONES:</span><div className="p-4 border border-slate-300 min-h-[100px] text-justify whitespace-pre-wrap uppercase">{associatedCase.observations || "SIN OBSERVACIONES REGISTRADAS."}</div></div>
                      <div className="mt-8 pt-8"><span className="font-black text-sm uppercase">LOS TÉRMINOS VENCEN: {selectedMission.dueDate}</span></div>
                  </div>
              </div>
              <div className="bg-slate-50 p-6 flex justify-end print:hidden"><button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="px-12 py-3 bg-[#0d1117] text-white font-black rounded-xl uppercase text-[10px] tracking-widest transition-all hover:bg-black shadow-xl">VOLVER AL LISTADO</button></div>
           </div>
        </div>
      )}

      {/* --- MODAL: EDICIÓN DE ORDEN (FULL CASE FIELDS) --- */}
      {activeModal.type === 'EDIT_MISSION' && selectedMission && associatedCase && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-8 bg-blue-600 text-white flex justify-between items-center flex-shrink-0">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">EDITAR EXPEDIENTE Y ORDEN</h3>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">EXPEDIENTE: {associatedCase.caseId} | ORDEN: {selectedMission.missionNo}</p>
                 </div>
                 <button onClick={() => setActiveModal({ type: 'LIST_MISSIONS', caseId: activeModal.caseId })} className="text-white hover:opacity-70"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              
              <form className="p-10 space-y-10 overflow-y-auto" onSubmit={handleEditMissionSubmit}>
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">I. DATOS DE CORRESPONDENCIA (SOLO LECTURA)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField label="Unidad Regional Destino" name="destinationUnit" options={REGIONAL_UNITS} defaultValue={associatedCase.destinationUnit} required disabled />
                        <SelectField label="Entidad Remitente" name="remittingEntity" options={ENTITIES} defaultValue={associatedCase.remittingEntity} required disabled />
                        <SelectField label="Clasificación del Candidato" name="candidateClassification" options={CANDIDATE_CLASSIFICATIONS} defaultValue={associatedCase.candidateClassification} required disabled />
                        <SelectField label="Procedencia" name="origin" options={ORIGINS} defaultValue={associatedCase.origin} required disabled />
                        <InputField label="Nombre del Remitente" name="remitterName" defaultValue={associatedCase.remitterName} required disabled />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Dpto Solicitud" name="requestDepartment" options={DEPARTMENTS} defaultValue={associatedCase.requestDepartment} required disabled />
                            <SelectField label="Ciudad Solicitud" name="requestCity" options={CITIES} defaultValue={associatedCase.requestCity} required disabled />
                        </div>
                    </div>
                 </div>

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

                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">III. ASIGNACIÓN Y ORDEN DE TRABAJO</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField 
                          label="Seccion Asignada" 
                          name="assignedArea" 
                          options={SECCIONES} 
                          defaultValue={associatedCase.assignedArea} 
                          required 
                          onChange={(e) => setSelectedAssignedArea(e.target.value)}
                        />
                        <InputField label="Fecha de inicio de orden de trabajo" name="missionStartDate" type="date" defaultValue={associatedCase.missionStartDate} required />
                        <SelectField 
                          label="Tipo de orden de trabajo" 
                          name="missionType" 
                          options={missionTypeOptions} 
                          defaultValue={associatedCase.missionType} 
                          key={`mt-${selectedAssignedArea}`}
                          required 
                        />
                        <SelectField label="Clasificación de orden de trabajo" name="missionClassification" options={MISSION_CLASSIFICATIONS} defaultValue={selectedMission.missionClassification || associatedCase.missionClassification} required />
                        <InputField label="Vencimiento Términos" name="dueDate" type="date" defaultValue={associatedCase.dueDate} required />
                        <SelectField label="Estado de Orden" name="status" options={['PENDIENTE', 'ASIGNADA', 'ACTIVA', 'FINALIZADA', 'ANULADA']} defaultValue={selectedMission.status} required />
                        <div className="md:col-span-2">
                           <TextAreaField label="Observaciones" name="observations" defaultValue={associatedCase.observations} className="min-h-[100px]" />
                        </div>
                    </div>
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
    </div>
  );
};

export default SavedCasesPage;
