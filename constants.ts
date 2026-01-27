
import { DocType, CivilStatus, PersonQuality, LegalSystem, ProtectionRequestForm, ProtectionRequestSummary, ProtectionCaseForm, ProtectionMission, FamilyMember } from './types';

export const APP_NAME = "Sistema de Gestión de Protección";

export const CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.jpg', '.jpeg'],
};

export const CITIES = [
  "Bogotá D.C.", "Medellín", "Cali", "Barranquilla", "Cartagena", 
  "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué"
];

export const COLOMBIA_GEO: Record<string, string[]> = {
  "AMAZONAS": ["Leticia", "El Encanto", "La Chorrera", "Puerto Alegría"],
  "ANTIOQUIA": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro", "Turbo"],
  "ARAUCA": ["Arauca", "Arauquita", "Saravena", "Tame"],
  "ATLÁNTICO": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
  "BOLÍVAR": ["Cartagena de Indias", "Magangué", "Turbaco", "El Carmen de Bolívar"],
  "BOYACÁ": ["Tunja", "Sogamoso", "Duitama", "Chiquinquirá"],
  "CALDAS": ["Manizales", "La Dorada", "Riosucio", "Villamaría"],
  "CAQUETÁ": ["Florencia", "San Vicente del Caguán", "Cartagena del Chairá"],
  "CASANARE": ["Yopal", "Aguazul", "Villanueva", "Paz de Ariporo"],
  "CAUCA": ["Popayán", "Santander de Quilichao", "Puerto Tejada"],
  "CESAR": ["Valledupar", "Aguachica", "Agustín Codazzi"],
  "CHOCÓ": ["Quibdó", "Istmina", "Condoto"],
  "CÓRDOBA": ["Montería", "Cereté", "Sahagún", "Lorica"],
  "CUNDINAMARCA": ["Bogotá D.C.", "Soacha", "Fusagasugá", "Facatativá", "Chía", "Girardot"],
  "GUAINÍA": ["Inírida"],
  "GUAVIARE": ["San José del Guaviare"],
  "HUILA": ["Neiva", "Pitalito", "Garzón"],
  "LA GUAJIRA": ["Riohacha", "Maicao", "Uribia"],
  "MAGDALENA": ["Santa Marta", "Ciénaga", "Fundación"],
  "META": ["Villavicencio", "Acacías", "Granada"],
  "NARIÑO": ["Pasto", "Tumaco", "Ipiales"],
  "NORTE DE SANTANDER": ["Cúcuta", "Ocaña", "Villa del Rosario"],
  "PUTUMAYO": ["Mocoa", "Puerto Asís", "Orito"],
  "QUINDÍO": ["Armenia", "Calarcá", "La Tebaida"],
  "RISARALDA": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
  "SAN ANDRÉS Y PROVIDENCIA": ["San Andrés", "Providencia"],
  "SANTANDER": ["Bucaramanga", "Floridablanca", "Girón", "Barrancabermeja"],
  "SUCRE": ["Sincelejo", "Corozal"],
  "SANTANDER DE QUILICHAO": ["SANTANDER DE QUILICHAO"],
  "TOLIMA": ["Ibagué", "Espinal", "Melgar"],
  "VALLE DEL CAUCA": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga", "Cartago"],
  "VAUPÉS": ["Mitú"],
  "VICHADA": ["Puerto Carreño"]
};

