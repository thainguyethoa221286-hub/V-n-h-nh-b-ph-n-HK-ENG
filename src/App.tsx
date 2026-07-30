import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { RoomMap } from './components/Module01/RoomMap';
import { MaintenanceMatrix } from './components/Module02/MaintenanceMatrix';
import { ReportsAndPrint } from './components/Module03/ReportsAndPrint';
import { SettingsPermissions } from './components/Module04/SettingsPermissions';
import { UrgentAlertModal } from './components/Module01/UrgentAlertModal';

const DashboardContent: React.FC = () => {
  const { currentUser, activeModule } = useApp();

  // If logged out or on LOGIN screen, show Login Modal
  if (!currentUser || activeModule === 'LOGIN') {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Fixed Header Bar */}
      <Header />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Right Active Module View */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0 overflow-y-auto">
          {activeModule === 'MODULE_01' && <RoomMap />}
          {activeModule === 'MODULE_02' && <MaintenanceMatrix />}
          {activeModule === 'MODULE_03' && <ReportsAndPrint />}
          {activeModule === 'MODULE_04' && <SettingsPermissions />}
        </main>

      </div>

      {/* Global Full-Screen Urgent Alert Modal (🔴 GẤP) */}
      <UrgentAlertModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
