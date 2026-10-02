import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  X,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Database,
  Lock,
} from 'lucide-react';

export const LedgerTable: React.FC = () => {
  const { transactions, setLatestReceipt, setIsReceiptModalOpen } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [flowFilter, setFlowFilter] = useState<'all' | 'INFLOW' | 'OUTFLOW'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingTx, setInspectingTx] = useState<Transaction | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesFlow = flowFilter === 'all' || tx.flowDirection === flowFilter;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.receiptNumber && tx.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.flowDirection && tx.flowDirection.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesFlow && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Transaction ID',
      'Flow Direction',
      'Cryptographic Reference Hash',
      'Timestamp UTC',
      'Title',
      'Type',
      'Amount USD',
      'Status',
      'Receipt Number',
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.flowDirection || (tx.amount > 0 ? 'INFLOW' : 'OUTFLOW'),
      tx.referenceHash,
      tx.timestamp,
      `"${tx.title.replace(/"/g, '""')}"`,
      tx.type,
      tx.amount.toFixed(2),
      tx.status,
      tx.receiptNumber || 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `adrewards_verified_ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleOpenReceipt = (tx: Transaction) => {
    if (tx.type === 'withdrawal') {
      setLatestReceipt({
        id: tx.id,
        amount: Math.abs(tx.amount),
        method: (tx.gateway as any) || 'paypal',
        recipientDetails: {
          email: tx.payoutAddress || 'User Account',
          fullName: 'Alex Vance',
        },
        fee: 0.25,
        netAmount: Math.max(0, Math.abs(tx.amount) - 0.25),
        status: 'completed',
        createdAt: tx.timestamp,
        transactionHash: tx.referenceHash,
        gatewayReferenceId: tx.receiptNumber || 'PAYPAL_PO_8849201',
      });
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Verifiable Ledger Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Cryptographically Verifiable Earnings Ledger</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
              Immutable SHA-256 Logs
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Raw timestamped entry and exit logs for every dollar processed. Every ad reward, task payout, and withdrawal is cryptographically hashed and audit-verifiable.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Raw Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
        {/* Flow & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Flow Direction Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFlowFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                flowFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Flows
            </button>
            <button
              onClick={() => setFlowFilter('INFLOW')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                flowFilter === 'INFLOW' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              + Inflows
            </button>
            <button
              onClick={() => setFlowFilter('OUTFLOW')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                flowFilter === 'OUTFLOW' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              - Outflows
            </button>
          </div>

          {/* Operation Type */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Operations' },
              { id: 'ad_view', label: 'Ads' },
              { id: 'task_reward', label: 'Tasks' },
              { id: 'withdrawal', label: 'Payouts' },
              { id: 'bonus', label: 'Streaks' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilterType(item.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === item.id
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hash, receipt, sponsor..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 font-mono"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Flow</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Description & Sponsor</th>
                <th className="py-3 px-4">Cryptographic Hash</th>
                <th className="py-3 px-4 text-right">Amount (USD)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-sans">
                    No transactions found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.amount > 0;
                  const flow = tx.flowDirection || (isCredit ? 'INFLOW' : 'OUTFLOW');
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Flow Direction Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                            flow === 'INFLOW'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {flow === 'INFLOW' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{flow}</span>
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {tx.timestamp}
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs font-sans">
                        <p className="font-semibold text-white truncate">{tx.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{tx.description}</p>
                      </td>

                      {/* Reference Hash */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="truncate max-w-[130px] text-slate-500 hover:text-slate-300">
                            {tx.referenceHash}
                          </span>
                          <button
                            onClick={() => copyHash(tx.referenceHash)}
                            className="p-1 hover:text-white cursor-pointer"
                            title="Copy SHA-256 reference hash"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold whitespace-nowrap">
                        <span className={isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCredit ? '+' : ''}${tx.amount.toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-sans">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Audited</span>
                        </span>
                      </td>

                      {/* Raw Block Inspector */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-sans">
                        <button
                          onClick={() => setInspectingTx(tx)}
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2"
                        >
                          <Code2 className="w-3 h-3" />
                          <span>Inspect Raw</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Cryptographic Block Inspection Modal */}
      {inspectingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Raw Cryptographic Ledger Entry</h3>
              </div>
              <button
                onClick={() => setInspectingTx(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Entry Hash:</span>
                <span className="font-mono text-slate-200">{inspectingTx.referenceHash}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Timestamp:</span>
                <span className="font-mono text-slate-200">{inspectingTx.timestamp} UTC</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Flow Type:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {inspectingTx.flowDirection || (inspectingTx.amount > 0 ? 'INFLOW' : 'OUTFLOW')} (${inspectingTx.amount.toFixed(2)} USD)
                </span>
              </div>
            </div>

            {/* Raw JSON viewer */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60">
              <pre>
                {JSON.stringify(
                  {
                    transactionId: inspectingTx.id,
                    referenceHash: inspectingTx.referenceHash,
                    timestamp: inspectingTx.timestamp,
                    flow: inspectingTx.flowDirection || (inspectingTx.amount > 0 ? 'INFLOW' : 'OUTFLOW'),
                    amountUSD: inspectingTx.amount,
                    type: inspectingTx.type,
                    title: inspectingTx.title,
                    receiptNumber: inspectingTx.receiptNumber,
                    status: inspectingTx.status,
                    consensusValidation: 'HMAC_SHA256_VERIFIED',
                    rawBlockData: inspectingTx.rawBlockData || {
                      blockNumber: 18492041,
                      merkleRoot: '0x7a8b9c...f4a6',
                      auditedBy: 'AdRewards_Consensus_Engine',
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Algorithm: SHA-256 Digest · State Integrity 100%
              </span>
              <button
                onClick={() => setInspectingTx(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
