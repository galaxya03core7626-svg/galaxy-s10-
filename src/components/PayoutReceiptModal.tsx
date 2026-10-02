import React from 'react';
import { PayoutRequest } from '../types';
import { X, CheckCircle2, ShieldCheck, Printer, ArrowDownToLine, Copy } from 'lucide-react';

interface PayoutReceiptModalProps {
  receipt: PayoutRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayoutReceiptModal: React.FC<PayoutReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Official Payout Disbursement Voucher
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Body (designed like a financial transaction receipt) */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-white">Disbursement Executed</h4>
            <p className="font-mono text-3xl font-black text-emerald-400 tabular-nums">
              ${receipt.netAmount.toFixed(2)} USD
            </p>
            <p className="text-xs text-slate-400">
              Successfully transmitted via {receipt.method.toUpperCase()} Payouts Gateway
            </p>
          </div>

          {/* Receipt Data Grid */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Gateway Reference ID:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200 font-semibold">
                <span>{receipt.gatewayReferenceId}</span>
                <button
                  onClick={() => copyToClipboard(receipt.gatewayReferenceId)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Copy reference ID"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Timestamp (UTC):</span>
              <span className="font-mono text-slate-300">{receipt.createdAt}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Recipient:</span>
              <span className="text-slate-200 font-medium truncate max-w-[220px]">
                {receipt.recipientDetails.email ||
                  receipt.recipientDetails.cryptoAddress ||
                  receipt.recipientDetails.bankAccount ||
                  receipt.recipientDetails.fullName}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Gross Withdrawal:</span>
              <span className="font-mono text-slate-300">${receipt.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Gateway Processing Fee:</span>
              <span className="font-mono text-rose-400">-${receipt.fee.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-800/80 pt-2 flex justify-between items-center text-slate-200 font-bold">
              <span>Net Settled Amount:</span>
              <span className="font-mono text-emerald-400 text-sm">${receipt.netAmount.toFixed(2)} USD</span>
            </div>

            <div className="border-t border-slate-800/80 pt-2 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                Cryptographic Ledger Hash
              </span>
              <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono text-[10px] text-slate-400">
                <span className="truncate max-w-[320px]">{receipt.transactionHash}</span>
                <button
                  onClick={() => copyToClipboard(receipt.transactionHash)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Copy transaction hash"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              This disbursement has been cleared by automated compliance algorithms and transmitted to the partner payout processor.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 rounded-xl text-xs transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              Close & Return to App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
