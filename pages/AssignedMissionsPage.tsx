
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

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [regionalFilter, setRegionalFilter] = useState('');
  const [caseSearch, setCaseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const filteredMissions = useMemo(() => {
    let result = [...assignedMissionsList];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.missionNo.toLowerCase().includes(term) || 
        m.caseRadicado.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        (m.assignedOfficial && m.assignedOfficial.toLowerCase().includes(term))
      );
    }
    if (caseSearch.trim()) {
      const term = caseSearch.toLowerCase();
      result = result.filter(m => m.caseId.toLowerCase().includes(term));
    }
    if (startDate) result = result.filter(m => m.creationDate >= startDate);
    if (endDate) result = result.filter(m => m.creationDate <= endDate);
    if (regionalFilter) result = result.filter(m => m.regional === regionalFilter);
    if (statusFilter) result = result.filter(m => m.status === statusFilter);
    result.sort((a, b) => {
      const timeA = new Date(a.creationDate).getTime();
      const timeB = new Date(b.creationDate).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    return result;
  }, [assignedMissionsList, searchTerm, startDate, endDate, regionalFilter, caseSearch, statusFilter, sortOrder]);

  const handleView = (mission: any) => {
    const caseData = MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    setSelectedMission(mission);
    setAssociatedCase(caseData || null);
    setView('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const StatusBadge = ({ status }: { status: ProtectionMission['status'] }) => {
    const styles = {
        'ACTIVA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'ASIGNADA': 'bg-blue-50 text-blue-700 border-blue-200',
        'FINALIZADA': 'bg-slate-900 text-white border-slate-900',
        'ANULADA': 'bg-rose-50 text-rose-700 border-rose-200',
        'DEVUELTA': 'bg-amber-50 text-amber-700 border-amber-200',
        'PENDIENTE': 'bg-slate-100 text-slate-500 border-slate-300'
    };

    const labels: Record<string, string> = {
      'ACTIVA': 'ACTIVA',
      'ASIGNADA': 'ASIGNADA',
      'FINALIZADA': 'TERMINADA',
      'ANULADA': 'ANULADA',
      'DEVUELTA': 'DEVUELTA',
      'PENDIENTE': 'PENDIENTE'
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-widest ${styles[status]}`}>
            {labels[status] || status}
        </span>
    );
  };

  if (view === 'DETAIL' && selectedMission && associatedCase) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300 print:max-w-none print:p-0">
        <div className="mb-6 flex justify-between items-center print:hidden px-4 md:px-0">
            <button 
                onClick={() => setView('LIST')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Regresar al Listado
            </button>
            <button onClick={() => window.print()} className="bg-white border border-slate-300 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                Imprimir Orden de Trabajo
            </button>
        </div>

        <div className="bg-white p-10 border-2 border-slate-900 shadow-2xl print:shadow-none print:border-none print:p-0 font-sans text-slate-900">
            {/* Header Oficial SIDPA */}
            <div className="border border-slate-900 grid grid-cols-[1fr,2fr,1.2fr] mb-10">
                <div className="border-r border-slate-900 p-4 flex items-center justify-center bg-white">
                    <img src="https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg" alt="FGN" className="h-14 w-auto" />
                </div>
                <div className="border-r border-slate-900 flex flex-col text-center divide-y divide-slate-900">
                    <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                    <div className="p-2 text-sm font-black uppercase flex-1 flex items-center justify-center">ORDEN DE TRABAJO</div>
                </div>
                <div className="p-0 text-[8px] font-bold uppercase divide-y divide-slate-900">
                    <div className="p-2">CÓDIGO: <span className="font-black">FGN-MS01-F-03</span></div>
                    <div className="p-2">VERSIÓN: <span className="font-black">01</span></div>
                    <div className="p-2 text-right">PÁGINA 1 DE 1</div>
                </div>
            </div>

            <div className="space-y-4 text-xs">
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">FECHA:</span>
                    <span>{selectedMission.creationDate} 15:34:57</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">ORDEN DE TRABAJO No.:</span>
                    <span className="font-bold">{selectedMission.missionNo}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4 items-start">
                    <span className="font-bold uppercase leading-tight">RADICADO DE<br/>CORRESPONDENCIA:</span>
                    <div>
                       <span className="font-bold">{selectedMission.caseRadicado}</span>
                       <span className="block text-[10px] italic text-slate-500 mt-0.5">Al contestar cíte este número</span>
                    </div>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">CASO NÚMERO:</span>
                    <span>{associatedCase.caseId || "N/A"}</span>
                </div>
               
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">A SOLICITUD DE:</span>
                    <span className="uppercase">{associatedCase.remittingEntity || "TITULAR DEL CASO"}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">CIUDAD DE SOLICITUD:</span>
                    <span className="uppercase">{associatedCase.requestCity}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">TIPO DE ORDEN DE TRABAJO:</span>
                    <span className="uppercase">{selectedMission.type}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">NOMBRES:</span>
                    <span className="uppercase">{associatedCase.firstName} {associatedCase.secondName || ""}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">PRIMER APELLIDO:</span>
                    <span className="uppercase">{associatedCase.firstSurname}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">SEGUNDO APELLIDO:</span>
                    <span className="uppercase">{associatedCase.secondSurname || ""}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold leading-tight">TIPO DE DOCUMENTO DE<br/>IDENTIDAD:</span>
                    <span className="uppercase">{associatedCase.docType}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold uppercase leading-tight">DOCUMENTO DE IDENTIDAD No.:</span>
                    <span className="font-bold">{associatedCase.docNumber}</span>
                </div>
                 <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">ASIGNADO A:</span>
                    <span className="uppercase">{selectedMission.assignedOfficial || "POR DEFINIR"}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">REGIONAL ASIGNADA:</span>
                    <span className="uppercase">{selectedMission.regional || associatedCase.destinationUnit}</span>
                </div>
                <div className="grid grid-cols-[200px,1fr] gap-x-4">
                    <span className="font-bold">SECCION ASIGNADA:</span>
                    <span className="uppercase">{selectedMission.unidad || associatedCase.assignedArea || selectedMission.assignedArea}</span>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <span className="font-bold uppercase mb-4 block">INSTRUCCIONES:</span>
                    <ol className="list-decimal pl-5 space-y-2 uppercase text-[11px]">
                        <li>ENTREVISTAR AL CANDIDATO Y A LOS ADULTOS INTEGRANTES DE SU NÚCLEO FAMILIAR, SOLICITARLES ANTECEDENTES.</li>
                        <li>REALIZAR VISITA AL PROCESO Y ENTREVISTAR AL FUNCIONARIO JUDICIAL DE CONOCIMIENTO.</li>
                        <li>ESTABLECER Y VERIFICAR NIVELES DE RIESGO Y AMENAZA.</li>
                        <li>RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</li>
                    </ol>
                </div>

                <div className="mt-8 pt-4">
                    <span className="font-bold uppercase block mb-2">OBSERVACIONES:</span>
                    <div className="p-4 border border-slate-300 min-h-[80px] bg-white">
                        {selectedMission.observations || "SIN OBSERVACIONES REGISTRADAS."}
                    </div>
                </div>

                <div className="mt-8 pt-8">
                    <span className="font-black text-sm">LOS TÉRMINOS VENCEN: {selectedMission.dueDate}</span>
                </div>

                <div className="mt-20 pt-10 grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <div className="border-b border-slate-900 w-full mb-2 h-10"></div>
                        <span className="font-bold uppercase text-[10px]">FIRMA FUNCIONARIO ASIGNADO</span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedMission.missionNo}`} alt="QR" className="border p-1" />
                         <span className="text-[8px] text-slate-400">Verificación SIDPA</span>
                    </div>
                </div>
            </div>

            <div className="mt-16 border border-slate-900 grid grid-cols-[3fr,1fr,1fr] text-[8px] font-bold text-center divide-x divide-slate-900 print:mt-10">
                <div className="p-2">Documento no normalizado en el Sistema de Gestión Integral</div>
                <div className="p-2">Versión 01</div>
                <div className="p-2">2023-02-01</div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Consultar ordenes de trabajo</h1>
          <p className="text-slate-500 font-medium italic">Consulta de órdenes de trabajo en ejecución y finalizadas.</p>
        </div>
        <button onClick={() => {setSearchTerm(''); setStartDate(''); setEndDate(''); setRegionalFilter(''); setCaseSearch(''); setStatusFilter(''); setSortOrder('asc');}} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Restablecer Filtros
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-1"><InputField label="Búsqueda General" placeholder="No. Orden, Radicado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <InputField label="Número de Caso" placeholder="EJ: CASE-2024-001" value={caseSearch} onChange={(e) => setCaseSearch(e.target.value)} />
          <SelectField label="Regional" options={REGIONAL_UNITS} value={regionalFilter} onChange={(e) => setRegionalFilter(e.target.value)} />
          <SelectField label="Estado" options={['ACTIVA', 'ASIGNADA', 'FINALIZADA', 'ANULADA', 'DEVUELTA']} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          <InputField label="Desde" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <InputField label="Hasta" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <SelectField label="Orden Cronológico" options={['Desde la más antigua', 'Desde la más reciente']} value={sortOrder === 'asc' ? 'Desde la más antigua' : 'Desde la más reciente'} onChange={(e) => setSortOrder(e.target.value === 'Desde la más antigua' ? 'asc' : 'desc')} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Número Orden</th>
                <th className="px-6 py-6">Número Caso</th>
                <th className="px-6 py-6">Tipo Orden</th>
                <th className="px-6 py-6">Regional</th>
                <th className="px-6 py-6">Fecha Gen.</th>
                <th className="px-6 py-6 text-center">Fecha Asig.</th>
                <th className="px-6 py-6">Funcionario</th>
                <th className="px-6 py-6 text-center">Estado</th>
                <th className="px-6 py-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-6 font-mono font-black text-blue-700 text-xs">{m.missionNo}</td>
                    <td className="px-6 py-6 font-mono text-[10px] font-black text-indigo-600 uppercase">{m.caseId}</td>
                    <td className="px-6 py-6 text-[10px] font-black text-slate-800 uppercase leading-tight max-w-[150px]">{m.type}</td>
                    <td className="px-6 py-6 font-black text-[9px] uppercase text-indigo-500">{m.regional || '-'}</td>
                    <td className="px-6 py-6 text-[10px] font-bold text-slate-500">{m.creationDate}</td>
                    <td className="px-6 py-6 text-[10px] font-bold text-slate-500 text-center">{m.reassignmentDate || <span className="text-slate-300 italic">-</span>}</td>
                    <td className="px-6 py-6 text-[10px] font-black text-slate-700 uppercase">{m.assignedOfficial || <span className="text-slate-300 italic">PENDIENTE</span>}</td>
                    <td className="px-6 py-6 text-center"><StatusBadge status={m.status} /></td>
                    <td className="px-6 py-6">
                        <div className="flex items-center justify-center">
                             <button onClick={() => handleView(m)} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                Ver Detalle
                             </button>
                        </div>
                    </td>
                  </tr>
                ))}
                {filteredMissions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-20 text-center">
                      <div className="opacity-30 flex flex-col items-center">
                        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        <p className="mt-4 font-black uppercase text-[10px] tracking-widest">No se encontraron órdenes registradas</p>
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
