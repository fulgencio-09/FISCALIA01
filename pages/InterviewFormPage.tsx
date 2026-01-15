
import React, { useState, useMemo, useEffect } from 'react';
import { ProtectionMission, TechnicalInterviewForm, FamilyMember, Pet } from '../types';
import { InputField, SelectField, TextAreaField } from '../components/FormComponents';
import { COLOMBIA_GEO, MOCK_FULL_REQUESTS, MOCK_SAVED_CASES, REGIONAL_UNITS, DOC_TYPES, PROFESSIONS, MOCK_FAMILY_DATA } from '../constants';

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

    // URL del Logo Institucional
    const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png";

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
        whoInTreatmentDetail: '',
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
        hasConvictionsDetails: '',
        isSubstituteBeneficiary: '',
        isSubstituteBeneficiaryDetails: '',
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

    // EFECTO DE SINCRONIZACIÓN
    useEffect(() => {
        if (extendedData) {
            const caseId = extendedData.caseInfo?.caseId || '';
            const familyFromDb = MOCK_FAMILY_DATA[caseId] || [];

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
                // CARGA AUTOMÁTICA DEL NÚCLEO FAMILIAR
                familyMembers: familyFromDb.length > 0 ? familyFromDb : prev.familyMembers
            }));
        }
    }, [extendedData, mission]);

    const updateField = (field: keyof TechnicalInterviewForm, value: any) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };

            // Cálculo automático de edad
            if (field === 'birthDate') {
                next.age = calculateAge(value);
            }

            // --- LÓGICA DE LIMPIEZA PARA SALUD ---
            if (field === 'physicalIllness' && value === 'NO') {
                next.physicalIllnessDetails = '';
                next.hospitalizedPhysical = '';
            }
            if (field === 'familyPhysicalIllness' && value === 'NO') {
                next.familyPhysicalWho = '';
                next.familyPhysicalIllnessDetails = '';
                next.familyPhysicalHospitalized = '';
            }
            if (field === 'mentalIllness' && value === 'NO') {
                next.mentalIllnessDetails = '';
                next.hospitalizedMental = '';
            }
            if (field === 'familyMentalIllness' && value === 'NO') {
                next.familyMentalWho = '';
                next.familyMentalIllnessDetails = '';
                next.familyMentalHospitalized = '';
            }
            if (field === 'whoInTreatment' && value !== 'OTRO MIEMBRO DE SU NÚCLEO FAMILIAR') {
                next.whoInTreatmentDetail = '';
            }

            // --- LÓGICA DE LIMPIEZA PARA CONSUMO DE SUSTANCIAS ---
            if (field === 'consumesSubstances' && value === 'NO') {
                next.substancesDetails = '';
                next.consumptionTime = '';
            }
            if (field === 'familyConsumesSubstances' && value === 'NO') {
                next.familyConsumesWho = '';
                next.familySubstancesDetails = '';
            }
            if (field === 'familyInTreatmentSubstances' && value === 'NO') {
                next.familyInTreatmentWho = '';
            }

            // --- LÓGICA DE LIMPIEZA PARA ANTECEDENTES (SECCIÓN 7) ---
            if (field === 'hasConvictions' && value === 'NO') {
                next.hasConvictionsDetails = '';
            }
            if (field === 'isSubstituteBeneficiary' && value === 'NO') {
                next.isSubstituteBeneficiaryDetails = '';
            }
            if (field === 'previouslyEvaluated' && value === 'NO') {
                next.previouslyEvaluatedWhich = '';
            }
            if (field === 'hasCurrentMeasures' && value === 'NO') {
                next.currentMeasuresWho = '';
            }

            return next;
        });
    };

    const addFamilyMember = () => {
        const newMember: FamilyMember = {
            id: Date.now().toString(),
            firstName: '',
            secondName: '',
            firstSurname: '',
            secondSurname: '',
            docType: '',
            docNumber: '',
            relationship: '',
            birthDate: '',
            age: '',
            isActive: true,
            residencePlace: '',
            sex: ''
        };
        setFormData(prev => ({ ...prev, familyMembers: [...prev.familyMembers, newMember] }));
    };

    const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
        setFormData(prev => {
            const updatedMembers = prev.familyMembers.map(member => {
                if (member.id === id) {
                    const updated = { ...member, [field]: value };
                    if (field === 'birthDate') {
                        updated.age = calculateAge(value);
                    }
                    return updated;
                }
                return member;
            });
            return { ...prev, familyMembers: updatedMembers };
        });
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

    /**
     * Lógica de Factores Diferenciales: 
     * Solo permite seleccionar uno (Titular o Familiar) por fila.
     */
    const toggleDifferential = (factor: string, target: 'titular' | 'familiar') => {
        setFormData(prev => {
            const factors = { ...prev.differentialFactors };
            const current = factors[factor] || { titular: false, familiar: false };
            
            let nextTitular = current.titular;
            let nextFamiliar = current.familiar;

            if (target === 'titular') {
                // Alternar titular
                nextTitular = !current.titular;
                // Si ahora es verdadero, el otro debe ser falso
                if (nextTitular) nextFamiliar = false;
            } else {
                // Alternar familiar
                nextFamiliar = !current.familiar;
                // Si ahora es verdadero, el otro debe ser falso
                if (nextFamiliar) nextTitular = false;
            }

            factors[factor] = { titular: nextTitular, familiar: nextFamiliar };
            return { ...prev, differentialFactors: factors };
        });
    };

    const departments = useMemo(() => Object.keys(COLOMBIA_GEO), []);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">

            {/* Header Oficial SIDPA con Logo FGN */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl mb-10 border border-slate-100 flex flex-col md:flex-row items-center gap-10 print:shadow-none print:border-slate-300 print:rounded-none">
                <div className="flex-shrink-0 bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-inner">
                    <img src={LOGO_URL} alt="Fiscalía General de la Nación" className="h-20 md:h-24 drop-shadow-md" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Fiscalía General de la Nación</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black uppercase text-slate-900 leading-none tracking-tighter">
                        Entrevista Técnica de Amenaza y Riesgo
                    </h1>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                             <span>SISTEMA SIDPA 3.0</span>
                        </div>
                        <span className="hidden md:inline">•</span>
                        <span>PÁGINA {currentStep + 1} / 8</span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-slate-600">EVALUADOR: {formData.assignedEvaluator}</span>
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

            <form onSubmit={(e) => { e.preventDefault(); onSaveSuccess("Entrevista guardada exitosamente."); }} className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 mb-20 border border-slate-100 print:border-none print:shadow-none">

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
                                <SelectField
                                    label="Depto Nacimiento"
                                    options={departments}
                                    value={formData.birthDepartment}
                                    onChange={e => {
                                        updateField('birthDepartment', e.target.value);
                                        updateField('birthMunicipality', '');
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
                                <SelectField label="Profesión" options={PROFESSIONS} value={formData.profession} onChange={e => updateField('profession', e.target.value)} />
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
                            <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                Sección 4. Composición del Núcleo Familiar
                            </h3>
                            <button type="button" onClick={addFamilyMember} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">+ Vincular Integrante</button>
                        </div>
                        <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl bg-white shadow-inner">
                            <table className="w-full text-left min-w-[1200px]">
                                <thead className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter">
                                    <tr>
                                        <th className="p-3 border-r border-slate-700">Nombre 1</th>
                                        <th className="p-3 border-r border-slate-700">Nombre 2</th>
                                        <th className="p-3 border-r border-slate-700">Apellido 1</th>
                                        <th className="p-3 border-r border-slate-700">Apellido 2</th>
                                        <th className="p-3 border-r border-slate-700">Tipo Doc</th>
                                        <th className="p-3 border-r border-slate-700">Número Doc</th>
                                        <th className="p-3 border-r border-slate-700">Vínculo</th>
                                        <th className="p-3 border-r border-slate-700">Sexo</th>
                                        <th className="p-3 border-r border-slate-700">Lugar Residencia</th>
                                        <th className="p-3 border-r border-slate-700">Fecha Nacimiento</th>
                                        <th className="p-3 border-r border-slate-700">Edad</th>
                                        <th className="p-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {formData.familyMembers.map(fam => (
                                        <tr key={fam.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.firstName} onChange={e => updateFamilyMember(fam.id, 'firstName', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.secondName} onChange={e => updateFamilyMember(fam.id, 'secondName', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.firstSurname} onChange={e => updateFamilyMember(fam.id, 'firstSurname', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.secondSurname} onChange={e => updateFamilyMember(fam.id, 'secondSurname', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <select className="w-full bg-transparent text-[10px] font-bold outline-none cursor-pointer" value={fam.docType} onChange={e => updateFamilyMember(fam.id, 'docType', e.target.value)}>
                                                    <option value="">- SELECCIONE -</option>
                                                    {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] font-mono outline-none border-b border-transparent focus:border-indigo-400" value={fam.docNumber} onChange={e => updateFamilyMember(fam.id, 'docNumber', e.target.value)} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase outline-none border-b border-transparent focus:border-indigo-400" placeholder="EJ: CÓNYUGE" value={fam.relationship} onChange={e => updateFamilyMember(fam.id, 'relationship', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <select className="w-full bg-transparent text-[10px] outline-none" value={fam.sex} onChange={e => updateFamilyMember(fam.id, 'sex', e.target.value)}>
                                                    <option value="">-</option>
                                                    <option value="MASCULINO">MASCULINO</option>
                                                    <option value="FEMENINO">FEMENINO</option>
                                                    <option value="OTRO">OTRO</option>
                                                    <option value="NO INFORMA">NO INFORMA</option>
                                                </select>
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase outline-none border-b border-transparent focus:border-indigo-400" value={fam.residencePlace} onChange={e => updateFamilyMember(fam.id, 'residencePlace', e.target.value.toUpperCase())} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input type="date" className="w-full bg-transparent text-[10px] outline-none cursor-pointer" value={fam.birthDate} onChange={e => updateFamilyMember(fam.id, 'birthDate', e.target.value)} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{fam.age || '-'}</span>
                                            </td>
                                            <td className="p-2 text-center">
                                                <button type="button" onClick={() => updateField('familyMembers', formData.familyMembers.filter(m => m.id !== fam.id))} className="text-red-500 hover:scale-110 transition-transform"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {formData.familyMembers.length === 0 && (
                            <div className="py-10 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl opacity-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No se han registrado integrantes familiares</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PASO 5: ANIMALES DE COMPAÑÍA */}
                {currentStep === 4 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
                                <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                    Sección 5. Animales de Compañía
                                </h3>
                                <div className="flex items-center gap-6">
                                    <label className="text-[10px] font-black uppercase">¿Tiene animales?</label>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => updateField('hasPets', 'SI')} className={`px-4 py-1 text-[9px] font-black border transition-all ${formData.hasPets === 'SI' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200'}`}>SI</button>
                                        <button type="button" onClick={() => updateField('hasPets', 'NO')} className={`px-4 py-1 text-[9px] font-black border transition-all ${formData.hasPets === 'NO' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200'}`}>NO</button>
                                    </div>
                                    {formData.hasPets === 'SI' && <InputField label="¿Cuántos?" type="number" className="w-20" value={formData.petsCount} onChange={e => updateField('petsCount', e.target.value)} />}
                                </div>
                            </div>
                            {formData.hasPets === 'SI' && (
                                <>
                                    <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl bg-white shadow-inner mb-8">
                                        <table className="w-full text-[9px] text-left min-w-[900px]">
                                            <thead className="bg-slate-900 text-white font-black uppercase tracking-tighter">
                                                <tr>
                                                    <th className="p-3 border-r border-slate-700">Especie</th>
                                                    <th className="p-3 border-r border-slate-700">Nombre</th>
                                                    <th className="p-3 border-r border-slate-700">Raza</th>
                                                    <th className="p-3 border-r border-slate-700">Sexo</th>
                                                    <th className="p-3 border-r border-slate-700">Edad</th>
                                                    <th className="p-3 border-r border-slate-700">Peso</th>
                                                    <th className="p-3 border-r border-slate-700">Esterelizado?</th>
                                                    <th className="p-3 border-r border-slate-700">Vacunado?</th>
                                                    <th className="p-3 border-r border-slate-700 text-center">Desparacitado?</th>
                                                    <th className="p-3 text-center">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {formData.pets.map(p => (
                                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-2 border-r border-slate-100">
                                                            <input className="w-full bg-transparent outline-none uppercase font-bold border-b border-transparent focus:border-indigo-400" value={p.species} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, species: e.target.value.toUpperCase() } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100">
                                                            <input className="w-full bg-transparent outline-none uppercase border-b border-transparent focus:border-indigo-400" value={p.name} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, name: e.target.value.toUpperCase() } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100">
                                                            <input className="w-full bg-transparent outline-none uppercase border-b border-transparent focus:border-indigo-400" value={p.breed} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, breed: e.target.value.toUpperCase() } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100">
                                                            <select className="w-full bg-transparent outline-none uppercase font-bold cursor-pointer" value={p.sex} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, sex: e.target.value } : item))}>
                                                                <option value="">-</option>
                                                                <option value="MACHO">MACHO</option>
                                                                <option value="HEMBRA">HEMBRA</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100">
                                                            <input className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-400" placeholder="EJ: 2 AÑOS" value={p.age} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, age: e.target.value.toUpperCase() } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100">
                                                            <input className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-400" placeholder="EJ: 15 KG" value={p.weight} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, weight: e.target.value.toUpperCase() } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100 text-center">
                                                            <input type="checkbox" checked={p.isSterilized} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, isSterilized: e.target.checked } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100 text-center">
                                                            <input type="checkbox" checked={p.isVaccinated} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, isVaccinated: e.target.checked } : item))} />
                                                        </td>
                                                        <td className="p-2 border-r border-slate-100 text-center">
                                                            <input type="checkbox" checked={p.isDewormed} onChange={e => updateField('pets', formData.pets.map(item => item.id === p.id ? { ...item, isDewormed: e.target.checked } : item))} />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button type="button" onClick={() => updateField('pets', formData.pets.filter(item => item.id !== p.id))} className="text-red-500 hover:scale-110 transition-transform"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end mb-8">
                                        <button type="button" onClick={addPet} className="bg-slate-800 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">+ Registrar Mascota</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <SelectField label="Condición de salud del animal" options={['BUENA', 'REGULAR', 'MALA']} value={formData.petHealthCondition} onChange={e => updateField('petHealthCondition', e.target.value)} />
                                        <SelectField label="¿Es raza de manejo especial?" options={['SI', 'NO']} value={formData.isSpecialBreed} onChange={e => updateField('isSpecialBreed', e.target.value)} />
                                        <SelectField label="¿Cuenta con recursos para transporte/traslado?" options={['SI', 'NO']} value={formData.hasTravelResources} onChange={e => updateField('hasTravelResources', e.target.value)} />
                                        <InputField label="Observaciones Mascotas" value={formData.petObservations} onChange={e => updateField('petObservations', e.target.value)} />
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                )}

                {/* PASO 6: SALUD Y CONSUMO */}
                {currentStep === 5 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 6. Antecedentes Médicos o Clínicos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="¿Tiene alguna enfermedad física?" options={['SI', 'NO']} value={formData.physicalIllness} onChange={e => updateField('physicalIllness', e.target.value)} />
                                {formData.physicalIllness === 'SI' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-4 rounded-xl">
                                        <InputField label="¿Qué enfermedad física?" value={formData.physicalIllnessDetails} onChange={e => updateField('physicalIllnessDetails', e.target.value)} />
                                        <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.hospitalizedPhysical} onChange={e => updateField('hospitalizedPhysical', e.target.value)} />
                                    </div>
                                )}
                                <SelectField label="¿Otro miembro de su familia tiene alguna enfermedad física?" options={['SI', 'NO']} value={formData.familyPhysicalIllness} onChange={e => updateField('familyPhysicalIllness', e.target.value)} />
                                {formData.familyPhysicalIllness === 'SI' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl">
                                        <InputField label="¿Quién?" value={formData.familyPhysicalWho} onChange={e => updateField('familyPhysicalWho', e.target.value)} />
                                        <InputField label="¿Qué enfermedad?" value={formData.familyPhysicalIllnessDetails} onChange={e => updateField('familyPhysicalIllnessDetails', e.target.value)} />
                                        <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.familyPhysicalHospitalized} onChange={e => updateField('familyPhysicalHospitalized', e.target.value)} />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="¿Tiene alguna enfermedad mental?" options={['SI', 'NO']} value={formData.mentalIllness} onChange={e => updateField('mentalIllness', e.target.value)} />
                                {formData.mentalIllness === 'SI' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-4 rounded-xl">
                                        <InputField label="¿Qué enfermedad mental?" value={formData.mentalIllnessDetails} onChange={e => updateField('mentalIllnessDetails', e.target.value)} />
                                        <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.hospitalizedMental} onChange={e => updateField('hospitalizedMental', e.target.value)} />
                                    </div>
                                )}
                                <SelectField label="¿Otro miembro de su familia padece enfermedad mental?" options={['SI', 'NO']} value={formData.familyMentalIllness} onChange={e => updateField('familyMentalIllness', e.target.value)} />
                                {formData.familyMentalIllness === 'SI' && (
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl">
                                        <InputField label="¿Quién?" value={formData.familyMentalWho} onChange={e => updateField('familyMentalWho', e.target.value)} />
                                        <InputField label="¿Qué enfermedad mental?" value={formData.familyMentalIllnessDetails} onChange={e => updateField('familyMentalIllnessDetails', e.target.value)} />
                                        <SelectField label="¿Ha estado hospitalizado?" options={['SI', 'NO']} value={formData.familyMentalHospitalized} onChange={e => updateField('familyMentalHospitalized', e.target.value)} />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <TextAreaField label="Medicamentos de tratamiento que no pueda suspender" value={formData.uninterruptibleMeds} onChange={e => updateField('uninterruptibleMeds', e.target.value)} />
                                <SelectField label="¿Quién está en tratamiento?" options={['TITULAR', 'INTEGRANTE DE SU NÚCLEO FAMILIAR', 'AMBOS', 'OTRO MIEMBRO DE SU NÚCLEO FAMILIAR', 'NINGUNO']} value={formData.whoInTreatment} onChange={e => updateField('whoInTreatment', e.target.value)} />
                                {formData.whoInTreatment === 'OTRO MIEMBRO DE SU NÚCLEO FAMILIAR' && (
                                    <InputField label="Especifique quién" value={formData.whoInTreatmentDetail} onChange={e => updateField('whoInTreatmentDetail', e.target.value)} />
                                )}
                            </div>
                        </section>

                        <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200">
                            <h3 className="text-[11px] font-black uppercase text-indigo-700 mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                Consumo de sustancias psicoactivas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                {/* Pregunta 1: Titular Consume */}
                                <div className="space-y-4">
                                    <SelectField 
                                        label="¿Consume sustancias psicoactivas?" 
                                        options={['SI', 'NO']} 
                                        value={formData.consumesSubstances} 
                                        onChange={e => updateField('consumesSubstances', e.target.value)} 
                                    />
                                    {formData.consumesSubstances === 'SI' && (
                                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
                                            <InputField label="¿Qué sustancias?" value={formData.substancesDetails} onChange={e => updateField('substancesDetails', e.target.value)} />
                                            <InputField label="Tiempo de consumo" value={formData.consumptionTime} onChange={e => updateField('consumptionTime', e.target.value)} />
                                        </div>
                                    )}
                                </div>

                                {/* Pregunta 2: Tratamiento Titular */}
                                <div className="space-y-4">
                                    <SelectField 
                                        label="¿Ha estado en tratamiento por consumo de sustancias psicoactivas?" 
                                        options={['SI', 'NO']} 
                                        value={formData.inTreatmentSubstances} 
                                        onChange={e => updateField('inTreatmentSubstances', e.target.value)} 
                                    />
                                </div>

                                {/* Pregunta 3: Familia Consume */}
                                <div className="space-y-4">
                                    <SelectField 
                                        label="¿Algún miembro de su familia consume?" 
                                        options={['SI', 'NO']} 
                                        value={formData.familyConsumesSubstances} 
                                        onChange={e => updateField('familyConsumesSubstances', e.target.value)} 
                                    />
                                    {formData.familyConsumesSubstances === 'SI' && (
                                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
                                            <InputField label="¿Quién?" value={formData.familyConsumesWho} onChange={e => updateField('familyConsumesWho', e.target.value)} />
                                            <InputField label="Detalle sustancias" value={formData.familySubstancesDetails} onChange={e => updateField('familySubstancesDetails', e.target.value)} />
                                        </div>
                                    )}
                                </div>

                                {/* Pregunta 4: Tratamiento Familia */}
                                <div className="space-y-4">
                                    <SelectField 
                                        label="¿Otro miembro de su grupo familiar ha estado en tratamiento por consumo de sustancias?" 
                                        options={['SI', 'NO']} 
                                        value={formData.familyInTreatmentSubstances} 
                                        onChange={e => updateField('familyInTreatmentSubstances', e.target.value)} 
                                    />
                                    {formData.familyInTreatmentSubstances === 'SI' && (
                                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200">
                                            <InputField label="¿Quién está en tratamiento?" value={formData.familyInTreatmentWho} onChange={e => updateField('familyInTreatmentWho', e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* PASO 7: VULNERABILIDAD Y SEGURIDAD */}
                {currentStep === 6 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 7. Vulnerabilidades y Factores de Riesgo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <TextAreaField label="Intervención Procesal" value={formData.proceduralIntervention} onChange={e => updateField('proceduralIntervention', e.target.value)} />
                                <TextAreaField label="Amenazas Recibidas" value={formData.threatsReceived} onChange={e => updateField('threatsReceived', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="¿Tiene antecedentes penales?" options={['SI', 'NO']} value={formData.hasConvictions} onChange={e => updateField('hasConvictions', e.target.value)} />
                                {formData.hasConvictions === 'SI' && <InputField label="Detalle antecedentes" value={formData.hasConvictionsDetails} onChange={e => updateField('hasConvictionsDetails', e.target.value)} />}
                                <SelectField label="¿Es beneficiario de sustitutiva?" options={['SI', 'NO']} value={formData.isSubstituteBeneficiary} onChange={e => updateField('isSubstituteBeneficiary', e.target.value)} />
                                {formData.isSubstituteBeneficiary === 'SI' && <InputField label="Detalle beneficio" value={formData.isSubstituteBeneficiaryDetails} onChange={e => updateField('isSubstituteBeneficiaryDetails', e.target.value)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="¿Ha sido evaluado previamente?" options={['SI', 'NO']} value={formData.previouslyEvaluated} onChange={e => updateField('previouslyEvaluated', e.target.value)} />
                                {formData.previouslyEvaluated === 'SI' && <InputField label="¿Por qué entidad?" value={formData.previouslyEvaluatedWhich} onChange={e => updateField('previouslyEvaluatedWhich', e.target.value)} />}
                                <SelectField label="¿Tiene medidas de protección vigentes?" options={['SI', 'NO']} value={formData.hasCurrentMeasures} onChange={e => updateField('hasCurrentMeasures', e.target.value)} />
                                {formData.hasCurrentMeasures === 'SI' && <InputField label="¿Quién las otorga?" value={formData.currentMeasuresWho} onChange={e => updateField('currentMeasuresWho', e.target.value)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <SelectField label="¿Aplica normas de seguridad?" options={['SI', 'NO', 'ALGUNAS VECES']} value={formData.appliesSecurityNorms} onChange={e => updateField('appliesSecurityNorms', e.target.value)} />
                                <SelectField label="¿Permanece en zona de riesgo?" options={['SI', 'NO', 'ALGUNAS VECES']} value={formData.remainsInRiskZone} onChange={e => updateField('remainsInRiskZone', e.target.value)} />
                                <SelectField label="¿Hay grupos ilegales en su sector?" options={['SI', 'NO']} value={formData.illegalOrgsInSector} onChange={e => updateField('illegalOrgsInSector', e.target.value)} />
                                <SelectField label="¿Cuenta con medios técnicos de seguridad?" options={['SI', 'NO']} value={formData.techSecurityMeans} onChange={e => updateField('techSecurityMeans', e.target.value)} />
                                <SelectField label="¿Hay apoyo policial cercano?" options={['SI', 'NO']} value={formData.policeSupportNearby} onChange={e => updateField('policeSupportNearby', e.target.value)} />
                            </div>
                            <div className="space-y-8">
                                <TextAreaField label="Descripción física de la vivienda" value={formData.housePhysicalDescription} onChange={e => updateField('housePhysicalDescription', e.target.value)} />
                                <TextAreaField label="Vulnerabilidad en el entorno laboral" value={formData.workEnvironmentVulnerability} onChange={e => updateField('workEnvironmentVulnerability', e.target.value)} />
                                <TextAreaField label="Vulnerabilidad en desplazamientos diarios" value={formData.dailyMobilityVulnerability} onChange={e => updateField('dailyMobilityVulnerability', e.target.value)} />
                            </div>
                        </section>
                    </div>
                )}

                {/* PASO 8: FACTORES DIFERENCIALES Y CIERRE */}
                {currentStep === 7 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 8. Factores Diferenciales</h3>
                            <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl bg-white shadow-inner mb-8">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter">
                                        <tr>
                                            <th className="p-4 border-r border-slate-700">Enfoque Diferencial</th>
                                            <th className="p-4 border-r border-slate-700 text-center">Titular</th>
                                            <th className="p-4 text-center">N. Familiar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {[...ENFOQUES_DIFERENCIALES, ...ENFOQUES_GENERO].map(factor => (
                                            <tr key={factor} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3 border-r border-slate-100 text-[10px] font-bold uppercase">{factor}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 accent-indigo-600"
                                                        checked={formData.differentialFactors[factor]?.titular || false} 
                                                        onChange={() => toggleDifferential(factor, 'titular')} 
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="w-4 h-4 accent-indigo-600"
                                                        checked={formData.differentialFactors[factor]?.familiar || false} 
                                                        onChange={() => toggleDifferential(factor, 'familiar')} 
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <TextAreaField label="Observaciones Factores Diferenciales" value={formData.observationsDifferential} onChange={e => updateField('observationsDifferential', e.target.value)} className="mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <TextAreaField label="Vulnerabilidad Población Diferencial" value={formData.vulnerabilityDifferentialPop} onChange={e => updateField('vulnerabilityDifferentialPop', e.target.value)} />
                                <TextAreaField label="Vulnerabilidad por Género" value={formData.vulnerabilityGender} onChange={e => updateField('vulnerabilityGender', e.target.value)} />
                                <TextAreaField label="Vulnerabilidad Entorno Familiar" value={formData.vulnerabilityFamilyEnvironment} onChange={e => updateField('vulnerabilityFamilyEnvironment', e.target.value)} />
                            </div>
                        </section>
                        
                        <div className="pt-10 flex flex-col items-center gap-6">
                            <div className="w-full h-px bg-slate-200"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Al presionar "Guardar Entrevista" los datos serán formalizados en el expediente SIDPA</p>
                            <button 
                                type="submit"
                                className="bg-indigo-600 text-white px-16 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
                            >
                                Guardar Entrevista Técnica
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer de navegación del formulario */}
                <div className="mt-14 pt-8 border-t border-slate-100 flex justify-between items-center print:hidden">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 bg-white text-slate-400 font-black rounded-xl uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all"
                    >
                        Cancelar Proceso
                    </button>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className={`px-8 py-3 font-black rounded-xl uppercase text-[10px] tracking-widest transition-all ${currentStep === 0 ? 'text-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                        >
                            Anterior
                        </button>
                        {currentStep < 7 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
                                className="px-10 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InterviewFormPage;
