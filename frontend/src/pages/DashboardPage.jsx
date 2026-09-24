import React from 'react';
import { Cpu, ShieldAlert, HardDrive, Activity, Play, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const systemMetrics = [
    { title: 'CPU Workload', value: '5 Processes', status: 'Optimal', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: "Banker's Safety State", value: 'Safe Sequence', status: 'Protected', icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Disk Head Position', value: 'Track 53', status: 'Idle', icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'System Status', value: '0 Deadlocks', status: 'Healthy', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const modules = [
    {
      id: 'cpu',
      title: 'CPU Scheduling',
      desc: 'Simulate FCFS, SJF, Round Robin, and Priority algorithms with Gantt timeline visualizations.',
      icon: Cpu,
      badge: 'Gantt Chart & Metrics',
      btnText: 'Launch Scheduler',
    },
    {
      id: 'deadlock',
      title: "Banker's Algorithm",
      desc: "Analyze Allocation, Max, and Available resource matrices to detect unsafe states.",
      icon: ShieldAlert,
      badge: 'Deadlock Avoidance',
      btnText: 'Check Safety State',
    },
    {
      id: 'disk',
      title: 'Disk & I/O Management',
      desc: 'Visualize disk head movement across tracks using FCFS, SSTF, SCAN, and C-SCAN.',
      icon: HardDrive,
      badge: 'Seek Time Visualizer',
      btnText: 'Simulate Disk Head',
    },
  ];

  const processStates = [
    { pid: 'P1', state: 'Running', algorithm: 'Round Robin', time: '5 ms', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { pid: 'P2', state: 'Ready', algorithm: 'Round Robin', time: '3 ms', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { pid: 'P3', state: 'Waiting', algorithm: 'I/O Request', time: '8 ms', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { pid: 'P4', state: 'Terminated', algorithm: 'FCFS', time: '4 ms', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="text-blue-400 w-7 h-7" /> OS Resource Management Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time process lifecycle monitor, deadlock avoidance engine, and disk head simulator.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" /> System Online & Ready
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{m.title}</span>
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
              <span className="text-xs text-slate-400">{m.status}</span>
            </div>
          );
        })}
      </div>

      {/* Module Shortcuts */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-4">Simulation Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-700/50 rounded-xl group-hover:bg-blue-600/20 transition-colors">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-semibold bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-600">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{mod.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{mod.desc}</p>
                </div>
                <button
                  onClick={() => setActiveTab(mod.id)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  <Play className="w-4 h-4 fill-current" /> {mod.btnText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Lifecycle State Visualizer */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Process State Tracking Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3 rounded-l-lg">Process ID</th>
                <th className="p-3">Current State</th>
                <th className="p-3">Assigned Algorithm</th>
                <th className="p-3 rounded-r-lg">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {processStates.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30">
                  <td className="p-3 font-semibold text-white">{p.pid}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${p.color}`}>
                      {p.state}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{p.algorithm}</td>
                  <td className="p-3 font-mono text-slate-300">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}