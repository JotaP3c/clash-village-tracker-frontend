import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIGURATION } from './api-configuration';
import {
  CategoryResponse,
  DashboardResponse,
  HealthResponse,
  SnapshotResponse,
  UpgradeResponse
} from './dashboard.models';

/**
 * Thin HTTP client for the read-only Clash Village Tracker API. It only reads; it never sends the
 * API token or database credentials (those live exclusively in the backend process).
 */
@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly configuration = inject(API_CONFIGURATION);

  get baseUrl(): string {
    return this.configuration.baseUrl;
  }

  get configured(): boolean {
    return this.configuration.baseUrl.length > 0;
  }

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/api/health`);
  }

  dashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/api/village/dashboard`);
  }

  snapshot(): Observable<SnapshotResponse> {
    return this.http.get<SnapshotResponse>(`${this.baseUrl}/api/village/snapshot`);
  }

  categories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/api/village/categories`);
  }

  upgrades(): Observable<UpgradeResponse> {
    return this.http.get<UpgradeResponse>(`${this.baseUrl}/api/village/upgrades`);
  }
}
