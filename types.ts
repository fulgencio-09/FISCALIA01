
export enum DocType {
  CC = 'Cédula de Ciudadanía',
  CE = 'Cédula de Extranjería',
  TI = 'Tarjeta de Identidad',
  PAS = 'Pasaporte'
}

export enum CivilStatus {
  SINGLE = 'Soltero/a',
  MARRIED = 'Casado/a',
  DIVORCED = 'Divorciado/a',
  WIDOWED = 'Viudo/a',
  UNION = 'Unión Libre'
}

export enum PersonQuality {
  VICTIM = 'Victima',
  WITNESS = 'Testigo',
  INTERVENER = 'Interviniente',
  SERVER_FGN = 'Servidor FGN',
  NONE = 'Ninguno'
}

export enum LegalSystem {
  LEY_600 = 'Ley 600 de 2000',
  LEY_906 = 'Ley 906 de 2004'
}

export type UserRole = 'FISCAL' | 'GESTOR' | 'LIDER';

export interface FamilyMember {
  id: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  docType: string;
  docNumber: string;
  relationship: string;
  birthDate: string;
  isActive: boolean;
  age?: string;
  residencePlace?: string;
  sex?: string;
}

export interface Pet {
  id: string;
  species: string;
  name: string;
  breed: string;
  sex: string;
  age: string;
  weight: string;
  isSterilized: boolean;
  isVaccinated: boolean;
  isDewormed: boolean;
}

export interface ProtectionMission {
  id: string;
  missionNo: string;
  caseRadicado: string;
  type: string;
  missionClassification?: string;
  petitionerName: string;
  petitionerDoc: string;
  assignedArea: string;
  status: 'PENDIENTE' | 'ASIGNADA' | 'ACTIVA' | 'FINALIZADA' | 'ANULADA';
  dueDate: string;
  creationDate: string;
  assignedOfficial?: string;
  regional?: string;
  reassignmentDate?: string;
  observations?: string;
}

export interface ITVRForm {
  // Datos Misión
  evaluationNo: string; // Nuevo: Numero de evaluación
  evaluationDate: string; // Nuevo: Fecha de evaluación
  missionNo: string;
  caseNo: string;
  radicado: string;
  evaluator: string;
  
  // 1. Amenaza
  realidadAmenaza: string;
  obs1: string;
  individualidadAmenaza: string;
  obs2: string;
  situacionAmenazado: string;
  obs3: string;
  escenarioAmenaza: string;
  obs4: string;
  generadorAmenaza: string;
  obs5: string;
  capacidadAmenaza: string;
  obs6: string;
  interesAmenaza: string;
  obs7: string;
  inminenciaAmenaza: string;
  obs8: string;

  // 2. Riesgo Específico
  especificoIndividualizable: string;
  obs9: string;
  concreto: string;
  obs10: string;
  presente: string;
  obs11: string;
  importante: string;
  obs12: string;
  serio: string;
  obs13: string;
  claroDiscernible: string;
  obs14: string;
  excepcional: string;
  obs15: string;
  proporcionalidad: string;
  obs16: string;
  graveInminente: string;
  obs17: string;

  // 3. Vulnerabilidad
  conductasComportamientos: string;
  obs18: string;
  permanenciaZona: string;
  obs19: string;
  vulnerabilidadResidencial: string;
  obs20: string;
  vulnerabilidadLaboral: string;
  obs21: string;
  vulnerabilidadDesplazamientos: string;
  obs22: string;
  presenciaFDG: string;
  obs23: string;
  vulnerabilidadAsociadaFDG: string;
  obs24: string;
  vulnerabilidadAsociadaGenero: string;
  obs25: string;
  vulnerabilidadesNucleo: string;
  obs26: string;
}

