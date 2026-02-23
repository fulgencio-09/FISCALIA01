
import React, { useState, useMemo, useEffect } from 'react';
import { ProtectionMission, DirectivoInterviewForm, FamilyMember } from '../types';
import { InputField, SelectField, TextAreaField } from '../components/FormComponents';
import { COLOMBIA_GEO, MOCK_FULL_REQUESTS, MOCK_SAVED_CASES, REGIONAL_UNITS, DOC_TYPES, MOCK_FAMILY_DATA, DIFFERENTIAL_FACTORS_STRUCTURE } from '../constants';

interface DirectivoInterviewFormPageProps {
    mission?: ProtectionMission;
    initialData?: DirectivoInterviewForm;
    onCancel: () => void;
    onSaveSuccess: (msg: string) => void;
    readOnly?: boolean;
}

const STEPS = [
    '1. INFORMACIÓN EVALUADO',
    '2. NÚCLEO FAMILIAR',
    '3. TRAYECTORIA FGN',
    '4. ANÁLISIS DE RIESGO',
    '5. FACTORES DIFERENCIALES'
];

const DirectivoInterviewFormPage: React.FC<DirectivoInterviewFormPageProps> = ({ mission, initialData, onCancel, onSaveSuccess, readOnly = false }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

    const calculateAge = (birthDateString: string): string => {
        if (!birthDateString) return '';
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age >= 0 ? age.toString() : '0';
    };

    const extendedData = useMemo(() => {
        if (!mission) return null;
        const caseInfo = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
        const requestInfo = Object.values(MOCK_FULL_REQUESTS).find(r => r.radicado === mission.caseRadicado);
        return { caseInfo, requestInfo };
    }, [mission]);

    const [formData, setFormData] = useState<DirectivoInterviewForm>(initialData || {
        caseNumber: mission?.caseRadicado || 'N/A',
        missionNumber: mission?.missionNo || 'N/A',
        missionObject: mission?.type || 'ESTUDIO DE RIESGO NIVEL DIRECTIVO',
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
        birthPlace: '', birthDepartment: '', birthMunicipality: '', birthDate: '', age: '', sex: '',
        residenceAddress: extendedData?.requestInfo?.residenceAddress || '',
        residenceDepartment: '', residenceMunicipality: '', email: extendedData?.requestInfo?.email || '',
        phoneLandline: '', phoneMobile: extendedData?.requestInfo?.mobile || '', phoneOther: '',
        bloodGroup: '', currentPosition: '', workAddress: '', consentProtection: '',
        fgnEntryDate: '', fgnServiceType: '', fgnServiceTime: '', positionsHeld: '', activityLocations: '', fgnGlobalExperience: '',
        evaluationHistory: '', mediaExposure: '', policeMeasuresAuthorized: '',
        proceduralIntervention: '', threatsReceived: '', isDirectivo: true, differentialFactors: {},
        familyMembers: [],
        // Heredados sin uso obligatorio
        observationsGeneral: '', zone: '', ruvRegistered: '', rumvRegistered: '', personQuality: '',
        civilStatus: extendedData?.requestInfo?.civilStatus || '', dependentsCount: '', educationLevel: '', occupation: '', profession: '',
        monthlyIncome: '', hasPets: '', petsCount: '', pets: [], petHealthCondition: '',
        isSpecialBreed: '', hasTravelResources: '', petObservations: '', physicalIllness: '',
        physicalIllnessDetails: '', hospitalizedPhysical: '', familyPhysicalIllness: '',
        familyPhysicalIllnessDetails: '', familyPhysicalWho: '', familyPhysicalHospitalized: '',
        mentalIllness: '', mentalIllnessDetails: '', hospitalizedMental: '', familyMentalIllness: '',
        familyMentalIllnessDetails: '', familyMentalWho: '', familyMentalHospitalized: '',
        uninterruptibleMeds: '', whoInTreatment: '', whoInTreatmentDetail: '', consumesSubstances: '',
        substancesDetails: '', consumptionTime: '', familyConsumesSubstances: '', familyConsumesWho: '',
        familySubstancesDetails: '', inTreatmentSubstances: '', familyInTreatmentSubstances: '',
        familyInTreatmentWho: '', hasConvictions: '', hasConvictionsDetails: '', isSubstituteBeneficiary: '',
        isSubstituteBeneficiaryDetails: '', previouslyEvaluated: '', previouslyEvaluatedWhich: '',
        hasCurrentMeasures: '', currentMeasuresWho: '', appliesSecurityNorms: '', remainsInRiskZone: '',
        illegalOrgsInSector: '', techSecurityMeans: '', policeSupportNearby: '', housePhysicalDescription: '',
        workEnvironmentVulnerability: '', dailyMobilityVulnerability: '', observationsDifferential: '',
        vulnerabilityDifferentialPop: '', vulnerabilityGender: '', vulnerabilityFamilyEnvironment: '',
        correspondenceAddress: '', correspondenceDepartment: '', correspondenceMunicipality: ''
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const updateField = (field: keyof DirectivoInterviewForm, value: any) => {
        if (readOnly) return;
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'birthDate') next.age = calculateAge(value);
            return next;
        });
    };

    const addFamilyMember = () => {
        if (readOnly) return;
        const newMember: FamilyMember = {
            id: Date.now().toString(), fullName: '', docType: '', docNumber: '', 
            relationship: '', residencePlace: '', birthDate: '', age: '', isActive: true,
            firstName: '', firstSurname: '' // Para compatibilidad de interfaz base
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

    const toggleDifferential = (option: string, target: 'titular' | 'familiar') => {
        if (readOnly) return;
        setFormData(prev => {
            const factors = { ...prev.differentialFactors };
            const current = factors[option] || { titular: false, familiar: false };
            factors[option] = { ...current, [target]: !current[target] };
            return { ...prev, differentialFactors: factors };
        });
    };

    const renderDifferentialRows = () => {
        const rows: React.ReactNode[] = [];
        DIFFERENTIAL_FACTORS_STRUCTURE.forEach((catGroup) => {
            const totalRowsInCategory = catGroup.criteria.reduce((sum, crit) => sum + crit.options.length, 0);
            catGroup.criteria.forEach((criterion, critIdx) => {
                const rowsInCriterion = criterion.options.length;
                criterion.options.forEach((option, optIdx) => {
                    rows.push(
                        <tr key={`${catGroup.category}-${criterion.name}-${option}`} className="border-b border-black">
                            {critIdx === 0 && optIdx === 0 && (
                                <td rowSpan={totalRowsInCategory} className="border-r border-black p-2 bg-slate-50 text-[9px] font-black uppercase text-center align-middle w-20">
                                   <div className="vertical-text">{catGroup.category}</div>
                                </td>
                            )}
                            {optIdx === 0 && (
                                <td rowSpan={rowsInCriterion} className="border-r border-black p-2 bg-white text-[8px] font-bold uppercase text-center align-middle w-28 leading-tight">
                                    {criterion.name}
                                </td>
                            )}
                            <td className="border-r border-black p-2 text-[9px] font-medium uppercase text-slate-800">
                                {option}
                            </td>
                            <td className="border-r border-black p-1 text-center w-12 align-middle">
                                <input type="checkbox" className="w-4 h-4 accent-black" checked={formData.differentialFactors[option]?.titular || false} onChange={() => toggleDifferential(option, 'titular')} disabled={readOnly} />
                            </td>
                            <td className="p-1 text-center w-12 align-middle">
                                <input type="checkbox" className="w-4 h-4 accent-black" checked={formData.differentialFactors[option]?.familiar || false} onChange={() => toggleDifferential(option, 'familiar')} disabled={readOnly} />
                            </td>
                        </tr>
                    );
                });
            });
        });
        return rows;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            <style>{`.vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }`}</style>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl mb-10 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
                <img src={LOGO_URL} alt="FGN" className="h-20" />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-tighter leading-none">
                        Entrevista para Estudio de Riesgo (Directivo / Ex Fiscales)
                    </h1>
                    <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-2">SIDPA 3.0 | Estructura Oficial V. 03</p>
                </div>
            </div>

            <div className="mb-10 flex gap-1 overflow-x-auto pb-4 scrollbar-hide">
                {STEPS.map((step, idx) => (
                    <button key={idx} onClick={() => setCurrentStep(idx)} className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${currentStep === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                        {step}
                    </button>
                ))}
            </div>

            <form onSubmit={e => { e.preventDefault(); onSaveSuccess("Entrevista de Nivel Directivo guardada."); }} className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 border border-slate-100">
                
                {currentStep === 0 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase border-b-2 border-slate-900 pb-2 mb-8">Información del Entrevistado</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <InputField label="Caso número" value={formData.caseNumber} disabled maxLength={20} />
                                <InputField label="Misión de trabajo" value={formData.missionNumber} disabled maxLength={20} />
                                <InputField label="fecha entrevista" value={`${formData.place} - ${formData.date}`} type="date" onChange={e => updateField('place', e.target.value)} required  />
                                <InputField label="Lugar de la entrevista" value={formData.birthDate} type="text" onChange={e => updateField('birthDate', e.target.value)} required />
                                <InputField label="Evaluador" value={formData.assignedEvaluator} disabled />
                                <div className="md:col-span-2">
                                    <TextAreaField label="Objeto de la Misión" value={formData.missionObject} onChange={e => updateField('missionObject', e.target.value)} required maxLength={500} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <InputField label="Nombres" value={formData.name1 + ' ' + (formData.name2 || '')} disabled maxLength={150} />
                                <InputField label="Apellidos" value={formData.surname1 + ' ' + (formData.surname2 || '')} disabled maxLength={150} />
                                <InputField label="Número Documento de identidad" value={formData.docNumber} disabled maxLength={20} />
                                <InputField label="Fecha de nacimiento" value={formData.birthDate} type="date" onChange={e => updateField('birthDate', e.target.value)} required />
                                 <InputField label="Lugar de nacimiento" value={formData.birthDate} type="text" onChange={e => updateField('birthDate', e.target.value)} required />
                                <InputField label="Edad" value={formData.age} disabled className="bg-blue-50" />
                                <SelectField label="Grupo Sanguíneo y RH" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} value={formData.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value)} required />
                                <SelectField label="Estado civil" options={['SOLTERO/A', 'CASADO/A', 'DIVORCIADO/A', 'VIUDO/A', 'UNIÓN LIBRE']} value={formData.civilStatus} onChange={e => updateField('civilStatus', e.target.value)} required />
                                <SelectField label="Calidad del evaluado" options={['DIRECTIVO', 'EX FISCAL GENERAL', 'EX FISCAL DELEGADO', 'SERVIDOR']} value={formData.personQuality} onChange={e => updateField('personQuality', e.target.value)} required />
                                <InputField label="Cargo actual (despacho, seccional)" value={formData.currentPosition} onChange={e => updateField('currentPosition', e.target.value)} required className="md:col-span-2" maxLength={150} />
                                <InputField label="Dirección lugar de residencia" value={formData.residenceAddress} onChange={e => updateField('residenceAddress', e.target.value)} required className="md:col-span-2" maxLength={200} />
                                <InputField label="Dirección lugar de trabajo" value={formData.workAddress} onChange={e => updateField('workAddress', e.target.value)} className="md:col-span-2" maxLength={200} />
                                <InputField label="Número Teléfono de Contacto" value={formData.phoneMobile} onChange={e => updateField('phoneMobile', e.target.value)} required maxLength={15} />
                                <InputField label="Correo Electrónico (No obligatorio)" value={formData.email} onChange={e => updateField('email', e.target.value)} maxLength={150} />
                            </div>
                            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <label className="text-[10px] font-black uppercase text-slate-500 mb-4 block">Consentimiento frente a medida de protección</label>
                                <div className="flex gap-10">
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="consent" checked={formData.consentProtection === 'SI'} onChange={() => updateField('consentProtection', 'SI')} className="w-4 h-4" /> <span className="text-xs font-bold uppercase">SÍ Autorizo</span></label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="consent" checked={formData.consentProtection === 'NO'} onChange={() => updateField('consentProtection', 'NO')} className="w-4 h-4" /> <span className="text-xs font-bold uppercase">NO Autorizo</span></label>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <section>
                            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-8">
                                <h3 className="text-[11px] font-black uppercase">Información de los familiares</h3>
                                {!readOnly && <button type="button" onClick={addFamilyMember} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ Agregar Familiar</button>}
                            </div>
                            <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl bg-white shadow-inner">
                                <table className="w-full text-left min-w-[1000px]">
                                    <thead className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                                        <tr>
                                            <th className="p-3 border-r border-slate-700">Nombres y apellidos</th>
                                            <th className="p-3 border-r border-slate-700">Tipo documento</th>
                                            <th className="p-3 border-r border-slate-700">Número</th>
                                            <th className="p-3 border-r border-slate-700">Vínculo o parentesco</th>
                                            <th className="p-3 border-r border-slate-700">Lugar de residencia</th>
                                            <th className="p-3 border-r border-slate-700">F. Nacimiento</th>
                                            <th className="p-3 border-r border-slate-700 text-center">Edad</th>
                                            <th className="p-3 text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {formData.familyMembers.map(fam => (
                                            <tr key={fam.id}>
                                                <td className="p-2 border-r border-slate-100"><input className="w-full bg-transparent text-[10px] uppercase font-bold outline-none" value={fam.fullName} onChange={e => updateFamilyMember(fam.id, 'fullName', e.target.value.toUpperCase())} maxLength={150} disabled={readOnly} /></td>
                                                <td className="p-2 border-r border-slate-100"><SelectField label="" options={DOC_TYPES} value={fam.docType} onChange={e => updateFamilyMember(fam.id, 'docType', e.target.value)} disabled={readOnly} className="text-[9px]" /></td>
                                                <td className="p-2 border-r border-slate-100"><input className="w-full bg-transparent text-[10px] font-mono outline-none" type="number" value={fam.docNumber} onChange={e => updateFamilyMember(fam.id, 'docNumber', e.target.value)} disabled={readOnly} /></td>
                                                <td className="p-2 border-r border-slate-100"><input className="w-full bg-transparent text-[10px] uppercase outline-none" value={fam.relationship} onChange={e => updateFamilyMember(fam.id, 'relationship', e.target.value.toUpperCase())} disabled={readOnly} /></td>
                                                <td className="p-2 border-r border-slate-100"><input className="w-full bg-transparent text-[10px] uppercase outline-none" value={fam.residencePlace} onChange={e => updateFamilyMember(fam.id, 'residencePlace', e.target.value.toUpperCase())} maxLength={150} disabled={readOnly} /></td>
                                                <td className="p-2 border-r border-slate-100"><input type="date" className="w-full bg-transparent text-[10px] outline-none" value={fam.birthDate} onChange={e => updateFamilyMember(fam.id, 'birthDate', e.target.value)} disabled={readOnly} /></td>
                                                <td className="p-2 border-r border-slate-100 text-center"><span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{fam.age || '-'}</span></td>
                                                <td className="p-2 text-center">{!readOnly && <button type="button" onClick={() => updateField('familyMembers', formData.familyMembers.filter(m => m.id !== fam.id))} className="text-red-500">×</button>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase border-b-2 border-slate-900 pb-2 mb-8">Experiencia en la Fiscalía General de la Nación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <InputField label="Fecha de ingreso" type="date" value={formData.fgnEntryDate} onChange={e => updateField('fgnEntryDate', e.target.value)} required />
                                <InputField label="Tiempo de Servicio" value={formData.fgnServiceTime} onChange={e => updateField('fgnServiceTime', e.target.value)} required placeholder="Años, meses..." />
                            </div>
                            <TextAreaField label="Tipo de servicio" value={formData.fgnServiceType} onChange={e => updateField('fgnServiceType', e.target.value)} required maxLength={150} className="mb-8" />
                            <TextAreaField label="Cargos Ocupados" value={formData.positionsHeld} onChange={e => updateField('positionsHeld', e.target.value)} required maxLength={150} className="mb-8" />
                            <TextAreaField label="Lugares de actividad" value={formData.activityLocations} onChange={e => updateField('activityLocations', e.target.value)} required maxLength={4500} className="mb-8" />
                            {/* Fixed typo in property name from fGlobalExperience to fgnGlobalExperience below */}
                            <TextAreaField label="Experiencia en la Fiscalía General de la Nación (General)" value={formData.fgnGlobalExperience} onChange={e => updateField('fgnGlobalExperience', e.target.value)} maxLength={4500} placeholder="Descripción opcional de trayectoria..." />
                        </section>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase border-b-2 border-slate-900 pb-2 mb-8">Análisis de Riesgo y Seguridad</h3>
                            <TextAreaField label="Antecedentes de evaluaciones (Opcional)" value={formData.evaluationHistory} onChange={e => updateField('evaluationHistory', e.target.value)} maxLength={4500} className="mb-8" placeholder="Establecer si ha sido evaluado previamente..." />
                            <TextAreaField label="Exposición ante medios de comunicación y otros escenarios (Opcional)" value={formData.mediaExposure} onChange={e => updateField('mediaExposure', e.target.value)} maxLength={4500} className="mb-8" placeholder="Actividades sociales y académicas..." />
                            <TextAreaField label="Intervención procesal y/o la calidad del evaluado que le genere riesgo (Opcional)" value={formData.proceduralIntervention} onChange={e => updateField('proceduralIntervention', e.target.value)} maxLength={4500} className="mb-8" />
                            <TextAreaField label="Amenazas o situaciones de riesgo recibidas por el evaluado y/o su familia" value={formData.threatsReceived} onChange={e => updateField('threatsReceived', e.target.value)} required maxLength={4500} className="mb-10" placeholder="Modo, tiempo, lugar de la amenaza..." />
                            
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                                <label className="text-[10px] font-black uppercase text-indigo-700 mb-6 block">¿Autoriza medidas preventivas por parte de la Policía Nacional?</label>
                                <div className="flex gap-12">
                                    <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="police" checked={formData.policeMeasuresAuthorized === 'SI'} onChange={() => updateField('policeMeasuresAuthorized', 'SI')} className="w-5 h-5" /> <span className="text-sm font-bold">SÍ</span></label>
                                    <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="police" checked={formData.policeMeasuresAuthorized === 'NO'} onChange={() => updateField('policeMeasuresAuthorized', 'NO')} className="w-5 h-5" /> <span className="text-sm font-bold">NO</span></label>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <section>
                            <h3 className="text-[11px] font-black uppercase border-b-2 border-slate-900 pb-2 mb-8">Factores Diferenciales y/o de Género</h3>
                            <p className="text-[10px] text-slate-500 mb-6 italic">Marcar con X si el entrevistado o familiar está incurso dentro de alguno o varios de estos factores.</p>
                            <div className="overflow-x-auto border-2 border-black rounded-sm bg-white mb-10">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b-2 border-black">
                                        <tr className="text-[9px] font-black uppercase">
                                            <th className="p-2 border-r border-black w-20">Categoría</th>
                                            <th className="p-2 border-r border-black text-center w-28">Criterio</th>
                                            <th className="p-2 border-r border-black">Subcategoría / Opción</th>
                                            <th className="p-2 border-r border-black text-center w-12">Titular</th>
                                            <th className="p-2 text-center w-12">Familiar</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderDifferentialRows()}</tbody>
                                </table>
                            </div>
                        </section>
                        <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
                            {!readOnly && (
                                <button type="submit" className="bg-blue-900 text-white px-20 py-5 rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all">
                                    Finalizar y Guardar Entrevista Directivo
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-14 pt-8 border-t border-slate-100 flex justify-between items-center">
                    <button type="button" onClick={onCancel} className="px-8 py-3 bg-white text-slate-400 font-black rounded-xl uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all">
                        {readOnly ? "Volver" : "Cancelar"}
                    </button>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className={`px-8 py-3 font-black rounded-xl uppercase text-[10px] tracking-widest transition-all ${currentStep === 0 ? 'text-slate-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border'}`}>Anterior</button>
                        {currentStep < 4 && <button type="button" onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))} className="px-10 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl">Siguiente</button>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DirectivoInterviewFormPage;
