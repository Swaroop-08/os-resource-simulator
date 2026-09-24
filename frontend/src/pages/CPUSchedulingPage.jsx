import React, { useState } from 'react';
import axios from 'axios';
import { simulateCPU } from '../services/api';
import { Play, Plus, Trash2, Sparkles, CheckCircle2, Bot } from 'lucide-react';

export default function CPUSchedulingPage() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  
  const [processes, setProcesses] = useState([
    { pid: 'P1', arrival_time: 0, burst_time: 5, priority: 1 },
    { pid: 'P2', arrival_time: 1, burst_time: 3, priority: 2 },
    { pid: 'P3', arrival_time: 2, burst_time: 8, priority: 3 },
  ]);
  const [result, setResult] = useState(null);

  const handleAddProcess = () => {
    const nextNum = processes.length + 1;
    setProcesses([
      ...processes,
      { pid: `P${nextNum}`, arrival_time: 0, burst_time: 4, priority: 1 },
    ]);
  };

  const handleRemoveProcess = (index) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = field === 'pid' ? value : Number(value);
    setProcesses(updated);
  };

  const handleAIRecommend = async () => {
    setAiLoading(true);
    try {
      const response = await axios.post('/api/cpu/recommend', processes);
      const rec = response.data.recommended_algorithm;
      
      // Auto-select algorithm based on AI recommendation mapping
      if (rec.includes('First-Come')) setAlgorithm('FCFS');
      else if (rec.includes('Shortest Job First')) setAlgorithm('SJF');
      else if (rec.includes('Round Robin')) setAlgorithm('RR');
      else if (rec.includes('Priority')) setAlgorithm('PRIORITY');
      
      setAiRecommendation(response.data);
    } catch (err) {
      alert('Error fetching AI recommendation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const data = await simulateCPU({
        algorithm,
        time_quantum: algorithm === 'RR' ? timeQuantum : undefined,
        processes,
      });
      setResult(data);
    } catch (err) {
      alert('Error running simulation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-blue-400">CPU Scheduling Configuration</h2>
          
          {/* AI Recommendation Button */}
          <button
            onClick={handleAIRecommend}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-white font-medium text-sm shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            {aiLoading ? 'Analyzing...' : 'AI Auto-Select Algorithm'}
          </button>
        </div>

        {/* AI Insight Banner */}
        {aiRecommendation && (
          <div className="mb-6 p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl flex items-start gap-3">
            <Bot className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-purple-200">Recommended:</span>
                <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {aiRecommendation.recommended_algorithm}
                </span>
              </div>
              <p className="text-xs text-slate-300">{aiRecommendation.reasoning}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FCFS">First-Come, First-Served (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF - Non Preemptive)</option>
              <option value="SRTF">Shortest Remaining Time First (SRTF)</option>
              <option value="RR">Round Robin (RR)</option>
              <option value="PRIORITY">Priority Scheduling</option>
            </select>
          </div>

          {algorithm === 'RR' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time Quantum</label>
              <input
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Process Input Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Process ID</th>
                <th className="px-4 py-3">Arrival Time</th>
                <th className="px-4 py-3">Burst Time</th>
                {algorithm === 'PRIORITY' && <th className="px-4 py-3">Priority</th>}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {processes.map((p, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={p.pid}
                      onChange={(e) => handleChange(idx, 'pid', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-24"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={p.arrival_time}
                      onChange={(e) => handleChange(idx, 'arrival_time', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-24"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      value={p.burst_time}
                      onChange={(e) => handleChange(idx, 'burst_time', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-24"
                    />
                  </td>
                  {algorithm === 'PRIORITY' && (
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={p.priority}
                        onChange={(e) => handleChange(idx, 'priority', e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-24"
                      />
                    </td>
                  )}
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleRemoveProcess(idx)}
                      disabled={processes.length <= 1}
                      className="text-red-400 hover:text-red-300 disabled:opacity-30"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleAddProcess}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white font-medium"
          >
            <Plus className="w-4 h-4" /> Add Process
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20"
          >
            <Play className="w-4 h-4" /> {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Gantt Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Gantt Chart Timeline</h3>
            <div className="flex overflow-x-auto py-4 border-b border-slate-700">
              {result.gantt_chart.map((block, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[60px] flex-grow bg-blue-900/40 border border-blue-500/40 rounded-lg p-3 mx-1 text-center"
                >
                  <span className="text-sm font-bold text-blue-300">{block.pid}</span>
                  <span className="text-xs text-slate-400 mt-2">
                    {block.start_time} - {block.end_time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center">
              <span className="text-slate-400 text-sm">Avg. Waiting Time</span>
              <p className="text-3xl font-extrabold text-blue-400 mt-1">{result.average_waiting_time} ms</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center">
              <span className="text-slate-400 text-sm">Avg. Turnaround Time</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{result.average_turnaround_time} ms</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center">
              <span className="text-slate-400 text-sm">Avg. Response Time</span>
              <p className="text-3xl font-extrabold text-purple-400 mt-1">{result.average_response_time} ms</p>
            </div>
          </div>

          {/* Process Metrics Detailed Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Process Calculated Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">PID</th>
                    <th className="px-4 py-3">Arrival</th>
                    <th className="px-4 py-3">Burst</th>
                    <th className="px-4 py-3">Completion</th>
                    <th className="px-4 py-3">Turnaround (TAT)</th>
                    <th className="px-4 py-3">Waiting (WT)</th>
                    <th className="px-4 py-3">Response (RT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {result.process_results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-semibold text-blue-400">{r.pid}</td>
                      <td className="px-4 py-3">{r.arrival_time}</td>
                      <td className="px-4 py-3">{r.burst_time}</td>
                      <td className="px-4 py-3">{r.completion_time}</td>
                      <td className="px-4 py-3 font-medium text-emerald-400">{r.turnaround_time}</td>
                      <td className="px-4 py-3 font-medium text-blue-400">{r.waiting_time}</td>
                      <td className="px-4 py-3 font-medium text-purple-400">{r.response_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}