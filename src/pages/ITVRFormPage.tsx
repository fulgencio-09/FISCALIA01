
import React, { useState, useEffect, useMemo } from 'react';
import { ProtectionMission, ITVRForm } from '../types';
import { TextAreaField, InputField } from '../components/FormComponents';
import { MOCK_SAVED_CASES, MOCK_FULL_REQUESTS } from '../constants';

// Diccionario de Ayudas Técnicas para el Evaluador
const ITVR_HELP_TEXTS: Record<string, string> = {
    'realidadAmenaza': 'Valora si la amenaza reportada tiene un sustento real fáctico o si se trata de una percepción subjetiva sin evidencias externas o soportes de autoridades competentes.',
    'individualidadAmenaza': 'Determina si la amenaza está dirigida de manera unívoca contra el evaluado o si se trata de una situación de inseguridad generalizada que afecta a la población en común.',
    'situacionAmenazado': 'Evalúa la vinculación directa entre la amenaza y la labor o intervención procesal del evaluado dentro del sistema de justicia.',
    'escenarioAmenaza': 'Analiza el contexto geográfico y social donde se mueve el evaluado y la probabilidad de que el actor generador de riesgo tenga presencia efectiva allí.',
    'generadorAmenaza': 'Nivel de identificación del presunto autor de la amenaza (individualizado, identificado o estructura criminal conocida).',
    'capacidadAmenaza': 'Capacidad logística, militar, financiera o táctica del agresor para llevar a cabo el hecho lesivo anunciado.',
    'interesAmenaza': 'Grado de motivación que tiene el agresor para silenciar o afectar al evaluado debido a su aporte en la investigación penal.',
    'inminenciaAmenaza': 'Temporalidad de la amenaza. Valora si el riesgo es de ejecución inmediata o si requiere de condiciones futuras para materializarse.',
    'especificoIndividualizable': 'El riesgo debe recaer sobre un individuo o grupo determinado, no sobre la sociedad en su conjunto.',
    'concreto': 'Debe basarse en hechos reales, no en suposiciones, sospechas o temores infundados.',
    'presente': 'El riesgo debe ser actual, no una situación que ya pasó o que podría pasar en un futuro remoto.',
    'importante': 'Debe amenazar bienes jurídicos de alta relevancia como la vida, integridad personal o libertad.',
    'serio': 'Debe existir una probabilidad real de que el daño se produzca dadas las circunstancias del caso.',
    'claroDiscernible': 'La amenaza debe ser perceptible y diferenciable de los riesgos comunes de la vida cotidiana.',
    'excepcional': 'El riesgo no debe ser uno que el ciudadano esté obligado a soportar por ley o naturaleza de su oficio.',
    'proporcionalidad': 'La carga pública impuesta al evaluado debe ser desproporcionada frente a su capacidad de autoprotección.',
    'graveInminente': 'Situación donde el daño es ineludible si no se interviene de manera inmediata con medidas de protección.',
    'conductasComportamientos': 'Evalúa si el candidato sigue las recomendaciones de seguridad dadas o si se expone deliberadamente al riesgo.',
    'permanenciaZona': 'Tiempo que el evaluado pasa en el lugar donde se originan o pueden materializarse las amenazas.',
    'vulnerabilidadResidencial': 'Condiciones físicas de la vivienda y seguridad del entorno del domicilio del evaluado.',
    'vulnerabilidadLaboral': 'Nivel de exposición en el lugar de trabajo y facilidad de acceso para terceros no autorizados.',
    'vulnerabilidadDesplazamientos': 'Riesgos identificados en las rutas habituales que utiliza el evaluado para sus actividades diarias.',
    'presenciaFDG': 'Identificación de factores diferenciales (edad, etnia, discapacidad) o de género que aumenten la vulnerabilidad.',
    'vulnerabilidadAsociadaFDG': 'Cómo la pertenencia a una población específica facilita o potencia la acción del agresor.',
    'vulnerabilidadAsociadaGenero': 'Analiza si el riesgo se ve agravado por condiciones de género del evaluado.',
    'vulnerabilidadesNucleo': 'Riesgos que se extienden o son generados por los integrantes del núcleo familiar del titular.'
};

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
    const [helpModal, setHelpModal] = useState<{ show: boolean, title: string, text: string }>({ show: false, title: '', text: '' });

    const extendedData = useMemo(() => {
        const radicado = initialData?.radicado || mission?.caseRadicado;
        if (!radicado) return null;
        const caseInfo = MOCK_SAVED_CASES.find(c => c.radicado === radicado);
        const requestInfo = Object.values(MOCK_FULL_REQUESTS).find(r => r.radicado === radicado);
        return { caseInfo, requestInfo };
    }, [initialData, mission]);

    const [formData, setFormData] = useState<ITVRForm>(initialData || {
        evaluationNo: initialData?.evaluationNo || `EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        evaluationDate: initialData?.evaluationDate || '2026-02-22',
        missionNo: initialData?.missionNo || mission?.missionNo || '124974',
        caseNo: initialData?.caseNo || extendedData?.caseInfo?.caseId || '08136E',
        radicado: initialData?.radicado || mission?.caseRadicado || '20181100050765',
        evaluator: initialData?.evaluator || mission?.assignedOfficial || 'BOGOTA - ANA MARIA REYES CRUZ',
        
        realidadAmenaza: '0', individualidadAmenaza: '0', situacionAmenazado: '0', escenarioAmenaza: '0',
        generadorAmenaza: '0', capacidadAmenaza: '0', interesAmenaza: '0', inminenciaAmenaza: '0',
        especificoIndividualizable: '0', concreto: '0', presente: '0', importante: '0',
        serio: '0', claroDiscernible: '0', excepcional: '0', proporcionalidad: '0', graveInminente: '0',
        conductasComportamientos: '0', permanenciaZona: '0', vulnerabilidadResidencial: '0',
        vulnerabilidadLaboral: '0', vulnerabilidadDesplazamientos: '0', presenciaFDG: '0',
        vulnerabilidadAsociadaFDG: '0', vulnerabilidadAsociadaGenero: '0', vulnerabilidadesNucleo: '0',
        obs1: '', obs2: '', obs3: '', obs4: '', obs5: '', obs6: '', obs7: '', obs8: '',
        obs9: '', obs10: '', obs11: '', obs12: '', obs13: '', obs14: '', obs15: '', obs16: '', obs17: '',
        obs18: '', obs19: '', obs20: '', obs21: '', obs22: '', obs23: '', obs24: '', obs25: '', obs26: ''
    });

    const updateField = (field: keyof ITVRForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const calculationDetails = useMemo(() => {
        const threatFields = ['realidadAmenaza', 'individualidadAmenaza', 'situacionAmenazado', 'escenarioAmenaza', 'generadorAmenaza', 'capacidadAmenaza', 'interesAmenaza', 'inminenciaAmenaza'];
        const riskFields = ['especificoIndividualizable', 'concreto', 'presente', 'importante', 'serio', 'claroDiscernible', 'excepcional', 'proporcionalidad', 'graveInminente'];
        const vulnerabilityFields = ['conductasComportamientos', 'permanenciaZona', 'vulnerabilidadResidencial', 'vulnerabilidadLaboral', 'vulnerabilidadDesplazamientos', 'presenciaFDG', 'vulnerabilidadAsociadaFDG', 'vulnerabilidadAsociadaGenero', 'vulnerabilidadesNucleo'];

        const sumFields = (fields: string[]) => fields.reduce((sum, f) => sum + parseFloat((formData as any)[f] || '0'), 0) * 100;

        const threatScore = sumFields(threatFields);
        const riskScore = sumFields(riskFields);
        const vulnerabilityScore = sumFields(vulnerabilityFields);
        const total = threatScore + riskScore + vulnerabilityScore;

        return {
            amenaza: threatScore.toFixed(2),
            riesgo: riskScore.toFixed(2),
            vulnerabilidad: vulnerabilityScore.toFixed(2),
            total: total.toFixed(2)
        };
    }, [formData]);

    const ITVRPoint = ({ 
        id, 
        label, 
        field, 
        obsField, 
        options 
    }: { 
        id: string, 
        label: string, 
        field: keyof ITVRForm, 
        obsField: keyof ITVRForm, 
        options: { v: string, t: string }[] 
    }) => (
        <div className="space-y-4 group">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">{id}</span>
                    <label className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</label>
                    <button 
                        type="button"
                        onClick={() => setHelpModal({ show: true, title: `${id} ${label}`, text: ITVR_HELP_TEXTS[field as string] || 'Sin ayuda disponible.' })}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                        title="Ver Ayuda Técnica"
                    >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valor:</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono font-black text-xs border border-blue-100">
                        {formData[field]}
                    </span>
                </div>
            </div>
            
            <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                value={formData[field] as string} 
                onChange={e => updateField(field, e.target.value)}
                disabled={readOnly}
            >
                {options.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
            </select>
            
            <TextAreaField 
                label={`Soporte Técnico y Argumentación ${id}`} 
                value={formData[obsField] as string} 
                onChange={e => updateField(obsField, e.target.value)} 
                placeholder="Argumente detalladamente la selección del puntaje basándose en las fuentes de información..."
                className="text-[11px]"
                disabled={readOnly}
            />
            <div className="h-px bg-slate-100 w-full mt-6"></div>
        </div>
    );

    const TabButton = ({ id, label }: { id: TabType, label: string }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === id ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            {/* Modal de Ayuda Técnica */}
            {helpModal.show && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95">
                        <div className="p-8 bg-blue-600 text-white flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ayuda Técnica para Evaluador</span>
                                <h3 className="text-xl font-black uppercase tracking-tight leading-tight mt-1">{helpModal.title}</h3>
                            </div>
                            <button onClick={() => setHelpModal({ ...helpModal, show: false })} className="text-white hover:opacity-50 transition-opacity">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="p-10">
                            <p className="text-slate-600 font-medium leading-relaxed text-sm italic">
                                {helpModal.text}
                            </p>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-blue-600">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span className="text-[9px] font-black uppercase tracking-widest">Protocolo de Protección - FGN</span>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 flex justify-end">
                            <button onClick={() => setHelpModal({ ...helpModal, show: false })} className="px-10 py-3 bg-slate-900 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl">Entendido</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header del Formulario */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl mb-6 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                <img src={LOGO_URL} alt="Fiscalía" className="h-16" />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-tighter">
                        Instrumento Técnico de Valoración de Riesgo (ITVR)
                    </h1>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Matriz de Ponderación de Riesgo Institucional</p>
                </div>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl hidden md:block">
                    <span className="text-[9px] font-black uppercase block opacity-60">Consolidado Técnico</span>
                    <span className="font-mono font-black text-2xl">{calculationDetails.total}%</span>
                </div>
            </div>

            {/* Datos Informativos */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputField label="No. Evaluación" value={formData.evaluationNo} disabled className="bg-slate-50 font-bold" />
                    <InputField label="No. Misión" value={formData.missionNo} disabled className="bg-slate-50" />
                    <InputField label="No. Caso" value={formData.caseNo} disabled className="bg-slate-50" />
                    <InputField label="Radicado SPOA" value={formData.radicado} disabled className="bg-slate-50 font-mono" />
                </div>
            </div>

            {/* Tabs Navegación Matriz */}
            <div className="bg-white border-b border-slate-200 flex overflow-x-auto sticky top-0 z-40 shadow-sm rounded-t-[2rem]">
                <TabButton id="AMENAZA" label="1. Amenaza" />
                <TabButton id="RIESGO" label="2. Riesgo Específico" />
                <TabButton id="VULNERABILIDAD" label="3. Vulnerabilidad" />
            </div>

            <form onSubmit={e => { e.preventDefault(); onSaveSuccess("Valoración ITVR guardada correctamente."); }} className="space-y-8 mt-6">
                
                {activeTab === 'AMENAZA' && (
                    <div className="bg-white p-8 md:p-12 rounded-b-[2.5rem] border-x border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in slide-in-from-right-4">
                        <ITVRPoint id="1.1" label="Realidad de la Amenaza" field="realidadAmenaza" obsField="obs1" options={[{v:'0', t:'0 - Sin reportes'}, {v:'0.0328', t:'1 - No sustentada'}, {v:'0.0656', t:'2 - Sustentada por autoridades'}]} />
                        <ITVRPoint id="1.2" label="Individualidad" field="individualidadAmenaza" obsField="obs2" options={[{v:'0', t:'0 - No individualizada'}, {v:'0.1875', t:'1 - Afecta a otros'}, {v:'0.3750', t:'2 - Directa al evaluado'}]} />
                        <ITVRPoint id="1.3" label="Situación Específica" field="situacionAmenazado" obsField="obs3" options={[{v:'0', t:'0 - Sin amenazas'}, {v:'0.2343', t:'1 - No derivada de proceso'}, {v:'0.4687', t:'2 - Derivada del proceso penal'}]} />
                        <ITVRPoint id="1.4" label="Escenario" field="escenarioAmenaza" obsField="obs4" options={[{v:'0', t:'0 - Sin probabilidad'}, {v:'0.2343', t:'1 - Probabilidad baja'}, {v:'0.4687', t:'2 - Probabilidad alta'}]} />
                        <ITVRPoint id="1.5" label="Actor Generador" field="generadorAmenaza" obsField="obs5" options={[{v:'0', t:'0 - No identificado'}, {v:'0.0468', t:'1 - Estructura conocida'}, {v:'0.0093', t:'2 - Identificado e individualizado'}]} />
                        <ITVRPoint id="1.6" label="Capacidad del Actor" field="capacidadAmenaza" obsField="obs6" options={[{v:'0', t:'0 - Sin amenaza'}, {v:'0.0046', t:'1 - Capacidad Media'}, {v:'0.0093', t:'2 - Capacidad Alta'}]} />
                        <ITVRPoint id="1.7" label="Interés del Actor" field="interesAmenaza" obsField="obs7" options={[{v:'0', t:'0 - Sin interés'}, {v:'0.0093', t:'1 - Interés indirecto'}, {v:'0.0187', t:'2 - Impedir colaboración'}]} />
                        <ITVRPoint id="1.8" label="Inminencia" field="inminenciaAmenaza" obsField="obs8" options={[{v:'0', t:'0 - No inminente'}, {v:'0.0328', t:'1 - Mediano plazo'}, {v:'0.0656', t:'2 - Inmediata'}]} />
                    </div>
                )}

                {activeTab === 'RIESGO' && (
                    <div className="bg-white p-8 md:p-12 rounded-b-[2.5rem] border-x border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in slide-in-from-right-4">
                        <ITVRPoint id="2.1" label="Específico e Individualizable" field="especificoIndividualizable" obsField="obs9" options={[{v:'0', t:'Bajo'}, {v:'0.0463', t:'Medio'}, {v:'0.0694', t:'Alto'}]} />
                        <ITVRPoint id="2.2" label="Concreto" field="concreto" obsField="obs10" options={[{v:'0', t:'Bajo'}, {v:'0.0463', t:'Medio'}, {v:'0.0694', t:'Alto'}]} />
                        <ITVRPoint id="2.3" label="Presente" field="presente" obsField="obs11" options={[{v:'0', t:'Pasado'}, {v:'0.0347', t:'Incierto'}, {v:'0.0694', t:'Actual'}]} />
                        <ITVRPoint id="2.4" label="Importante" field="importante" obsField="obs12" options={[{v:'0', t:'Bajo'}, {v:'0.0277', t:'Medio'}, {v:'0.0555', t:'Alto'}]} />
                        <ITVRPoint id="2.5" label="Serio" field="serio" obsField="obs13" options={[{v:'0', t:'Bajo'}, {v:'0.0208', t:'Medio'}, {v:'0.0416', t:'Alto'}]} />
                        <ITVRPoint id="2.6" label="Claro y Discernible" field="claroDiscernible" obsField="obs14" options={[{v:'0', t:'Bajo'}, {v:'0.0347', t:'Medio'}, {v:'0.0694', t:'Alto'}]} />
                        <ITVRPoint id="2.7" label="Excepcional" field="excepcional" obsField="obs15" options={[{v:'0', t:'Mínimo'}, {v:'0.0416', t:'Extraordinario'}]} />
                        <ITVRPoint id="2.8" label="Desproporcionalidad" field="proporcionalidad" obsField="obs16" options={[{v:'0', t:'Soportable'}, {v:'0.0416', t:'Desproporcionada'}]} />
                        <ITVRPoint id="2.9" label="Grave e Inminente" field="graveInminente" obsField="obs17" options={[{v:'0', t:'No'}, {v:'0.0416', t:'Sí'}]} />
                    </div>
                )}

                {activeTab === 'VULNERABILIDAD' && (
                    <div className="bg-white p-8 md:p-12 rounded-b-[2.5rem] border-x border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in slide-in-from-right-4">
                        <ITVRPoint id="3.1" label="Conductas Autoprotección" field="conductasComportamientos" obsField="obs18" options={[{v:'0', t:'Siempre'}, {v:'0.1111', t:'A veces'}, {v:'0.2222', t:'Nunca'}]} />
                        <ITVRPoint id="3.2" label="Permanencia Zona" field="permanenciaZona" obsField="obs19" options={[{v:'0', t:'No'}, {v:'0.1111', t:'Ocasional'}, {v:'0.2222', t:'Permanente'}]} />
                        <ITVRPoint id="3.3" label="Vulnerabilidad Residencial" field="vulnerabilidadResidencial" obsField="obs20" options={[{v:'0', t:'Baja'}, {v:'0.0074', t:'Baja'}, {v:'0.0148', t:'Media'}, {v:'0.0222', t:'Alta'}]} />
                        <ITVRPoint id="3.4" label="Vulnerabilidad Laboral" field="vulnerabilidadLaboral" obsField="obs21" options={[{v:'0', t:'Baja'}, {v:'0.0222', t:'Alta'}]} />
                        <ITVRPoint id="3.5" label="Vulnerabilidad Desplazamientos" field="vulnerabilidadDesplazamientos" obsField="obs22" options={[{v:'0', t:'Baja'}, {v:'0.0148', t:'Media'}, {v:'0.0222', t:'Alta'}]} />
                        <ITVRPoint id="3.6" label="Factor Diferencial/Género" field="presenciaFDG" obsField="obs23" options={[{v:'0', t:'No'}, {v:'0.1111', t:'1 Factor'}, {v:'0.2222', t:'2+ Factores'}]} />
                        <ITVRPoint id="3.7" label="Riesgo Pob. Diferencial" field="vulnerabilidadAsociadaFDG" obsField="obs24" options={[{v:'0', t:'No'}, {v:'0.1111', t:'Bajo'}, {v:'0.2222', t:'Alto'}]} />
                        <ITVRPoint id="3.8" label="Riesgo Género" field="vulnerabilidadAsociadaGenero" obsField="obs25" options={[{v:'0', t:'No'}, {v:'0.1111', t:'Bajo'}, {v:'0.2222', t:'Alto'}]} />
                        <ITVRPoint id="3.9" label="Vulnerabilidad Familia" field="vulnerabilidadesNucleo" obsField="obs26" options={[{v:'0', t:'Baja'}, {v:'0.0074', t:'Baja'}, {v:'0.0148', t:'Media'}, {v:'0.0222', t:'Alta'}]} />
                    </div>
                )}

                {/* Panel de Resultado Final Desglosado */}
                <div className="p-10 md:p-16 rounded-[3.5rem] border-4 flex flex-col items-center gap-10 transition-all duration-500 shadow-2xl text-blue-900 bg-white border-blue-600">
                    <div className="text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-slate-900">RESULTADO TÉCNICO DE PONDERACIÓN</h2>
                        <div className="text-8xl font-mono font-black tabular-nums tracking-tighter text-blue-600">{calculationDetails.total}%</div>
                        <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-mono font-bold text-xs md:text-sm text-slate-600">
                           (Amenaza {calculationDetails.amenaza}) + (Riesgo Específico {calculationDetails.riesgo}) + (Vulnerabilidad {calculationDetails.vulnerabilidad}) = {calculationDetails.total}
                        </div>
                    </div>
                    
                    <div className="h-px w-full max-w-xl bg-slate-200"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                        <div className="p-6 rounded-3xl border-2 border-blue-100 bg-blue-50/30 text-center shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-2">Amenaza</span>
                            <div className="text-3xl font-black text-blue-900">{calculationDetails.amenaza}</div>
                            <p className="text-[8px] mt-2 font-bold text-slate-400 uppercase tracking-tighter">Puntaje Factor Externo</p>
                        </div>
                        <div className="p-6 rounded-3xl border-2 border-indigo-100 bg-indigo-50/30 text-center shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-2">Riesgo</span>
                            <div className="text-3xl font-black text-indigo-900">{calculationDetails.riesgo}</div>
                            <p className="text-[8px] mt-2 font-bold text-slate-400 uppercase tracking-tighter">Puntaje Factor Específico</p>
                        </div>
                        <div className="p-6 rounded-3xl border-2 border-emerald-100 bg-emerald-50/30 text-center shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Vulnerabilidad</span>
                            <div className="text-3xl font-black text-emerald-900">{calculationDetails.vulnerabilidad}</div>
                            <p className="text-[8px] mt-2 font-bold text-slate-400 uppercase tracking-tighter">Puntaje Factor Interno</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-6 pt-12 border-t border-slate-200">
                    <button type="button" onClick={onCancel} className="px-10 py-4 bg-white text-slate-400 font-black rounded-2xl uppercase text-[11px] tracking-widest border border-slate-200 hover:text-slate-800 hover:border-slate-800 transition-all">Descartar Cambios</button>
                    {!readOnly && (
                        <button type="submit" className="px-16 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95">
                            Finalizar y Guardar ITVR
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ITVRFormPage;