// Mock para el Web Service de la Registraduría
// Se incluye birthDate para calcular la mayoría/minoría de 14 años
export const REGISTRY_WS_DB: Record<string, any> = {
  "79123456": {
    firstName: "PEDRO",
    secondName: "PABLO",
    firstSurname: "PÉREZ",
    secondSurname: "GARCÍA",
    petitionerDocType: DocType.CC,
    petitionerDocNumber: "79123456",
    petitionerExpeditionDate: "2010-05-20",
    petitionerExpeditionPlace: "Bogotá D.C.",
    birthDate: "1990-05-20" // Mayor de 14 -> Bloqueado
  },
  "52987654": {
    firstName: "JUANITA",
    secondName: "ESTELLA",
    firstSurname: "CASTRO",
    secondSurname: "LOPEZ",
    petitionerDocType: DocType.CC,
    petitionerDocNumber: "52987654",
    petitionerExpeditionDate: "2015-11-12",
    petitionerExpeditionPlace: "Medellín",
    birthDate: "2000-11-12" // Mayor de 14 -> Bloqueado
  },
  "1105123456": {
    firstName: "SANTIAGO",
    secondName: "",
    firstSurname: "GÓMEZ",
    secondSurname: "RUIZ",
    petitionerDocType: DocType.TI,
    petitionerDocNumber: "1105123456",
    petitionerExpeditionDate: "2023-01-10",
    petitionerExpeditionPlace: "Cali",
    birthDate: "2015-08-20" // Menor de 14 -> Editable
  }
};

export const REGIONAL_UNITS = [
  "Unidad Regional Centro Sur",
  "Unidad Regional Caribe",
  "Unidad Regional Pácifico",
  "Unidad Regional Orinoquía",
  "Unidad Regional Nororiente",
  "Unidad Regional Noroccidente",
  "Nivel Central",
  "Unidad Regional Eje cafetero",
  "Sección satelital Boyacá",
  "Sección satelital Cucuta"
];

export const ENTITIES = [
  "FISCALÍA GENERAL DE LA NACIÓN", "POLICÍA NACIONAL", "DEFENSORÍA DEL PUEBLO", "PROCURADURÍA", "UNP"
];

export const ORIGINS = [
  "INVESTIGACIONES Y EVALUACIONES",
  "VERIFICACIONES",
  "JUSTICIA TRANSICIONAL",
  "GESTION DOCUMENTAL",
  "JURIDICA",
  "OPERATIVA",
  "ASISTENCIA INTEGRAL",
  "ADMINISTRATIVA",
  "ESQUEMAS DE SEGURIDAD",
  "GASTOS RESERVADOS"
];

export const CANDIDATE_CLASSIFICATIONS = [
  "SERVIDOR", "TESTIGO", "VICTIMA", "INTERVINIENTE"
];

export const MOCK_OFFICIALS = [
  "CARLOS ANDRÉS RUIZ",
  "MARÍA FERNANDA LÓPEZ",
  "JORGE ELIÉCER TRUJILLO",
  "DIANA MARCELA RATIVA"
];

export const PROFESSIONS = [
  "ABOGADO",
  "ADMINISTRADOR DE EMPRESAS",
  "ARQUITECTO",
  "COMUNICADOR SOCIAL / PERIODISTA",
  "CONTADOR PÚBLICO",
  "DOCENTE / PROFESOR",
  "ECONOMISTA",
  "ENFERMERO",
  "INGENIERO",
  "MÉDICO",
  "ODONTÓLOGO",
  "PSICÓLOGO",
  "SOCIÓLOGO",
  "TRABAJADOR SOCIAL",
  "TÉCNICO / TECNÓLOGO",
  "AUXILIAR ADMINISTRATIVO",
  "CONDUCTOR",
  "INDEPENDIENTE",
  "SIN PROFESIÓN",
  "OTRA"
];

export const DEPARTMENTS = Object.keys(COLOMBIA_GEO);

export const GENDER_IDENTITIES = [
  "MASCULINO", "FEMENINO", "TRANSGÉNERO", "NO BINARIO", "OTRO"
];

export const SEXUAL_ORIENTATIONS = [
  "HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL", "PANSEXUAL", "NO INFORMA"
];

export const DISABILITIES = [
  "NINGUNA", "FÍSICA", "VISUAL", "AUDITIVA", "COGNITIVA", "PSICOSOCIAL"
];

export const ETHNICITIES = [
  "NINGUNA", "AFROCOLOMBIANO", "INDÍGENA", "RAIZAL", "PALENQUERO", "RROM"
];

