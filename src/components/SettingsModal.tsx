import React, { useState } from "react";
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Download, 
  Bot, 
  Sliders, 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  Lock,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { UserSettings, KYCData } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  kycData: KYCData;
  onOpenKYCModal: () => void;
  userEmail: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  kycData,
  onOpenKYCModal,
  userEmail
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"privacy" | "ai" | "kyc" | "id">("privacy");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  
  // Tax ID re-auth state (FE-4.4.2)
  const [taxIdInput, setTaxIdInput] = useState(settings.identity.taxId);
  const [taxNameInput, setTaxNameInput] = useState(settings.identity.legalEntityName);
  const [taxAuthModal, setTaxAuthModal] = useState(false);
  const [taxPasscode, setTaxPasscode] = useState("");
  const [taxSavedNotice, setTaxSavedNotice] = useState(false);

  // Key regeneration notification (FE-4.4.3)
  const [regenerateWarning, setRegenerateWarning] = useState(false);
  const [newKeyGenerated, setNewKeyGenerated] = useState(false);

  if (!isOpen) return null;

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // FE-4.1.2: Exportación de datos personales y contables
  const handleExportData = () => {
    setIsExporting(true);
    setExportNotice(null);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(`Solicitud de exportación contable generada con éxito. Se ha enviado un archivo seguro ZIP a ${userEmail || "tu correo registrado"} (FE-4.1.2).`);
      onUpdateSettings({
        ...settings,
        privacy: { ...settings.privacy, exportRequested: true }
      });
    }, 1200);
  };

  // FE-4.4.2: Guardar Identificación Fiscal con Re-autenticación
  const handleConfirmTaxUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxPasscode.trim()) return;

    onUpdateSettings({
      ...settings,
      identity: {
        ...settings.identity,
        taxId: taxIdInput,
        legalEntityName: taxNameInput
      }
    });

    setTaxAuthModal(false);
    setTaxPasscode("");
    setTaxSavedNotice(true);
    setTimeout(() => setTaxSavedNotice(false), 3000);
  };

  // FE-4.4.3: Regeneración de API Keys
  const handleRegenerateKeys = () => {
    const newPub = "pk_contuber_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const newSec = "sec_contuber_" + Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);

    onUpdateSettings({
      ...settings,
      identity: {
        ...settings.identity,
        apiKeyPublic: newPub,
        apiKeySecret: newSec,
        lastRegenerated: new Date().toLocaleDateString()
      }
    });

    setRegenerateWarning(false);
    setNewKeyGenerated(true);
    setTimeout(() => setNewKeyGenerated(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CBFF00] p-0.5 shadow-lg shadow-[#CBFF00]/20 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#CBFF00]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base uppercase tracking-tight">Configuración de Terminal</h3>
                <span className="text-[10px] font-black bg-zinc-800 text-[#CBFF00] px-2 py-0.5 rounded-full uppercase">
                  Módulo FE-4
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Privacidad, Asistente IA, Verificación KYC e Identidad Única</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
            <span className="text-xl font-bold">&times;</span>
          </button>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center border-b border-zinc-850 bg-zinc-900/60 p-2 gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("privacy")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === "privacy"
                ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>4.1 Privacidad</span>
          </button>

          <button
            onClick={() => setActiveSubTab("ai")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === "ai"
                ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>4.2 IA Predeterminada</span>
          </button>

          <button
            onClick={() => setActiveSubTab("kyc")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === "kyc"
                ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4.3 KYC & Onboarding</span>
          </button>

          <button
            onClick={() => setActiveSubTab("id")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeSubTab === "id"
                ? "bg-[#CBFF00] text-black shadow-md shadow-[#CBFF00]/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>4.4 ID Único & API</span>
          </button>
        </div>

        {/* Tab 4.1: Privacidad */}
        {activeSubTab === "privacy" && (
          <div className="p-6 space-y-5">
            {/* FE-4.1.1: Ocultar montos y balances en vivo */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-white uppercase">Modo Streamer / Ocultar Balances en Vivo</p>
                  <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.1.1</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Reemplaza los montos financieros por asteriscos (<code className="text-[#CBFF00]">****</code>) para transmisiones públicas en vivo en Twitch, YouTube o Kick.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({
                  ...settings,
                  privacy: { ...settings.privacy, hideLiveBalances: !settings.privacy.hideLiveBalances }
                })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.privacy.hideLiveBalances ? "bg-[#CBFF00]" : "bg-zinc-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.privacy.hideLiveBalances ? "left-6.5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* FE-4.1.3: Consentimiento de telemetría */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-white uppercase">Consentimiento de Telemetría & Analíticas</p>
                  <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.1.3</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Permite recolectar métricas anónimas de rendimiento sin exponer datos contables ni claves privadas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({
                  ...settings,
                  privacy: { ...settings.privacy, allowTelemetryAnalytics: !settings.privacy.allowTelemetryAnalytics }
                })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.privacy.allowTelemetryAnalytics ? "bg-[#CBFF00]" : "bg-zinc-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.privacy.allowTelemetryAnalytics ? "left-6.5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* FE-4.1.2: Exportación de datos personales y contables */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-white uppercase">Exportar Paquete Contable Completo</p>
                  <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.1.2</span>
                </div>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExportData}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Solicitar Archivo Seguro (ZIP)</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400">
                Genera un informe con todo el historial de streaming, ingresos por plataforma y facturas para declaraciones fiscales.
              </p>
              {exportNotice && (
                <div className="p-3 bg-[#CBFF00]/10 border border-[#CBFF00]/30 rounded-xl text-xs text-[#CBFF00]">
                  {exportNotice}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4.2: IA Predeterminada */}
        {activeSubTab === "ai" && (
          <div className="p-6 space-y-5">
            {/* FE-4.2.1: Selección de modelo de Asistente Financiero */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white uppercase">Modelo de Asistente Financiero por IA</label>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.2.1</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash", desc: "Máxima velocidad para streaming en directo" },
                  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "Balance en optimización de prompts" },
                  { id: "financial-advanced", label: "Proyección Avanzada", desc: "Auditoría exhaustiva de RPM y embudos" }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onUpdateSettings({
                      ...settings,
                      ai: { ...settings.ai, defaultModel: m.id as any }
                    })}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      settings.ai.defaultModel === m.id
                        ? "bg-[#CBFF00]/10 border-[#CBFF00] text-white"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <p className="text-xs font-black text-white">{m.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* FE-4.2.2: Ajuste de sensibilidad de alertas por IA */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-white uppercase">Sensibilidad de Alertas ante Caídas de RPM</p>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.2.2</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["baja", "media", "alta", "estricta"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onUpdateSettings({
                      ...settings,
                      ai: { ...settings.ai, alertSensitivity: lvl }
                    })}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      settings.ai.alertSensitivity === lvl
                        ? "bg-[#CBFF00] text-black"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400">
                Nivel actual: <span className="text-[#CBFF00] font-bold uppercase">{settings.ai.alertSensitivity}</span>. Notifica si la velocidad de ingreso cae más del 15% durante una transmisión.
              </p>
            </div>

            {/* FE-4.2.3: Auto-categorizado contable por IA */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-white uppercase">Auto-Categorizado Contable por IA</p>
                  <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.2.3</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Etiqueta automáticamente transacciones de streaming (Bits, SuperChats, Donaciones, Tienda) para deducciones fiscales.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({
                  ...settings,
                  ai: { ...settings.ai, autoCategorizeTransactions: !settings.ai.autoCategorizeTransactions }
                })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.ai.autoCategorizeTransactions ? "bg-[#CBFF00]" : "bg-zinc-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                  settings.ai.autoCategorizeTransactions ? "left-6.5" : "left-0.5"
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4.3: KYC & Onboarding Financiero */}
        {activeSubTab === "kyc" && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#CBFF00]/10 border border-[#CBFF00]/30 text-[#CBFF00] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">Estado KYC / Onboarding Financiero</p>
                    <p className="text-[11px] text-zinc-400">Requerido para liquidación de fondos por ley bancaria (FE-4.3)</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  kycData.isVerified 
                    ? "bg-[#CBFF00] text-black" 
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {kycData.isVerified ? "Cuenta Verificada (FE-4.3.3)" : "En Proceso (FE-4.3.1)"}
                </span>
              </div>

              <div className="text-xs text-zinc-300 space-y-1.5 pt-2 border-t border-zinc-800">
                <p><span className="text-zinc-500">Titular Fiscal:</span> <strong className="text-white">{kycData.fullName || "Demo Creator Verificado"}</strong></p>
                <p><span className="text-zinc-500">Documento:</span> {kycData.documentType} ({kycData.documentNumber})</p>
                <p><span className="text-zinc-500">Puntaje Biométrico Neural:</span> <strong className="text-[#CBFF00]">{kycData.biometricMatchScore || 98.4}% Match</strong></p>
                <p><span className="text-zinc-500">Certificado Hash:</span> <code className="text-[10px] text-zinc-400">{kycData.certificateId || "CERT-KYC-2026-X89"}</code></p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenKYCModal();
                }}
                className="w-full mt-2 py-3 rounded-xl bg-zinc-800 hover:bg-[#CBFF00] hover:text-black text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Abrir Modal de Verificación Biometría & Documentos (FE-4.3.1)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4.4: ID (Identificación y Terminal Única) */}
        {activeSubTab === "id" && (
          <div className="p-6 space-y-5">
            {/* FE-4.4.1: Gestión de ID Único de Terminal */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white uppercase">ID Único de Terminal Asignado</label>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.4.1</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={settings.identity.terminalId}
                  className="flex-1 bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-[#CBFF00] font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.identity.terminalId, "term_id")}
                  className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-[#CBFF00] hover:text-black text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedKey === "term_id" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === "term_id" ? "¡Copiado!" : "Copiar"}</span>
                </button>
              </div>
            </div>

            {/* FE-4.4.2: Actualización de datos fiscales */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white uppercase">Identificación Fiscal / Razón Social</label>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.4.2</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">ID Fiscal (RFC / CIF / NIF)</span>
                  <input
                    type="text"
                    value={taxIdInput}
                    onChange={(e) => setTaxIdInput(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Nombre Legal / Razón Social</span>
                  <input
                    type="text"
                    value={taxNameInput}
                    onChange={(e) => setTaxNameInput(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTaxAuthModal(true)}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-bold uppercase cursor-pointer"
              >
                Guardar Cambios con Re-Autenticación (FE-4.4.2)
              </button>

              {taxSavedNotice && (
                <div className="p-2.5 bg-[#CBFF00]/10 border border-[#CBFF00]/30 rounded-xl text-xs text-[#CBFF00] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Datos fiscales actualizados tras re-autenticación.
                </div>
              )}
            </div>

            {/* FE-4.4.3: Regeneración de API Keys */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-white uppercase">Claves API para Webhooks de Streaming</p>
                  <p className="text-[11px] text-zinc-400">Última regeneración: {settings.identity.lastRegenerated}</p>
                </div>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">FE-4.4.3</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Public Key</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.identity.apiKeyPublic}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.identity.apiKeyPublic, "pub_key")}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-[#CBFF00] hover:text-black text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Secret Key (Privada)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value={settings.identity.apiKeySecret}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.identity.apiKeySecret, "sec_key")}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-[#CBFF00] hover:text-black text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {regenerateWarning ? (
                <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl space-y-2 text-xs text-red-300">
                  <p className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> ¡Advertencia de Revocación Inmediata!
                  </p>
                  <p className="text-[11px] text-zinc-300">
                    Al generar un nuevo par de credenciales, las anteriores dejarán de funcionar de inmediato. Deberás actualizar tus bots de streaming.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleRegenerateKeys}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg uppercase text-[11px] cursor-pointer"
                    >
                      Confirmar y Regenerar (FE-4.4.3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegenerateWarning(false)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[11px] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRegenerateWarning(true)}
                  className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-bold uppercase flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerar Claves API (FE-4.4.3)</span>
                </button>
              )}

              {newKeyGenerated && (
                <div className="p-2.5 bg-[#CBFF00]/10 border border-[#CBFF00]/30 rounded-xl text-xs text-[#CBFF00]">
                  ¡Nuevas credenciales emitidas con éxito! Por seguridad cópialas ahora.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Re-Auth for Tax Modification (FE-4.4.2) */}
        {taxAuthModal && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 text-white">
                <Lock className="w-5 h-5 text-[#CBFF00]" />
                <h4 className="font-black text-sm uppercase">Re-Autenticación Requerida (FE-4.4.2)</h4>
              </div>
              <p className="text-xs text-zinc-400">
                Para modificar datos fiscales o de dispersión de fondos, ingresa tu contraseña o PIN (Demo: 2026):
              </p>
              <form onSubmit={handleConfirmTaxUpdate} className="space-y-3">
                <input
                  type="password"
                  required
                  value={taxPasscode}
                  onChange={(e) => setTaxPasscode(e.target.value)}
                  placeholder="PIN o contraseña de acceso"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#CBFF00]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxAuthModal(false)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#CBFF00] text-black font-black text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Verificar & Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
