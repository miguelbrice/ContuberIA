import React, { useState } from "react";
import { 
  X, 
  Plus, 
  Check, 
  ShieldCheck, 
  Video, 
  Music, 
  Flame, 
  Instagram, 
  ShoppingBag, 
  CreditCard, 
  Coins, 
  RefreshCw,
  ExternalLink,
  Radio,
  Tv,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PlatformAccount, PlatformKey } from "../types";

interface StreamOAuthOption {
  key: "twitch" | "youtube" | "kick" | "tiktok" | "spotify";
  name: string;
  category: "Video" | "Audio" | "Redes";
  color: string;
  badge: string;
  scopes: string[];
  icon: any;
  defaultChannel: string;
}

const STREAM_PROVIDERS: StreamOAuthOption[] = [
  {
    key: "youtube",
    name: "YouTube Partner & Shorts",
    category: "Video",
    color: "border-red-500/40 bg-red-500/10 text-red-400",
    badge: "API v3 + Analytics",
    scopes: ["yt-analytics.readonly", "youtube.readonly", "monetary.readonly"],
    icon: Video,
    defaultChannel: "Canal Creator Tech"
  },
  {
    key: "twitch",
    name: "Twitch Partner / Affiliate",
    category: "Video",
    color: "border-purple-500/40 bg-purple-500/10 text-purple-400",
    badge: "OAuth PKCE Bits & Subs",
    scopes: ["channel:read:subscriptions", "bits:read", "channel:read:redemptions"],
    icon: Tv,
    defaultChannel: "Creator_Streamer"
  },
  {
    key: "kick",
    name: "Kick Streaming 95/5",
    category: "Video",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    badge: "Sub Split 95%",
    scopes: ["channel.view", "revenue.read"],
    icon: Radio,
    defaultChannel: "CreatorKickOfficial"
  },
  {
    key: "tiktok",
    name: "TikTok Live & Creator Shop",
    category: "Redes",
    color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
    badge: "Live Gifting API",
    scopes: ["user.info.basic", "video.list", "live.event"],
    icon: Flame,
    defaultChannel: "@creator_monetiza"
  },
  {
    key: "spotify",
    name: "Spotify for Podcasters & Royalties",
    category: "Audio",
    color: "border-green-500/40 bg-green-500/10 text-green-400",
    badge: "DistroKid / Regalías",
    scopes: ["user-read-playback-state", "streaming"],
    icon: Music,
    defaultChannel: "Podcast IA & Finanzas"
  }
];

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: PlatformAccount) => void;
}

