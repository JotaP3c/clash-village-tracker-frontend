import { InjectionToken } from '@angular/core';

export interface ApiConfiguration {
  baseUrl: string;
}

declare global {
  interface Window {
    __CLASH_TRACKER_API__?: Partial<ApiConfiguration>;
  }
}

export const API_CONFIGURATION = new InjectionToken<ApiConfiguration>('API_CONFIGURATION');

// Default local backend. The read-only API runs on port 8080 by default; override at runtime via
// window.__CLASH_TRACKER_API__ = { baseUrl: '...' } without rebuilding.
const DEFAULT_LOCAL_API = 'http://localhost:8080';

export function readApiConfiguration(): ApiConfiguration {
  const configured = window.__CLASH_TRACKER_API__?.baseUrl?.replace(/\/$/, '');
  return {
    baseUrl: configured && configured.length > 0 ? configured : DEFAULT_LOCAL_API
  };
}
