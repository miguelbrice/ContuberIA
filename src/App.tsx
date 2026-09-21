/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  FileSpreadsheet, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign,
  PlusCircle,
  TrendingUp,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_KYC, 
  INITIAL_PROMPTS, 
  INITIAL_PLAN_DAYS, 
  INITIAL_DISTRIBUTION_JOBS, 
  INITIAL_TRANSACTIONS 
} from "./data/initialData";
import { 
  PlatformAccount, 
  KYCData, 
  PromptTemplate, 
  MonthlyPlan, 
  DistributionJob, 
  RevenueTransaction,
  GeneratedContent,
  PlatformKey,
  UserSettings
} from "./types";

import { Header } from "./components/Header";
import { DashboardOverview } from "./components/DashboardOverview";
import { PromptTokenStudio } from "./components/PromptTokenStudio";
import { MonthlyPlannerExcel } from "./components/MonthlyPlannerExcel";
import { ContentProductionStudio } from "./components/ContentProductionStudio";
import { DistributionPipeline } from "./components/DistributionPipeline";
import { KYCBiometricModal } from "./components/KYCBiometricModal";
import { NewAccountModal } from "./components/NewAccountModal";
import { PayoutModal } from "./components/PayoutModal";
import { AIChannelAuditor } from "./components/AIChannelAuditor";
import { SettingsModal } from "./components/SettingsModal";
import { LoginScreen, UserSession } from "./components/LoginScreen";