export const NewAccountModal: React.FC<NewAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount
}) => {
  // Tab: "oauth" (FE-3: Streaming verificado) or "manual" (Otras pasarelas)
  const [mode, setMode] = useState<"oauth" | "manual">("oauth");

  // Selected OAuth provider (FE-3.1)
  const [selectedProvider, setSelectedProvider] = useState<StreamOAuthOption>(STREAM_PROVIDERS[0]);
  const [channelHandle, setChannelHandle] = useState(STREAM_PROVIDERS[0].defaultChannel);
  
  // Status during simulation (FE-3.1, FE-3.2, FE-3.3)
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStep, setAuthStep] = useState<string>("");
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Manual Form State
  const [manualPlatform, setManualPlatform] = useState<PlatformKey>("shopify");
  const [accountName, setAccountName] = useState("");
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("5000");
  const [payoutMethod, setPayoutMethod] = useState("PayPal / Transferencia");
  const [payoutAddress, setPayoutAddress] = useState("creador.demo@contuber.io");

  if (!isOpen) return null;

  // FE-3.1 & FE-3.3: Conexión OAuth2 y Sincronización Inicial de Datos
  const handleConnectStreamOAuth = async (shouldFail: boolean = false) => {
    setIsAuthorizing(true);
    setSyncFeedback(null);
    setAuthStep(`Abriendo ventana de autorización segura con ${selectedProvider.name}...`);

    if (shouldFail) {
      // FE-3.2: Fallo o cancelación de autorización
      setTimeout(() => {
        setIsAuthorizing(false);
        setSyncFeedback(`Cancelado por el usuario: No se otorgaron los permisos para ${selectedProvider.name}. El estado no fue modificado (FE-3.2).`);
      }, 1000);
      return;
    }

    setTimeout(() => {
      setAuthStep("Intercambiando token seguro OAuth2 (PKCE) y verificando canal...");
      setTimeout(async () => {
        setAuthStep("Sincronizando métricas en tiempo real, RPM de monetización y estado en vivo (FE-3.3)...");

        try {
          const res = await fetch("/api/stream/oauth-connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: selectedProvider.key,
              channelHandle: channelHandle.trim() || selectedProvider.defaultChannel
            })
          });
          const data = await res.json();

          const platformMap: Record<string, PlatformKey> = {
            youtube: "youtube",
            twitch: "youtube", // Maps to video category
            kick: "youtube",
            tiktok: "tiktok",
            spotify: "spotify"
          };

          const newAcc: PlatformAccount = {
            id: "stream_" + selectedProvider.key + "_" + Date.now(),
            platform: platformMap[selectedProvider.key] || "youtube",
            platformName: `${selectedProvider.name} (Verificado)`,
            accountName: channelHandle || `${selectedProvider.name} Oficial`,
            handle: channelHandle.startsWith("@") ? channelHandle : `@${channelHandle.toLowerCase().replace(/\s+/g, "_")}`,
            status: "active",
            revenueVelocity: +(parseFloat(data.account?.projectedRpm || "2.4") / 60).toFixed(4),
            totalEarned: Math.floor(Math.random() * 450 + 120),
            followersOrSubs: data.account?.viewerCount ? data.account.viewerCount * 25 : 12400,
            metricLabel: "Estado Stream Verificado",
            metricValue: `OAuth2 OK • ${data.account?.liveStatus || "ONLINE"} (${data.account?.viewerCount || 340} viewers)`,
            monetizationStatus: "Aprobado / Activo",
            payoutMethod: "Dispersión Automática 24/7",
            payoutAddress: "creador.demo@contuber.io",
            lastSync: "Recién sincronizado con API",
            category: selectedProvider.category,
            badgeColor: selectedProvider.color,
            logoIcon: selectedProvider.key === "youtube" ? "Youtube" : (selectedProvider.key === "spotify" ? "Music" : "Video")
          };

          setIsAuthorizing(false);
          onAddAccount(newAcc);
          onClose();
        } catch {
          setIsAuthorizing(false);
          onClose();
        }
      }, 1000);
    }, 900);
  };

  // Manual fallback add
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAcc: PlatformAccount = {
      id: "acc_" + manualPlatform + "_" + Date.now(),
      platform: manualPlatform,
      platformName: manualPlatform.toUpperCase(),
      accountName: accountName || `${manualPlatform.toUpperCase()} Store`,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      status: "active",
      revenueVelocity: 0.025,
      totalEarned: 50,
      followersOrSubs: parseInt(followers) || 1000,
      metricLabel: "Estado de Monetización",
      metricValue: "Conectado & Sincronizado",
      monetizationStatus: "Aprobado / Activo",
      payoutMethod,
      payoutAddress,
      lastSync: "Recién vinculado",
      category: "E-commerce",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      logoIcon: "ShoppingBag"
    };

    onAddAccount(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CBFF00] text-black flex items-center justify-center font-black shadow-lg shadow-[#CBFF00]/20">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm uppercase tracking-tight">Vincular Plataforma / Stream</h3>
                <span className="text-[10px] font-black bg-zinc-800 text-[#CBFF00] px-2 py-0.5 rounded-full uppercase">
                  Módulo FE-3
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Autenticación OAuth 2.0 en plataformas de streaming verificadas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setMode("oauth")}
              className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === "oauth" 
                  ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              OAuth2 Streams (FE-3.1)
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === "manual" 
                  ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Otras Cuentas / Tiendas
            </button>
          </div>
        </div>

        {/* Cancelled Notice (FE-3.2) */}
        {syncFeedback && (
          <div className="mx-5 mt-4 p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* MODE 1: OAuth2 Streaming Providers (FE-3.1, FE-3.2, FE-3.3) */}
        {mode === "oauth" ? (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                1. Selecciona Proveedor de Streaming Verificado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STREAM_PROVIDERS.map((provider) => {
                  const Icon = provider.icon;
                  const isSelected = selectedProvider.key === provider.key;
                  return (
                    <button
                      key={provider.key}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setChannelHandle(provider.defaultChannel);
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "bg-zinc-900 border-[#CBFF00] shadow-lg shadow-[#CBFF00]/10" 
                          : "bg-black/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${provider.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{provider.name.split("/")[0]}</p>
                          <p className="text-[10px] text-zinc-400">{provider.badge}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#CBFF00] stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                2. Canal o Handle a Vincular
              </label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="Nombre de canal o @handle"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#CBFF00]"
              />
              <div className="mt-1.5 flex flex-wrap gap-1">
                {selectedProvider.scopes.map((s, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                    scope: {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Authorization Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isAuthorizing}
                onClick={() => handleConnectStreamOAuth(false)}
                className="w-full py-3.5 rounded-2xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#CBFF00]/20 disabled:opacity-50"
              >
                {isAuthorizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                    <span>{authStep}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>AUTORIZAR & VINCULAR OAUTH 2.0 (FE-3.1)</span>
                  </>
                )}
              </button>

              {/* Simulation button for FE-3.2 (Cancelation test) */}
              <button
                type="button"
                disabled={isAuthorizing}
                onClick={() => handleConnectStreamOAuth(true)}
                className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors cursor-pointer"
              >
                [Probar Escenario FE-3.2: Simular Cancelación de Autorización]
              </button>
            </div>
          </div>
        ) : (
          /* MODE 2: Manual Form for Stores / Non-Streaming Platforms */
          <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Plataforma</label>
              <select
                value={manualPlatform}
                onChange={(e: any) => setManualPlatform(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
              >
                <option value="shopify">Shopify Store (Venta Digital & E-com)</option>
                <option value="pinterest">Pinterest Business (Tráfico Directo)</option>
                <option value="instagram">Instagram (Reels & Funnel)</option>
                <option value="gumroad">Gumroad (Infoproductos & Plantillas)</option>
                <option value="paypal">PayPal Gateway (Checkout)</option>
                <option value="binance">Binance Pay (Liquidación Cripto)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nombre / Identificador</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Ej: Tienda Digital de Plantillas"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Enlace o Handle</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@tienda_oficial o mi-tienda.myshopify.com"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Guardar Cuenta Manual
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
