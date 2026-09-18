import React, { useState, useEffect } from "react";
import { X, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Zap } from "lucide-react";
import { PlatformAccount } from "../types";

interface AIChannelAuditorProps {
  isOpen: boolean;
  onClose: () => void;
  account: PlatformAccount | null;
  ratePerSecond: number;
}

export const AIChannelAuditor: React.FC<AIChannelAuditorProps> = ({
  isOpen,
  onClose,
  account,
  ratePerSecond
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<{
    diagnosis: string;
    bottleneck: string;
    actionItems: string[];
    projectedRevenueMultiplier: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && account) {
      runAudit();
    }
  }, [isOpen, account]);

  const runAudit = async () => {
    if (!account) return;
    setIsAuditing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/gemini/analyze-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: account.platformName,
          metrics: {
            handle: account.handle,
            followers: account.followersOrSubs,
            totalEarned: account.totalEarned,
            metric: account.metricValue
          },
          currentRevenuePerMin: `$${(ratePerSecond * 60).toFixed(2)}/min`
        })
      });
      const data = await res.json();
      if (data && data.diagnosis) {
        setAuditData(data);
      } else if (data && data.error) {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      console.error("Error in AI audit:", err);
      setErrorMsg("No se pudo conectar con el servicio de auditoría.");
    } finally {
      setIsAuditing(false);
    }
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-[#CBFF00] flex items-center justify-center border border-zinc-800">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-tight">Auditoría IA de Monetización</h3>
              <p className="text-[11px] text-zinc-400 font-medium">{account.platformName} • {account.handle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isAuditing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#CBFF00] animate-spin" />
              <p className="text-xs font-black uppercase tracking-wider text-zinc-200">Analizando métricas con Gemini 3.8 Flash...</p>
              <p className="text-[11px] text-zinc-400 font-medium">Calculando cuellos de botella y multiplicadores de conversión</p>
            </div>
          ) : errorMsg && !auditData ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase text-white tracking-tight">Aviso de Auditoría</p>
                <p className="text-xs text-zinc-400 max-w-sm">{errorMsg}</p>
              </div>
              <button
                onClick={runAudit}
                className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                REINTENTAR AUDITORÍA
              </button>
            </div>
          ) : auditData ? (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Multiplier pill */}
              <div className="bg-black border border-[#CBFF00]/40 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-[#CBFF00]/10">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider">Potencial de Crecimiento</span>
                  <p className="text-xs text-zinc-200 font-bold">Incremento proyectado con optimización:</p>
                </div>
                <span className="text-2xl font-black text-[#CBFF00] font-mono">
                  {auditData.projectedRevenueMultiplier || "3.4x"}
                </span>
              </div>

              {/* Diagnosis */}
              <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#CBFF00] stroke-[2.5]" /> Diagnóstico del Canal
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">{auditData.diagnosis}</p>
              </div>

              {/* Bottleneck */}
              <div className="bg-black p-4 rounded-xl border border-amber-500/30 space-y-1.5">
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" /> Cuello de Botella Detectado
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">{auditData.bottleneck}</p>
              </div>

              {/* Action items */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">4 Acciones de Alto Impacto para Escalar:</span>
                <div className="space-y-1.5">
                  {auditData.actionItems.map((item, idx) => (
                    <div key={idx} className="bg-black p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#CBFF00] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 cursor-pointer"
                >
                  APLICAR AL PLAN
                </button>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
