import React, { useState } from "react";
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  RefreshCw 
} from "lucide-react";

export interface UserSession {
  name: string;
  email: string;
  role: string;
  profileName: string;
  kycLevel: string;
  authenticatedAt: string;
}

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("Miguel A.");
  const [email, setEmail] = useState("miguel0db@gmail.com");
  const [pin, setPin] = useState("2026");
  const [profileName, setProfileName] = useState("Perfil Principal: Miguel A.");
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickLogin = (selectedUser: { name: string; email: string; profile: string; role: string }) => {
    setIdentifier(selectedUser.name);
    setEmail(selectedUser.email);
    setProfileName(selectedUser.profile);
    setPin("2026");
    executeLogin(selectedUser.name, selectedUser.email, selectedUser.profile, selectedUser.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre de usuario o correo.");
      return;
    }
    if (!pin.trim()) {
      setErrorMsg("Por favor, ingresa tu clave o PIN de acceso.");
      return;
    }

    executeLogin(identifier, email || `${identifier.toLowerCase().replace(/\s+/g, "")}@monetipre.io`, profileName, "Creador Autorizado");
  };

  const executeLogin = (userName: string, userEmail: string, userProfile: string, userRole: string) => {
    setErrorMsg(null);
    setIsAuthenticating(true);
    setAuthStep("Validando credenciales y firma de seguridad...");

    setTimeout(() => {
      setAuthStep("Verificando certificados biométricos KYC...");
      setTimeout(() => {
        setAuthStep("Iniciando monitor de telemetría y micro-ingresos...");
        setTimeout(() => {
          setIsAuthenticating(false);
          const session: UserSession = {
            name: userName,
            email: userEmail,
            role: userRole,
            profileName: userProfile,
            kycLevel: "Nivel 3 (Biometría Facial Aprobada 99.4%)",
            authenticatedAt: new Date().toLocaleTimeString()
          };

          if (rememberMe) {
            try {
              localStorage.setItem("monetipre_session", JSON.stringify(session));
            } catch (e) {
              console.warn("Storage not available");
            }
          }

          onLoginSuccess(session);
        }, 600);
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col justify-between antialiased selection:bg-[#CBFF00] selection:text-black p-4 md:p-8">
      
      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CBFF00] p-0.5 shadow-lg shadow-[#CBFF00]/20 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#CBFF00] fill-[#CBFF00]/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white tracking-tight">MONETI<span className="text-[#CBFF00]">PRE</span> IA</span>
              <span className="text-[10px] font-black bg-[#CBFF00] text-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                v3.7 PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Terminal Central de Monetización & Control de Ingresos</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-xs text-zinc-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#CBFF00] stroke-[2.5]" />
          <span>Acceso Seguro Encriptado (TLS 1.3)</span>
        </div>
      </header>

      {/* Center Authentication Card */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CBFF00] to-transparent opacity-80" />

          {/* Heading */}
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[#CBFF00] tracking-wider">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> Identificación Requerida
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              ACCESO A MONITOR
            </h1>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Identifícate con tus credenciales de operador o creador para iniciar el monitor en vivo y desbloquear el panel de control y transacciones.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          )}

          {/* Identification Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Usuario / Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ej: Miguel A. o miguel0db@gmail.com"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#CBFF00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Clave de Seguridad / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN o contraseña de acceso"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#CBFF00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-200 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Perfil de Monetización a Inicializar
              </label>
              <select
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-3 text-xs font-bold text-zinc-200 focus:outline-none focus:border-[#CBFF00] cursor-pointer"
              >
                <option value="Perfil Principal: Miguel A.">Perfil Principal: Miguel A. (8 Plataformas)</option>
                <option value="Canal Tech & AI Secundario">Canal Tech & IA (Sub-cuenta / YouTube)</option>
                <option value="Tienda E-Com & Afiliados">Tienda E-Commerce & Afiliados Global</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-zinc-400 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black border-zinc-700 text-[#CBFF00] focus:ring-0 cursor-pointer accent-[#CBFF00]"
                />
                <span>Recordar sesión en este equipo</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-500">PIN Demo: 2026</span>
            </div>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-[#CBFF00]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>{authStep || "AUTENTICANDO..."}</span>
                </>
              ) : (
                <>
                  <span>IDENTIFICARSE & INICIAR MONITOR</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Identification Profile Cards */}
          <div className="mt-6 pt-5 border-t border-zinc-900 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">
              O Selecciona Acceso Rápido con 1 Clic:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin({
                  name: "Miguel A.",
                  email: "miguel0db@gmail.com",
                  profile: "Perfil Principal: Miguel A.",
                  role: "Propietario KYC Verificado"
                })}
                disabled={isAuthenticating}
                className="text-left bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#CBFF00]/60 p-2.5 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white group-hover:text-[#CBFF00]">Miguel A.</span>
                  <span className="text-[9px] font-bold text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">KYC OK</span>
                </div>
                <p className="text-[10px] text-zinc-400">8 plataformas • Saldo: $1,428.94</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin({
                  name: "Operador de Medios",
                  email: "operador@monetipre.io",
                  profile: "Tienda E-Com & Afiliados",
                  role: "Operador de Tráfico"
                })}
                disabled={isAuthenticating}
                className="text-left bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#CBFF00]/60 p-2.5 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white group-hover:text-[#CBFF00]">Operador Medios</span>
                  <span className="text-[9px] font-bold text-blue-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-blue-500/30">E-COM</span>
                </div>
                <p className="text-[10px] text-zinc-400">Shopify + Binance Pay</p>
              </button>
            </div>
          </div>

          {/* Security details footnote */}
          <div className="mt-5 text-center">
            <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CBFF00]" />
              Liquidaciones 24/7 sin retenciones bancarias • Motor en vivo $0.01/s
            </p>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 text-center border-t border-zinc-900">
        <p className="text-xs text-zinc-500">
          MONETIPRE IA &copy; 2026 • Plataforma de Monetización Continua & Telemetría Financiera Multi-Canal
        </p>
      </footer>

    </div>
  );
};
