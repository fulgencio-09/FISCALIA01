
import React, { useState, useMemo, useEffect } from 'react';
import { ProtectionMission, TechnicalInterviewForm, FamilyMember, Pet } from '../types';
import { InputField, SelectField, TextAreaField } from '../components/FormComponents';
import { COLOMBIA_GEO, MOCK_FULL_REQUESTS, MOCK_SAVED_CASES, REGIONAL_UNITS, DOC_TYPES, PROFESSIONS, MOCK_FAMILY_DATA, DIFFERENTIAL_FACTORS_STRUCTURE } from '../constants';

interface InterviewFormPageProps {
    mission?: ProtectionMission;
    initialData?: TechnicalInterviewForm;
    onCancel: () => void;
    onSaveSuccess: (msg: string) => void;
    readOnly?: boolean;
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

const InterviewFormPage: React.FC<InterviewFormPageProps> = ({ mission, initialData, onCancel, onSaveSuccess, readOnly = false }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

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

    const extendedData = useMemo(() => {
        if (!mission) return null;
        const caseInfo = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
        const requestInfo = Object.values(MOCK_FULL_REQUESTS).find(r => r.radicado === mission.caseRadicado);
        return { caseInfo, requestInfo };
    }, [mission]);

    const [formData, setFormData] = useState<TechnicalInterviewForm>(initialData || {
        caseNumber: mission?.caseRadicado || 'N/A',
        missionNumber: mission?.missionNo || 'N/A',
        missionObject: mission?.type || 'EVALUACIÓN TÉCNICA DE RIESGO',
        assignedEvaluator: mission?.assignedOfficial || 'SISTEMA CENTRAL',
        regional: mission?.regional || '',
        interviewAuthorized: '',
        place: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        name1: extendedData?.caseInfo?.firstName || '',
        name2: extendedData?.caseInfo?.secondName || '',
        surname1: extendedData?.caseInfo?.firstSurname || '',
        surname2: extendedData?.caseInfo?.secondSurname || '',
        docType: extendedData?.caseInfo?.docType || 'Cédula de Ciudadanía',
        docNumber: mission?.petitionerDoc || '',
        expeditionDate: extendedData?.requestInfo?.petitionerExpeditionDate || '',
        expeditionPlace: extendedData?.requestInfo?.petitionerExpeditionPlace || '',
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
        personQuality: extendedData?.requestInfo?.personQuality || '',
        civilStatus: extendedData?.requestInfo?.civilStatus || '',
        dependentsCount: '',
        educationLevel: '',
        occupation: '',
        profession: '',
        monthlyIncome: '',
        observationsGeneral: '',
        familyMembers: [],
        hasPets: '',
        petsCount: '',
        pets: [],
        petHealthCondition: '',
        isSpecialBreed: '',
        hasTravelResources: '',
        petObservations: '',
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
        consumesSubstances: '',
        substancesDetails: '',
        consumptionTime: '',
        familyConsumesSubstances: '',
        familyConsumesWho: '',
        familySubstancesDetails: '',
        inTreatmentSubstances: '',
        familyInTreatmentSubstances: '',
        familyInTreatmentWho: '',
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
        differentialFactors: {},
        observationsDifferential: '',
        vulnerabilityDifferentialPop: '',
        vulnerabilityGender: '',
        vulnerabilityFamilyEnvironment: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setCurrentStep(0);
        }
    }, [initialData]);

