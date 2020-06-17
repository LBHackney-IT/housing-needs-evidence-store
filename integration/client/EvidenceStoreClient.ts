/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

interface EvidenceStoreClientOptions {
  baseUrl: string;
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

  constructor({ baseUrl }: EvidenceStoreClientOptions) {
    this.baseUrl = baseUrl;
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
}

export default EvidenceStoreClient;