import React, { useState } from "react";
import { 
  X, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Coins, 
  DollarSign, 
  RefreshCw,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";
import { KYCData } from "../types";

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  kyc: KYCData;
  onConfirmPayout: (amount: number, method: string) => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  kyc,
  onConfirmPayout
}) => {
  const [method, setMethod] = useState<"paypal" | "binance" | "bank">("paypal");
  const [amount, setAmount] = useState<string>(Math.min(availableBalance, 250).toFixed(2));
  const [destination, setDestination] = useState(
    method === "paypal" ? "paypal@creadordigital.com" : (method === "binance" ? "TX9K83910482019481" : "ES48 0000 0000 0000 0000")
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rollbackError, setRollbackError] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<any>(null);

  if (!isOpen) return null;

  // DB-2.1 & DB-2.2: Transacciones ACID y Rollback en caso de fallo
  const handleWithdraw = async (simulateFailure: boolean = false) => {
    setIsProcessing(true);
    setRollbackError(null);

    try {
      const parsedAmount = parseFloat(amount) || 0;
      
      const res = await fetch("/api/transactions/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsedAmount,
          method,
          destination,
          simulateFailure
        })
      });

      const data = await res.json();

      if (!res.ok || data.status === "failed") {
        // Escenario DB-2.2: Rollback atómico automático
        setIsProcessing(false);
        setRollbackError(data.error || "Fallo simulado: Transacción revertida a su estado original (Rollback atómico)");
        return;
      }

      setIsProcessing(false);
      setTxDetails(data.transaction);
      setIsSuccess(true);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onConfirmPayout(parsedAmount, method);
    } catch (err: any) {
      setIsProcessing(false);
      setRollbackError("Error de comunicación de red. Estado mantenido sin cambios.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        
        <div className="bg-black p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-[#CBFF00] flex items-center justify-center border border-zinc-800">
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-sm uppercase tracking-tight">Retiro de Fondos Instantáneo</h3>
                <span className="text-[9px] font-mono text-[#CBFF00] bg-zinc-950 px-1.5 py-0.5 rounded border border-[#CBFF00]/30">DB-2</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Liquidación 24/7 y transacciones con consistencia ACID</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 space-y-4">
            
            {/* Balance Overview */}
            <div className="bg-black p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider">Saldo Disponible en Vivo</span>
                <p className="text-xl font-black text-[#CBFF00] font-mono">
                  ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
              </div>
              <span className="text-[11px] text-black bg-[#CBFF00] px-2.5 py-1 rounded-lg font-black uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> 0% COMISIÓN
              </span>
            </div>

            {/* Rollback Error Notice (DB-2.2) */}
            {rollbackError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl space-y-1 text-xs text-red-300 animate-in fade-in">
                <p className="font-bold flex items-center gap-1.5 text-red-400">
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  ROLLBACK EJECUTADO (Escenario DB-2.2)
                </p>
                <p className="text-[11px] text-zinc-300">{rollbackError}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Consistencia intacta: Saldo retenido revertido al usuario.</p>
              </div>
            )}

            {/* Method Selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Método de Liquidación</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setMethod("paypal"); setDestination("paypal@creadordigital.com"); }}
                  className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    method === "paypal" ? "bg-[#CBFF00] text-black border-[#CBFF00]" : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMethod("binance"); setDestination("TX9K83910482019481 (TRC20)"); }}
                  className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    method === "binance" ? "bg-[#CBFF00] text-black border-[#CBFF00]" : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Binance USDT</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMethod("bank"); setDestination("ES48 0000 0000 0000 0000"); }}
                  className={`p-3 rounded-xl border text-xs font-black uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    method === "bank" ? "bg-[#CBFF00] text-black border-[#CBFF00]" : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Banco Directo</span>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Monto a Retirar ($ USD)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  max={availableBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-zinc-100 focus:outline-none focus:border-[#CBFF00]"
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toFixed(2))}
                  className="absolute right-2.5 top-2 text-[10px] font-black text-black bg-[#CBFF00] px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  MÁX
                </button>
              </div>
            </div>

            {/* Destination Address */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">Destino / Cuenta</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#CBFF00]"
              />
            </div>

            {/* KYC Clearance badge */}
            <div className="bg-black p-3.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#CBFF00] shrink-0 stroke-[2.5]" />
              <span className="font-medium">Titular KYC verificado: <strong className="text-white font-bold">{kyc.fullName}</strong></span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-black uppercase text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleWithdraw(false)}
                  disabled={isProcessing || parseFloat(amount) <= 0}
                  className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>PROCESANDO ACID (DB-2.1)...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      <span>CONFIRMAR RETIRO (${amount})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Simulation button for DB-2.2 */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleWithdraw(true)}
                className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors cursor-pointer"
              >
                [Probar Escenario DB-2.2: Simular Error de Gateway & Verificar Rollback]
              </button>
            </div>

          </div>
        ) : (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border-2 border-[#CBFF00] flex items-center justify-center mx-auto text-[#CBFF00] shadow-xl shadow-[#CBFF00]/20">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-base font-black text-white uppercase tracking-tight">¡Retiro Ejecutado con Éxito! (DB-2.1)</h4>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                Se han transferido <strong className="text-[#CBFF00] font-bold">${amount} USD</strong> a {destination}.
              </p>
            </div>

            <div className="bg-black p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 text-left space-y-1">
              <p>ID Transacción: <span className="text-[#CBFF00]">{txDetails?.id || `TXN-${Date.now().toString(36).toUpperCase()}`}</span></p>
              <p>Estado: Consistencia Confirmada (Committed)</p>
              <p>Comisión cobrada: $0.00 USD (Beneficio KYC)</p>
            </div>

            <button
              onClick={() => { setIsSuccess(false); onClose(); }}
              className="w-full py-3 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 cursor-pointer"
            >
              LISTO & VOLVER
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