export const SUBJECTS = [
  "SOLICITUD EVALUACIÓN DE RIESGO", "SOLICITUD MEDIDAS DE EMERGENCIA", "REVALUACIÓN DE RIESGO", "ESTUDIO DE SEGURIDAD A INSTALACIONES"
];

export const SECCIONES = [
  "Sección de Investigaciones y evaluaciones",
  "Sección de Operaciones",
  "Sección de Asistencia integral",
  "Sección de Justicia transicional",
  "Sección Juridica",
  "Sección de Gestión documental",
  "Sección Administrativa",
  "Sección Gastos Reservados",
  "Sección de Esquemas de seguridad",
  "Area Verificación para el ingreso",
  "PQRS"
];

export const MISSION_TYPES = [
  "IMPLEMENTACIÓN ESQUEMA", "VISITA TÉCNICA", "VERIFICACIÓN"
];

export const EVALUATION_MISSION_TYPES = [
  "Evaluación técnica de amenaza y riesgo",
  "Estudio de riesgo"
];

export const MISSION_CLASSIFICATIONS = [
  "OPERACIONAL", "MISIONAL"
];

export const APPLICANT_ROLES_NEW = [
  "TITULAR", "REPRESENTANTE LEGAL"
];

export const APPLICANT_ROLES_EXISTING = [
  "TITULAR", "FAMILIAR", "REPRESENTANTE LEGAL"
];

export const MOCK_FAMILY_DATA: Record<string, FamilyMember[]> = {
  "CASE-2024-001": [
    {
      id: "fam-1",
      firstName: "MARIA",
      secondName: "ISABEL",
      firstSurname: "PEREZ",
      secondSurname: "RODRIGUEZ",
      docType: "Cédula de Ciudadanía",
      docNumber: "10203040",
      relationship: "CÓNYUGE",
      birthDate: "1992-03-15",
      isActive: true,
      age: "32",
      sex: "FEMENINO",
      residencePlace: "BOGOTÁ D.C."
    },
    {
      id: "fam-2",
      firstName: "JUAN",
      secondName: "ESTEBAN",
      firstSurname: "PEREZ",
      secondSurname: "PEREZ",
      docType: "Tarjeta de Identidad",
      docNumber: "1105123456",
      relationship: "HIJO/A",
      birthDate: "2015-08-20",
      isActive: true,
      age: "9",
      sex: "MASCULINO",
      residencePlace: "BOGOTÁ D.C."
    }
  ],
  "CASE-2024-102": [
    {
        id: "fam-child-1",
        firstName: "NICOLÁS",
        secondName: "ALBERTO",
        firstSurname: "MARÍN",
        secondSurname: "OSPINA",
        docType: "Tarjeta de Identidad",
        docNumber: "1102555333",
        relationship: "HIJO/A",
        birthDate: "2006-05-12",
        isActive: true,
        age: "18",
        sex: "MASCULINO",
        residencePlace: "MEDELLÍN"
    }
  ]
};

export const MOCK_REQUESTS: ProtectionRequestSummary[] = [
  {
    id: "1",
    nunc: "110016000000202300001",
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16 09:30:00",
    status: 'RADICADA',
    docType: DocType.CC,
    docNumber: "79123456",
    firstName: "PEDRO",
    secondName: "PABLO",
    firstSurname: "PÉREZ",
    secondSurname: "GARCÍA",
    requestDate: "2024-05-15",
    isActive: true
  },
  {
    id: "2",
    nunc: "050016000000202400123",
    radicado: "",
    status: 'CREADA',
    docType: DocType.CC,
    docNumber: "52987654",
    firstName: "JUANITA",
    secondName: "ESTELLA",
    firstSurname: "CASTRO",
    secondSurname: "LOPEZ",
    requestDate: "2024-05-18",
    isActive: true
  },
  {
    id: "3",
    nunc: "760016000000202300456",
    radicado: "FGN-2024-987654",
    radicationDate: "2024-04-21 14:15:00",
    status: 'RADICADA',
    docType: DocType.CC,
    docNumber: "900123456",
    firstName: "COMERCIANTES",
    secondName: "UNIDOS",
    firstSurname: "DEL",
    secondSurname: "CENTRO",
    requestDate: "2024-04-20",
    isActive: false
  }
];

