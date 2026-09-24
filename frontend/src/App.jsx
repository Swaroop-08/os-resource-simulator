import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import CPUSchedulingPage from './pages/CPUSchedulingPage';
import DeadlockPage from './pages/DeadlockPage';
import DiskSchedulingPage from './pages/DiskSchedulingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
        {activeTab === 'cpu' && <CPUSchedulingPage />}
        {activeTab === 'deadlock' && <DeadlockPage />}
        {activeTab === 'disk' && <DiskSchedulingPage />}
      </main>
    </div>
  );
}