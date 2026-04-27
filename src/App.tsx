
import React, { useState, useEffect, useMemo } from 'react';
import ProtectionFormPage from './pages/ProtectionFormPage';
import RequestsListPage from './pages/RequestsListPage';
import ProtectionCasesPage from './pages/ProtectionCasesPage';
import SavedCasesPage from './pages/SavedCasesPage';
import GeneratedMissionsPage from './pages/GeneratedMissionsPage';
import AssignedMissionsPage from './pages/AssignedMissionsPage';
import MissionInboxPage from './pages/MissionInboxPage';
import InterviewFormPage from './pages/InterviewFormPage';
import DirectivoInterviewFormPage from './pages/DirectivoInterviewFormPage';
import InterviewListPage from './pages/InterviewListPage';
import ITVRFormPage from './pages/ITVRFormPage';
import ITVRListPage from './pages/ITVRListPage'; 
import RiskAssessmentReportPage from './pages/RiskAssessmentReportPage';
import ETARListPage from './pages/ETARListPage';
import MissionDocumentPage from './pages/MissionDocumentPage';
import InterviewDocumentPage from './pages/InterviewDocumentPage';
import DirectivoInterviewDocumentPage from './pages/DirectivoInterviewDocumentPage';
import MissionDetailFormPage from './pages/MissionDetailFormPage';
import { ProtectionRequestForm, UserRole, ProtectionMission, ITVRForm, TechnicalInterviewForm, DirectivoInterviewForm, ProtectionCaseForm } from './types';
import { MOCK_FULL_REQUESTS, MOCK_REQUESTS, MOCK_MISSIONS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'form' | 'list' | 'cases' | 'saved-cases' | 'missions' | 'assigned-missions' | 'mission-inbox' | 'mission-pending-regional' | 'mission-pending-national' | 'mission-canceled' | 'mission-returned' | 'interview-form' | 'directivo-interview-form' | 'interview-list' | 'itvr-form' | 'itvr-list' | 'mission-doc' | 'interview-doc' | 'directivo-interview-doc' | 'risk-report' | 'etar-pending-tray' | 'secretaria-tecnica' | 'seccion-juridica' | 'mission-detail'>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isEvaluacionesOpen, setIsEvaluacionesOpen] = useState(true);
  const [isProcesosOpen, setIsProcesosOpen] = useState(true);
  
  const [userRole, setUserRole] = useState<UserRole>('FISCAL');
  
  const [editingRequest, setEditingRequest] = useState<ProtectionRequestForm | undefined>(undefined);
  const [selectedMissionForInterview, setSelectedMissionForInterview] = useState<ProtectionMission | undefined>(undefined);
  const [selectedMissionForITVR, setSelectedMissionForITVR] = useState<ProtectionMission | undefined>(undefined);
  const [selectedMissionForETAR, setSelectedMissionForETAR] = useState<ProtectionMission | undefined>(undefined);
  const [selectedMissionForDetail, setSelectedMissionForDetail] = useState<ProtectionMission | undefined>(undefined);
  const [editingETAR, setEditingETAR] = useState<any | undefined>(undefined);
  const [selectedMissionForDoc, setSelectedMissionForDoc] = useState<ProtectionMission | undefined>(undefined);
  const [editingITVR, setEditingITVR] = useState<ITVRForm | undefined>(undefined);
  const [editingInterview, setEditingInterview] = useState<TechnicalInterviewForm | DirectivoInterviewForm | undefined>(undefined);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);

  // Committee Modal State
  const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState(false);
  const [selectedMissionForCommittee, setSelectedMissionForCommittee] = useState<ProtectionMission | undefined>(undefined);
  const [committeeDate, setCommitteeDate] = useState('');
  const [committeeDateError, setCommitteeDateError] = useState('');
  const [isSavingCommittee, setIsSavingCommittee] = useState(false);

  const [allMissions, setAllMissions] = useState<ProtectionMission[]>(MOCK_MISSIONS);
  const [etarReports, setEtarReports] = useState<any[]>([]);
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

  const handleUpdateMissionByNo = (missionNo: string, updates: any) => {
      setAllMissions(prev => prev.map(m => m.missionNo === missionNo ? { ...m, ...updates } : m));
  };

  const handleScheduleCommittee = () => {
    if (!committeeDate) {
      setCommitteeDateError('La fecha del comité es obligatoria.');
      return;
    }

    setIsSavingCommittee(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedMissionForCommittee) {
        handleUpdateMissionByNo(selectedMissionForCommittee.missionNo, { committeeDate });
      }
      
      setIsSavingCommittee(false);
      setIsCommitteeModalOpen(false);
      showToast('La fecha del comité fue registrada correctamente.');
      
      // Simulate email notification
      console.log('ENVIANDO CORREO ELECTRÓNICO AL LÍDER DEL PROCESO...');
      console.log(`Número de OT: ${selectedMissionForCommittee?.missionNo}`);
      console.log(`Fecha del comité: ${committeeDate}`);
      console.log(`Usuario que registró la fecha: ${userRole}`);
      
      // Reset state
      setCommitteeDate('');
      setCommitteeDateError('');
      setSelectedMissionForCommittee(undefined);
    }, 1000);
  };

  const SidebarItem = ({ icon, label, page, indent = false }: { icon: any, label: string, page?: any, indent?: boolean }) => (
    <button 
      onClick={() => {
          if (page) {
              setCurrentPage(page);
              setIsReadOnlyMode(false);
              setEditingRequest(undefined);
              setEditingITVR(undefined);
              setEditingInterview(undefined);
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
    setEditingInterview(undefined);
    setIsReadOnlyMode(false);
    
    // DETECCIÓN AUTOMÁTICA DE FORMULARIO DIRECTIVO
    if (mission.type === 'Estudio de riesgo') {
      setCurrentPage('directivo-interview-form');
    } else {
      setCurrentPage('interview-form');
    }
  };

  const handleViewInterview = (interview: any) => {
    setEditingInterview(interview);
    setIsReadOnlyMode(true);
    if (interview.isDirectivo) {
        setCurrentPage('directivo-interview-doc');
    } else {
        setCurrentPage('interview-doc');
    }
  };

  const handleStartITVR = (mission: ProtectionMission) => {
    setSelectedMissionForITVR(mission);
    setEditingITVR(undefined);
    setIsReadOnlyMode(false);
    setCurrentPage('itvr-form');
  };

  const handleStartETAR = (mission: ProtectionMission) => {
    setSelectedMissionForETAR(mission);
    setCurrentPage('risk-report');
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
              {userRole === 'FISCAL' && <SidebarItem indent page="form" label="Iniciar Solicitud" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} />}
              {(userRole === 'FISCAL' || userRole === 'GESTOR') && <SidebarItem indent page="list" label="Bandeja de Solicitud" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />}
            </div>
          </div>
          
          {(userRole !== 'FISCAL') && (
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
                <div className={`overflow-hidden transition-all duration-300 ${isEvaluacionesOpen ? 'max-h-[1200px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                {userRole === 'GESTOR' && (
                    <>
                    <SidebarItem indent page="cases" label="Apertura de Casos" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg>} />
                    <SidebarItem indent page="saved-cases" label="Consultar casos" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
                    </>
                )}
                {(userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO' || userRole === 'GESTOR' || userRole === 'SERVIDOR' || userRole === 'SECRETARIA_TECNICA' || userRole === 'JURIDICA') && (
                    <>
                    {(userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO') && (
                      <>
                        {userRole === 'LIDER' && (
                          <SidebarItem indent page="mission-pending-national" label="Bandeja de Ordenes de Trabajo (Pendientes)" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>} />
                        )}
                        
                        {userRole === 'LIDER_REGIONAL' && (
                          <SidebarItem indent page="mission-pending-regional" label="Bandejas de Trabajos Pendiente" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
                        )}

                        <SidebarItem indent page="mission-inbox" label="Bandeja de Ordenes de Trabajo" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m3 16 3-3 3 3 3-3 3 3 3-3 3 3" /></svg>} />
                        
                        <SidebarItem indent page="mission-returned" label="Bandeja de Ordenes Devueltas" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>} />
                        <SidebarItem indent page="mission-canceled" label="Bandeja de Ordenes Anuladas" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>} />
                      </>
                    )}
                    {(userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO') && (
                      <SidebarItem indent page="assigned-missions" label="Consultar ordenes de trabajo" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
                    )}
                    {(userRole === 'LIDER' || userRole === 'SECRETARIA_TECNICA') && (
                      <SidebarItem indent page="secretaria-tecnica" label="Secretaría Técnica" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>} />
                    )}
                    {(userRole === 'LIDER' || userRole === 'JURIDICA') && (
                      <SidebarItem indent page="seccion-juridica" label="Sección Jurídica" icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h12"/><path d="M12 22V18"/><path d="M12 2v2"/><path d="M3 7c3 0 3 9 0 9 3 0 3-9 0-9Z"/><path d="M21 7c-3 0-3 9 0 9-3 0-3-9 0-9Z"/><path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6Z"/></svg>} />
                    )}
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
                    <option value="SERVIDOR">Servidor</option>
                    <option value="LIDER">Lider (Nacional)</option>
                    <option value="LIDER_REGIONAL">Lider Regional</option>
                    <option value="USUARIO">Usuario (Funcionario)</option>
                    <option value="SECRETARIA_TECNICA">Secretaría Técnica</option>
                    <option value="JURIDICA">Jurídica</option>
                </select>
             </div>
             <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                 <div className="text-right hidden md:block">
                   <div className="text-xs font-black text-slate-800 uppercase tracking-tight">
                     {userRole === 'FISCAL' ? 'Unidad de Conocimiento' : 
                      userRole === 'GESTOR' ? 'Oficina de Radicación' : 
                      userRole === 'SERVIDOR' ? 'Servidor de Revisión' : 
                      userRole === 'LIDER' ? 'Coordinación Nacional' : 
                      userRole === 'LIDER_REGIONAL' ? 'Coordinación Regional' : 
                      userRole === 'SECRETARIA_TECNICA' ? 'Secretaría Técnica' :
                      userRole === 'JURIDICA' ? 'Sección Jurídica' :
                      'Célula de Evaluación'}
                   </div>
                   <div className="text-[9px] text-blue-600 font-black uppercase tracking-widest">
                     {userRole === 'FISCAL' ? 'Protección' : 
                      userRole === 'GESTOR' ? 'Correspondencia' : 
                      userRole === 'SERVIDOR' ? 'Revisión Técnica' : 
                      userRole === 'SECRETARIA_TECNICA' ? 'Gestión Técnica' :
                      userRole === 'JURIDICA' ? 'Revisión Legal' :
                      'Evaluación Técnica'}
                   </div>
                 </div>
                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-white shadow-md ${
                   userRole === 'FISCAL' ? 'bg-blue-600' : 
                   userRole === 'GESTOR' ? 'bg-slate-800' : 
                   userRole === 'SERVIDOR' ? 'bg-violet-600' : 
                   userRole === 'LIDER' ? 'bg-indigo-600' : 
                   userRole === 'LIDER_REGIONAL' ? 'bg-orange-600' : 
                   userRole === 'SECRETARIA_TECNICA' ? 'bg-indigo-900' :
                   userRole === 'JURIDICA' ? 'bg-blue-900' :
                   'bg-emerald-600'}`}>
                   {userRole === 'FISCAL' ? 'F' : 
                    userRole === 'GESTOR' ? 'GD' : 
                    userRole === 'SERVIDOR' ? 'S' : 
                    userRole === 'LIDER' ? 'L' : 
                    userRole === 'LIDER_REGIONAL' ? 'LR' : 
                    userRole === 'SECRETARIA_TECNICA' ? 'ST' :
                    userRole === 'JURIDICA' ? 'J' :
                    'U'}
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
                    ) : (userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO' || userRole === 'SECRETARIA_TECNICA' || userRole === 'JURIDICA') ? (
                        <>
                        {userRole === 'LIDER' && (
                          <button onClick={() => setCurrentPage('mission-pending-national')} className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            Gestionar Ordenes
                          </button>
                        )}
                        {userRole === 'SECRETARIA_TECNICA' && (
                          <button onClick={() => setCurrentPage('secretaria-tecnica')} className="bg-indigo-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                             Secretaría Técnica
                          </button>
                        )}
                        {userRole === 'JURIDICA' && (
                          <button onClick={() => setCurrentPage('seccion-juridica')} className="bg-blue-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18h12"/><path d="M12 22V18"/><path d="M12 2v2"/><path d="M3 7c3 0 3 9 0 9 3 0 3-9 0-9Z"/><path d="M21 7c-3 0-3 9 0 9-3 0-3-9 0-9Z"/><path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6Z"/></svg>
                             Sección Jurídica
                          </button>
                        )}
                        {(userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO') && (
                          <button onClick={() => setCurrentPage('mission-inbox')} className="bg-blue-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                             <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 16 3-3 3 3 3-3 3 3 3-3 3 3" /></svg>
                             Bandeja de Ordenes
                          </button>
                        )}
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
          
          {/* Se unifica la lógica de misiones pendientes para Líder Nacional para usar GeneratedMissionsPage */}
          {currentPage === 'mission-pending-national' && userRole === 'LIDER' && (
            <GeneratedMissionsPage 
              missions={allMissions} 
              onSaveSuccess={(msg, updatedM) => { 
                showToast(msg); 
                handleUpdateMission(updatedM); 
              }} 
            />
          )}

          {(currentPage === 'mission-inbox' || currentPage === 'mission-pending-regional' || currentPage === 'mission-returned' || currentPage === 'mission-canceled') && (userRole === 'LIDER' || userRole === 'LIDER_REGIONAL' || userRole === 'USUARIO') && (
            <MissionInboxPage 
              missions={allMissions} 
              userRole={userRole}
              filterMode={
                currentPage === 'mission-pending-regional' ? 'PENDING' : 
                currentPage === 'mission-returned' ? 'RETURNED' :
                currentPage === 'mission-canceled' ? 'CANCELED' : 'WORK'
              }
              onStartInterview={handleStartInterview} 
              onStartITVR={handleStartITVR} 
              onStartETAR={handleStartETAR}
              onViewMission={handleViewMission}
              onAcceptMission={handleAcceptMission}
              onRejectMission={handleRejectMission}
              onUpdateMission={handleUpdateMission}
            />
          )}

          {currentPage === 'assigned-missions' && (userRole !== 'GESTOR') && <AssignedMissionsPage missions={allMissions} onUpdateMission={handleUpdateMission} />}
          {currentPage === 'interview-form' && (userRole === 'USUARIO' || userRole === 'FISCAL') && <InterviewFormPage mission={selectedMissionForInterview} initialData={editingInterview as TechnicalInterviewForm} onCancel={() => { if(userRole === 'FISCAL') { setCurrentPage('home') } else { setCurrentPage('interview-list') } }} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('interview-list'); }} readOnly={isReadOnlyMode} />}
          {currentPage === 'directivo-interview-form' && (userRole === 'USUARIO' || userRole === 'FISCAL') && <DirectivoInterviewFormPage mission={selectedMissionForInterview} initialData={editingInterview as DirectivoInterviewForm} onCancel={() => { if(userRole === 'FISCAL') { setCurrentPage('home') } else { setCurrentPage('interview-list') } }} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('interview-list'); }} readOnly={isReadOnlyMode} />}
          {currentPage === 'interview-list' && (userRole !== 'GESTOR') && <InterviewListPage onView={handleViewInterview} />}
          {currentPage === 'itvr-list' && (userRole !== 'GESTOR') && <ITVRListPage onEdit={handleEditITVR} onView={handleViewITVR} />}
          {currentPage === 'risk-report' && selectedMissionForETAR && (
            <RiskAssessmentReportPage 
              mission={selectedMissionForETAR}
              initialData={editingETAR}
              readOnly={isReadOnlyMode}
              onSave={(report) => {
                if (editingETAR) {
                  setEtarReports(prev => prev.map(r => r.id === report.id ? report : r));
                  showToast('Informe de Evaluación actualizado correctamente.');
                } else {
                  setEtarReports(prev => [...prev, report]);
                  showToast('Informe de Evaluación guardado correctamente.');
                }
                setEditingETAR(undefined);
                setCurrentPage('etar-pending-tray');
              }}
              onCancel={() => {
                setEditingETAR(undefined);
                setCurrentPage('mission-inbox');
              }}
            />
          )}

          {currentPage === 'etar-pending-tray' && (
            <ETARListPage 
              reports={etarReports}
              missions={allMissions}
              userRole={userRole}
              onViewReport={(report) => {
                const mission = allMissions.find(m => m.id === report.missionId);
                if (mission) {
                  setSelectedMissionForETAR(mission);
                  setEditingETAR(report);
                  setCurrentPage('risk-report');
                  // If the user clicked "Editar", we should probably allow editing.
                  // For now, let's assume if they are in the pending tray, they might want to edit or view.
                  // The button label was changed to "Editar" by the user.
                  setIsReadOnlyMode(false); 
                }
              }}
              onUpdateReport={(updatedReport) => {
                setEtarReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
                showToast('Evaluación de Check List guardada correctamente.');
              }}
              onReturnReport={(report, observations) => {
                const updatedReport = {
                  ...report,
                  status: 'Devuelto por Inconsistencias' as any,
                  evaluations: [...(report.evaluations || []), {
                    id: Math.random().toString(36).substr(2, 9),
                    reportId: report.id,
                    evaluatorRole: userRole,
                    evaluatorName: userRole === 'SERVIDOR' ? 'Servidor' : 'Líder Nacional',
                    date: new Date().toISOString(),
                    isConforme: false,
                    observations,
                    items: []
                  }]
                };
                setEtarReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
                showToast('Informe devuelto al funcionario por inconsistencias.');
              }}
            />
          )}
          {currentPage === 'itvr-form' && (userRole !== 'GESTOR') && <ITVRFormPage initialData={editingITVR} mission={selectedMissionForITVR} onCancel={() => { if(userRole === 'FISCAL') { setCurrentPage('home') } else { setCurrentPage('itvr-list') } }} onSaveSuccess={(msg) => { showToast(msg); setCurrentPage('itvr-list'); }} readOnly={isReadOnlyMode} />}
          {currentPage === 'mission-doc' && selectedMissionForDoc && <MissionDocumentPage mission={selectedMissionForDoc} onCancel={() => {
              if (userRole === 'LIDER_REGIONAL' && selectedMissionForDoc.status === 'ASIGNADA') {
                setCurrentPage('mission-pending-regional');
              } else if (selectedMissionForDoc.status === 'ANULADA') {
                setCurrentPage('mission-canceled');
              } else if (selectedMissionForDoc.status === 'DEVUELTA') {
                setCurrentPage('mission-returned');
              } else {
                setCurrentPage('mission-inbox');
              }
          }} />}
          {currentPage === 'interview-doc' && editingInterview && <InterviewDocumentPage interview={editingInterview as TechnicalInterviewForm} onCancel={() => setCurrentPage('interview-list')} />}
          {currentPage === 'directivo-interview-doc' && editingInterview && <DirectivoInterviewDocumentPage interview={editingInterview as DirectivoInterviewForm} onCancel={() => setCurrentPage('interview-list')} />}
          
          {currentPage === 'mission-detail' && selectedMissionForDetail && (
            <MissionDetailFormPage 
              initialData={{
                radicado: selectedMissionForDetail.caseRadicado,
                missionNo: selectedMissionForDetail.missionNo,
                missionType: selectedMissionForDetail.type,
                regional: selectedMissionForDetail.regional,
                assignedArea: selectedMissionForDetail.assignedArea,
                dueDate: selectedMissionForDetail.dueDate,
                radicationDate: selectedMissionForDetail.creationDate,
                firstName: selectedMissionForDetail.petitionerName.split(' ')[0],
                firstSurname: selectedMissionForDetail.petitionerName.split(' ').slice(-2, -1)[0] || '',
                docNumber: selectedMissionForDetail.petitionerDoc,
                committeeDate: selectedMissionForDetail.committeeDate
              }} 
              onCancel={() => {
                // Return to the tray we came from
                if (userRole === 'SERVIDOR') {
                   setCurrentPage('etar-pending-tray');
                } else if (userRole === 'JURIDICA') {
                   setCurrentPage('seccion-juridica');
                } else {
                   // Default to secretaria-tecnica for now as a heuristic
                   setCurrentPage('secretaria-tecnica');
                }
              }} 
            />
          )}
          
          {currentPage === 'secretaria-tecnica' && (
            <div className="p-8">
              <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Secretaría Técnica</h2>
                    <p className="text-slate-500 mt-1 font-medium">Gestión y seguimiento de trámites ante la Secretaría Técnica.</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border border-indigo-100">
                    {allMissions.length} Trámites en Proceso
                  </div>
                </div>

                <div className="overflow-x-auto -mx-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-y border-slate-100">
                        <th className="px-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de Caso</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de OT</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la OT</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional</th>
                        <th className="px-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {allMissions.map((mission) => (
                        <tr key={mission.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-12 py-6">
                            <div className="font-black text-slate-900 text-sm tracking-tight">{mission.caseRadicado}</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-600 text-xs">{mission.missionNo}</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-800 text-xs uppercase tracking-tight">Revisar y recomendar</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                              <span className="text-xs font-bold text-slate-500 uppercase">{mission.regional || 'Nivel Central'}</span>
                            </div>
                          </td>
                          <td className="px-12 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {userRole === 'SECRETARIA_TECNICA' && (
                                <button 
                                  onClick={() => {
                                    setSelectedMissionForCommittee(mission);
                                    setCommitteeDate(mission.committeeDate || '');
                                    setIsCommitteeModalOpen(true);
                                  }}
                                  className={`${mission.committeeDate ? 'bg-emerald-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:opacity-90 transition-all shadow-sm flex items-center gap-1`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                  {mission.committeeDate ? 'Comité Programado' : 'Programar Comité'}
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedMissionForDetail(mission);
                                  setCurrentPage('mission-detail');
                                }}
                                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white hover:border-black transition-all shadow-sm"
                              >
                                Ver Detalle
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'seccion-juridica' && (
            <div className="p-8">
              <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sección Jurídica</h2>
                    <p className="text-slate-500 mt-1 font-medium">Bandeja de revisión legal y jurídica para los casos de protección.</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border border-blue-100">
                    {allMissions.length} Expedientes Jurídicos
                  </div>
                </div>

                <div className="overflow-x-auto -mx-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-y border-slate-100">
                        <th className="px-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de Caso</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Número de OT</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la OT</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional</th>
                        <th className="px-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {allMissions.map((mission) => (
                        <tr key={mission.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-12 py-6">
                            <div className="font-black text-slate-900 text-sm tracking-tight">{mission.caseRadicado}</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-600 text-xs">{mission.missionNo}</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="font-bold text-slate-800 text-xs uppercase tracking-tight">Elaborar acto administrativo</div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                              <span className="text-xs font-bold text-slate-500 uppercase">{mission.regional || 'Nivel Central'}</span>
                            </div>
                          </td>
                          <td className="px-12 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedMissionForDetail(mission);
                                  setCurrentPage('mission-detail');
                                }}
                                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white hover:border-black transition-all shadow-sm"
                              >
                                Ver Detalle
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Programar Comité */}
      {isCommitteeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                {selectedMissionForCommittee?.committeeDate ? 'Detalle de Comité' : 'Programar Comité'}
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {selectedMissionForCommittee?.committeeDate 
                  ? 'La fecha del comité ya ha sido registrada y se encuentra en modo lectura.' 
                  : 'Seleccione la fecha para la sesión del comité técnico.'}
              </p>
              {selectedMissionForCommittee && (
                <div className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  OT: {selectedMissionForCommittee.missionNo}
                </div>
              )}
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Fecha del Comité *</label>
                <input 
                  type="date" 
                  value={committeeDate}
                  readOnly={!!selectedMissionForCommittee?.committeeDate}
                  onChange={(e) => {
                    setCommitteeDate(e.target.value);
                    if (e.target.value) setCommitteeDateError('');
                  }}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-bold text-slate-700 ${
                    committeeDateError ? 'border-red-500 ring-2 ring-red-100' : 
                    selectedMissionForCommittee?.committeeDate ? 'border-slate-100 bg-slate-100/50 cursor-not-allowed' :
                    'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50'
                  }`}
                />
                {committeeDateError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2">{committeeDateError}</p>}
                {selectedMissionForCommittee?.committeeDate && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Fecha Registrada Correctamente</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => {
                  setIsCommitteeModalOpen(false);
                  setCommitteeDateError('');
                  setCommitteeDate('');
                  setSelectedMissionForCommittee(undefined);
                }}
                className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
              >
                {selectedMissionForCommittee?.committeeDate ? 'Cerrar' : 'Cancelar'}
              </button>
              {!selectedMissionForCommittee?.committeeDate && (
                <button 
                  onClick={handleScheduleCommittee}
                  disabled={isSavingCommittee}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSavingCommittee ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Guardando...
                    </>
                  ) : 'Guardar Fecha'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
