
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

export interface TechnicalInterviewForm {
  // Sección 1: Datos Misión (Precargados)
  caseNumber: string;
  missionNumber: string;
  missionObject: string;
  assignedEvaluator: string;
  regional: string;
  interviewAuthorized: 'SI' | 'NO' | 'NO APLICA' | '';
  
  // Sección 1: Control (Evaluador)
  place: string;
  date: string;
  startTime: string;
  endTime: string;
  
  // Sección 2: Candidato (Precargados)
  name1: string;
  name2: string;
  surname1: string;
  surname2: string;
  docType: string;
  docNumber: string;
  expeditionDate: string;
  expeditionPlace: string;
  // Sección 2: Complementarios (Evaluador)
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
  
  // Sección 3: Caracterización
  personQuality: string;
  civilStatus: string;
  dependentsCount: string;
  educationLevel: string;
  occupation: string;
  profession: string;
  monthlyIncome: string;
  observationsGeneral: string;
  
  // Sección 4: Familia
  familyMembers: FamilyMember[];
  
  // Sección 5: Animales
  hasPets: 'SI' | 'NO' | '';
  petsCount: string;
  pets: Pet[];
  petHealthCondition: string;
  isSpecialBreed: 'SI' | 'NO' | '';
  hasTravelResources: 'SI' | 'NO' | '';
  petObservations: string;
  
  // Sección 6: Médicos y Clínicos
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
  
  // Consumo
  consumesSubstances: 'SI' | 'NO' | '';
  substancesDetails: string;
  consumptionTime: string;
  familyConsumesSubstances: 'SI' | 'NO' | '';
  familyConsumesWho: string;
  familySubstancesDetails: string;
  inTreatmentSubstances: 'SI' | 'NO' | '';
  familyInTreatmentSubstances: 'SI' | 'NO' | '';
  familyInTreatmentWho: string;

  // Sección 7: Intervención Procesal y Vulnerabilidades
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
  
  // Sección 8: Factores Diferenciales
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
  subject?: string;
  assignedArea: string;
  missionStartDate: string;
  missionType: string;
  dueDate: string;
  observations: string;
  folios: string;
  generateMission: boolean;
  attachments: File[];
  caseId?: string; 
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
  fullName: string;
  requestDate: string;
  isActive: boolean;
}

export interface ProtectionRequestForm {
  city: string;
  requestDate: string;
  nunc: string;
  radicado?: string;
  radicationDate?: string;
  petitionerName: string;
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
