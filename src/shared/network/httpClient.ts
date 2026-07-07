import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { apiConfig } from './apiConfig';
import { mapToApiError } from './errorMapper';
import { logger } from '../logging/logger';
import { getAuthToken, clearSession } from '../auth/useSession';
import { RequestConfig } from '../types/api';

class HttpClient {
  private instance: AxiosInstance;
  private onSessionExpired: (() => void) | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: apiConfig.baseUrl,
      timeout: apiConfig.timeout,
    });

    this.instance.interceptors.request.use(async (config) => {
      const token = await getAuthToken();
      if (token && !config.headers.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      logger.debug(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        // Guard against malformed/partial JSON payloads
        if (response.data === null || response.data === undefined) {
          throw new Error('Empty response body');
        }
        return response;
      },
      (error) => {
        const apiError = mapToApiError(error);
        logger.error(`[HTTP ERROR] ${apiError.code}: ${apiError.message}`);

        if (apiError.isSessionExpired) {
          clearSession();
          this.onSessionExpired?.();
        }

        return Promise.reject(apiError);
      }
    );
  }

  registerSessionExpiredHandler(handler: () => void) {
    this.onSessionExpired = handler;
  }

  async get<T>(url: string, config?: RequestConfig & AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<T>(url, config);
    return res.data;
  }

  async post<T>(url: string, body?: unknown, config?: RequestConfig & AxiosRequestConfig): Promise<T> {
    const res = await this.instance.post<T>(url, body, config);
    return res.data;
  }

  async put<T>(url: string, body?: unknown, config?: RequestConfig & AxiosRequestConfig): Promise<T> {
    const res = await this.instance.put<T>(url, body, config);
    return res.data;
  }

  async delete<T>(url: string, config?: RequestConfig & AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<T>(url, config);
    return res.data;
  }
}

export const httpClient = new HttpClient();