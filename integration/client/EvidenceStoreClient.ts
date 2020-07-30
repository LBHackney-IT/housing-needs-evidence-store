/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

interface EvidenceStoreClientOptions {
  baseUrl: string;
  authorizationToken: string;
}

interface Request {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
}

interface Response {
  statusCode: number;
  headers: { [key: string]: any };
  body?: any;
}

class EvidenceStoreClient {
  baseUrl: string;
  authorizationToken?: string;

  constructor({ baseUrl, authorizationToken }: EvidenceStoreClientOptions) {
    this.baseUrl = baseUrl;
    this.authorizationToken = authorizationToken;
  }

  async request({ method, path, body }: Request): Promise<Response> {
    const requestUrl = [this.baseUrl, path].join('');

    console.log(JSON.stringify({
      message: 'Sending HTTP request',
      method,
      requestUrl,
      body: body ?? '<<not set>>',
    }, undefined, 2));

    const response = await fetch(requestUrl, {
      method,
      body: JSON.stringify(body),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${this.authorizationToken}`
      },
    });

    let responseBody = null;
    try {
      responseBody = await response.json();
    } catch (err) {
      console.debug(JSON.stringify({
        message: 'Unable to parse response body (maybe empty?), setting null.',
        requestUrl: requestUrl,
        responseStatusCode: response.status,
      }, undefined, 2));
    }

    return {
      statusCode: response.status,
      headers: response.headers,
      body: responseBody,
    };
  }

  health(): Promise<Response> {
    return this.request({ method: 'GET', path: '/health' });
  }

  saveMetadata(body: { [key: string]: any }): Promise<Response> {
    return this.request({ method: 'POST', path: '/metadata', body });
  }

  getMetadata(documentId: string): Promise<Response> {
    return this.request({ method: 'GET', path: `/${documentId}` });
  }
}

export default EvidenceStoreClient;