export const MOCK_SAVED_CASES: ProtectionCaseForm[] = [
  {
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16",
    destinationUnit: "Unidad Regional Centro Sur",
    remittingEntity: "FISCALÍA GENERAL DE LA NACIÓN",
    candidateClassification: "VICTIMA",
    origin: "BOGOTÁ",
    remitterName: "ROBERTO MARTINEZ",
    requestDepartment: "BOGOTÁ D.C.",
    requestCity: "Bogotá D.C.",
    docType: "Cédula de Ciudadanía",
    docNumber: "79123456",
    firstName: "PEDRO",
    secondName: "PABLO",
    firstSurname: "PÉREZ",
    secondSurname: "GARCÍA",
    applicantRole: "TITULAR",
    subject: "SOLICITUD EVALUACIÓN DE RIESGO",
    assignedArea: "Sección de Investigaciones y evaluaciones",
    missionStartDate: "2024-06-01",
    missionType: "Evaluación técnica de amenaza y riesgo",
    dueDate: "2024-06-15",
    observations: "Caso prioritario por amenazas de BACRIM.",
    folios: "45",
    generateMission: true,
    attachments: [],
    caseId: "CASE-2024-001"
  },
  {
    radicado: "FGN-2024-112233",
    radicationDate: "2024-07-20",
    destinationUnit: "Unidad Regional Pácifico",
    remittingEntity: "FISCALÍA GENERAL DE LA NACIÓN",
    candidateClassification: "TESTIGO",
    origin: "CALI",
    remitterName: "ALVARO URIBE",
    requestDepartment: "VALLE DEL CAUCA",
    requestCity: "Cali",
    docType: "Cédula de Ciudadanía",
    docNumber: "1110555888",
    firstName: "MARCO",
    secondName: "AURELIO",
    firstSurname: "CASAS",
    secondSurname: "MORALES",
    applicantRole: "TITULAR",
    subject: "SOLICITUD MEDIDAS DE EMERGENCIA",
    assignedArea: "Sección de Operaciones",
    missionStartDate: "2024-07-25",
    missionType: "VERIFICACIÓN",
    dueDate: "2024-08-05",
    observations: "Testigo clave en proceso de anticorrupción.",
    folios: "12",
    generateMission: true,
    attachments: [],
    caseId: "CASE-2024-085"
  },
  {
    radicado: "FGN-2024-998877",
    radicationDate: "2024-08-02",
    destinationUnit: "Nivel Central",
    remittingEntity: "DEFENSORÍA DEL PUEBLO",
    candidateClassification: "INTERVINIENTE",
    origin: "MEDELLÍN",
    remitterName: "LUISA FERNANDA",
    requestDepartment: "ANTIOQUIA",
    requestCity: "Medellín",
    docType: "Cédula de Ciudadanía",
    docNumber: "43555222",
    firstName: "ELENA",
    secondName: "",
    firstSurname: "MARIN",
    secondSurname: "OSPINA",
    applicantRole: "REPRESENTANTE LEGAL",
    subject: "REVALUACIÓN DE RIESGO",
    assignedArea: "Sección de Justicia transicional",
    missionStartDate: "2024-08-05",
    missionType: "Evaluación técnica de amenaza y riesgo",
    dueDate: "2024-08-15",
    observations: "Representante legal de su hijo menor de edad vinculado al núcleo familiar.",
    folios: "89",
    generateMission: false,
    attachments: [],
    caseId: "CASE-2024-102"
  },
  {
    radicado: "FGN-2024-774411",
    radicationDate: "2024-08-10",
    destinationUnit: "Unidad Regional Centro Sur",
    remittingEntity: "FISCALÍA GENERAL DE LA NACIÓN",
    candidateClassification: "VICTIMA",
    origin: "BOGOTÁ",
    remitterName: "ROBERTO MARTINEZ",
    requestDepartment: "BOGOTÁ D.C.",
    requestCity: "Bogotá D.C.",
    docType: "Cédula de Ciudadanía",
    docNumber: "10203040",
    firstName: "MARIA",
    secondName: "ISABEL",
    firstSurname: "PEREZ",
    secondSurname: "RODRIGUEZ",
    applicantRole: "FAMILIAR",
    subject: "SOLICITUD EVALUACIÓN DE RIESGO",
    assignedArea: "Sección de Investigaciones y evaluaciones",
    missionStartDate: "2024-08-12",
    missionType: "Evaluación técnica de amenaza y riesgo",
    dueDate: "2024-08-25",
    observations: "Núcleo familiar del señor Pedro Pablo Pérez.",
    folios: "5",
    generateMission: true,
    attachments: [],
    caseId: "CASE-2024-115",
    linkedCaseId: "CASE-2024-001"
  }
];

