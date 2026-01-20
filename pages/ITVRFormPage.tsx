
import React, { useState, useEffect, useMemo } from 'react';
import { ProtectionMission, ITVRForm } from '../types';
import { FormSection, TextAreaField, InputField } from '../components/FormComponents';
import { MOCK_SAVED_CASES, MOCK_FULL_REQUESTS } from '../constants';

interface ITVRFormPageProps {
    initialData?: ITVRForm; 
    mission?: ProtectionMission;
    onCancel: () => void;
    onSaveSuccess: (msg: string) => void;
    readOnly?: boolean;
}

type TabType = 'AMENAZA' | 'RIESGO' | 'VULNERABILIDAD';

const ITVRFormPage: React.FC<ITVRFormPageProps> = ({ initialData, mission, onCancel, onSaveSuccess, readOnly = false }) => {
    const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";
    const [activeTab, setActiveTab] = useState<TabType>('AMENAZA');

    const extendedData = useMemo(() => {
        const radicado = initialData?.radicado || mission?.caseRadicado;
        if (!radicado) return null;
        const caseInfo = MOCK_SAVED_CASES.find(c => c.radicado === radicado);
        const requestInfo = Object.values(MOCK_FULL_REQUESTS).find(r => r.radicado === radicado);
        return { caseInfo, requestInfo };
    }, [initialData, mission]);

    const [formData, setFormData] = useState<ITVRForm>({
        evaluationNo: initialData?.evaluationNo || `EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        evaluationDate: initialData?.evaluationDate || new Date().toISOString().split('T')[0],
        missionNo: initialData?.missionNo || mission?.missionNo || '',
        caseNo: initialData?.caseNo || extendedData?.caseInfo?.caseId || 'EN TRÁMITE',
        radicado: initialData?.radicado || mission?.caseRadicado || '',
        evaluator: initialData?.evaluator || mission?.assignedOfficial || 'ANA MARIA REYES CRUZ',
        
        realidadAmenaza: initialData?.realidadAmenaza || '0',
        obs1: initialData?.obs1 || '',
        individualidadAmenaza: initialData?.individualidadAmenaza || '0',
        obs2: initialData?.obs2 || '',
        situacionAmenazado: initialData?.situacionAmenazado || '0',
        obs3: initialData?.obs3 || '',
        escenarioAmenaza: initialData?.escenarioAmenaza || '0',
        obs4: initialData?.obs4 || '',
        generadorAmenaza: initialData?.generadorAmenaza || '0',
        obs5: initialData?.obs5 || '',
        capacidadAmenaza: initialData?.capacidadAmenaza || '0',
        obs6: initialData?.obs6 || '',
        interesAmenaza: initialData?.interesAmenaza || '0',
        obs7: initialData?.obs7 || '',
        inminenciaAmenaza: initialData?.inminenciaAmenaza || '0',
        obs8: initialData?.obs8 || '',

        especificoIndividualizable: initialData?.especificoIndividualizable || '0',
        obs9: initialData?.obs9 || '',
        concreto: initialData?.concreto || '0',
        obs10: initialData?.obs10 || '',
        presente: initialData?.presente || '0',
        obs11: initialData?.obs11 || '',
        importante: initialData?.importante || '0',
        obs12: initialData?.obs12 || '',
        serio: initialData?.serio || '0',
        obs13: initialData?.obs13 || '',
        claroDiscernible: initialData?.claroDiscernible || '0',
        obs14: initialData?.obs14 || '',
        excepcional: initialData?.excepcional || '0',
        obs15: initialData?.obs15 || '',
        proporcionalidad: initialData?.proporcionalidad || '0',
        obs16: initialData?.obs16 || '',
        graveInminente: initialData?.graveInminente || '0',
        obs17: initialData?.obs17 || '',

        conductasComportamientos: initialData?.conductasComportamientos || '0',
        obs18: initialData?.obs18 || '',
        permanenciaZona: initialData?.permanenciaZona || '0',
        obs19: initialData?.obs19 || '',
        vulnerabilidadResidencial: initialData?.vulnerabilidadResidencial || '0',
        obs20: initialData?.obs20 || '',
        vulnerabilidadLaboral: initialData?.vulnerabilidadLaboral || '0',
        obs21: initialData?.obs21 || '',
        vulnerabilidadDesplazamientos: initialData?.vulnerabilidadDesplazamientos || '0',
        obs22: initialData?.obs22 || '',
        presenciaFDG: initialData?.presenciaFDG || '0',
        obs23: initialData?.obs23 || '',
        vulnerabilidadAsociadaFDG: initialData?.vulnerabilidadAsociadaFDG || '0',
        obs24: initialData?.obs24 || '',
        vulnerabilidadAsociadaGenero: initialData?.vulnerabilidadAsociadaGenero || '0',
        obs25: initialData?.obs25 || '',
        vulnerabilidadesNucleo: initialData?.vulnerabilidadesNucleo || '0',
        obs26: initialData?.obs26 || '',
    });

    const updateField = (field: keyof ITVRForm, value: string) => {
        if (readOnly) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const totalScore = useMemo(() => {
        const fields = [
            'realidadAmenaza', 'individualidadAmenaza', 'situacionAmenazado', 'escenarioAmenaza', 'generadorAmenaza', 'capacidadAmenaza', 'interesAmenaza', 'inminenciaAmenaza',
            'especificoIndividualizable', 'concreto', 'presente', 'importante', 'serio', 'claroDiscernible', 'excepcional', 'proporcionalidad', 'graveInminente',
            'conductasComportamientos', 'permanenciaZona', 'vulnerabilidadResidencial', 'vulnerabilidadLaboral', 'vulnerabilidadDesplazamientos', 'presenciaFDG', 'vulnerabilidadAsociadaFDG', 'vulnerabilidadAsociadaGenero', 'vulnerabilidadesNucleo'
        ];
        let sum = 0;
        fields.forEach(f => sum += parseInt((formData as any)[f] || '0'));
        return Math.min(100, sum / 10000000);
    }, [formData]);

    const riskLevel = useMemo(() => {
        if (totalScore >= 90) return 'EXTREMO';
        if (totalScore >= 50) return 'EXTRAORDINARIO';
        if (totalScore >= 15) return 'ORDINARIO';
        return 'MÍNIMO / NO APLICA';
    }, [totalScore]);

    const riskColor = useMemo(() => {
        if (totalScore >= 90) return 'text-red-600 bg-red-50 border-red-200';
        if (totalScore >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (totalScore >= 15) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-slate-400 bg-slate-50 border-slate-200';
    }, [totalScore]);

    const TabButton = ({ id, label }: { id: TabType, label: string }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-8 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === id ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
            {label}
        </button>
    );

    const getOptionLabel = (field: string, value: string) => {
        if (value === '0') return 'No reporta / No identificado / No aplica';
        return `Nivel asignado (Puntaje: ${value})`;
    };

    if (readOnly) {
        return (
            <div className="max-w-5xl mx-auto p-0 md:p-10 animate-in fade-in duration-500 print:p-0">
                <div className="bg-white p-8 md:p-12 border-2 border-slate-900 font-serif text-slate-900 print:border-none print:shadow-none">
                    {/* Header Oficial 3 Columnas */}
                    <div className="border border-slate-900 grid grid-cols-[1.2fr,2.5fr,1.2fr] mb-8">
                        <div className="border-r border-slate-900 p-4 flex items-center justify-center bg-white">
                            <img src={LOGO_URL} alt="Logo FGN" className="h-16 w-auto" />
                        </div>
                        <div className="border-r border-slate-900 flex flex-col text-center divide-y divide-slate-900">
                            <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                            <div className="p-2 text-sm font-black uppercase flex-1 flex items-center justify-center tracking-tighter">FORMATO INSTRUMENTO TÉCNICO DE VALORACIÓN DE RIESGO</div>
                        </div>
                        <div className="p-0 text-[8px] font-bold uppercase divide-y divide-slate-900">
                            <div className="p-2 uppercase">Evaluación No: {formData.evaluationNo}</div>
                            <div className="p-2 uppercase">CÓDIGO: FGN-MS01-F-63</div>
                            <div className="p-2">VERSIÓN: 04</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="bg-slate-50 border border-slate-300 p-4 rounded-t-lg font-black text-xs uppercase tracking-widest border-b-0">
                            INFORMACIÓN DE LA PERSONA EVALUADA
                        </div>
                        <div className="border border-slate-300 p-6 grid grid-cols-2 md:grid-cols-4 gap-y-4 text-[11px] leading-relaxed">
                            <div className="font-bold">Número de Evaluación:</div><div className="font-mono font-bold text-indigo-700">{formData.evaluationNo}</div>
                            <div className="font-bold">Fecha de Evaluación:</div><div>{formData.evaluationDate}</div>
                            <div className="font-bold">Número de Misión:</div><div className="font-mono">{formData.missionNo}</div>
                            <div className="font-bold">Número de Caso:</div><div className="font-mono">{formData.caseNo}</div>
                            <div className="font-bold">Radicado:</div><div className="font-mono">{formData.radicado}</div>
                            <div className="font-bold">Fecha Entrega Misión:</div><div>2018-10-12</div>
                            <div className="font-bold col-span-1">Candidato Evaluado:</div>
                            <div className="col-span-3 font-black uppercase text-blue-900">
                                {`${extendedData?.caseInfo?.firstName || 'JUAN DAVID'} ${extendedData?.caseInfo?.firstSurname || 'BARRIOS VALDERRAMA'}`.trim()}
                            </div>
                            <div className="font-bold">Tipo de Documento:</div><div>{extendedData?.caseInfo?.docType || 'Cédula de Ciudadanía'}</div>
                            <div className="font-bold">Número de Documento:</div><div className="font-mono">{extendedData?.caseInfo?.docNumber || '1121937668'}</div>
                            <div className="font-bold">Etapa Procesal:</div><div className="uppercase">INDAGACIÓN</div>
                            <div className="font-bold">Regional:</div><div className="uppercase">REGIONAL BOGOTA</div>
                            <div className="font-bold">Evaluador:</div><div className="uppercase font-semibold">{formData.evaluator}</div>
                            <div className="font-bold">Tipo de Misión:</div><div className="uppercase">EVALUACION DE AMENAZA Y RIESGO</div>
                        </div>
                    </div>

                    <div className="space-y-12 mt-10">
                        {/* SECCIÓN 1: AMENAZA */}
                        <section>
                            <h4 className="font-black text-xs uppercase border-b-2 border-slate-900 pb-1 mb-6">1. EVALUACIÓN DE LA AMENAZA</h4>
                            <div className="space-y-6">
                                {[
                                    { n: '1.1', t: 'Realidad de la Amenaza', v: formData.realidadAmenaza, o: formData.obs1 },
                                    { n: '1.2', t: 'Individualidad de la Amenaza', v: formData.individualidadAmenaza, o: formData.obs2 },
                                    { n: '1.3', t: 'Situación Específica del Amenazado', v: formData.situacionAmenazado, o: formData.obs3 },
                                    { n: '1.4', t: 'Escenario de la Amenaza', v: formData.escenarioAmenaza, o: formData.obs4 },
                                    { n: '1.5', t: 'Presunto Actor Generador de la Amenaza', v: formData.generadorAmenaza, o: formData.obs5 },
                                    { n: '1.6', t: 'Capacidad del Presunto Actor', v: formData.capacidadAmenaza, o: formData.obs6 },
                                    { n: '1.7', t: 'Interés del Presunto Actor', v: formData.interesAmenaza, o: formData.obs7 },
                                    { n: '1.8', t: 'Inminencia de la Materialización', v: formData.inminenciaAmenaza, o: formData.obs8 }
                                ].map((item, i) => (
                                    <div key={i} className="mb-4 pl-4 border-l-2 border-slate-300">
                                        <div className="text-[11px] font-bold mb-1">{item.n}. {item.t}:</div>
                                        <div className="text-[10px] bg-slate-50 p-2 border border-slate-100 italic mb-2">{getOptionLabel(item.t, item.v)}</div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Fuentes de Información y Argumento:</div>
                                        <div className="text-[11px] text-justify leading-snug">{item.o || 'SIN ARGUMENTOS REGISTRADOS.'}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECCIÓN 2: RIESGO ESPECÍFICO */}
                        <section>
                            <h4 className="font-black text-xs uppercase border-b-2 border-slate-900 pb-1 mb-6">2. EVALUACIÓN DEL RIESGO ESPECÍFICO</h4>
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { n: '2.1', t: 'Específico e Individualizable', v: formData.especificoIndividualizable, o: formData.obs9 },
                                    { n: '2.2', t: 'Concreto', v: formData.concreto, o: formData.obs10 },
                                    { n: '2.3', t: 'Presente', v: formData.presente, o: formData.obs11 },
                                    { n: '2.4', t: 'Importante', v: formData.importante, o: formData.obs12 },
                                    { n: '2.5', t: 'Serio', v: formData.serio, o: formData.obs13 },
                                    { n: '2.6', t: 'Claro y Discernible', v: formData.claroDiscernible, o: formData.obs14 },
                                    { n: '2.7', t: 'Excepcional', v: formData.excepcional, o: formData.obs15 },
                                    { n: '2.8', t: 'Proporcionalidad', v: formData.proporcionalidad, o: formData.obs16 },
                                    { n: '2.9', t: 'Grave e Inminente', v: formData.graveInminente, o: formData.obs17 }
                                ].map((item, i) => (
                                    <div key={i} className="mb-4 pl-4 border-l-2 border-slate-300">
                                        <div className="text-[11px] font-bold mb-1">{item.n}. {item.t}:</div>
                                        <div className="text-[10px] bg-slate-50 p-2 border border-slate-100 italic mb-2">{getOptionLabel(item.t, item.v)}</div>
                                        <div className="text-[11px] text-justify leading-snug">{item.o || 'SIN OBSERVACIONES.'}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECCIÓN 3: VULNERABILIDAD */}
                        <section>
                            <h4 className="font-black text-xs uppercase border-b-2 border-slate-900 pb-1 mb-6">3. EVALUACIÓN DE LA VULNERABILIDAD</h4>
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { n: '3.1', t: 'Conductas y Comportamientos', v: formData.conductasComportamientos, o: formData.obs18 },
                                    { n: '3.2', t: 'Permanencia en la zona de riesgo', v: formData.permanenciaZona, o: formData.obs19 },
                                    { n: '3.3', t: 'Vulnerabilidad Entorno Residencial', v: formData.vulnerabilidadResidencial, o: formData.obs20 },
                                    { n: '3.4', t: 'Vulnerabilidad Asociada al Entorno Laboral', v: formData.vulnerabilidadLaboral, o: formData.obs21 },
                                    { n: '3.5', t: 'Vulnerabilidad en los Desplazamientos Cotidianos', v: formData.vulnerabilidadDesplazamientos, o: formData.obs22 },
                                    { n: '3.6', t: 'Presencia de Factor Diferencial y/o de Género', v: formData.presenciaFDG, o: formData.obs23 },
                                    { n: '3.7', t: 'Vulnerabilidad Asociada a la Población Diferencial', v: formData.vulnerabilidadAsociadaFDG, o: formData.obs24 },
                                    { n: '3.8', t: 'Vulnerabilidad Asociada al Género', v: formData.vulnerabilidadAsociadaGenero, o: formData.obs25 },
                                    { n: '3.9', t: 'Vulnerabilidades Generadas por el Núcleo Familiar', v: formData.vulnerabilidadesNucleo, o: formData.obs26 }
                                ].map((item, i) => (
                                    <div key={i} className="mb-4 pl-4 border-l-2 border-slate-300">
                                        <div className="text-[11px] font-bold mb-1">{item.n}. {item.t}:</div>
                                        <div className="text-[10px] bg-slate-50 p-2 border border-slate-100 italic mb-2">{getOptionLabel(item.t, item.v)}</div>
                                        <div className="text-[11px] text-justify leading-snug">{item.o || 'SIN OBSERVACIONES.'}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* RESULTADO Y PONDERACIÓN */}
                        <div className="mt-16 pt-10 border-t-4 border-slate-900 page-break-before">
                            <div className="flex flex-col items-center">
                                <h2 className="text-xl font-black uppercase tracking-tighter mb-4">TOTAL PONDERACIÓN ITVR</h2>
                                <p className="text-[11px] font-bold mb-6 text-center">
                                    (Amenaza) + (Riesgo Específico) + (Vulnerabilidad) = <span className="text-red-600 text-2xl underline font-mono ml-2">{totalScore.toFixed(2)}%</span>
                                </p>
                                
                                <div className="w-full max-w-lg mb-8">
                                    <table className="w-full border-collapse border border-slate-900 text-[10px] text-center">
                                        <thead className="bg-slate-900 text-white font-black">
                                            <tr>
                                                <th className="border border-slate-900 p-2">RANGOS</th>
                                                <th className="border border-slate-900 p-2">MÍNIMO</th>
                                                <th className="border border-slate-900 p-2">MÁXIMO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={totalScore >= 15 && totalScore < 50 ? 'bg-blue-50 font-black' : ''}>
                                                <td className="border border-slate-900 p-2 font-bold">ORDINARIO</td>
                                                <td className="border border-slate-900 p-2 font-bold">>= 15</td>
                                                <td className="border border-slate-900 p-2 font-bold">&lt; 50</td>
                                            </tr>
                                            <tr className={totalScore >= 50 && totalScore < 90 ? 'bg-orange-50 font-black' : ''}>
                                                <td className="border border-slate-900 p-2 font-bold">EXTRAORDINARIO</td>
                                                <td className="border border-slate-900 p-2 font-bold">>= 50</td>
                                                <td className="border border-slate-900 p-2 font-bold">&lt; 90</td>
                                            </tr>
                                            <tr className={totalScore >= 90 ? 'bg-red-50 font-black' : ''}>
                                                <td className="border border-slate-900 p-2 font-bold">EXTREMO</td>
                                                <td className="border border-slate-900 p-2 font-bold">>= 90</td>
                                                <td className="border border-slate-900 p-2 font-bold">&lt;= 100</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="text-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1">RESULTADO DE LA EVALUACIÓN:</span>
                                    <div className="text-3xl font-black uppercase tracking-tight text-blue-900 border-2 border-blue-900 px-8 py-2 inline-block rounded-xl">{riskLevel}</div>
                                </div>
                            </div>
                        </div>

                        {/* FIRMAS */}
                        <div className="mt-24 pt-10 grid grid-cols-2 gap-20">
                            <div className="text-center border-t border-slate-900 pt-2">
                                <span className="font-bold uppercase text-[9px] block">FIRMA EVALUADOR TÉCNICO</span>
                                <span className="text-[11px] font-black text-slate-800">{formData.evaluator}</span>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=ITVR-${formData.missionNo}-${formData.evaluationNo}`} alt="QR Verification" className="border border-slate-900 p-1" />
                                <span className="text-[8px] font-bold text-slate-400">Verificación SIDPA 3.0 - FGN</span>
                            </div>
                        </div>
                        
                        <div className="mt-20 border border-slate-900 p-4 text-[8px] font-bold text-center leading-tight">
                            Este documento es copia del original que reposa en la Intranet. Su impresión o descarga se considera una Copia No Controlada.<br/>
                            Para ver el documento controlado ingrese al BIT en la intranet: http://web.fiscalia.col/fiscalnet/
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 pt-10 border-t border-slate-200 print:hidden">
                    <button type="button" onClick={onCancel} className="px-8 py-3 bg-white text-slate-400 font-black rounded-xl uppercase text-[10px] tracking-widest border border-slate-100 hover:text-slate-700 transition-all">Regresar</button>
                    <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-black shadow-xl transition-all flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>
                        Imprimir Instrumento Técnico
                    </button>
                </div>
            </div>
        );
    }

    // MODO EDICIÓN COMPLETO
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl mb-6 border border-slate-100 flex flex-col md:flex-row items-center gap-8 print:shadow-none print:border-slate-300">
                <img src={LOGO_URL} alt="Fiscalía" className="h-16" />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-lg md:text-xl font-black uppercase text-slate-900 tracking-tighter">
                        Instrumento Técnico de Valoración de Riesgo (ITVR)
                    </h1>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Programa de Protección y Asistencia - FGN</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-xl">
                        <span className="text-[9px] font-black uppercase block opacity-60">ID Evaluación</span>
                        <span className="font-mono font-black text-sm">{formData.evaluationNo}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="bg-slate-100 px-8 py-3 border-b border-slate-200 flex items-center gap-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">INFORMACIÓN GENERAL DEL SISTEMA</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="No. Evaluación" value={formData.evaluationNo} disabled className="bg-slate-50 font-bold text-indigo-700" />
                    <InputField label="Fecha Evaluación" value={formData.evaluationDate} disabled className="bg-slate-50" />
                    <InputField label="No. Misión" value={formData.missionNo} disabled className="bg-slate-50" />
                    <InputField label="No. Caso" value={formData.caseNo} disabled className="bg-slate-50" />
                    <InputField label="Radicado" value={formData.radicado} disabled className="bg-slate-50 font-mono" />
                    <InputField label="Fecha Misión" value={initialData ? '2018-10-12' : (mission?.creationDate || '')} disabled className="bg-slate-50" />
                    <div className="md:col-span-2">
                        <InputField label="Candidato Evaluado" value={`${extendedData?.caseInfo?.firstName || 'JUAN DAVID'} ${extendedData?.caseInfo?.firstSurname || 'BARRIOS VALDERRAMA'}`.trim()} disabled className="bg-slate-50 font-black uppercase" />
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-slate-200 flex overflow-x-auto sticky top-0 z-20 shadow-sm rounded-t-3xl">
                <TabButton id="AMENAZA" label="1. Evaluación Amenaza" />
                <TabButton id="RIESGO" label="2. Riesgo Específico" />
                <TabButton id="VULNERABILIDAD" label="3. Vulnerabilidad" />
            </div>

            <form onSubmit={e => { e.preventDefault(); onSaveSuccess("Valoración ITVR guardada correctamente."); }} className="space-y-8 mt-6">
                
                {activeTab === 'AMENAZA' && (
                    <div className="bg-white p-8 rounded-b-3xl border-x border-b border-slate-200 space-y-10 animate-in slide-in-from-right-4">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-800 uppercase">1.1 Realidad de la Amenaza</label>
                            <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" value={formData.realidadAmenaza} onChange={e => updateField('realidadAmenaza', e.target.value)}>
                                <option value="0">0 - El evaluado no reporta amenazas</option>
                                <option value="32812500">1 - Reporta hechos pero no están sustentados</option>
                                <option value="65625000">2 - Reporta hechos sustentados por autoridades</option>
                            </select>
                            <TextAreaField label="Soporte Puntaje 1.1" value={formData.obs1} onChange={e => updateField('obs1', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                            {[
                                { f: 'individualidadAmenaza', l: '1.2 Individualidad', obs: 'obs2', opts: [{v:'0', t:'No individualizada'}, {v:'187500000', t:'Afecta a otros'}, {v:'037500000', t:'Directa contra evaluado'}] },
                                { f: 'situacionAmenazado', l: '1.3 Situación Específica', obs: 'obs3', opts: [{v:'0', t:'Sin amenazas'}, {v:'23437500', t:'No derivada de proceso'}, {v:'46875000', t:'Derivada del proceso penal'}] },
                                { f: 'escenarioAmenaza', l: '1.4 Escenario', obs: 'obs4', opts: [{v:'0', t:'Sin probabilidad'}, {v:'23437500', t:'Probabilidad baja'}, {v:'46875000', t:'Probabilidad alta'}] },
                                { f: 'generadorAmenaza', l: '1.5 Actor Generador', obs: 'obs5', opts: [{v:'0', t:'No identificado'}, {v:'04687500', t:'Sin identificación plena'}, {v:'9375000', t:'Identificado e individualizado'}] },
                                { f: 'capacidadAmenaza', l: '1.6 Capacidad del Actor', obs: 'obs6', opts: [{v:'0', t:'Sin amenaza'}, {v:'4687500', t:'Logística/Táctica Baja'}, {v:'9375000', t:'Logística/Táctica Alta'}] },
                                { f: 'interesAmenaza', l: '1.7 Interés del Actor', obs: 'obs7', opts: [{v:'0', t:'Sin interés'}, {v:'9375000', t:'Intereses ajenos al proceso'}, {v:'18750000', t:'Impedir colaboración judicial'}] },
                                { f: 'inminenciaAmenaza', l: '1.8 Inminencia', obs: 'obs8', opts: [{v:'0', t:'Sin inminencia'}, {v:'32812500', t:'Materialización no inmediata'}, {v:'65625000', t:'Materialización inmediata'}] }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-3">
                                    <label className="text-xs font-black text-slate-800 uppercase">{item.l}</label>
                                    <select className="w-full border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold" value={(formData as any)[item.f]} onChange={e => updateField(item.f as any, e.target.value)}>
                                        {item.opts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                                    </select>
                                    <TextAreaField label="Argumento Soporte" value={(formData as any)[item.obs]} onChange={e => updateField(item.obs as any, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'RIESGO' && (
                    <div className="bg-white p-8 rounded-b-3xl border-x border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 animate-in slide-in-from-right-4">
                        {[
                            { f: 'especificoIndividualizable', l: '2.1 Específico e Individualizable', obs: 'obs9', opts: [{v:'0', t:'Seleccione...'}, {v:'23148148', t:'Baja'}, {v:'46296296', t:'Media'}, {v:'69444444', t:'Alta'}] },
                            { f: 'concreto', l: '2.2 Concreto', obs: 'obs10', opts: [{v:'0', t:'Seleccione...'}, {v:'23148148', t:'Baja'}, {v:'46296296', t:'Media'}, {v:'69444444', t:'Alta'}] },
                            { f: 'presente', l: '2.3 Presente', obs: 'obs11', opts: [{v:'0', t:'Seleccione...'}, {v:'34722222', t:'Incierto'}, {v:'69444444', t:'Actual'}] },
                            { f: 'importante', l: '2.4 Importante', obs: 'obs12', opts: [{v:'0', t:'Seleccione...'}, {v:'27777778', t:'Medio'}, {v:'55555556', t:'Alto (Derechos Fund.)'}] },
                            { f: 'serio', l: '2.5 Serio', obs: 'obs13', opts: [{v:'0', t:'Seleccione...'}, {v:'20833333', t:'Bajo'}, {v:'41666667', t:'Alto'}] },
                            { f: 'claroDiscernible', l: '2.6 Claro y Discernible', obs: 'obs14', opts: [{v:'0', t:'Seleccione...'}, {v:'34722222', t:'Poco claro'}, {v:'69444444', t:'Evidente'}] },
                            { f: 'excepcional', l: '2.7 Excepcional', obs: 'obs15', opts: [{v:'0', t:'Seleccione...'}, {v:'13888889', t:'Mínimo'}, {v:'27777778', t:'Moderado'}, {v:'41666667', t:'Extraordinario'}] },
                            { f: 'proporcionalidad', l: '2.8 Desproporcionalidad', obs: 'obs16', opts: [{v:'0', t:'Seleccione...'}, {v:'41666667', t:'Desventaja clara'}] },
                            { f: 'graveInminente', l: '2.9 Grave e Inminente', obs: 'obs17', opts: [{v:'0', t:'Seleccione...'}, {v:'20833333', t:'Grave o Inminente'}, {v:'41666667', t:'Grave e Inminente'}] }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <label className="text-xs font-black text-slate-800 uppercase">{item.l}</label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold" value={(formData as any)[item.f]} onChange={e => updateField(item.f as any, e.target.value)}>
                                    {item.opts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                                </select>
                                <TextAreaField label="Argumento Soporte" value={(formData as any)[item.obs]} onChange={e => updateField(item.obs as any, e.target.value)} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'VULNERABILIDAD' && (
                    <div className="bg-white p-8 rounded-b-3xl border-x border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 animate-in slide-in-from-right-4">
                        {[
                            { f: 'conductasComportamientos', l: '3.1 Conductas y Comportamientos', obs: 'obs18', opts: [{v:'0', t:'Autoprotección siempre'}, {v:'11111111', t:'A veces'}, {v:'22222222', t:'Nunca'}] },
                            { f: 'permanenciaZona', l: '3.2 Permanencia en Zona', obs: 'obs19', opts: [{v:'0', t:'No permanece'}, {v:'11111111', t:'Ocasional'}, {v:'22222222', t:'Siempre'}] },
                            { f: 'vulnerabilidadResidencial', l: '3.3 Entorno Residencial', obs: 'obs20', opts: [{v:'0', t:'Seguridad alta'}, {v:'7407407', t:'Baja'}, {v:'14814815', t:'Media'}, {v:'22222222', t:'Alta (Inseguro)'}] },
                            { f: 'vulnerabilidadLaboral', l: '3.4 Entorno Laboral', obs: 'obs21', opts: [{v:'0', t:'Sin riesgo'}, {v:'7407407', t:'Bajo'}, {v:'14814815', t:'Medio'}, {v:'22222222', t:'Alto'}] },
                            { f: 'vulnerabilidadDesplazamientos', l: '3.5 Desplazamientos', obs: 'obs22', opts: [{v:'0', t:'Rutas seguras'}, {v:'7407407', t:'Bajo'}, {v:'14814815', t:'Medio'}, {v:'22222222', t:'Alto'}] },
                            { f: 'presenciaFDG', l: '3.6 Factor Diferencial/Género', obs: 'obs23', opts: [{v:'0', t:'No aplica'}, {v:'11111111', t:'1 Factor'}, {v:'22222222', t:'2 o más factores'}] },
                            { f: 'vulnerabilidadAsociadaFDG', l: '3.7 Pob. Diferencial', obs: 'obs24', opts: [{v:'0', t:'No aplica'}, {v:'11111111', t:'Pertenece'}, {v:'22222222', t:'Riesgo asociado'}] },
                            { f: 'vulnerabilidadAsociadaGenero', l: '3.8 Género', obs: 'obs25', opts: [{v:'0', t:'No aplica'}, {v:'11111111', t:'Identifica'}, {v:'22222223', t:'Riesgo asociado'}] },
                            { f: 'vulnerabilidadesNucleo', l: '3.9 Núcleo Familiar', obs: 'obs26', opts: [{v:'0', t:'Bajo'}, {v:'7407407', t:'Bajo'}, {v:'14814815', t:'Medio'}, {v:'22222223', t:'Alto (Múltiples factores)'}] }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <label className="text-xs font-black text-slate-800 uppercase">{item.l}</label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold" value={(formData as any)[item.f]} onChange={e => updateField(item.f as any, e.target.value)}>
                                    {item.opts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                                </select>
                                <TextAreaField label="Argumento Soporte" value={(formData as any)[item.obs]} onChange={e => updateField(item.obs as any, e.target.value)} />
                            </div>
                        ))}
                    </div>
                )}

                <div className={`p-10 rounded-[3rem] border-4 flex flex-col items-center gap-6 transition-all duration-500 shadow-2xl ${riskColor}`}>
                    <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">PUNTUACIÓN TÉCNICA RESULTANTE</h2>
                        <div className="text-7xl font-mono font-black">{totalScore.toFixed(2)}%</div>
                    </div>
                    <div className="h-px w-full max-w-md bg-current opacity-20"></div>
                    <div className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1">Nivel de Riesgo Calculado:</span>
                        <div className="text-3xl font-black uppercase tracking-tight">{riskLevel}</div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 pt-10 border-t border-slate-200">
                    <button type="button" onClick={onCancel} className="px-8 py-3 bg-white text-slate-400 font-black rounded-xl uppercase text-[10px] tracking-widest border border-slate-100 hover:text-slate-700 transition-all shadow-sm">Cancelar</button>
                    <button type="submit" className="px-12 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
                        {initialData ? 'Actualizar Matriz Guardada' : 'Finalizar y Guardar Valoración'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ITVRFormPage;
