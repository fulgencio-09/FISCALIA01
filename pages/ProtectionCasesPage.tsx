
import React, { useState, useMemo } from 'react';
import { MOCK_REQUESTS, REGIONAL_UNITS, ENTITIES, CANDIDATE_CLASSIFICATIONS, DEPARTMENTS, CITIES, DOC_TYPES, SUBJECTS, AREAS, MISSION_TYPES, ORIGINS } from '../constants';
import { ProtectionCaseForm, ProtectionRequestSummary } from '../types';
import { InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';

// Mock database of existing cases for validation
const MOCK_EXISTING_CASES: Record<string, string> = {
  "79123456": "CASE-2023-0015",
};

const ProtectionCasesPage: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'CREATE' | 'SUMMARY'>('LIST');
  const [activeTab, setActiveTab] = useState<'CORRESPONDENCE' | 'TITULAR' | 'ASSIGNMENT'>('CORRESPONDENCE');
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<'docNumber' | 'radicado'>('docNumber');

  const [radicatedRequests] = useState<ProtectionRequestSummary[]>(
    MOCK_REQUESTS.filter(req => req.status === 'RADICADA')
  );

  const [validatedRequestIds, setValidatedRequestIds] = useState<Set<string>>(new Set());

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'warning' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  
  const [formData, setFormData] = useState<ProtectionCaseForm | null>(null);
  const [missionOrderNo, setMissionOrderNo] = useState('');

  const [validationModal, setValidationModal] = useState<{
    show: boolean;
    caseId: string;
    request: ProtectionRequestSummary | null;
  }>({ show: false, caseId: '', request: null });

  const initialFormState: ProtectionCaseForm = {
    radicado: '',
    radicationDate: '',
    destinationUnit: '',
    remittingEntity: '',
    candidateClassification: '',
    origin: '',
    remitterName: '',
    requestDepartment: '',
    requestCity: '',
    docType: '',
    docNumber: '',
    firstName: '',
    secondName: '',
    firstSurname: '',
    secondSurname: '',
    assignedArea: '',
    missionStartDate: new Date().toISOString().split('T')[0],
    missionType: '',
    dueDate: '',
    observations: '',
    folios: '',
    generateMission: false,
    attachments: []
  };

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return radicatedRequests;
    
    return radicatedRequests.filter(req => {
      const term = searchTerm.toLowerCase();
      if (searchCriteria === 'docNumber') {
        return req.docNumber.toLowerCase().includes(term);
      } else {
        return req.radicado.toLowerCase().includes(term);
      }
    });
  }, [radicatedRequests, searchTerm, searchCriteria]);

  const handleCreateCase = (item: ProtectionRequestSummary) => {
    const nameParts = item.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const secondName = nameParts.length > 3 ? nameParts[1] : (nameParts.length === 3 ? nameParts[1] : '');
    const firstSurname = nameParts.length > 2 ? nameParts[nameParts.length - 2] : (nameParts.length === 2 ? nameParts[1] : '');
    const secondSurname = nameParts.length > 2 ? nameParts[nameParts.length - 1] : '';

    setFormData({
        ...initialFormState,
        radicado: item.radicado,
        radicationDate: item.radicationDate?.split(' ')[0] || '',
        docType: item.docType,
        docNumber: item.docNumber,
        firstName,
        secondName,
        firstSurname,
        secondSurname,
    });
    setActiveTab('CORRESPONDENCE');
    setView('CREATE');
  };

  const handleValidateSolicitant = (item: ProtectionRequestSummary) => {
    const existingCaseId = MOCK_EXISTING_CASES[item.docNumber];
    
    if (existingCaseId) {
        setValidationModal({
            show: true,
            caseId: existingCaseId,
            request: item
        });
        setValidatedRequestIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
        });
    } else {
        setValidatedRequestIds(prev => new Set(prev).add(item.id));
        setToast({
            show: true,
            type: 'success',
            message: `Verificación Exitosa: No se encontraron casos previos para ${item.fullName}. El botón "Crear Caso" ha sido habilitado.`
        });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    }
  };

  const updateField = (field: keyof ProtectionCaseForm, value: any) => {
      if (formData) {
          setFormData({ ...formData, [field]: value });
      }
  };

  const handleFileSelect = (newFiles: File[]) => {
    if (formData) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newFiles]
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        attachments: formData.attachments.filter((_, i) => i !== index)
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      const randomNo = Math.floor(100000 + Math.random() * 900000).toString();
      setMissionOrderNo(randomNo);
      setView('SUMMARY');
  };

  const handleFinishSummary = () => {
    setToast({
      show: true,
      type: 'success',
      message: `Caso de protección guardado para radicado: ${formData?.radicado}`
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    setView('LIST');
    setFormData(null);
  };

  const handleCancel = () => {
      setView('LIST');
      setFormData(null);
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`
        px-6 py-3 text-sm font-bold border-b-2 transition-colors flex-1 md:flex-none
        ${activeTab === id 
            ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
       {toast.show && (
        <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.3s_ease-out]">
            <div className={`
              px-5 py-4 rounded-lg shadow-2xl flex items-center gap-4 max-w-md border-l-4 
              ${toast.type === 'success' ? 'bg-indigo-600 border-indigo-800' : 'bg-amber-600 border-amber-800'}
              text-white
            `}>
                <div className={`${toast.type === 'success' ? 'bg-indigo-700' : 'bg-amber-700'} p-2 rounded-full flex-shrink-0`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {toast.type === 'success' ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>}
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-xs uppercase tracking-wide opacity-90">
                        {toast.type === 'success' ? 'Validación Correcta' : 'Aviso de Sistema'}
                    </h4>
                    <p className="text-sm font-medium mt-0.5">{toast.message}</p>
                </div>
                <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="opacity-70 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
      )}

      {validationModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-full text-amber-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <h3 className="text-lg font-bold text-amber-900">Validación de Solicitante</h3>
                  </div>
                  <div className="p-6">
                      <p className="text-slate-700 leading-relaxed">
                          El número de documento <span className="font-bold">{validationModal.request?.docNumber}</span> ya cuenta con el número de caso: <span className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-amber-900">{validationModal.caseId}</span>.
                      </p>
                      <p className="mt-4 text-slate-800 font-medium text-sm italic">
                          Para evitar la duplicidad de expedientes, se recomienda asociar la nueva solicitud al caso ya existente.
                      </p>
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                      <button 
                        onClick={() => {
                            if (validationModal.request) handleCreateCase(validationModal.request);
                            setValidationModal({ show: false, caseId: '', request: null });
                        }}
                        className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm uppercase tracking-wide text-xs"
                      >
                        SÍ, ASOCIAR A CASO EXISTENTE
                      </button>
                      <button 
                        onClick={() => setValidationModal({ show: false, caseId: '', request: null })}
                        className="w-full py-2.5 bg-white text-slate-600 font-bold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-wide text-xs"
                      >
                        CANCELAR
                      </button>
                  </div>
              </div>
          </div>
      )}

      {view === 'LIST' ? (
        <>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Casos de Protección</h1>
                    <p className="text-slate-500 text-sm mt-1">
                    Gestión de apertura de casos. El botón <span className="text-indigo-600 font-bold">Crear Caso</span> solo se habilitará tras validar al solicitante.
                    </p>
                </div>
                
                <div className="flex items-center gap-0 shadow-sm border border-slate-200 rounded-lg overflow-hidden bg-white max-w-md w-full md:w-auto self-end">
                    <div className="bg-slate-50 border-r border-slate-200">
                        <select 
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value as any)}
                            className="bg-transparent text-xs font-bold text-slate-600 px-3 py-2.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                            <option value="docNumber">No. Documento</option>
                            <option value="radicado">No. Radicado</option>
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Buscar registro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm outline-none placeholder:text-slate-400"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        )}
                    </div>
                    <div className="bg-indigo-600 text-white px-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th scope="col" className="px-6 py-3">Tipo Documento</th>
                        <th scope="col" className="px-6 py-3">Número Documento</th>
                        <th scope="col" className="px-6 py-3">Nombre y Apellido</th>
                        <th scope="col" className="px-6 py-3">Número de Radicado</th>
                        <th scope="col" className="px-6 py-3">Fecha de Radicado</th>
                        <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((item) => {
                            const isValidated = validatedRequestIds.has(item.id);

                            return (
                                <tr key={item.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-700">{item.docType}</td>
                                    <td className="px-6 py-4 font-mono">{item.docNumber}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        <div className="flex items-center gap-2">
                                            {item.fullName}
                                            {isValidated && (
                                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-black uppercase border border-green-200 animate-in zoom-in">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                    Validado
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100 font-mono">
                                            {item.radicado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                                        {item.radicationDate || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleValidateSolicitant(item)}
                                                className={`
                                                    flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-all text-[10px] font-black uppercase tracking-tighter
                                                    ${isValidated 
                                                        ? 'bg-green-600 text-white border-green-700 shadow-sm' 
                                                        : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'}
                                                `}
                                                title={isValidated ? "Re-Validar Solicitante" : "Validar si el solicitante ya tiene un caso abierto"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                  {isValidated ? (
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                  ) : (
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>
                                                  )}
                                                  {isValidated && <polyline points="22 4 12 14.01 9 11.01" />}
                                                </svg>
                                                Validar
                                            </button>
                                            <button
                                                onClick={() => handleCreateCase(item)}
                                                disabled={!isValidated}
                                                className={`
                                                    flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all
                                                    ${isValidated 
                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow hover:shadow-md cursor-pointer scale-100' 
                                                        : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed grayscale'}
                                                `}
                                                title={isValidated ? "Crear nuevo caso" : "Debe validar al solicitante primero"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                                Crear Caso
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            <p className="font-medium italic">No se encontraron registros que coincidan con la búsqueda.</p>
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </>
      ) : view === 'CREATE' ? (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold text-slate-800">Generación de Misión / Caso</h2>
                  <p className="text-sm text-slate-500">Formalización del caso de protección y asignación de misión inicial.</p>
               </div>
               <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-mono font-bold text-sm border border-blue-200">
                   RAD: {formData?.radicado}
               </div>
            </div>

            <div className="flex border-b border-slate-200 overflow-x-auto bg-white sticky top-0 z-10">
                <TabButton id="CORRESPONDENCE" label="1. Correspondencia" />
                <TabButton id="TITULAR" label="2. Información Titular" />
                <TabButton id="ASSIGNMENT" label="3. Asignación y Misión" />
            </div>

            <form onSubmit={handleSave} className="p-6 md:p-8 min-h-[400px]">
               {activeTab === 'CORRESPONDENCE' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <InputField label="Número de Radicado" value={formData?.radicado} disabled className="bg-slate-50 text-slate-500" />
                    <InputField label="Fecha de Radicado" value={formData?.radicationDate} disabled className="bg-slate-50 text-slate-500" />
                    <SelectField label="Unidad Regional Destino" required options={REGIONAL_UNITS} value={formData?.destinationUnit} onChange={e => updateField('destinationUnit', e.target.value)} />
                    <SelectField label="Entidad Remitente" required options={ENTITIES} value={formData?.remittingEntity} onChange={e => updateField('remittingEntity', e.target.value)} />
                    <SelectField label="Clasificación del Candidato" required options={CANDIDATE_CLASSIFICATIONS} value={formData?.candidateClassification} onChange={e => updateField('candidateClassification', e.target.value)} />
                    <SelectField label="Procedencia" required options={ORIGINS} value={formData?.origin} onChange={e => updateField('origin', e.target.value)} />
                    <div className="md:col-span-2"><InputField label="Nombre del Remitente" value={formData?.remitterName} onChange={e => updateField('remitterName', e.target.value)} /></div>
                    <SelectField label="Departamento de Solicitud" required options={DEPARTMENTS} value={formData?.requestDepartment} onChange={e => updateField('requestDepartment', e.target.value)} />
                    <SelectField label="Ciudad de Solicitud" required options={CITIES} value={formData?.requestCity} onChange={e => updateField('requestCity', e.target.value)} />
                 </div>
               )}

               {activeTab === 'TITULAR' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <SelectField label="Tipo de Documento" required options={DOC_TYPES} value={formData?.docType} onChange={e => updateField('docType', e.target.value)} />
                    <InputField label="Número de Documento" required value={formData?.docNumber} onChange={e => updateField('docNumber', e.target.value)} />
                    <InputField label="Primer Nombre del Titular" required value={formData?.firstName} onChange={e => updateField('firstName', e.target.value)} />
                    <InputField label="Segundo Nombre del Titular" value={formData?.secondName} onChange={e => updateField('secondName', e.target.value)} />
                    <InputField label="Primer Apellido del Titular" required value={formData?.firstSurname} onChange={e => updateField('firstSurname', e.target.value)} />
                    <InputField label="Segundo Apellido del Titular" value={formData?.secondSurname} onChange={e => updateField('secondSurname', e.target.value)} />
                 </div>
               )}

               {activeTab === 'ASSIGNMENT' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <SelectField label="Área Asignada" required options={AREAS} value={formData?.assignedArea} onChange={e => updateField('assignedArea', e.target.value)} />
                    <InputField label="Fecha de Inicio Misión" type="date" required value={formData?.missionStartDate} onChange={e => updateField('missionStartDate', e.target.value)} />
                    <SelectField label="Tipo de Misión" required options={MISSION_TYPES} value={formData?.missionType} onChange={e => updateField('missionType', e.target.value)} />
                    <InputField label="Términos Vencen" type="date" value={formData?.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
                    <div className="md:col-span-2"><TextAreaField label="Observaciones" value={formData?.observations} onChange={e => updateField('observations', e.target.value)} className="min-h-[120px]" /></div>
                    <div className="md:col-span-2 mt-4"><FileUpload label="Adjuntar soportes" files={formData?.attachments || []} onFilesSelected={handleFileSelect} onRemoveFile={handleRemoveFile} /></div>
                    <div className="md:col-span-2 mt-8 flex flex-wrap gap-4 pt-4 border-t border-slate-100 justify-end">
                        <button type="submit" className="px-8 py-2.5 bg-slate-800 text-white font-bold rounded shadow-md hover:bg-slate-900 transition-all uppercase tracking-wide text-xs active:scale-95">GUARDAR CASO</button>
                        <button type="button" onClick={handleCancel} className="px-8 py-2.5 bg-white text-slate-700 border border-slate-300 font-bold rounded shadow-sm hover:bg-slate-50 transition-all uppercase tracking-wide text-xs active:scale-95">REGRESAR AL LISTADO</button>
                    </div>
                 </div>
               )}
            </form>
        </div>
      ) : (
        /* SUMMARY VIEW (OFFICIAL FGN / SIDPA FORMAT) */
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 print:max-w-none print:p-0">
            <div className="bg-white p-10 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 font-sans text-slate-900">
                {/* Header Oficial 3 Columnas */}
                <div className="border border-slate-900 grid grid-cols-[1fr,2fr,1.2fr] mb-10 print:mb-8">
                    <div className="border-r border-slate-900 p-4 flex items-center justify-center bg-white">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png" alt="FGN" className="h-14" />
                    </div>
                    <div className="border-r border-slate-900 flex flex-col text-center divide-y divide-slate-900">
                        <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                        <div className="p-2 text-sm font-black uppercase flex-1 flex items-center justify-center">MISIÓN DE TRABAJO</div>
                    </div>
                    <div className="p-0 text-[8px] font-bold uppercase divide-y divide-slate-900">
                        <div className="p-2">CÓDIGO: FGN-MS01-F-03</div>
                        <div className="p-2">VERSIÓN: 01</div>
                        <div className="p-2 text-right">PÁGINA 1 DE 1</div>
                    </div>
                </div>

                {/* Cuerpo del Formato */}
                <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">FECHA:</span>
                        <span>{new Date().toISOString().replace('T', ' ').split('.')[0]}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">MISIÓN DE TRABAJO No.:</span>
                        <span className="font-bold">{missionOrderNo}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4 items-start">
                        <span className="font-bold uppercase leading-tight">RADICADO DE<br/>CORRESPONDENCIA:</span>
                        <div>
                           <span className="font-bold">{formData?.radicado}</span>
                           <span className="block text-[10px] italic text-slate-500 mt-0.5">Al contestar cíte este número</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">CASO NÚMERO:</span>
                        <span>{formData?.caseId || "EN TRÁMITE"}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">ASIGNADO A:</span>
                        <span className="uppercase">PERFIL ANALISTA DE PROTECCIÓN</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">A SOLICITUD DE:</span>
                        <span className="uppercase">{formData?.remittingEntity}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">CIUDAD DE SOLICITUD:</span>
                        <span className="uppercase">{formData?.requestCity}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">TIPO DE MISIÓN:</span>
                        <span className="uppercase">{formData?.missionType}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">NOMBRES:</span>
                        <span className="uppercase">{formData?.firstName} {formData?.secondName}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">PRIMER APELLIDO:</span>
                        <span className="uppercase">{formData?.firstSurname}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">SEGUNDO APELLIDO:</span>
                        <span className="uppercase">{formData?.secondSurname || ""}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold leading-tight">TIPO DE DOCUMENTO DE<br/>IDENTIDAD:</span>
                        <span className="uppercase">{formData?.docType}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold uppercase leading-tight">DOCUMENTO DE IDENTIDAD No.:</span>
                        <span className="font-bold">{formData?.docNumber}</span>
                    </div>
                    <div className="grid grid-cols-[200px,1fr] gap-x-4">
                        <span className="font-bold">UNIDAD ASIGNADA:</span>
                        <span className="uppercase">{formData?.assignedArea}</span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <span className="font-bold uppercase mb-4 block">INSTRUCCIONES:</span>
                        <ol className="list-decimal pl-5 space-y-2 uppercase text-[11px]">
                            <li>ENTREVISTAR AL CANDIDATO Y A LOS ADULTOS INTEGRANTES DE SU NÚCLEO FAMILIAR, SOLICITARLES ANTECEDENTES.</li>
                            <li>REALIZAR VISITA AL PROCESO Y ENTREVISTAR AL FUNCIONARIO JUDICIAL DE CONOCIMIENTO.</li>
                            <li>ESTABLECER Y VERIFICAR NIVELES DE RIESGO Y AMENAZA.</li>
                            <li>RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</li>
                        </ol>
                    </div>

                    <div className="mt-8 pt-4">
                        <span className="font-bold uppercase block mb-2">OBSERVACIONES:</span>
                        <div className="p-4 border border-slate-300 min-h-[80px] bg-white">
                            {formData?.observations || "SIN OBSERVACIONES ADICIONALES."}
                        </div>
                    </div>

                    <div className="mt-8 pt-8">
                        <span className="font-black text-sm">LOS TÉRMINOS VENCEN: {formData?.dueDate || "2026-01-24"}</span>
                    </div>

                    {/* Firma - Solo visible en impresión o resumen final */}
                    <div className="mt-20 pt-10 grid grid-cols-2 gap-20">
                        <div className="text-center">
                            <div className="border-b border-slate-900 w-full mb-2 h-10"></div>
                            <span className="font-bold uppercase text-[10px]">FIRMA FUNCIONARIO ASIGNADO</span>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${missionOrderNo}`} alt="QR" className="border p-1" />
                             <span className="text-[8px] text-slate-400">Verificación SIDPA</span>
                        </div>
                    </div>
                </div>

                {/* Footer del Sistema */}
                <div className="mt-20 border border-slate-900 grid grid-cols-[3fr,1fr,1fr] text-[8px] font-bold text-center divide-x divide-slate-900 print:mt-10">
                    <div className="p-2">Documento no normalizado en el Sistema de Gestión Integral</div>
                    <div className="p-2">Versión 01</div>
                    <div className="p-2">2023-02-01</div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-4 print:hidden">
                    <button onClick={() => window.print()} className="px-6 py-2 bg-white text-slate-700 border border-slate-300 font-bold rounded hover:bg-slate-100 transition-all text-xs uppercase">Imprimir Misión</button>
                    <button onClick={handleFinishSummary} className="px-10 py-2 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700 transition-all text-xs uppercase active:scale-95">Finalizar y Volver al Listado</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProtectionCasesPage;
