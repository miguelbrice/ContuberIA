import React, { useState } from "react";
import { 
  X, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Globe2,
  Building2,
  Code2
} from "lucide-react";

interface InvestorFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorFAQModal: React.FC<InvestorFAQModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"faq" | "roadmap" | "subsystems" | "legal">("faq");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "¿Qué es Contuber IA y cuál es su Mínimo Producto Viable (MVP)?",
      a: "Contuber IA es una terminal centralizada diseñada en Brasil para creadores de contenido y streamers. Su MVP resuelve la fragmentación de ingresos unificando en una sola vista los balances en tiempo real de plataformas como YouTube, Twitch, Kick, TikTok, Shopify y Spotify, complementado con un motor de IA neural (Gemini) para generar prompts optimizados que multiplican el CTR y las ventas."
    },
    {
      q: "¿Por qué los fondos y balances actuales están denominados como 'USD Ficticios'?",
      a: "Contuber IA se encuentra actualmente en fase de Startup Prototipo Promocional. Todos los números, gráficos de velocidad de ingresos y saldos mostrados son simulaciones algorítmicas sin valor fiduciario real, diseñadas para que creadores, evaluadores e inversionistas experimenten la interfaz, los flujos ACID y las capacidades biométricas sin riesgo financiero."
    },
    {
      q: "¿Cuál es el modelo de negocio y el Punto de Equilibrio (Break-Even) proyectado?",
      a: "El modelo se basa en un esquema híbrido: (1) Un Take-Rate transaccional del 2.5% al 4.5% sobre el volumen de transferencias y dispersión de fondos a creadores (GMV); y (2) Una suscripción SaaS Pro ($19.90 USD/mes) para creadores con más de 3 canales activos y auditoría algorítmica de RPM. El punto de equilibrio se proyecta con 2,400 creadores activos que procesen en promedio $1,200 USD/mes cada uno ($2.88M USD GMV anual), cubriendo íntegramente los costos de servidores, APIs de IA y pasarelas de pago reguladas."
    },
    {
      q: "¿Cómo funcionará el retiro de dinero real en la fase de funcionalidad completa (2027 - 2030)?",
      a: "Una vez que la infraestructura bancaria y regulatoria esté desplegada (horizonte 2027 - 2030), los retiros reales operarán bajo estrictas políticas financieras: (1) Ventana de liquidación de 4 a 15 días hábiles; (2) Cortes quincenales de solicitud (días 1 y 15 de cada mes); (3) Obligatoriedad de especificar un concepto fiscal formal; y (4) Auditoría de 'Avaliación' previa para prevenir fraudes por tráfico no auténtico."
    },
    {
      q: "¿Qué es la 'Avaliación' y por qué las transacciones deben especificar un concepto?",
      a: "A diferencia de billeteras no reguladas, las normas internacionales contra el lavado de activos (AML/CFT) exigen que toda transacción de egreso especifique el origen lícito del ingreso (ej. 'Servicios de Publicidad en Video', 'Regalías por Streaming', 'Comisiones de Afiliación'). El proceso de avaliación valida que no existan disputas activas, devoluciones (chargebacks) o infracciones de derechos de autor con las plataformas vinculadas antes de liberar el dinero a cuentas bancarias."
    },
    {
      q: "¿Cómo se protege la privacidad de los datos bajo la LGPD (Brasil) y normas de ciberseguridad?",
      a: "Contuber IA implementa los principios de la Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018): consentimiento granular para el análisis de telemetría, almacenamiento disociado de datos biométricos, cifrado AES-256 en reposo, conexiones TLS 1.3 en tránsito y herramientas de exportación/revocación de datos. Además, la arquitectura sigue las directrices de ciberseguridad del Banco Central de Brasil (BACEN) para iniciadores de pago y pasarelas financieras."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#CBFF00]/40 text-[#CBFF00] flex items-center justify-center shadow-lg shadow-[#CBFF00]/10">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base tracking-tight uppercase">
                  CONTUBER <span className="text-[#CBFF00]">IA</span> — Dossier de Inversión & FAQ
                </h3>
                <span className="text-[10px] font-black bg-[#CBFF00] text-black px-2 py-0.5 rounded-full">
                  PROTOTIPO 🇧🇷
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Startup Prototipo Promocional • Made in Brazil • Despliegue Oficial 2027 - 2030
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-zinc-300 space-y-0.5">
            <p className="font-bold text-amber-300 uppercase tracking-wide">
              DECLARACIÓN LEGAL DE TÉRMINOS & SALDOS FICTICIOS
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Todos los montos, tasas de incremento por segundo y balances expresados en USD corresponden a 
              <strong> valores ficticios y simulados sin valor monetario real</strong>. Este software es una 
              <strong> Startup Prototipo en Fase Promocional</strong> para evaluar la tracción del producto y 
              presentar su viabilidad ante inversionistas. No contiene contactos ficticios de soporte especializado.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-zinc-950 px-5 border-b border-zinc-800 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`py-3 px-3 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "faq" 
                ? "border-[#CBFF00] text-[#CBFF00]" 
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ Inversionistas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("roadmap")}
            className={`py-3 px-3 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "roadmap" 
                ? "border-[#CBFF00] text-[#CBFF00]" 
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Escenarios 2027-2030</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subsystems")}
            className={`py-3 px-3 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "subsystems" 
                ? "border-[#CBFF00] text-[#CBFF00]" 
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Subsistemas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("legal")}
            className={`py-3 px-3 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "legal" 
                ? "border-[#CBFF00] text-[#CBFF00]" 
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LGPD & Enlaces Oficiales</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">

          {/* TAB 1: FAQ INTERACTIVO */}
          {activeTab === "faq" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Preguntas Frecuentes sobre el Prototipo y Viabilidad de Negocio
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">6 temas clave</span>
              </div>

              <div className="space-y-2">
                {faqs.map((item, idx) => (
                  <div 
                    key={idx}
                    className="border border-zinc-800 rounded-xl bg-black overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs font-bold text-white hover:text-[#CBFF00] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#CBFF00] font-mono text-[11px] font-black">0{idx + 1}.</span>
                        {item.q}
                      </span>
                      <span className="text-zinc-500 font-mono text-sm">
                        {openFaqIndex === idx ? "−" : "+"}
                      </span>
                    </button>

                    {openFaqIndex === idx && (
                      <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-zinc-900 bg-zinc-950/60 animate-in fade-in duration-150">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ESCENARIOS DE RETIRO 2027 - 2030 */}
          {activeTab === "roadmap" && (
            <div className="space-y-4 text-xs">
              <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#CBFF00]" />
                    Escenarios de Operación en Funcionalidad Completa (2027 - 2030)
                  </span>
                  <span className="text-[10px] font-mono text-[#CBFF00] bg-zinc-900 px-2 py-0.5 rounded border border-[#CBFF00]/30">
                    Roadmap Fintech
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  En la versión de producción conectada a entidades fiduciarias, las operaciones no serán inmediatas sino 
                  reguladas conforme al sistema bancario brasileño e internacional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Clock className="w-4 h-4 text-[#CBFF00]" />
                    <span>1. Plazo de Retiro (4 a 15 Días Hábiles)</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Las solicitudes de transferencia hacia cuentas bancarias o billeteras de custodia se procesan en un promedio 
                    de 4 a 15 días laborables para permitir la compensación real de los fondos desde AdSense, Twitch y TikTok.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar className="w-4 h-4 text-[#CBFF00]" />
                    <span>2. Cortes y Fechas Límite Quincenales</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Los cierres contables se ejecutan estrictamente los días 1 y 15 de cada mes. Las solicitudes enviadas fuera de 
                    este intervalo quedan programadas para el ciclo financiero inmediatamente posterior.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <FileText className="w-4 h-4 text-[#CBFF00]" />
                    <span>3. Concepto Obligatorio & Fiscalidad</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Cada retiro exige declarar el concepto comercial (prestación de servicios publicitarios, streaming, ventas 
                    de afiliados) para emisión automatizada de comprobantes fiscales y retención impositiva.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#CBFF00]" />
                    <span>4. Proceso de 'Avaliación' Antifraude</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Toda transacción entra en un período de evaluación para auditar la legitimidad del tráfico web, previniendo 
                    inyecciones de bots, contracargos fraudulentos o suplantación de identidad del creador.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSISTEMAS DE LA PLATAFORMA */}
          {activeTab === "subsystems" && (
            <div className="space-y-3 text-xs">
              <div className="border border-zinc-800 rounded-xl p-4 bg-black space-y-1.5">
                <span className="text-[10px] font-mono text-[#CBFF00] uppercase font-bold">Subsistema 01</span>
                <h5 className="font-black text-white text-sm">Sub-sistema de Telemetría Streaming & Conectores OAuth 2.0 PKCE</h5>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Consume en vivo métricas de estado (ONLINE/OFFLINE), concurrencia de espectadores y RPM estimado de canales en 
                  YouTube, Twitch, Kick, TikTok y Spotify, calculando la velocidad de ingreso ($/seg y $/min).
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-black space-y-1.5">
                <span className="text-[10px] font-mono text-[#CBFF00] uppercase font-bold">Subsistema 02</span>
                <h5 className="font-black text-white text-sm">Sub-sistema de Inteligencia Neural Generativa (Google Gemini Flash)</h5>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Asiste a los creadores redactando copys virales, ganchos de alta retención, guiones de Shorts y estimando el 
                  consumo de tokens por prompt para maximizar el ROI de producción de contenido.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-black space-y-1.5">
                <span className="text-[10px] font-mono text-[#CBFF00] uppercase font-bold">Subsistema 03</span>
                <h5 className="font-black text-white text-sm">Sub-sistema de Liquidación ACID con Rollback Atómico</h5>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Gestiona las órdenes de egreso de fondos mediante transacciones atómicas. Si la pasarela bancaria o el nodo 
                  externo rechaza la operación, el saldo retenido se revierte inmediatamente al creador sin discrepancias contables.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-black space-y-1.5">
                <span className="text-[10px] font-mono text-[#CBFF00] uppercase font-bold">Subsistema 04</span>
                <h5 className="font-black text-white text-sm">Sub-sistema Biométrico KYC & Prueba de Vida Neural</h5>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Realiza detección de movimiento facial, sonrisa y parpadeo frente a la cámara antes de habilitar límites 
                  altos de desembolso, garantizando la titularidad de los canales y la cuenta fiscal.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: LGPD & ENLACES OFICIALES */}
          {activeTab === "legal" && (
            <div className="space-y-4 text-xs">
              <div className="bg-black p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Lock className="w-4 h-4 text-[#CBFF00]" />
                  <span>Protección de Datos Personales — LGPD (Brasil - Lei nº 13.709/2018)</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  La arquitectura de Contuber IA se alinea rigurosamente a las exigencias de la <strong>LGPD</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px]">
                  <li><strong>Finalidad y Necesidad:</strong> Solo se recopilan credenciales de tokens OAuth requeridas para lectura de métricas de canal.</li>
                  <li><strong>Seguridad de Datos:</strong> Cifrado en reposo AES-256 y en tránsito TLS 1.3 con almacenamiento desacoplado de patrones biométricos.</li>
                  <li><strong>Derechos del Titular:</strong> Capacidad de exportación contable integral en ZIP y revocación inmediata de consentimientos en la pestaña de Privacidad.</li>
                  <li><strong>Ciberseguridad Gubernamental:</strong> Directrices operativas de resiliencia y segregación de roles (RBAC) basadas en estándares del BACEN.</li>
                </ul>
              </div>

              {/* Verified Legal Entities & Repositories */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 block">
                  Identidad Oficial, Desarrollo & Representación Legal:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a 
                    href="https://www.instagram.com/f.e.m.m.n.a" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-black border border-zinc-800 hover:border-[#CBFF00] rounded-xl text-left block group transition-all"
                  >
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[10px] font-mono uppercase">Representación Legal</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#CBFF00]" />
                    </div>
                    <strong className="text-white text-xs block group-hover:text-[#CBFF00]">@f.e.m.m.n.a</strong>
                    <span className="text-[10px] text-zinc-500">Instagram Oficial</span>
                  </a>

                  <a 
                    href="https://web-adversity.vercel.app" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-black border border-zinc-800 hover:border-[#CBFF00] rounded-xl text-left block group transition-all"
                  >
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[10px] font-mono uppercase">Desarrollador</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#CBFF00]" />
                    </div>
                    <strong className="text-white text-xs block group-hover:text-[#CBFF00]">Adsversity</strong>
                    <span className="text-[10px] text-zinc-500">web-adversity.vercel.app</span>
                  </a>

                  <a 
                    href="https://github.com/miguelbrice/ContuberIA" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-black border border-zinc-800 hover:border-[#CBFF00] rounded-xl text-left block group transition-all"
                  >
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[10px] font-mono uppercase">Repositorio Público</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#CBFF00]" />
                    </div>
                    <strong className="text-white text-xs block group-hover:text-[#CBFF00]">miguelbrice / ContuberIA</strong>
                    <span className="text-[10px] text-zinc-500">Código fuente auditado</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-black p-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-[11px]">
            <Globe2 className="w-4 h-4 text-[#CBFF00]" />
            <span>Contuber IA • Made in Brazil 🇧🇷 • Startup Prototipo (2027 - 2030)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase cursor-pointer"
          >
            Cerrar Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
