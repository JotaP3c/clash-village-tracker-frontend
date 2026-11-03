import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardPage } from './dashboard-page';
import { DashboardApiService } from '../../core/api/dashboard-api.service';
import {
  CategoryResponse,
  DashboardResponse,
  UpgradeResponse
} from '../../core/api/dashboard.models';

function dashboardFixture(): DashboardResponse {
  return {
    status: 'PARTIAL_SUCCESS',
    message: 'ok',
    village: {
      playerTag: '#U8J89QP2',
      playerName: 'jaoo',
      townHallLevel: 18,
      snapshotDate: '2026-10-19',
      historicalSnapshot: true,
      goldPassBoost: 0.2,
      permanentBuilders: 6,
      goblinBuilderTemporary: true
    },
    progress: {
      overallProgressPercent: 92.79,
      overallCompletedSteps: 8300,
      overallTotalSteps: 8945,
      overallRemainingSteps: 645,
      permanentProgressPercent: 94.15,
      permanentCompletedSteps: 8295,
      permanentTotalSteps: 8810,
      superchargeProgressPercent: 3.7,
      superchargeCompletedSteps: 5,
      superchargeTotalSteps: 135,
      fullCertified: false,
      fullCertificationMessage: 'FULL não certificado'
    },
    durations: {
      scenarioKnownSeconds: 100,
      scenarioKnownBuilderDays: 2052.81,
      baseKnownSeconds: 200,
      discountedFutureKnownSeconds: 150,
      observedRemainingSeconds: 50,
      exactTotalAvailable: false,
      unknownStepKeyCount: 10
    },
    builders: {
      permanentBuilderCapacity: 6,
      goblinBuilderTemporary: true,
      builderQueueDays: 72,
      laboratoryQueueDays: 10,
      petQueueDays: 2,
      estimatedBuilderCalendarDaysLowerBound: 12
    },
    categories: [
      { category: 'Defesas', completedSteps: 533, totalSteps: 619, remainingSteps: 86, progressPercent: 86.11, entityCount: 16, unknownEntityCount: 0 }
    ],
    dataQuality: {
      coveragePercent: 91.06,
      unknownEntityCount: 11,
      potentiallyMissingEntityCount: 14,
      unknownUpgradeStepCount: 309,
      validationIssueCount: 32
    }
  };
}

function categoriesFixture(): CategoryResponse {
  return {
    categories: [
      {
        category: 'Defesas',
        completedSteps: 533,
        totalSteps: 619,
        remainingSteps: 86,
        progressPercent: 86.11,
        entityCount: 16,
        unknownEntityCount: 0,
        entities: [
          {
            entityKey: 'air_defense',
            name: 'Defesa Aérea',
            category: 'Defesas',
            quantity: 4,
            currentLevel: 16,
            maxLevel: 16,
            countAtMax: 4,
            maxSupercharge: 2,
            sc1Completed: 1,
            sc2Completed: 0,
            sc3Completed: 0,
            representation: 'AGGREGATED',
            confidence: 'print',
            notes: ''
          }
        ]
      }
    ]
  };
}

function upgradesFixture(): UpgradeResponse {
  const base = {
    category: 'Defesas',
    stage: 'x',
    fromLevel: 1,
    toLevel: 2,
    count: 1,
    activeCount: 0,
    futureCount: 1,
    queue: 'BUILDER',
    baseDurationSecondsPerUnit: 86400,
    baseDurationDaysPerUnit: 1,
    discountedDurationSecondsPerUnit: 69120,
    discountedDurationDaysPerUnit: 0.8,
    observedRemainingSecondsTotal: 0,
    durationKnown: true,
    source: 'x',
    confidence: 'confirmado'
  };
  return {
    totalRows: 2,
    inProgressRows: 0,
    upgrades: [
      { ...base, item: 'Canhão', upgradeType: 'PERMANENT' },
      { ...base, item: 'Morteiro', upgradeType: 'SUPERCHARGE', stage: 'SC1' }
    ]
  };
}

function officialUnavailable() {
  return of({
    available: false,
    message: 'Nenhuma coleta encontrada.',
    collectionId: null,
    requestedTag: null,
    returnedTag: null,
    httpStatus: null,
    outcome: null,
    collectedAt: null,
    bodySha256: null,
    profile: null
  });
}

function configureWith(api: Partial<DashboardApiService>) {
  // Provide a default officialProfile unless the test overrides it, so forkJoin always completes.
  const withDefaults: Partial<DashboardApiService> = {
    officialProfile: () => officialUnavailable() as never,
    ...api
  };
  TestBed.configureTestingModule({
    imports: [DashboardPage],
    providers: [{ provide: DashboardApiService, useValue: withDefaults }]
  });
  return TestBed.createComponent(DashboardPage);
}

describe('DashboardPage', () => {
  it('loads data and renders the ready state with real values', () => {
    const fixture = configureWith({
      baseUrl: 'http://localhost:8080',
      dashboard: () => of(dashboardFixture()),
      categories: () => of(categoriesFixture()),
      upgrades: () => of(upgradesFixture())
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('jaoo');
    expect(text).toContain('#U8J89QP2');
    // Overall progress percent is rendered.
    expect(text).toContain('92.8');
  });

  it('separates supercharge rows from permanent rows', () => {
    const fixture = configureWith({
      baseUrl: 'http://localhost:8080',
      dashboard: () => of(dashboardFixture()),
      categories: () => of(categoriesFixture()),
      upgrades: () => of(upgradesFixture())
    });
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      supercharges: () => unknown[];
      permanentUpgrades: () => unknown[];
    };
    expect(component.supercharges().length).toBe(1);
    expect(component.permanentUpgrades().length).toBe(1);
  });

  it('shows an explicit error state when the API fails and does not fabricate data', () => {
    const fixture = configureWith({
      baseUrl: 'http://localhost:8080',
      dashboard: () => throwError(() => new Error('connection refused')),
      categories: () => of(categoriesFixture()),
      upgrades: () => of(upgradesFixture())
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Backend indisponível');
    expect(text).not.toContain('jaoo');
  });

  it('formats unknown durations as "desconhecido" instead of zero', () => {
    const fixture = configureWith({
      baseUrl: 'http://localhost:8080',
      dashboard: () => of(dashboardFixture()),
      categories: () => of(categoriesFixture()),
      upgrades: () => of(upgradesFixture())
    });
    const component = fixture.componentInstance as unknown as {
      formatDays: (d: number | null | undefined) => string;
    };
    expect(component.formatDays(null)).toBe('desconhecido');
    expect(component.formatDays(undefined)).toBe('desconhecido');
    expect(component.formatDays(1)).toBe('1d 0h');
  });
});
