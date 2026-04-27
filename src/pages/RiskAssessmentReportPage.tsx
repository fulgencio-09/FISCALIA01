
import React, { useState, useEffect } from 'react';
import { ProtectionMission, ETARReport, UserRole } from '../types';
import { InputField, TextAreaField, SelectField } from '../components/FormComponents';

interface RiskAssessmentReportPageProps {
  mission: ProtectionMission;
  initialData?: ETARReport;
  onSave: (report: ETARReport) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const DIFFERENTIAL_FACTORS = [
  {
    category: 'ENFOQUE DIFERENCIAL',
    criteria: [
      {
        name: 'ETARIO',
        options: ['ADULTO MAYOR - PERSONAS > 60 AÑOS', 'NIÑO', 'NIÑA', 'ADOLESCENTE MUJER', 'ADOLESCENTE HOMBRE']
      },
      {
        name: 'ÉTNICO',
        options: ['AFRODESCENDIENTE', 'AFRODESCENDIENTE PALENQUERO', 'AFRODESCENDIENTE RAIZAL', 'COMUNIDAD RROM O GITANO', 'INDIGENA (ESPECIFIQUE)']
      },
      {
        name: 'DISCAPACIDAD',
        options: ['FÍSICA', 'MENTAL', 'INTELECTUAL', 'SENSORIAL', 'PSICOSOCIAL', 'MÚLTIPLE']
      },
      {
        name: 'CONTEXTO (CONDICIÓN SOCIAL Y DE VULNERABILIDAD)',
        options: ['CAMPESINO / RURAL', 'MIGRANTE', 'VICTIMA DEL CONFLICTO ARMADO', 'MADRE CABEZA DE FAMILIA', 'PADRE CABEZA DE FAMILIA']
      }
    ]
  },
  {
    category: 'ENFOQUE DE GÉNERO',
    criteria: [
      {
        name: 'IDENTIDAD DE GÉNERO (OSIG)',
        options: ['HOMBRE TRANSGÉNERO', 'MUJER TRANSGÉNERO', 'NO BINARIO']
      },
      {
        name: 'ORIENTACIÓN SEXUAL (OSIG)',
        options: ['BISEXUAL', 'ASEXUAL', 'HOMOSEXUAL', 'LESBIANA', 'OTRA DIVERSA']
      }
    ]
  },
  {
    category: 'DELITOS EDG',
    criteria: [
      {
        name: 'CALIDAD DE VICTIMA',
        options: ['MUJER VICTIMA EN PROCESO PENAL', 'MUJER VICTIMA CONFLICTO ARMADO', 'NNA INTERVINIENTE EN EL PROCESO PENAL']
      },
      {
        name: 'TIPO DE DELITO',
        options: [
          'VICTIMA VIOLENCIA INTRAFAMILIAR',
          'VICTIMA VIOLENCIA SEXUAL',
          'VICTIMA TORTURA',
          'VICTIMA DE FEMINICIDIO',
          'VICTIMA DE TENTATIVA DE FEMINICIDIO',
          'VICTIMA TRATA DE PERSONAS',
          'VICTIMA DELITOS TITULO II CÓDIGO PENAL (ESPECIFIQUE)'
        ]
      }
    ]
  }
];

const RiskAssessmentReportPage: React.FC<RiskAssessmentReportPageProps> = ({ mission, initialData, onSave, onCancel, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<ETARReport['sections']>(initialData?.sections || {
    correspondencia: {
      ciudad: 'BOGOTA',
      fechaAprobacionFirmaDescargue: new Date().toISOString().split('T')[0],
      tratamiento: 'DOCTOR',
      dirigidoA: 'JORGE EDUARDO ROJAS PINZON',
      cargo: 'DIRECTOR DE PROTECCION Y ASISTENCIA',
      entidad: 'FISCALIA GENERAL DE LA NACION',
      direccion: 'CARRERA 86 # 51 - 66 INTERIOR',
      municipio: 'BOGOTA',
      caseNumber: mission.caseRadicado,
      regional: mission.regional || '',
      missionNumber: mission.missionNo,
      assignmentDate: mission.creationDate,
      evaluatedName: mission.petitionerName,
      idType: 'Cédula de Ciudadanía',
      idNumber: mission.petitionerDoc,
      sex: 'Masculino',
      genderIdentity: 'HOMBRE'
    },
    concepto: {
      tipoMision: 'EVALUACION DE AMENAZA Y RIESGO',
      concepto: 'V - Vincular',
      tipoVinculacion: 'Vinculacion Extraordinaria Condicionada',
      medida: 'Acompañamiento de Seguridad',
      causal: 'CUMPLIMIENTO DE PROVIDENCIA JUDICIAL',
      calidadEvaluado: 'Victima y Testigo',
      nivelRiesgo: 'Riesgo Extraordinario'
    },
    dynamic: {
      delitos: ['AMENAZAS ART. 347 C.P.'],
      zonasRiesgo: [{ dept: '', muni: '' }],
      enfoqueDiferencial: {}
    },
    analisis: {
      diligenciasPracticadas: '',
      presentacionPrograma: '',
      entrevistaEvaluado: '',
      intervencionProcesalAmenaza: '',
      amenazasSituaciones: '',
      tiempoServicioDirectivos: '',
      otrasActividadesDirectivos: '',
      funcionesDirectivos: '',
      solicitudAntecedentes: '',
      intervencionProcesalNoDirectivos: '',
      revisionProcesal: {
        fechaRevision: '',
        radicado: '',
        sistemaPenal: '',
        indiciados: '',
        imputados: '',
        acusados: '',
        condenados: '',
        victimaDenunciante: '',
        delitos: [],
        etapaProcesal: ''
      },
      hechos: '',
      conceptoFuncionarioConocimiento: '',
      laboresInvestigacion: '',
      vulnerabilidadDirectivos: '',
      seguridadInstalaciones: '',
      exposicionMedios: '',
      exposicionOtrosEscenarios: ''
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      missionId: mission.id,
      status: initialData?.status || 'BORRADOR',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evaluations: initialData?.evaluations || [],
      sections: formData
    });
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="bg-slate-50 border-y border-slate-200 py-3 px-6 mb-6">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-center">{title}</h3>
    </div>
  );

  const tabs = [
    { id: 0, label: 'General', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { id: 1, label: 'Antecedentes', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { id: 2, label: 'Diligencias', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { id: 3, label: 'Análisis', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Informe de Evaluación de Amenaza y Riesgo</h1>
          <p className="text-slate-500 font-medium italic text-sm">Diligenciamiento del informe técnico final de evaluación.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-6 py-2 border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
          <button onClick={handleSave} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Guardar Informe</button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-1 mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-white/50'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-8 pb-20">
        <fieldset disabled={readOnly} className="space-y-8">
          {/* TAB 0: GENERAL */}
          {activeTab === 0 && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              {/* INFORMACIÓN DE CORRESPONDENCIA */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="INFORMACIÓN DE CORRESPONDENCIA" />
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <InputField label="Ciudad" value={formData.correspondencia.ciudad} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, ciudad: e.target.value}})} />
                  <InputField label="Fecha Aprobación, Firma y Descargue" type="date" value={formData.correspondencia.fechaAprobacionFirmaDescargue} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, fechaAprobacionFirmaDescargue: e.target.value}})} />
                  <InputField label="Tratamiento" value={formData.correspondencia.tratamiento} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, tratamiento: e.target.value}})} />
                  <InputField label="Dirigido a" value={formData.correspondencia.dirigidoA} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, dirigidoA: e.target.value}})} />
                  <InputField label="Cargo" value={formData.correspondencia.cargo} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, cargo: e.target.value}})} />
                  <InputField label="Entidad" value={formData.correspondencia.entidad} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, entidad: e.target.value}})} />
                  <InputField label="Dirección" value={formData.correspondencia.direccion} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, direccion: e.target.value}})} />
                  <InputField label="Municipio" value={formData.correspondencia.municipio} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, municipio: e.target.value}})} />
                </div>
              </div>

              {/* 1. REFERENCIA */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="1. REFERENCIA" />
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <InputField label="Número de Caso" value={formData.correspondencia.caseNumber} readOnly />
                  <SelectField label="Regional" options={['REGIONAL MEDELLIN', 'REGIONAL BOGOTA', 'REGIONAL CALI']} value={formData.correspondencia.regional} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, regional: e.target.value}})} />
                  <InputField label="Misión de Trabajo No." value={formData.correspondencia.missionNumber} readOnly />
                  <InputField label="Fecha Asignación Misión" type="date" value={formData.correspondencia.assignmentDate} readOnly />
                  <InputField label="Cargo en la FGN" value="profesional investigador 10" />
                  <InputField label="Primer Nombre Evaluado" value={formData.correspondencia.evaluatedName.split(' ')[0]} readOnly />
                  <InputField label="Segundo Nombre Evaluado" value={formData.correspondencia.evaluatedName.split(' ')[1] || ''} readOnly />
                  <InputField label="Primer Apellido Evaluado" value={formData.correspondencia.evaluatedName.split(' ')[2] || ''} readOnly />
                  <InputField label="Segundo Apellido Evaluado" value={formData.correspondencia.evaluatedName.split(' ')[3] || ''} readOnly />
                  <SelectField label="Tipo Documento Evaluado" options={['Cédula de Ciudadanía', 'Pasaporte', 'Cédula de Extranjería']} value={formData.correspondencia.idType} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, idType: e.target.value}})} />
                  <InputField label="Número de Documento del Evaluado" value={formData.correspondencia.idNumber} readOnly />
                  <SelectField label="Sexo" options={['Masculino', 'Femenino', 'Otro']} value={formData.correspondencia.sex} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, sex: e.target.value}})} />
                  <SelectField label="Identidad de Género" options={['HOMBRE', 'MUJER', 'OTRO']} value={formData.correspondencia.genderIdentity} onChange={e => setFormData({...formData, correspondencia: {...formData.correspondencia, genderIdentity: e.target.value}})} />
                </div>
              </div>

              {/* CONCEPTO */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="CONCEPTO" />
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <InputField label="Tipo de Misión" value={formData.concepto.tipoMision} readOnly />
                  <SelectField label="Concepto" options={['V - Vincular', 'NV - No Vincular']} value={formData.concepto.concepto} onChange={e => setFormData({...formData, concepto: {...formData.concepto, concepto: e.target.value}})} />
                  <SelectField label="Tipo de Vinculación" options={['Vinculacion Extraordinaria Condicionada', 'Vinculacion Ordinaria']} value={formData.concepto.tipoVinculacion} onChange={e => setFormData({...formData, concepto: {...formData.concepto, tipoVinculacion: e.target.value}})} />
                  <SelectField label="Medida" options={['Acompañamiento de Seguridad', 'Esquema de Seguridad', 'Reubicación']} value={formData.concepto.medida} onChange={e => setFormData({...formData, concepto: {...formData.concepto, medida: e.target.value}})} />
                  <SelectField label="Causal" options={['CUMPLIMIENTO DE PROVIDENCIA JUDICIAL', 'RIESGO EXTRAORDINARIO']} value={formData.concepto.causal} onChange={e => setFormData({...formData, concepto: {...formData.concepto, causal: e.target.value}})} />
                  <SelectField label="Calidad del Evaluado" options={['Victima y Testigo', 'Servidor Público']} value={formData.concepto.calidadEvaluado} onChange={e => setFormData({...formData, concepto: {...formData.concepto, calidadEvaluado: e.target.value}})} />
                  <SelectField label="Nivel de Riesgo" options={['Riesgo Extraordinario', 'Riesgo Ordinario', 'Riesgo Extremo']} value={formData.concepto.nivelRiesgo} onChange={e => setFormData({...formData, concepto: {...formData.concepto, nivelRiesgo: e.target.value}})} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ANTECEDENTES */}
          {activeTab === 1 && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              {/* 2. ORIGEN DEL ESTUDIO */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="2. ORIGEN DEL ESTUDIO" />
                <div className="p-8">
                  <TextAreaField label="" value={formData.analisis.laboresInvestigacion} onChange={e => setFormData({...formData, analisis: {...formData.analisis, laboresInvestigacion: e.target.value}})} placeholder="Describa el origen del estudio..." className="min-h-[200px]" />
                </div>
              </div>

              {/* 3. ANTECEDENTES */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="3. ANTECEDENTES (AL INTERIOR DEL PROGRAMA DE PROTECCIÓN)" />
                <div className="p-8">
                  <TextAreaField label="" value={formData.analisis.solicitudAntecedentes} onChange={e => setFormData({...formData, analisis: {...formData.analisis, solicitudAntecedentes: e.target.value}})} placeholder="Antecedentes del evaluado..." className="min-h-[200px]" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DILIGENCIAS */}
          {activeTab === 2 && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              {/* 4. DILIGENCIAS PRACTICADAS */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="4. DILIGENCIAS PRACTICADAS" />
                <div className="p-8 space-y-8">
                  <TextAreaField label="4.1 Presentación del Programa de Protección y Asistencia al Evaluado y Resultado del Consentimiento:" value={formData.analisis.presentacionPrograma} onChange={e => setFormData({...formData, analisis: {...formData.analisis, presentacionPrograma: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2 Entrevista con el evaluado:" value={formData.analisis.entrevistaEvaluado} onChange={e => setFormData({...formData, analisis: {...formData.analisis, entrevistaEvaluado: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2.1 Intervencion Procesal que Pueda Generar Amenazas y/o Riesgo al Evaluado:" value={formData.analisis.intervencionProcesalAmenaza} onChange={e => setFormData({...formData, analisis: {...formData.analisis, intervencionProcesalAmenaza: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2.2 Amenazas o Situaciones de Riesgo recibidas por el Evaluado y/o su Familia:" value={formData.analisis.amenazasSituaciones} onChange={e => setFormData({...formData, analisis: {...formData.analisis, amenazasSituaciones: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2.3 Tiempo de Servicio en la Entidad, Cargos Ocupados y Lugares de Desempeño. (Aplica a Directivos):" value={formData.analisis.tiempoServicioDirectivos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, tiempoServicioDirectivos: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2.4 Otras Actividades Laborales Actuales diferentes a la Fiscalía. (Aplica a Directivos):" value={formData.analisis.otrasActividadesDirectivos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, otrasActividadesDirectivos: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.2.5 Funciones desarrolladas en virtud de su cargo directivo. (Aplica a Directivos):" value={formData.analisis.funcionesDirectivos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, funcionesDirectivos: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.3 Solicitud de antecedentes del evaluado:" value={formData.analisis.solicitudAntecedentes} onChange={e => setFormData({...formData, analisis: {...formData.analisis, solicitudAntecedentes: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.4 Intervención procesal (No aplica para Directivos):" value={formData.analisis.intervencionProcesalNoDirectivos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, intervencionProcesalNoDirectivos: e.target.value}})} className="min-h-[150px]" />
                </div>
              </div>

              {/* 4.4.1 Revisión procesal */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="4.4.1 Revisión procesal" />
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <InputField label="Fecha de la revisión" type="date" value={formData.analisis.revisionProcesal.fechaRevision} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, fechaRevision: e.target.value}}})} />
                  <InputField label="Radicado" value={formData.analisis.revisionProcesal.radicado} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, radicado: e.target.value}}})} />
                  <InputField label="Sistema Penal" value={formData.analisis.revisionProcesal.sistemaPenal} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, sistemaPenal: e.target.value}}})} />
                  <InputField label="Indiciados" value={formData.analisis.revisionProcesal.indiciados} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, indiciados: e.target.value}}})} />
                  <InputField label="Imputados" value={formData.analisis.revisionProcesal.imputados} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, imputados: e.target.value}}})} />
                  <InputField label="Acusados" value={formData.analisis.revisionProcesal.acusados} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, acusados: e.target.value}}})} />
                  <InputField label="Condenados" value={formData.analisis.revisionProcesal.condenados} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, condenados: e.target.value}}})} />
                  <InputField label="Víctima y/o denunciante" value={formData.analisis.revisionProcesal.victimaDenunciante} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, victimaDenunciante: e.target.value}}})} />
                  <SelectField label="Delito 1" options={['AMENAZAS ART. 347 C.P.', 'HOMICIDIO', 'EXTORSIÓN']} value={formData.analisis.revisionProcesal.delitos[0] || ''} onChange={e => {
                    const newDelitos = [...formData.analisis.revisionProcesal.delitos];
                    newDelitos[0] = e.target.value;
                    setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, delitos: newDelitos}}});
                  }} />
                  <InputField label="Etapa Procesal" value={formData.analisis.revisionProcesal.etapaProcesal} onChange={e => setFormData({...formData, analisis: {...formData.analisis, revisionProcesal: {...formData.analisis.revisionProcesal, etapaProcesal: e.target.value}}})} />
                </div>
                <div className="px-8 pb-8">
                  <TextAreaField label="Hechos y Resumen de Actuaciones en el Proceso Penal:" value={formData.analisis.hechos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, hechos: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="4.4.2 Concepto del Funcionario de Conocimiento:" value={formData.analisis.conceptoFuncionarioConocimiento} onChange={e => setFormData({...formData, analisis: {...formData.analisis, conceptoFuncionarioConocimiento: e.target.value}})} className="min-h-[150px]" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANÁLISIS */}
          {activeTab === 3 && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              {/* 5. LABORES DE INVESTIGACIÓN */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="5. LABORES DE INVESTIGACIÓN Y VERIFICACIÓN DE LA INFORMACIÓN" />
                <div className="p-8 space-y-8">
                  <TextAreaField label="" value={formData.analisis.laboresInvestigacion} onChange={e => setFormData({...formData, analisis: {...formData.analisis, laboresInvestigacion: e.target.value}})} className="min-h-[200px]" />
                  <TextAreaField label="5.1 Vulnerabilidad (Aplica para Directivos):" value={formData.analisis.vulnerabilidadDirectivos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, vulnerabilidadDirectivos: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="5.1.1 Seguridad en instalaciones. (Verificar seguridad interna y externa del lugar de trabajo y de domicilio, registrando posibles vulnerabilidades en caso de que se presenten):" value={formData.analisis.seguridadInstalaciones} onChange={e => setFormData({...formData, analisis: {...formData.analisis, seguridadInstalaciones: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="5.1.2 Exposición a los medios de comunicación (calificar bajo, medio, alto):" value={formData.analisis.exposicionMedios} onChange={e => setFormData({...formData, analisis: {...formData.analisis, exposicionMedios: e.target.value}})} className="min-h-[150px]" />
                  <TextAreaField label="5.1.3 Exposición en otros escenarios (Públicos, en desplazamientos, seguridad con los vehículos, en esquemas de seguridad):" value={formData.analisis.exposicionOtrosEscenarios} onChange={e => setFormData({...formData, analisis: {...formData.analisis, exposicionOtrosEscenarios: e.target.value}})} className="min-h-[150px]" />
                </div>
              </div>

              {/* 6. ANÁLISIS DE LA INFORMACIÓN */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <SectionTitle title="6. ANÁLISIS DE LA INFORMACIÓN Y VALORACIÓN DE LA AMENAZA, RIESGO y VULNERABILIDAD" />
                <div className="p-8 space-y-8">
                  <TextAreaField label="" value={formData.analisis.hechos} onChange={e => setFormData({...formData, analisis: {...formData.analisis, hechos: e.target.value}})} className="min-h-[200px]" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField label="Departamento de Riesgo 1" options={['ANTIOQUIA', 'BOGOTA', 'VALLE']} value={formData.dynamic.zonasRiesgo[0].dept} onChange={e => {
                      const newZonas = [...formData.dynamic.zonasRiesgo];
                      newZonas[0].dept = e.target.value;
                      setFormData({...formData, dynamic: {...formData.dynamic, zonasRiesgo: newZonas}});
                    }} />
                    <SelectField label="Ciudad/Municipio de Riesgo 1" options={['MEDELLIN', 'BOGOTA', 'CALI']} value={formData.dynamic.zonasRiesgo[0].muni} onChange={e => {
                      const newZonas = [...formData.dynamic.zonasRiesgo];
                      newZonas[0].muni = e.target.value;
                      setFormData({...formData, dynamic: {...formData.dynamic, zonasRiesgo: newZonas}});
                    }} />
                  </div>

                  <TextAreaField label="6.1 Nexo causal:" value={formData.analisis.laboresInvestigacion} onChange={e => setFormData({...formData, analisis: {...formData.analisis, laboresInvestigacion: e.target.value}})} className="min-h-[150px]" />
                  
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">6.2 Factor Diferencial y de Género:</h4>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="w-1/4 px-4 py-3 text-[9px] font-black text-slate-500 uppercase border-r border-slate-200">Categoría</th>
                            <th className="w-1/4 px-4 py-3 text-[9px] font-black text-slate-500 uppercase border-r border-slate-200">Criterio</th>
                            <th className="w-2/4 px-4 py-3 text-[9px] font-black text-slate-500 uppercase border-r border-slate-200">Subcategoría / Opción</th>
                            <th className="w-24 px-4 py-3 text-[9px] font-black text-slate-500 uppercase text-center border-r border-slate-200">Titular</th>
                            <th className="w-24 px-4 py-3 text-[9px] font-black text-slate-500 uppercase text-center">Familiar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {DIFFERENTIAL_FACTORS.map((cat, catIdx) => (
                            <React.Fragment key={cat.category}>
                              {cat.criteria.map((crit, critIdx) => (
                                <React.Fragment key={crit.name}>
                                  {crit.options.map((opt, optIdx) => (
                                    <tr key={opt} className="hover:bg-slate-50 transition-colors">
                                      {critIdx === 0 && optIdx === 0 && (
                                        <td 
                                          className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase border-r border-slate-200 align-middle bg-slate-50/30"
                                          rowSpan={cat.criteria.reduce((acc, c) => acc + c.options.length, 0)}
                                        >
                                          <div className="rotate-180 [writing-mode:vertical-lr] mx-auto">
                                            {cat.category}
                                          </div>
                                        </td>
                                      )}
                                      {optIdx === 0 && (
                                        <td 
                                          className="px-4 py-3 text-[9px] font-bold text-slate-700 uppercase border-r border-slate-200 align-middle bg-white"
                                          rowSpan={crit.options.length}
                                        >
                                          {crit.name}
                                        </td>
                                      )}
                                      <td className="px-4 py-3 text-[10px] text-slate-600 border-r border-slate-200">
                                        {opt}
                                        {opt.includes('(ESPECIFIQUE)') && (
                                          <input 
                                            type="text" 
                                            placeholder="Especifique aquí..."
                                            className="block w-full mt-1 text-[9px] border-b border-slate-200 focus:border-indigo-500 outline-none bg-transparent"
                                          />
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-center border-r border-slate-200">
                                        <input 
                                          type="checkbox" 
                                          checked={formData.dynamic.enfoqueDiferencial[opt]?.titular || false}
                                          onChange={e => {
                                            const current = formData.dynamic.enfoqueDiferencial[opt] || { titular: false, familiar: false };
                                            setFormData({
                                              ...formData,
                                              dynamic: {
                                                ...formData.dynamic,
                                                enfoqueDiferencial: {
                                                  ...formData.dynamic.enfoqueDiferencial,
                                                  [opt]: { ...current, titular: e.target.checked }
                                                }
                                              }
                                            });
                                          }}
                                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <input 
                                          type="checkbox" 
                                          checked={formData.dynamic.enfoqueDiferencial[opt]?.familiar || false}
                                          onChange={e => {
                                            const current = formData.dynamic.enfoqueDiferencial[opt] || { titular: false, familiar: false };
                                            setFormData({
                                              ...formData,
                                              dynamic: {
                                                ...formData.dynamic,
                                                enfoqueDiferencial: {
                                                  ...formData.dynamic.enfoqueDiferencial,
                                                  [opt]: { ...current, familiar: e.target.checked }
                                                }
                                              }
                                            });
                                          }}
                                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </fieldset>

        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <div className="flex gap-2">
            {activeTab > 0 && (
              <button 
                type="button" 
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
              >
                Anterior
              </button>
            )}
            {activeTab < tabs.length - 1 && (
              <button 
                type="button" 
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-100 transition-all"
              >
                Siguiente
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="px-8 py-3 border border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              {readOnly ? 'Cerrar' : 'Cancelar'}
            </button>
            {!readOnly && (
              <button type="submit" className="px-12 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Finalizar y Guardar Informe
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RiskAssessmentReportPage;
