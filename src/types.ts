export type PlatformKey =
  | "youtube"
  | "spotify"
  | "pinterest"
  | "tiktok"
  | "instagram"
  | "shopify"
  | "paypal"
  | "binance"
  | "gumroad";

export interface PlatformAccount {
  id: string;
  platform: PlatformKey;
  platformName: string;
  accountName: string;
  handle: string;
  status: "active" | "syncing" | "paused" | "action_required";
  revenueVelocity: number; // in USD per minute
  totalEarned: number;
  followersOrSubs: number;
  metricLabel: string;
  metricValue: string;
  monetizationStatus: "Aprobado / Activo" | "En Revisión" | "85% Requisitos" | "Verificado";
  payoutMethod: string;
  payoutAddress: string;
  lastSync: string;
  category: "Video" | "Audio" | "Tráfico" | "Redes" | "E-commerce" | "Pasarela" | "Cripto";
  badgeColor: string;
  logoIcon: string;
  requirements?: {
    label: string;
    current: number;
    target: number;
    unit: string;
  }[];
}

export interface KYCData {
  isVerified: boolean;
  documentType: "DNI" | "Pasaporte" | "Cédula Nacional" | "Licencia de Conducir";
  documentNumber: string;
  fullName: string;
  country: string;
  birthDate: string;
  biometricMatchScore: number;
  livenessPassed: boolean;
  certificateId: string;
  verifiedAt: string;
  status: "NO_INICIADO" | "EN_REVISION" | "APROBADO_BIOMETRICO" | "RECHAZADO";
  verificationHash: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  platform: PlatformKey | "all";
  niche: string;
  objective: string;
  promptText: string;
  tokensEstimated: number;
  costEstimated: string;
  monetizationAngle: string;
  variables: string[];
  conversionRate: string;
  isFavorite?: boolean;
}

export interface PlanDay {
  day: number;
  platform: string;
  actionType: string;
  title: string;
  promptToExecute: string;
  monetizationGoal: string;
  status: "Pendiente" | "En Progreso" | "Publicado" | "Monetizado";
  actualRevenue?: number;
}

export interface MonthlyPlan {
  id: string;
  planName: string;
  monthlyTarget: string;
  dailyPacingTarget: string;
  strategyOverview: string;
  createdAt: string;
  days: PlanDay[];
}

export interface GeneratedContent {
  id: string;
  topic: string;
  productUrl?: string;
  price?: string;
  createdAt: string;
  youtube?: {
    title: string;
    hook: string;
    script: string;
    tags: string[];
  };
  tiktok?: {
    hook: string;
    body: string;
    cta: string;
  };
  instagram?: {
    reelCaption: string;
    storyIdeas: string[];
  };
  pinterest?: {
    pinTitle: string;
    description: string;
    destinationLink: string;
  };
  audioPodcast?: {
    trackTitle: string;
    showNotes: string;
  };
  ecommerceShopify?: {
    productTitle: string;
    shortPitch: string;
    priceSuggested: string;
    bullets: string[];
  };
}

export interface DistributionJob {
  id: string;
  contentId: string;
  title: string;
  platforms: PlatformKey[];
  frequency: "instant" | "hourly" | "daily" | "loop_continuous";
  isLoopActive: boolean;
  cyclesCompleted: number;
  totalRevenueGenerated: number;
  lastExecution: string;
  nextExecution: string;
  status: "idle" | "running" | "scheduled" | "completed";
  autoMonetizeLinks: boolean;
}

export interface RevenueTransaction {
  id: string;
  timestamp: string;
  platform: PlatformKey;
  platformName: string;
  type: "Venta Producto" | "Regalías Audio" | "Comisión Afiliado" | "AdSense / Vistas" | "Binance USDT" | "PayPal Checkout";
  description: string;
  amount: number;
  status: "completed" | "processing";
  categoryTag?: "Streaming" | "Suscripción" | "Comercio" | "Regalías" | "Micro-Donación";
}

export interface UserSettings {
  // 4.1 Privacidad
  privacy: {
    hideLiveBalances: boolean; // FE-4.1.1
    allowTelemetryAnalytics: boolean; // FE-4.1.3
    exportRequested: boolean;
  };
  // 4.2 IA Predeterminada
  ai: {
    defaultModel: "gemini-3.8-flash" | "gemini-2.5-flash" | "financial-advanced"; // FE-4.2.1
    alertSensitivity: "baja" | "media" | "alta" | "estricta"; // FE-4.2.2
    autoCategorizeTransactions: boolean; // FE-4.2.3
    autoReinvestRate: number; // percentage (0 - 100)
  };
  // 4.4 ID (Identificación y Terminal Única)
  identity: {
    terminalId: string; // FE-4.4.1
    taxId: string; // FE-4.4.2 (RFC / CIF / NIF / SSN)
    legalEntityName: string;
    apiKeyPublic: string; // FE-4.4.3
    apiKeySecret: string;
    lastRegenerated: string;
  };
}

export interface StreamOAuthProvider {
  id: "twitch" | "youtube" | "kick" | "tiktok" | "spotify";
  name: string;
  logo: string;
  scopes: string[];
  connected: boolean;
  channelId?: string;
  channelName?: string;
  liveStatus?: "LIVE" | "OFFLINE";
  viewerCount?: number;
  lastSync?: string;
}
