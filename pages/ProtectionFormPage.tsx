
import React, { useState, useEffect } from 'react';
import { FormSection, InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';
import { ProtectionRequestForm, ValidationErrors } from '../types';
import { CITIES, DOC_TYPES, CIVIL_STATUSES, PERSON_QUALITIES, LEGAL_SYSTEMS, SPOA_SEARCH_DB } from '../constants';
import { analyzeRiskLevel } from '../services/geminiService';

// Definition of steps/tabs
const STEPS = [
  { id: 0, title: 'Solicitante', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 1, title: 'Procesal', icon: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-blue-600" : "text-slate-500"}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
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
  
  // State for SPOA Search
  const [spoaLoading, setSpoaLoading] = useState(false);
  const [spoaSuccess, setSpoaSuccess] = useState(false);
  const [availablePersons, setAvailablePersons] = useState<{label: string, data: Partial<ProtectionRequestForm>}[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [isSpoaDataLoaded, setIsSpoaDataLoaded] = useState(false);

  const defaultData: ProtectionRequestForm = {
    city: '',
    requestDate: new Date().toISOString().split('T')[0],
    nunc: '',
    petitionerName: '',
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

  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCurrentStep(0);
      setSubmissionResult(null);
      setIsSpoaDataLoaded(!!initialData.nunc);
    }
  }, [initialData]);

  // Automatic Search Effect (Debounced)
  useEffect(() => {
    // Allows search even in readOnly mode so the Involved Persons list populates
    if (!formData.nunc) {
        setAvailablePersons([]);
        setSpoaSuccess(false);
        setSelectedPerson('');
        return;
    }

    // Debounce: Esperar 600ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(() => {
        setSpoaLoading(true);
        setSpoaSuccess(false);
        setAvailablePersons([]);
        
        // Simular búsqueda en la base de datos
        const foundPersons = SPOA_SEARCH_DB[formData.nunc];
        
        if (foundPersons && foundPersons.length > 0) {
            setAvailablePersons(foundPersons);
            setSpoaSuccess(true);
            
            // Auto-select person if loading an existing record (based on DocNumber)
            if (formData.petitionerDocNumber) {
                const match = foundPersons.find(p => p.data.petitionerDocNumber === formData.petitionerDocNumber);
                if (match) {
                    setSelectedPerson(match.label);
                }
            }
        } else {
            setAvailablePersons([]);
            setSelectedPerson('');
        }
        setSpoaLoading(false);
    }, 600); // 600ms delay

    return () => clearTimeout(timeoutId);
  }, [formData.nunc, formData.petitionerDocNumber]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // 2. Person Selection Logic with Auto-fill for requested fields
  const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    setSelectedPerson(selectedLabel);

    if (errors['involvedPerson']) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors['involvedPerson'];
            return newErrors;
        });
    }

    if (selectedLabel) {
      const personData = availablePersons.find(p => p.label === selectedLabel);
      if (personData) {
        // Auto-llenar campos biográficos, procesales y de funcionarios (incluyendo teléfonos y correos)
        setFormData(prev => ({
          ...prev,
          ...personData.data
        }));
        setIsSpoaDataLoaded(true);
      }
    }
  };

  const handleFileSelect = (newFiles: File[]) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
    if (errors['attachments']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['attachments'];
        return newErrors;
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleAiAnalysis = async () => {
    if (readOnly) return;
    if (!formData.riskReview) {
      alert("Por favor diligencia la reseña de riesgo primero.");
      return;
    }
    setIsAnalyzing(true);
    const analysis = await analyzeRiskLevel(formData.riskReview, formData.investigatedFacts);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  // Validation Logic per Step
  const validateStep = (step: number): boolean => {
    if (readOnly) return true;

    const newErrors: ValidationErrors = {};
    let fieldsToValidate: (keyof ProtectionRequestForm)[] = [];

    switch (step) {
      case 0: // General & Petitioner
        fieldsToValidate = [
          'city', 'nunc', 'petitionerName', 'petitionerDocType', 'petitionerDocNumber',
          'petitionerExpeditionPlace', 'petitionerExpeditionDate', 'residenceAddress',
          'locationAddress', 'email', 'mobile', 'civilStatus', 'personQuality'
        ];

        if (!readOnly && availablePersons.length > 0 && !selectedPerson) {
             newErrors['involvedPerson'] = 'Debe seleccionar una persona involucrada de la lista.';
        }
        break;
      case 1: // Procedural
        fieldsToValidate = [
          'investigatedFacts', 'legalSystem', 'investigatedCrimes', 'investigationStage',
          'proceduralMeasures', 'riskReview'
        ];
        break;
      case 2: // Fiscal
        fieldsToValidate = [
          'fiscalName', 'fiscalRole', 'fiscalUnit', 'fiscalCorrespondenceAddress',
          'fiscalCell', 'fiscalInstitutionalEmail'
        ];
        break;
      case 3: // Police
        fieldsToValidate = [
          'policeName', 'policeEntity', 'policeCell'
        ];
        break;
      case 4: // Attachments
        // Section 6 is no longer required as per user request
        break;
    }

    fieldsToValidate.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    if (step === 0 && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (step === 2 && formData.fiscalInstitutionalEmail && !/\S+@\S+\.\S+/.test(formData.fiscalInstitutionalEmail)) newErrors.fiscalInstitutionalEmail = "Email inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstError = document.querySelector('[class*="border-red-500"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (stepIndex: number) => {
    if (!submissionResult) { 
        if (stepIndex < currentStep) {
            setCurrentStep(stepIndex);
        } else if (stepIndex === currentStep + 1 || readOnly) {
            if(validateStep(currentStep)) {
                setCurrentStep(stepIndex);
            }
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    
    if (validateStep(currentStep)) { 
      setIsSubmitting(true);
      
      setTimeout(() => {
        const radicado = isEditing ? (initialData?.radicado || "ACTUALIZADO") : ""; 
        setSubmissionResult({ success: true, radicado });
        setIsSubmitting(false);
        
        if (onSaveSuccess) {
           const message = isEditing 
            ? `La solicitud con NUNC ${formData.nunc} ha sido guardada exitosamente.`
            : `La solicitud con NUNC ${formData.nunc} ha sido guardada exitosamente. El sistema ha registrado la información satisfactoriamente.`;
           onSaveSuccess(message);
        }
      }, 1500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // FORM VIEW
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">
                {readOnly 
                  ? "Visualización de Solicitud (Radicada)" 
                  : (isEditing ? "Editar Solicitud de Medida de Protección" : "Solicitud de Medida de Protección")
                }
            </h1>
            <p className="text-slate-500 text-sm mt-1">
               {readOnly ? "Modo solo lectura. No se permiten cambios." : "Diligencie el formulario paso a paso."}
            </p>
        </div>
        {onCancel && (
            <button 
                onClick={onCancel}
                className="text-sm bg-slate-200 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-300 transition-colors"
            >
                {readOnly ? "Volver" : "Cancelar Edición"}
            </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        
        {/* Datos Generales */}
        <FormSection title="Datos Generales">
          
          {formData.radicado && (
             <>
               <InputField 
                 label="Número de Radicado" 
                 value={formData.radicado} 
                 disabled 
                 className="font-semibold text-blue-700 bg-blue-50/50"
               />
               <InputField 
                 label="Fecha de Radicación" 
                 value={formData.radicationDate || ''} 
                 disabled 
                 className="bg-slate-100"
               />
             </>
          )}

          <SelectField 
            label="Ciudad" required options={CITIES} value={formData.city} 
            onChange={e => updateField('city', e.target.value)} error={errors.city}
            disabled={readOnly}
          />
          <InputField 
            label="Fecha de Solicitud" type="date" value={formData.requestDate} disabled className="bg-slate-100"
          />
          
          <div className="relative col-span-1">
             <div className="flex items-center relative">
                <InputField 
                    label="Número Único de Noticia (NUNC)" 
                    type="number"
                    required 
                    value={formData.nunc} 
                    onChange={e => updateField('nunc', e.target.value)} 
                    error={errors.nunc}
                    disabled={readOnly || (isEditing && isSpoaDataLoaded)} 
                    placeholder={readOnly ? "" : "Digite NUNC para buscar..."}
                    className="w-full"
                />
                
                {!readOnly && (
                    <div className="absolute right-3 top-8">
                        {spoaLoading && (
                            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        )}
                        {!spoaLoading && spoaSuccess && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                    </div>
                )}
             </div>
             
             {!readOnly && !spoaLoading && spoaSuccess && (
                 <div className="text-xs text-green-600 mt-1 animate-in fade-in">
                     NUNC validado. Seleccione persona.
                 </div>
             )}
          </div>
          
          {availablePersons.length > 0 && (
             <div className="animate-in fade-in slide-in-from-top-2 duration-500 col-span-1 md:col-span-3">
                <SelectField
                    label="Personas Involucradas (Seleccionar para autocompletar)"
                    required
                    options={availablePersons.map(p => p.label)}
                    value={selectedPerson}
                    onChange={handlePersonChange}
                    error={errors['involvedPerson']}
                    disabled={readOnly}
                    className={`w-full h-[35px] px-4 text-base border border-blue-300 rounded-lg bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
             </div>
          )}

        </FormSection>

        {/* Tabs / Stepper */}
        <div className="mb-8 print:hidden sticky top-0 z-30 bg-slate-50 pt-2 pb-2">
          <div className="flex items-center justify-between relative">
             <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
             <div 
               className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 -z-10 rounded transition-all duration-300"
               style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
             ></div>

             {STEPS.map((step) => {
               const isActive = step.id === currentStep;
               const isCompleted = step.id < currentStep;
               
               return (
                 <button 
                   type="button"
                   key={step.id}
                   onClick={() => handleTabClick(step.id)}
                   className={`
                      group flex flex-col items-center gap-2 relative bg-slate-50 p-2 rounded-lg transition-all focus:outline-none
                      ${isActive ? 'scale-110' : 'hover:bg-white'}
                   `}
                 >
                   <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white
                      ${isActive ? 'border-blue-500 shadow-md' : isCompleted ? 'border-green-500 text-green-600' : 'border-slate-300 text-slate-400'}
                   `}>
                      {isCompleted ? (
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                         step.icon(isActive)
                      )}
                   </div>
                   <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                     {step.title}
                   </span>
                 </button>
               );
             })}
          </div>
        </div>

        {/* Step 0: Petitioner */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 1: Información de La persona quien solicita proteger">
              <InputField 
                label="Nombres y Apellidos" required value={formData.petitionerName} 
                onChange={e => updateField('petitionerName', e.target.value)} error={errors.petitionerName}
                disabled
              />
              <SelectField 
                label="Tipo de Documento" required options={DOC_TYPES} value={formData.petitionerDocType} 
                onChange={e => updateField('petitionerDocType', e.target.value)} error={errors.petitionerDocType}
                disabled
              />
              <InputField 
                label="Número de Documento" type="number" required value={formData.petitionerDocNumber} 
                onChange={e => updateField('petitionerDocNumber', e.target.value)} error={errors.petitionerDocNumber}
                disabled
              />
              <SelectField 
                label="Lugar de Expedición" required options={CITIES} value={formData.petitionerExpeditionPlace} 
                onChange={e => updateField('petitionerExpeditionPlace', e.target.value)} error={errors.petitionerExpeditionPlace}
                disabled
              />
              <InputField 
                label="Fecha de Expedición" type="date" required value={formData.petitionerExpeditionDate} 
                onChange={e => updateField('petitionerExpeditionDate', e.target.value)} error={errors.petitionerExpeditionDate}
                disabled
              />
              <InputField 
                label="Dirección Residencia" required value={formData.residenceAddress} 
                onChange={e => updateField('residenceAddress', e.target.value)} error={errors.residenceAddress}
                disabled={readOnly}
              />
              <InputField 
                label="Dirección Ubicación" required value={formData.locationAddress} 
                onChange={e => updateField('locationAddress', e.target.value)} error={errors.locationAddress}
                disabled={readOnly}
              />
              <InputField 
                label="Correo Electrónico" type="email" required value={formData.email} 
                onChange={e => updateField('email', e.target.value)} error={errors.email}
                disabled={readOnly}
              />
              <InputField 
                label="Teléfono Fijo" type="number" value={formData.landline} 
                onChange={e => updateField('landline', e.target.value)} error={errors.landline}
                disabled={readOnly}
              />
              <InputField 
                label="Celular" type="number" required value={formData.mobile} 
                onChange={e => updateField('mobile', e.target.value)} error={errors.mobile}
                disabled={readOnly}
              />
              <SelectField 
                label="Estado Civil" required options={CIVIL_STATUSES} value={formData.civilStatus} 
                onChange={e => updateField('civilStatus', e.target.value)} error={errors.civilStatus}
                disabled={readOnly}
              />
              <SelectField 
                label="Calidad de la Persona" required options={PERSON_QUALITIES} value={formData.personQuality} 
                onChange={e => updateField('personQuality', e.target.value)} error={errors.personQuality}
                disabled={readOnly}
              />
            </FormSection>
          </div>
        )}

        {/* Step 1: Procesal */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 2: Información sobre actuaciones procesales">
              <TextAreaField 
                label="Hechos que se investigan" required className="col-span-1 md:col-span-3"
                value={formData.investigatedFacts} onChange={e => updateField('investigatedFacts', e.target.value)} error={errors.investigatedFacts}
                disabled
              />
              <SelectField 
                label="Sistema" required options={LEGAL_SYSTEMS} value={formData.legalSystem} 
                onChange={e => updateField('legalSystem', e.target.value)} error={errors.legalSystem}
                disabled
              />
              <InputField 
                label="Delitos Investigados" required className="col-span-1 md:col-span-2"
                value={formData.investigatedCrimes} onChange={e => updateField('investigatedCrimes', e.target.value)} error={errors.investigatedCrimes}
                disabled
              />
              <InputField 
                label="Etapa de Investigación" required value={formData.investigationStage} 
                onChange={e => updateField('investigationStage', e.target.value)} error={errors.investigationStage}
                disabled
              />
              <TextAreaField 
                label="Medidas procesales decretadas (o a decretar)" required className="col-span-1 md:col-span-3"
                placeholder="Incluir tiempo aproximado..."
                value={formData.proceduralMeasures} onChange={e => updateField('proceduralMeasures', e.target.value)} error={errors.proceduralMeasures}
                disabled={readOnly}
              />
              
              <div className="col-span-1 md:col-span-3">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-sm font-medium text-slate-700">Reseña sobre riesgo o amenaza <span className="text-red-500">*</span></label>
                   {!readOnly && (
                    <button 
                        type="button" 
                        onClick={handleAiAnalysis}
                        disabled={isAnalyzing}
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                        >
                        {isAnalyzing ? <span>Analizando...</span> : (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12z"/><path d="M21 12v9"/></svg>
                            Analizar Riesgo con IA
                            </>
                        )}
                    </button>
                   )}
                </div>
                <textarea
                  className={`
                    w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[100px]
                    ${errors.riskReview ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
                    ${readOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
                  `}
                  value={formData.riskReview}
                  onChange={e => updateField('riskReview', e.target.value)}
                  disabled={readOnly}
                />
                {errors.riskReview && <span className="text-xs text-red-500 mt-1">{errors.riskReview}</span>}
                {aiAnalysis && (
                   <div className="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800 animate-in fade-in">
                      <strong className="block font-semibold mb-1">Análisis IA:</strong>
                      {aiAnalysis}
                   </div>
                )}
              </div>
              
              <TextAreaField 
                label="Información Adicional" className="col-span-1 md:col-span-3"
                value={formData.additionalInfo} onChange={e => updateField('additionalInfo', e.target.value)} error={errors.additionalInfo}
                disabled={readOnly}
              />
            </FormSection>
          </div>
        )}

        {/* Step 2: Fiscal */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 3: Información Fiscal Conocimiento">
               <InputField label="Nombre Funcionario Fiscal" required value={formData.fiscalName} onChange={e => updateField('fiscalName', e.target.value)} error={errors.fiscalName} disabled />
               <InputField label="Cargo" required value={formData.fiscalRole} onChange={e => updateField('fiscalRole', e.target.value)} error={errors.fiscalRole} disabled />
               <InputField label="Unidad" required value={formData.fiscalUnit} onChange={e => updateField('fiscalUnit', e.target.value)} error={errors.fiscalUnit} disabled />
               <InputField label="Dirección Correspondencia" required value={formData.fiscalCorrespondenceAddress} onChange={e => updateField('fiscalCorrespondenceAddress', e.target.value)} error={errors.fiscalCorrespondenceAddress} disabled />
               <InputField label="Teléfono Fijo" value={formData.fiscalPhone} onChange={e => updateField('fiscalPhone', e.target.value)} error={errors.fiscalPhone} disabled />
               <InputField label="Celular" required value={formData.fiscalCell} onChange={e => updateField('fiscalCell', e.target.value)} error={errors.fiscalCell} disabled={readOnly} />
               <InputField label="Email Institucional" type="email" required value={formData.fiscalInstitutionalEmail} onChange={e => updateField('fiscalInstitutionalEmail', e.target.value)} error={errors.fiscalInstitutionalEmail} disabled />
               <InputField label="Email Opcional" type="email" value={formData.fiscalOptionalEmail} onChange={e => updateField('fiscalOptionalEmail', e.target.value)} error={errors.fiscalOptionalEmail} disabled={readOnly} />
            </FormSection>
          </div>
        )}

        {/* Step 3: Funcionarios */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FormSection title="Sección 4: Información Funcionario Policía Judicial">
               <InputField label="Nombre Funcionario" required value={formData.policeName} onChange={e => updateField('policeName', e.target.value)} error={errors.policeName} disabled />
               <InputField label="Entidad" required value={formData.policeEntity} onChange={e => updateField('policeEntity', e.target.value)} error={errors.policeEntity} disabled />
               <InputField label="Teléfono" value={formData.policePhone} onChange={e => updateField('policePhone', e.target.value)} error={errors.policePhone} disabled />
               <InputField label="Celular" required value={formData.policeCell} onChange={e => updateField('policeCell', e.target.value)} error={errors.policeCell} disabled />
               <InputField label="Email" type="email" value={formData.policeEmail} onChange={e => updateField('policeEmail', e.target.value)} error={errors.policeEmail} disabled={readOnly} />
            </FormSection>
             <FormSection title="Sección 5: Información Asistente del Fiscal (opcional)">
               <InputField label="Nombre Asistente" value={formData.assistantName} onChange={e => updateField('assistantName', e.target.value)} error={errors.assistantName} disabled />
               <InputField label="Email" type="email" value={formData.assistantEmail} onChange={e => updateField('assistantEmail', e.target.value)} error={errors.assistantEmail} disabled />
               <InputField label="Teléfono" value={formData.assistantPhone} onChange={e => updateField('assistantPhone', e.target.value)} error={errors.assistantPhone} disabled />
               <InputField label="Celular" value={formData.assistantCell} onChange={e => updateField('assistantCell', e.target.value)} error={errors.assistantCell} disabled />
            </FormSection>
          </div>
        )}

        {/* Step 4: Soportes */}
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

        {/* Footer Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
           <button 
             type="button" 
             onClick={handleBack}
             disabled={currentStep === 0}
             className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 border border-slate-300'}`}
           >
             Anterior
           </button>

           <div className="flex gap-3">
             {currentStep < STEPS.length - 1 ? (
               <button 
                 type="button" 
                 onClick={handleNext}
                 className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
               >
                 Siguiente
               </button>
             ) : (
               !readOnly && (
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className={`
                     px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2
                     ${isSubmitting ? 'opacity-75 cursor-wait' : ''}
                   `}
                 >
                   {isSubmitting ? (
                     <>
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       {isEditing ? "Actualizando..." : "Guardando..."}
                     </>
                   ) : (
                     <>
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                       {isEditing ? "Actualizar Solicitud" : "Guardar Solicitud"}
                     </>
                   )}
                 </button>
               )
             )}
           </div>
        </div>
      </form>
    </div>
  );
};

export default ProtectionFormPage;
