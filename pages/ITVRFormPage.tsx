
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
        missionNo: initialData?.missionNo || mission?.missionNo || '124974',
        caseNo: initialData?.caseNo || extendedData?.caseInfo?.caseId || '08136E',
        radicado: initialData?.radicado || mission?.caseRadicado || '20181100050765',
        evaluator: initialData?.evaluator || mission?.assignedOfficial || 'BOGOTA - ANA MARIA REYES CRUZ',
        
        realidadAmenaza: initialData?.realidadAmenaza || '0.0328',
        obs1: initialData?.obs1 || 'El evaluado reporta situaciones o hechos que considera amenazantes, pero ni las entidades competentes, ni las labores de verificación sustentan la realidad de la amenaza.',
        individualidadAmenaza: initialData?.individualidadAmenaza || '0.1875',
        obs2: initialData?.obs2 || 'Existe amenaza y esta no afecta al evaluado.',
        situacionAmenazado: initialData?.situacionAmenazado || '0.0469',
        obs3: initialData?.obs3 || 'El evaluado presenta amenazas y estas se derivan de la intervención en el proceso penal.',
        escenarioAmenaza: initialData?.escenarioAmenaza || '0.0234',
        obs4: initialData?.obs4 || 'En el escenario no existe probabilidad de la materializacion de la amenaza en contra del evaluado.',
        generadorAmenaza: initialData?.generadorAmenaza || '0.0094',
        obs5: initialData?.obs5 || 'Existiendo la amenaza se tiene individualizado e identificado el presunto actor.',
        capacidadAmenaza: initialData?.capacidadAmenaza || '0.0094',
        obs6: initialData?.obs6 || 'Se presentan amenazas y el presunto actor generador tiene alta capacidad.',
        interesAmenaza: initialData?.interesAmenaza || '0.0094',
        obs7: initialData?.obs7 || 'Existe amenaza, pero el presunto actor generador tiene intereses distintos a evitar la colaboracion del evaluado con la administracion de justicia.',
        inminenciaAmenaza: initialData?.inminenciaAmenaza || '0.0328',
        obs8: initialData?.obs8 || 'Existiendo amenaza no es inmediata su materializacion.',

        especificoIndividualizable: initialData?.especificoIndividualizable || '0.0463',
        obs9: initialData?.obs9 || 'Existen factores de riesgo pero no afectan al evaluado.',
        concreto: initialData?.concreto || '0.0231',
        obs10: initialData?.obs10 || 'No existen hechos que indiquen que el evaluado puede ser objeto de afectación de los derechos fundamentales objeto de Protección del Programa.',
        presente: initialData?.presente || '0.0694',
        obs11: initialData?.obs11 || 'Existen hechos que afectan la seguridad del evaluado y estos son actuales.',
        importante: initialData?.importante || '0.0278',
        obs12: initialData?.obs12 || 'No se identifican hechos que afecten bienes jurídicos objeto de protección por parte del Programa de Protección y Asistencia.',
        serio: initialData?.serio || '0.0208',
        obs13: initialData?.obs13 || 'Existen elementos o información que dan cuenta de probabilidad baja de la ocurrencia de un hecho lesivo en contra del evaluado.',
        claroDiscernible: initialData?.claroDiscernible || '0.0347',
        obs14: initialData?.obs14 || 'Existe información aportada de situaciones de riesgo pero esta no puede ser convalidada.',
        excepcional: initialData?.excepcional || '0.0139',
        obs15: initialData?.obs15 || 'El evaluado tiene carga pública soportable que no afecta su nivel de riesgo.',
        proporcionalidad: initialData?.proporcionalidad || '0.0417',
        obs16: initialData?.obs16 || 'La condición individual del evaluado lo coloca en situación de desventaja frente a su potencial agresor.',
        graveInminente: initialData?.graveInminente || '0.0417',
        obs17: initialData?.obs17 || 'Existe riesgo y es grave e inminente su materialización, derivado o no de la intervención procesal penal del evaluado.',

        conductasComportamientos: initialData?.conductasComportamientos || '0.0222',
        obs18: initialData?.obs18 || 'No aplica conductas y comportamientos de auto seguridad.',
        permanenciaZona: initialData?.permanenciaZona || '0.0222',
        obs19: initialData?.obs19 || 'Permanece.',
        vulnerabilidadResidencial: initialData?.vulnerabilidadResidencial || '0.0074',
        obs20: initialData?.obs20 || 'Baja',
        vulnerabilidadLaboral: initialData?.vulnerabilidadLaboral || '0.0222',
        obs21: initialData?.obs21 || 'La vulnerabilidad en el entorno laboral es alta.',
        vulnerabilidadDesplazamientos: initialData?.vulnerabilidadDesplazamientos || '0.0148',
        obs22: initialData?.obs22 || 'Media',
        presenciaFDG: initialData?.presenciaFDG || '0.0111',
        obs23: initialData?.obs23 || 'El o la evaluado(a) o su núcleo familiar tiene(n) un (1) factor diferencial y o de género.',
        vulnerabilidadAsociadaFDG: initialData?.vulnerabilidadAsociadaFDG || '0.0111',
        obs24: initialData?.obs24 || 'El/la evaluado(a) pertenece a una población diferencial pero esta condición no le genera riesgo y/o amenaza derivado de su intervención procesal.',
        vulnerabilidadAsociadaGenero: initialData?.vulnerabilidadAsociadaGenero || '0.0111',
        obs25: initialData?.obs25 || 'El/la evaluado(a) presenta factor de género, pero esta condición no le genera riesgo y/o amenaza derivado de su intervención procesal.',
        vulnerabilidadesNucleo: initialData?.vulnerabilidadesNucleo || '0.0074',
        obs26: initialData?.obs26 || 'Baja'
    });

    // Define updateField to fix "Cannot find name 'updateField'" errors
    const updateField = (field: keyof ITVRForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const totalScore = useMemo(() => {
        // En este mock usamos los puntajes del PDF
        const amScore = 35.16;
        const rieScore = 31.94;
        const vulScore = 12.96;
        return amScore + rieScore + vulScore;
    }, []);

    const riskLevel = useMemo(() => {
        if (totalScore >= 90) return 'EXTREMO';
        if (totalScore >= 50) return 'EXTRAORDINARIO';
        if (totalScore >= 15) return 'ORDINARIO';
        return 'MÍNIMO / NO APLICA';
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

    if (readOnly) {
        return (
            <div className="max-w-5xl mx-auto p-0 md:p-10 animate-in fade-in duration-500 print:p-0">
                {/* Botonera Flotante print hidden */}
                <div className="mb-6 flex justify-between items-center print:hidden px-4 md:px-0">
                    <button 
                        onClick={onCancel}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Regresar
                    </button>
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>
                        Imprimir Formato ITVR
                    </button>
                </div>

                <div className="bg-white p-8 md:p-12 border border-slate-300 shadow-2xl font-serif text-slate-900 print:border-none print:shadow-none print:p-0">
                    {/* Header Oficial PDF (Calco exacto) */}
                    <div className="border border-black grid grid-cols-[1.3fr,2.5fr,1.2fr] mb-6">
                        <div className="border-r border-black p-4 flex items-center justify-center bg-white">
                            <img src={LOGO_URL} alt="Logo FGN" className="h-16 w-auto" />
                        </div>
                        <div className="border-r border-black flex flex-col text-center divide-y divide-black">
                            <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                            <div className="p-2 text-[13px] font-black uppercase flex-1 flex items-center justify-center tracking-tight leading-tight">FORMATO INSTRUMENTO TÉCNICO DE VALORACIÓN DE RIESGO</div>
                        </div>
                        <div className="p-0 text-[8px] font-bold uppercase divide-y divide-black">
                            <div className="p-2">Código: <span className="font-black">FGN-MS01-F-63</span></div>
                            <div className="p-2">Versión: <span className="font-black">04</span></div>
                        </div>
                    </div>

                    {/* Información Persona Evaluada (Formato PDF) */}
                    <div className="border border-black p-6 mb-8">
                        <h4 className="text-[11px] font-black uppercase tracking-widest border-b border-black pb-1 mb-4">INFORMACIÓN DE LA PERSONA EVALUADA</h4>
                        <div className="grid grid-cols-2 md:grid-cols-[1.5fr,1fr,1.5fr,1fr] gap-x-4 gap-y-4 text-[11px]">
                            <div className="font-bold">Número de Misión:</div><div className="font-mono">{formData.missionNo}</div>
                            <div className="font-bold">Número de Caso:</div><div className="font-mono">{formData.caseNo}</div>
                            
                            <div className="font-bold">Radicado:</div><div className="font-mono">{formData.radicado}</div>
                            <div className="font-bold">Fecha de Entrega Misión:</div><div>2018-10-12</div>

                            <div className="font-bold">Nombres y Apellidos del Evaluado:</div>
                            <div className="col-span-3 font-black uppercase text-sm border-b border-dotted border-black">
                                {`${extendedData?.caseInfo?.firstName || 'JUAN DAVID'} ${extendedData?.caseInfo?.firstSurname || 'BARRIOS VALDERRAMA'}`.trim()}
                            </div>

                            <div className="font-bold">Tipo de Documento:</div><div>Tarjeta de Identidad</div>
                            <div className="font-bold">Número de Documento:</div><div className="font-mono">1121937668</div>

                            <div className="font-bold">Etapa Procesal:</div><div className="uppercase">indagación</div>
                            <div className="font-bold">Regional:</div><div className="uppercase">REGIONAL BOGOTA</div>

                            <div className="font-bold">Evaluador:</div><div className="col-span-3 uppercase font-semibold">{formData.evaluator}</div>

                            <div className="font-bold">Tipo de Misión:</div><div className="col-span-3 uppercase">EVALUACION DE AMENAZA Y RIESGO</div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* 1. EVALUACIÓN DE LA AMENAZA */}
                        <section>
                            <h4 className="font-black text-[12px] uppercase border-b border-black pb-1 mb-6">1. EVALUACIÓN DE LA AMENAZA</h4>
                            <div className="space-y-6">
                                {[
                                    { n: '1.1', t: 'Realidad de la Amenaza', v: formData.realidadAmenaza, o: formData.obs1 },
                                    { n: '1.2', t: 'Individualidad de la Amenaza', v: formData.individualidadAmenaza, o: formData.obs2 },
                                    { n: '1.3', t: 'Situación Específica del Amenazado', v: formData.situacionAmenazado, o: formData.obs3 },
                                    { n: '1.4', t: 'Escenario de la Amenaza', v: formData.escenarioAmenaza, o: formData.obs4 },
                                    { n: '1.5', t: 'Presunto Actor Generador de la Amenaza', v: formData.generadorAmenaza, o: formData.obs5 },
                                    { n: '1.6', t: 'Capacidad del Presunto Actor Para Materializar la Amenaza', v: formData.capacidadAmenaza, o: formData.obs6 },
                                    { n: '1.7', t: 'Interés del Presunto Actor Generador de la Amaneza Hacia el Evaluado', v: formData.interesAmenaza, o: formData.obs7 },
                                    { n: '1.8', t: 'Inminencia de la Materialización de la Amenaza', v: formData.inminenciaAmenaza, o: formData.obs8 }
                                ].map((item, i) => (
                                    <div key={i} className="text-[11px]">
                                        <div className="font-bold mb-1">{item.n}. {item.t}: <span className="text-blue-700 ml-1">{item.v}</span></div>
                                        <div className="text-justify mb-2 leading-tight">
                                            {i === 0 ? "1 - " : (i+1)%2 === 0 ? "1 - " : "2 - "}{item.o}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-600 mb-1">Fuentes de Información y Argumento que Soporta el Puntaje: <span className="font-normal italic">trh...</span></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. RIESGO ESPECÍFICO */}
                        <section className="page-break-before">
                            <h4 className="font-black text-[12px] uppercase border-b border-black pb-1 mb-6">2. EVALUACIÓN DEL RIESGO ESPECÍFICO</h4>
                            <div className="space-y-6">
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
                                    <div key={i} className="text-[11px]">
                                        <div className="font-bold mb-1">{item.n}. {item.t}: <span className="text-blue-700 ml-1">{item.v}</span></div>
                                        <div className="text-justify mb-2 leading-tight">
                                            {i === 2 ? "2- " : "1- "}{item.o}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-600 mb-1">Fuentes de Información y Argumento que Soporta el Puntaje: <span className="font-normal italic">rth...</span></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. VULNERABILIDAD */}
                        <section className="page-break-before">
                            <h4 className="font-black text-[12px] uppercase border-b border-black pb-1 mb-6">3. EVALUACIÓN DE LA VULNERABILIDAD</h4>
                            <div className="space-y-6">
                                {[
                                    { n: '3.1', t: 'Conductas y Comportamientos', v: formData.conductasComportamientos, o: formData.obs18 },
                                    { n: '3.2', t: 'Permanencia en la Zona de Riesgo', v: formData.permanenciaZona, o: formData.obs19 },
                                    { n: '3.3', t: 'Vulnerabilidad Entorno Residencial', v: formData.vulnerabilidadResidencial, o: formData.obs20 },
                                    { n: '3.4', t: 'Vulnerabilidad Asociada al Entorno en donde Desarrolla Actividades de Trabajo', v: formData.vulnerabilidadLaboral, o: formData.obs21 },
                                    { n: '3.5', t: 'Vulnerabilidad en los Desplazamientos Cotidianos', v: formData.vulnerabilidadDesplazamientos, o: formData.obs22 },
                                    { n: '3.6', t: 'Presencia de Factor Diferencial y/o de Género', v: formData.presenciaFDG, o: formData.obs23 },
                                    { n: '3.7', t: 'Vulnerabilidad Asociada a la Pertenencia a Población Diferencial', v: formData.vulnerabilidadAsociadaFDG, o: formData.obs24 },
                                    { n: '3.8', t: 'Vulnerabilidad Asociada al Género', v: formData.vulnerabilidadAsociadaGenero, o: formData.obs25 },
                                    { n: '3.9', t: 'Vulnerabilidades Generadas por el Núcleo Familiar', v: formData.vulnerabilidadesNucleo, o: formData.obs26 }
                                ].map((item, i) => (
                                    <div key={i} className="text-[11px]">
                                        <div className="font-bold mb-1">{item.n}. {item.t}: <span className="text-blue-700 ml-1">{item.v}</span></div>
                                        <div className="text-justify mb-2 leading-tight">
                                            {item.o}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-600 mb-1">Fuentes de Información y Argumento que Soporta el Puntaje: <span className="font-normal italic">thr...</span></div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* RESULTADO Y PONDERACIÓN FINAL (Calco PDF) */}
                        <div className="mt-12 pt-10 border-t-2 border-black page-break-before">
                            <div className="flex flex-col items-start gap-4">
                                <h2 className="text-[12px] font-black uppercase underline decoration-black">TOTAL PONDERACIÓN ITVR</h2>
                                <p className="text-[13px] font-bold">
                                    (Amenaza 35.16) + (Riesgo Específico 31.94) + (Vulnerabilidad 12.96) = <span className="text-red-600 text-xl font-black underline ml-1">80.06</span>
                                </p>
                                
                                <div className="mt-4 flex flex-col items-start">
                                    <span className="text-[12px] font-black uppercase block mb-1">RESULTADO DE LA EVALUACIÓN: <span className="text-orange-600 text-2xl ml-4 tracking-tighter">EXTRAORDINARIO</span></span>
                                </div>

                                <div className="w-full max-w-lg mt-8 border border-black">
                                    <table className="w-full border-collapse text-[11px] text-center font-bold uppercase">
                                        <thead className="bg-slate-100 border-b border-black">
                                            <tr>
                                                <th className="border-r border-black p-2">RANGOS</th>
                                                <th className="border-r border-black p-2">MÍNIMO</th>
                                                <th className="p-2">MÁXIMO</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black">
                                            <tr>
                                                <td className="border-r border-black p-2">ORDINARIO</td>
                                                <td className="border-r border-black p-2">{">="}15</td>
                                                <td className="p-2">{"<"}50</td>
                                            </tr>
                                            <tr className="bg-slate-50 border-y border-black">
                                                <td className="border-r border-black p-2">EXTRAORDINARIO</td>
                                                <td className="border-r border-black p-2">{">="}50</td>
                                                <td className="p-2">{"<"}90</td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-black p-2">EXTREMO</td>
                                                <td className="border-r border-black p-2">{">="}90</td>
                                                <td className="p-2">{"<="}100</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* NOTA AL PIE OFICIAL */}
                        <div className="mt-20 text-[9px] font-medium text-slate-500 text-justify leading-tight border-t border-slate-200 pt-4">
                            Este documento es copia del original que reposa en la Intranet. Su impresión o descarga se considera una Copia No Controlada.
                            Para ver el documento controlado ingrese al BIT en la intranet: http://web.fiscalia.col/fiscalnet/
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // MODO EDICIÓN
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
                                <option value="0.0328">1 - Reporta hechos pero no están sustentados</option>
                                <option value="0.0656">2 - Reporta hechos sustentados por autoridades</option>
                            </select>
                            <TextAreaField label="Soporte Puntaje 1.1" value={formData.obs1} onChange={e => updateField('obs1', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                            {[
                                { f: 'individualidadAmenaza', l: '1.2 Individualidad', obs: 'obs2', opts: [{v:'0', t:'No individualizada'}, {v:'0.1875', t:'Afecta a otros'}, {v:'0.3750', t:'Directa contra evaluado'}] },
                                { f: 'situacionAmenazado', l: '1.3 Situación Específica', obs: 'obs3', opts: [{v:'0', t:'Sin amenazas'}, {v:'0.2343', t:'No derivada de proceso'}, {v:'0.4687', t:'Derivada del proceso penal'}] },
                                { f: 'escenarioAmenaza', l: '1.4 Escenario', obs: 'obs4', opts: [{v:'0', t:'Sin probabilidad'}, {v:'0.2343', t:'Probabilidad baja'}, {v:'0.4687', t:'Probabilidad alta'}] },
                                { f: 'generadorAmenaza', l: '1.5 Actor Generador', obs: 'obs5', opts: [{v:'0', t:'No identificado'}, {v:'0.0468', t:'Sin identificación plena'}, {v:'0.0093', t:'Identificado e individualizado'}] },
                                { f: 'capacidadAmenaza', l: '1.6 Capacidad del Actor', obs: 'obs6', opts: [{v:'0', t:'Sin amenaza'}, {v:'0.0046', t:'Logística/Táctica Baja'}, {v:'0.0093', t:'Logística/Táctica Alta'}] },
                                { f: 'interesAmenaza', l: '1.7 Interés del Actor', obs: 'obs7', opts: [{v:'0', t:'Sin interés'}, {v:'0.0093', t:'Intereses ajenos al proceso'}, {v:'0.0187', t:'Impedir colaboración judicial'}] },
                                { f: 'inminenciaAmenaza', l: '1.8 Inminencia', obs: 'obs8', opts: [{v:'0', t:'Sin inminencia'}, {v:'0.0328', t:'Materialización no inmediata'}, {v:'0.0656', t:'Materialización inmediata'}] }
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
                            { f: 'especificoIndividualizable', l: '2.1 Específico e Individualizable', obs: 'obs9', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0231', t:'Baja'}, {v:'0.0463', t:'Media'}, {v:'0.0694', t:'Alta'}] },
                            { f: 'concreto', l: '2.2 Concreto', obs: 'obs10', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0231', t:'Baja'}, {v:'0.0463', t:'Media'}, {v:'0.0694', t:'Alta'}] },
                            { f: 'presente', l: '2.3 Presente', obs: 'obs11', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0347', t:'Incierto'}, {v:'0.0694', t:'Actual'}] },
                            { f: 'importante', l: '2.4 Importante', obs: 'obs12', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0277', t:'Medio'}, {v:'0.0555', t:'Alto (Derechos Fund.)'}] },
                            { f: 'serio', l: '2.5 Serio', obs: 'obs13', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0208', t:'Bajo'}, {v:'0.0416', t:'Alto'}] },
                            { f: 'claroDiscernible', l: '2.6 Claro y Discernible', obs: 'obs14', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0347', t:'Poco claro'}, {v:'0.0694', t:'Evidente'}] },
                            { f: 'excepcional', l: '2.7 Excepcional', obs: 'obs15', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0138', t:'Mínimo'}, {v:'0.0277', t:'Moderado'}, {v:'0.0416', t:'Extraordinario'}] },
                            { f: 'proporcionalidad', l: '2.8 Desproporcionalidad', obs: 'obs16', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0416', t:'Desventaja clara'}] },
                            { f: 'graveInminente', l: '2.9 Grave e Inminente', obs: 'obs17', opts: [{v:'0', t:'Seleccione...'}, {v:'0.0208', t:'Grave o Inminente'}, {v:'0.0416', t:'Grave e Inminente'}] }
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
                            { f: 'conductasComportamientos', l: '3.1 Conductas y Comportamientos', obs: 'obs18', opts: [{v:'0', t:'Autoprotección siempre'}, {v:'0.1111', t:'A veces'}, {v:'0.2222', t:'Nunca'}] },
                            { f: 'permanenciaZona', l: '3.2 Permanencia en Zona', obs: 'obs19', opts: [{v:'0', t:'No permanece'}, {v:'0.1111', t:'Ocasional'}, {v:'0.2222', t:'Siempre'}] },
                            { f: 'vulnerabilidadResidencial', l: '3.3 Entorno Residencial', obs: 'obs20', opts: [{v:'0', t:'Seguridad alta'}, {v:'0.0074', t:'Baja'}, {v:'0.0148', t:'Media'}, {v:'0.2222', t:'Alta (Inseguro)'}] },
                            { f: 'vulnerabilidadLaboral', l: '3.4 Entorno Laboral', obs: 'obs21', opts: [{v:'0', t:'Sin riesgo'}, {v:'0.0074', t:'Bajo'}, {v:'0.0148', t:'Medio'}, {v:'0.2222', t:'Alto'}] },
                            { f: 'vulnerabilidadDesplazamientos', l: '3.5 Desplazamientos', obs: 'obs22', opts: [{v:'0', t:'Rutas seguras'}, {v:'0.0074', t:'Bajo'}, {v:'0.0148', t:'Medio'}, {v:'0.2222', t:'Alto'}] },
                            { f: 'presenciaFDG', l: '3.6 Factor Diferencial/Género', obs: 'obs23', opts: [{v:'0', t:'No aplica'}, {v:'0.1111', t:'1 Factor'}, {v:'0.2222', t:'2 o más factores'}] },
                            { f: 'vulnerabilidadAsociadaFDG', l: '3.7 Pob. Diferencial', obs: 'obs24', opts: [{v:'0', t:'No aplica'}, {v:'0.1111', t:'Pertenece'}, {v:'0.2222', t:'Riesgo asociado'}] },
                            { f: 'vulnerabilidadAsociadaGenero', l: '3.8 Género', obs: 'obs25', opts: [{v:'0', t:'No aplica'}, {v:'0.1111', t:'Identifica'}, {v:'0.2222', t:'Riesgo asociado'}] },
                            { f: 'vulnerabilidadesNucleo', l: '3.9 Núcleo Familiar', obs: 'obs26', opts: [{v:'0', t:'Bajo'}, {v:'0.0074', t:'Bajo'}, {v:'0.0148', t:'Medio'}, {v:'0.2222', t:'Alto (Múltiples factores)'}] }
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

                <div className="p-10 rounded-[3rem] border-4 flex flex-col items-center gap-6 transition-all duration-500 shadow-2xl text-blue-600 bg-blue-50 border-blue-200">
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
