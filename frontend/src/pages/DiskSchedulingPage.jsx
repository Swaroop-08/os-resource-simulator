import React, { useState } from 'react';
import { simulateDisk } from '../services/api';
import { Play, HardDrive } from 'lucide-react';

export default function DiskSchedulingPage() {
  const [algorithm, setAlgorithm] = useState('SSTF');
  const [head, setHead] = useState(50);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState('right');
  const [requestsInput, setRequestsInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunDisk = async () => {
    const parsedRequests = requestsInput
      .split(',')
      .map((num) => Number(num.trim()))
      .filter((num) => !isNaN(num));

    if (parsedRequests.length === 0) {
      alert('Please enter a valid comma-separated list of numbers.');
      return;
    }

    setLoading(true);
    try {
      const data = await simulateDisk({
        algorithm,
        head,
        disk_size: diskSize,
        direction,
        requests: parsedRequests,
      });
      setResult(data);
    } catch (err) {
      alert('Error running disk simulation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <HardDrive className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-blue-400">Disk Scheduling Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FCFS">First-Come, First-Served (FCFS)</option>
              <option value="SSTF">Shortest Seek Time First (SSTF)</option>
              <option value="SCAN">SCAN (Elevator)</option>
              <option value="C-SCAN">Circular SCAN (C-SCAN)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Initial Head Position</label>
            <input
              type="number"
              min="0"
              value={head}
              onChange={(e) => setHead(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Total Tracks (Size)</label>
            <input
              type="number"
              min="10"
              value={diskSize}
              onChange={(e) => setDiskSize(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          {(algorithm === 'SCAN' || algorithm === 'C-SCAN') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Initial Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="right">Right / High (towards max track)</option>
                <option value="left">Left / Low (towards track 0)</option>
              </select>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Requested Tracks (Comma separated)</label>
          <input
            type="text"
            value={requestsInput}
            onChange={(e) => setRequestsInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
            placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
          />
        </div>

        <button
          onClick={handleRunDisk}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20"
        >
          <Play className="w-4 h-4" /> {loading ? 'Simulating...' : 'Run Disk Simulation'}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center shadow-xl">
            <span className="text-slate-400 text-sm">Total Disk Head Seek Time</span>
            <p className="text-4xl font-extrabold text-emerald-400 mt-2">{result.total_seek_time} Tracks</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Track Service Order Sequence</h3>
            <div className="flex flex-wrap gap-2">
              {result.sequence.map((track, idx) => (
                <div key={idx} className="flex items-center">
                  <span className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
                    idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-emerald-400'
                  }`}>
                    {idx === 0 ? `Head (${track})` : track}
                  </span>
                  {idx < result.sequence.length - 1 && (
                    <span className="text-slate-500 mx-1">➔</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}