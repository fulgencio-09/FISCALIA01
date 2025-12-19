
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

export type UserRole = 'FISCAL' | 'GESTOR';

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
  subject: string;
  assignedArea: string;
  missionStartDate: string;
  missionType: string;
  dueDate: string;
  observations: string;
  folios: string;
  generateMission: boolean;
  attachments: File[];
  caseId?: string; // ID interno del caso
}

export interface ProtectionMission {
  id: string;
  missionNo: string;
  caseRadicado: string;
  type: string;
  petitionerName: string;
  petitionerDoc: string;
  assignedArea: string;
  status: 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA';
  dueDate: string;
  creationDate: string;
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
