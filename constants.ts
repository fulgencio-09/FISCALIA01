
import { DocType, CivilStatus, PersonQuality, LegalSystem, ProtectionRequestForm, ProtectionRequestSummary, ProtectionCaseForm, ProtectionMission } from './types';

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
  "TOLIMA": ["Ibagué", "Espinal", "Melgar"],
  "VALLE DEL CAUCA": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga", "Cartago"],
  "VAUPÉS": ["Mitú"],
  "VICHADA": ["Puerto Carreño"]
};

export const REGIONAL_UNITS = [
  "REGIONAL BARRANQUILLA", "REGIONAL BOGOTÁ", "REGIONAL CALI", "REGIONAL MEDELLÍN", "REGIONAL CÚCUTA", "NIVEL CENTRAL"
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

export const AREAS = [
  "PROTECCIÓN A PERSONAS", "PROTECCIÓN A INSTALACIONES", "INTELIGENCIA PROTECTIVA"
];

export const MISSION_TYPES = [
  "EVALUACIÓN DE RIESGO", "IMPLEMENTACIÓN ESQUEMA", "VISITA TÉCNICA", "VERIFICACIÓN"
];

export const MOCK_REQUESTS: ProtectionRequestSummary[] = [
  {
    id: "1",
    nunc: "110016000000202300001",
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16 09:30:00",
    status: 'RADICADA',
    docType: DocType.CC,
    docNumber: "79123456",
    fullName: "Pedro Pablo Pérez",
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
    fullName: "Juanita Castro",
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
    fullName: "Comerciantes Unidos del Centro",
    requestDate: "2024-04-20",
    isActive: false
  }
];

export const MOCK_SAVED_CASES: ProtectionCaseForm[] = [
  {
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16",
    destinationUnit: "REGIONAL BOGOTÁ",
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
    secondSurname: "",
    subject: "SOLICITUD EVALUACIÓN DE RIESGO",
    assignedArea: "PROTECCIÓN A PERSONAS",
    missionStartDate: "2024-06-01",
    missionType: "EVALUACIÓN DE RIESGO",
    dueDate: "2024-06-15",
    observations: "Caso prioritario por amenazas de BACRIM.",
    folios: "45",
    generateMission: true,
    attachments: [],
    caseId: "CASE-2024-001"
  }
];

export const MOCK_MISSIONS: ProtectionMission[] = [
  {
    id: "MT-1",
    missionNo: "MT-2024-8842",
    caseRadicado: "FGN-2024-582910",
    type: "EVALUACIÓN DE RIESGO",
    petitionerName: "PEDRO PABLO PÉREZ",
    petitionerDoc: "79123456",
    assignedArea: "PROTECCIÓN A PERSONAS",
    status: 'PENDIENTE',
    dueDate: "2024-06-15",
    creationDate: "2024-06-01"
  }
];

export const MOCK_FULL_REQUESTS: Record<string, ProtectionRequestForm> = {
  "1": {
    city: "Bogotá D.C.",
    requestDate: "2024-05-15",
    nunc: "110016000000202300001",
    radicado: "FGN-2024-582910",
    radicationDate: "2024-05-16 09:30:00",
    petitionerName: "Pedro Pablo Pérez",
    petitionerDocType: DocType.CC,
    petitionerDocNumber: "79123456",
    petitionerExpeditionPlace: "Bogotá D.C.",
    petitionerExpeditionDate: "1990-05-20",
    residenceAddress: "Calle 123 # 45-67",
    locationAddress: "Carrera 7 # 32-10 Oficina 202",
    email: "pedro.perez@example.com",
    landline: "",
    mobile: "3001234567",
    civilStatus: CivilStatus.SINGLE,
    personQuality: PersonQuality.VICTIM,
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
    petitionerName: "Juanita Castro",
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

export const SPOA_SEARCH_DB: Record<string, any> = {
  "110016000000202300001": [
    {
      label: "Pedro Pablo Pérez (Victima) - CC 79123456",
      data: {
        petitionerName: "Pedro Pablo Pérez",
        petitionerDocType: DocType.CC,
        petitionerDocNumber: "79123456",
        petitionerExpeditionPlace: "Bogotá D.C.",
        petitionerExpeditionDate: "1990-05-20",
        personQuality: PersonQuality.VICTIM,
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
      label: "Juanita Castro (Testigo) - CC 52987654",
      data: {
        petitionerName: "Juanita Castro",
        petitionerDocType: DocType.CC,
        petitionerDocNumber: "52987654",
        petitionerExpeditionPlace: "Medellín",
        petitionerExpeditionDate: "2000-11-12",
        personQuality: PersonQuality.WITNESS,
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

export const DOC_TYPES = Object.values(DocType);
export const CIVIL_STATUSES = Object.values(CivilStatus);
export const PERSON_QUALITIES = Object.values(PersonQuality);
export const LEGAL_SYSTEMS = Object.values(LegalSystem);
