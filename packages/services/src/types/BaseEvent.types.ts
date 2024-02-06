import { CredentialSubject } from '@vckit/core-types';
import { IUploadedJson } from '../storage.service';

export interface IRender {
  render: [
    {
      template: string;
      '@type': string;
    },
  ];
}

export interface IBaseEvent {
  issuer: string;
  eventType: string;
  vcType: string[];
  vcKitAPIUrl: string;
  dlrAPIUrl: string;
  storageAPIUrl: string;
  typeBucket: string;
  bucket: string;
  verificationPage: string;
  DLR_API_KEY: string;

  renderTemplate?: IRender | null;
  context?: string[];
}

export interface IArgIssueEvent {
  credentialSubject: CredentialSubject;
  type: string[];

  credentialPayload?: unknown;
}

export interface IStorageEvent extends IUploadedJson {
  typeStorage: string;
}
