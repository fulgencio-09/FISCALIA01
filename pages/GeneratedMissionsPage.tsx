
import React, { useState, useMemo } from 'react';
import { MOCK_MISSIONS, MOCK_SAVED_CASES } from '../constants';
import { ProtectionMission, ProtectionCaseForm } from '../types';

const GeneratedMissionsPage: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);
  const [associatedCase, setAssociatedCase] = useState<ProtectionCaseForm | null>(null);

  const filteredMissions = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_MISSIONS;
    const term = searchTerm.toLowerCase();
    return MOCK_MISSIONS.filter(m => 
      m.missionNo.toLowerCase().includes(term) || 
      m.petitionerName.toLowerCase().includes(term) ||
      m.caseRadicado.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleViewMission = (mission: ProtectionMission) => {
    // Intentar encontrar el caso asociado para obtener detalles completos
    const caseData = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    setSelectedMission(mission);
    setAssociatedCase(caseData || null);
    setView('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setView('LIST');
    setSelectedMission(null);
    setAssociatedCase(null);
  };

  if (view === 'DETAIL' && selectedMission) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="mb-6 flex justify-between items-center print:hidden">
            <button 
                onClick={handleBackToList}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                VOLVER AL LISTADO
            </button>
            <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                IMPRIMIR MISIÓN
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-slate-300">
            {/* Header Documento (Same as ProtectionCasesPage) */}
            <div className="bg-slate-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Misión de Trabajo</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase">Sistema de Gestión de Protección - FGN</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Orden No.</span>
                    <span className="text-2xl font-mono font-black text-blue-400">{selectedMission.missionNo}</span>
                </div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fecha de Generación</label>
                        <span className="text-sm font-bold text-slate-800">{selectedMission.creationDate}</span>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Radicado de Correspondencia</label>
                        <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{selectedMission.caseRadicado}</span>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estado Actual</label>
                        <span className="text-sm font-black text-blue-600 uppercase tracking-tight">{selectedMission.status}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Entidad Remitente</label>
                                <span className="text-sm font-semibold text-slate-700">{associatedCase?.remittingEntity || "FISCALÍA GENERAL DE LA NACIÓN"}</span>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ciudad de Origen</label>
                                <span className="text-sm font-semibold text-slate-700">{associatedCase?.requestCity || "No registrada"}</span>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tipo de Actuación</label>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-tighter">{selectedMission.type}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">Datos del Sujeto a Proteger</h4>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Nombre Completo</label>
                                <span className="text-base font-bold text-slate-900">{selectedMission.petitionerName}</span>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Identificación</label>
                                <span className="text-sm font-mono font-bold text-slate-700">No. {selectedMission.petitionerDoc}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unidad Administrativa Asignada</label>
                            <span className="text-sm font-bold text-slate-800 uppercase">{selectedMission.assignedArea}</span>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Asunto de Misión</label>
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{associatedCase?.subject || "EVALUACIÓN Y TRÁMITE DE PROTECCIÓN"}</span>
                         </div>
                    </div>

                    <div className="pt-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Instrucciones de Campo / Observaciones</label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 italic leading-relaxed">
                            {associatedCase?.observations || "Se ordena el despliegue del analista para la verificación de los hechos amenazantes descritos en el expediente oficial y la recolección de pruebas de riesgo inminente."}
                        </div>
                    </div>

                    <div className="pt-8 flex justify-between items-center border-t border-slate-100 mt-8">
                        <div>
                            <label className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">Vencimiento Términos Legales</label>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span className="text-sm font-black text-red-600 uppercase">PLAZO MÁXIMO: {selectedMission.dueDate}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="flex flex-col items-end">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${selectedMission.missionNo}`} alt="QR Validation" className="border p-1 rounded bg-white" />
                                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Validación Digital</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
                <p className="text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black">Documento Oficial - Reserva Legal - Uso Exclusivo FGN</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Misiones Generadas</h1>
          <p className="text-slate-500 text-sm mt-1">Control y seguimiento de órdenes de trabajo emitidas.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por misión, nombre o radicado..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <svg className="absolute left-3 top-2.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-bold">
            <tr>
              <th className="px-6 py-3">No. Misión</th>
              <th className="px-6 py-3">Radicado Caso</th>
              <th className="px-6 py-3">Tipo de Misión</th>
              <th className="px-6 py-3">Solicitante</th>
              <th className="px-6 py-3">Vencimiento</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMissions.map((m) => (
              <tr key={m.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{m.missionNo}</td>
                <td className="px-6 py-4 text-xs font-mono">{m.caseRadicado}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{m.type}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{m.petitionerName}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">ID: {m.petitionerDoc}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {m.dueDate}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleViewMission(m)}
                    className="p-1.5 hover:bg-slate-100 rounded text-indigo-600 transition-colors border border-transparent hover:border-indigo-100" 
                    title="Ver detalle de misión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneratedMissionsPage;
