import { ILinkResolver, ILinkResponse, IdentificationKeyType } from '../createLinkResolver.service.js';
import { IBaseEvent } from '../types/BaseEvent.types.js';
import { JsonFormData, LinkType, MimeType } from '../types/index.js';
import { generateUUID } from '../utils/helper.js';
import { BaseEvent } from './BaseEvent.js';

class ObjectEvent extends BaseEvent {
  constructor({
    renderTemplate,
    context,
    issuer,
    eventType,
    vcKitAPIUrl,
    dlrAPIUrl,
    storageAPIUrl,
    vcType,
    bucket,
    typeBucket,
    verificationPage,
    DLR_API_KEY,
  }: IBaseEvent) {
    super({
      renderTemplate,
      context,
      issuer,
      vcKitAPIUrl,
      eventType,
      dlrAPIUrl,
      storageAPIUrl,
      vcType,
      bucket,
      typeBucket,
      verificationPage,
      DLR_API_KEY,
    });
  }
}

// TODO: refactor for reusability, currently only used for Farm app
const registerLinkResolver = async (
  url: string,
  identificationKeyType: IdentificationKeyType,
  identificationKey: string,
  passportTitle: string,
  verificationPage: string,
  dlrAPIUrl: string,
  obj: any,
  DLR_API_KEY: string,
) => {
  const linkResolver: ILinkResolver = {
    identificationKeyType,
    identificationKey: identificationKey,
    itemDescription: `Digital Livestock`,
  };
  const query = encodeURIComponent(JSON.stringify({ payload: { uri: url } }));
  const queryString = `/?q=${query}`;
  const verificationPassportPage = `${verificationPage}${queryString}`;
  const linkResponses: ILinkResponse[] = [
    {
      linkType: LinkType.verificationLinkType,
      linkTitle: 'VCKit verify service',
      targetUrl: verificationPage,
      mimeType: MimeType.textPlain,
    },
    {
      linkType: LinkType.certificationLinkType,
      linkTitle: passportTitle,
      targetUrl: url,
      mimeType: MimeType.applicationJson,
    },
    {
      linkType: LinkType.certificationLinkType,
      linkTitle: passportTitle,
      targetUrl: verificationPassportPage,
      mimeType: MimeType.textHtml,
      defaultLinkType: true,
      defaultIanaLanguage: true,
      defaultMimeType: true,
    },
  ];

  await obj.createLinkResolverEvent({ dlrAPIUrl, linkResolver, linkResponses, queryString, DLR_API_KEY });
  // await createLinkResolver(linkResolver, linkResponses, queryString);
};

export const objectEvent = async (data: JsonFormData, params: any) => {
  try {
    const {
      renderTemplate,
      context,
      issuer,
      eventType,
      vcKitAPIUrl,
      dlrAPIUrl,
      storageAPIUrl,
      vcType,
      typeBucket,
      bucket,
      verificationPage,
      DLR_API_KEY,
    } = params;
    const obj = new ObjectEvent({
      renderTemplate,
      context,
      issuer,
      vcKitAPIUrl,
      eventType,
      dlrAPIUrl,
      storageAPIUrl,
      vcType,
      typeBucket,
      bucket,
      verificationPage,
      DLR_API_KEY,
    });

    const vc = await obj.issueEvent({ credentialSubject: data, type: vcType });
    const NLISID = data.data['herd']['NLIS'] as string;

    const vcUrl = await obj.storageEvent({
      typeStorage: 'S3',
      filename: `${NLISID}/${generateUUID()}`,
      json: vc,
      typeBucket,
      bucket,
      storageAPIUrl,
    });

    await registerLinkResolver(
      vcUrl,
      IdentificationKeyType.nlisid,
      NLISID,
      'Digital Livestock',
      verificationPage,
      dlrAPIUrl,
      obj,
      DLR_API_KEY,
    );
  } catch (error: any) {
    throw new Error(error);
  }
};
