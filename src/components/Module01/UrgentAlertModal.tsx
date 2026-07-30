import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, UserCheck, Key, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const UrgentAlertModal: React.FC = () => {
  const { urgentAlertTicket, dismissUrgentAlert, updateTicketStatus } = useApp();

  if (!urgentAlertTicket) return null;

  const handleAcknowledge = () => {
    updateTicketStatus(urgentAlertTicket.id, 'IN_PROGRESS', 'Kỹ thuật viên đã tiếp nhận xử lý khẩn cấp.');
    dismissUrgentAlert();
  };

  return (
    <div className="fixed inset-0 z-50 animate-alert-pulse text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-950/95 border-4 border-rose-500 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 backdrop-blur-md relative">
        
        {/* Pulsing Warning Badge */}
        <div className="flex items-center justify-center space-x-3 text-rose-500 mb-4">
          <AlertOctagon className="w-12 h-12 sm:w-16 sm:h-16 animate-bounce" />
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase block">
              CẢNH BÁO SỰ CỐ GẤP 🔴
            </span>
            <span className="text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-widest">
              ƯU TIÊN XỬ LÝ KHẨN CẤP BỘ PHẬN KỸ THUẬT (ENG)
            </span>
          </div>
        </div>

        {/* Room Info Block */}
        <div className="bg-rose-950/60 border-2 border-rose-500/80 rounded-2xl p-5 mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-300">PHÒNG CẦN HỖ TRỢ LẬP TỨC:</p>
          <h2 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight my-1">
            PHÒNG {urgentAlertTicket.roomNumber}
          </h2>
          <p className="text-base sm:text-lg font-bold text-white mt-2">
            {urgentAlertTicket.issueType}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 italic">
            "{urgentAlertTicket.description}"
          </p>
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-xs font-bold text-center">
          <div className={`p-3 rounded-xl border ${
            urgentAlertTicket.isUrgent ? 'bg-rose-900/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-700'
          }`}>
            <AlertOctagon className="w-5 h-5 mx-auto mb-1 text-rose-400" />
            <span>🔴 PHIẾU GẤP</span>
          </div>

          <div className={`p-3 rounded-xl border ${
            urgentAlertTicket.isGuestInRoom ? 'bg-sky-900/60 border-sky-500 text-sky-200' : 'bg-slate-900 border-slate-700'
          }`}>
            <UserCheck className="w-5 h-5 mx-auto mb-1 text-sky-400" />
            <span>{urgentAlertTicket.isGuestInRoom ? '👤 CÓ KHÁCH' : '👤 Không khách'}</span>
          </div>

          <div className={`p-3 rounded-xl border ${
            urgentAlertTicket.isDoorUnlocked ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-700'
          }`}>
            <Key className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <span>{urgentAlertTicket.isDoorUnlocked ? '🔑 ĐÃ MỞ CỬA' : '🔑 Chưa mở cửa'}</span>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="flex items-center justify-between text-xs text-slate-300 mb-6 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400">Người báo hỏng: </span>
            <span className="font-bold text-white">{urgentAlertTicket.reporterName}</span>
          </div>
          <div>
            <span className="text-slate-400">Thời gian: </span>
            <span className="font-mono text-amber-300">{new Date(urgentAlertTicket.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={dismissUrgentAlert}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm border border-slate-700 transition-all"
          >
            Tắt Cảnh Báo
          </button>
          <button
            onClick={handleAcknowledge}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl transition-all"
          >
            <span>TIẾP NHẬN XỬ LÝ NGAY</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
