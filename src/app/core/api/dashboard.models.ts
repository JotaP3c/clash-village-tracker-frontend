// Transport models mirroring the backend read-only DTOs (com.clashtracker.web.dto).
// These describe the historical offline analysis. Progress is a cataloged step-count metric,
// not an official Supercell percentage and not time/resource spent.

export interface VillageInfo {
  playerTag: string;
  playerName: string;
  townHallLevel: number;
  snapshotDate: string | null;
  historicalSnapshot: boolean;
  goldPassBoost: number;
  permanentBuilders: number;
  goblinBuilderTemporary: boolean;
}

export interface ProgressSummary {
  overallProgressPercent: number;
  overallCompletedSteps: number;
  overallTotalSteps: number;
  overallRemainingSteps: number;
  permanentProgressPercent: number;
  permanentCompletedSteps: number;
  permanentTotalSteps: number;
  superchargeProgressPercent: number;
  superchargeCompletedSteps: number;
  superchargeTotalSteps: number;
  fullCertified: boolean;
  fullCertificationMessage: string;
}

export interface DurationSummary {
  scenarioKnownSeconds: number;
  scenarioKnownBuilderDays: number;
  baseKnownSeconds: number;
  discountedFutureKnownSeconds: number;
  observedRemainingSeconds: number;
  exactTotalAvailable: boolean;
  unknownStepKeyCount: number;
}

export interface BuildersSummary {
  permanentBuilderCapacity: number;
  goblinBuilderTemporary: boolean;
  builderQueueDays: number;
  laboratoryQueueDays: number;
  petQueueDays: number;
  estimatedBuilderCalendarDaysLowerBound: number;
}

export interface CategorySummary {
  category: string;
  completedSteps: number;
  totalSteps: number;
  remainingSteps: number;
  progressPercent: number;
  entityCount: number;
  unknownEntityCount: number;
}

export interface DataQuality {
  coveragePercent: number;
  unknownEntityCount: number;
  potentiallyMissingEntityCount: number;
  unknownUpgradeStepCount: number;
  validationIssueCount: number;
}

export interface DashboardResponse {
  status: string;
  message: string;
  village: VillageInfo;
  progress: ProgressSummary;
  durations: DurationSummary;
  builders: BuildersSummary;
  categories: CategorySummary[];
  dataQuality: DataQuality;
}

export interface EntityView {
  entityKey: string;
  name: string;
  category: string;
  quantity: number;
  currentLevel: number | null;
  maxLevel: number | null;
  countAtMax: number;
  maxSupercharge: number | null;
  sc1Completed: number | null;
  sc2Completed: number | null;
  sc3Completed: number | null;
  representation: string | null;
  confidence: string;
  notes: string;
}

export interface CategoryDetail {
  category: string;
  completedSteps: number;
  totalSteps: number;
  remainingSteps: number;
  progressPercent: number;
  entityCount: number;
  unknownEntityCount: number;
  entities: EntityView[];
}

export interface CategoryResponse {
  categories: CategoryDetail[];
}

export interface UpgradeRow {
  category: string;
  item: string;
  stage: string;
  upgradeType: string;
  fromLevel: number;
  toLevel: number;
  count: number;
  activeCount: number;
  futureCount: number;
  queue: string;
  baseDurationSecondsPerUnit: number | null;
  baseDurationDaysPerUnit: number | null;
  discountedDurationSecondsPerUnit: number | null;
  discountedDurationDaysPerUnit: number | null;
  observedRemainingSecondsTotal: number;
  durationKnown: boolean;
  source: string;
  confidence: string;
}

export interface UpgradeResponse {
  totalRows: number;
  inProgressRows: number;
  upgrades: UpgradeRow[];
}

export interface HealthResponse {
  status: string;
  application: string;
  mode: string;
  time: string;
}

export interface OfficialProfilePlayer {
  tag: string;
  name: string;
  townHallLevel: number | null;
  expLevel: number | null;
  troopCount: number;
  spellCount: number;
  heroCount: number;
  heroEquipmentCount: number;
}

export interface OfficialProfileResponse {
  available: boolean;
  message: string;
  collectionId: string | null;
  requestedTag: string | null;
  returnedTag: string | null;
  httpStatus: number | null;
  outcome: string | null;
  collectedAt: string | null;
  bodySha256: string | null;
  profile: OfficialProfilePlayer | null;
}

export interface SnapshotResponse {
  playerTag: string;
  playerName: string;
  townHallLevel: number;
  observedAt: string | null;
  historicalSnapshot: boolean;
  permanentBuilders: number;
  goblinBuilderTemporary: boolean;
  declaredCategories: string[];
  entities: EntityView[];
}
