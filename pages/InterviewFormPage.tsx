
import React, { useState, useMemo, useEffect } from 'react';
import { ProtectionMission, TechnicalInterviewForm, FamilyMember, Pet } from '../types';
import { InputField, SelectField, TextAreaField } from '../components/FormComponents';
import { COLOMBIA_GEO, MOCK_FULL_REQUESTS, MOCK_SAVED_CASES, REGIONAL_UNITS } from '../constants';

interface InterviewFormPageProps {
  mission?: ProtectionMission;
  onCancel: () => void;
  onSaveSuccess: (msg: string) => void;
}

const STEPS = [
  '1. MISIÓN Y CONTROL',
  '2. CANDIDATO',
  '3. CARACTERIZACIÓN',
  '4. NÚCLEO FAMILIAR',
  '5. ANIMALES',
  '6. SALUD Y CONSUMO',
  '7. VULNERABILIDAD',
  '8. DIFERENCIAL / CIERRE'
];

const ENFOQUES_DIFERENCIALES = [
  'MADRE CABEZA DE FAMILIA',
  'PADRE CABEZA DE FAMILIA',
  'PERSONA MAYOR (60 AÑOS O MAS)',
  'NIÑO, NIÑA. ADOLESCENTE (VICTIMA, TESTIGO INTERVINIENTE)',
  'INDIGENA',
  'PALENQUERO, NEGRO, MULATO, AFROCOLOMBIANO, RAIZAL',
  'GITANO ROM',
  'CAMPESINO',
  'DISCAPACITADO',
  'MIGRANTE',
  'VICTIMA DEL CONFLICTO ARMADO',
  'VICTIMA DE VIOLENCIA SEXUAL EN EL MARCO DEL CONFLICTO ARMADO',
  'VICTIMA DE VIOLENCIA INTRAFAMILIAR'
];

const ENFOQUES_GENERO = [
  'LGBTI',
  'MUJER VÍCTIMA INTERVINIENTE EN EL PROCESO PENAL',
  'MUJER VICTIMA DE CONFLICTO ARMADO',
  'MUJER VÍCTIMA DE VIOLENCIA INTRAFAMILIAR',
  'MUJER VICTIMA DE VIOLENCIA SEXUAL'
];

