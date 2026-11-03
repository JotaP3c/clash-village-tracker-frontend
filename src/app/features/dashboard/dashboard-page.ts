import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardApiService } from '../../core/api/dashboard-api.service';
import {
  CategoryResponse,
  DashboardResponse,
  OfficialProfileResponse,
  UpgradeResponse,
  UpgradeRow
} from '../../core/api/dashboard.models';

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-dashboard-page',
  imports: [DecimalPipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  private readonly api = inject(DashboardApiService);

  protected readonly state = signal<LoadState>('loading');
  protected readonly errorMessage = signal<string>('');
  protected readonly dashboard = signal<DashboardResponse | null>(null);
  protected readonly categories = signal<CategoryResponse | null>(null);
  protected readonly upgrades = signal<UpgradeResponse | null>(null);
  protected readonly officialProfile = signal<OfficialProfileResponse | null>(null);
  protected readonly selectedCategory = signal<string | null>(null);

  protected readonly baseUrl = this.api.baseUrl;

  /** Conic-gradient style for the overall progress donut. */
  protected readonly donutStyle = computed(() => {
    const percent = this.dashboard()?.progress.overallProgressPercent ?? 0;
    return `background: conic-gradient(#f59e0b ${percent * 3.6}deg, #1f2937 ${percent * 3.6}deg);`;
  });

  protected readonly activeCategoryEntities = computed(() => {
    const selected = this.selectedCategory();
    const detail = this.categories()?.categories.find((category) => category.category === selected);
    return detail?.entities ?? [];
  });

  protected readonly supercharges = computed<UpgradeRow[]>(() =>
    (this.upgrades()?.upgrades ?? []).filter((row) => row.upgradeType === 'SUPERCHARGE')
  );

  protected readonly permanentUpgrades = computed<UpgradeRow[]>(() =>
    (this.upgrades()?.upgrades ?? []).filter((row) => row.upgradeType === 'PERMANENT')
  );

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.state.set('loading');
    this.errorMessage.set('');
    forkJoin({
      dashboard: this.api.dashboard(),
      categories: this.api.categories(),
      upgrades: this.api.upgrades(),
      // The official profile is optional context; a failure here must not break the dashboard.
      officialProfile: this.api.officialProfile().pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ dashboard, categories, upgrades, officialProfile }) => {
        this.dashboard.set(dashboard);
        this.categories.set(categories);
        this.upgrades.set(upgrades);
        this.officialProfile.set(officialProfile);
        if (categories.categories.length > 0) {
          this.selectedCategory.set(categories.categories[0].category);
        }
        this.state.set('ready');
      },
      error: (error) => {
        this.errorMessage.set(
          `Não foi possível carregar os dados da API em ${this.baseUrl}. ` +
            'Verifique se o backend está em execução. ' +
            (error?.message ?? '')
        );
        this.state.set('error');
      }
    });
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected formatDays(days: number | null | undefined): string {
    if (days === null || days === undefined) {
      return 'desconhecido';
    }
    const total = Math.round(days * 24 * 60);
    const d = Math.floor(total / (24 * 60));
    const h = Math.floor((total % (24 * 60)) / 60);
    if (d <= 0 && h <= 0) {
      return '< 1h';
    }
    return `${d}d ${h}h`;
  }

  protected secondsToDays(seconds: number): number {
    return seconds / 86400;
  }
}
