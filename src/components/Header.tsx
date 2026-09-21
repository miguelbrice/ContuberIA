import React from "react";
import { ShieldCheck, ShieldAlert, DollarSign, RefreshCw, Zap, ArrowUpRight, User, PlusCircle, CheckCircle2, LogOut, Sliders, HelpCircle, Globe2 } from "lucide-react";
import { KYCData } from "../types";

interface HeaderProps {
  currentRevenue: number;
  ratePerSecond: number;
  rateUnit: "per_second" | "per_minute";
  onToggleRateUnit: () => void;
  kyc: KYCData;
  onOpenKYC: () => void;
  onOpenPayout: () => void;
  onOpenNewAccount: () => void;
  onOpenSettings: () => void;
  onOpenInvestorFAQ: () => void;
  hideLiveBalances?: boolean;
  selectedProfileName: string;
  onChangeProfile: (name: string) => void;
  isLoopActive: boolean;
  currentUser?: {
    name: string;
    email: string;
    role: string;
    terminalId?: string;
  } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRevenue,
  ratePerSecond,
  rateUnit,
  onToggleRateUnit,
  kyc,
  onOpenKYC,
  onOpenPayout,
  onOpenNewAccount,
  onOpenSettings,
  onOpenInvestorFAQ,
  hideLiveBalances = false,
  selectedProfileName,
  onChangeProfile,
  isLoopActive,
  currentUser,
  onLogout
}) => {
  const displayRate = rateUnit === "per_second" 
    ? `$${ratePerSecond.toFixed(3)}/seg` 
    : `$${(ratePerSecond * 60).toFixed(2)}/min`;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Creator Identity */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CBFF00] p-0.5 shadow-lg shadow-[#CBFF00]/20 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#CBFF00] fill-[#CBFF00]/20 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-white tracking-tight">CONTUBER <span className="text-[#CBFF00]">IA</span></span>
                <span className="text-[9px] font-black bg-[#CBFF00] text-black px-2 py-0.5 rounded-full tracking-wider">
                  PROTOTIPO 🇧🇷
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                  2027 - 2030
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                <span>Made in Brazil • Fase Promocional</span>
                {isLoopActive && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#CBFF00] bg-zinc-900 border border-[#CBFF00]/40 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Bucle Activo
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile KYC Badge */}
          <div className="md:hidden">
            <button
              onClick={onOpenKYC}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 font-bold ${
                kyc.isVerified
                  ? "bg-[#CBFF00]/10 border-[#CBFF00]/40 text-[#CBFF00]"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {kyc.isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Income Ticker & Velocity Meter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-2xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#CBFF00] animate-ping inline-block" />
                  FLUJO DE INGRESOS EN VIVO
                </span>
                <button
                  onClick={onToggleRateUnit}
                  title="Cambiar velocidad de ingreso entre por segundo y por minuto"
                  className="text-[10px] font-mono font-bold text-[#CBFF00] hover:underline cursor-pointer"
                >
                  {displayRate}
                </button>
              </div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-xs text-[#CBFF00] font-black">$</span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight tabular-nums">
                  {hideLiveBalances 
                    ? "••••.••••" 
                    : currentRevenue.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                </span>
                <span className="text-[10px] text-zinc-400 font-sans font-bold">USD</span>
                {hideLiveBalances && (
                  <span className="text-[9px] bg-zinc-800 text-[#CBFF00] px-1.5 py-0.5 rounded font-sans uppercase">
                    STREAM OCULTO
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onOpenPayout}
              className="bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-[#CBFF00]/20 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              <span>RETIRAR</span>
            </button>
          </div>
        </div>

        {/* User Account, KYC Badge, Settings & Quick Multi-Account Switcher */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Investor & FAQ Modal Trigger */}
          <button
            onClick={onOpenInvestorFAQ}
            title="Dossier Inversionistas, FAQ y Modelo de Negocio (2027-2030)"
            className="px-2.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-[#CBFF00]/40 text-[#CBFF00] hover:border-[#CBFF00] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-[#CBFF00]/5"
          >
            <HelpCircle className="w-4 h-4 text-[#CBFF00]" />
            <span className="text-[11px] uppercase tracking-wider font-black">DOSSIER / FAQ</span>
          </button>

          {/* Settings Trigger (FE-4) */}
          <button
            onClick={onOpenSettings}
            title="Configuración de Terminal (FE-4: Privacidad, IA, KYC, ID)"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-[#CBFF00]/50 text-zinc-300 hover:text-[#CBFF00] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-wider font-black">AJUSTES FE-4</span>
          </button>
          {/* KYC Status Pill */}
          <button
            onClick={onOpenKYC}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              kyc.isVerified
                ? "bg-zinc-900 border-[#CBFF00]/40 text-[#CBFF00] hover:bg-zinc-800"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 animate-pulse"
            }`}
          >
            {kyc.isVerified ? (
              <>
                <ShieldCheck className="w-4 h-4 text-[#CBFF00]" />
                <span className="font-bold">KYC BIOMÉTRICO: OK ({kyc.biometricMatchScore}%)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="font-bold">VERIFICAR IDENTIDAD KYC</span>
              </>
            )}
          </button>

          {/* Multi-Account Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedProfileName}
              onChange={(e) => onChangeProfile(e.target.value)}
              className="bg-transparent border-none text-zinc-200 focus:outline-none cursor-pointer font-bold text-xs pr-1"
            >
              <option value="Perfil Principal: Creador Pro" className="bg-zinc-950 text-zinc-200">Perfil Principal: Creador Pro</option>
              <option value="Canal Tech & AI Secundario" className="bg-zinc-950 text-zinc-200">Canal Tech & IA (Sub-cuenta)</option>
              <option value="Tienda E-Com & Afiliados" className="bg-zinc-950 text-zinc-200">Tienda E-Commerce Global</option>
            </select>
            <button
              onClick={onOpenNewAccount}
              title="Vincular nueva plataforma / cuenta"
              className="text-zinc-400 hover:text-[#CBFF00] transition-colors ml-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Session Chip & Logout Action */}
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-black text-white leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-[#CBFF00] font-mono leading-tight">IDENTIFICADO</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Bloquear terminal y cerrar sesión"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-black">BLOQUEAR</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Logout if authenticated */}
        {onLogout && (
          <div className="md:hidden flex items-center justify-end w-full pt-1 border-t border-zinc-900">
            <button
              onClick={onLogout}
              className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1 font-black uppercase py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Bloquear Terminal / Cerrar Sesión ({currentUser?.name || "Operador"})</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
