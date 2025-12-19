
import React, { useState, useMemo } from 'react';
import { MOCK_REQUESTS, MOCK_FULL_REQUESTS } from '../constants';
import { ProtectionRequestSummary, UserRole } from '../types';

interface RequestsListPageProps {
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  userRole: UserRole;
}

type SearchType = 'docNumber' | 'nunc' | 'radicado';

const RequestsListPage: React.FC<RequestsListPageProps> = ({ onEdit, onView, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('docNumber');
  const [requests, setRequests] = useState<ProtectionRequestSummary[]>(MOCK_REQUESTS);
  
  // State to track which item is currently being processed (Radicating/Sending Email)
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; subMessage?: string }>({ show: false, message: '' });
  
  // Sorting State
  const [sortField, setSortField] = useState<keyof ProtectionRequestSummary>('requestDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Radicar Function (Only Gestor)
  const handleRadicar = (id: string) => {
    if (userRole !== 'GESTOR') return;
    setProcessingId(id); // Start loading state

    // 1. Get Details to find Fiscal Email
    const fullDetails = MOCK_FULL_REQUESTS[id];
    const fiscalEmail = fullDetails?.fiscalInstitutionalEmail || "fiscal.asignado@fiscalia.gov.co";

    // Simulate Async Process (Generating PDF + Sending Email)
    setTimeout(() => {
        // Generate a random radicado number
        const newRadicado = `FGN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-CO') + ' ' + now.toLocaleTimeString('es-CO');
        
        // Update State
        setRequests(prev => prev.map(req => 
          req.id === id 
            ? { ...req, status: 'RADICADA', radicado: newRadicado, radicationDate: formattedDate } 
            : req
        ));
        
        // Show Success Toast with Email Confirmation
        setToast({ 
            show: true, 
            message: `Radicado generado: ${newRadicado}`,
            subMessage: `Notificación enviada exitosamente al fiscal: ${fiscalEmail}`
        });
        
        setProcessingId(null); // Stop loading state

        // Hide Toast after 5 seconds
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 5000);

    }, 2000); // 2 seconds delay to simulate email sending
  };

  // Sorting Handler
  const handleSort = (field: keyof ProtectionRequestSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and Sort Logic
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(req => {
        switch (searchType) {
          case 'docNumber':
            return req.docNumber.includes(lowerTerm);
          case 'nunc':
            return req.nunc.includes(lowerTerm);
          case 'radicado':
            return req.radicado.toLowerCase().includes(lowerTerm);
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      // Handle undefined dates in sort
      if (!valA && valB) return 1;
      if (valA && !valB) return -1;
      return 0;
    });

    return result;
  }, [requests, searchTerm, searchType, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Render Sort Icon
  const SortIcon = ({ field }: { field: keyof ProtectionRequestSummary }) => {
    if (sortField !== field) return <span className="text-slate-300 ml-1">⇅</span>;
    return sortDirection === 'asc' 
      ? <span className="text-blue-600 ml-1">↑</span> 
      : <span className="text-blue-600 ml-1">↓</span>;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 animate-[slideIn_0.3s_ease-out]">
            <div className="bg-green-600 text-white px-5 py-4 rounded-lg shadow-2xl flex items-center gap-4 max-w-xl border-l-4 border-green-800">
                <div className="bg-green-700 p-2 rounded-full flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wide">Proceso Exitoso</h4>
                    <p className="text-sm font-medium mt-0.5">{toast.message}</p>
                    {toast.subMessage && (
                        <div className="mt-2 text-xs bg-green-700/50 p-2 rounded flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            {toast.subMessage}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => setToast({show: false, message: ''})} 
                    className="ml-auto text-green-200 hover:text-white p-1 hover:bg-green-700 rounded transition-colors self-start"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Protección</h1>
          <p className="text-slate-500 text-sm mt-1">
            {userRole === 'FISCAL' 
                ? 'Gestione sus solicitudes de medidas de protección.' 
                : 'Gestione la radicación de solicitudes pendientes.'}
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
          Total Registros: {filteredRequests.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
             <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Criterio de Búsqueda</label>
             <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
             >
                <option value="docNumber">Número de Documento</option>
                <option value="nunc">Número Único de Noticia (NUNC)</option>
                <option value="radicado">Radicado (Provisional)</option>
             </select>
          </div>
          <div className="flex-[2]">
             <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Término de Búsqueda</label>
             <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese el valor a buscar..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nunc')}>
                   NUNC <SortIcon field="nunc" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>
                   Estado Proceso <SortIcon field="status" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('radicado')}>
                   Radicado <SortIcon field="radicado" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('radicationDate')}>
                   Fecha Radicación <SortIcon field="radicationDate" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('docNumber')}>
                   No. Doc <SortIcon field="docNumber" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('fullName')}>
                   Nombre <SortIcon field="fullName" />
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('requestDate')}>
                   Fecha Solicitud <SortIcon field="requestDate" />
                </th>
                <th scope="col" className="px-6 py-3 text-center w-48">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => {
                  const isRadicated = item.status === 'RADICADA';
                  const isProcessing = processingId === item.id;
                  const isActive = item.isActive;
                  
                  // Role Permission Logic
                  // REQUERIMIENTO: Todos pueden visualizar si está en el listado
                  const canView = true;
                  
                  // REQUERIMIENTO: El rol fiscal puede editar SI el estado está EN PROCESO (CREADA)
                  const isRoleFiscal = userRole === 'FISCAL';
                  const isEnProceso = item.status === 'CREADA';
                  const canEdit = isRoleFiscal && isEnProceso && isActive;
                  const canRadicate = userRole === 'GESTOR' && !isRadicated && isActive;

                  return (
                    <tr key={item.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.nunc}</td>
                      
                      {/* Status Column */}
                      <td className="px-6 py-4">
                          {item.status === 'CREADA' ? (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded border border-yellow-200">
                                  EN PROCESO
                              </span>
                          ) : (
                              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded border border-green-200">
                                  RADICADA
                              </span>
                          )}
                      </td>

                      {/* Radicado Column */}
                      <td className="px-6 py-4">
                          {item.radicado ? (
                              <span className="text-blue-600 font-medium font-mono">{item.radicado}</span>
                          ) : (
                              <span className="text-slate-400 italic text-xs">Pendiente</span>
                          )}
                      </td>

                      {/* Fecha Radicación Column */}
                      <td className="px-6 py-4 text-xs">
                          {item.radicationDate ? (
                              <span className="text-slate-700">{item.radicationDate}</span>
                          ) : (
                              <span className="text-slate-300">-</span>
                          )}
                      </td>
                      
                      <td className="px-6 py-4">{item.docNumber}</td>
                      <td className="px-6 py-4">{item.fullName}</td>
                      <td className="px-6 py-4">{item.requestDate}</td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-1.5">
                           
                           {/* 1. Visualizar (Disponible para ambos roles en cualquier estado) */}
                           <button 
                              onClick={() => onView(item.id)}
                              disabled={isProcessing}
                              className={`p-1.5 rounded transition-colors border bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 ${isProcessing ? 'opacity-50' : ''}`}
                              title="Visualizar Detalles (Solo Lectura)"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                           </button>

                           {/* 2. Editar: Se muestra para el fiscal, pero solo se activa si está EN PROCESO */}
                           {isRoleFiscal && (
                             <button 
                                onClick={() => canEdit && onEdit(item.id)}
                                disabled={!canEdit || isProcessing}
                                className={`
                                  p-1.5 rounded transition-colors border 
                                  ${canEdit 
                                    ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'} 
                                  ${isProcessing ? 'animate-pulse' : ''}
                                `}
                                title={isRadicated ? "No se puede editar una solicitud ya RADICADA" : "Editar Solicitud (En Proceso)"}
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                             </button>
                           )}

                           {/* 3. Radicar (Solo para GESTOR si no está radicada) */}
                           {userRole === 'GESTOR' && (
                            <button 
                                onClick={() => canRadicate && !isProcessing && handleRadicar(item.id)}
                                disabled={!canRadicate || isProcessing}
                                className={`p-1.5 rounded transition-colors border ${!canRadicate ? 'hidden' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                                title={isProcessing ? "Enviando notificación..." : "Radicar Solicitud"}
                            >
                                {isProcessing ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                )}
                            </button>
                           )}

                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mb-2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                       <p className="font-medium">No se encontraron resultados</p>
                       <p className="text-xs mt-1">Intente con otros criterios de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredRequests.length > 0 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
               Mostrando <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> de <span className="font-bold">{filteredRequests.length}</span> registros
            </div>
            <div className="flex items-center gap-1">
               <button 
                 onClick={() => handlePageChange(currentPage - 1)}
                 disabled={currentPage === 1}
                 className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
               >
                 Anterior
               </button>
               
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded border transition-colors
                      ${currentPage === page 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}
                    `}
                  >
                    {page}
                  </button>
               ))}

               <button 
                 onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === totalPages}
                 className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
               >
                 Siguiente
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsListPage;