export interface TechnicalInterviewForm {
  caseNumber: string;
  missionNumber: string;
  missionObject: string;
  assignedEvaluator: string;
  regional: string;
  interviewAuthorized: 'SI' | 'NO' | 'NO APLICA' | '';
  place: string;
  date: string;
  startTime: string;
  endTime: string;
  name1: string;
  name2: string;
  surname1: string;
  surname2: string;
  docType: string;
  docNumber: string;
  expeditionDate: string;
  expeditionPlace: string;
  birthPlace: string;
  birthDepartment: string;
  birthMunicipality: string;
  birthDate: string;
  age: string;
  sex: string;
  residenceAddress: string;
  residenceDepartment: string;
  residenceMunicipality: string;
  correspondenceAddress: string;
  correspondenceDepartment: string;
  correspondenceMunicipality: string;
  email: string;
  phoneLandline: string;
  phoneMobile: string;
  phoneOther: string;
  zone: 'URBANA' | 'RURAL' | '';
  ruvRegistered: 'SI' | 'NO' | '';
  rumvRegistered: 'SI' | 'NO' | '';
  personQuality: string;
  civilStatus: string;
  dependentsCount: string;
  educationLevel: string;
  occupation: string;
  profession: string;
  monthlyIncome: string;
  observationsGeneral: string;
  familyMembers: FamilyMember[];
  hasPets: 'SI' | 'NO' | '';
  petsCount: string;
  pets: Pet[];
  petHealthCondition: string;
  isSpecialBreed: 'SI' | 'NO' | '';
  hasTravelResources: 'SI' | 'NO' | '';
  petObservations: string;
  physicalIllness: 'SI' | 'NO' | '';
  physicalIllnessDetails: string;
  hospitalizedPhysical: 'SI' | 'NO' | '';
  familyPhysicalIllness: 'SI' | 'NO' | '';
  familyPhysicalIllnessDetails: string;
  familyPhysicalWho: string;
  familyPhysicalHospitalized: 'SI' | 'NO' | '';
  mentalIllness: 'SI' | 'NO' | '';
  mentalIllnessDetails: string;
  hospitalizedMental: 'SI' | 'NO' | '';
  familyMentalIllness: 'SI' | 'NO' | '';
  familyMentalIllnessDetails: string;
  familyMentalWho: string;
  familyMentalHospitalized: 'SI' | 'NO' | '';
  uninterruptibleMeds: string;
  whoInTreatment: string;
  whoInTreatmentDetail: string;
  consumesSubstances: 'SI' | 'NO' | '';
  substancesDetails: string;
  consumptionTime: string;
  familyConsumesSubstances: 'SI' | 'NO' | '';
  familyConsumesWho: string;
  familySubstancesDetails: string;
  inTreatmentSubstances: 'SI' | 'NO' | '';
  familyInTreatmentSubstances: 'SI' | 'NO' | '';
  familyInTreatmentWho: string;
  proceduralIntervention: string;
  threatsReceived: string;
  hasConvictions: 'SI' | 'NO' | '';
  hasConvictionsDetails: string;
  isSubstituteBeneficiary: 'SI' | 'NO' | '';
  isSubstituteBeneficiaryDetails: string;
  previouslyEvaluated: 'SI' | 'NO' | '';
  previouslyEvaluatedWhich: string;
  hasCurrentMeasures: 'SI' | 'NO' | '';
  currentMeasuresWho: string;
  appliesSecurityNorms: 'SI' | 'NO' | 'ALGUNAS VECES' | '';
  remainsInRiskZone: 'SI' | 'NO' | 'ALGUNAS VECES' | '';
  illegalOrgsInSector: 'SI' | 'NO' | '';
  techSecurityMeans: 'SI' | 'NO' | '';
  policeSupportNearby: 'SI' | 'NO' | '';
  housePhysicalDescription: string;
  workEnvironmentVulnerability: string;
  dailyMobilityVulnerability: string;
  differentialFactors: Record<string, { titular: boolean; familiar: boolean }>;
  observationsDifferential: string;
  vulnerabilityDifferentialPop: string;
  vulnerabilityGender: string;
  vulnerabilityFamilyEnvironment: string;
}

export interface ProtectionCaseForm {
  radicado: string;
  radicationDate: string;
  destinationUnit: string;
  remittingEntity: string;
  candidateClassification: string;
  origin: string;
  remitterName: string;
  requestDepartment: string;
  requestCity: string;
  docType: string;
  docNumber: string;
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  applicantRole: string;
  subject?: string;
  assignedArea: string;
  missionStartDate: string;
  missionType: string;
  missionClassification?: string;
  dueDate: string;
  observations: string;
  folios: string;
  generateMission: boolean;
  attachments: File[];
  caseId?: string;
  linkedCaseId?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export type RequestProcessStatus = 'CREADA' | 'RADICADA';

export interface ProtectionRequestSummary {
  id: string;
  nunc: string;
  radicado: string;
  radicationDate?: string;
  status: RequestProcessStatus;
  docType: string;
  docNumber: string;
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  requestDate: string;
  isActive: boolean;
}

export interface ProtectionRequestForm {
  city: string;
  requestDate: string;
  nunc: string;
  radicado?: string;
  radicationDate?: string;
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  petitionerDocType: string;
  petitionerDocNumber: string;
  petitionerExpeditionPlace: string;
  petitionerExpeditionDate: string;
  residenceAddress: string;
  locationAddress: string;
  email: string;
  landline: string;
  mobile: string;
  civilStatus: string;
  personQuality: string;
  investigatedFacts: string;
  legalSystem: string;
  investigatedCrimes: string;
  investigationStage: string;
  proceduralMeasures: string;
  riskReview: string;
  additionalInfo: string;
  fiscalName: string;
  fiscalRole: string;
  fiscalUnit: string;
  fiscalCorrespondenceAddress: string;
  fiscalPhone: string;
  fiscalCell: string;
  fiscalInstitutionalEmail: string;
  fiscalOptionalEmail: string;
  policeName: string;
  policeEntity: string;
  policePhone: string;
  policeCell: string;
  policeEmail: string;
  assistantName?: string;
  assistantEmail?: string;
  assistantPhone?: string;
  assistantCell?: string;
  attachments: File[];
}
