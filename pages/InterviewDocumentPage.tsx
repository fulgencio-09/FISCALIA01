
import React from 'react';
import { TechnicalInterviewForm } from '../types';

interface InterviewDocumentPageProps {
    interview: TechnicalInterviewForm;
    onCancel: () => void;
}

const InterviewDocumentPage: React.FC<InterviewDocumentPageProps> = ({ interview, onCancel }) => {
    const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fiscalia_General_de_la_Nacion_Colombia_Logo.png/800px-Fiscalia_General_de_la_Nacion_Colombia_Logo.png";

    // Componente para el encabezado de cada página
    const PageHeader = ({ pageNumber }: { pageNumber: number }) => (
        <div className="border border-black grid grid-cols-[1.3fr,2.5fr,1.2fr] mb-4">
            <div className="border-r border-black p-4 flex items-center justify-center bg-white">
                <img src={LOGO_URL} alt="Logo FGN" className="h-14 w-auto" />
            </div>
            <div className="border-r border-black flex flex-col text-center divide-y divide-black">
                <div className="p-1 text-[9px] font-bold uppercase flex-1 flex items-center justify-center">SUBPROCESO PROTECCIÓN Y ASISTENCIA</div>
                <div className="p-2 text-[11px] font-black uppercase flex-1 flex items-center justify-center tracking-tight leading-tight">
                    FORMATO ENTREVISTA PARA LA EVALUACIÓN TÉCNICA DE AMENAZA Y RIESGO A TESTIGOS, VICTIMAS E INTERVINIENTES EN EL PROCESO PENAL
                </div>
            </div>
            <div className="p-0 text-[8px] font-bold uppercase divide-y divide-black">
                <div className="p-1 px-2">Código: <span className="font-black">FGN-MS01-F-04</span></div>
                <div className="p-1 px-2">Versión: <span className="font-black">10</span></div>
                <div className="p-1 px-2 text-right">Página {pageNumber} de 8</div>
            </div>
        </div>
    );

    const LegalFooter = () => (
        <div className="mt-auto pt-6">
            <p className="text-[9px] text-justify leading-tight mb-4">
                La información que he suministrado en la presente diligencia corresponde a la verdad, esta podrá ser verificada por la Dirección de Protección y Asistencia de la Fiscalía General de la Nación. En el evento que se compruebe que falto a la verdad parcial o totalmente, tengo pleno conocimiento que puedo ser objeto de las sanciones que la ley establezca.
            </p>
            <div className="flex justify-between items-end gap-10 mt-6">
                <div className="w-40 h-24 border border-black rounded flex items-center justify-center text-[8px] text-slate-300">Huella</div>
                <div className="flex-1 border-t border-black pt-1 text-right">
                    <span className="text-[10px] font-bold uppercase">Firma del Entrevistado</span>
                </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-2 text-[8px] text-slate-400 italic">
                Este documento es copia del original que reposa en la Intranet. Su impresión o descarga se considera una Copia No Controlada.
            </div>
        </div>
    );

    const Field = ({ label, value, className = "" }: { label: string, value?: string, className?: string }) => (
        <div className={`flex flex-col border border-black p-1.5 ${className}`}>
            <span className="text-[8px] font-bold uppercase text-slate-500 mb-0.5">{label}</span>
            <span className="text-[10px] font-black uppercase truncate min-h-[14px]">{value || ' '}</span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-0 md:p-10 animate-in fade-in duration-500 print:p-0 bg-slate-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center print:hidden px-4 md:px-0">
                <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Bandeja de Entrevistas
                </button>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all flex items-center gap-2">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z"/></svg>
                    Imprimir Formato Completo
                </button>
            </div>

            {/* PÁGINA 1 */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 print:border-none print:shadow-none print:p-0 mb-8 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader pageNumber={1} />
                <div className="grid grid-cols-2 gap-px mb-4">
                    <Field label="Número Caso" value={interview.caseNumber} />
                    <Field label="Misión de Trabajo No." value={interview.missionNumber} />
                </div>
                <div className="grid grid-cols-[2fr,1fr,1fr] gap-px mb-4">
                    <Field label="Lugar" value={interview.place} />
                    <Field label="Fecha" value={interview.date} />
                    <div className="grid grid-cols-2">
                        <Field label="Hora Inicio" value={interview.startTime} />
                        <Field label="Hora Final" value={interview.endTime} />
                    </div>
                </div>
                <Field label="Objeto de la misión" value={interview.missionObject} className="mb-4" />
                <Field label="Evaluador Asignado" value={interview.assignedEvaluator} className="mb-6" />

                <div className="bg-slate-100 p-2 text-[9px] font-bold text-center mb-6">
                    INFORMACIÓN DEL CANDIDATO A LA PROTECCIÓN:
                </div>
                <div className="grid grid-cols-4 gap-px mb-4">
                    <Field label="Nombre 1" value={interview.name1} />
                    <Field label="Nombre 2" value={interview.name2} />
                    <Field label="Apellido 1" value={interview.surname1} />
                    <Field label="Apellido 2" value={interview.surname2} />
                </div>
                <div className="grid grid-cols-2 gap-px mb-4">
                    <Field label="Lugar de Nacimiento" value={`${interview.birthMunicipality}, ${interview.birthDepartment}`} />
                    <div className="grid grid-cols-2">
                        <Field label="Fecha Nacimiento" value={interview.birthDate} />
                        <Field label="Edad" value={interview.age} />
                    </div>
                </div>
                <div className="grid grid-cols-[2fr,1fr,1fr] gap-px mb-4">
                    <Field label="Tipo de documento" value={interview.docType} />
                    <Field label="Número" value={interview.docNumber} />
                    <Field label="Sexo" value={interview.sex} />
                </div>
                <div className="grid grid-cols-2 gap-px mb-6">
                    <Field label="Fecha de expedición" value={interview.expeditionDate} />
                    <Field label="Lugar de expedición" value={interview.expeditionPlace} />
                </div>

                <div className="grid grid-cols-3 gap-px mb-4">
                    <Field label="Dirección Residencia" value={interview.residenceAddress} />
                    <Field label="Departamento" value={interview.residenceDepartment} />
                    <Field label="Municipio" value={interview.residenceMunicipality} />
                </div>
                <Field label="Correo Electrónico" value={interview.email} className="mb-4" />
                <div className="grid grid-cols-2 gap-px mb-10">
                    <Field label="Teléfono Fijo" value={interview.phoneLandline} />
                    <Field label="Teléfono Móvil" value={interview.phoneMobile} />
                </div>
                <LegalFooter />
            </div>

            {/* PÁGINA 2: NÚCLEO FAMILIAR */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 print:border-none print:shadow-none print:p-0 mb-8 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader pageNumber={2} />
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <Field label="Calidad de la persona" value={interview.personQuality} />
                    <Field label="Estado Civil" value={interview.civilStatus} />
                </div>
                <div className="mb-6">
                    <Field label="Observaciones Caracterización" value={interview.observationsGeneral} className="min-h-[100px]" />
                </div>

                <div className="bg-slate-900 text-white p-2 text-[10px] font-black uppercase tracking-widest text-center mb-4">
                    COMPONENTE FAMILIAR DEL CANDIDATO A PROTECCIÓN
                </div>
                <div className="border border-black overflow-hidden mb-10">
                    <table className="w-full text-[8px] text-left border-collapse">
                        <thead className="bg-slate-50 font-bold uppercase border-b border-black">
                            <tr>
                                <th className="p-1.5 border-r border-black">Nombres y Apellidos</th>
                                <th className="p-1.5 border-r border-black">Documento</th>
                                <th className="p-1.5 border-r border-black">Vínculo</th>
                                <th className="p-1.5 border-r border-black">Lugar Residencia</th>
                                <th className="p-1.5 border-r border-black">Edad</th>
                                <th className="p-1.5">F. Nac</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                            {(interview.familyMembers || []).map((fam, i) => (
                                <tr key={i} className="min-h-[20px]">
                                    <td className="p-1 border-r border-black font-bold uppercase">{fam.firstName} {fam.firstSurname}</td>
                                    <td className="p-1 border-r border-black">{fam.docNumber}</td>
                                    <td className="p-1 border-r border-black">{fam.relationship}</td>
                                    <td className="p-1 border-r border-black">{fam.residencePlace}</td>
                                    <td className="p-1 border-r border-black text-center">{fam.age}</td>
                                    <td className="p-1">{fam.birthDate}</td>
                                </tr>
                            ))}
                            {/* Relleno de filas vacías para mantener el formato */}
                            {Array.from({ length: Math.max(0, 15 - (interview.familyMembers?.length || 0)) }).map((_, i) => (
                                <tr key={`empty-${i}`} className="h-6">
                                    <td className="p-1 border-r border-black"></td><td className="p-1 border-r border-black"></td><td className="p-1 border-r border-black"></td><td className="p-1 border-r border-black"></td><td className="p-1 border-r border-black"></td><td className="p-1"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <LegalFooter />
            </div>

            {/* PÁGINA 3: ANIMALES Y SALUD */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 print:border-none print:shadow-none print:p-0 mb-8 min-h-[1056px] flex flex-col page-break-after-always">
                <PageHeader pageNumber={3} />
                <div className="border border-black p-4 mb-6">
                    <h3 className="text-[11px] font-black uppercase mb-4 tracking-tight underline">ANIMALES DE COMPAÑÍA:</h3>
                    <div className="grid grid-cols-2 mb-4">
                        <div className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold">¿Tiene animales?</span>
                            <span className="border-b border-black font-black uppercase text-xs px-4">{interview.hasPets}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold">¿Cuántos?</span>
                            <span className="border-b border-black font-black uppercase text-xs px-4">{interview.petsCount}</span>
                        </div>
                    </div>
                    <table className="w-full text-[9px] border border-black border-collapse mb-4">
                        <thead>
                            <tr className="bg-slate-50 border-b border-black">
                                <th className="p-1 border-r border-black">Especie</th>
                                <th className="p-1 border-r border-black">Nombre</th>
                                <th className="p-1 border-r border-black">Raza</th>
                                <th className="p-1 border-r border-black">Sexo</th>
                                <th className="p-1 border-r border-black">Edad</th>
                                <th className="p-1">Peso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(interview.pets || []).map((p, i) => (
                                <tr key={i}>
                                    <td className="p-1 border-r border-black">{p.species}</td>
                                    <td className="p-1 border-r border-black">{p.name}</td>
                                    <td className="p-1 border-r border-black">{p.breed}</td>
                                    <td className="p-1 border-r border-black">{p.sex}</td>
                                    <td className="p-1 border-r border-black">{p.age}</td>
                                    <td className="p-1">{p.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Field label="Observaciones Animales" value={interview.petObservations} className="min-h-[60px]" />
                </div>

                <div className="bg-slate-900 text-white p-2 text-[10px] font-black uppercase tracking-widest text-center mb-6">
                    ANTECEDENTES MÉDICOS O CLÍNICOS
                </div>
                <div className="space-y-4">
                    <div className="border border-black p-3">
                        <p className="text-[10px] font-bold mb-2">¿Tiene alguna enfermedad física?</p>
                        <div className="flex gap-6 mb-2">
                            <span className="font-black border-b border-black w-20 text-center uppercase">{interview.physicalIllness}</span>
                            <span className="text-[9px] font-bold">¿Qué enfermedad?</span>
                            <span className="flex-1 border-b border-black uppercase text-[10px] font-black">{interview.physicalIllnessDetails}</span>
                        </div>
                    </div>
                    <div className="border border-black p-3">
                        <p className="text-[10px] font-bold mb-2">¿Tiene alguna enfermedad mental?</p>
                        <div className="flex gap-6">
                            <span className="font-black border-b border-black w-20 text-center uppercase">{interview.mentalIllness}</span>
                            <span className="text-[9px] font-bold">¿Qué enfermedad?</span>
                            <span className="flex-1 border-b border-black uppercase text-[10px] font-black">{interview.mentalIllnessDetails}</span>
                        </div>
                    </div>
                </div>
                <LegalFooter />
            </div>

            {/* PÁGINA 8: CIERRE Y FIRMAS */}
            <div className="bg-white p-8 md:p-14 border border-slate-300 shadow-2xl font-sans text-slate-900 mb-8 min-h-[1056px] flex flex-col page-break-before">
                <PageHeader pageNumber={8} />
                
                <div className="mt-20 flex-1">
                    <div className="max-w-2xl mx-auto space-y-20">
                        <div className="text-center">
                            <div className="border-b border-black w-full mb-2 h-1"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Firma del evaluador que realiza la entrevista</span>
                            <div className="mt-4 text-left grid grid-cols-2 gap-4">
                                <Field label="Nombre" value={interview.assignedEvaluator} />
                                <Field label="Cargo" value="ANALISTA DE PROTECCIÓN Y ASISTENCIA" />
                            </div>
                        </div>

                        <div className="text-center pt-20">
                            <div className="border-b border-black w-full mb-2 h-1"></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Firma del Candidato a Protección</span>
                            <div className="mt-4 text-left">
                                <Field label="Nombre Completo" value={`${interview.name1} ${interview.surname1}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="border border-black grid grid-cols-[3fr,1fr,1.5fr] text-[9px] font-bold text-center divide-x border-black uppercase">
                        <div className="p-2">Documento no normalizado en el Sistema de Gestión Integral</div>
                        <div className="p-2">Versión 10</div>
                        <div className="p-2">FGN-MS01-F-04</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewDocumentPage;
