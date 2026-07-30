import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bell, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown, 
  LogOut, 
  Lock, 
  Unlock, 
  Zap,
  Calendar,
  Layers,
  FileText,
  Settings
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchActiveUser, 
    logout, 
    tickets, 
    activeModule, 
    setActiveModule,
    triggerMockUrgentAlert 
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const urgentCount = tickets.filter(t => t.isUrgent && t.status !== 'FIXED').length;
  const pendingCount = tickets.filter(t => t.status === 'NEW' || t.status === 'IN_PROGRESS').length;

  return (
    <header className="bg-white text-slate-800 shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand / Hotel Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 uppercase">
                GRAND HOTEL
                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded border border-slate-200">
                  55 PHÒNG - PREMIUM
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Quản lý Vận hành & Bảo trì (HK - ENG)
              </p>
            </div>
          </div>

          {/* Center: Module Navigation Pills (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveModule('MODULE_01')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'MODULE_01'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sơ đồ 55 Phòng</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveModule('MODULE_02')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'MODULE_02'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bảo Trì Định Kỳ</span>
            </button>

            <button
              onClick={() => setActiveModule('MODULE_03')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'MODULE_03'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Báo Cáo In A4</span>
            </button>

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveModule('MODULE_04')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeModule === 'MODULE_04'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Cài Đặt & Quyền</span>
              </button>
            )}
          </div>

          {/* Right: Quick Test Trigger & User Profile Selector */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Urgent Alert Simulator Button */}
            <button
              onClick={triggerMockUrgentAlert}
              title="Mô phỏng phát tin 🔴 GẤP Realtime"
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all animate-pulse shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Test GẤP 🔴</span>
            </button>

            {/* Urgent Notification Counter Badge */}
            {urgentCount > 0 && (
              <div 
                onClick={() => setActiveModule('MODULE_01')}
                className="cursor-pointer flex items-center space-x-1 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-bounce shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{urgentCount} GẤP</span>
              </div>
            )}

            {/* Current Employee Profile / Switcher Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center space-x-2.5 bg-slate-100 hover:bg-slate-200/80 p-1.5 pr-3 rounded-xl border border-slate-200 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div className="hidden sm:block leading-tight">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-blue-600 font-semibold">
                      {currentUser.roleTitle}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {/* Dropdown Menu for Role Switching & Account Management */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100 text-slate-800">
                    <div className="px-3 py-2 bg-slate-50">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Đang vào ca:
                      </p>
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-blue-600 font-semibold">{currentUser.roleTitle}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Ca: {currentUser.shift}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                        Đổi nhanh vai trò (Demo):
                      </p>
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchActiveUser(u.id);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 ${
                            currentUser.id === u.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                            <span>{u.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{u.role.split('_')[0]}</span>
                        </button>
                      ))}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất / Kết thúc ca</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveModule('LOGIN')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs"
              >
                Đăng nhập
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
