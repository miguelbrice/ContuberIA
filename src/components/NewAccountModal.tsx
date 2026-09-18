import React, { useState } from "react";
import { X, Plus, Check, ShieldCheck, Video, Music, Flame, Instagram, ShoppingBag, CreditCard, Coins } from "lucide-react";
import { PlatformAccount, PlatformKey } from "../types";

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
  const [platform, setPlatform] = useState<PlatformKey>("youtube");
  const [accountName, setAccountName] = useState("");
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("5000");
  const [payoutMethod, setPayoutMethod] = useState("PayPal / Transferencia");
  const [payoutAddress, setPayoutAddress] = useState("paypal@creadordigital.com");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const platformConfig: Record<PlatformKey, { name: string; cat: PlatformAccount["category"]; color: string; icon: string }> = {
      youtube: { name: "YouTube Partner", cat: "Video", color: "bg-red-500/10 text-red-400 border-red-500/30", icon: "Youtube" },
      spotify: { name: "Spotify & Apple Music", cat: "Audio", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "Music" },
      pinterest: { name: "Pinterest Business", cat: "Tráfico", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", icon: "Flame" },
      tiktok: { name: "TikTok Creator & Shop", cat: "Redes", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", icon: "Video" },
      instagram: { name: "Instagram Funnel", cat: "Redes", color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30", icon: "Instagram" },
      shopify: { name: "Shopify Store", cat: "E-commerce", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: "ShoppingBag" },
      paypal: { name: "PayPal Merchant", cat: "Pasarela", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: "CreditCard" },
      binance: { name: "Binance Crypto Pay", cat: "Cripto", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: "Coins" },
      gumroad: { name: "Gumroad Infoproducts", cat: "E-commerce", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: "ShoppingBag" }
    };

    const cfg = platformConfig[platform];

    const newAcc: PlatformAccount = {
      id: "acc_" + platform + "_" + Date.now(),
      platform,
      platformName: cfg.name,
      accountName: accountName || `${cfg.name} - Cuenta #${Math.floor(Math.random() * 90 + 10)}`,
      handle: handle.startsWith("@") || handle.includes(".") ? handle : `@${handle}`,
      status: "active",
      revenueVelocity: 0.035,
      totalEarned: 0,
      followersOrSubs: parseInt(followers) || 1000,
      metricLabel: "Estado de Monetización",
      metricValue: "Conectado & Sincronizado",
      monetizationStatus: "Aprobado / Activo",
      payoutMethod,
      payoutAddress,
      lastSync: "Recién vinculado",
      category: cfg.cat,
      badgeColor: cfg.color,
      logoIcon: cfg.icon
    };

    onAddAccount(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-[#CBFF00] flex items-center justify-center border border-zinc-800">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-tight">Vincular Nueva Cuenta / Plataforma</h3>
              <p className="text-[11px] text-zinc-400 font-medium">Soporta múltiples cuentas del mismo usuario</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Plataforma a Conectar</label>
            <select
              value={platform}
              onChange={(e: any) => setPlatform(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            >
              <option value="youtube">YouTube (Canal de Video / Shorts)</option>
              <option value="spotify">Spotify / Apple Music / DistroKid</option>
              <option value="pinterest">Pinterest Business (Tráfico Directo)</option>
              <option value="tiktok">TikTok (TikTok Shop & Creador)</option>
              <option value="instagram">Instagram (Reels, Funnels, DMs)</option>
              <option value="shopify">Shopify Store (Venta Digital & E-com)</option>
              <option value="paypal">PayPal Merchant Gateway</option>
              <option value="binance">Binance Cripto Pay (USDT Global)</option>
              <option value="gumroad">Gumroad (Productos Digitales)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nombre Descriptivo de la Cuenta</label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Ej: Canal Tech IA #2, Tienda Ropa Shopify, Tablero Pinterest..."
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Usuario / ID / Handle</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@usuario o ID de tienda"
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono font-bold focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Audiencia / Suscriptores</label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="10000"
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono font-bold focus:outline-none focus:border-[#CBFF00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Destino de Cobro / Payout</label>
            <input
              type="text"
              value={payoutAddress}
              onChange={(e) => setPayoutAddress(e.target.value)}
              placeholder="Email PayPal, IBAN Bancario, o Billetera USDT Binance"
              className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-[#CBFF00]"
            />
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-zinc-800 flex items-center gap-2.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#CBFF00] shrink-0 stroke-[2.5]" />
            <span className="font-medium">Validado bajo el certificado KYC de tu cuenta principal.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-black uppercase text-zinc-300 hover:bg-zinc-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 cursor-pointer"
            >
              VINCULAR CUENTA
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