    useEffect(() => {
        if (extendedData && !initialData) {
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
                familyMembers: familyFromDb.length > 0 ? familyFromDb : prev.familyMembers
            }));
        }
    }, [extendedData, mission, initialData]);

    const updateField = (field: keyof TechnicalInterviewForm, value: any) => {
        if (readOnly) return;
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'birthDate') {
                next.age = calculateAge(value);
            }
            return next;
        });
    };

    const addFamilyMember = () => {
        if (readOnly) return;
        const newMember: FamilyMember = {
            id: Date.now().toString(),
            firstName: '', secondName: '', firstSurname: '', secondSurname: '',
            docType: '', docNumber: '', relationship: '', birthDate: '', age: '',
            isActive: true, residencePlace: '', sex: ''
        };
        setFormData(prev => ({ ...prev, familyMembers: [...prev.familyMembers, newMember] }));
    };

    const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
        if (readOnly) return;
        setFormData(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.map(m => {
                if (m.id === id) {
                    const upd = { ...m, [field]: value };
                    if (field === 'birthDate') upd.age = calculateAge(value);
                    return upd;
                }
                return m;
            })
        }));
    };

    const addPet = () => {
        if (readOnly) return;
        const newPet: Pet = {
            id: Date.now().toString(), species: 'CANINO', name: '', breed: '', sex: '',
            age: '', weight: '', isSterilized: false, isVaccinated: false, isDewormed: false
        };
        setFormData(prev => ({ ...prev, pets: [...prev.pets, newPet] }));
    };

    const toggleDifferential = (option: string, target: 'titular' | 'familiar') => {
        if (readOnly) return;
        setFormData(prev => {
            const factors = { ...prev.differentialFactors };
            const current = factors[option] || { titular: false, familiar: false };
            factors[option] = { ...current, [target]: !current[target] };
            return { ...prev, differentialFactors: factors };
        });
    };

    const renderDifferentialTableRows = () => {
        const rows: React.ReactNode[] = [];
        DIFFERENTIAL_FACTORS_STRUCTURE.forEach((catGroup) => {
            const totalRowsInCategory = catGroup.criteria.reduce((sum, crit) => sum + crit.options.length, 0);
            catGroup.criteria.forEach((criterion, critIdx) => {
                const rowsInCriterion = criterion.options.length;
                criterion.options.forEach((option, optIdx) => {
                    rows.push(
                        <tr key={`${catGroup.category}-${criterion.name}-${option}`} className="border-b border-black">
                            {critIdx === 0 && optIdx === 0 && (
                                <td rowSpan={totalRowsInCategory} className="border-r border-black p-2 bg-slate-50 text-[10px] font-black uppercase text-center align-middle w-24">
                                   <div className="vertical-text">{catGroup.category}</div>
                                </td>
                            )}
                            {optIdx === 0 && (
                                <td rowSpan={rowsInCriterion} className="border-r border-black p-2 bg-white text-[9px] font-bold uppercase text-center align-middle w-32 leading-tight">
                                    {criterion.name}
                                </td>
                            )}
                            <td className="border-r border-black p-2 text-[9px] font-medium uppercase text-slate-800">
                                {option}
                                {option.includes("(Desplegable)") && (
                                    <input 
                                        type="text" 
                                        placeholder="Especifique aquí..." 
                                        className="block mt-1 w-full border-b border-black outline-none text-[8px] italic uppercase"
                                        disabled={readOnly || !(formData.differentialFactors[option]?.titular || formData.differentialFactors[option]?.familiar)}
                                    />
                                )}
                            </td>
                            <td className="border-r border-black p-1 text-center w-16 align-middle">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 accent-black cursor-pointer"
                                    checked={formData.differentialFactors[option]?.titular || false}
                                    onChange={() => toggleDifferential(option, 'titular')}
                                    disabled={readOnly}
                                />
                            </td>
                            <td className="p-1 text-center w-16 align-middle">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 accent-black cursor-pointer"
                                    checked={formData.differentialFactors[option]?.familiar || false}
                                    onChange={() => toggleDifferential(option, 'familiar')}
                                    disabled={readOnly}
                                />
                            </td>
                        </tr>
                    );
                });
            });
        });
        return rows;
    };

    const departments = useMemo(() => Object.keys(COLOMBIA_GEO), []);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            <style>{`
                .vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
                @media (max-width: 768px) { .vertical-text { writing-mode: horizontal-tb; transform: none; } }
            `}</style>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl mb-10 border border-slate-100 flex flex-col md:flex-row items-center gap-10 print:shadow-none print:border-slate-300 print:rounded-none">
                <div className="flex-shrink-0 bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-inner">
                    <img src={LOGO_URL} alt="FGN" className="h-20 md:h-24 drop-shadow-md" />
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
                    </div>
                </div>
            </div>

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
                                <SelectField label="Regional" options={REGIONAL_UNITS} value={formData.regional} disabled className="bg-slate-50 font-bold" />
                            </div>
                            <TextAreaField label="Objeto de la misión" value={formData.missionObject} disabled className="bg-slate-50" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <InputField label="Evaluador asignado" value={formData.assignedEvaluator} disabled className="bg-slate-50 uppercase font-black" />
                                <SelectField label="¿Autorizo la entrevista?" options={['SI', 'NO', 'NO APLICA']} value={formData.interviewAuthorized} onChange={e => updateField('interviewAuthorized', e.target.value)} required disabled={readOnly} />
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 2. Información del Candidato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10">
                                <InputField label="Primer Nombre" value={formData.name1} disabled />
                                <InputField label="Segundo Nombre" value={formData.name2} disabled />
                                <InputField label="Primer Apellido" value={formData.surname1} disabled />
                                <InputField label="Segundo Apellido" value={formData.surname2} disabled />
                                <InputField label="Tipo Documento" value={formData.docType} disabled />
                                <InputField label="Número" value={formData.docNumber} disabled className="font-mono" />
                                <InputField label="Lugar Expedición" value={formData.expeditionPlace} disabled />
                                <InputField label="Fecha Expedición" value={formData.expeditionDate} disabled />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <SelectField label="Depto Nacimiento" options={departments} value={formData.birthDepartment} onChange={e => updateField('birthDepartment', e.target.value)} disabled={readOnly} />
                                <SelectField label="Munc Nacimiento" options={COLOMBIA_GEO[formData.birthDepartment] || []} value={formData.birthMunicipality} onChange={e => updateField('birthMunicipality', e.target.value)} disabled={!formData.birthDepartment || readOnly} />
                                <InputField label="Fecha Nacimiento" type="date" value={formData.birthDate} onChange={e => updateField('birthDate', e.target.value)} disabled={readOnly} />
                                <InputField label="Edad" value={formData.age} disabled className="bg-blue-50 font-black text-blue-700" />
                                <SelectField label="Sexo" options={['MASCULINO', 'FEMENINO', 'OTRO']} value={formData.sex} onChange={e => updateField('sex', e.target.value)} disabled={readOnly} />
                                <InputField label="Dirección Residencia" value={formData.residenceAddress} onChange={e => updateField('residenceAddress', e.target.value)} disabled={readOnly} />
                                <InputField label="Email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} disabled={readOnly} />
                                <InputField label="Teléfono Móvil" value={formData.phoneMobile} onChange={e => updateField('phoneMobile', e.target.value)} disabled={readOnly} />
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 3. Caracterización Personal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <SelectField label="Calidad en la investigación" options={['VICTIMA', 'TESTIGO', 'PERITO', 'FISCAL', 'EMPLEADO FGN', 'OTRO']} value={formData.personQuality} onChange={e => updateField('personQuality', e.target.value)} disabled={readOnly} />
                                <SelectField label="Estado Civil" options={['SOLTERO/A', 'CASADO/A', 'UNIÓN DE HECHO', 'DIVORCIADO/A', 'VIUDO/A']} value={formData.civilStatus} onChange={e => updateField('civilStatus', e.target.value)} disabled={readOnly} />
                                <InputField label="Personas a Cargo" type="number" value={formData.dependentsCount} onChange={e => updateField('dependentsCount', e.target.value)} disabled={readOnly} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <SelectField label="Profesión" options={PROFESSIONS} value={formData.profession} onChange={e => updateField('profession', e.target.value)} disabled={readOnly} />
                                <InputField label="Ocupación" value={formData.occupation} onChange={e => updateField('occupation', e.target.value)} disabled={readOnly} />
                                <InputField label="Ingresos Mensuales" value={formData.monthlyIncome} onChange={e => updateField('monthlyIncome', e.target.value)} disabled={readOnly} />
                            </div>
                            <TextAreaField label="Observaciones Caracterización" value={formData.observationsGeneral} onChange={e => updateField('observationsGeneral', e.target.value)} className="mt-8 h-32" disabled={readOnly} />
                        </section>
                    </div>
                )}

                {currentStep === 3 && (
                   <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                            <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                Sección 4. Composición del Núcleo Familiar
                            </h3>
                            {!readOnly && (
                                <button type="button" onClick={addFamilyMember} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">+ Vincular Integrante</button>
                            )}
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
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.firstName} onChange={e => updateFamilyMember(fam.id, 'firstName', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.secondName} onChange={e => updateFamilyMember(fam.id, 'secondName', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.firstSurname} onChange={e => updateFamilyMember(fam.id, 'firstSurname', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none border-b border-transparent focus:border-indigo-400" value={fam.secondSurname} onChange={e => updateFamilyMember(fam.id, 'secondSurname', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <select className="w-full bg-transparent text-[10px] font-bold outline-none cursor-pointer" value={fam.docType} onChange={e => updateFamilyMember(fam.id, 'docType', e.target.value)} disabled={readOnly}>
                                                    <option value="">- SELECCIONE -</option>
                                                    {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] font-mono outline-none border-b border-transparent focus:border-indigo-400" value={fam.docNumber} onChange={e => updateFamilyMember(fam.id, 'docNumber', e.target.value)} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase outline-none border-b border-transparent focus:border-indigo-400" placeholder="EJ: CÓNYUGE" value={fam.relationship} onChange={e => updateFamilyMember(fam.id, 'relationship', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <select className="w-full bg-transparent text-[10px] outline-none" value={fam.sex} onChange={e => updateFamilyMember(fam.id, 'sex', e.target.value)} disabled={readOnly}>
                                                    <option value="">-</option>
                                                    <option value="MASCULINO">MASCULINO</option>
                                                    <option value="FEMENINO">FEMENINO</option>
                                                    <option value="OTRO">OTRO</option>
                                                    <option value="NO INFORMA">NO INFORMA</option>
                                                </select>
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input className="w-full bg-transparent text-[10px] uppercase outline-none border-b border-transparent focus:border-indigo-400" value={fam.residencePlace} onChange={e => updateFamilyMember(fam.id, 'residencePlace', e.target.value.toUpperCase())} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100">
                                                <input type="date" className="w-full bg-transparent text-[10px] outline-none cursor-pointer" value={fam.birthDate} onChange={e => updateFamilyMember(fam.id, 'birthDate', e.target.value)} disabled={readOnly} />
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{fam.age || '-'}</span>
                                            </td>
                                            <td className="p-2 text-center">
                                                {!readOnly && (
                                                    <button type="button" onClick={() => updateField('familyMembers', formData.familyMembers.filter(m => m.id !== fam.id))} className="text-red-500 hover:scale-110 transition-transform"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                                )}
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

                {currentStep === 4 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
                                <h3 className="text-[11px] font-black uppercase text-slate-900">Sección 5. Animales de Compañía</h3>
                                <div className="flex items-center gap-6">
                                    <label className="text-[10px] font-black uppercase">¿Tiene animales?</label>
                                    <SelectField label="" options={['SI', 'NO']} value={formData.hasPets} onChange={e => updateField('hasPets', e.target.value)} className="w-24" disabled={readOnly} />
                                    {formData.hasPets === 'SI' && <InputField label="¿Cuántos?" type="number" value={formData.petsCount} onChange={e => updateField('petsCount', e.target.value)} className="w-20" disabled={readOnly} />}
                                </div>
                            </div>
                            {formData.hasPets === 'SI' && (
                                <>
                                    <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl bg-white mb-6">
                                        <table className="w-full text-[9px] text-left">
                                            <thead className="bg-slate-900 text-white font-black uppercase">
                                                <tr>
                                                    <th className="p-3">Especie</th>
                                                    <th className="p-3">Nombre</th>
                                                    <th className="p-3">Raza</th>
                                                    <th className="p-3">Peso</th>
                                                    <th className="p-3 text-center">Vacunado?</th>
                                                    <th className="p-3 text-center">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {formData.pets.map(p => (
                                                    <tr key={p.id}>
                                                        <td className="p-2"><input className="w-full bg-transparent outline-none uppercase font-bold" value={p.species} onChange={e => updateField('pets', formData.pets.map(i => i.id === p.id ? { ...i, species: e.target.value.toUpperCase() } : i))} disabled={readOnly} /></td>
                                                        <td className="p-2"><input className="w-full bg-transparent outline-none uppercase" value={p.name} onChange={e => updateField('pets', formData.pets.map(i => i.id === p.id ? { ...i, name: e.target.value.toUpperCase() } : i))} disabled={readOnly} /></td>
                                                        <td className="p-2"><input className="w-full bg-transparent outline-none uppercase" value={p.breed} onChange={e => updateField('pets', formData.pets.map(i => i.id === p.id ? { ...i, breed: e.target.value.toUpperCase() } : i))} disabled={readOnly} /></td>
                                                        <td className="p-2"><input className="w-full bg-transparent outline-none" value={p.weight} onChange={e => updateField('pets', formData.pets.map(i => i.id === p.id ? { ...i, weight: e.target.value } : i))} disabled={readOnly} /></td>
                                                        <td className="p-2 text-center"><input type="checkbox" checked={p.isVaccinated} onChange={e => updateField('pets', formData.pets.map(i => i.id === p.id ? { ...i, isVaccinated: e.target.checked } : i))} disabled={readOnly} /></td>
                                                        <td className="p-2 text-center">{!readOnly && <button type="button" onClick={() => updateField('pets', formData.pets.filter(i => i.id !== p.id))} className="text-red-500">×</button>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {!readOnly && <button type="button" onClick={addPet} className="bg-slate-800 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase">+ Registrar Mascota</button>}
                                </>
                            )}
                        </section>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 6. Antecedentes Médicos y Consumo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <TextAreaField label="Condiciones de salud física/mental que incidan en protección (Titular/Familia)" value={formData.physicalIllnessDetails} onChange={e => updateField('physicalIllnessDetails', e.target.value)} disabled={readOnly} />
                                <TextAreaField label="Medicamentos de tratamiento esencial (Titular/Familia)" value={formData.uninterruptibleMeds} onChange={e => updateField('uninterruptibleMeds', e.target.value)} disabled={readOnly} />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                <h4 className="text-[11px] font-black uppercase text-indigo-700 mb-6 flex items-center gap-2"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div> Consumo de sustancias psicoactivas</h4>
                                <SelectField label="¿Usted o un familiar consume sustancias?" options={['SI', 'NO']} value={formData.consumesSubstances} onChange={e => updateField('consumesSubstances', e.target.value)} disabled={readOnly} />
                                {formData.consumesSubstances === 'SI' && (
                                    <TextAreaField label="Especifique sustancias, tiempo, si está en tratamiento y quién" value={formData.substancesDetails} onChange={e => updateField('substancesDetails', e.target.value)} className="mt-4" disabled={readOnly} />
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8">Sección 7. Vulnerabilidades y Factores de Riesgo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <TextAreaField label="Intervención Procesal que genere riesgo" value={formData.proceduralIntervention} onChange={e => updateField('proceduralIntervention', e.target.value)} disabled={readOnly} />
                                <TextAreaField label="Amenazas recibidas y riesgos identificados" value={formData.threatsReceived} onChange={e => updateField('threatsReceived', e.target.value)} disabled={readOnly} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <SelectField label="¿Tiene antecedentes penales?" options={['SI', 'NO']} value={formData.hasConvictions} onChange={e => updateField('hasConvictions', e.target.value)} disabled={readOnly} />
                                <SelectField label="¿Tiene medidas vigentes?" options={['SI', 'NO']} value={formData.hasCurrentMeasures} onChange={e => updateField('hasCurrentMeasures', e.target.value)} disabled={readOnly} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <SelectField label="¿Aplica normas de seguridad?" options={['SI', 'NO', 'ALGUNAS VECES']} value={formData.appliesSecurityNorms} onChange={e => updateField('appliesSecurityNorms', e.target.value)} disabled={readOnly} />
                                <SelectField label="¿Hay grupos ilegales en sector?" options={['SI', 'NO']} value={formData.illegalOrgsInSector} onChange={e => updateField('illegalOrgsInSector', e.target.value)} disabled={readOnly} />
                                <SelectField label="¿Cuenta con medios técnicos?" options={['SI', 'NO']} value={formData.techSecurityMeans} onChange={e => updateField('techSecurityMeans', e.target.value)} disabled={readOnly} />
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 7 && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
                        <section>
                            <h3 className="text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                Sección 8. Factores Diferenciales
                            </h3>
                            <div className="overflow-x-auto border-2 border-black rounded-sm bg-white shadow-xl mb-12">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b-2 border-black">
                                        <tr className="text-[10px] font-black uppercase text-slate-700">
                                            <th className="p-3 border-r border-black">Categoria</th>
                                            <th className="p-3 border-r border-black text-center">Categoría / Criterio</th>
                                            <th className="p-3 border-r border-black">Subcategoría / Opción / Desplegable</th>
                                            <th className="p-3 border-r border-black text-center w-24">Titular</th>
                                            <th className="p-3 text-center w-24">Familiar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderDifferentialTableRows()}
                                    </tbody>
                                </table>
                            </div>
                            <div className="space-y-12">
                                <TextAreaField label="Observaciones Factores Diferenciales" value={formData.observationsDifferential} onChange={e => updateField('observationsDifferential', e.target.value)} className="mb-8" disabled={readOnly} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <TextAreaField label="Vulnerabilidad Población Diferencial" value={formData.vulnerabilityDifferentialPop} onChange={e => updateField('vulnerabilityDifferentialPop', e.target.value)} disabled={readOnly} />
                                    <TextAreaField label="Vulnerabilidad por Género" value={formData.vulnerabilityGender} onChange={e => updateField('vulnerabilityGender', e.target.value)} disabled={readOnly} />
                                    <TextAreaField label="Vulnerabilidad Entorno Familiar" value={formData.vulnerabilityFamilyEnvironment} onChange={e => updateField('vulnerabilityFamilyEnvironment', e.target.value)} disabled={readOnly} />
                                </div>
                            </div>
                        </section>
                        <div className="pt-10 flex flex-col items-center gap-6">
                            <div className="w-full h-px bg-slate-200"></div>
                            {!readOnly && (
                                <button type="submit" className="bg-indigo-600 text-white px-20 py-5 rounded-3xl font-black uppercase text-sm tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                                    Guardar Entrevista Técnica
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-14 pt-8 border-t border-slate-100 flex justify-between items-center print:hidden">
                    <button type="button" onClick={onCancel} className="px-8 py-3 bg-white text-slate-400 font-black rounded-xl uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all">
                        {readOnly ? "Volver" : "Cancelar Proceso"}
                    </button>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className={`px-8 py-3 font-black rounded-xl uppercase text-[10px] tracking-widest transition-all ${currentStep === 0 ? 'text-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
                            Anterior
                        </button>
                        {currentStep < 7 && (
                            <button type="button" onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))} className="px-10 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
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
