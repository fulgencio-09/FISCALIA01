
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
  AREAS
} from '../constants';
import { FamilyMember } from '../types';
import { InputField, SelectField, FileUpload } from '../components/FormComponents';

const INITIAL_FAMILY_DATA: Record<string, FamilyMember[]> = {
  "CASE-2024-001": [
    {
      id: "fam-1",
      firstName: "MARIA",
      firstSurname: "PEREZ",
      docType: "Cédula de Ciudadanía",
      docNumber: "10203040",
      relationship: "Cónyuge",
      birthDate: "1992-03-15",
      isActive: true
    },
    {
      id: "fam-2",
      firstName: "JUAN",
      firstSurname: "PEREZ",
      docType: "Tarjeta de Identidad",
      docNumber: "1105123456",
      relationship: "Hijo/a",
      birthDate: "2015-08-20",
      isActive: true
    }
  ]
};

const SavedCasesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<{ type: 'MISSION' | 'FAMILY' | 'LIST_FAMILY' | 'NONE', caseId: string }>({ type: 'NONE', caseId: '' });
  const [allFamilyData, setAllFamilyData] = useState<Record<string, FamilyMember[]>>(INITIAL_FAMILY_DATA);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [missionFiles, setMissionFiles] = useState<File[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const filteredCases = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_SAVED_CASES;
    const term = searchTerm.toLowerCase();
    return MOCK_SAVED_CASES.filter(c => 
      c.radicado.toLowerCase().includes(term) || 
      c.docNumber.includes(term) ||
      `${c.firstName} ${c.firstSurname}`.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const showNotification = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  const closeModal = () => {
    setActiveModal({ type: 'NONE', caseId: '' });
    setEditingMember(null);
  };

  // FUNCIONALIDAD: Toggle de Estado con Confirmación
  const handleToggleFamilyStatus = (caseId: string, memberId: string) => {
    const members = allFamilyData[caseId] || [];
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const actionText = member.isActive ? 'DESACTIVAR' : 'ACTIVAR';
    const isConfirmed = window.confirm(
      `CONFIRMACIÓN DE CAMBIO DE ESTADO\n\n¿Está seguro que desea ${actionText} a ${member.firstName} ${member.firstSurname} en el núcleo familiar?`
    );

    if (!isConfirmed) return;

    setAllFamilyData(prev => {
      const current = prev[caseId] || [];
      const updated = current.map(m => m.id === memberId ? { ...m, isActive: !m.isActive } : m);
      showNotification(`El integrante ha sido ${member.isActive ? 'Desactivado' : 'Activado'} con éxito.`);
      return { ...prev, [caseId]: updated };
    });
  };

  const handleFamilySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const caseId = activeModal.caseId;
    
    const memberData = {
      firstName: (formData.get('firstName') as string).toUpperCase(),
      firstSurname: (formData.get('firstSurname') as string).toUpperCase(),
      docType: formData.get('docType') as string,
      docNumber: formData.get('docNumber') as string,
      relationship: formData.get('relationship') as string,
      birthDate: formData.get('birthDate') as string,
    };

    setAllFamilyData(prev => {
      const members = prev[caseId] || [];
      let updated;
      if (editingMember) {
        updated = members.map(m => m.id === editingMember.id ? { ...m, ...memberData } : m);
        showNotification("Datos actualizados correctamente.");
      } else {
        updated = [...members, { id: `fam-${Date.now()}`, isActive: true, ...memberData }];
        showNotification("Nuevo integrante vinculado.");
      }
      return { ...prev, [caseId]: updated };
    });
    setActiveModal({ type: 'LIST_FAMILY', caseId });
  };

  const currentFamilyMembers = activeModal.caseId ? (allFamilyData[activeModal.caseId] || []) : [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Notificaciones */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-[200] animate-in slide-in-from-right duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border-l-4 border-blue-500 flex items-center gap-3">
            <svg className="text-blue-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Expedientes en Custodia</h1>
          <p className="text-slate-500 text-sm font-medium">Gestión administrativa de núcleos familiares y misiones oficiales.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por radicado o documento..." 
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
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Titular</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidad</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCases.map((c) => (
              <tr key={c.caseId} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">{c.radicado}</td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 uppercase">{c.firstName} {c.firstSurname}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{c.docType}: {c.docNumber}</div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{c.destinationUnit}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setActiveModal({ type: 'MISSION', caseId: c.caseId || '' })}
                      className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-100"
                      title="Nueva Misión"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </button>
                    <button 
                      onClick={() => { setEditingMember(null); setActiveModal({ type: 'FAMILY', caseId: c.caseId || '' }); }}
                      className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100"
                      title="Vincular Familiar"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M16 11h6"/></svg>
                    </button>
                    <button 
                      onClick={() => setActiveModal({ type: 'LIST_FAMILY', caseId: c.caseId || '' })}
                      className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100"
                      title="Núcleo Familiar"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: LISTADO NÚCLEO FAMILIAR (IGUAL A LA IMAGEN) */}
      {activeModal.type === 'LIST_FAMILY' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Header Modal - Azul Degradado */}
              <div className="p-8 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex justify-between items-center">
                 <div className="flex items-center gap-5">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Núcleo Familiar Vinculado</h3>
                      <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Referencia: {activeModal.caseId}</p>
                    </div>
                 </div>
                 <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>

              <div className="p-10">
                 <div className="border border-slate-100 rounded-[1.5rem] overflow-hidden bg-slate-50/30 p-1">
                    <table className="w-full text-sm text-left">
                       <thead className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                          <tr>
                             <th className="px-8 py-5">Estado</th>
                             <th className="px-8 py-5">Integrante</th>
                             <th className="px-8 py-5">Identificación</th>
                             <th className="px-8 py-5">Parentesco</th>
                             <th className="px-8 py-5 text-center">Gestión</th>
                          </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-slate-50">
                          {currentFamilyMembers.map(fam => (
                             <tr key={fam.id} className={`transition-all ${!fam.isActive ? 'opacity-50 grayscale' : ''}`}>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-2.5 h-2.5 rounded-full ${fam.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                      <span className={`text-[10px] font-black uppercase tracking-widest ${fam.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                         {fam.isActive ? 'Activo' : 'Inactivo'}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-8 py-5 font-black text-slate-800 uppercase tracking-tight">{fam.firstName} {fam.firstSurname}</td>
                                <td className="px-8 py-5 font-mono text-xs text-slate-500">{fam.docNumber}</td>
                                <td className="px-8 py-5">
                                   <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                                      {fam.relationship}
                                   </span>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center justify-center gap-3">
                                      {/* Editar - Deshabilitado si inactivo */}
                                      <button 
                                          onClick={() => fam.isActive && setEditingMember(fam)}
                                          disabled={!fam.isActive}
                                          className={`p-2 rounded-xl transition-all ${fam.isActive ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white' : 'text-slate-200 bg-slate-50 cursor-not-allowed'}`}
                                      >
                                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                      </button>
                                      {/* Toggle Estado con Confirmación */}
                                      <button 
                                          onClick={() => handleToggleFamilyStatus(activeModal.caseId, fam.id)}
                                          className={`p-2 rounded-xl transition-all ${fam.isActive ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-500 hover:text-emerald-700'}`}
                                      >
                                          {fam.isActive ? (
                                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3"/></svg>
                                          ) : (
                                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="8" cy="12" r="3"/></svg>
                                          )}
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="mt-10 flex justify-end">
                    <button 
                      onClick={closeModal} 
                      className="px-12 py-3.5 bg-[#101420] text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-black active:scale-95 shadow-xl"
                    >
                       Cerrar
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: FORMULARIO INTEGRANTE (Misma lógica) */}
      {(activeModal.type === 'FAMILY' || editingMember) && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
              <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight">{editingMember ? 'Actualizar Datos' : 'Vincular Integrante'}</h3>
                 <button onClick={() => { closeModal(); setEditingMember(null); }} className="text-white hover:opacity-70"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <form className="p-10 space-y-8" onSubmit={handleFamilySubmit}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Nombres" name="firstName" defaultValue={editingMember?.firstName} required />
                    <InputField label="Apellidos" name="firstSurname" defaultValue={editingMember?.firstSurname} required />
                    <SelectField label="Tipo Documento" name="docType" options={DOC_TYPES} defaultValue={editingMember?.docType} required />
                    <InputField label="Número" name="docNumber" defaultValue={editingMember?.docNumber} required />
                    <SelectField label="Parentesco" name="relationship" options={["Cónyuge", "Hijo/a", "Padre/Madre", "Hermano/a", "Otro"]} defaultValue={editingMember?.relationship} required />
                    <InputField label="Nacimiento" name="birthDate" type="date" defaultValue={editingMember?.birthDate} required />
                 </div>
                 <div className="flex justify-end gap-4 border-t border-slate-100 pt-8">
                    <button type="button" onClick={() => { setActiveModal({type: 'LIST_FAMILY', caseId: activeModal.caseId}); setEditingMember(null); }} className="px-8 py-3 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                    <button type="submit" className="px-10 py-3 bg-emerald-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100">Guardar Registro</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* MODAL: MISIÓN (Truncado para brevedad) */}
      {activeModal.type === 'MISSION' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 bg-indigo-700 text-white flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight">Expedir Orden de Misión</h3>
                 <button onClick={closeModal} className="text-white"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="p-10 overflow-y-auto">
                 <div className="grid grid-cols-2 gap-8 mb-10">
                    <SelectField label="Regional Destino" options={REGIONAL_UNITS} required />
                    <SelectField label="Entidad" options={ENTITIES} required />
                    <SelectField label="Clasificación" options={CANDIDATE_CLASSIFICATIONS} required />
                    <SelectField label="Asunto" options={SUBJECTS} required />
                 </div>
                 <div className="flex justify-end gap-4">
                    <button onClick={closeModal} className="px-10 py-3 bg-slate-100 text-slate-500 font-black rounded-xl uppercase text-[10px]">Descartar</button>
                    <button onClick={() => { showNotification("Misión expedida correctamente"); closeModal(); }} className="px-12 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest">Generar Misión</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SavedCasesPage;
