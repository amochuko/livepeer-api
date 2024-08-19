/* eslint-disable @typescript-eslint/consistent-type-definitions */

import tus from 'tus-js-client';
import { LIVEPEER_API_KEY, LIVEPEER_API_URL } from '../configs/env';
import {
  FetchArgs,
  IRequestUploadURLReponse,
  LivepeerApiArgs,
  LivepeerCacheAsset,
} from '../types/definitions';

export default class Livepeer {
  private apiKey: string;
  private baseUrl: string = LIVEPEER_API_URL;

  constructor({ apiKey }: LivepeerApiArgs) {
    this.apiKey = apiKey;
  }

  private async _fetch({ url, method, body, cache = 'no-store' }: FetchArgs) {
    const headers = new Headers();
    headers.append('Content-Tpye', 'application/json');
    headers.append('Authorization', `Bearer ${this.apiKey}`);

    const opts: RequestInit = {
      cache,
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        throw new Error(`HTTP error status: ${res.status}`);
      }
      return await res.json();
    } catch (err: unknown) {
      console.log('_fetch()::Error: ', err);
      throw err;
    }
  }

  async getAll(): Promise<LivepeerCacheAsset[] | []> {
    try {
      const url = `${this.baseUrl}/asset`;
      const res = await this._fetch({ url, method: 'GET' });
      return res;
    } catch (err: unknown) {
      console.error('getAll()::Error: ', err);
      throw err;
    }
  }

  async getById(id: string): Promise<LivepeerCacheAsset> {
    try {
      const url = `${this.baseUrl}/asset/${id}`;
      const res = await this._fetch({ url, method: 'GET' });
      return res;
    } catch (err) {
      console.error('getById()::Error: ', err);
      throw new Error('Failed to fetch Asset...');
    }
  }

  // To upload an asset, you first need to request
  // for a direct upload URL and only then actually
  // upload the contents of the asset.
  private async _requestUploadURL(
    assertName: string,
  ): Promise<IRequestUploadURLReponse> {
    try {
      const url = 'https://livepeer.studio/api/asset/request-upload';
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LIVEPEER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assertName),
      };

      // Perform the fetch request
      const res = await fetch(url, options);

      if (!res.ok) {
        // Check if the response was successful
        throw new Error('Network response was not ok');
      }

      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async createAsset(formData: FormData): Promise<unknown> {
    let resultObjet: {
      percent?: string;
      success?: boolean;
      err?: Error | tus.DetailedError;
    } = {
      percent: '',
    };

    try {
      const result = await this._requestUploadURL(String(formData.get('filename')));
      const upload = new tus.Upload(formData.get('file') as File, {
        endpoint: result.tusEndpoint,
        metadata: {
          filename: String(formData.get('filename')),
          fileType: String(formData.get('type')),
        },
        uploadSize: Number(formData.get('size')),
        onError(err) {
          console.error('Error upload file: ', err);
          resultObjet.err = err;
        },
        onProgress(bytesUploadded, bytesTotal) {
          resultObjet.percent = ((bytesUploadded / bytesTotal) * 100).toFixed(
            2,
          );
          console.log(`Uploaded ${resultObjet.percent}%`);
        },
        onSuccess() {
          console.log('Upload completed: ', upload.url);
          resultObjet.success = true;
          return resultObjet;
        },
      });
      const previousUpload = await upload.findPreviousUploads();
      if (previousUpload.length > 0) {
        upload.resumeFromPreviousUpload(previousUpload[0]);
      }
      upload.start();

      return undefined;
    } catch (err) {
      console.error('createAsset error:', err);
      throw err;
    }
  }

  async updateAsset(
    id: string,
    updatedItem: undefined,
  ): Promise<unknown | null> {
    try {
      const url = `${this.baseUrl}/asset/${id}`;
      const res = await this._fetch({ url, method: 'PUT', body: updatedItem });
      return res;
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  }

  async deleteById(id: string) {
    try {
      const url = `${this.baseUrl}/asset/${id}`;
      await this._fetch({
        url,
        method: 'DELETE',
      });
      return { message: 'Deleted Invoice' };
    } catch (err) {
      console.error('Delete error:', err);
      throw new Error('Failed to fetch Asset..');
    }
  }

  async deleteMany({ filterBy }: { filterBy: string }): Promise<void> {
    const assets = await this.getAll();
    const filterredArr: string[] = [];

    assets.forEach(async (asset: Partial<LivepeerCacheAsset>) => {
      if (asset.id && filterBy === 'hash' && asset.hash === null) {
        filterredArr.push(asset.id);
      }
    });

    filterredArr.forEach(async id => {
      await this.deleteById(id);
    });
  }
}
