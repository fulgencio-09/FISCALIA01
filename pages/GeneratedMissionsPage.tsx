
import React, { useState, useMemo } from 'react';
import { MOCK_SAVED_CASES, MOCK_OFFICIALS, REGIONAL_UNITS } from '../constants';
import { ProtectionMission, ProtectionCaseForm } from '../types';
import { InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';

interface GeneratedMissionsPageProps {
  missions: ProtectionMission[];
  onSaveSuccess?: (message: string, updatedMission: ProtectionMission) => void;
}

const GeneratedMissionsPage: React.FC<GeneratedMissionsPageProps> = ({ missions, onSaveSuccess }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);
  const [associatedCase, setAssociatedCase] = useState<ProtectionCaseForm | null>(null);

  // Form states for re-assignment (Editable fields)
  const [assignedOfficial, setAssignedOfficial] = useState('');
  const [regional, setRegional] = useState('');
  const [reassignmentDate, setReassignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [observations, setObservations] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // FILTRO: Solo mostrar misiones PENDIENTES
  const pendingMissions = useMemo(() => {
    const casesMap = new Map(MOCK_SAVED_CASES.map(c => [c.radicado, c]));
    
    return missions
      .filter(m => m.status === 'PENDIENTE') // REQUERIMIENTO: Se oculta al reasignar
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
    if (!searchTerm.trim()) return pendingMissions;
    const term = searchTerm.toLowerCase();
    return pendingMissions.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.caseRadicado.toLowerCase().includes(term) ||
      m.caseId.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, pendingMissions]);

  const handleReassignAction = (mission: any) => {
    const caseData = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    setSelectedMission(mission);
    setAssociatedCase(caseData || null);
    
    // Reset editable fields
    setAssignedOfficial('');
    setRegional('');
    setReassignmentDate(new Date().toISOString().split('T')[0]);
    setObservations('');
    setAttachedFiles([]);
    
    setView('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regional || !assignedOfficial) {
      alert("Regional y Funcionario son campos obligatorios.");
      return;
    }
    
    if (!selectedMission) return;

    // Actualizamos el objeto misión
    const updatedMission: ProtectionMission = {
        ...selectedMission,
        status: 'ASIGNADA', // CAMBIO DE ESTADO
        assignedOfficial,
        regional,
        reassignmentDate,
        observations
    };

    const successMessage = `Se ha asignado la Misión al funcionario ${assignedOfficial} de la Regional ${regional}`;
    
    if (onSaveSuccess) {
      onSaveSuccess(successMessage, updatedMission);
    }
    
    setView('LIST');
  };

  if (view === 'DETAIL' && selectedMission && associatedCase) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="mb-6 flex justify-between items-center print:hidden">
            <button 
                onClick={() => setView('LIST')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Regresar a la Bandeja
            </button>
            <button 
                onClick={() => window.print()}
                className="bg-white border border-slate-300 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
            >
                Imprimir Documento
            </button>
        </div>

        <form onSubmit={handleSaveReassignment} className="bg-white border-2 border-slate-900 shadow-2xl overflow-hidden print:border-none print:shadow-none mb-20">
            {/* Header Oficial FGN */}
            <div className="p-8 border-b-2 border-slate-900 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png" alt="FGN" className="h-14" />
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tight">Fiscalía General de la Nación</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Dirección de Protección y Asistencia</p>
                    </div>
                </div>
                <div className="text-right border-l-2 border-slate-900 pl-8">
                    <span className="text-[9px] font-black text-slate-400 block tracking-widest uppercase">Misión No.</span>
                    <span className="text-xl font-mono font-black text-blue-700">{selectedMission.missionNo}</span>
                </div>
            </div>

            <div className="p-10 md:p-14 space-y-12">
                
                {/* SECCIÓN I: INFORMACIÓN PRECARGADA (Solo Lectura) */}
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        I. Datos del Expediente y Misión (Precargados)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputField label="Numero de Misión" value={selectedMission.missionNo} disabled className="bg-slate-50" />
                        <InputField label="Numero de caso" value={associatedCase.caseId || ''} disabled className="bg-slate-50" />
                        <InputField label="Numero de Radicado" value={associatedCase.radicado} disabled className="bg-slate-50" />
                        
                        <InputField label="Fecha de generación Misión de Trabajo" value={selectedMission.creationDate} disabled className="bg-slate-50" />
                        <InputField label="Fecha de Inicio de Misión de Trabajo" value={associatedCase.missionStartDate} disabled className="bg-slate-50" />
                        <InputField label="Fecha de vencimiento de términos" value={selectedMission.dueDate} disabled className="bg-slate-50 text-red-600 font-bold" />
                        
                        <div className="md:col-span-3">
                             <InputField label="Tipo de Misión" value={selectedMission.type} disabled className="bg-slate-50 uppercase font-bold" />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        II. Identificación del Titular (Precargados)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <InputField label="Primer Nombre del Titular" value={associatedCase.firstName} disabled className="bg-slate-50" />
                        <InputField label="Segundo Nombre del Titular" value={associatedCase.secondName} disabled className="bg-slate-50" />
                        <InputField label="Primer Apellido del Titular" value={associatedCase.firstSurname} disabled className="bg-slate-50" />
                        <InputField label="Segundo Apellido del Titular" value={associatedCase.secondSurname} disabled className="bg-slate-50" />
                        
                        <div className="md:col-span-2 lg:col-span-2">
                            <InputField label="Tipo de Documento" value={associatedCase.docType} disabled className="bg-slate-50" />
                        </div>
                        <div className="md:col-span-2 lg:col-span-2">
                            <InputField label="Numero de Documento" value={associatedCase.docNumber} disabled className="bg-slate-50 font-mono" />
                        </div>
                    </div>
                </section>

                {/* SECCIÓN III: DATOS A DILIGENCIAR (Editables) */}
                <section className="bg-blue-50/40 p-10 rounded-[2.5rem] border-2 border-blue-200">
                    <h3 className="text-[11px] font-black uppercase text-blue-900 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        III. Gestión de Reasignación de Misión
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <SelectField 
                            label="Regional" 
                            required 
                            options={REGIONAL_UNITS} 
                            value={regional} 
                            onChange={e => setRegional(e.target.value)} 
                        />
                        <SelectField 
                            label="Funcionario" 
                            required 
                            options={MOCK_OFFICIALS} 
                            value={assignedOfficial} 
                            onChange={e => setAssignedOfficial(e.target.value)} 
                        />
                        <InputField 
                            label="Fecha de reasignación de misión" 
                            type="date" 
                            value={reassignmentDate} 
                            onChange={e => setReassignmentDate(e.target.value)} 
                        />
                    </div>
                    <div className="mt-8">
                        <TextAreaField 
                            label="Observaciones" 
                            required 
                            value={observations} 
                            onChange={e => setObservations(e.target.value)} 
                            placeholder="Ingrese los motivos de la reasignación o instrucciones adicionales..."
                            className="min-h-[120px]"
                        />
                    </div>
                    <div className="mt-8">
                        <FileUpload 
                            label="Adjuntar Documentos"
                            files={attachedFiles}
                            onFilesSelected={handleFileChange}
                            onRemoveFile={handleRemoveFile}
                        />
                    </div>
                </section>

                <div className="pt-10 flex justify-between items-end border-t-2 border-slate-100">
                    <div className="w-64 border-t border-slate-300 pt-2 text-center">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 italic">Firma Digital del Responsable</p>
                         <p className="text-[10px] font-black uppercase text-slate-900">{assignedOfficial || "________________________"}</p>
                    </div>
                    <div className="text-right">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedMission.missionNo}`} alt="QR" className="inline-block border-2 border-slate-900 p-1 rounded bg-white shadow-sm" />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 flex justify-end gap-4 print:hidden">
                <button 
                    type="button" 
                    onClick={() => setView('LIST')}
                    className="px-10 py-3 bg-white/10 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="px-14 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                    Confirmar Reasignación
                </button>
            </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Misiones de Protección (Pendientes)</h1>
          <p className="text-slate-500 font-medium italic">Bandeja de órdenes de trabajo esperando asignación inicial.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Filtrar misiones..." 
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
                <th className="px-8 py-6">No. Radicado</th>
                <th className="px-8 py-6">No. Caso</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">{m.creationDate}</span>
                    </td>
                    <td className="px-8 py-6 font-mono font-black text-blue-700 text-sm">
                        {m.missionNo}
                    </td>
                    <td className="px-8 py-6">
                        <div className="font-black text-slate-900 uppercase text-[11px] leading-tight max-w-[220px]">
                        {m.subject}
                        </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">
                        {m.caseRadicado}
                    </td>
                    <td className="px-8 py-6 font-mono text-xs font-black text-indigo-600">
                        {m.caseId}
                    </td>
                    <td className="px-8 py-6 text-center">
                        <button 
                            onClick={() => handleReassignAction(m)}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 mx-auto"
                        >
                            Reasignar Misión
                        </button>
                    </td>
                    </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                             <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                             <p className="text-[11px] font-black uppercase tracking-widest">No hay misiones pendientes de asignación</p>
                        </div>
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

export default GeneratedMissionsPage;
