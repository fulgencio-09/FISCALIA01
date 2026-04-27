
import React, { useState, useMemo } from 'react';
import { ETARReport, UserRole, ProtectionMission, ETARCheckList } from '../types';
import ETARCheckListModal from '../components/ETARCheckListModal';

interface ETARListPageProps {
  reports: ETARReport[];
  missions: ProtectionMission[];
  userRole: UserRole;
  onViewReport: (report: ETARReport) => void;
  onUpdateReport: (report: ETARReport) => void;
  onReturnReport: (report: ETARReport, observations: string) => void;
}

const ETARListPage: React.FC<ETARListPageProps> = ({ reports, missions, userRole, onViewReport, onUpdateReport, onReturnReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportForCheckList, setSelectedReportForCheckList] = useState<ETARReport | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const mission = missions.find(m => m.id === report.missionId);
      const searchStr = `${mission?.missionNo} ${mission?.petitionerName} ${report.status}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [reports, missions, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Bandeja de Órdenes de Trabajos Pendiente
          </h1>
          <p className="text-slate-500 font-medium italic">
            Visualización y seguimiento de los Informes de Evaluación de Amenaza y Riesgo (ETAR).
          </p>
        </div>
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar por Orden o Solicitante..." 
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
                <th className="px-6 py-6">No Orden de Trabajo</th>
                <th className="px-6 py-6">Regional</th>
                <th className="px-6 py-6">No Caso</th>
                <th className="px-6 py-6">Solicitante</th>
                <th className="px-6 py-6">Estado de la Revisión de Informe</th>
                <th className="px-6 py-6">Funcionario</th>
                <th className="px-6 py-6">Vencimiento</th>
                <th className="px-6 py-6">Estado de la OT</th>
                <th className="px-6 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-slate-50 p-6 rounded-full">
                        <svg width="40" height="40" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No hay informes registrados en esta bandeja</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const mission = missions.find(m => m.id === report.missionId);
                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6 font-mono font-black text-blue-700">{mission?.missionNo}</td>
                      <td className="px-6 py-6 font-bold text-[9px] uppercase text-indigo-600">
                        {mission?.regional || 'N/A'}
                      </td>
                      <td className="px-6 py-6 font-mono text-[10px] text-slate-500">
                        {mission?.caseRadicado}
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-black text-slate-900 uppercase text-[10px]">{mission?.petitionerName}</div>
                        <div className="text-[9px] text-slate-400 font-bold">{mission?.petitionerDoc}</div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          report.status === 'BORRADOR' ? 'bg-slate-100 text-slate-500 border-slate-200' : 
                          report.status.includes('Pendiente') ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          report.status === 'VoBo revisor' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          report.status === 'Aprobado Líder' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          report.status === 'Devuelto por Inconsistencias' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                          'bg-slate-100 text-slate-500 border-slate-300'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-bold text-slate-600 text-[10px] uppercase">
                        {mission?.assignedOfficial || 'Sin asignar'}
                      </td>
                      <td className="px-6 py-6 text-[10px] font-bold text-slate-500">
                        {mission?.dueDate}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          mission?.status === 'Terminada' ? 'bg-slate-800 text-white border-slate-900' :
                          mission?.status === 'ASIGNADA' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          {mission?.status === 'FINALIZADA' ? 'Terminada' : mission?.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onViewReport(report)}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-200 transition-all"
                          >
                            Editar
                          </button>

                          {/* BOTÓN CHECK LIST - SERVIDOR */}
                          {userRole === 'SERVIDOR' && (
                            <button 
                              onClick={() => setSelectedReportForCheckList(report)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-1"
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                              Check List
                            </button>
                          )}

                          {/* BOTÓN CHECK LIST - LIDER NACIONAL (Solo si el servidor ya aprobó) */}
                          {userRole === 'LIDER' && report.evaluations?.some(e => e.evaluatorRole === 'SERVIDOR' && e.isConforme) && (
                            <button 
                              onClick={() => setSelectedReportForCheckList(report)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-1"
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                              Check List Líder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReportForCheckList && (
        <ETARCheckListModal 
          report={selectedReportForCheckList}
          userRole={userRole}
          onSave={(checkList) => {
            const updatedReport = {
              ...selectedReportForCheckList,
              evaluations: [...(selectedReportForCheckList.evaluations || []), checkList],
              status: userRole === 'SERVIDOR' ? 'VoBo revisor' : 'Aprobado Líder' as any
            };
            onUpdateReport(updatedReport);
            setSelectedReportForCheckList(null);
          }}
          onReturn={(observations) => {
            onReturnReport(selectedReportForCheckList, observations);
            setSelectedReportForCheckList(null);
          }}
          onClose={() => setSelectedReportForCheckList(null)}
        />
      )}
    </div>
  );
};

export default ETARListPage;
