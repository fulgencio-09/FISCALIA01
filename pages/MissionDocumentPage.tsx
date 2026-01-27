
import React, { useMemo } from 'react';
import { ProtectionMission } from '../types';
import { MOCK_SAVED_CASES } from '../constants';

interface MissionDocumentPageProps {
    mission: ProtectionMission;
    onCancel: () => void;
}

const MissionDocumentPage: React.FC<MissionDocumentPageProps> = ({ mission, onCancel }) => {
    const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

    const associatedCase = useMemo(() => {
        return MOCK_SAVED_CASES.find(c => c.radicado === mission.caseRadicado);
    }, [mission]);

    return (
        <div className="max-w-4xl mx-auto p-0 md:p-10 animate-in fade-in duration-500 print:p-0">
            {/* Controles de Vista */}
            <div className="mb-6 flex justify-between items-center print:hidden px-4 md:px-0">
                <button 
                    onClick={onCancel}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Volver a la Bandeja
                </button>
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all flex items-center gap-2">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>
                    Imprimir Misión de Trabajo
                </button>
            </div>

            {/* DOCUMENTO - PÁGINA 1 */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 print:border-none print:shadow-none print:p-0 relative min-h-[1056px] flex flex-col">
                
                {/* Header Oficial FGN */}
                <div className="border border-black grid grid-cols-[1.2fr,2.5fr,1.3fr] mb-10">
                    <div className="border-r border-black p-4 flex items-center justify-center bg-white">
                        <img src={LOGO_URL} alt="Logo FGN" className="h-14 w-auto" />
                    </div>
                    <div className="border-r border-black flex flex-col text-center divide-y divide-black">
                        <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                        <div className="p-2 text-[14px] font-black uppercase flex-1 flex items-center justify-center tracking-tight">MISIÓN DE TRABAJO</div>
                    </div>
                    <div className="p-0 text-[8px] font-bold uppercase divide-y divide-black">
                        <div className="p-2 h-1/3"></div>
                        <div className="p-2 h-1/3"></div>
                        <div className="p-2 h-1/3"></div>
                    </div>
                </div>

                <div className="flex-1 space-y-6 text-[12px] leading-relaxed">
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">FECHA:</span>
                        <span>{mission.creationDate} 15:34:57</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">MISIÓN DE TRABAJO No.:</span>
                        <span className="font-bold text-sm tracking-tight">{mission.missionNo.replace('MT-2024-', '') || '163468'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4 items-start">
                        <span className="font-bold uppercase leading-tight">RADICADO DE<br/>CORRESPONDENCIA:</span>
                        <div>
                           <span className="font-bold">{mission.caseRadicado}</span>
                           <span className="block text-[10px] italic text-slate-500 mt-1">Al contestar cíte este número</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">CASO NÚMERO:</span>
                        <span>{associatedCase?.caseId || '201893'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">ASIGNADO A:</span>
                        <span className="uppercase font-semibold">{mission.assignedOfficial || 'PERFIL PRUEBAS'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">A SOLICITUD DE:</span>
                        <span className="uppercase">{associatedCase?.remittingEntity || 'TITULAR DEL CASO'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">CIUDAD DE SOLICITUD:</span>
                        <span className="uppercase">{associatedCase?.requestCity || 'BOGOTA D.C.'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">TIPO DE MISIÓN:</span>
                        <span className="uppercase">{mission.type || 'EVALUACION TECNICA DE AMENAZA Y RIESGO'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">NOMBRES:</span>
                        <span className="uppercase">{associatedCase?.firstName || 'MARIA NUBIA'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">PRIMER APELLIDO:</span>
                        <span className="uppercase">{associatedCase?.firstSurname || 'SALDAÑA'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">SEGUNDO APELLIDO:</span>
                        <span className="uppercase">{associatedCase?.secondSurname || 'PUGACHI'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">TIPO DE DOCUMENTO DE IDENTIDAD:</span>
                        <span className="uppercase">{associatedCase?.docType || 'Cedula de Ciudadania'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">DOCUMENTO DE IDENTIDAD No.:</span>
                        <span className="font-bold">{associatedCase?.docNumber || '69021780'}</span>
                    </div>
                    <div className="grid grid-cols-[240px,1fr] gap-x-4">
                        <span className="font-bold uppercase tracking-tight">SECCION ASIGNADA:</span>
                        <span className="uppercase">{mission.assignedArea || 'EVALUACIONES'}</span>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <span className="font-bold uppercase mb-4 block underline">INSTRUCCIONES:</span>
                        <ol className="list-decimal pl-6 space-y-3 uppercase text-[11px] font-medium leading-tight">
                            <li>ENTREVISTAR AL CANDIDATO Y A LOS ADULTOS INTEGRANTES DE SU NÚCLEO FAMILIAR, SOLICITARLES ANTECEDENTES.</li>
                            <li>REALIZAR VISITA AL PROCESO Y ENTREVISTAR AL FUNCIONARIO JUDICIAL DE CONOCIMIENTO.</li>
                            <li>ESTABLECER Y VERIFICAR NIVELES DE RIESGO Y AMENAZA.</li>
                            <li>RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</li>
                            <li>RENDIR INFORME EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO.</li>
                        </ol>
                    </div>

                    <div className="mt-8 pt-4">
                        <span className="font-bold uppercase block mb-2 underline">OBSERVACIONES:</span>
                        <div className="p-4 border border-slate-300 min-h-[80px] bg-white uppercase text-[11px]">
                            {mission.observations || 'vdsgsdgsdggg'}
                        </div>
                    </div>

                    <div className="mt-8 pt-8">
                        <span className="font-black text-[13px] uppercase">LOS TÉRMINOS VENCEN: {mission.dueDate || '2026-01-24'}</span>
                    </div>
                </div>

                <div className="mt-10 pt-4 flex justify-end text-[10px] font-bold text-slate-400">
                    1/2
                </div>
            </div>

            {/* DOCUMENTO - PÁGINA 2 */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 mt-8 print:border-none print:shadow-none print:p-0 print:mt-0 relative min-h-[1056px] flex flex-col page-break-before">
                
                {/* Header (Igual a Pág 1) */}
                <div className="border border-black grid grid-cols-[1.2fr,2.5fr,1.3fr] mb-10">
                    <div className="border-r border-black p-4 flex items-center justify-center bg-white">
                        <img src={LOGO_URL} alt="Logo FGN" className="h-14 w-auto" />
                    </div>
                    <div className="border-r border-black flex flex-col text-center divide-y divide-black">
                        <div className="p-2 text-[10px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                        <div className="p-2 text-[14px] font-black uppercase flex-1 flex items-center justify-center tracking-tight">MISIÓN DE TRABAJO</div>
                    </div>
                    <div className="p-0 text-[8px] font-bold uppercase divide-y divide-black">
                        <div className="p-2 h-1/3"></div>
                        <div className="p-2 h-1/3"></div>
                        <div className="p-2 h-1/3"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="mt-20 pt-20 max-w-lg mx-auto text-center">
                        <div className="border-b border-black w-full mb-3 h-1"></div>
                        <span className="font-bold uppercase text-[11px] tracking-widest">FIRMA FUNCIONARIO ASIGNADO</span>
                        <div className="mt-8 flex flex-col items-center gap-2 text-[10px] font-black uppercase text-slate-700">
                            <div className="flex gap-4">
                                <span>Fecha de Asignación: {mission.reassignmentDate || mission.creationDate}</span>
                            </div>
                            <span>Generó: {mission.assignedOfficial || 'PERFIL PRUEBAS JAIR DPA'}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Legal */}
                <div className="mt-auto">
                    <div className="border border-black grid grid-cols-[3fr,1fr,1.5fr] text-[9px] font-bold text-center divide-x divide-black uppercase">
                        <div className="p-2">Documento no normalizado en el Sistema de Gestión Integral</div>
                        <div className="p-2">Versión 01</div>
                        <div className="p-2">2023-02-01</div>
                    </div>
                    <div className="mt-6 flex justify-end text-[10px] font-bold text-slate-400">
                        2/2
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionDocumentPage;
