import { CredentialPayload, VerifiableCredential } from '@vckit/core-types';

export type JsonFormData = {
  [key: string]: any;
};

export interface IServices {
  objectEvent(data: JsonFormData, credentialPayload: CredentialPayload): VerifiableCredential;
}

export enum LinkType {
  verificationLinkType = 'gs1:verificationService',
  certificationLinkType = 'gs1:certificationInfo',
  epcisLinkType = 'gs1:epcis',
}

export enum MimeType {
  textPlain = 'text/plain',
  textHtml = 'text/html',
  applicationJson = 'application/json',
}