const InterviewFormPage: React.FC<InterviewFormPageProps> = ({ mission, onCancel, onSaveSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Función para calcular la edad exacta
  const calculateAge = (birthDateString: string): string => {
    if (!birthDateString) return '';
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age.toString() : '0';
  };

  // Obtener datos extendidos del caso para auto-llenado
  const extendedData = useMemo(() => {
    if (!mission) return null;
    const caseInfo = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    // Buscar la solicitud original que dio origen al radicado
    const requestInfo = Object.values(MOCK_FULL_REQUESTS).find(r => r.radicado === mission.caseRadicado);
    return { caseInfo, requestInfo };
  }, [mission]);

  const [formData, setFormData] = useState<TechnicalInterviewForm>({
    // SECCIÓN 1: PRECARGADOS
    caseNumber: mission?.caseRadicado || 'N/A',
    missionNumber: mission?.missionNo || 'N/A',
    missionObject: mission?.type || 'EVALUACIÓN TÉCNICA DE RIESGO',
    assignedEvaluator: mission?.assignedOfficial || 'SISTEMA CENTRAL',
    regional: mission?.regional || '',
    interviewAuthorized: '',
    // SECCIÓN 1: EVALUADOR
    place: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',

    // SECCIÓN 2: PRECARGADOS (Carga inicial)
    name1: extendedData?.caseInfo?.firstName || '',
    name2: extendedData?.caseInfo?.secondName || '',
    surname1: extendedData?.caseInfo?.firstSurname || '',
    surname2: extendedData?.caseInfo?.secondSurname || '',
    docType: extendedData?.caseInfo?.docType || 'Cédula de Ciudadanía',
    docNumber: mission?.petitionerDoc || '',
    expeditionDate: extendedData?.requestInfo?.petitionerExpeditionDate || '',
    expeditionPlace: extendedData?.requestInfo?.petitionerExpeditionPlace || '',
    
    // SECCIÓN 2: EVALUADOR
    birthPlace: '',
    birthDepartment: '',
    birthMunicipality: '',
    birthDate: '',
    age: '',
    sex: '',
    residenceAddress: extendedData?.requestInfo?.residenceAddress || '',
    residenceDepartment: '',
    residenceMunicipality: '',
    correspondenceAddress: '',
    correspondenceDepartment: '',
    correspondenceMunicipality: '',
    email: extendedData?.requestInfo?.email || '',
    phoneLandline: extendedData?.requestInfo?.landline || '',
    phoneMobile: extendedData?.requestInfo?.mobile || '',
    phoneOther: '',
    zone: '',
    ruvRegistered: '',
    rumvRegistered: '',

    // SECCIÓN 3: CARACTERIZACIÓN
    personQuality: extendedData?.requestInfo?.personQuality || '',
    civilStatus: extendedData?.requestInfo?.civilStatus || '',
    dependentsCount: '',
    educationLevel: '',
    occupation: '',
    profession: '',
    monthlyIncome: '',
    observationsGeneral: '',

    // SECCIÓN 4: FAMILIA
    familyMembers: [],

    // SECCIÓN 5: ANIMALES
    hasPets: '',
    petsCount: '',
    pets: [],
    petHealthCondition: '',
    isSpecialBreed: '',
    hasTravelResources: '',
    petObservations: '',

    // SECCIÓN 6: SALUD
    physicalIllness: '',
    physicalIllnessDetails: '',
    hospitalizedPhysical: '',
    familyPhysicalIllness: '',
    familyPhysicalIllnessDetails: '',
    familyPhysicalWho: '',
    familyPhysicalHospitalized: '',
    mentalIllness: '',
    mentalIllnessDetails: '',
    hospitalizedMental: '',
    familyMentalIllness: '',
    familyMentalIllnessDetails: '',
    familyMentalWho: '',
    familyMentalHospitalized: '',
    uninterruptibleMeds: '',
    whoInTreatment: '',
    // CONSUMO
    consumesSubstances: '',
    substancesDetails: '',
    consumptionTime: '',
    familyConsumesSubstances: '',
    familyConsumesWho: '',
    familySubstancesDetails: '',
    inTreatmentSubstances: '',
    familyInTreatmentSubstances: '',
    familyInTreatmentWho: '',

    // SECCIÓN 7: VULNERABILIDAD
    proceduralIntervention: extendedData?.requestInfo?.investigatedFacts || '',
    threatsReceived: extendedData?.requestInfo?.riskReview || '',
    hasConvictions: '',
    isSubstituteBeneficiary: '',
    previouslyEvaluated: '',
    previouslyEvaluatedWhich: '',
    hasCurrentMeasures: '',
    currentMeasuresWho: '',
    appliesSecurityNorms: '',
    remainsInRiskZone: '',
    illegalOrgsInSector: '',
    techSecurityMeans: '',
    policeSupportNearby: '',
    housePhysicalDescription: '',
    workEnvironmentVulnerability: '',
    dailyMobilityVulnerability: '',

    // SECCIÓN 8: DIFERENCIAL
    differentialFactors: {},
    observationsDifferential: '',
    vulnerabilityDifferentialPop: '',
    vulnerabilityGender: '',
    vulnerabilityFamilyEnvironment: ''
  });

  // EFECTO DE SINCRONIZACIÓN: Asegura que si extendedData cambia, el formulario se actualice con la información del sistema
  useEffect(() => {
    if (extendedData) {
      setFormData(prev => ({
        ...prev,
        name1: extendedData.caseInfo?.firstName || prev.name1,
        name2: extendedData.caseInfo?.secondName || prev.name2,
        surname1: extendedData.caseInfo?.firstSurname || prev.surname1,
        surname2: extendedData.caseInfo?.secondSurname || prev.surname2,
        docType: extendedData.caseInfo?.docType || prev.docType,
        docNumber: extendedData.caseInfo?.docNumber || prev.docNumber,
        expeditionDate: extendedData.requestInfo?.petitionerExpeditionDate || prev.expeditionDate,
        expeditionPlace: extendedData.requestInfo?.petitionerExpeditionPlace || prev.expeditionPlace,
        residenceAddress: extendedData.requestInfo?.residenceAddress || prev.residenceAddress,
        email: extendedData.requestInfo?.email || prev.email,
        phoneLandline: extendedData.requestInfo?.landline || prev.phoneLandline,
        phoneMobile: extendedData.requestInfo?.mobile || prev.phoneMobile,
        personQuality: extendedData.requestInfo?.personQuality || prev.personQuality,
        civilStatus: extendedData.requestInfo?.civilStatus || prev.civilStatus,
        proceduralIntervention: extendedData.requestInfo?.investigatedFacts || prev.proceduralIntervention,
        threatsReceived: extendedData.requestInfo?.riskReview || prev.threatsReceived,
        regional: mission?.regional || prev.regional,
        caseNumber: mission?.caseRadicado || prev.caseNumber,
        missionNumber: mission?.missionNo || prev.missionNumber,
        assignedEvaluator: mission?.assignedOfficial || prev.assignedEvaluator,
      }));
    }
  }, [extendedData, mission]);

  const updateField = (field: keyof TechnicalInterviewForm, value: any) => {
    setFormData(prev => {
        const next = { ...prev, [field]: value };
        
        // Si cambia la fecha de nacimiento, recalcular edad inmediatamente
        if (field === 'birthDate') {
            next.age = calculateAge(value);
        }
        
        return next;
    });
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      firstName: '',
      firstSurname: '',
      docType: '',
      docNumber: '',
      relationship: '',
      birthDate: '',
      isActive: true,
      residencePlace: ''
    };
    setFormData(prev => ({ ...prev, familyMembers: [...prev.familyMembers, newMember] }));
  };

  const addPet = () => {
    const newPet: Pet = {
      id: Date.now().toString(),
      species: 'CANINO',
      name: '',
      breed: '',
      sex: '',
      age: '',
      weight: '',
      isSterilized: false,
      isVaccinated: false,
      isDewormed: false
    };
    setFormData(prev => ({ ...prev, pets: [...prev.pets, newPet] }));
  };

  const toggleDifferential = (factor: string, target: 'titular' | 'familiar') => {
    setFormData(prev => {
        const factors = { ...prev.differentialFactors };
        if (!factors[factor]) factors[factor] = { titular: false, familiar: false };
        factors[factor][target] = !factors[factor][target];
        return { ...prev, differentialFactors: factors };
    });
  };

  // Listas de Departamentos
  const departments = useMemo(() => Object.keys(COLOMBIA_GEO), []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
      
      {/* Header Institucional FGN Estilo PDF V10 */}
      <div className="bg-white border-2 border-slate-900 overflow-hidden shadow-2xl mb-8 print:border-slate-300">
        <div className="flex border-b-2 border-slate-900 print:border-slate-300">
            <div className="w-1/4 p-4 border-r-2 border-slate-900 print:border-slate-300 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png" alt="FGN" className="h-16" />
            </div>
            <div className="w-1/2 p-4 border-r-2 border-slate-900 print:border-slate-300 text-center flex flex-col justify-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">Subproceso Protección y Asistencia</span>
                <h1 className="text-xs font-black uppercase leading-tight px-4">FORMATO ENTREVISTA PARA LA EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO A TESTIGOS, VICTIMAS E INTERVINIENTES EN EL PROCESO PENAL</h1>
            </div>
            <div className="w-1/4 text-[9px] font-black uppercase tracking-tighter">
                <div className="p-2 border-b-2 border-slate-900 print:border-slate-300">Código: FGN-MS01-F-04</div>
                <div className="p-2 border-b-2 border-slate-900 print:border-slate-300">Versión: 10</div>
                <div className="p-2">Página: {currentStep + 1} de 8</div>
            </div>
        </div>
      </div>

      {/* Navegación por pasos */}
      <div className="mb-10 flex gap-1 overflow-x-auto pb-4 scrollbar-hide print:hidden">
        {STEPS.map((step, idx) => (
            <button 
                key={idx} 
                onClick={() => setCurrentStep(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${currentStep === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
                {step}
            </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSaveSuccess("Entrevista guardada exitosamente."); }} className="bg-white border-2 border-slate-900 shadow-2xl p-8 md:p-14 mb-20 print:border-none print:shadow-none">
        
        {/* PASO 1: DATOS GENERALES Y CONTROL */}
        {currentStep === 0 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Sección 1. Datos de la Misión (Sistema)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <InputField label="Número de Caso" value={formData.caseNumber} disabled className="bg-slate-50 font-mono" />
                        <InputField label="Misión de Trabajo No." value={formData.missionNumber} disabled className="bg-slate-50 font-mono" />
                        <SelectField 
                            label="Regional" 
                            options={REGIONAL_UNITS} 
                            value={formData.regional} 
                            disabled 
                            className="bg-slate-50 font-bold"
                        />
                    </div>
                    <TextAreaField label="Objeto de la misión" value={formData.missionObject} disabled className="bg-slate-50" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <InputField label="Evaluador asignado" value={formData.assignedEvaluator} disabled className="bg-slate-50 uppercase font-black" />
                        <SelectField 
                            label="¿Autorizo la entrevista?" 
                            options={['SI', 'NO', 'NO APLICA']} 
                            value={formData.interviewAuthorized} 
                            onChange={e => updateField('interviewAuthorized', e.target.value)} 
                            required 
                        />
                    </div>
                </section>
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        Control de la Entrevista (Evaluador)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                            <InputField label="Lugar" value={formData.place} onChange={e => updateField('place', e.target.value)} required />
                        </div>
                        <InputField label="Fecha Entrevista" type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} required />
                        <InputField label="Hora Inicio" type="time" value={formData.startTime} onChange={e => updateField('startTime', e.target.value)} required />
                        <InputField label="Hora Finalización" type="time" value={formData.endTime} onChange={e => updateField('endTime', e.target.value)} required />
                    </div>
                </section>
            </div>
        )}

        {/* PASO 2: INFORMACIÓN DEL CANDIDATO */}
        {currentStep === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        INFORMACIÓN DEL CANDIDATO A PROTECCIÓN
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <InputField label="Primer Nombre" value={formData.name1} disabled />
                        <InputField label="Segundo Nombre" value={formData.name2} disabled />
                        <InputField label="Primer Apellido" value={formData.surname1} disabled />
                        <InputField label="Segundo Apellido" value={formData.surname2} disabled />
                        <InputField label="Tipo Documento" value={formData.docType} disabled />
                        <InputField label="Número" value={formData.docNumber} disabled className="font-mono" />
                        <InputField label="Lugar Expedición" value={formData.expeditionPlace} disabled />
                        <InputField label="Fecha Expedición" value={formData.expeditionDate} disabled />
                    </div>
                </section>
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        Datos Complementarios (Candidatos A PROTECCIÓN)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <InputField label="Lugar Nacimiento" value={formData.birthPlace} onChange={e => updateField('birthPlace', e.target.value)} />
                        
                        <SelectField 
                            label="Depto Nacimiento" 
                            options={departments} 
                            value={formData.birthDepartment} 
                            onChange={e => {
                                updateField('birthDepartment', e.target.value);
                                updateField('birthMunicipality', ''); // Limpiar municipio al cambiar depto
                            }} 
                        />
                        
                        <SelectField 
                            label="Munc Nacimiento" 
                            options={COLOMBIA_GEO[formData.birthDepartment] || []} 
                            value={formData.birthMunicipality} 
                            onChange={e => updateField('birthMunicipality', e.target.value)} 
                            disabled={!formData.birthDepartment}
                        />

                        <InputField label="Fecha Nacimiento" type="date" value={formData.birthDate} onChange={e => updateField('birthDate', e.target.value)} />
                        <InputField label="Edad (Cálculo Automático)" type="number" value={formData.age} disabled className="bg-blue-50 font-black text-blue-700" />
                        <SelectField label="Sexo" options={['Masculino', 'Femenino', 'Otro']} value={formData.sex} onChange={e => updateField('sex', e.target.value)} />
                        <SelectField label="Zona" options={['URBANA', 'RURAL']} value={formData.zone} onChange={e => updateField('zone', e.target.value)} />
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                      <div className="md:col-span-4">
                        <SelectField
                          label="¿Se ha registrado en el Registro Único de Migrantes Venezolanos - RUMV? Sólo en el caso de migrantes venezolanos"
                          options={['SI', 'NO']}
                          value={formData.ruvRegistered}
                          onChange={e => updateField('ruvRegistered', e.target.value)}
                        />
                      </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputField label="Dirección Residencia" value={formData.residenceAddress} onChange={e => updateField('residenceAddress', e.target.value)} />
                        <SelectField 
                            label="Depto Residencia" 
                            options={departments} 
                            value={formData.residenceDepartment} 
                            onChange={e => {
                                updateField('residenceDepartment', e.target.value);
                                updateField('residenceMunicipality', ''); 
                            }} 
                        />
                        
                        <SelectField 
                            label="Municipio Residencia" 
                            options={COLOMBIA_GEO[formData.residenceDepartment] || []} 
                            value={formData.residenceMunicipality} 
                            onChange={e => updateField('residenceMunicipality', e.target.value)} 
                            disabled={!formData.residenceDepartment}
                        />

                        <InputField label="Dirección Correspondencia" value={formData.correspondenceAddress} onChange={e => updateField('correspondenceAddress', e.target.value)} />
                        <SelectField 
                            label="Depto Correspondencia" 
                            options={departments} 
                            value={formData.correspondenceDepartment} 
                            onChange={e => {
                                updateField('correspondenceDepartment', e.target.value);
                                updateField('correspondenceMunicipality', '');
                            }} 
                        />
                        
                        <SelectField 
                            label="Municipio Correspondencia" 
                            options={COLOMBIA_GEO[formData.correspondenceDepartment] || []} 
                            value={formData.correspondenceMunicipality} 
                            onChange={e => updateField('correspondenceMunicipality', e.target.value)} 
                            disabled={!formData.correspondenceDepartment}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                        <InputField label="Correo Electrónico" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                        <InputField label="Teléfono Fijo" value={formData.phoneLandline} onChange={e => updateField('phoneLandline', e.target.value)} />
                        <InputField label="Teléfono Móvil" value={formData.phoneMobile} onChange={e => updateField('phoneMobile', e.target.value)} />
                        <InputField label="Otro Teléfono" value={formData.phoneOther} onChange={e => updateField('phoneOther', e.target.value)} />
                    </div>
                </section>
            </div>
        )}

        {/* PASO 3: CARACTERIZACIÓN PERSONAL */}
        {currentStep === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 3. Caracterización Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <SelectField label="Calidad de la persona dentro de la investigación" options={['Victima', 'Testigo', 'Perito', 'Fiscal', 'Empleado FGN', 'Otro', 'Ninguna']} value={formData.personQuality} onChange={e => updateField('personQuality', e.target.value)} />
                        <SelectField label="Estado Civil" options={['Soltero/a', 'Casado/a', 'Unión de hecho', 'Divorciado/a', 'Viudo/a']} value={formData.civilStatus} onChange={e => updateField('civilStatus', e.target.value)} />
                        <InputField label="Personas a Cargo" type="number" value={formData.dependentsCount} onChange={e => updateField('dependentsCount', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <SelectField label="Nivel Educativo" options={['Primaria', 'Secundaria', 'Técnico', 'Profesional', 'Postgrado']} value={formData.educationLevel} onChange={e => updateField('educationLevel', e.target.value)} />
                        <InputField label="Ocupación" value={formData.occupation} onChange={e => updateField('occupation', e.target.value)} />
                        <InputField label="Profesión" value={formData.profession} onChange={e => updateField('profession', e.target.value)} />
                        <InputField label="Ingresos Mensuales" value={formData.monthlyIncome} onChange={e => updateField('monthlyIncome', e.target.value)} />
                    </div>
                    <TextAreaField label="Observaciones Caracterización" value={formData.observationsGeneral} onChange={e => updateField('observationsGeneral', e.target.value)} className="h-32" />
                </section>
            </div>
        )}

        {/* PASO 4: COMPOSICIÓN NÚCLEO FAMILIAR */}
        {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                    <h3 className="text-[11px] font-black uppercase text-slate-900">Sección 4. Composición del Núcleo Familiar</h3>
                    <button type="button" onClick={addFamilyMember} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">+ Agregar Integrante</button>
                </div>
                <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter">
                            <tr>
                                <th className="p-3 border-r border-slate-700">Nombre Completo</th>
                                <th className="p-3 border-r border-slate-700">Tipo/Número Doc</th>
                                <th className="p-3 border-r border-slate-700">Parentesco</th>
                                <th className="p-3 border-r border-slate-700">Edad / F. Nac</th>
                                <th className="p-3 border-r border-slate-700">Lugar Residencia</th>
                                <th className="p-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {formData.familyMembers.map(fam => (
                                <tr key={fam.id}>
                                    <td className="p-2 border-r border-slate-100">
                                        <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none" placeholder="NOMBRES APELLIDOS" value={fam.firstName} onChange={e => updateField('familyMembers', formData.familyMembers.map(m => m.id === fam.id ? {...m, firstName: e.target.value} : m))} />
                                    </td>
                                    <td className="p-2 border-r border-slate-100">
                                        <input className="w-full bg-transparent text-[10px] outline-none" placeholder="TIPO - NUMERO" value={fam.docNumber} onChange={e => updateField('familyMembers', formData.familyMembers.map(m => m.id === fam.id ? {...m, docNumber: e.target.value} : m))} />
                                    </td>
                                    <td className="p-2 border-r border-slate-100">
                                        <input className="w-full bg-transparent text-[10px] uppercase outline-none" placeholder="VÍNCULO" value={fam.relationship} onChange={e => updateField('familyMembers', formData.familyMembers.map(m => m.id === fam.id ? {...m, relationship: e.target.value} : m))} />
                                    </td>
                                    <td className="p-2 border-r border-slate-100">
                                        <input className="w-full bg-transparent text-[10px] outline-none" placeholder="EDAD - AAAA/MM/DD" value={fam.birthDate} onChange={e => updateField('familyMembers', formData.familyMembers.map(m => m.id === fam.id ? {...m, birthDate: e.target.value} : m))} />
                                    </td>
                                    <td className="p-2 border-r border-slate-100">
                                        <input className="w-full bg-transparent text-[10px] uppercase outline-none" placeholder="RESIDENCIA" value={fam.residencePlace} onChange={e => updateField('familyMembers', formData.familyMembers.map(m => m.id === fam.id ? {...m, residencePlace: e.target.value} : m))} />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => updateField('familyMembers', formData.familyMembers.filter(m => m.id !== fam.id))} className="text-red-500 hover:scale-110"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* PASO 5: ANIMALES DE COMPAÑÍA */}
        {currentStep === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
                        <h3 className="text-[11px] font-black uppercase text-slate-900">Sección 5. Animales de Compañía</h3>
                        <div className="flex items-center gap-6">
                            <label className="text-[10px] font-black uppercase">¿Tiene animales?</label>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => updateField('hasPets', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.hasPets === 'SI' ? 'bg-indigo-600 text-white' : 'bg-slate-50'}`}>SI</button>
                                <button type="button" onClick={() => updateField('hasPets', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.hasPets === 'NO' ? 'bg-indigo-600 text-white' : 'bg-slate-50'}`}>NO</button>
                            </div>
                            {formData.hasPets === 'SI' && <InputField label="¿Cuántos?" type="number" className="w-20" value={formData.petsCount} onChange={e => updateField('petsCount', e.target.value)} />}
                        </div>
                    </div>

                    {formData.hasPets === 'SI' && (
                        <>
                            <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl overflow-hidden mb-8">
                                <table className="w-full text-[9px] text-left">
                                    <thead className="bg-slate-900 text-white font-black uppercase">
                                        <tr>
                                            <th className="p-3">Especie</th>
                                            <th className="p-3">Nombre</th>
                                            <th className="p-3">Raza</th>
                                            <th className="p-3">Sexo</th>
                                            <th className="p-3">Edad/Peso</th>
                                            <th className="p-3 text-center">Ester/Vacu/Despa</th>
                                            <th className="p-3 text-center">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {formData.pets.map(p => (
                                            <tr key={p.id}>
                                                <td className="p-2"><input className="w-full bg-transparent outline-none uppercase font-bold" value={p.species} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, species: e.target.value} : item))} /></td>
                                                <td className="p-2"><input className="w-full bg-transparent outline-none uppercase" value={p.name} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, name: e.target.value} : item))} /></td>
                                                <td className="p-2"><input className="w-full bg-transparent outline-none uppercase" value={p.breed} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, breed: e.target.value} : item))} /></td>
                                                <td className="p-2"><input className="w-full bg-transparent outline-none uppercase" value={p.sex} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, sex: e.target.value} : item))} /></td>
                                                <td className="p-2"><input className="w-full bg-transparent outline-none" placeholder="E: / P:" value={`${p.age} ${p.weight}`} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, age: e.target.value} : item))} /></td>
                                                <td className="p-2 text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        <input type="checkbox" checked={p.isSterilized} onChange={() => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, isSterilized: !item.isSterilized} : item))} />
                                                        <input type="checkbox" checked={p.isVaccinated} onChange={() => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, isVaccinated: !item.isVaccinated} : item))} />
                                                        <input type="checkbox" checked={p.isDewormed} onChange={() => updateField('pets', formData.pets.map(item => item.id === p.id ? {...item, isDewormed: !item.isDewormed} : item))} />
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center"><button type="button" onClick={() => updateField('pets', formData.pets.filter(item => item.id !== p.id))} className="text-red-400">X</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" onClick={addPet} className="text-[10px] font-black uppercase text-indigo-600 mb-8">+ Vincular Animal</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="Raza de Manejo Especial?" options={['SI', 'NO']} value={formData.isSpecialBreed} onChange={e => updateField('isSpecialBreed', e.target.value)} />
                                <SelectField label="Recursos para Guacal y Vuelos?" options={['SI', 'NO']} value={formData.hasTravelResources} onChange={e => updateField('hasTravelResources', e.target.value)} />
                            </div>
                            <TextAreaField label="Condición de salud / Visitas veterinario" value={formData.petHealthCondition} onChange={e => updateField('petHealthCondition', e.target.value)} className="h-24 mb-4" />
                            <TextAreaField label="Observaciones adicionales animales" value={formData.petObservations} onChange={e => updateField('petObservations', e.target.value)} className="h-24" />
                        </>
                    )}
                </section>
            </div>
        )}

        {/* PASO 6: ANTECEDENTES MÉDICOS Y CLÍNICOS / CONSUMO */}
        {currentStep === 5 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 6. Antecedentes Médicos y Clínicos</h3>
                    <div className="space-y-8">
                        {/* Enfermedad Física Titular */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-slate-50 p-6 border-l-4 border-indigo-600">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest block mb-3">¿Tiene alguna enfermedad física?</label>
                                <div className="flex gap-4 mb-4">
                                    <button type="button" onClick={() => updateField('physicalIllness', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.physicalIllness === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                                    <button type="button" onClick={() => updateField('physicalIllness', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.physicalIllness === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                                </div>
                                <InputField label="¿Qué enfermedad?" value={formData.physicalIllnessDetails} onChange={e => updateField('physicalIllnessDetails', e.target.value)} />
                            </div>
                            <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.hospitalizedPhysical} onChange={e => updateField('hospitalizedPhysical', e.target.value)} />
                        </div>
                        {/* Enfermedad Física Familiar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-slate-50 p-6 border-l-4 border-emerald-600">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest block mb-3">¿Familiar con enfermedad física?</label>
                                <div className="flex gap-4 mb-4">
                                    <button type="button" onClick={() => updateField('familyPhysicalIllness', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.familyPhysicalIllness === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                                    <button type="button" onClick={() => updateField('familyPhysicalIllness', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.familyPhysicalIllness === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <InputField label="¿Quién?" value={formData.familyPhysicalWho} onChange={e => updateField('familyPhysicalWho', e.target.value)} />
                                    <InputField label="Enfermedad" value={formData.familyPhysicalIllnessDetails} onChange={e => updateField('familyPhysicalIllnessDetails', e.target.value)} />
                                </div>
                            </div>
                            <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.familyPhysicalHospitalized} onChange={e => updateField('familyPhysicalHospitalized', e.target.value)} />
                        </div>
                    </div>
                    {/* Salud Mental y Medicamentos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <TextAreaField label="Medicamentos que no puede suspender" value={formData.uninterruptibleMeds} onChange={e => updateField('uninterruptibleMeds', e.target.value)} className="h-24" />
                        <InputField label="¿Quién está en tratamiento?" value={formData.whoInTreatment} onChange={e => updateField('whoInTreatment', e.target.value)} />
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Consumo de Sustancias Psicoactivas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                             <label className="text-[10px] font-black uppercase mb-3 block">¿Consume sustancias?</label>
                             <div className="flex gap-3">
                                <button type="button" onClick={() => updateField('consumesSubstances', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.consumesSubstances === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                                <button type="button" onClick={() => updateField('consumesSubstances', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.consumesSubstances === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                             </div>
                        </div>
                        <InputField label="¿Qué sustancias?" value={formData.substancesDetails} onChange={e => updateField('substancesDetails', e.target.value)} />
                        <InputField label="Tiempo de consumo" value={formData.consumptionTime} onChange={e => updateField('consumptionTime', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                             <label className="text-[10px] font-black uppercase mb-3 block">¿Familiar consume?</label>
                             <div className="flex gap-3">
                                <button type="button" onClick={() => updateField('familyConsumesSubstances', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.familyConsumesSubstances === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                                <button type="button" onClick={() => updateField('familyConsumesSubstances', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.familyConsumesSubstances === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                             </div>
                        </div>
                        <InputField label="¿Quién?" value={formData.familyConsumesWho} onChange={e => updateField('familyConsumesWho', e.target.value)} />
                        <InputField label="¿Qué sustancias?" value={formData.familySubstancesDetails} onChange={e => updateField('familySubstancesDetails', e.target.value)} />
                    </div>
                </section>
            </div>
        )}

        {/* PASO 7: INTERVENCIÓN PROCESAL Y VULNERABILIDADES */}
        {currentStep === 6 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 7. Intervención Procesal e Identificación de Amenaza</h3>
                    <TextAreaField label="Intervención procesal que pueda generar amenazas" value={formData.proceduralIntervention} onChange={e => updateField('proceduralIntervention', e.target.value)} className="h-40 mb-8" />
                    <TextAreaField label="Amenazas recibidas y riesgos identificados (Tiempos, modos, lugares)" value={formData.threatsReceived} onChange={e => updateField('threatsReceived', e.target.value)} className="h-40" />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <div>
                        <label className="text-[10px] font-black uppercase block mb-3">¿Tiene sentencias condenatorias?</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => updateField('hasConvictions', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.hasConvictions === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                            <button type="button" onClick={() => updateField('hasConvictions', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.hasConvictions === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase block mb-3">¿Beneficiario subrogado penal?</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => updateField('isSubstituteBeneficiary', 'SI')} className={`px-4 py-1 text-[9px] font-black border ${formData.isSubstituteBeneficiary === 'SI' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>SI</button>
                            <button type="button" onClick={() => updateField('isSubstituteBeneficiary', 'NO')} className={`px-4 py-1 text-[9px] font-black border ${formData.isSubstituteBeneficiary === 'NO' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>NO</button>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Vulnerabilidades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <SelectField label="Aplica normas autoprotección?" options={['SI', 'NO', 'ALGUNAS VECES']} value={formData.appliesSecurityNorms} onChange={e => updateField('appliesSecurityNorms', e.target.value)} />
                        <SelectField label="Permanece en zona de riesgo?" options={['SI', 'NO', 'ALGUNAS VECES']} value={formData.remainsInRiskZone} onChange={e => updateField('remainsInRiskZone', e.target.value)} />
                        <SelectField label="Existen org. ilegales en sector?" options={['SI', 'NO']} value={formData.illegalOrgsInSector} onChange={e => updateField('illegalOrgsInSector', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <TextAreaField label="Características físicas vivienda que generan vulnerabilidad" value={formData.housePhysicalDescription} onChange={e => updateField('housePhysicalDescription', e.target.value)} className="h-24" />
                        <TextAreaField label="Vulnerabilidad asociada al entorno de trabajo" value={formData.workEnvironmentVulnerability} onChange={e => updateField('workEnvironmentVulnerability', e.target.value)} className="h-24" />
                    </div>
                    <TextAreaField label="Vulnerabilidad en desplazamientos cotidianos" value={formData.dailyMobilityVulnerability} onChange={e => updateField('dailyMobilityVulnerability', e.target.value)} className="h-24" />
                </section>
            </div>
        )}

        {/* PASO 8: FACTORES DIFERENCIALES Y CIERRE */}
        {currentStep === 7 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-300">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 8. Factores Diferenciales y de Riesgo</h3>
                    <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl overflow-hidden mb-8">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-4 border-r border-slate-700">Enfoque Diferencial / Género</th>
                                    <th className="p-4 border-r border-slate-700 text-center">Titular</th>
                                    <th className="p-4 text-center">Familiar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {ENFOQUES_DIFERENCIALES.map(factor => (
                                    <tr key={factor} className="hover:bg-slate-50">
                                        <td className="p-4 text-[9px] font-black uppercase border-r border-slate-100">{factor}</td>
                                        <td className="p-4 text-center border-r border-slate-100">
                                            <input type="checkbox" checked={formData.differentialFactors[factor]?.titular || false} onChange={() => toggleDifferential(factor, 'titular')} className="w-4 h-4 accent-indigo-600" />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input type="checkbox" checked={formData.differentialFactors[factor]?.familiar || false} onChange={() => toggleDifferential(factor, 'familiar')} className="w-4 h-4 accent-indigo-600" />
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest"><th className="p-4" colSpan={3}>Enfoque de Género</th></tr>
                                {ENFOQUES_GENERO.map(factor => (
                                    <tr key={factor} className="hover:bg-slate-50">
                                        <td className="p-4 text-[9px] font-black uppercase border-r border-slate-100">{factor}</td>
                                        <td className="p-4 text-center border-r border-slate-100">
                                            <input type="checkbox" checked={formData.differentialFactors[factor]?.titular || false} onChange={() => toggleDifferential(factor, 'titular')} className="w-4 h-4 accent-indigo-600" />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input type="checkbox" checked={formData.differentialFactors[factor]?.familiar || false} onChange={() => toggleDifferential(factor, 'familiar')} className="w-4 h-4 accent-indigo-600" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <TextAreaField label="Observaciones Enfoques" value={formData.observationsDifferential} onChange={e => updateField('observationsDifferential', e.target.value)} className="h-24 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TextAreaField label="Vulnerabilidad Población Diferencial" value={formData.vulnerabilityDifferentialPop} onChange={e => updateField('vulnerabilityDifferentialPop', e.target.value)} className="h-32" />
                        <TextAreaField label="Vulnerabilidad Género" value={formData.vulnerabilityGender} onChange={e => updateField('vulnerabilityGender', e.target.value)} className="h-32" />
                        <TextAreaField label="Vulnerability Entorno Familiar" value={formData.vulnerabilityFamilyEnvironment} onChange={e => updateField('vulnerabilityFamilyEnvironment', e.target.value)} className="h-32" />
                    </div>
                </section>

                {/* Cláusula y Firmas */}
                <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-4">Cláusula Adicional - Art. 26 Fraude de Subvenciones</h4>
                    <p className="text-[10px] italic leading-relaxed opacity-80">
                        Se le hace saber y comprender al candidato que el contenido del artículo 403A del Código Penal Colombiano establece penas de prisión e inhabilitación para el que obtenga una subvención o subsidio proveniente de recursos públicos mediante engaño sobre las condiciones requeridas. Entiendo que la evaluación técnica de amenaza no genera ningún compromiso automático por parte de la Dirección de Protección.
                    </p>
                    <div className="pt-10 flex justify-between items-end gap-20">
                        <div className="flex-1 text-center">
                             <div className="border-b border-white/40 h-16 mb-4"></div>
                             <p className="text-[9px] font-black uppercase tracking-widest">Firma del Entrevistado</p>
                        </div>
                        <div className="flex-1 text-center">
                             <div className="border-b border-white/40 h-16 mb-4"></div>
                             <p className="text-[9px] font-black uppercase tracking-widest">Firma Evaluador: {formData.assignedEvaluator}</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {/* Barra de Navegación del Formulario */}
        <div className="mt-14 pt-8 border-t-2 border-slate-900 flex justify-between items-center print:hidden">
            <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest transition-colors">Cancelar Operación</button>
            <div className="flex gap-4">
                {currentStep > 0 && (
                    <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-10 py-3 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Anterior</button>
                )}
                {currentStep < STEPS.length - 1 ? (
                    <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="px-14 py-4 bg-slate-900 text-white font-black rounded-xl uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-black transition-all">Siguiente Paso</button>
                ) : (
                    <button type="submit" className="px-16 py-4 bg-emerald-600 text-white font-black rounded-xl uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-emerald-700 transition-all">Finalizar y Archivar Entrevista</button>
                )}
            </div>
        </div>
      </form>
    </div>
  );
};

export default InterviewFormPage;
