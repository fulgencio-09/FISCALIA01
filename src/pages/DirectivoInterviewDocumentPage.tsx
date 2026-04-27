
import React from 'react';
import { DirectivoInterviewForm } from '../types';

interface DirectivoInterviewDocumentPageProps {
    interview: DirectivoInterviewForm;
    onCancel: () => void;
}

const DirectivoInterviewDocumentPage: React.FC<DirectivoInterviewDocumentPageProps> = ({ interview, onCancel }) => {
    const LOGO_URL = "https://www.fiscalia.gov.co/colombia/wp-content/uploads/LogoFiscalia.jpg";

    const PageHeader = ({ page }: { page: number }) => (
        <div className="border border-black grid grid-cols-[1.3fr,2.5fr,1.2fr] mb-6">
            <div className="border-r border-black p-4 flex items-center justify-center bg-white">
                <img src={LOGO_URL} alt="FGN" className="h-14 w-auto" />
            </div>
            <div className="border-r border-black flex flex-col text-center divide-y divide-black">
                <div className="p-1 text-[9px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                <div className="p-2 text-[10px] font-black uppercase flex-1 flex items-center justify-center leading-tight">
                    ENTREVISTA PARA EL ESTUDIO DE RIESGO NIVEL DIRECTIVO Y EX FISCALES GENERALES DE LA NACIÓN
                </div>
            </div>
            <div className="p-2 text-[8px] font-bold uppercase divide-y divide-black">
                <div className="pb-1">V. 03</div>
                <div className="pt-1 text-right">{page} | 7</div>
            </div>
        </div>
    );

    const Field = ({ label, value, className = "" }: { label: string, value?: string, className?: string }) => (
        <div className={`border border-black p-2 flex flex-col ${className}`}>
            <span className="text-[8px] font-bold uppercase text-slate-500 mb-0.5">{label}</span>
            <span className="text-[10px] font-black uppercase truncate min-h-[14px]">{value || ' '}</span>
        </div>
    );

    const SignatureFooter = () => (
        <div className="mt-auto pt-10">
            <div className="border border-black p-2 text-right">
                <span className="text-[10px] font-black uppercase">Firma del Entrevistado</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-0 md:p-10 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center print:hidden px-4 md:px-0">
                <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 12H5m7 7l-7-7 7-7"/></svg>
                    Bandeja de Entrevistas
                </button>
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-black transition-all">
                    Imprimir Formato Directivo
                </button>
            </div>

            {/* PÁGINA 1 */}
            <div className="bg-white p-12 border border-black shadow-2xl font-sans text-black print:shadow-none mb-10 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader page={1} />
                <div className="space-y-4">
                    <div className="grid grid-cols-[1fr,250px] gap-px">
                        <div className="flex flex-col gap-px">
                            <Field label="Caso número" value={interview.caseNumber} />
                            <Field label="Misión de trabajo" value={interview.missionNumber} />
                            <Field label="Lugar y fecha" value={`${interview.place} | ${interview.date}`} />
                            <Field label="Evaluador" value={interview.assignedEvaluator} />
                            <Field label="Objeto de la Misión" value={interview.missionObject} />
                        </div>
                    </div>
                    <div className="bg-slate-100 p-1 text-[10px] font-black text-center border border-black uppercase">Datos del evaluado</div>
                    <div className="grid grid-cols-2 gap-px">
                        <Field label="Nombres" value={interview.name1 + ' ' + (interview.name2 || '')} />
                        <Field label="Apellidos" value={interview.surname1 + ' ' + (interview.surname2 || '')} />
                        <Field label="Número Documento" value={interview.docNumber} />
                        <Field label="Lugar y fecha nacimiento" value={interview.birthDate} />
                        <Field label="Edad" value={interview.age} />
                        <Field label="Grupo Sanguíneo y RH" value={interview.bloodGroup} />
                        <Field label="Estado Civil" value={interview.civilStatus} />
                        <Field label="Calidad evaluado" value="DIRECTIVO / EX-FISCAL" />
                        <Field label="Cargo actual" value={interview.currentPosition} className="col-span-2" />
                        <Field label="Dirección residencia" value={interview.residenceAddress} className="col-span-2" />
                        <Field label="Dirección trabajo" value={interview.workAddress} className="col-span-2" />
                        <Field label="Número Teléfono" value={interview.phoneMobile} />
                        <Field label="Correo Electrónico" value={interview.email} />
                    </div>
                    <Field label="Consentimiento frente a medida de protección" value={interview.consentProtection} className="min-h-[60px]" />
                </div>
                <SignatureFooter />
            </div>

            {/* PÁGINA 2 */}
            <div className="bg-white p-12 border border-black shadow-2xl font-sans text-black print:shadow-none mb-10 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader page={2} />
                <div className="space-y-4">
                    <div className="bg-slate-100 p-1 text-[10px] font-black text-center border border-black uppercase tracking-tight">Experiencia en la Fiscalía General de la Nación</div>
                    <div className="grid grid-cols-2 gap-px">
                        <Field label="Fecha de Ingreso" value={interview.fgnEntryDate} />
                        <Field label="Tiempo de Servicio" value={interview.fgnServiceTime} />
                        <Field label="Cargos Ocupados" value={interview.positionsHeld} className="col-span-2 min-h-[100px]" />
                        <Field label="Lugares de actividad" value={interview.activityLocations} className="col-span-2 min-h-[80px]" />
                    </div>
                    <Field label="Antecedentes de evaluaciones" value={interview.evaluationHistory} className="min-h-[100px]" />
                    <Field label="Exposición ante medios" value={interview.mediaExposure} className="min-h-[100px]" />
                    <Field label="Intervención procesal" value={interview.proceduralIntervention} className="min-h-[100px]" />
                </div>
                <SignatureFooter />
            </div>

            {/* PÁGINA 3 */}
            <div className="bg-white p-12 border border-black shadow-2xl font-sans text-black print:shadow-none mb-10 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader page={3} />
                <Field label="Amenazas o situaciones de riesgo recibidas" value={interview.threatsReceived} className="min-h-[300px] mb-8" />
                <div className="flex items-center gap-10 border border-black p-4">
                    <span className="text-[10px] font-black uppercase">¿Autoriza medidas preventivas por parte de la Policía Nacional?</span>
                    <div className="flex gap-4">
                        <span className={`px-4 border border-black ${interview.policeMeasuresAuthorized === 'SI' ? 'bg-black text-white' : ''}`}>SI</span>
                        <span className={`px-4 border border-black ${interview.policeMeasuresAuthorized === 'NO' ? 'bg-black text-white' : ''}`}>NO</span>
                    </div>
                </div>
                <SignatureFooter />
            </div>

            {/* PAGINAS 4-7: SE REUTILIZA LA LÓGICA DE TABLA DIFERENCIAL EN MODO IMPRESIÓN SI FUERA NECESARIO */}
            <div className="bg-white p-12 border border-black shadow-2xl font-sans text-black print:shadow-none mb-10 min-h-[1056px] flex flex-col">
                <PageHeader page={7} />
                <div className="flex-1 flex flex-col justify-end gap-20 pb-20">
                    <div className="grid grid-cols-1 gap-10 max-w-lg mx-auto w-full">
                        <div className="border-t border-black pt-2 text-center">
                            <span className="text-[10px] font-black uppercase block">Firma persona entrevistada</span>
                            <span className="text-[9px] block">Nombre: {interview.name1} {interview.surname1}</span>
                        </div>
                        <div className="border-t border-black pt-2 text-center">
                            <span className="text-[10px] font-black uppercase block">Firma evaluador</span>
                            <span className="text-[9px] block">Nombre: {interview.assignedEvaluator}</span>
                        </div>
                    </div>
                </div>
                <div className="border border-black p-2 text-center text-[8px] font-bold uppercase">
                    Documento no normalizado en el Sistema de Gestión Integral | SIDPA 3.0
                </div>
            </div>
        </div>
    );
};

export default DirectivoInterviewDocumentPage;
