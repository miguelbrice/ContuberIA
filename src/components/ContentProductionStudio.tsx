import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  RefreshCw, 
  Video, 
  Music, 
  Flame, 
  Instagram, 
  ShoppingBag, 
  CreditCard, 
  Coins, 
  Download,
  Share2,
  Layers,
  ArrowRight
} from "lucide-react";
import { GeneratedContent } from "../types";

interface ContentProductionStudioProps {
  initialTopic?: string;
  initialPrompt?: string;
  onSendToDistribution: (content: GeneratedContent) => void;
}

export const ContentProductionStudio: React.FC<ContentProductionStudioProps> = ({
  initialTopic = "Pack Maestro de Plantillas de Monetización con IA",
  initialPrompt = "",
  onSendToDistribution
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [offerUrl, setOfferUrl] = useState("https://tienda-monetiza.com/oferta-especial");
  const [productType, setProductType] = useState("Producto Digital / Plantillas");
  const [price, setPrice] = useState("$27.00 USD");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"youtube" | "tiktok" | "instagram" | "pinterest" | "spotify" | "shopify">("youtube");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>({
    id: "cnt_default_1",
    topic: "Pack Maestro de Plantillas de Monetización con IA",
    productUrl: "https://tienda-monetiza.com/oferta-especial",
    price: "$27.00 USD",
    createdAt: new Date().toISOString(),
    youtube: {
      title: "Cómo Generar $0.01 por Segundo con Automatizaciones de IA (Paso a Paso)",
      hook: "¿Sabías que puedes monetizar desde el primer día con una sola automatización?",
      script: "Gancho (0-5s): La mayoría pierde horas sin ver $0.01.\nContenido (5-35s): Aquí está la estrategia de 3 pasos para conectar tu pasarela de pago y activar tráfico orgánico en Pinterest y TikTok.\nCTA (35-45s): Toca el enlace en el comentario fijado para descargar la guía completa y activar tus pagos automáticos.",
      tags: ["#monetizacion", "#finanzas", "#ingresospasivos", "#emprendimiento", "#ia"]
    },
    tiktok: {
      hook: "3 errores que te impiden monetizar en automático este mes 👇",
      body: "1. No tener un embudo directo de pago.\n2. Vender sin un gancho de alta retención.\n3. No enlazar tu bio a un producto digital escalable con PayPal o Binance.",
      cta: "Comenta 'MONETIZAR' y te envío el acceso directo a tu DM ahora mismo."
    },
    instagram: {
      reelCaption: "Automatiza tus ventas mientras duermes 💸✨\n\nSi quieres aprender cómo empaquetar tu conocimiento o productos de afiliados en un sistema que factura 24/7:\n\n1️⃣ Enlaza tu tienda en la Bio\n2️⃣ Aplica este prompt diario\n3️⃣ Recibe pagos directos en PayPal o Binance\n\n🔗 Link en biografía o escribe INFO.",
      storyIdeas: [
        "Story 1: Encuesta: ¿Prefieres ingresos activos o pasivos?",
        "Story 2: Captura de notificación de pago ($0.01 por segundo en tiempo real)",
        "Story 3: Sticker de enlace con descuento 50% por 24 horas"
      ]
    },
    pinterest: {
      pinTitle: "Sistema de Monetización Digital con IA | Guía Definitiva 2026",
      description: "Descubre cómo configurar tu sistema de ingresos pasivos y marketing de afiliados. Dirige tráfico a tu tienda o blog en segundos con enlaces directos.",
      destinationLink: "https://tienda-monetiza.com/oferta-especial"
    },
    audioPodcast: {
      trackTitle: "Episodio Express: Estrategias de Monetización con IA & Regalías",
      showNotes: "En este episodio desglosamos cómo obtener regalías y automatizar conversiones recurrentes. Recursos mencionados y enlaces directos de patrocinio en la descripción."
    },
    ecommerceShopify: {
      productTitle: "Pack Maestro: Plantillas de Monetización Rápida & IA 2026",
      shortPitch: "Plantillas listas para copiar y pegar que convierten seguidores en clientes automáticos con pasarela instantánea.",
      priceSuggested: "$27.00 USD",
      bullets: [
        "Acceso inmediato a prompts probados de alta conversión",
        "Configuración en menos de 10 minutos para Shopify, PayPal y Binance",
        "Garantía de reembolso de 30 días sin preguntas"
      ]
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          offerUrl,
          productType,
          price
        })
      });
      const data = await res.json();

      const newContent: GeneratedContent = {
        id: "cnt_" + Date.now(),
        topic,
        productUrl: offerUrl,
        price,
        createdAt: new Date().toISOString(),
        ...data
      };

      setGeneratedContent(newContent);
    } catch (err) {
      console.error("Error generating content:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight uppercase">
            <Sparkles className="w-6 h-6 text-[#CBFF00]" />
            <span>PRODUCTOR DE CONTENIDO MULTI-PLATAFORMA</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Genera en 1 solo clic piezas listas para monetizar en YouTube, TikTok, Instagram, Pinterest, Spotify y Shopify.
          </p>
        </div>

        {generatedContent && (
          <button
            onClick={() => onSendToDistribution(generatedContent)}
            className="bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase px-4.5 py-3 rounded-xl transition-all shadow-xl shadow-[#CBFF00]/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4 stroke-[3]" />
            <span>ENVIAR A DISTRIBUCIÓN & BUCLE</span>
          </button>
        )}
      </div>

      {/* Inputs Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Tema / Producto a Monetizar</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: Plantilla de finanzas, Guía de IA, Curso de automatizaciones..."
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Enlace de Oferta / Destino</label>
            <input
              type="text"
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
              placeholder="https://mitienda.com/producto"
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Precio Objetivo ($)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$19.99 USD"
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono font-bold focus:outline-none focus:border-[#CBFF00]"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#CBFF00]/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>REDACTANDO PIEZAS CON GEMINI 3.7 FLASH...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-black" />
              <span>PRODUCIR CONTENIDO MULTI-PLATAFORMA</span>
            </>
          )}
        </button>
      </div>

      {/* Multi-Platform Output Tabs */}
      {generatedContent && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Tabs Navigation */}
          <div className="bg-black px-4 py-2.5 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("youtube")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "youtube" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" /> YouTube Video & Shorts
            </button>

            <button
              onClick={() => setActiveTab("tiktok")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "tiktok" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" /> TikTok Viral Script
            </button>

            <button
              onClick={() => setActiveTab("instagram")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "instagram" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Instagram className="w-4 h-4" /> Instagram Reels & Stories
            </button>

            <button
              onClick={() => setActiveTab("pinterest")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "pinterest" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flame className="w-4 h-4" /> Pinterest SEO Pins
            </button>

            <button
              onClick={() => setActiveTab("shopify")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "shopify" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Shopify Store Copy
            </button>

            <button
              onClick={() => setActiveTab("spotify")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "spotify" ? "bg-[#CBFF00] text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Music className="w-4 h-4" /> Spotify & Audio Regalías
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            
            {/* YOUTUBE */}
            {activeTab === "youtube" && generatedContent.youtube && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00]">Título de Alta Tasa de Clics (CTR):</span>
                  <button
                    onClick={() => handleCopy(generatedContent.youtube?.title || "", "yt_title")}
                    className="text-xs text-zinc-400 hover:text-white font-black uppercase flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "yt_title" ? <Check className="w-3.5 h-3.5 text-[#CBFF00]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "yt_title" ? "COPIADO" : "COPIAR"}</span>
                  </button>
                </div>
                <p className="text-sm font-black text-white bg-black p-3.5 rounded-xl border border-zinc-800">
                  {generatedContent.youtube.title}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00]">Guion Estructurado con Timestamps:</span>
                  <button
                    onClick={() => handleCopy(generatedContent.youtube?.script || "", "yt_script")}
                    className="text-xs text-zinc-400 hover:text-white font-black uppercase flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "yt_script" ? <Check className="w-3.5 h-3.5 text-[#CBFF00]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "yt_script" ? "COPIADO" : "COPIAR GUION"}</span>
                  </button>
                </div>
                <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedContent.youtube.script}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {generatedContent.youtube.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#CBFF00] bg-black px-2.5 py-1 rounded-lg border border-zinc-800 font-mono font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TIKTOK */}
            {activeTab === "tiktok" && generatedContent.tiktok && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Gancho de los Primeros 3 Segundos:</span>
                  <div className="bg-black p-3.5 rounded-xl border border-zinc-800 text-xs font-black text-white">
                    {generatedContent.tiktok.hook}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Cuerpo del Video de Retención:</span>
                  <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed">
                    {generatedContent.tiktok.body}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Llamado a la Acción (CTA) para Bio / DM:</span>
                  <div className="bg-black p-3.5 rounded-xl border border-[#CBFF00]/40 text-xs font-black text-[#CBFF00]">
                    {generatedContent.tiktok.cta}
                  </div>
                </div>
              </div>
            )}

            {/* INSTAGRAM */}
            {activeTab === "instagram" && generatedContent.instagram && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Copywriting de Reel / Post:</span>
                  <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-sans whitespace-pre-wrap leading-relaxed">
                    {generatedContent.instagram.reelCaption}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Secuencia de 3 Stories con Sticker de Pago:</span>
                  <div className="space-y-2">
                    {generatedContent.instagram.storyIdeas.map((st, i) => (
                      <div key={i} className="bg-black p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 font-medium">
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PINTEREST */}
            {activeTab === "pinterest" && generatedContent.pinterest && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Título SEO del Pin:</span>
                  <p className="text-sm font-black text-white bg-black p-3.5 rounded-xl border border-zinc-800">
                    {generatedContent.pinterest.pinTitle}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Descripción de Alto Tráfico:</span>
                  <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-medium">
                    {generatedContent.pinterest.description}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Enlace de Destino Directo:</span>
                  <p className="text-xs font-mono text-[#CBFF00] bg-black p-3 rounded-xl border border-zinc-800">
                    {generatedContent.pinterest.destinationLink}
                  </p>
                </div>
              </div>
            )}

            {/* SHOPIFY */}
            {activeTab === "shopify" && generatedContent.ecommerceShopify && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-0.5">Título del Producto Digital:</span>
                    <h4 className="text-sm font-black text-white">{generatedContent.ecommerceShopify.productTitle}</h4>
                  </div>
                  <span className="text-base font-black text-black bg-[#CBFF00] px-3.5 py-1 rounded-xl">
                    {generatedContent.ecommerceShopify.priceSuggested}
                  </span>
                </div>

                <div className="bg-black p-4.5 rounded-xl border border-zinc-800 text-xs text-zinc-200">
                  <p className="font-bold text-white mb-3">{generatedContent.ecommerceShopify.shortPitch}</p>
                  <ul className="space-y-2">
                    {generatedContent.ecommerceShopify.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-zinc-300 font-medium">
                        <Check className="w-4 h-4 text-[#CBFF00] shrink-0 stroke-[3]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SPOTIFY & AUDIO */}
            {activeTab === "spotify" && generatedContent.audioPodcast && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Título de Episodio / Track:</span>
                  <p className="text-sm font-black text-white bg-black p-3.5 rounded-xl border border-zinc-800">
                    {generatedContent.audioPodcast.trackTitle}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CBFF00] block mb-1">Show Notes & Enlaces de Regalías:</span>
                  <div className="bg-black p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-medium">
                    {generatedContent.audioPodcast.showNotes}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
