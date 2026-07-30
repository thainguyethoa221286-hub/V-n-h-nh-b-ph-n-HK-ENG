import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  CalendarCheck, 
  FileSpreadsheet, 
  ShieldCheck, 
  UserCheck, 
  LogOut,
  AlertTriangle,
  Wrench
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, currentUser, logout, tickets } = useApp();

  const urgentCount = tickets.filter(t => t.isUrgent && t.status !== 'FIXED').length;
  const newCount = tickets.filter(t => t.status === 'NEW').length;

  const modules = [
    {
      id: 'MODULE_01' as const,
      num: '01',
      title: 'Sơ đồ 55 Phòng & Báo hỏng',
      subtitle: 'Trạng thái Realtime & Tiếp nhận tin',
      icon: Layers,
      badge: urgentCount > 0 ? `${urgentCount} GẤP` : (newCount > 0 ? `${newCount} Mới` : null),
      badgeColor: urgentCount > 0 ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white',
    },
    {
      id: 'MODULE_02' as const,
      num: '02',
      title: 'Bảo trì Định kỳ (Matrix)',
      subtitle: 'Ma trận 55 phòng & Duyệt Y/N/D',
      icon: CalendarCheck,
      badge: '55 Phòng',
      badgeColor: 'bg-slate-700 text-amber-300',
    },
    {
      id: 'MODULE_03' as const,
      num: '03',
      title: 'Báo cáo & In ấn A4',
      subtitle: 'Bộ lọc thời gian & Form in chuẩn',
      icon: FileSpreadsheet,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'MODULE_04' as const,
      num: '04',
      title: 'Cài đặt & Phân quyền',
      subtitle: 'Quản lý User, 5 Roles & Khóa Quyền',
      icon: ShieldCheck,
      badge: currentUser?.role === 'ADMIN' ? 'Admin' : 'Khóa',
      badgeColor: currentUser?.role === 'ADMIN' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400',
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-30 px-2 py-2 flex justify-around items-center text-slate-300">
        {modules.map((m) => {
          if (m.adminOnly && currentUser?.role !== 'ADMIN') return null;
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-center transition-all relative ${
                isActive ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight">{m.title.split('&')[0]}</span>
              {m.badge && (
                <span className={`absolute -top-1 -right-1 text-[9px] font-bold px-1 rounded-full ${m.badgeColor}`}>
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Left Navigation Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-700/60 p-4 shrink-0 shadow-sm">
        
        {/* Department / Shift Quick Status Header */}
        {currentUser && (
          <div className="mb-5 p-3 bg-slate-900/60 rounded-xl border border-slate-700/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                {currentUser.department === 'Housekeeping' ? (
                  <UserCheck className="w-5 h-5" />
                ) : currentUser.department === 'Engineering' ? (
                  <Wrench className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-blue-400 font-semibold">{currentUser.roleTitle}</p>
                <p className="text-[10px] text-slate-400">Ca: {currentUser.shift}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-2 px-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Các Module Quản Lý
          </p>
        </div>

        {/* Module Menu Item List */}
        <nav className="space-y-1.5 flex-1">
          {modules.map((m) => {
            if (m.adminOnly && currentUser?.role !== 'ADMIN') return null;
            const Icon = m.icon;
            const isActive = activeModule === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 group relative border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-sm'
                    : 'bg-slate-900/40 text-slate-300 hover:bg-slate-700/60 hover:text-white border-slate-700/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700/60 text-blue-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">
                      {m.num}. {m.title}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {m.subtitle}
                  </p>
                </div>
                {m.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full self-center ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Hotel Quick Info & Logout */}
        <div className="pt-4 border-t border-slate-700/80 space-y-2">
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
            <p className="font-bold text-slate-200">Khách sạn 55 Phòng</p>
            <p className="text-slate-400">11 phòng/tầng (Tầng 1 - 5)</p>
            <p className="text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Realtime Server: Active
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-700/60 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 p-2.5 rounded-xl text-xs font-bold transition-all border border-slate-600/80"
          >
            <LogOut className="w-4 h-4" />
            <span>Đổi Ca / Đăng Xuất</span>
          </button>
        </div>

      </aside>
    </>
  );
};
