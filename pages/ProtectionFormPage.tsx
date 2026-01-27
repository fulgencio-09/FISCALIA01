
import React, { useState, useEffect } from 'react';
import { FormSection, InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';
import { ProtectionRequestForm, ValidationErrors } from '../types';
import { CITIES, DOC_TYPES, CIVIL_STATUSES, PERSON_QUALITIES, LEGAL_SYSTEMS, SPOA_SEARCH_DB, REGISTRY_WS_DB } from '../constants';
import { analyzeRiskLevel } from '../services/geminiService';

// Definición de pasos (Steps) que agrupan las 6 secciones - ORDEN ACTUALIZADO
const STEPS = [
  { id: 0, title: 'Procesal', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { id: 1, title: 'Solicitante', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 2, title: 'Fiscal', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id: 3, title: 'Funcionarios', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 4, title: 'Soportes', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> },
];

interface ProtectionFormPageProps {
  initialData?: ProtectionRequestForm;
  isEditing?: boolean;
  onCancel?: () => void;
  onSaveSuccess?: (message: string) => void;
  readOnly?: boolean;
}

const ProtectionFormPage: React.FC<ProtectionFormPageProps> = ({ initialData, isEditing = false, onCancel, onSaveSuccess, readOnly = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<{success: boolean, radicado: string} | null>(null);
  
  // Estado para Toast Local
  const [localToast, setLocalToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  const [spoaLoading, setSpoaLoading] = useState(false);
  const [isSpoaDataLoaded, setIsSpoaDataLoaded] = useState(false); 
  const [wsLoading, setWsLoading] = useState(false);
  const [searchDocType, setSearchDocType] = useState('');
  const [searchDocNumber, setSearchDocNumber] = useState('');
  const [isIdentityLocked, setIsIdentityLocked] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setLocalToast({ show: true, message, type });
    setTimeout(() => setLocalToast(prev => ({ ...prev, show: false })), 4000);
  };

  const defaultData: ProtectionRequestForm = {
    city: '',
    requestDate: new Date().toISOString().split('T')[0],
    nunc: '',
    firstName: '',
    secondName: '',
    firstSurname: '',
    secondSurname: '',
    petitionerDocType: '',
    petitionerDocNumber: '',
    petitionerExpeditionPlace: '',
    petitionerExpeditionDate: '',
    residenceAddress: '',
    locationAddress: '',
    email: '',
    landline: '',
    mobile: '',
    civilStatus: '',
    personQuality: '',
    investigatedFacts: '',
    legalSystem: '',
    investigatedCrimes: '',
    investigationStage: '',
    proceduralMeasures: '',
    riskReview: '',
    additionalInfo: '',
    fiscalName: '',
    fiscalRole: '',
    fiscalUnit: '',
    fiscalCorrespondenceAddress: '',
    fiscalPhone: '',
    fiscalCell: '',
    fiscalInstitutionalEmail: '',
    fiscalOptionalEmail: '',
    policeName: '',
    policeEntity: '',
    policePhone: '',
    policeCell: '',
    policeEmail: '',
    assistantName: '',
    assistantEmail: '',
    assistantPhone: '',
    assistantCell: '',
    attachments: []
  };

  const [formData, setFormData] = useState<ProtectionRequestForm>(initialData || defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCurrentStep(0);
      setSubmissionResult(null);
    }
  }, [initialData]);

  // Función para buscar Noticia Criminal (NUNC) manualmente
  const handleSearchNunc = () => {
    if (!formData.legalSystem) {
        showToast("Por favor, seleccione primero el Sistema.", "warning");
        return;
    }
    if (!formData.nunc || formData.nunc.length < 5) {
        showToast("Ingrese un número de noticia criminal válido.", "warning");
        return;
    }

    setSpoaLoading(true);
    setTimeout(() => {
        const found = SPOA_SEARCH_DB[formData.nunc];
        
        if (found && found.length > 0) {
            const processData = found[0].data; 
            setFormData(prev => ({
                ...prev,
                investigatedFacts: processData.investigatedFacts || prev.investigatedFacts,
                investigatedCrimes: processData.investigatedCrimes || prev.investigatedCrimes,
                investigationStage: processData.investigationStage || prev.investigationStage,
                fiscalName: processData.fiscalName || prev.fiscalName,
                fiscalRole: processData.fiscalRole || prev.fiscalRole,
                fiscalUnit: processData.fiscalUnit || prev.fiscalUnit,
                fiscalCorrespondenceAddress: processData.fiscalCorrespondenceAddress || prev.fiscalCorrespondenceAddress,
                fiscalPhone: processData.fiscalPhone || prev.fiscalPhone,
                fiscalCell: processData.fiscalCell || prev.fiscalCell,
                fiscalInstitutionalEmail: processData.fiscalInstitutionalEmail || prev.fiscalInstitutionalEmail,
                policeName: processData.policeName || prev.policeName,
                policeEntity: processData.policeEntity || prev.policeEntity,
                policePhone: processData.policePhone || prev.policePhone,
                policeCell: processData.policeCell || prev.policeCell,
                policeEmail: processData.policeEmail || prev.policeEmail,
                assistantName: processData.assistantName || prev.assistantName,
                assistantEmail: processData.assistantEmail || prev.assistantEmail,
                assistantPhone: processData.assistantPhone || prev.assistantPhone,
                assistantCell: processData.assistantCell || prev.assistantCell
            }));
            setIsSpoaDataLoaded(true);
            showToast(`Noticia Criminal ${formData.nunc} cargada exitosamente.`, 'success');
        } else {
            setIsSpoaDataLoaded(false);
            showToast("No se encontró noticia criminal con este número", 'error');
        }
        setSpoaLoading(false);
    }, 1000);
  };

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault();
  };

  const updateField = (field: keyof ProtectionRequestForm, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const calculateAge = (birthDateStr: string): number => {
      const birth = new Date(birthDateStr);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      return age;
  };

  const handleConsultRegistry = () => {
    if (!searchDocType || !searchDocNumber) {
        showToast("Seleccione tipo y número de documento.", "warning");
        return;
    }
    setWsLoading(true);
    setTimeout(() => {
        const result = REGISTRY_WS_DB[searchDocNumber];
        if (result) {
            const age = calculateAge(result.birthDate);
            const shouldLock = age >= 14;
            setIsIdentityLocked(shouldLock);
            setFormData(prev => ({
                ...prev,
                firstName: result.firstName,
                secondName: result.secondName,
                firstSurname: result.firstSurname,
                secondSurname: result.secondSurname,
                petitionerDocType: result.petitionerDocType,
                petitionerDocNumber: result.petitionerDocNumber,
                petitionerExpeditionDate: result.petitionerExpeditionDate,
                petitionerExpeditionPlace: result.petitionerExpeditionPlace
            }));
            showToast(`Persona verificada. Edad: ${age} años. ${shouldLock ? 'Datos protegidos.' : 'Datos editables.'}`, 'success');
        } else {
            showToast(`No se encontró información para el documento ${searchDocNumber} en Registraduría.`, 'error');
        }
        setWsLoading(false);
    }, 1500);
  };

  const handleFileSelect = (newFiles: File[]) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
  };

  const handleRemoveFile = (index: number) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const handleAiAnalysis = async () => {
    if (readOnly || !formData.riskReview) return;
    setIsAnalyzing(true);
    const analysis = await analyzeRiskLevel(formData.riskReview, formData.investigatedFacts);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const validateStep = (step: number): boolean => {
    if (readOnly) return true;
    const newErrors: ValidationErrors = {};
    let fieldsToValidate: (keyof ProtectionRequestForm)[] = [];

    switch (step) {
      case 0:
        fieldsToValidate = ['investigatedFacts', 'investigatedCrimes', 'investigationStage', 'proceduralMeasures', 'riskReview'];
        break;
      case 1:
        fieldsToValidate = ['city', 'legalSystem', 'firstName', 'firstSurname', 'petitionerDocType', 'petitionerDocNumber', 'residenceAddress', 'email', 'mobile', 'civilStatus', 'personQuality'];
        break;
      case 2:
        fieldsToValidate = ['fiscalName', 'fiscalRole', 'fiscalUnit', 'fiscalCorrespondenceAddress', 'fiscalCell', 'fiscalInstitutionalEmail'];
        break;
      case 3:
        fieldsToValidate = ['policeName', 'policeEntity', 'policeCell'];
        break;
      case 4:
        fieldsToValidate = []; 
        break;
    }

    fieldsToValidate.forEach(field => { if (!formData[field]) newErrors[field] = 'Campo obligatorio'; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)); };
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleTabClick = (stepIndex: number) => {
    if (!submissionResult) { 
        if (stepIndex < currentStep) setCurrentStep(stepIndex);
        else if (stepIndex === currentStep + 1 || readOnly) if(validateStep(currentStep)) setCurrentStep(stepIndex);
        else if (stepIndex > currentStep + 1 && !readOnly) {
          if(validateStep(currentStep)) setCurrentStep(stepIndex);
        } else if (readOnly) {
          setCurrentStep(stepIndex);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmissionResult({ success: true, radicado: isEditing ? (initialData?.radicado || "ACTUALIZADO") : "" });
      setIsSubmitting(false);
      if (onSaveSuccess) onSaveSuccess(`La solicitud ha sido guardada exitosamente.`);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 relative" onKeyDown={handleKeyDown}>
      {/* Local Toast UI */}
      {localToast.show && (
        <div className="fixed top-20 right-8 z-[9999] animate-in slide-in-from-right duration-300">
           <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-l-4 ${
             localToast.type === 'success' ? 'bg-emerald-600 border-emerald-800' : 
             localToast.type === 'error' ? 'bg-rose-600 border-rose-800' : 'bg-amber-500 border-amber-700'
           } text-white`}>
              <div className="bg-black/10 p-1.5 rounded-lg">
                {localToast.type === 'success' ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
              </div>
              <p className="text-sm font-black uppercase tracking-tight">{localToast.message}</p>
              <button onClick={() => setLocalToast(prev => ({...prev, show: false}))} className="ml-2 hover:opacity-70 transition-opacity">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
           </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{readOnly ? "Visualización de Solicitud" : (isEditing ? "Editar Solicitud" : "Solicitud de Protección")}</h1>
            <p className="text-slate-500 text-sm mt-1">Diligencie las secciones para formalizar el inicio del proceso.</p>
        </div>
        {onCancel && <button onClick={onCancel} className="text-sm bg-slate-200 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-300">{readOnly ? "Volver" : "Cancelar"}</button>}
      </div>
      
      <form onSubmit={handleSubmit}>
        <FormSection title="Datos Generales del Proceso">
          <SelectField label="Ciudad" required options={CITIES} value={formData.city} onChange={e => updateField('city', e.target.value)} error={errors.city} disabled={readOnly} />
          
          <SelectField 
            label="Sistema" 
            required 
            options={LEGAL_SYSTEMS} 
            value={formData.legalSystem} 
            onChange={e => updateField('legalSystem', e.target.value)} 
            error={errors.legalSystem} 
            disabled={readOnly} 
          />

          <InputField label="Fecha Solicitud" type="date" value={formData.requestDate} disabled className="bg-slate-100" />
          
          <div className="col-span-1 md:col-span-3 lg:col-span-1">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-700 mb-1">Noticia Criminal (NUNC)</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="number" 
                                value={formData.nunc} 
                                onChange={e => updateField('nunc', e.target.value)} 
                                disabled={readOnly} 
                                placeholder="Escriba el NUNC..."
                                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.nunc ? 'border-red-500' : 'border-slate-300'}`}
                            />
                            {spoaLoading && <div className="absolute right-3 top-2.5"><svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>}
                        </div>
                        <button 
                            type="button" 
                            onClick={handleSearchNunc} 
                            disabled={readOnly || spoaLoading}
                            className="bg-blue-600 text-white px-4 rounded-lg font-bold text-[10px] uppercase hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {spoaLoading ? "..." : "Buscar"}
                        </button>
                    </div>
                    {errors.nunc && <span className="text-xs text-red-500 mt-1">{errors.nunc}</span>}
                </div>
          </div>
        </FormSection>

        {/* Stepper de 5 Pasos */}
        <div className="mb-8 sticky top-0 z-30 bg-slate-50 pt-2 pb-2">
          <div className="flex items-center justify-between relative px-2">
             <div className="absolute left-0 top-[20px] w-full h-1 bg-slate-200 -z-10 rounded"></div>
             <div className="absolute left-0 top-[20px] h-1 bg-blue-500 -z-10 rounded transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
             {STEPS.map((step) => (
                 <button type="button" key={step.id} onClick={() => handleTabClick(step.id)} className={`flex flex-col items-center gap-1.5 relative bg-slate-50 p-1 rounded-lg transition-all ${step.id === currentStep ? 'scale-105' : ''}`}>
                   <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white ${step.id === currentStep ? 'border-blue-500 shadow-md' : step.id < currentStep ? 'border-green-500 text-green-600' : 'border-slate-300 text-slate-400'}`}>
                      {step.id < currentStep ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> : step.icon(step.id === currentStep)}
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-tight ${step.id === currentStep ? 'text-blue-700' : 'text-slate-500'}`}>{step.title}</span>
                 </button>
             ))}
          </div>
        </div>

        {/* PASO 0: INFORMACIÓN SOBRE ACTUACIONES PROCESALES (Antes Sección 2) */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 1: Información sobre actuaciones procesales">
              <TextAreaField label="Hechos que se investigan" required className="col-span-1 md:col-span-3" value={formData.investigatedFacts} onChange={e => updateField('investigatedFacts', e.target.value)} error={errors.investigatedFacts} disabled={readOnly} />
              <InputField label="Delitos Investigados" required className="col-span-1 md:col-span-2" value={formData.investigatedCrimes} onChange={e => updateField('investigatedCrimes', e.target.value)} error={errors.investigatedCrimes} disabled={readOnly} />
              <InputField label="Etapa de Investigación" required value={formData.investigationStage} onChange={e => updateField('investigationStage', e.target.value)} error={errors.investigationStage} disabled={readOnly} />
              <TextAreaField label="Medidas procesales decretadas" required className="col-span-1 md:col-span-3" value={formData.proceduralMeasures} onChange={e => updateField('proceduralMeasures', e.target.value)} error={errors.proceduralMeasures} disabled={readOnly} />
              <div className="col-span-1 md:col-span-3">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-sm font-medium text-slate-700">Reseña sobre riesgo o amenaza <span className="text-red-500">*</span></label>
                   {!readOnly && <button type="button" onClick={handleAiAnalysis} disabled={isAnalyzing} className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full">{isAnalyzing ? "Analizando..." : "Analizar con IA"}</button>}
                </div>
                <textarea className={`w-full px-3 py-2 border rounded-lg min-h-[100px] ${errors.riskReview ? 'border-red-500' : 'border-slate-300'}`} value={formData.riskReview} onChange={e => updateField('riskReview', e.target.value)} disabled={readOnly} />
                {aiAnalysis && <div className="mt-2 p-3 bg-purple-50 text-purple-800 rounded-lg text-sm">{aiAnalysis}</div>}
              </div>
              <TextAreaField 
                label="Información adicional importante para valorar la solicitud de protección" 
                className="col-span-1 md:col-span-3" 
                value={formData.additionalInfo} 
                onChange={e => updateField('additionalInfo', e.target.value)} 
                disabled={readOnly} 
              />
            </FormSection>
          </div>
        )}

        {/* PASO 1: INFORMACIÓN DEL SOLICITANTE (Antes Sección 1) */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 2: Información del Solicitante">
              {/* Web Service de Registraduría movido aquí */}
              <div className="col-span-1 md:col-span-3 mb-6 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase text-indigo-700 mb-4 flex items-center gap-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.14c1.744-2.772 2.753-6.054 2.753-9.571m3.44 2.14a11.516 11.516 0 01-1.247 4.93m-3.44-2.14a11.516 11.516 0 011.247-4.93m3.44 2.14l-3.44-2.14m3.44 2.14a11.516 11.516 0 001.247-4.93m-3.44-2.14a11.516 11.516 0 00-1.247 4.93"/></svg>
                      Consultar Persona (Web Service Registraduría)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <SelectField label="Tipo Documento" options={DOC_TYPES} value={searchDocType} onChange={e => setSearchDocType(e.target.value)} disabled={readOnly} />
                      <InputField label="Número de Documento" type="number" value={searchDocNumber} onChange={e => setSearchDocNumber(e.target.value)} disabled={readOnly} placeholder="Cédula..." />
                      <button type="button" onClick={handleConsultRegistry} disabled={readOnly || wsLoading} className="bg-indigo-600 text-white h-[42px] px-6 rounded-lg font-bold text-xs uppercase hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                          {wsLoading ? "..." : "Consultar"}
                      </button>
                      <p className="text-[10px] text-slate-500 italic md:col-span-4 mt-2">Nota: Para mayores de 14 años, la información se bloqueará automáticamente.</p>
                  </div>
              </div>

              <InputField label="Primer Nombre" required value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} error={errors.firstName} disabled={readOnly || isIdentityLocked} />
              <InputField label="Segundo Nombre" value={formData.secondName} onChange={e => updateField('secondName', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <InputField label="Primer Apellido" required value={formData.firstSurname} onChange={e => updateField('firstSurname', e.target.value)} error={errors.firstSurname} disabled={readOnly || isIdentityLocked} />
              <InputField label="Segundo Apellido" value={formData.secondSurname} onChange={e => updateField('secondSurname', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <SelectField label="Tipo Documento" required options={DOC_TYPES} value={formData.petitionerDocType} onChange={e => updateField('petitionerDocType', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <InputField label="Número" required value={formData.petitionerDocNumber} onChange={e => updateField('petitionerDocNumber', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <InputField label="Fecha Expedición" type="date" value={formData.petitionerExpeditionDate} onChange={e => updateField('petitionerExpeditionDate', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <InputField label="Lugar Expedición" value={formData.petitionerExpeditionPlace} onChange={e => updateField('petitionerExpeditionPlace', e.target.value)} disabled={readOnly || isIdentityLocked} />
              <InputField label="Dirección Residencia" required value={formData.residenceAddress} onChange={e => updateField('residenceAddress', e.target.value)} error={errors.residenceAddress} disabled={readOnly} />
              <InputField label="Dirección Ubicación" required value={formData.locationAddress} onChange={e => updateField('locationAddress', e.target.value)} disabled={readOnly} />
              <InputField label="Correo Electrónico" type="email" required value={formData.email} onChange={e => updateField('email', e.target.value)} error={errors.email} disabled={readOnly} />
              <InputField label="Celular" type="number" required value={formData.mobile} onChange={e => updateField('mobile', e.target.value)} error={errors.mobile} disabled={readOnly} />
              <SelectField label="Estado Civil" required options={CIVIL_STATUSES} value={formData.civilStatus} onChange={e => updateField('civilStatus', e.target.value)} error={errors.civilStatus} disabled={readOnly} />
              <SelectField label="Calidad de la Persona" required options={PERSON_QUALITIES} value={formData.personQuality} onChange={e => updateField('personQuality', e.target.value)} error={errors.personQuality} disabled={readOnly} />
            </FormSection>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 3: Información Fiscal Conocimiento">
               <InputField label="Nombre Funcionario Fiscal" required value={formData.fiscalName} onChange={e => updateField('fiscalName', e.target.value)} error={errors.fiscalName} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Cargo" required value={formData.fiscalRole} onChange={e => updateField('fiscalRole', e.target.value)} error={errors.fiscalRole} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Unidad" required value={formData.fiscalUnit} onChange={e => updateField('fiscalUnit', e.target.value)} error={errors.fiscalUnit} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Dirección Correspondencia" required value={formData.fiscalCorrespondenceAddress} onChange={e => updateField('fiscalCorrespondenceAddress', e.target.value)} error={errors.fiscalCorrespondenceAddress} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Teléfono Fijo" value={formData.fiscalPhone} onChange={e => updateField('fiscalPhone', e.target.value)} error={errors.fiscalPhone} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Celular" required value={formData.fiscalCell} onChange={e => updateField('fiscalCell', e.target.value)} error={errors.fiscalCell} disabled={readOnly} />
               <InputField label="Email Institucional" type="email" required value={formData.fiscalInstitutionalEmail} onChange={e => updateField('fiscalInstitutionalEmail', e.target.value)} error={errors.fiscalInstitutionalEmail} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Email Opcional" type="email" value={formData.fiscalOptionalEmail} onChange={e => updateField('fiscalOptionalEmail', e.target.value)} error={errors.fiscalOptionalEmail} disabled={readOnly} />
            </FormSection>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <FormSection title="Sección 4: Información Funcionario Policía Judicial">
               <InputField label="Nombre Funcionario" required value={formData.policeName} onChange={e => updateField('policeName', e.target.value)} error={errors.policeName} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Entidad" required value={formData.policeEntity} onChange={e => updateField('policeEntity', e.target.value)} error={errors.policeEntity} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Teléfono" value={formData.policePhone} onChange={e => updateField('policePhone', e.target.value)} error={errors.policePhone} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Celular" required value={formData.policeCell} onChange={e => updateField('policeCell', e.target.value)} error={errors.policeCell} disabled={readOnly || isSpoaDataLoaded} />
               <InputField label="Email Opcional" type="email" value={formData.policeEmail} onChange={e => updateField('policeEmail', e.target.value)} error={errors.policeEmail} disabled={readOnly || isSpoaDataLoaded} />
            </FormSection>
            
            <FormSection title="Sección 5: Información Asistente del Fiscal (opcional)">
               <InputField label="Nombre Asistente" value={formData.assistantName} onChange={e => updateField('assistantName', e.target.value)} error={errors.assistantName} disabled={readOnly} />
               <InputField label="Email" type="email" value={formData.assistantEmail} onChange={e => updateField('assistantEmail', e.target.value)} error={errors.assistantEmail} disabled={readOnly} />
               <InputField label="Teléfono" value={formData.assistantPhone} onChange={e => updateField('assistantPhone', e.target.value)} error={errors.assistantPhone} disabled={readOnly} />
               <InputField label="Celular" value={formData.assistantCell} onChange={e => updateField('assistantCell', e.target.value)} error={errors.assistantCell} disabled={readOnly} />
            </FormSection>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 6: Soportes">
              <FileUpload 
                files={formData.attachments} 
                onFilesSelected={handleFileSelect} 
                onRemoveFile={handleRemoveFile} 
                error={errors.attachments}
                readOnly={readOnly}
                required={false}
              />
            </FormSection>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
           <button type="button" onClick={handleBack} disabled={currentStep === 0} className={`px-6 py-2.5 rounded-lg font-medium ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 border'}`}>Anterior</button>
           <div className="flex gap-3">
             {currentStep < STEPS.length - 1 ? (
               <button type="button" onClick={handleNext} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">Siguiente</button>
             ) : (
               !readOnly && <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg transition-all">{isSubmitting ? "Guardando..." : "Guardar Solicitud"}</button>
             )}
           </div>
        </div>
      </form>
    </div>
  );
};

export default ProtectionFormPage;
