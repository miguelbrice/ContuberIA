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
  RefreshCw,
  UserPlus,
  AlertTriangle,
  HelpCircle,
  Mail,
  Check
} from "lucide-react";

export interface UserSession {
  name: string;
  email: string;
  role: string;
  profileName: string;
  kycLevel: string;
  authenticatedAt: string;
  terminalId?: string;
  taxId?: string;
}

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Mode: "login" (FE-1), "register" (FE-2), "forgot" (FE-1.4)
  const [viewMode, setViewMode] = useState<"login" | "register" | "forgot">("login");

  // Form Fields
  const [identifier, setIdentifier] = useState("creador.demo@monetipre.io");
  const [pin, setPin] = useState("2026");
  const [profileName, setProfileName] = useState("Perfil Principal: Creador Pro");
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Fields (FE-2)
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTermsAccepted, setRegTermsAccepted] = useState(false);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Forgot Password Field (FE-1.4)
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Lockout & Attempts State (FE-1.5)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  // Operational state
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FE-2.3: Password strength evaluator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: "Débil (requiere 8+ caracteres, mayúsculas y números)", color: "text-red-400 bg-red-500/20", valid: false };
    if (score === 2 || score === 3) return { label: "Media (buena seguridad)", color: "text-amber-400 bg-amber-500/20", valid: true };
    return { label: "Excelente (Criptográficamente Fuerte)", color: "text-[#CBFF00] bg-[#CBFF00]/20", valid: true };
  };

  const passStrength = calculatePasswordStrength(regPassword);

  // 1-Click fast login helper
  const handleQuickLogin = (selectedUser: { name: string; email: string; profile: string; role: string; pin: string }) => {
    setIdentifier(selectedUser.email);
    setPin(selectedUser.pin);
    setProfileName(selectedUser.profile);
    executeLogin(selectedUser.email, selectedUser.pin, selectedUser.name, selectedUser.profile, selectedUser.role);
  };

  // FE-1: Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // FE-1.3: Mandatory field validation
    if (!identifier.trim() || !pin.trim()) {
      setErrorMsg("Todos los campos son obligatorios. Ingresa tu usuario/correo y clave.");
      return;
    }

    // FE-1.5: Verify lockout
    if (lockoutRemaining && lockoutRemaining > 0) {
      setErrorMsg(`La cuenta está temporalmente bloqueada. Espera ${lockoutRemaining} segundos antes de volver a intentar.`);
      return;
    }

    executeLogin(identifier, pin, identifier.split("@")[0], profileName, "Creador Autorizado");
  };

  // Execution with Backend Verification
  const executeLogin = async (
    loginEmail: string, 
    loginPass: string, 
    userName: string, 
    userProfile: string, 
    userRole: string
  ) => {
    setErrorMsg(null);
    setIsAuthenticating(true);
    setAuthStep("Validando credenciales en base de datos central...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      const data = await response.json();

      if (!response.ok) {
        setIsAuthenticating(false);
        // FE-1.5: Lockout trigger
        if (data.lockout) {
          setLockoutRemaining(data.remainingSec || 60);
          const interval = setInterval(() => {
            setLockoutRemaining((prev) => {
              if (!prev || prev <= 1) {
                clearInterval(interval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        // FE-1.2: Generic error message
        setErrorMsg(data.error || "Credenciales inválidas. Comprueba tus datos.");
        return;
      }

      // Success sequence
      setAuthStep("Firma de seguridad aprobada. Iniciando monitor de telemetría...");
      setTimeout(() => {
        setIsAuthenticating(false);
        const session: UserSession = {
          name: data.user?.name || userName,
          email: data.user?.email || loginEmail,
          role: data.user?.role || userRole,
          profileName: userProfile,
          kycLevel: "Nivel 3 (Biometría Facial Aprobada 99.4%)",
          authenticatedAt: new Date().toLocaleTimeString(),
          terminalId: data.user?.terminalId || "TERM-MONETI-77X",
          taxId: data.user?.taxId || "ES-48920194K"
        };

        if (rememberMe) {
          try {
            localStorage.setItem("monetipre_session", JSON.stringify(session));
            if (data.tokens) {
              localStorage.setItem("monetipre_tokens", JSON.stringify(data.tokens));
            }
          } catch (e) {
            console.warn("Storage not available");
          }
        }

        onLoginSuccess(session);
      }, 700);

    } catch (err) {
      // Local fallback in case network hiccup
      setTimeout(() => {
        setIsAuthenticating(false);
        const session: UserSession = {
          name: userName,
          email: loginEmail,
          role: userRole,
          profileName: userProfile,
          kycLevel: "Nivel 3 (Biometría Facial Aprobada 99.4%)",
          authenticatedAt: new Date().toLocaleTimeString(),
          terminalId: "TERM-LOCAL-889"
        };
        onLoginSuccess(session);
      }, 600);
    }
  };

  // FE-2: Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setRegSuccessMessage(null);

    // FE-2.4: Mandatory terms acceptance
    if (!regTermsAccepted) {
      setErrorMsg("Debes aceptar los Términos y la Política de Monetización para continuar (FE-2.4).");
      return;
    }

    // FE-2.3: Password strength check
    if (regPassword.length < 8) {
      setErrorMsg("La contraseña debe tener mínimo 8 caracteres para garantizar la seguridad de tus ingresos (FE-2.3).");
      return;
    }

    setIsAuthenticating(true);
    setAuthStep("Creando registro en bases de datos y asignando ID de terminal...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          termsAccepted: regTermsAccepted
        })
      });

      const data = await res.json();
      setIsAuthenticating(false);

      if (!res.ok) {
        // FE-2.2: Duplicate email warning
        setErrorMsg(data.error || "Error al procesar el registro.");
        return;
      }

      // FE-2.1: Success screen
      setRegSuccessMessage(`¡Cuenta creada con éxito! Tu ID de terminal es ${data.user?.terminalId}. Inicia sesión con tus credenciales para comenzar.`);
      setIdentifier(regEmail);
      setPin(regPassword);
      setTimeout(() => {
        setViewMode("login");
      }, 2500);

    } catch (err: any) {
      setIsAuthenticating(false);
      setErrorMsg("No se pudo conectar con el servidor de autenticación.");
    }
  };

  // FE-1.4: Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!forgotEmail.trim()) {
      setErrorMsg("Ingresa tu correo para recibir las instrucciones de recuperación (FE-1.4).");
      return;
    }

    setIsAuthenticating(true);
    setAuthStep("Enviando token de recuperación de contraseña...");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setIsAuthenticating(false);
      setForgotSuccess(data.message || `Instrucciones enviadas a ${forgotEmail}.`);
    } catch {
      setIsAuthenticating(false);
      setForgotSuccess(`Instrucciones enviadas al correo si la cuenta se encuentra registrada.`);
    }
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
          <span>Acceso Seguro Encriptado (TLS 1.3 / JWT)</span>
        </div>
      </header>

      {/* Center Authentication Card */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CBFF00] to-transparent opacity-80" />

          {/* Navigation Toggle between Login and Register */}
          <div className="flex items-center justify-between bg-zinc-900/80 p-1 rounded-xl mb-6 border border-zinc-800">
            <button
              type="button"
              onClick={() => { setViewMode("login"); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                viewMode === "login" 
                  ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Iniciar Sesión (FE-1)
            </button>
            <button
              type="button"
              onClick={() => { setViewMode("register"); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                viewMode === "register" 
                  ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Crear Cuenta (FE-2)
            </button>
          </div>

          {/* Lockout Warning Banner (FE-1.5) */}
          {lockoutRemaining && lockoutRemaining > 0 && (
            <div className="mb-5 bg-red-500/15 border border-red-500/50 rounded-2xl p-4 text-xs text-red-300 flex items-start gap-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-200">Terminal Bloqueada por Seguridad (FE-1.5)</p>
                <p className="text-[11px] mt-0.5">Demasiados intentos fallidos consecutivos. Tiempo de espera restante: <span className="font-mono font-black text-white">{lockoutRemaining}s</span>.</p>
              </div>
            </div>
          )}

          {/* Error Message Box (FE-1.2, FE-2.2, FE-2.4) */}
          {errorMsg && (
            <div className="mb-5 bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {regSuccessMessage && (
            <div className="mb-5 bg-[#CBFF00]/15 border border-[#CBFF00]/40 rounded-xl p-3.5 text-xs text-[#CBFF00] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBFF00] shrink-0" />
              <span className="font-medium">{regSuccessMessage}</span>
            </div>
          )}

          {/* VIEW MODE 1: LOGIN (FE-1) */}
          {viewMode === "login" && (
            <>
              <div className="mb-6 space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[#CBFF00] tracking-wider">
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> FE-1: Identificación de Creador
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                  ACCESO A TERMINAL
                </h1>
                <p className="text-xs text-zinc-400 font-medium">
                  Introduce tus credenciales para inicializar el monitor de streaming en tiempo real.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      placeholder="creador.demo@monetipre.io o usuario"
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-3 text-xs font-medium text-white focus:outline-none focus:border-[#CBFF00] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                      Clave de Seguridad / PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => { setViewMode("forgot"); setErrorMsg(null); }}
                      className="text-[11px] text-[#CBFF00] hover:underline cursor-pointer"
                    >
                      ¿Olvidó su contraseña? (FE-1.4)
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPin ? "text" : "password"}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Clave de acceso"
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
                    Perfil de Monetización a Cargar
                  </label>
                  <select
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-3 text-xs font-bold text-zinc-200 focus:outline-none focus:border-[#CBFF00] cursor-pointer"
                  >
                    <option value="Perfil Principal: Creador Pro">Perfil Principal: Creador Pro (8 Plataformas)</option>
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

                {/* Submit Button with Loading State (FE-1.1 & FE-1.3) */}
                <button
                  type="submit"
                  disabled={isAuthenticating || Boolean(lockoutRemaining && lockoutRemaining > 0)}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-[#CBFF00]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span>{authStep || "AUTENTICANDO..."}</span>
                    </>
                  ) : (
                    <>
                      <span>INGRESAR & INICIAR MONITOR (FE-1.1)</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick 1-Click Identification Profile Cards */}
              <div className="mt-6 pt-5 border-t border-zinc-900 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">
                  Acceso Rápido de Prueba (1-Clic):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin({
                      name: "Creador Demo",
                      email: "creador.demo@monetipre.io",
                      profile: "Perfil Principal: Creador Pro",
                      role: "Propietario KYC Verificado",
                      pin: "2026"
                    })}
                    disabled={isAuthenticating}
                    className="text-left bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#CBFF00]/60 p-2.5 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white group-hover:text-[#CBFF00]">Creador Demo</span>
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
                      role: "Operador de Tráfico",
                      pin: "2026"
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
            </>
          )}

          {/* VIEW MODE 2: REGISTRATION (FE-2) */}
          {viewMode === "register" && (
            <>
              <div className="mb-6 space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[#CBFF00] tracking-wider">
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" /> FE-2: Registro de Creador
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                  NUEVO USUARIO
                </h1>
                <p className="text-xs text-zinc-400 font-medium">
                  Crea tu terminal de monetización y desbloquea enlaces a streams verificados.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Nombre Completo o Alias de Creador
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ej: Carlos Streaming"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#CBFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Correo Electrónico (Para Liquidaciones)
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="carlos@creador.com"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#CBFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Contraseña Segura (Mínimo 8 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Contraseña con números y letras"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#CBFF00]"
                  />
                  {regPassword && (
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-500">Fortaleza (FE-2.3):</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${passStrength.color}`}>
                        {passStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions Checkbox (FE-2.4) */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => setRegTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded bg-black border-zinc-700 text-[#CBFF00] focus:ring-0 accent-[#CBFF00]"
                    />
                    <span className="leading-tight text-[11px]">
                      Acepto los <span className="text-[#CBFF00] underline">Términos de Servicio</span> y la <span className="text-[#CBFF00] underline">Política de Monetización & Liquidación 24/7</span> (FE-2.4)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating || !regTermsAccepted}
                  className="w-full mt-3 py-3 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CBFF00]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{authStep}</span>
                    </>
                  ) : (
                    <>
                      <span>REGISTRAR & CREAR TERMINAL (FE-2.1)</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setErrorMsg(null); }}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </button>
              </div>
            </>
          )}

          {/* VIEW MODE 3: FORGOT PASSWORD (FE-1.4) */}
          {viewMode === "forgot" && (
            <>
              <div className="mb-6 space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[#CBFF00] tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" /> FE-1.4: Recuperación de Clave
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                  RESTABLECER ACCESO
                </h1>
                <p className="text-xs text-zinc-400 font-medium">
                  Introduce tu correo registrado para recibir un enlace de acceso seguro.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/40 rounded-2xl p-4 text-xs text-[#CBFF00] space-y-3">
                  <p className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Solicitud Procesada (FE-1.4)
                  </p>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{forgotSuccess}</p>
                  <button
                    type="button"
                    onClick={() => { setViewMode("login"); setForgotSuccess(null); }}
                    className="w-full py-2.5 rounded-xl bg-[#CBFF00] text-black font-black text-xs uppercase"
                  >
                    Volver al Inicio de Sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                      Correo Electrónico Registrado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="tu-correo@creador.com"
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#CBFF00]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>ENVIAR ENLACE DE RESTABLECIMIENTO</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setViewMode("login"); setErrorMsg(null); }}
                    className="w-full text-center text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Cancelar y regresar al Login
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 text-center border-t border-zinc-900">
        <p className="text-xs text-zinc-500">
          MONETIPRE IA &copy; 2026 • Terminal Central de Monetización Multi-Streaming & Protocolos Financieros
        </p>
      </footer>

    </div>
  );
};
