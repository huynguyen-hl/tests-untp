import { CredentialPayload, VerifiableCredential } from '@vckit/core-types';
import { contextDefault } from './models/vckit.js';
import { publicAPI } from './utils/httpService.js';

export interface IVcKitIssueVC extends CredentialPayload {
  vcKitAPIUrl: string;
}

/**
 * integrate with vckit to issue vc with default context and type
 * @param context - context for the vc
 * @param type - type for the vc
 * @param issuer - issuer for the vc
 * @param credentialSubject - credential subject for the vc
 * @param restOfVC - rest of the vc
 * @param vcKitAPIUrl - api url for the vc
 * @returns VerifiableCredential
 *
 * @example
 * const context = ['https://www.w3.org/2018/credentials/v1'];
 * const type = ['VerifiableCredential', 'Event'];
 * const issuer = 'did:example:123';
 * const credentialSubject = { id: 'did:example:123', name: 'John Doe' };
 * const restOfVC = { render: {}};
 * const vc = await integrateVckitIssueVC({ context, type, issuer, credentialSubject, restOfVC, vcKitAPIUrl });
 */
export const integrateVckitIssueVC = async ({
  context,
  type,
  issuer,
  credentialSubject,
  restOfVC,
  vcKitAPIUrl,
}: IVcKitIssueVC): Promise<VerifiableCredential> => {
  const body = constructCredentialObject({ context, type, issuer, credentialSubject, ...restOfVC });
  const response = await publicAPI.post<VerifiableCredential>(`${vcKitAPIUrl}/credentials/issue`, body);
  return response;
};

const constructCredentialObject = ({ context, type, issuer, credentialSubject, ...restOfVC }: CredentialPayload) => {
  return {
    credential: {
      '@context': [...contextDefault, ...(context || [])],
      type,
      issuer: {
        id: issuer,
      },
      credentialSubject,
      ...restOfVC,
    },
  };
};
