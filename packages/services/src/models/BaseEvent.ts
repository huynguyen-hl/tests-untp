import { VerifiableCredential } from '@vckit/core-types';
import { integrateVckitIssueVC } from '../vckit.service.js';
import { IArgIssueEvent, IBaseEvent, IRender, IStorageEvent } from '../types/BaseEvent.types';
import { uploadJson } from '../storage.service.js';
import { ICreateLinkResolver, createLinkResolver } from '../createLinkResolver.service.js';

/**
 * @description BaseEvent class is the base class for the events extending the class
 * @param renderTemplate - render template for the event
 * @param context - context for the event
 * @param issuer - issuer for the event
 * @param vcKitAPIUrl - api url for the event
 * @param eventType - type of the event
 */
export abstract class BaseEvent {
  readonly issuer: string;
  readonly vcKitAPIUrl: string;
  readonly eventType: string;
  readonly dlrAPIUrl: string;
  readonly storageAPIUrl: string;
  readonly vcType: string[];
  readonly bucket: string;
  readonly verificationPage: string;
  readonly DLR_API_KEY: string;

  readonly renderTemplate?: IRender | null;
  readonly context?: string[];

  constructor({
    renderTemplate,
    context,
    issuer,
    vcKitAPIUrl,
    eventType,
    dlrAPIUrl,
    storageAPIUrl,
    vcType,
    bucket,
    verificationPage,
    DLR_API_KEY,
  }: IBaseEvent) {
    this.issuer = issuer;
    this.eventType = eventType;
    this.vcType = vcType;
    this.vcKitAPIUrl = vcKitAPIUrl;
    this.dlrAPIUrl = dlrAPIUrl;
    this.storageAPIUrl = storageAPIUrl;
    this.renderTemplate = renderTemplate ?? null;
    this.context = context;
    this.bucket = bucket;
    this.verificationPage = verificationPage;
    this.DLR_API_KEY = DLR_API_KEY;
  }

  /**
   * @description issueEvent method is used to issue the VC
   * @param arg - arguments for the VC
   */
  async issueEvent(arg: IArgIssueEvent): Promise<VerifiableCredential> {
    const restOfVC = { render: this.renderTemplate };
    const { credentialPayload, credentialSubject } = arg;
    const credentialValue: VerifiableCredential = await integrateVckitIssueVC({
      context: this.context,
      credentialSubject,
      issuer: this.issuer,
      type: this.vcType,
      vcKitAPIUrl: this.vcKitAPIUrl,
      credentialPayload,
      restOfVC: { ...restOfVC },
    });

    return credentialValue;
  }

  /**
   * @description async storageEvent method is used to store the event to server such as S3
   * @param arg - arguments for the event
   */
  async storageEvent(arg: IStorageEvent) {
    const { typeStorage, ...rest } = arg;

    switch (typeStorage) {
      case 'S3':
        return await uploadJson(rest);
      default:
        throw new Error('typeStorage is not defined');
    }
  }

  /**
   * @description async createLinkResolverEvent method is used to create a link resolver
   * @param arg - arguments for the event
   */
  async createLinkResolverEvent(arg: ICreateLinkResolver) {
    await createLinkResolver(arg);
  }
}
