
import React, { useState } from 'react';
import { FormSection, InputField, SelectField, TextAreaField, FileUpload } from '../components/FormComponents';
import { ProtectionCaseForm, UserRole } from '../types';
import { 
  REGIONAL_UNITS, 
  ENTITIES, 
  CANDIDATE_CLASSIFICATIONS, 
  ORIGINS, 
  SECCIONES, 
  MISSION_TYPES, 
  EVALUATION_MISSION_TYPES, 
  MISSION_CLASSIFICATIONS,
  DEPARTMENTS,
  COLOMBIA_GEO,
  DOC_TYPES
} from '../constants';

interface MissionDetailFormPageProps {
  initialData?: Partial<ProtectionCaseForm> & { missionNo?: string };
  onCancel: () => void;
}

const MissionDetailFormPage: React.FC<MissionDetailFormPageProps> = ({ initialData, onCancel }) => {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { id: 0, title: '1. Correspondencia' },
    { id: 1, title: '2. Información Titular' },
    { id: 2, title: '3. Asignación y orden de trabajo' },
  ];

  // Mock data if initialData is not provided or incomplete
  const data: ProtectionCaseForm = {
    radicado: initialData?.radicado || 'FGN-2024-987654',
    radicationDate: initialData?.radicationDate || '2024-04-21',
    destinationUnit: initialData?.destinationUnit || '',
    remittingEntity: initialData?.remittingEntity || '',
    candidateClassification: initialData?.candidateClassification || '',
    origin: initialData?.origin || '',
    remitterName: initialData?.remitterName || '',
    requestDepartment: initialData?.requestDepartment || '',
    requestCity: initialData?.requestCity || '',
    docType: initialData?.docType || 'Cédula de Ciudadanía',
    docNumber: initialData?.docNumber || '900123456',
    firstName: initialData?.firstName || 'COMERCIANTES',
    secondName: initialData?.secondName || 'UNIDOS',
    firstSurname: initialData?.firstSurname || 'DEL',
    secondSurname: initialData?.secondSurname || 'CENTRO',
    applicantRole: initialData?.applicantRole || 'TITULAR',
    assignedArea: initialData?.assignedArea || '',
    missionStartDate: initialData?.missionStartDate || new Date().toISOString().split('T')[0],
    missionType: initialData?.missionType || '',
    missionClassification: initialData?.missionClassification || '',
    dueDate: initialData?.dueDate || '',
    observations: initialData?.observations || '',
    folios: initialData?.folios || '1',
    generateMission: true,
    attachments: initialData?.attachments || [],
    committeeDate: initialData?.committeeDate
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Generación de Orden de Trabajo / Caso</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Formalización del caso de protección y asignación de orden de trabajo inicial.</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100 shadow-sm">
              RAD: {data.radicado}
            </div>
            <div className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200">
              FECHA RAD: {data.radicationDate}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white sticky top-0 z-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.title}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.3)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-10 bg-white">
          <fieldset disabled className="space-y-8">
            {activeTab === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InputField label="Número de Radicado" value={data.radicado} />
                <InputField label="Fecha de Radicado" value={data.radicationDate} />
                <SelectField label="Unidad Regional Destino" required options={REGIONAL_UNITS} value={data.destinationUnit} />
                <SelectField label="Entidad Remitente" required options={ENTITIES} value={data.remittingEntity} />
                <SelectField label="Clasificación del Candidato" required options={CANDIDATE_CLASSIFICATIONS} value={data.candidateClassification} />
                <SelectField label="Procedencia" required options={ORIGINS} value={data.origin} />
                <div className="col-span-1 md:col-span-2">
                  <InputField label="Nombre del Remitente" value={data.remitterName} />
                </div>
                <SelectField label="Departamento de Solicitud" required options={DEPARTMENTS} value={data.requestDepartment} />
                <SelectField label="Ciudad de Solicitud" required options={data.requestDepartment ? COLOMBIA_GEO[data.requestDepartment] : []} value={data.requestCity} />
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="col-span-1 md:col-span-2">
                  <SelectField label="Calidad del Solicitante" required options={['TITULAR', 'FAMILIAR', 'REPRESENTANTE LEGAL']} value={data.applicantRole} />
                </div>
                <SelectField label="Tipo de Documento" required options={DOC_TYPES} value={data.docType} />
                <InputField label="Número de Documento" required value={data.docNumber} />
                <InputField label="Primer Nombre del Titular" required value={data.firstName} />
                <InputField label="Segundo Nombre del Titular" value={data.secondName} />
                <InputField label="Primer Apellido del Titular" required value={data.firstSurname} />
                <InputField label="Segundo Apellido del Titular" value={data.secondSurname} />
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SelectField label="Seccion Asignada" required options={SECCIONES} value={data.assignedArea} />
                <InputField label="Fecha de inicio de orden de trabajo" required type="date" value={data.missionStartDate} />
                <SelectField label="Tipo de orden de trabajo" required options={[...MISSION_TYPES, ...EVALUATION_MISSION_TYPES]} value={data.missionType} />
                <SelectField label="Clasificación de orden de trabajo" required options={MISSION_CLASSIFICATIONS} value={data.missionClassification} />
                <InputField label="Términos Vencen" type="date" value={data.dueDate} />
                {data.committeeDate && (
                  <InputField label="Fecha de Comité Programada" value={data.committeeDate} className="bg-blue-50 border-blue-200" />
                )}
                <div className="col-span-1 md:col-span-2">
                  <TextAreaField label="Observaciones" value={data.observations} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <FileUpload 
                    label="Adjuntar soportes"
                    files={data.attachments} 
                    onFilesSelected={() => {}} 
                    onRemoveFile={() => {}} 
                    readOnly={true}
                  />
                </div>
              </div>
            )}
          </fieldset>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Cerrar Visualización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetailFormPage;
