
import React, { useState, useMemo } from 'react';
import { MOCK_SAVED_CASES, REGIONAL_UNITS } from '../constants';
import { ProtectionMission, ProtectionCaseForm } from '../types';
import { InputField, SelectField } from '../components/FormComponents';

interface AssignedMissionsPageProps {
  missions: ProtectionMission[];
  onUpdateMission: (mission: ProtectionMission) => void;
}

const AssignedMissionsPage: React.FC<AssignedMissionsPageProps> = ({ missions }) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedMission, setSelectedMission] = useState<ProtectionMission | null>(null);
  const [associatedCase, setAssociatedCase] = useState<ProtectionCaseForm | null>(null);

  // Estados para Filtros Avanzados
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [regionalFilter, setRegionalFilter] = useState('');
  const [caseSearch, setCaseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Por defecto de más antigua a más nueva

  // Preparación de la lista base (unión con datos del caso)
  const assignedMissionsList = useMemo(() => {
    const casesMap = new Map(MOCK_SAVED_CASES.map(c => [c.radicado, c]));
    return missions
      .filter(m => m.status !== 'PENDIENTE')
      .map(m => {
        const caseData = casesMap.get(m.caseRadicado);
        return {
          ...m,
          subject: caseData?.subject || "EVALUACIÓN Y TRÁMITE DE PROTECCIÓN",
          caseId: caseData?.caseId || "N/A"
        };
      });
  }, [missions]);

  // Lógica de Filtrado y Ordenamiento
  const filteredMissions = useMemo(() => {
    let result = [...assignedMissionsList];

    // Búsqueda General (No. Misión, Radicado, Asunto, Funcionario)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.missionNo.toLowerCase().includes(term) || 
        m.caseRadicado.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        (m.assignedOfficial && m.assignedOfficial.toLowerCase().includes(term))
      );
    }

    // Búsqueda por No. de Caso
    if (caseSearch.trim()) {
      const term = caseSearch.toLowerCase();
      result = result.filter(m => m.caseId.toLowerCase().includes(term));
    }

    // Filtro por Rango de Fechas (sobre creationDate)
    if (startDate) {
      result = result.filter(m => m.creationDate >= startDate);
    }
    if (endDate) {
      result = result.filter(m => m.creationDate <= endDate);
    }

    // Filtro por Regional
    if (regionalFilter) {
      result = result.filter(m => m.regional === regionalFilter);
    }

    // Filtro por Estado
    if (statusFilter) {
      result = result.filter(m => m.status === statusFilter);
    }

    // Ordenamiento Cronológico (Más antiguas primero o viceversa)
    result.sort((a, b) => {
      const timeA = new Date(a.creationDate).getTime();
      const timeB = new Date(b.creationDate).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }, [assignedMissionsList, searchTerm, startDate, endDate, regionalFilter, caseSearch, statusFilter, sortOrder]);

  const StatusBadge = ({ status }: { status: ProtectionMission['status'] }) => {
    const styles = {
        'ACTIVA': 'bg-blue-50 text-blue-700 border-blue-200',
        'ASIGNADA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'FINALIZADA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'ANULADA': 'bg-slate-100 text-slate-500 border-slate-300',
        'PENDIENTE': 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${styles[status]}`}>
            {status}
        </span>
    );
  };

  const handleView = (mission: any) => {
    const caseData = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    setSelectedMission(mission);
    setAssociatedCase(caseData || null);
    setView('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setRegionalFilter('');
    setCaseSearch('');
    setStatusFilter('');
    setSortOrder('asc');
  };

  if (view === 'DETAIL' && selectedMission && associatedCase) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="mb-6 flex justify-between items-center print:hidden">
            <button 
                onClick={() => setView('LIST')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Regresar al Listado
            </button>
            <button 
                onClick={() => window.print()}
                className="bg-white border border-slate-300 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm"
            >
                Imprimir Misión
            </button>
        </div>

        <div className="bg-white border-2 border-slate-900 shadow-2xl overflow-hidden print:border-none print:shadow-none mb-10">
            <div className="p-8 border-b-2 border-slate-900 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png" alt="FGN" className="h-16" />
                    <div>
                        <h2 className="text-base font-black uppercase tracking-tight">Fiscalía General de la Nación</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dirección de Protección y Asistencia</p>
                    </div>
                </div>
                <div className="text-right border-l-2 border-slate-900 pl-8">
                    <span className="text-[10px] font-black text-slate-400 block tracking-widest uppercase mb-1">Orden de Misión</span>
                    <span className="text-2xl font-mono font-black text-blue-700">{selectedMission.missionNo}</span>
                </div>
            </div>

            <div className="p-10 md:p-14 space-y-12">
                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        I. Identificación de la Misión y Estado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputField label="Número de Radicado" value={selectedMission.caseRadicado} disabled className="bg-slate-50 font-mono" />
                        <InputField label="Número de Caso" value={associatedCase.caseId || 'N/A'} disabled className="bg-slate-50 font-mono" />
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-slate-700 mb-1">Estado de Gestión</label>
                            <div className="h-10 flex items-center">
                                <StatusBadge status={selectedMission.status} />
                            </div>
                        </div>
                        <InputField label="Fecha de Generación" value={selectedMission.creationDate} disabled className="bg-slate-50" />
                        <InputField label="Asignado a Área" value={selectedMission.assignedArea} disabled className="bg-slate-50 uppercase" />
                        <InputField label="Vencimiento de Términos" value={selectedMission.dueDate} disabled className="bg-slate-50 text-red-600 font-bold" />
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        II. Datos del Ciudadano Titular
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2">
                            <InputField label="Nombre Completo del Titular" value={`${associatedCase.firstName} ${associatedCase.secondName || ''} ${associatedCase.firstSurname} ${associatedCase.secondSurname || ''}`} disabled className="bg-slate-50 font-bold uppercase" />
                        </div>
                        <InputField label="Tipo Documento" value={associatedCase.docType} disabled className="bg-slate-50" />
                        <InputField label="No. Documento" value={associatedCase.docNumber} disabled className="bg-slate-50 font-mono" />
                    </div>
                </section>

                <section className="bg-blue-50/40 p-10 rounded-[2.5rem] border-2 border-blue-100">
                    <h3 className="text-[11px] font-black uppercase text-blue-900 mb-8 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        III. Información de Asignación y Operativa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <InputField label="Funcionario Responsable" value={selectedMission.assignedOfficial || 'PENDIENTE DE ASIGNACIÓN'} disabled className="bg-white font-bold text-blue-900" />
                        <InputField label="Regional / Unidad" value={selectedMission.regional || 'N/A'} disabled className="bg-white font-bold" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Instrucciones y Observaciones Generales</label>
                        <div className="p-5 bg-white rounded-2xl border border-blue-100 text-sm text-slate-600 italic leading-relaxed shadow-sm">
                            {selectedMission.observations || "No se registran observaciones adicionales para esta misión de trabajo."}
                        </div>
                    </div>
                </section>

                <div className="pt-10 flex justify-between items-end border-t-2 border-slate-100">
                    <div className="w-64 border-t border-slate-300 pt-2 text-center">
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 italic">Validación Digital de Autoridad</p>
                         <p className="text-[10px] font-black uppercase text-slate-900">{selectedMission.assignedOfficial || "SISTEMA DE GESTIÓN"}</p>
                    </div>
                    <div className="text-right">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedMission.missionNo}`} alt="QR" className="inline-block border-2 border-slate-900 p-1 rounded bg-white shadow-sm" />
                         <p className="text-[8px] font-black text-slate-400 mt-2 uppercase">Verificación Electrónica</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 flex justify-end print:hidden">
                <button 
                    onClick={() => setView('LIST')}
                    className="px-14 py-3 bg-white text-slate-900 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                >
                    Cerrar Visualización
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Visualizar Misiones</h1>
          <p className="text-slate-500 font-medium italic">Consulta de misiones en ejecución y finalizadas bajo custodia de la Dirección de Protección.</p>
        </div>
        <button 
          onClick={resetFilters}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Restablecer Filtros
        </button>
      </div>

      {/* Panel de Filtros Avanzados */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-1">
            <InputField 
              label="Búsqueda General" 
              placeholder="No. Misión, Radicado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <InputField 
            label="Número de Caso" 
            placeholder="EJ: CASE-2024-001" 
            value={caseSearch}
            onChange={(e) => setCaseSearch(e.target.value)}
          />
          <SelectField 
            label="Regional" 
            options={REGIONAL_UNITS} 
            value={regionalFilter}
            onChange={(e) => setRegionalFilter(e.target.value)}
          />
          <SelectField 
            label="Estado" 
            options={['ACTIVA', 'ASIGNADA', 'FINALIZADA', 'ANULADA']} 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <InputField 
            label="Desde" 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <InputField 
            label="Hasta" 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <SelectField 
            label="Orden Cronológico" 
            options={['Desde la más antigua', 'Desde la más reciente']} 
            value={sortOrder === 'asc' ? 'Desde la más antigua' : 'Desde la más reciente'}
            onChange={(e) => setSortOrder(e.target.value === 'Desde la más antigua' ? 'asc' : 'desc')}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Fecha Generación</th>
                <th className="px-8 py-6">Número Misión</th>
                <th className="px-8 py-6">Asunto</th>
                <th className="px-8 py-6">Radicado</th>
                <th className="px-8 py-6">No. Caso</th>
                <th className="px-8 py-6">Funcionario Responsable</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.length > 0 ? (
                filteredMissions.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{m.creationDate}</td>
                    <td className="px-8 py-6 font-mono font-black text-blue-700 text-sm">{m.missionNo}</td>
                    <td className="px-8 py-6 text-[11px] font-black text-slate-900 uppercase leading-tight max-w-[180px]">{m.subject}</td>
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">{m.caseRadicado}</td>
                    <td className="px-8 py-6 font-mono text-xs font-black text-indigo-600">{m.caseId}</td>
                    <td className="px-8 py-6 font-bold text-slate-700 text-[10px] uppercase">{m.assignedOfficial || 'POR ASIGNAR'}</td>
                    <td className="px-8 py-6 text-center">
                        <StatusBadge status={m.status} />
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center justify-center">
                             <button 
                                onClick={() => handleView(m)}
                                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm"
                                title="Visualizar Misión"
                             >
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                Visualizar
                             </button>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={8} className="px-8 py-20 text-center opacity-30">
                        <div className="flex flex-col items-center gap-4">
                            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron misiones con los criterios seleccionados</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedMissionsPage;
