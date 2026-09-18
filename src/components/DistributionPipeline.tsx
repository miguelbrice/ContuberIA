import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Send, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Share2, 
  Flame, 
  Video, 
  Instagram, 
  Music, 
  ShoppingBag, 
  CreditCard, 
  Coins, 
  Layers,
  Plus
} from "lucide-react";
import { DistributionJob, PlatformKey } from "../types";

interface DistributionPipelineProps {
  jobs: DistributionJob[];
  onUpdateJob: (job: DistributionJob) => void;
  onAddJob: (job: DistributionJob) => void;
  isGlobalLoopActive: boolean;
  onToggleGlobalLoop: () => void;
  ratePerSecond: number;
}

export const DistributionPipeline: React.FC<DistributionPipelineProps> = ({
  jobs,
  onUpdateJob,
  onAddJob,
  isGlobalLoopActive,
  onToggleGlobalLoop,
  ratePerSecond
}) => {
  const [activeTab, setActiveTab] = useState<"queue" | "activity_log" | "new_job">("queue");
  const [newTitle, setNewTitle] = useState("Campaña Viral: Tráfico Pinterest + TikTok Shop");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>(["pinterest", "tiktok", "shopify", "paypal"]);
  const [frequency, setFrequency] = useState<DistributionJob["frequency"]>("loop_continuous");

  // Simulated live execution pulses
  const [lastDispatchedLog, setLastDispatchedLog] = useState<{
    platform: string;
    action: string;
    timestamp: string;
    revenueAdded: number;
  }[]>([
    { platform: "Pinterest", action: "Pin publicado con enlace a Shopify Checkout", timestamp: "Hace 1 min", revenueAdded: 14.50 },
    { platform: "TikTok", action: "Video programado con enlace de afiliado en bio", timestamp: "Hace 3 min", revenueAdded: 25.00 },
    { platform: "YouTube", action: "Short publicado con enlace en comentario fijado", timestamp: "Hace 6 min", revenueAdded: 8.40 },
    { platform: "Binance Pay", action: "Invoice web3 generado para comprador europeo", timestamp: "Hace 11 min", revenueAdded: 30.00 }
  ]);

  const togglePlatformSelection = (p: PlatformKey) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleCreateJob = () => {
    const job: DistributionJob = {
      id: "job_" + Date.now(),
      contentId: "cnt_" + Date.now(),
      title: newTitle,
      platforms: selectedPlatforms,
      frequency,
      isLoopActive: true,
      cyclesCompleted: 0,
      totalRevenueGenerated: 0,
      lastExecution: "Recién creada",
      nextExecution: "En 5 min",
      status: "running",
      autoMonetizeLinks: true
    };
    onAddJob(job);
    setActiveTab("queue");
  };

  const totalCyclesAllJobs = jobs.reduce((acc, j) => acc + j.cyclesCompleted, 0);
  const totalRevenueAllJobs = jobs.reduce((acc, j) => acc + j.totalRevenueGenerated, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Global Loop Control Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-black text-[#CBFF00] border border-zinc-800">
                <RefreshCw className={`w-6 h-6 ${isGlobalLoopActive ? "animate-spin [animation-duration:8s]" : ""}`} />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                  DISTRIBUCIÓN AUTOMATIZADA & BUCLE DE REPETICIÓN
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  Publica, trackea conversiones, genera ingresos recurrentes y repite el proceso de monetización automáticamente 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleGlobalLoop}
              className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl cursor-pointer active:scale-95 ${
                isGlobalLoopActive
                  ? "bg-[#CBFF00] hover:bg-[#b8e600] text-black shadow-[#CBFF00]/20"
                  : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              }`}
            >
              {isGlobalLoopActive ? (
                <>
                  <Pause className="w-4 h-4 text-black fill-black" />
                  <span>BUCLE ACTIVO (PAUSAR)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#CBFF00] fill-[#CBFF00]" />
                  <span>ACTIVAR BUCLE 24/7</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Pipeline Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Ciclos Completados</span>
            <span className="text-xl font-black text-white font-mono">{totalCyclesAllJobs} ciclos</span>
            <span className="text-[10px] text-[#CBFF00] font-bold mt-1 block flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5" /> AUTO-REPETICIÓN ACTIVA
            </span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Ingreso por Bucle</span>
            <span className="text-xl font-black text-[#CBFF00] font-mono">
              ${totalRevenueAllJobs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Atribuido a canales directos</span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Campañas en Cola</span>
            <span className="text-xl font-black text-white font-mono">{jobs.length} activas</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Sincronización multi-red</span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Velocidad del Bucle</span>
            <span className="text-xl font-black text-[#CBFF00] font-mono">${(ratePerSecond * 60).toFixed(2)}/min</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">~$0.01 por segundo</span>
          </div>
        </div>

      </div>

      {/* 2. Pipeline Queue & Dispatch Simulator */}
      <div className="space-y-4">
        
        {/* Navigation bar */}
        <div className="flex items-center justify-between bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("queue")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer ${
                activeTab === "queue" ? "bg-black text-white border border-zinc-700" : "text-zinc-400 hover:text-white"
              }`}
            >
              Campañas en Cola ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("activity_log")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer ${
                activeTab === "activity_log" ? "bg-black text-white border border-zinc-700" : "text-zinc-400 hover:text-white"
              }`}
            >
              Registro de Despacho
            </button>
          </div>

          <button
            onClick={() => setActiveTab("new_job")}
            className="bg-black hover:bg-zinc-800 text-[#CBFF00] border border-zinc-800 text-xs font-black uppercase px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>NUEVA CAMPAÑA</span>
          </button>
        </div>

        {/* Tab: QUEUE LIST */}
        {activeTab === "queue" && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl hover:border-zinc-700 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white uppercase">{job.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-black bg-[#CBFF00] px-2 py-0.5 rounded">
                      {job.frequency === "loop_continuous" ? "BUCLE 24/7" : job.frequency}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-400">Canales vinculados:</span>
                    {job.platforms.map((p) => (
                      <span key={p} className="text-[10px] uppercase font-black text-zinc-300 bg-black px-2 py-0.5 rounded border border-zinc-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Ciclos / Ingreso</span>
                    <span className="text-xs font-mono font-black text-[#CBFF00]">
                      {job.cyclesCompleted} ciclos • ${job.totalRevenueGenerated.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onUpdateJob({ ...job, isLoopActive: !job.isLoopActive })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer ${
                      job.isLoopActive
                        ? "bg-[#CBFF00] text-black"
                        : "bg-black text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    {job.isLoopActive ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{job.isLoopActive ? "ACTIVO" : "REANUDAR"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: DISPATCH ACTIVITY LOG */}
        {activeTab === "activity_log" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">HISTORIAL DE ATRIBUCIÓN</h4>
            <div className="divide-y divide-zinc-800">
              {lastDispatchedLog.map((log, i) => (
                <div key={i} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-[#CBFF00] font-black">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-white uppercase">{log.platform} - {log.action}</p>
                      <span className="text-[10px] text-zinc-500 font-medium">{log.timestamp}</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-[#CBFF00]">+${log.revenueAdded.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: CREATE NEW JOB FORM */}
        {activeTab === "new_job" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 max-w-xl shadow-2xl">
            <h4 className="text-sm font-black uppercase text-white tracking-wide">Configurar Campaña de Distribución</h4>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nombre de la Campaña</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Plataformas a Distribuir</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["youtube", "tiktok", "instagram", "pinterest", "shopify", "spotify", "binance", "paypal"] as PlatformKey[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatformSelection(p)}
                    className={`p-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedPlatforms.includes(p)
                        ? "bg-[#CBFF00] text-black"
                        : "bg-black text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("queue")}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-black uppercase text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateJob}
                className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 cursor-pointer"
              >
                INICIAR CAMPAÑA
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
