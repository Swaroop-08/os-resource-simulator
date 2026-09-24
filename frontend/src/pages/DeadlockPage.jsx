import React, { useState } from 'react';
import { checkDeadlock } from '../services/api';
import { Play, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export default function DeadlockPage() {
  const [processes, setProcesses] = useState(['P0', 'P1', 'P2', 'P3', 'P4']);
  const [resources, setResources] = useState(['A', 'B', 'C']);
  
  const [available, setAvailable] = useState([3, 3, 2]);
  
  const [maxMatrix, setMaxMatrix] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ]);

  const [allocationMatrix, setAllocationMatrix] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCellChange = (matrix, setMatrix, pIdx, rIdx, val) => {
    const updated = matrix.map((row) => [...row]);
    updated[pIdx][rIdx] = Math.max(0, Number(val));
    setMatrix(updated);
  };

  const handleRunBankers = async () => {
    setLoading(true);
    try {
      const data = await checkDeadlock({
        processes,
        resources,
        available,
        max_matrix: maxMatrix,
        allocation_matrix: allocationMatrix,
      });
      setResult(data);
    } catch (err) {
      alert('Error checking deadlock state: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-blue-400">Banker's Algorithm Matrix Setup</h2>
        </div>

        {/* Available Vector Input */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Available Resources Vector</h3>
          <div className="flex gap-4">
            {resources.map((res, idx) => (
              <div key={res} className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg">
                <span className="font-bold text-blue-400 text-sm">{res}:</span>
                <input
                  type="number"
                  min="0"
                  value={available[idx]}
                  onChange={(e) => {
                    const updated = [...available];
                    updated[idx] = Math.max(0, Number(e.target.value));
                    setAvailable(updated);
                  }}
                  className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Matrices Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Allocation Matrix */}
          <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Allocation Matrix</h3>
            <table className="w-full text-center text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 text-left">Process</th>
                  {resources.map((r) => (<th key={r} className="py-2">{r}</th>))}
                </tr>
              </thead>
              <tbody>
                {processes.map((p, pIdx) => (
                  <tr key={p} className="border-b border-slate-800/50">
                    <td className="py-2 font-bold text-blue-400 text-left">{p}</td>
                    {resources.map((_, rIdx) => (
                      <td key={rIdx} className="py-2">
                        <input
                          type="number"
                          min="0"
                          value={allocationMatrix[pIdx][rIdx]}
                          onChange={(e) => handleCellChange(allocationMatrix, setAllocationMatrix, pIdx, rIdx, e.target.value)}
                          className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Max Matrix */}
          <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Max Demand Matrix</h3>
            <table className="w-full text-center text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 text-left">Process</th>
                  {resources.map((r) => (<th key={r} className="py-2">{r}</th>))}
                </tr>
              </thead>
              <tbody>
                {processes.map((p, pIdx) => (
                  <tr key={p} className="border-b border-slate-800/50">
                    <td className="py-2 font-bold text-blue-400 text-left">{p}</td>
                    {resources.map((_, rIdx) => (
                      <td key={rIdx} className="py-2">
                        <input
                          type="number"
                          min="0"
                          value={maxMatrix[pIdx][rIdx]}
                          onChange={(e) => handleCellChange(maxMatrix, setMaxMatrix, pIdx, rIdx, e.target.value)}
                          className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center text-white"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={handleRunBankers}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20"
        >
          <Play className="w-4 h-4" /> {loading ? 'Analyzing...' : "Check System Safety"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Safety Status Banner */}
          <div className={`border p-6 rounded-2xl flex items-center gap-4 ${
            result.is_safe
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}>
            {result.is_safe ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-lg font-bold">
                {result.is_safe ? 'System is in a SAFE State' : 'System is in an UNSAFE State (Deadlock Risk)'}
              </h3>
              {result.is_safe && (
                <p className="text-sm mt-1">
                  Safe Execution Sequence:{' '}
                  <span className="font-mono font-bold tracking-wider underline">
                    {result.safe_sequence.join(' ➔ ')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Need Matrix Calculated */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Calculated Need Matrix (Max - Allocation)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="py-3 text-left px-4">Process</th>
                    {resources.map((r) => (<th key={r} className="py-3">{r}</th>))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {processes.map((p, pIdx) => (
                    <tr key={p} className="hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-left font-bold text-blue-400">{p}</td>
                      {resources.map((_, rIdx) => (
                        <td key={rIdx} className="py-3 font-semibold text-emerald-400">
                          {result.need_matrix[pIdx][rIdx]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step Log Stream */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-3">Execution Step Logs</h3>
            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1 max-h-60 overflow-y-auto border border-slate-800">
              {result.execution_steps.map((log, idx) => (
                <div key={idx} className="border-b border-slate-900/80 py-1">{`> ${log}`}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}