export const MOCK_MISSIONS: ProtectionMission[] = [
  {
    id: "MT-1",
    missionNo: "MT-2024-8842",
    caseRadicado: "FGN-2024-582910",
    type: "Evaluación técnica de amenaza y riesgo",
    petitionerName: "PEDRO PABLO PÉREZ GARCÍA",
    petitionerDoc: "79123456",
    assignedArea: "Sección de Investigaciones y evaluaciones",
    status: 'PENDIENTE',
    dueDate: "2024-06-15",
    creationDate: "2024-06-01"
  }
];

export const SPOA_SEARCH_DB: Record<string, any> = {
  "110016000000202300001": [
    {
      label: "PROCESO HOMICIDIO - FISCALÍA 45 VIDA",
      data: {
        investigatedFacts: "El día 15 de enero de 2023, en el sector de San Victorino, el ciudadano fue abordado por sujetos armados...",
        legalSystem: LegalSystem.LEY_906,
        investigatedCrimes: "Extorsión Agravada, Amenazas",
        investigationStage: "Indagación",
        fiscalName: "Roberto Martínez",
        fiscalRole: "Fiscal Especializado",
        fiscalUnit: "Unidad de Vida - Fiscalía 45",
        fiscalCorrespondenceAddress: "Diag 22B # 52-01 Bloque F",
        fiscalCell: "3119998877",
        fiscalInstitutionalEmail: "roberto.martinez@fiscalia.gov.co",
        policeName: "Capitán Andrés López",
        policeEntity: "SIJIN - MEBOG",
        policeCell: "3102003000",
        policeEmail: "andres.lopez@policia.gov.co",
        assistantName: "Marta Lucía Restrepo",
        assistantEmail: "marta.restrepo@fiscalia.gov.co",
        assistantCell: "3201234567"
      }
    }
  ],
  "050016000000202400123": [
    {
      label: "PROCESO CONCIERTO PARA DELINQUIR - CTI MEDELLÍN",
      data: {
        investigatedFacts: "Testigo presencial de hechos ocurridos en la Comuna 13 relacionados con Grupos Armados Organizados...",
        legalSystem: LegalSystem.LEY_906,
        investigatedCrimes: "Concierto para Delinquir",
        investigationStage: "Juicio",
        fiscalName: "Angela María Holguín",
        fiscalRole: "Fiscal Local",
        fiscalUnit: "Unidad de Estructura de Apoyo",
        fiscalCorrespondenceAddress: "Carrera 52 # 42-73",
        fiscalCell: "3145556677",
        fiscalInstitutionalEmail: "angela.holguin@fiscalia.gov.co",
        policeName: "Subteniente Carlos Ruiz",
        policeEntity: "CTI Medellín",
        policeCell: "3128889900",
        policeEmail: "carlos.ruiz@fiscalia.gov.co",
        assistantName: "Jorge Isaacs",
        assistantEmail: "jorge.isaacs@fiscalia.gov.co",
        assistantCell: "3114445566"
      }
    }
  ]
};

