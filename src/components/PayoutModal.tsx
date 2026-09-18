import React, { useState } from "react";
import { X, ArrowUpRight, CheckCircle2, ShieldCheck, CreditCard, Coins, DollarSign, RefreshCw } from "lucide-react";
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
    method === "paypal" ? "paypal@creadordigital.com" : (method === "binance" ? "TX9K83910482019481" : "ES48 2100 4819 2910 8841")
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onConfirmPayout(parseFloat(amount) || 0, method);
    }, 1200);
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
              <h3 className="font-black text-white text-sm uppercase tracking-tight">Retiro de Fondos Instantáneo</h3>
              <p className="text-[11px] text-zinc-400 font-medium">Liquidación 24/7 de ingresos de monetización</p>
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
                  onClick={() => { setMethod("bank"); setDestination("ES48 2100 4819 2910 8841"); }}
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

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-black uppercase text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isProcessing || parseFloat(amount) <= 0}
                className="px-5 py-2.5 rounded-xl bg-[#CBFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase shadow-xl shadow-[#CBFF00]/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>PROCESANDO...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    <span>CONFIRMAR RETIRO (${amount})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border-2 border-[#CBFF00] flex items-center justify-center mx-auto text-[#CBFF00] shadow-xl shadow-[#CBFF00]/20">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-base font-black text-white uppercase tracking-tight">¡Retiro Enviado con Éxito!</h4>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                Se han transferido <strong className="text-[#CBFF00] font-bold">${amount} USD</strong> a {destination}.
              </p>
            </div>

            <div className="bg-black p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 text-left space-y-1">
              <p>ID Transacción: TXN-{Date.now().toString(36).toUpperCase()}</p>
              <p>Estado: Procesado Inmediato</p>
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
