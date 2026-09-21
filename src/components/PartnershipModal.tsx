import React, { useState } from "react";
import { 
  X, 
  Handshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  Send,
  Building2,
  Users,
  Award,
  Globe2
} from "lucide-react";
import confetti from "canvas-confetti";

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnershipModal: React.FC<PartnershipModalProps> = ({ isOpen, onClose }) => {
  const [partnerType, setPartnerType] = useState<"investor" | "creator" | "agency" | "tech">("investor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [handleOrCompany, setHandleOrCompany] = useState("");
  const [proposal, setProposal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Glowing Ambient Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#CBFF00] via-[#00FFA3] to-[#00E5FF]" />

        {/* Modal Header */}
        <div className="bg-black p-6 border-b border-zinc-800 flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#CBFF00]/50 text-[#CBFF00] flex items-center justify-center shadow-xl shadow-[#CBFF00]/20 shrink-0">
              <Handshake className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#CBFF00] text-black px-2 py-0.5 rounded-full">
                  ALIANZAS & INVERSIÓN
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                  Made in Brazil 🇧🇷
                </span>
              </div>
              <h3 className="font-black text-white text-lg tracking-tight uppercase">
                Asóciate a CONTUBER <span className="text-[#CBFF00]">IA</span>
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Pre-asistente de monetización e infraestructura para creadores de contenido (2026 - 2030)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            
            {/* Compelling Value Proposition Banner */}
            <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#CBFF00]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-[#CBFF00]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">¿Por qué asociarse en etapa pre-asistente?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs mb-1">
                    <Award className="w-3.5 h-3.5 text-[#CBFF00]" />
                    <span>0% Comisiones</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Exención permanente de comisiones transaccionales para los primeros 100 socios fundadores.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#00FFA3]" />
                    <span>Equity & Rondas</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Prioridad de participación en la ronda seed y nota convertible valorizada en etapa pre-lanzamiento.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs mb-1">
                    <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Advisory Board</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Voz y voto técnico en la evolución del motor de IA y las integraciones bancarias reguladas.
                  </p>
                </div>
              </div>
            </div>

            {/* Partnership Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Partner Type Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                  Perfil de Asociación:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "investor", label: "Inversor / Fondo", icon: TrendingUp },
                    { id: "creator", label: "Creador (+50k)", icon: Award },
                    { id: "agency", label: "Agencia Medios", icon: Building2 },
                    { id: "tech", label: "Partner Tech", icon: Globe2 },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = partnerType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPartnerType(type.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#CBFF00] text-black border-[#CBFF00] shadow-md shadow-[#CBFF00]/20" 
                            : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] whitespace-nowrap">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                    Nombre o Firma:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Carlos Silveira / Alpha Capital"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#CBFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#CBFF00]"
                  />
                </div>
              </div>

              {/* Handle or Organization */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  Canal Principal / Sitio Web / LinkedIn:
                </label>
                <input
                  type="text"
                  value={handleOrCompany}
                  onChange={(e) => setHandleOrCompany(e.target.value)}
                  placeholder="ej. @canalyoutube, linkedin.com/in/... o empresa.com"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#CBFF00]"
                />
              </div>

              {/* Proposal Note */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  Mensaje o Propuesta de Sinergia:
                </label>
                <textarea
                  rows={3}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Explícanos tu interés: ¿Inversión de capital, integración técnica con tus canales o representación de medios en tu país?"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#CBFF00] resize-none"
                />
              </div>

              {/* Direct Official Channels Disclaimer */}
              <div className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300 font-bold">
                  <span className="flex items-center gap-1.5 text-[#CBFF00]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Canales de Enlace Directo Oficial:
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Respaldado por el equipo fundador</span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  También puedes entablar comunicación directa a través de nuestra representación legal oficial en Instagram{" "}
                  <a 
                    href="https://www.instagram.com/f.e.m.m.n.a" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#CBFF00] hover:underline font-bold"
                  >
                    @f.e.m.m.n.a
                  </a>{" "}
                  o con la firma desarrolladora{" "}
                  <a 
                    href="https://web-adversity.vercel.app" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#CBFF00] hover:underline font-bold"
                  >
                    Adsversity
                  </a>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-black uppercase text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#CBFF00]/20 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <span>REGISTRANDO INTERÉS...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>POSTULARME COMO SOCIO</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        ) : (
          /* Confirmation View */
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-zinc-950 border-2 border-[#CBFF00] flex items-center justify-center mx-auto text-[#CBFF00] shadow-2xl shadow-[#CBFF00]/30">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#CBFF00] uppercase font-bold tracking-wider">
                SOLICITUD DE ASOCIACIÓN REGISTRADA
              </span>
              <h4 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                ¡Gracias por querer asociarte a Contuber IA!
              </h4>
              <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                Hemos registrado tu interés como <strong>{partnerType.toUpperCase()}</strong>. 
                Nuestro equipo de representación legal y fundadores revisará tu perfil para extenderte el dossier confidencial de alianzas.
              </p>
            </div>

            <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">ID de Solicitud:</span>
                <span className="text-[#CBFF00] font-bold">PTR-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">Representación:</span>
                <span className="text-zinc-300">@f.e.m.m.n.a (Brasil)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500">Ingeniería:</span>
                <span className="text-zinc-300">Adsversity</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full max-w-md py-3 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl shadow-[#CBFF00]/20"
              >
                VOLVER A LA TERMINAL
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