export const MOCK_FULL_REQUESTS: Record<string, ProtectionRequestForm> = {
  "1": {
    city: "Bogotá D.C.",
    requestDate: "2024-05-15",
    nunc: "110016000000202300001",
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16 09:30:00",
    firstName: "PEDRO",
    secondName: "PABLO",
    firstSurname: "PÉREZ",
    secondSurname: "GARCÍA",
    petitionerDocType: DocType.CC,
    petitionerDocNumber: "79123456",
    petitionerExpeditionPlace: "Bogotá D.C.",
    petitionerExpeditionDate: "1990-05-20",
    residenceAddress: "",
    locationAddress: "Carrera 7 # 32-10 Oficina 202",
    email: "",
    landline: "",
    mobile: "",
    civilStatus: "",
    personQuality: "",
    investigatedFacts: "Homicidio agravado en concurso con concierto para delinquir y porte ilegal de armas.",
    legalSystem: LegalSystem.LEY_906,
    investigatedCrimes: "Homicidio Agravado",
    investigationStage: "Indagación Preliminar",
    proceduralMeasures: "Ninguna por el momento.",
    riskReview: "El solicitante ha recibido amenazas directas mediante panfletos.",
    additionalInfo: "Requiere esquema de seguridad urgente.",
    fiscalName: "Roberto Martínez",
    fiscalRole: "Fiscal Especializado",
    fiscalUnit: "Unidad de Vida - Fiscalía 45",
    fiscalCorrespondenceAddress: "Diag 22B # 52-01 Bloque F",
    fiscalPhone: "",
    fiscalCell: "3119998877",
    fiscalInstitutionalEmail: "roberto.martinez@fiscalia.gov.co",
    fiscalOptionalEmail: "",
    policeName: "Capitán Andrés López",
    policeEntity: "SIJIN - MEBOG",
    policePhone: "",
    policeCell: "3102003000",
    policeEmail: "andres.lopez@policia.gov.co",
    attachments: []
  },
  "2": {
    city: "Medellín",
    requestDate: "2024-05-18",
    nunc: "050016000000202400123",
    firstName: "JUANITA",
    secondName: "ESTELLA",
    firstSurname: "CASTRO",
    secondSurname: "LOPEZ",
    petitionerDocType: DocType.CC,
    petitionerDocNumber: "52987654",
    petitionerExpeditionPlace: "Medellín",
    petitionerExpeditionDate: "2000-11-12",
    residenceAddress: "Carrera 45 # 10-20",
    locationAddress: "Calle 50 # 25-30",
    email: "juanita.castro@example.com",
    landline: "",
    mobile: "3145551234",
    civilStatus: CivilStatus.SINGLE,
    personQuality: PersonQuality.WITNESS,
    investigatedFacts: "Testigo presencial de hechos ocurridos en la Comuna 13 relacionados con Grupos Armados Organizados.",
    legalSystem: LegalSystem.LEY_906,
    investigatedCrimes: "Concierto para Delinquir",
    investigationStage: "Juicio",
    proceduralMeasures: "Se requiere protección durante las audiencias.",
    riskReview: "Vigilancia sospechosa en su lugar de residencia tras testimonio inicial.",
    additionalInfo: "Teme por la seguridad de sus hijos.",
    fiscalName: "Angela María Holguín",
    fiscalRole: "Fiscal Local",
    fiscalUnit: "Unidad de Estructura de Apoyo",
    fiscalCorrespondenceAddress: "Carrera 52 # 42-73",
    fiscalPhone: "",
    fiscalCell: "3145556677",
    fiscalInstitutionalEmail: "angela.holguin@fiscalia.gov.co",
    fiscalOptionalEmail: "",
    policeName: "Subteniente Carlos Ruiz",
    policeEntity: "CTI Medellín",
    policePhone: "",
    policeCell: "3128889900",
    policeEmail: "carlos.ruiz@fiscalia.gov.co",
    attachments: []
  }
};

export const DOC_TYPES = Object.values(DocType);
export const CIVIL_STATUSES = Object.values(CivilStatus);
export const PERSON_QUALITIES = Object.values(PersonQuality);
export const LEGAL_SYSTEMS = Object.values(LegalSystem);
