
import React, { useState, useMemo } from 'react';
import { ITVRForm } from '../types';

// Mock de ITVRs guardados actualizado con nuevos campos
const MOCK_SAVED_ITVRS: ITVRForm[] = [
    {
        evaluationNo: 'EV-2024-0015',
        evaluationDate: '2024-10-25',
        missionNo: 'MT-2024-8842',
        caseNo: '08136E',
        radicado: '20181100050765',
        evaluator: 'BOGOTA - ANA MARIA REYES CRUZ',
        realidadAmenaza: '65625000',
        obs1: 'Se confirma amenaza mediante panfletos de la estructura criminal local.',
        individualidadAmenaza: '037500000',
        obs2: 'Dirigida explícitamente al fiscal de conocimiento.',
        situacionAmenazado: '46875000',
        obs3: 'Derivada de la investigación contra el Clan del Golfo.',
        escenarioAmenaza: '46875000',
        obs4: 'Zona de alta influencia del grupo armado.',
        generadorAmenaza: '9375000',
        obs5: 'Identificado alias "Mortero".',
        capacidadAmenaza: '9375000',
        obs6: 'Estructura militar organizada.',
        interesAmenaza: '18750000',
        obs7: 'Busca impedir el juicio oral.',
        inminenciaAmenaza: '65625000',
        obs8: 'Información de inteligencia sobre plan pistola.',
        especificoIndividualizable: '69444444',
        obs9: 'Puntual contra el funcionario.',
        concreto: '069444444',
        obs10: 'Hechos verificables.',
        presente: '69444444',
        obs11: 'Amenazas ocurridas la semana pasada.',
        importante: '55555556',
        obs12: 'Afecta la vida e integridad.',
        serio: '41666667',
        obs13: 'Alta probabilidad.',
        claroDiscernible: '69444444',
        obs14: 'Datos precisos.',
        excepcional: '41666667',
        obs15: 'Carga extraordinaria.',
        proporcionalidad: '41666667',
        obs16: 'Desventaja evidente.',
        graveInminente: '41666667',
        obs17: 'Riesgo inminente.',
        conductasComportamientos: '0',
        obs18: 'Aplica autoprotección.',
        permanenciaZona: '22222222',
        obs19: 'Labora en la zona.',
        vulnerabilidadResidencial: '14814815',
        obs20: 'Seguridad media.',
        vulnerabilidadLaboral: '14814815',
        obs21: 'Edificio fiscal con seguridad.',
        vulnerabilidadDesplazamientos: '22222222',
        obs22: 'Rutas críticas.',
        presenciaFDG: '11111111',
        obs23: 'Padre cabeza de familia.',
        vulnerabilidadAsociadaFDG: '0',
        obs24: 'No aplica.',
        vulnerabilidadAsociadaGenero: '0',
        obs25: 'No aplica.',
        vulnerabilidadesNucleo: '14814815',
        obs26: 'Hijos menores de edad.'
    }
];

interface ITVRListPageProps {
    onEdit: (itvr: ITVRForm) => void;
    onView: (itvr: ITVRForm) => void;
}

const ITVRListPage: React.FC<ITVRListPageProps> = ({ onEdit, onView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
        if (!searchTerm.trim()) return MOCK_SAVED_ITVRS;
        const term = searchTerm.toLowerCase();
        return MOCK_SAVED_ITVRS.filter(itvr => 
            itvr.missionNo.toLowerCase().includes(term) ||
            itvr.evaluationNo.toLowerCase().includes(term) ||
            itvr.radicado.toLowerCase().includes(term) ||
            itvr.caseNo.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    // Función para calcular puntaje de demostración en el listado
    const calculateScore = (itvr: ITVRForm) => {
        const fields = [
            'realidadAmenaza', 'individualidadAmenaza', 'situacionAmenazado', 'escenarioAmenaza', 'generadorAmenaza', 'capacidadAmenaza', 'interesAmenaza', 'inminenciaAmenaza',
            'especificoIndividualizable', 'concreto', 'presente', 'importante', 'serio', 'claroDiscernible', 'excepcional', 'proporcionalidad', 'graveInminente',
            'conductasComportamientos', 'permanenciaZona', 'vulnerabilidadResidencial', 'vulnerabilidadLaboral', 'vulnerabilidadDesplazamientos', 'presenciaFDG', 'vulnerabilidadAsociadaFDG', 'vulnerabilidadAsociadaGenero', 'vulnerabilidadesNucleo'
        ];
        let sum = 0;
        fields.forEach(f => sum += parseInt((itvr as any)[f] || '0'));
        return Math.min(100, sum / 10000000);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Historial de Matrices ITVR</h1>
                    <p className="text-slate-500 font-medium italic">Gestión de Instrumentos Técnicos de Valoración de Riesgo registrados.</p>
                </div>
                <div className="relative max-w-sm w-full">
                    <input 
                        type="text" 
                        placeholder="Buscar por Evaluación, Misión o Caso..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <svg className="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-6">No. Evaluación</th>
                                <th className="px-6 py-6">No. Misión</th>
                                <th className="px-6 py-6">No. Caso</th>
                                <th className="px-6 py-6">Fecha Evaluación</th>
                                <th className="px-6 py-6 text-center">Calificación Riesgo</th>
                                <th className="px-6 py-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.map((itvr, idx) => {
                                const score = calculateScore(itvr);
                                let level = 'ORDINARIO';
                                let color = 'bg-blue-50 text-blue-700 border-blue-100';
                                if (score >= 90) { level = 'EXTREMO'; color = 'bg-red-50 text-red-700 border-red-100'; }
                                else if (score >= 50) { level = 'EXTRAORDINARIO'; color = 'bg-orange-50 text-orange-700 border-orange-100'; }

                                return (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="font-mono font-black text-indigo-700 text-[11px] bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 inline-block">
                                                {itvr.evaluationNo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="font-mono font-bold text-slate-700 text-xs">{itvr.missionNo}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="font-mono font-bold text-slate-500 text-xs">{itvr.caseNo}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-[11px] font-bold text-slate-600">{itvr.evaluationDate}</div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="font-mono font-black text-sm">{score.toFixed(2)}%</div>
                                                <span className={`px-3 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-widest ${color}`}>
                                                    {level}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => onView(itvr)}
                                                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"
                                                    title="Visualizar e Imprimir Matriz"
                                                >
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => onEdit(itvr)}
                                                    className="p-2.5 text-slate-700 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl transition-all border border-slate-200 shadow-sm"
                                                    title="Editar Valoración Técnica"
                                                >
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredList.length === 0 && (
                    <div className="p-20 text-center">
                        <svg className="mx-auto text-slate-200 mb-4" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No se encontraron valoraciones técnicas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ITVRListPage;
