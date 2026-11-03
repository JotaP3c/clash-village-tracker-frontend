import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { DashboardApiService } from './dashboard-api.service';
import { API_CONFIGURATION } from './api-configuration';
import { DashboardResponse } from './dashboard.models';

describe('DashboardApiService', () => {
  let service: DashboardApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIGURATION, useValue: { baseUrl } },
        DashboardApiService
      ]
    });
    service = TestBed.inject(DashboardApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('reports configured when a base URL is present', () => {
    expect(service.configured).toBe(true);
    expect(service.baseUrl).toBe(baseUrl);
  });

  it('calls the health endpoint', () => {
    service.health().subscribe((response) => {
      expect(response.status).toBe('UP');
    });
    const request = httpMock.expectOne(`${baseUrl}/api/health`);
    expect(request.request.method).toBe('GET');
    request.flush({ status: 'UP', application: 'clash-village-tracker', mode: 'offline-historical', time: 'now' });
  });

  it('calls the dashboard endpoint and passes the body through unchanged', () => {
    const payload = {
      status: 'PARTIAL_SUCCESS',
      village: { playerTag: '#U8J89QP2', townHallLevel: 18 }
    } as unknown as DashboardResponse;

    let received: DashboardResponse | undefined;
    service.dashboard().subscribe((response) => (received = response));

    const request = httpMock.expectOne(`${baseUrl}/api/village/dashboard`);
    expect(request.request.method).toBe('GET');
    request.flush(payload);

    expect(received?.village.playerTag).toBe('#U8J89QP2');
    expect(received?.village.townHallLevel).toBe(18);
  });

  it('calls snapshot, categories and upgrades on their own URLs', () => {
    service.snapshot().subscribe();
    service.categories().subscribe();
    service.upgrades().subscribe();

    httpMock.expectOne(`${baseUrl}/api/village/snapshot`).flush({});
    httpMock.expectOne(`${baseUrl}/api/village/categories`).flush({ categories: [] });
    httpMock.expectOne(`${baseUrl}/api/village/upgrades`).flush({ totalRows: 0, inProgressRows: 0, upgrades: [] });
  });
});
