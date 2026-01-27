
import React, { useState, useEffect, useMemo } from 'react';
import ProtectionFormPage from './pages/ProtectionFormPage';
import RequestsListPage from './pages/RequestsListPage';
import ProtectionCasesPage from './pages/ProtectionCasesPage';
import SavedCasesPage from './pages/SavedCasesPage';
import GeneratedMissionsPage from './pages/GeneratedMissionsPage';
import AssignedMissionsPage from './pages/AssignedMissionsPage';
import MissionInboxPage from './pages/MissionInboxPage';
import InterviewFormPage from './pages/InterviewFormPage';
import ITVRFormPage from './pages/ITVRFormPage';
import ITVRListPage from './pages/ITVRListPage'; 
import MissionDocumentPage from './pages/MissionDocumentPage';
import { ProtectionRequestForm, UserRole, ProtectionMission, ITVRForm } from './types';
import { MOCK_FULL_REQUESTS, MOCK_REQUESTS, MOCK_MISSIONS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'form' | 'list' | 'cases' | 'saved-cases' | 'missions' | 'assigned-missions' | 'mission-inbox' | 'interview-form' | 'itvr-form' | 'itvr-list' | 'mission-doc'>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isEvaluacionesOpen, setIsEvaluacionesOpen] = useState(true);
  const [isProcesosOpen, setIsProcesosOpen] = useState(true);
  
  const [userRole, setUserRole] = useState<UserRole>('FISCAL');
  
  const [editingRequest, setEditingRequest] = useState<ProtectionRequestForm | undefined>(undefined);
  const [selectedMissionForInterview, setSelectedMissionForInterview] = useState<ProtectionMission | undefined>(undefined);
  const [selectedMissionForITVR, setSelectedMissionForITVR] = useState<ProtectionMission | undefined>(undefined);
  const [selectedMissionForDoc, setSelectedMissionForDoc] = useState<ProtectionMission | undefined>(undefined);
  const [editingITVR, setEditingITVR] = useState<ITVRForm | undefined>(undefined);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  const [allMissions, setAllMissions] = useState<ProtectionMission[]>(MOCK_MISSIONS);
  const [globalToast, setGlobalToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

  useEffect(() => {
    if (globalToast.show) {
      const timer = setTimeout(() => {
        setGlobalToast({ show: false, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalToast.show]);

  const showToast = (message: string) => {
    setGlobalToast({ show: true, message });
  };

  const handleUpdateMission = (updatedMission: ProtectionMission) => {
      setAllMissions(prev => prev.map(m => m.id === updatedMission.id ? updatedMission : m));
  };

  const SidebarItem = ({ icon, label, page, indent = false }: { icon: any, label: string, page?: any, indent?: boolean }) => (
    <button 
      onClick={() => {
          if (page) {
              setCurrentPage(page);
              setIsReadOnlyMode(false);
              setEditingRequest(undefined);
              setEditingITVR(undefined);
          }
      }}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left transition-all
        ${indent ? 'pl-10 py-2.5' : ''}
        ${currentPage === page 
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
          : 'text-slate-600 hover:bg-slate-50'}
      `}
    >
      <div className={`${currentPage === page ? 'text-blue-600' : 'text-slate-400'}`}>
        {icon}
      </div>
      <span className={`font-medium ${indent ? 'text-xs' : 'text-sm'}`}>{label}</span>
    </button>
  );

  const handleStartInterview = (mission: ProtectionMission) => {
    setSelectedMissionForInterview(mission);
    setCurrentPage('interview-form');
  };

  const handleStartITVR = (mission: ProtectionMission) => {
    setSelectedMissionForITVR(mission);
    setEditingITVR(undefined);
    setIsReadOnlyMode(false);
    setCurrentPage('itvr-form');
  };

  const handleViewMission = (mission: ProtectionMission) => {
    setSelectedMissionForDoc(mission);
    setCurrentPage('mission-doc');
  };

  const handleAcceptMission = (mission: ProtectionMission) => {
    handleUpdateMission({ ...mission, status: 'ACTIVA' });
    showToast(`Orden de Trabajo ${mission.missionNo} aceptada correctamente.`);
  };

  const handleRejectMission = (mission: ProtectionMission) => {
    handleUpdateMission({ ...mission, status: 'ANULADA' });
    showToast(`Orden de Trabajo ${mission.missionNo} rechazada.`);
  };

  const handleEditITVR = (itvr: ITVRForm) => {
    setEditingITVR(itvr);
    setIsReadOnlyMode(false);
    setCurrentPage('itvr-form');
  };

  const handleViewITVR = (itvr: ITVRForm) => {
    setEditingITVR(itvr);
    setIsReadOnlyMode(true);
    setCurrentPage('itvr-form');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {globalToast.show && (
        <div className="fixed top-20 right-5 z-[100] animate-[slideIn_0.3s_ease-out]">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md border-l-4 border-blue-500">
                <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-black text-xs uppercase tracking-widest text-blue-400">Mensaje del Sistema</h4>
                    <p className="text-sm font-bold mt-0.5">{globalToast.message}</p>
                </div>
                <button onClick={() => setGlobalToast({ show: false, message: '' })} className="ml-auto text-slate-400 hover:text-white p-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center px-6 border-b border-slate-200 bg-slate-50/50">
           <div className="flex items-center gap-4">
             <img src={LOGO_URL} alt="Logo FGN" className="h-12 w-auto drop-shadow-sm" />
             <div className="flex flex-col">
                <span className="text-blue-900 font-black text-xl leading-none tracking-tighter">SIDPA</span>
                <span className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase mt-0.5">Versión 3.0</span>
             </div>
           </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          <div className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Navegación Principal</div>
          <SidebarItem page="home" label="Panel de Inicio" icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} />
          
          <div className="mt-4 px-2">
            <button onClick={() => setIsProcesosOpen(!isProcesosOpen)} className="w-full flex items-center justify-between px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                </div>
                <span className="font-bold text-sm">Trámites y Procesos</span>
              </div>
              <svg className={`transition-transform duration-200 ${isProcesosOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isProcesosOpen ? 'max-h-[300px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              {userRole === 'FISCAL' && <SidebarItem indent page="form" label="Iniciar Solicitud" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} />}
              <SidebarItem indent page="list" label="Bandeja de Solicitud" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
            </div>
          </div>
          
          {(userRole === 'GESTOR' || userRole === 'LIDER' || userRole === 'FISCAL') && (
            <div className="mt-4 px-2">
                <button onClick={() => setIsEvaluacionesOpen(!isEvaluacionesOpen)} className="w-full flex items-center justify-between px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <span className="font-bold text-sm">Evaluaciones</span>
                </div>
                <svg className={`transition-transform duration-200 ${isEvaluacionesOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isEvaluacionesOpen ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                {userRole === 'GESTOR' && (
                    <>
                    <SidebarItem indent page="cases" label="Apertura de Casos" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>} />
                    <SidebarItem indent page="saved-cases" label="Consultar casos" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
                    </>
                )}
                {(userRole === 'LIDER' || userRole === 'FISCAL') && (
                    <>
                    {userRole === 'LIDER' && <SidebarItem indent page="missions" label="Ordenes de Trabajo Pendientes" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>} />}
                    {userRole === 'LIDER' && <SidebarItem indent page="mission-inbox" label="Bandeja de Ordenes de Trabajo" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m3 16 3-3 3 3 3-3 3 3 3-3 3 3" /></svg>} />}
                    <SidebarItem indent page="itvr-list" label="ITVR" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
                    <SidebarItem indent page="assigned-missions" label="Visualizar Ordenes de Trabajo" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
                    </>
                )}
                </div>
            </div>
          )}
        </nav>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-100 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="hidden lg:flex items-center gap-4">
                <img src={LOGO_URL} alt="FGN Header" className="h-8" />
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Fiscalía General de la Nación</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    <span className="text-blue-600">SIDPA 3.0</span>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Perfil de Acceso:</label>
                <select 
                    value={userRole}
                    onChange={(e) => {
                        setUserRole(e.target.value as UserRole);
                        setCurrentPage('home');
                    }}
                    className="bg-transparent text-[11px] font-black text-slate-700 outline-none cursor-pointer uppercase"
                >
                    <option value="FISCAL">Fiscal</option>
                    <option value="GESTOR">Gestor Documental</option>
                    <option value="LIDER">Lider</option>
                </select>
             </div>
             <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                 <div className="text-right hidden md:block">
                   <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{userRole === 'FISCAL' ? 'Unidad de Conocimiento' : userRole === 'GESTOR' ? 'Oficina de Radicación' : 'Coordinación Nacional'}</div>
                   <div className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{userRole === 'FISCAL' ? 'Protección' : userRole === 'GESTOR' ? 'Correspondencia' : 'Evaluación Técnica'}</div>
                 </div>
                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-white shadow-md ${userRole === 'FISCAL' ? 'bg-blue-600' : userRole === 'GESTOR' ? 'bg-slate-800' : 'bg-indigo-600'}`}>
                   {userRole === 'FISCAL' ? 'F' : userRole === 'GESTOR' ? 'GD' : 'L'}
                 </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50">
          {currentPage === 'home' && (
             <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 max-w-2xl animate-in zoom-in-95 duration-500">
                  <div className={`h-32 w-32 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl border-4 border-white ${userRole === 'FISCAL' ? 'bg-blue-50' : userRole === 'GESTOR' ? 'bg-slate-50' : 'bg-indigo-50'}`}>
                    <img src={LOGO_URL} alt="Logo" className="h-20 drop-shadow-md" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">SIDPA 3.0</h2>
                  <p className="text-slate-500 mb-12 leading-relaxed font-medium text-lg">Sistema Institucional de la Fiscalía General de la Nación para la Gestión Digital de Medidas de Protección y Asistencia.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userRole === 'FISCAL' ? (
                        <>
                        <button onClick={() => setCurrentPage('form')} className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                           Nueva Solicitud
                        </button>
                        <button onClick={() => setCurrentPage('list')} className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                           Mis Solicitudes
                        </button>
                        </>
                    ) : userRole === 'LIDER' ? (
                        <>
                        <button onClick={() => setCurrentPage('missions')} className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                           Gestionar Ordenes de Trabajo
                        </button>
                        <button onClick={() => setCurrentPage('mission-inbox')} className="bg-blue-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 16 3-3 3 3 3-3 3 3 3-3 3 3" /></svg>
                           Bandeja de Ordenes de Trabajo
                        </button>
                        </>
                    ) : (
                        <>
                        <button onClick={() => setCurrentPage('cases')} className="bg-slate-800 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                           Apertura de Casos
                        </button>
                        <button onClick={() => setCurrentPage('list')} className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-3">
                           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                           Consultar Base
                        </button>
                        </>
                    )}
                  </div>
                </div>
             </div>
          )}
          {currentPage === 'form' && <ProtectionFormPage initialData={editingRequest} isEditing={!!editingRequest} readOnly={isReadOnlyMode} onCancel={() => setCurrentPage('list')} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('list'); }} />}
          {currentPage === 'list' && <RequestsListPage onEdit={(id) => { setEditingRequest(MOCK_FULL_REQUESTS[id]); setIsReadOnlyMode(false); setCurrentPage('form'); }} onView={(id) => { setEditingRequest(MOCK_FULL_REQUESTS[id]); setIsReadOnlyMode(true); setCurrentPage('form'); }} userRole={userRole} />}
          {currentPage === 'cases' && userRole === 'GESTOR' && <ProtectionCasesPage />}
          {currentPage === 'saved-cases' && userRole === 'GESTOR' && <SavedCasesPage />}
          {currentPage === 'missions' && userRole === 'LIDER' && <GeneratedMissionsPage missions={allMissions} onSaveSuccess={(msg, updatedM) => { showToast(msg); handleUpdateMission(updatedM); }} />}
          {currentPage === 'mission-inbox' && userRole === 'LIDER' && (
            <MissionInboxPage 
              missions={allMissions} 
              userRole={userRole}
              onStartInterview={handleStartInterview} 
              onStartITVR={handleStartITVR} 
              onViewMission={handleViewMission}
              onAcceptMission={handleAcceptMission}
              onRejectMission={handleRejectMission}
            />
          )}
          {currentPage === 'assigned-missions' && (userRole === 'LIDER' || userRole === 'FISCAL') && <AssignedMissionsPage missions={allMissions} onUpdateMission={handleUpdateMission} />}
          {currentPage === 'interview-form' && (userRole === 'LIDER' || userRole === 'FISCAL') && <InterviewFormPage mission={selectedMissionForInterview} onCancel={() => setCurrentPage('mission-inbox')} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('mission-inbox'); }} />}
          {currentPage === 'itvr-list' && (userRole === 'LIDER' || userRole === 'FISCAL') && <ITVRListPage onEdit={handleEditITVR} onView={handleViewITVR} />}
          {currentPage === 'itvr-form' && (userRole === 'LIDER' || userRole === 'FISCAL') && <ITVRFormPage initialData={editingITVR} mission={selectedMissionForITVR} onCancel={() => { if(userRole === 'FISCAL') { setCurrentPage('home') } else { setCurrentPage('itvr-list') } }} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('itvr-list'); }} readOnly={isReadOnlyMode} />}
          {currentPage === 'mission-doc' && selectedMissionForDoc && <MissionDocumentPage mission={selectedMissionForDoc} onCancel={() => setCurrentPage('mission-inbox')} />}
        </div>
      </main>
    </div>
  );
};

export default App;
