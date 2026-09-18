import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  DollarSign, 
  Play, 
  TrendingUp, 
  ArrowRight,
  Filter
} from "lucide-react";
import { MonthlyPlan, PlanDay } from "../types";
import { exportPlanToCSV } from "../utils/excelExport";

interface MonthlyPlannerExcelProps {
  plan: MonthlyPlan;
  onUpdatePlan: (updated: MonthlyPlan) => void;
  onExecuteDayPrompt: (promptText: string, topic: string) => void;
}

export const MonthlyPlannerExcel: React.FC<MonthlyPlannerExcelProps> = ({
  plan,
  onUpdatePlan,
  onExecuteDayPrompt
}) => {
  const [masterPrompt, setMasterPrompt] = useState(
    "Monetizar $3,500 al mes mediante tráfico masivo de Pinterest, videos virales de TikTok/YouTube y venta directa en Shopify con PayPal y Binance"
  );
  const [monthlyTarget, setMonthlyTarget] = useState("$3,500 USD");
  const [niche, setNiche] = useState("Negocios Digitales & Plantillas de IA");
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  // Calculate totals
  const totalGoalNum = plan.days.reduce((acc, d) => {
    const val = parseFloat(d.monetizationGoal.replace(/[^0-9.]/g, "")) || 0;
    return acc + val;
  }, 0);

  const totalActualEarned = plan.days.reduce((acc, d) => acc + (d.actualRevenue || 0), 0);
  const monetizedDaysCount = plan.days.filter((d) => d.status === "Monetizado").length;

  const handleGeneratePlanWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterPrompt,
          targetMonthlyGoal: monthlyTarget,
          niche,
          platforms: ["YouTube", "TikTok", "Instagram", "Pinterest", "Shopify", "Spotify", "PayPal", "Binance"]
        })
      });
      const data = await res.json();

      const newPlan: MonthlyPlan = {
        id: "plan_" + Date.now(),
        planName: data.planName || `Plan de Monetización 30 Días - ${niche}`,
        monthlyTarget: data.monthlyTarget || monthlyTarget,
        dailyPacingTarget: data.dailyPacingTarget || "$116.66 / día",
        strategyOverview: data.strategyOverview || "Plan integral multi-plataforma de 30 días",
        createdAt: new Date().toISOString(),
        days: data.days || plan.days
      };

      onUpdatePlan(newPlan);
    } catch (err) {
      console.error("Error generating monthly plan with Gemini:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDayStatusChange = (dayIndex: number, newStatus: PlanDay["status"]) => {
    const updatedDays = [...plan.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      status: newStatus,
      actualRevenue: newStatus === "Monetizado" && !updatedDays[dayIndex].actualRevenue 
        ? parseFloat(updatedDays[dayIndex].monetizationGoal.replace(/[^0-9.]/g, "")) || 45 
        : updatedDays[dayIndex].actualRevenue
    };
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const filteredDays = filterPlatform === "all"
    ? plan.days
    : plan.days.filter((d) => d.platform.toLowerCase().includes(filterPlatform.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & 1-Prompt Generator Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-black text-[#CBFF00] border border-zinc-800">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                  PLANIFICACIÓN MENSUAL EN 1 PROMPT & EXPORTADOR EXCEL
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  Crea y sincroniza tu calendario estratégico de 30 días con 1 solo prompt de IA. Compatible con Excel (.xlsx / .csv) y Google Sheets.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportPlanToCSV(plan)}
              className="bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase px-4.5 py-3 rounded-xl transition-all shadow-xl shadow-[#CBFF00]/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>DESCARGAR EXCEL (.CSV)</span>
            </button>
          </div>
        </div>

        {/* 1-Prompt Input Interface */}
        <div className="bg-black border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#CBFF00]" />
              <span>1 PROMPT MAESTRO PARA LOS 30 DÍAS DE MONETIZACIÓN</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-zinc-400">GEMINI 3.7 FLASH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <textarea
                rows={2}
                value={masterPrompt}
                onChange={(e) => setMasterPrompt(e.target.value)}
                placeholder="Escribe tu objetivo o prompt maestro aquí..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00] resize-none font-sans"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Nicho de Monetización"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
              />
              <input
                type="text"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                placeholder="Meta Mensual ($)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono font-bold focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            <div className="md:col-span-3 flex items-stretch">
              <button
                onClick={handleGeneratePlanWithAI}
                disabled={isGenerating}
                className="w-full rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all shadow-xl shadow-[#CBFF00]/20 active:scale-95 cursor-pointer py-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>PLANIFICANDO 30 DÍAS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-black" />
                    <span>GENERAR PLAN MENSUAL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <strong className="text-zinc-200 uppercase font-black tracking-wider">Estrategia Activa:</strong> {plan.strategyOverview}
          </p>
        </div>

        {/* Plan Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Meta Total Plan</span>
            <span className="text-xl font-black text-white font-mono">{plan.monthlyTarget}</span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Ingreso Facturado</span>
            <span className="text-xl font-black text-[#CBFF00] font-mono">
              ${totalActualEarned.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Días Monetizados</span>
            <span className="text-xl font-black text-white font-mono">
              {monetizedDaysCount} / 30
            </span>
          </div>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Ritmo Diario</span>
            <span className="text-xl font-black text-zinc-200 font-mono">{plan.dailyPacingTarget}</span>
          </div>
        </div>

      </div>

      {/* 2. 30-Days Interactive Calendar Board */}
      <div className="space-y-4">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
            <Calendar className="w-4 h-4 text-[#CBFF00]" />
            <span>MATRIZ DE 30 DÍAS ({filteredDays.length} DÍAS VISIBLES)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-black border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-bold focus:outline-none focus:border-[#CBFF00]"
            >
              <option value="all">Todas las Plataformas</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="Pinterest">Pinterest</option>
              <option value="Shopify">Shopify</option>
              <option value="Spotify">Spotify</option>
              <option value="Binance">Binance</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
        </div>

        {/* Days Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDays.map((dayItem, idx) => (
            <div
              key={dayItem.day}
              className={`border rounded-2xl p-4.5 flex flex-col justify-between transition-all duration-200 ${
                dayItem.status === "Monetizado"
                  ? "bg-zinc-900 border-[#CBFF00] shadow-xl"
                  : dayItem.status === "Publicado"
                  ? "bg-zinc-900 border-zinc-700"
                  : dayItem.status === "En Progreso"
                  ? "bg-zinc-900 border-zinc-700"
                  : "bg-zinc-900/60 border-zinc-800"
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-black border border-zinc-800 flex items-center justify-center font-mono font-black text-xs text-[#CBFF00]">
                      #{dayItem.day}
                    </span>
                    <div>
                      <span className="text-xs font-black uppercase text-white">{dayItem.platform}</span>
                      <span className="text-[10px] text-zinc-400 font-medium block">{dayItem.actionType}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black text-[#CBFF00] bg-black px-2 py-0.5 rounded border border-zinc-800">
                    Meta: {dayItem.monetizationGoal}
                  </span>
                </div>

                {/* Campaign Title & Prompt Preview */}
                <p className="text-xs font-black text-zinc-100 my-2">{dayItem.title}</p>
                <div className="bg-black p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 font-mono line-clamp-3">
                  {dayItem.promptToExecute}
                </div>
              </div>

              {/* Day Bottom: Status selector & Action */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <select
                  value={dayItem.status}
                  onChange={(e: any) => handleDayStatusChange(dayItem.day - 1, e.target.value)}
                  className={`text-[11px] font-black uppercase px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                    dayItem.status === "Monetizado"
                      ? "bg-[#CBFF00] text-black border-[#CBFF00]"
                      : dayItem.status === "Publicado"
                      ? "bg-zinc-800 text-white border-zinc-700"
                      : dayItem.status === "En Progreso"
                      ? "bg-zinc-800 text-[#CBFF00] border-zinc-700"
                      : "bg-black text-zinc-400 border-zinc-800"
                  }`}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Publicado">Publicado</option>
                  <option value="Monetizado">Monetizado ✓</option>
                </select>

                <button
                  onClick={() => onExecuteDayPrompt(dayItem.promptToExecute, dayItem.title)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>PRODUCIR</span>
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
