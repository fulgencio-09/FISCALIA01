
import React, { useState, useMemo } from 'react';
import { TechnicalInterviewForm } from '../types';

// Mock de Entrevistas Guardadas
const MOCK_SAVED_INTERVIEWS: Partial<TechnicalInterviewForm>[] = [
    {
        missionNumber: 'MT-2024-8842',
        caseNumber: 'CASE-2024-001',
        name1: 'PEDRO',
        surname1: 'PEREZ',
        docNumber: '79123456',
        date: '2024-11-15',
        assignedEvaluator: 'CARLOS ANDRÉS RUIZ',
        regional: 'Unidad Regional Centro Sur'
    }
];

interface InterviewListPageProps {
    onView: (interview: TechnicalInterviewForm) => void;
}

const InterviewListPage: React.FC<InterviewListPageProps> = ({ onView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
        if (!searchTerm.trim()) return MOCK_SAVED_INTERVIEWS;
        const term = searchTerm.toLowerCase();
        return MOCK_SAVED_INTERVIEWS.filter(int => 
            int.missionNumber?.toLowerCase().includes(term) ||
            int.caseNumber?.toLowerCase().includes(term) ||
            int.docNumber?.includes(term) ||
            int.name1?.toLowerCase().includes(term) ||
            int.surname1?.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Bandeja de Entrevistas Técnicas</h1>
                    <p className="text-slate-500 font-medium italic">Consulta de entrevistas finalizadas. Los registros en esta bandeja son inalterables.</p>
                </div>
                <div className="relative max-w-sm w-full">
                    <input 
                        type="text" 
                        placeholder="Buscar por Misión, Caso, Cédula..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <svg className="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" cy="21" x2="16.65" y2="16.65"/></svg>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-6">Misión No.</th>
                                <th className="px-6 py-6">Caso No.</th>
                                <th className="px-6 py-6">Candidato</th>
                                <th className="px-6 py-6">Identificación</th>
                                <th className="px-6 py-6">Fecha</th>
                                <th className="px-6 py-6">Evaluador</th>
                                <th className="px-6 py-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.map((int, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-6 font-mono font-black text-blue-700 text-xs">{int.missionNumber}</td>
                                    <td className="px-6 py-6 font-mono text-xs font-bold text-slate-500">{int.caseNumber}</td>
                                    <td className="px-6 py-6 font-black uppercase text-slate-800 text-[10px]">{int.name1} {int.surname1}</td>
                                    <td className="px-6 py-6 font-mono text-[10px]">{int.docNumber}</td>
                                    <td className="px-6 py-6 text-[10px] font-bold text-slate-500">{int.date}</td>
                                    <td className="px-6 py-6 text-[10px] font-black uppercase text-indigo-600">{int.assignedEvaluator}</td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => onView(int as any)}
                                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
                                                title="Ver Detalle Entrevista"
                                            >
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                Visualizar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredList.length === 0 && (
                    <div className="p-20 text-center opacity-30">
                        <svg className="mx-auto mb-4" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay entrevistas registradas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewListPage;