export default function App() {
  // Authentication & Session State (Scenario 1, 2, 3)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("monetipre_session");
      return !!saved;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("monetipre_session");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "prompts" | "planner" | "production" | "distribution">("dashboard");

  // Core State
  const [accounts, setAccounts] = useState<PlatformAccount[]>(INITIAL_ACCOUNTS);
  const [kycData, setKycData] = useState<KYCData>(INITIAL_KYC);
  const [prompts, setPrompts] = useState<PromptTemplate[]>(INITIAL_PROMPTS);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan>(INITIAL_PLAN_DAYS);
  const [distributionJobs, setDistributionJobs] = useState<DistributionJob[]>(INITIAL_DISTRIBUTION_JOBS);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>(INITIAL_TRANSACTIONS);

  // Micro-Income Ticker State ($0.01 per second or per minute)
  const [currentRevenue, setCurrentRevenue] = useState<number>(1428.9412);
  const [ratePerSecond, setRatePerSecond] = useState<number>(0.010); // $0.01 / second default
  const [rateUnit, setRateUnit] = useState<"per_second" | "per_minute">("per_second");
  const [isTickerRunning, setIsTickerRunning] = useState<boolean>(true);
  const [isGlobalLoopActive, setIsGlobalLoopActive] = useState<boolean>(true);

  // Active creator profile
  const [selectedProfileName, setSelectedProfileName] = useState("Perfil Principal: Creador Pro");

  // Transfer State between modules
  const [contentStudioTopic, setContentStudioTopic] = useState("Pack de Plantillas de Monetización con IA");
  const [contentStudioPrompt, setContentStudioPrompt] = useState("");

  // Modals
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [auditAccount, setAuditAccount] = useState<PlatformAccount | null>(null);

  // User Settings State (FE-4: Privacidad, IA, KYC, ID)
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    return {
      privacy: {
        hideLiveBalances: false,
        exportRequested: false,
        allowTelemetryAnalytics: true
      },
      ai: {
        defaultModel: "gemini-3.8-flash",
        alertSensitivity: "alta",
        autoCategorizeTransactions: true
      },
      kyc: {
        requireBiometricsOnPayout: true,
        autoSubmitToTaxAuthority: false
      },
      identity: {
        terminalId: "TERM-2026-X890-ALPHA",
        taxId: "ES-B00000000",
        legalEntityName: "MonetiPre Media S.L.",
        apiKeyPublic: "pk_demo_monetipre_98319a28",
        apiKeySecret: "sec_demo_monetipre_f8910a247192049",
        lastRegenerated: "2026-09-20"
      }
    };
  });

  // Scenario 3 & 4: User identifies -> Platform starts the monitor
  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    setIsAuthenticated(true);
    setSelectedProfileName(session.profileName || "Perfil Principal: Creador Pro");
    // Activate monitor and compounding telemetry
    setIsTickerRunning(true);
    setIsGlobalLoopActive(true);
    setLoginNotice(`Monitor de ingresos iniciado con éxito • Sesión activa: ${session.name} • Tasa: $0.01/seg`);
    setTimeout(() => setLoginNotice(null), 6000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("monetipre_session");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsTickerRunning(false);
    setIsGlobalLoopActive(false);
  };

  // Scenario 5: User executes transactions & controls
  const handleSimulateTransaction = () => {
    const platformKeys: PlatformKey[] = ["youtube", "spotify", "pinterest", "tiktok", "instagram", "shopify", "paypal", "binance"];
    const chosenPlat = platformKeys[Math.floor(Math.random() * platformKeys.length)];
    
    const sampleDescriptions: Record<PlatformKey, { name: string; type: RevenueTransaction["type"]; desc: string; amount: number }> = {
      youtube: { name: "YouTube Partner", type: "AdSense / Vistas", desc: "Shorts monetizado con RPM acelerado", amount: +(Math.random() * 5 + 2.0).toFixed(2) },
      spotify: { name: "Spotify Royalties", type: "Regalías Audio", desc: "Liquidación por reproducción de audio", amount: +(Math.random() * 3 + 1.2).toFixed(2) },
      pinterest: { name: "Pinterest Afiliados", type: "Comisión Afiliado", desc: "Clic saliente convertido en tienda afiliada", amount: +(Math.random() * 14 + 6.0).toFixed(2) },
      tiktok: { name: "TikTok Creator", type: "Comisión Afiliado", desc: "Comisión generada en TikTok Shop", amount: +(Math.random() * 19 + 8.5).toFixed(2) },
      instagram: { name: "Instagram Funnel", type: "Venta Producto", desc: "Venta directa de guía digital vía DM Link", amount: +(Math.random() * 22 + 9.99).toFixed(2) },
      shopify: { name: "Shopify Store", type: "Venta Producto", desc: "Compra automática de producto digital", amount: +(Math.random() * 28 + 19.99).toFixed(2) },
      paypal: { name: "PayPal Gateway", type: "PayPal Checkout", desc: "Pago express internacional verificado", amount: +(Math.random() * 18 + 5.99).toFixed(2) },
      binance: { name: "Binance Pay", type: "Binance USDT", desc: "Liquidación instantánea Web3 en USDT", amount: +(Math.random() * 32 + 10.0).toFixed(2) },
      gumroad: { name: "Gumroad", type: "Venta Producto", desc: "Descarga de plantilla de prompts", amount: 15.00 }
    };

    const sample = sampleDescriptions[chosenPlat];
    const newTx: RevenueTransaction = {
      id: "tx_" + Date.now(),
      timestamp: "Ahora mismo",
      platform: chosenPlat,
      platformName: sample.name,
      type: sample.type,
      description: sample.desc,
      amount: sample.amount,
      status: "completed"
    };

    setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
    setCurrentRevenue((prev) => prev + sample.amount);
  };

  // Live compounding ticker interval (ticks every 100ms)
  useEffect(() => {
    if (!isTickerRunning) return;

    const interval = setInterval(() => {
      setCurrentRevenue((prev) => prev + (ratePerSecond * 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isTickerRunning, ratePerSecond]);

  // Periodic Micro-Transaction generation pulse
  useEffect(() => {
    if (!isGlobalLoopActive) return;

    const randomTxInterval = setInterval(() => {
      const platformKeys: PlatformKey[] = ["youtube", "spotify", "pinterest", "tiktok", "instagram", "shopify", "paypal", "binance"];
      const chosenPlat = platformKeys[Math.floor(Math.random() * platformKeys.length)];
      
      const sampleDescriptions: Record<PlatformKey, { name: string; type: RevenueTransaction["type"]; desc: string; amount: number }> = {
        youtube: { name: "YouTube Partner", type: "AdSense / Vistas", desc: "Monetización de Shorts automáticos", amount: +(Math.random() * 4 + 1.2).toFixed(2) },
        spotify: { name: "Spotify Royalties", type: "Regalías Audio", desc: "Regalías por streaming en playlist Lo-Fi", amount: +(Math.random() * 2 + 0.8).toFixed(2) },
        pinterest: { name: "Pinterest Afiliados", type: "Comisión Afiliado", desc: "Clic saliente convertido en tienda afiliada", amount: +(Math.random() * 12 + 5.0).toFixed(2) },
        tiktok: { name: "TikTok Creator", type: "Comisión Afiliado", desc: "Comisión generada en TikTok Shop", amount: +(Math.random() * 18 + 8.5).toFixed(2) },
        instagram: { name: "Instagram Funnel", type: "Venta Producto", desc: "Venta directa de guía digital vía DM Link", amount: +(Math.random() * 20 + 9.99).toFixed(2) },
        shopify: { name: "Shopify Store", type: "Venta Producto", desc: "Compra automática de producto digital", amount: +(Math.random() * 25 + 19.99).toFixed(2) },
        paypal: { name: "PayPal Gateway", type: "PayPal Checkout", desc: "Pago express procesado con éxito", amount: +(Math.random() * 15 + 4.99).toFixed(2) },
        binance: { name: "Binance Pay", type: "Binance USDT", desc: "Liquidación Web3 instantánea en USDT", amount: +(Math.random() * 30 + 10.0).toFixed(2) },
        gumroad: { name: "Gumroad", type: "Venta Producto", desc: "Descarga de plantilla de prompts", amount: 15.00 }
      };

      const sample = sampleDescriptions[chosenPlat];
      const newTx: RevenueTransaction = {
        id: "tx_" + Date.now(),
        timestamp: "Hace unos segundos",
        platform: chosenPlat,
        platformName: sample.name,
        type: sample.type,
        description: sample.desc,
        amount: sample.amount,
        status: "completed"
      };

      setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
    }, 14000);

    return () => clearInterval(randomTxInterval);
  }, [isGlobalLoopActive]);

  // Handler to use prompt in Content Studio
  const handleUsePromptInContentStudio = (promptText: string, topic: string) => {
    setContentStudioPrompt(promptText);
    setContentStudioTopic(topic || "Pack de Monetización con IA");
    setActiveTab("production");
  };

  // Handler to send generated content to distribution
  const handleSendToDistribution = (content: GeneratedContent) => {
    const newJob: DistributionJob = {
      id: "job_" + Date.now(),
      contentId: content.id,
      title: `Distribución: ${content.topic.slice(0, 35)}`,
      platforms: ["youtube", "tiktok", "instagram", "pinterest", "shopify"],
      frequency: "loop_continuous",
      isLoopActive: true,
      cyclesCompleted: 1,
      totalRevenueGenerated: parseFloat(content.price?.replace(/[^0-9.]/g, "") || "27.00"),
      lastExecution: "En vivo",
      nextExecution: "En 10 min",
      status: "running",
      autoMonetizeLinks: true
    };

    setDistributionJobs((prev) => [newJob, ...prev]);
    setActiveTab("distribution");
  };

  const handleConfirmPayout = (amount: number, method: string) => {
    setCurrentRevenue((prev) => Math.max(0, prev - amount));
    
    // Add transaction
    const newTx: RevenueTransaction = {
      id: "payout_" + Date.now(),
      timestamp: "Ahora mismo",
      platform: method === "binance" ? "binance" : "paypal",
      platformName: method === "binance" ? "Binance USDT Payout" : "PayPal Instant Payout",
      type: method === "binance" ? "Binance USDT" : "PayPal Checkout",
      description: `Retiro exitoso de fondos a tu cuenta (${method.toUpperCase()})`,
      amount: amount,
      status: "completed"
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Scenario 1 & 2: If not authenticated, the URL starts on the login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col antialiased selection:bg-[#CBFF00] selection:text-black">
      
      {/* Top Global Header with Session & Logout controls */}
      <Header
        currentRevenue={currentRevenue}
        ratePerSecond={ratePerSecond}
        rateUnit={rateUnit}
        onToggleRateUnit={() => setRateUnit(rateUnit === "per_second" ? "per_minute" : "per_second")}
        kyc={kycData}
        onOpenKYC={() => setIsKYCModalOpen(true)}
        onOpenPayout={() => setIsPayoutModalOpen(true)}
        onOpenNewAccount={() => setIsNewAccountModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        hideLiveBalances={userSettings.privacy.hideLiveBalances}
        selectedProfileName={selectedProfileName}
        onChangeProfile={setSelectedProfileName}
        isLoopActive={isGlobalLoopActive}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Monitor Startup Notification Banner (Scenario 4) */}
        {loginNotice && (
          <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/40 rounded-2xl p-4 text-xs text-[#CBFF00] font-bold flex items-center justify-between gap-3 shadow-lg shadow-[#CBFF00]/5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CBFF00] animate-ping shrink-0" />
              <span>{loginNotice}</span>
            </div>
            <button
              onClick={() => setLoginNotice(null)}
              className="text-zinc-400 hover:text-white text-[11px] font-mono uppercase underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2 flex items-center justify-between gap-2 overflow-x-auto shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-1.5 min-w-max">
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#CBFF00] text-black shadow-lg shadow-[#CBFF00]/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>MONITOR & DASHBOARD</span>
            </button>

            <button
              onClick={() => setActiveTab("prompts")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "prompts"
                  ? "bg-[#CBFF00] text-black shadow-lg shadow-[#CBFF00]/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>PROMPTS, TOKENS & IA</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "planner"
                  ? "bg-[#CBFF00] text-black shadow-lg shadow-[#CBFF00]/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>PLAN EXCEL (1 PROMPT)</span>
            </button>

            <button
              onClick={() => setActiveTab("production")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "production"
                  ? "bg-[#CBFF00] text-black shadow-lg shadow-[#CBFF00]/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>PRODUCIR CONTENIDO</span>
            </button>

            <button
              onClick={() => setActiveTab("distribution")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "distribution"
                  ? "bg-[#CBFF00] text-black shadow-lg shadow-[#CBFF00]/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>DISTRIBUIR & BUCLE</span>
            </button>

          </div>

          <div className="hidden lg:flex items-center gap-2 pr-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Objetivo:</span>
            <span className="text-xs font-black text-[#CBFF00] font-mono bg-black px-2.5 py-1 rounded-lg border border-zinc-800">
              $0.01 / seg
            </span>
          </div>
        </div>

        {/* Tab Content Views (Scenario 4 & 5: Monitor, Management, Control & Transactions) */}
        {activeTab === "dashboard" && (
          <DashboardOverview
            accounts={accounts}
            currentRevenue={currentRevenue}
            ratePerSecond={ratePerSecond}
            rateUnit={rateUnit}
            onToggleRateUnit={() => setRateUnit(rateUnit === "per_second" ? "per_minute" : "per_second")}
            onAdjustRate={(multiplier) => setRatePerSecond(multiplier)}
            isTickerRunning={isTickerRunning}
            onToggleTicker={() => setIsTickerRunning(!isTickerRunning)}
            transactions={transactions}
            kyc={kycData}
            onOpenKYC={() => setIsKYCModalOpen(true)}
            onOpenNewAccount={() => setIsNewAccountModalOpen(true)}
            onOpenPromptStudio={() => setActiveTab("prompts")}
            onOpenPlanner={() => setActiveTab("planner")}
            onOpenContentStudio={() => setActiveTab("production")}
            onOpenDistribution={() => setActiveTab("distribution")}
            onOpenAudit={(acc) => setAuditAccount(acc)}
            onOpenPayout={() => setIsPayoutModalOpen(true)}
            onSimulateTransaction={handleSimulateTransaction}
            hideLiveBalances={userSettings.privacy.hideLiveBalances}
          />
        )}

        {activeTab === "prompts" && (
          <PromptTokenStudio
            prompts={prompts}
            onSavePrompt={(newPr) => setPrompts([newPr, ...prompts])}
            onUsePromptInContentStudio={handleUsePromptInContentStudio}
          />
        )}

        {activeTab === "planner" && (
          <MonthlyPlannerExcel
            plan={monthlyPlan}
            onUpdatePlan={setMonthlyPlan}
            onExecuteDayPrompt={handleUsePromptInContentStudio}
          />
        )}

        {activeTab === "production" && (
          <ContentProductionStudio
            initialTopic={contentStudioTopic}
            initialPrompt={contentStudioPrompt}
            onSendToDistribution={handleSendToDistribution}
          />
        )}

        {activeTab === "distribution" && (
          <DistributionPipeline
            jobs={distributionJobs}
            onUpdateJob={(updated) => setDistributionJobs(distributionJobs.map((j) => j.id === updated.id ? updated : j))}
            onAddJob={(newJ) => setDistributionJobs([newJ, ...distributionJobs])}
            isGlobalLoopActive={isGlobalLoopActive}
            onToggleGlobalLoop={() => setIsGlobalLoopActive(!isGlobalLoopActive)}
            ratePerSecond={ratePerSecond}
          />
        )}

      </main>

      {/* Modals */}
      <KYCBiometricModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        kycData={kycData}
        onSaveKYC={(updated) => setKycData(updated)}
      />

      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onAddAccount={(newAcc) => setAccounts([...accounts, newAcc])}
      />

      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        availableBalance={currentRevenue}
        kyc={kycData}
        onConfirmPayout={handleConfirmPayout}
      />

      <AIChannelAuditor
        isOpen={Boolean(auditAccount)}
        onClose={() => setAuditAccount(null)}
        account={auditAccount}
        ratePerSecond={ratePerSecond}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={userSettings}
        onUpdateSettings={(newSettings) => setUserSettings(newSettings)}
        kycData={kycData}
        onOpenKYCModal={() => setIsKYCModalOpen(true)}
        userEmail={currentUser?.email || ""}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-black py-5 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold tracking-tight text-zinc-400">© 2026 MONETIPRE IA • SISTEMA DE MONETIZACIÓN AUTOMATIZADO</p>
          <div className="flex items-center gap-3 text-[11px] font-mono font-semibold text-zinc-400">
            <span>YOUTUBE</span> • <span>SPOTIFY</span> • <span>PINTEREST</span> • <span>TIKTOK</span> • <span>SHOPIFY</span> • <span>PAYPAL</span> • <span>BINANCE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
