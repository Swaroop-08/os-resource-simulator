import React from 'react';
import { Cpu, HardDrive, ShieldAlert, LayoutDashboard } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cpu', label: 'CPU Scheduling', icon: Cpu },
    { id: 'deadlock', label: "Banker's Algorithm", icon: ShieldAlert },
    { id: 'disk', label: 'Disk Scheduling', icon: HardDrive },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">OS Resource Simulator</h1>
          <p className="text-xs text-slate-400">Process, Deadlock & Disk Management Engine</p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}