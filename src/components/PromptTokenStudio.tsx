import React, { useState } from "react";
import { 
  Sparkles, 
  Cpu, 
  Copy, 
  Check, 
  Play, 
  Zap, 
  DollarSign, 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  Code2
} from "lucide-react";
import { PromptTemplate, PlatformKey } from "../types";

interface PromptTokenStudioProps {
  prompts: PromptTemplate[];
  onSavePrompt: (prompt: PromptTemplate) => void;
  onUsePromptInContentStudio: (promptText: string, topic: string) => void;
}

export const PromptTokenStudio: React.FC<PromptTokenStudioProps> = ({
  prompts,
  onSavePrompt,
  onUsePromptInContentStudio
}) => {
  // Generator Inputs
  const [selectedPlatform, setSelectedPlatform] = useState<string>("youtube");
  const [niche, setNiche] = useState("Monetización con IA & Herramientas Digitales");
  const [objective, setObjective] = useState("Venta directa de plantillas y enlaces de afiliados");
  const [targetAudience, setTargetAudience] = useState("Emprendedores y creadores con intención de compra");
  const [format, setFormat] = useState("Guion de video corto (Shorts / TikTok / Reels)");

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    prompt: string;
    tokensEstimated: number;
    costEstimated: string;
    monetizationAngle: string;
    suggestedVariables: string[];
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active prompt preview / test runner
  const [activeTestPrompt, setActiveTestPrompt] = useState<PromptTemplate | null>(prompts[0] || null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({
    "{NICHO}": "Negocios Digitales",
    "{GANCHO_NEGATIVO}": "El 95% pierde dinero por no automatizar sus cobros",
    "{HERRAMIENTA_IA}": "Gemini 3.8 Flash y Shopify"
  });

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          niche,
          objective,
          targetAudience,
          format
        })
      });
      const data = await res.json();
      setGeneratedResult(data);

      const newTemplate: PromptTemplate = {
        id: "pr_" + Date.now(),
        title: `Prompt Maestro: ${selectedPlatform.toUpperCase()} - ${niche.slice(0, 30)}`,
        platform: selectedPlatform as PlatformKey,
        niche,
        objective,
        promptText: data.prompt,
        tokensEstimated: data.tokensEstimated || 380,
        costEstimated: data.costEstimated || "$0.00006",
        monetizationAngle: data.monetizationAngle || "Conversión directa con ganchos psicológicos",
        variables: data.suggestedVariables || ["{PRODUCTO}", "{ENLACE_AFILIADO}"],
        conversionRate: "8.9% Proyectada",
        isFavorite: true
      };

      onSavePrompt(newTemplate);
      setActiveTestPrompt(newTemplate);
    } catch (err) {
      console.error("Error calling Gemini API:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Replace variables in real-time
  const getRenderedTestText = (template: PromptTemplate) => {
    let result = template.promptText;
    template.variables?.forEach((v) => {
      if (variableValues[v]) {
        result = result.replaceAll(v, variableValues[v]);
      }
    });
    return result;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Cpu className="w-6 h-6 text-[#CBFF00]" />
            <span>GENERADOR & GESTOR DE PROMPTS, TOKENS E IA</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Ingeniería de prompts avanzada con Google Gemini 3.7 Flash optimizada para monetización, CTR y cálculo de tokens.
          </p>
        </div>

        {/* Token Economy Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 flex items-center gap-4 text-xs shadow-xl">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Modelo en Servidor</span>
            <span className="font-mono font-black text-[#CBFF00]">Gemini 3.7 Flash</span>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Costo Promedio / Prompt</span>
            <span className="font-mono font-black text-white">~$0.00006 USD</span>
          </div>
        </div>
      </div>

      {/* Grid: Prompt Creator vs Test Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Prompt Engine Generator Form (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-white flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#CBFF00]" />
              <span>GENERAR PROMPT DE MONETIZACIÓN</span>
            </h3>
            <span className="text-[11px] font-black uppercase text-black bg-[#CBFF00] px-2.5 py-0.5 rounded-full font-mono">
              1-Click AI Gen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Plataforma Objetivo</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 font-bold focus:outline-none focus:border-[#CBFF00]"
              >
                <option value="youtube">YouTube (Shorts, Hooks, Videos Largos)</option>
                <option value="tiktok">TikTok (Guiones de Retención, TikTok Shop)</option>
                <option value="instagram">Instagram (Reels, Secuencias de Stories, DMs)</option>
                <option value="pinterest">Pinterest (Pines SEO, Tráfico a Shopify/Blog)</option>
                <option value="shopify">Shopify & E-Commerce (Páginas de Venta, Upsells)</option>
                <option value="spotify">Spotify & Audio (Regalías, Notas de Podcast)</option>
                <option value="binance">Binance & Web3 (Checkout Cripto, Invoices)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Formato del Contenido</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 font-bold focus:outline-none focus:border-[#CBFF00]"
              >
                <option value="Guion de video corto (Shorts / TikTok / Reels)">Guion Viral Corto (0-45s)</option>
                <option value="Página de Producto & Copywriting Persuasivo">Página de Producto E-Com</option>
                <option value="Pines SEO con Enlaces Directos">Pines SEO de Alto Tráfico</option>
                <option value="Secuencia de Stories con Sticker de Pago">Secuencia de Stories (Venta)</option>
                <option value="Email / Mensaje de Difusión">Mensaje de Difusión / Newsletter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nicho / Tema de Monetización</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ej: Finanzas personales, Cripto, Herramientas IA, Bienestar..."
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Objetivo de Venta / Conversión</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ej: Vender plantilla de $19.99, conseguir clics de afiliados, obtener streams de audio..."
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Audiencia Objetivo</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ej: Creadores de contenido, profesionales independientes, compradores online..."
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#CBFF00]/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ESTRUCTURANDO PROMPT CON GEMINI 3.7 FLASH...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>GENERAR PROMPT MAESTRO OPTIMIZADO</span>
              </>
            )}
          </button>

          {/* Generated Result Box */}
          {generatedResult && (
            <div className="bg-black border border-zinc-800 rounded-2xl p-4.5 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-[#CBFF00] flex items-center gap-1.5 uppercase tracking-wider">
                  <Check className="w-4 h-4 stroke-[3]" /> PROMPT LISTO PARA PRODUCCIÓN
                </span>
                <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400 font-bold">
                  <span>Tokens: ~{generatedResult.tokensEstimated}</span>
                  <span className="text-[#CBFF00]">{generatedResult.costEstimated}</span>
                </div>
              </div>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed">
                {generatedResult.prompt}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-400">
                  Ángulo: <strong className="text-zinc-200">{generatedResult.monetizationAngle}</strong>
                </span>
                <button
                  onClick={() => handleCopy(generatedResult.prompt, "gen_result")}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === "gen_result" ? <Check className="w-3.5 h-3.5 text-[#CBFF00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === "gen_result" ? "COPIADO" : "COPIAR PROMPT"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Prompt Library & Live Variable Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Active Prompt Tester */}
          {activeTestPrompt && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wide text-zinc-200 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#CBFF00]" />
                  <span>LABORATORIO DE VARIABLES</span>
                </h4>
                <span className="text-[10px] font-black text-black bg-[#CBFF00] px-2 py-0.5 rounded">
                  {activeTestPrompt.conversionRate}
                </span>
              </div>

              <p className="text-xs font-black text-white">{activeTestPrompt.title}</p>

              {/* Dynamic Variables Inputs */}
              {activeTestPrompt.variables && activeTestPrompt.variables.length > 0 && (
                <div className="space-y-2 bg-black p-3 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">CONFIGURAR VARIABLES</span>
                  {activeTestPrompt.variables.map((v) => (
                    <div key={v} className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#CBFF00] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 min-w-[120px] truncate">
                        {v}
                      </span>
                      <input
                        type="text"
                        value={variableValues[v] || ""}
                        onChange={(e) => setVariableValues({ ...variableValues, [v]: e.target.value })}
                        placeholder={`Valor para ${v}`}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Live Rendered Output */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">PROMPT FINAL COMPILADO:</span>
                <div className="bg-black p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {getRenderedTestText(activeTestPrompt)}
                </div>
              </div>

              {/* Send to Production Studio */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleCopy(getRenderedTestText(activeTestPrompt), activeTestPrompt.id)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === activeTestPrompt.id ? <Check className="w-3.5 h-3.5 text-[#CBFF00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === activeTestPrompt.id ? "COPIADO" : "COPIAR"}</span>
                </button>

                <button
                  onClick={() => onUsePromptInContentStudio(getRenderedTestText(activeTestPrompt), activeTestPrompt.niche)}
                  className="flex-1 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#CBFF00]/20 cursor-pointer"
                >
                  <span>PRODUCIR</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* Prompt Templates Library */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wide text-zinc-200 flex items-center justify-between">
              <span>BIBLIOTECA DE PROMPTS ({prompts.length})</span>
              <BookmarkCheck className="w-4 h-4 text-[#CBFF00]" />
            </h4>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {prompts.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setActiveTestPrompt(pr)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeTestPrompt?.id === pr.id
                      ? "bg-black border-[#CBFF00] shadow-md"
                      : "bg-black/60 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-zinc-200 truncate max-w-[200px]">{pr.title}</span>
                    <span className="text-[10px] font-mono font-bold text-[#CBFF00]">{pr.costEstimated}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{pr.objective}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
