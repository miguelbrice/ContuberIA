import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Play, 
  Pause, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  FileSpreadsheet, 
  Share2, 
  Cpu, 
  RefreshCw, 
  ShieldCheck,
  Video,
  Music,
  Flame,
  Instagram,
  ShoppingBag,
  CreditCard,
  Coins,
  ChevronRight,
  Sliders
} from "lucide-react";
import { PlatformAccount, RevenueTransaction, KYCData } from "../types";

interface DashboardOverviewProps {
  accounts: PlatformAccount[];
  currentRevenue: number;
  ratePerSecond: number;
  rateUnit: "per_second" | "per_minute";
  onToggleRateUnit: () => void;
  onAdjustRate: (multiplier: number) => void;
  isTickerRunning: boolean;
  onToggleTicker: () => void;
  transactions: RevenueTransaction[];
  kyc: KYCData;
  onOpenKYC: () => void;
  onOpenNewAccount: () => void;
  onOpenPromptStudio: () => void;
  onOpenPlanner: () => void;
  onOpenContentStudio: () => void;
  onOpenDistribution: () => void;
  onOpenAudit: (account: PlatformAccount) => void;
  onOpenPayout: () => void;
  onSimulateTransaction?: () => void;
  hideLiveBalances?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  accounts,
  currentRevenue,
  ratePerSecond,
  rateUnit,
  onToggleRateUnit,
  onAdjustRate,
  isTickerRunning,
  onToggleTicker,
  transactions,
  kyc,
  onOpenKYC,
  onOpenNewAccount,
  onOpenPromptStudio,
  onOpenPlanner,
  onOpenContentStudio,
  onOpenDistribution,
  onOpenAudit,
  onOpenPayout,
  onSimulateTransaction,
  hideLiveBalances = false
}) => {
  const perMin = ratePerSecond * 60;
  const perHour = perMin * 60;
  const perDay = perHour * 24;
  const perMonth = perDay * 30;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube": return <Video className="w-5 h-5 text-red-400" />;
      case "spotify": return <Music className="w-5 h-5 text-emerald-400" />;
      case "pinterest": return <Flame className="w-5 h-5 text-rose-400" />;
      case "tiktok": return <Video className="w-5 h-5 text-cyan-400" />;
      case "instagram": return <Instagram className="w-5 h-5 text-fuchsia-400" />;
      case "shopify": return <ShoppingBag className="w-5 h-5 text-emerald-300" />;
      case "paypal": return <CreditCard className="w-5 h-5 text-blue-400" />;
      case "binance": return <Coins className="w-5 h-5 text-amber-400" />;
      default: return <DollarSign className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO REVENUE VELOCITY ODOMETER & SPEED CONTROLLER */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#CBFF00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Main Balance Display */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/20">
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                MOTOR DE MONETIZACIÓN ACTIVO
              </span>
              <button
                onClick={onToggleTicker}
                className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 bg-black px-2.5 py-1 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
              >
                {isTickerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-[#CBFF00]" />}
                <span>{isTickerRunning ? "Pausar Ticker" : "Reanudar Ticker"}</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-6xl font-black text-white font-mono tracking-tight tabular-nums">
                {hideLiveBalances 
                  ? "••••.••••" 
                  : `$${currentRevenue.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`}
              </span>
              <span className="text-sm font-black text-zinc-400 uppercase tracking-wider">
                {hideLiveBalances ? "MODO STREAM OCULTO" : "USD GENERADOS"}
              </span>
            </div>

            <p className="text-xs text-zinc-400 flex items-center gap-2 font-medium">
              <span>Velocidad actual de ingresos:</span>
              <span className="font-mono font-black text-[#CBFF00] bg-black px-2.5 py-1 rounded border border-zinc-800">
                ${ratePerSecond.toFixed(3)}/seg (${perMin.toFixed(2)}/min)
              </span>
              <button
                onClick={onToggleRateUnit}
                className="text-[11px] text-[#CBFF00] hover:underline cursor-pointer font-bold uppercase tracking-wider"
              >
                (Alternar unidad)
              </button>
            </p>
          </div>

          {/* Velocity Rate Presets & Projection Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            
            {/* Speed Boost Buttons */}
            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2 shadow-inner">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#CBFF00]" /> VELOCIDAD DE FLUJO
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAdjustRate(0.005)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono font-bold transition-all border border-zinc-800 cursor-pointer"
                >
                  $0.005/s
                </button>
                <button
                  onClick={() => onAdjustRate(0.01)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#CBFF00] text-black font-mono font-black shadow-md shadow-[#CBFF00]/20 hover:bg-[#b8e600] transition-all cursor-pointer"
                >
                  $0.01/s (Base)
                </button>
                <button
                  onClick={() => onAdjustRate(0.025)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono font-bold transition-all border border-zinc-800 cursor-pointer"
                >
                  $0.025/s
                </button>
                <button
                  onClick={() => onAdjustRate(0.05)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 text-[#CBFF00] border border-[#CBFF00]/40 font-mono font-black hover:bg-zinc-700 transition-all cursor-pointer"
                >
                  Turbo $0.05/s
                </button>
              </div>
            </div>

            {/* Monthly Projection Card */}
            <div className="bg-black border border-zinc-800 rounded-xl p-3.5 min-w-[180px] flex flex-col justify-center shadow-inner">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">PROYECCIÓN 30 DÍAS</span>
              <span className="text-2xl font-black text-[#CBFF00] font-mono mt-0.5 tracking-tight">
                ${perMonth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                ~${perDay.toFixed(2)}/día • ${(perHour).toFixed(2)}/hr
              </span>
            </div>

          </div>
        </div>

        {/* Action Quick Launchers Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenPromptStudio}
            className="bg-black hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#CBFF00]/50 p-3.5 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-[#CBFF00] border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white group-hover:text-[#CBFF00]">PROMPTS & IA</p>
              <p className="text-[10px] text-zinc-400">Ganchos, SEO y Tokens</p>
            </div>
          </button>

          <button
            onClick={onOpenPlanner}
            className="bg-black hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#CBFF00]/50 p-3.5 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-[#CBFF00] border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white group-hover:text-[#CBFF00]">PLAN EXCEL (1 PROMPT)</p>
              <p className="text-[10px] text-zinc-400">Generar 30 Días CSV</p>
            </div>
          </button>

          <button
            onClick={onOpenContentStudio}
            className="bg-black hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#CBFF00]/50 p-3.5 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-[#CBFF00] border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white group-hover:text-[#CBFF00]">PRODUCIR CONTENIDO</p>
              <p className="text-[10px] text-zinc-400">Multi-redes automáticas</p>
            </div>
          </button>

          <button
            onClick={onOpenDistribution}
            className="bg-black hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#CBFF00]/50 p-3.5 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-[#CBFF00] border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white group-hover:text-[#CBFF00]">DISTRIBUIR & BUCLE</p>
              <p className="text-[10px] text-zinc-400">Repetir el proceso 24/7</p>
            </div>
          </button>
        </div>

      </div>

      {/* 2. PLATFORMS MONITOR & CONNECTED ACCOUNTS GRID */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>MONITOR DE CUENTAS & PLATAFORMAS MONETIZADAS</span>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {accounts.length} VINCULADAS
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Gestión centralizada de YouTube, Spotify, Pinterest, TikTok, Instagram, Shopify, PayPal y Binance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewAccount}
              className="bg-zinc-900 hover:bg-zinc-800 text-[#CBFF00] border border-[#CBFF00]/40 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>VINCULAR CUENTA / PLATAFORMA</span>
            </button>
          </div>
        </div>

        {/* 8 Platforms Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-zinc-900 hover:bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl relative group"
            >
              <div>
                {/* Card Header: Platform Icon + Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                      {getPlatformIcon(acc.platform)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white truncate max-w-[130px]">{acc.platformName}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[130px]">{acc.handle}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                    {acc.monetizationStatus}
                  </span>
                </div>

                {/* Requirements / Key Metric */}
                {acc.requirements && acc.requirements.length > 0 ? (
                  <div className="space-y-1.5 my-3 bg-black p-2.5 rounded-xl border border-zinc-800">
                    {acc.requirements.map((req, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                          <span>{req.label}</span>
                          <span className="font-mono font-bold text-zinc-200">
                            {req.current.toLocaleString()} / {req.target.toLocaleString()} {req.unit}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#CBFF00] rounded-full"
                            style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="my-3 bg-black p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{acc.metricLabel}</span>
                    <span className="text-xs font-black text-zinc-200 font-mono">{acc.metricValue}</span>
                  </div>
                )}

                {/* Earnings & Velocity */}
                <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-black uppercase block tracking-wider">TOTAL ACUMULADO</span>
                    <span className="font-black text-white font-mono text-sm">
                      ${acc.totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-black uppercase block tracking-wider">VELOCIDAD</span>
                    <span className="font-mono font-black text-[#CBFF00] text-xs">
                      +${(acc.revenueVelocity * 60).toFixed(2)}/h
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] border-t border-zinc-800/80">
                <span className="text-zinc-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-zinc-400" /> {acc.lastSync}
                </span>

                <button
                  onClick={() => onOpenAudit(acc)}
                  className="text-[#CBFF00] hover:underline font-black flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
                >
                  <span>AUDITAR IA</span>
                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. LIVE TRANSACTION PULSE & MICRO-INCOME STREAM */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 text-[#CBFF00] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-white tracking-tight uppercase">FLUJO DE TRANSACCIONES & MICRO-INGRESOS EN VIVO</h3>
              <p className="text-xs text-zinc-400">Ingresos generados por vistas, reproducciones, clics y ventas automáticas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onSimulateTransaction && (
              <button
                onClick={onSimulateTransaction}
                title="Generar micro-transacción de prueba"
                className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#CBFF00]" />
                <span className="text-[11px] font-mono">SIMULAR INGRESO</span>
              </button>
            )}
            <button
              onClick={onOpenPayout}
              className="px-3 py-1.5 rounded-lg bg-[#CBFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider shadow-md shadow-[#CBFF00]/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              <span>RETIRAR</span>
            </button>
            <span className="text-xs text-black font-mono font-black bg-[#CBFF00]/90 px-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-[#CBFF00]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              <span className="hidden md:inline">EN TIEMPO REAL</span>
            </span>
          </div>
        </div>

        <div className="divide-y divide-zinc-800">
          {transactions.slice(0, 6).map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-black/50 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center shrink-0">
                  {getPlatformIcon(tx.platform)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100">{tx.platformName}</span>
                    <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">{tx.type}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate max-w-[280px] sm:max-w-md">{tx.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-black text-[#CBFF00] text-sm">
                  +${tx.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block">{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
