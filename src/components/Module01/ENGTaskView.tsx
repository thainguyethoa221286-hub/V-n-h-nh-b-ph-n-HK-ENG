import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  IssueTicket, 
  TicketStatus 
} from '../../types';
import { 
  Wrench, 
  CheckCircle2, 
  Hourglass, 
  XCircle, 
  AlertOctagon, 
  UserCheck, 
  Key, 
  Clock, 
  Search, 
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';

export const ENGTaskView: React.FC = () => {
  const { tickets, updateTicketStatus, currentUser } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals for parts / unfixable reason inputs
  const [activeDialog, setActiveDialog] = useState<{
    type: 'PARTS' | 'UNFIXABLE' | null;
    ticketId: string;
    inputText: string;
  }>({ type: null, ticketId: '', inputText: '' });

  // Priority sorting: URGENT (🔴 GẤP) tickets strictly pinned on top!
  const sortedTickets = [...tickets].sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredTickets = sortedTickets.filter(t => {
    const matchesSearch = t.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'URGENT') return matchesSearch && t.isUrgent;
    if (filterStatus === 'PENDING') return matchesSearch && (t.status === 'NEW' || t.status === 'IN_PROGRESS');
    if (filterStatus === 'WAITING_PARTS') return matchesSearch && t.status === 'WAITING_PARTS';
    if (filterStatus === 'FIXED') return matchesSearch && t.status === 'FIXED';
    return matchesSearch;
  });

  const handleQuickStatusChange = (ticketId: string, status: TicketStatus) => {
    if (status === 'FIXED') {
      updateTicketStatus(ticketId, 'FIXED', 'Đã hoàn thành sửa chữa & kiểm tra an toàn.');
    } else if (status === 'WAITING_PARTS') {
      setActiveDialog({ type: 'PARTS', ticketId, inputText: '' });
    } else if (status === 'UNFIXABLE') {
      setActiveDialog({ type: 'UNFIXABLE', ticketId, inputText: '' });
    }
  };

  const handleDialogSubmit = () => {
    if (activeDialog.type === 'PARTS') {
      updateTicketStatus(
        activeDialog.ticketId, 
        'WAITING_PARTS', 
        'Đã gửi yêu cầu đề xuất vật tư bổ sung.', 
        undefined, 
        activeDialog.inputText || 'Cần đặt hàng linh kiện thay thế'
      );
    } else if (activeDialog.type === 'UNFIXABLE') {
      updateTicketStatus(
        activeDialog.ticketId, 
        'UNFIXABLE', 
        'Chuyển hồ sơ giám sát/đối tác bên ngoài.', 
        activeDialog.inputText || 'Hỏng nặng không có linh kiện dự phòng'
      );
    }
    setActiveDialog({ type: null, ticketId: '', inputText: '' });
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls & Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              DANH SÁCH CÔNG VIỆC KỸ THUẬT (ENG)
              <span className="text-[10px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full">
                {tickets.filter(t => t.isUrgent && t.status !== 'FIXED').length} Phiếu GẤP
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Sắp xếp ưu tiên: Phiếu 🔴 GẤP luôn ghim lên đầu danh sách
            </p>
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm số phòng, tên lỗi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
          >
            <option value="ALL">Tất cả phiếu ({tickets.length})</option>
            <option value="URGENT">🔴 Chỉ phiếu GẤP</option>
            <option value="PENDING">⚡ Đang chờ / Đang xử lý</option>
            <option value="WAITING_PARTS">⌛ Chờ vật tư</option>
            <option value="FIXED">☑ Đã sửa hoàn thành</option>
          </select>
        </div>

      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.length === 0 ? (
          <div className="col-span-full bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-bold text-white">Không có phiếu báo hỏng nào phù hợp!</p>
            <p className="text-xs mt-1">Toàn bộ 55 phòng đang trong trạng thái vận hành tốt.</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isFixed = t.status === 'FIXED';
            const isWaiting = t.status === 'WAITING_PARTS';
            const isUnfixable = t.status === 'UNFIXABLE';

            return (
              <div
                key={t.id}
                className={`bg-slate-900 rounded-2xl border transition-all p-4 relative flex flex-col justify-between shadow-lg ${
                  t.isUrgent && !isFixed
                    ? 'border-2 border-rose-500 shadow-rose-900/30'
                    : isFixed
                    ? 'border-emerald-500/40 bg-slate-900/80'
                    : isWaiting
                    ? 'border-amber-500/50'
                    : 'border-slate-800'
                }`}
              >
                {/* Urgent Header Tag */}
                {t.isUrgent && !isFixed && (
                  <div className="mb-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 animate-spin" />
                      🔴 PHIẾU GẤP - ƯU TIÊN SỐ 1
                    </span>
                    <span className="font-mono">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}

                <div>
                  {/* Top Card Bar: Room & Ticket ID */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-black text-amber-400 tracking-tight">
                        P.{t.roomNumber}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-700">
                        {t.location}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isFixed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isWaiting
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : isUnfixable
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {isFixed ? 'Đã sửa ☑' : isWaiting ? 'Chờ vật tư ⌛' : isUnfixable ? 'Không sửa được ❌' : 'Mới tiếp nhận'}
                    </span>
                  </div>

                  {/* Issue Details */}
                  <p className="text-sm font-bold text-white mb-1">{t.issueType}</p>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                    "{t.description}"
                  </p>

                  {/* 3 Checkboxes Status Indicators */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      t.isUrgent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <AlertOctagon className="w-3 h-3" />
                      {t.isUrgent ? 'Gấp 🔴' : 'Thường'}
                    </span>

                    <span className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      t.isGuestInRoom ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <UserCheck className="w-3 h-3" />
                      {t.isGuestInRoom ? 'Có khách 👤' : 'Phòng trống'}
                    </span>

                    <span className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      t.isDoorUnlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Key className="w-3 h-3" />
                      {t.isDoorUnlocked ? 'Đã mở cửa 🔑' : 'Chưa mở cửa'}
                    </span>
                  </div>

                  {/* Reporter info */}
                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-4 border-t border-slate-800 pt-2">
                    <span>Báo bởi: <strong className="text-slate-200">{t.reporterName}</strong></span>
                    <span className="font-mono text-slate-400">{t.id}</span>
                  </div>

                  {/* Extra Notes / Parts display if applicable */}
                  {t.partsRequested && (
                    <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                      <strong>⌛ Vật tư chờ:</strong> {t.partsRequested}
                    </div>
                  )}

                  {t.unfixableReason && (
                    <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                      <strong>❌ Lý do không sửa được:</strong> {t.unfixableReason}
                    </div>
                  )}
                </div>

                {/* REQUIREMENT: 3 ACTION BUTTONS FOR ENG */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5">
                  
                  {/* Button 1: [Đã sửa] */}
                  <button
                    onClick={() => handleQuickStatusChange(t.id, 'FIXED')}
                    disabled={isFixed}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      isFixed
                        ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="truncate">Đã Sửa</span>
                  </button>

                  {/* Button 2: [Chờ vật tư ⌛] */}
                  <button
                    onClick={() => handleQuickStatusChange(t.id, 'WAITING_PARTS')}
                    disabled={isFixed}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      isWaiting
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    }`}
                  >
                    <Hourglass className="w-3.5 h-3.5" />
                    <span className="truncate">Chờ Vật Tư ⌛</span>
                  </button>

                  {/* Button 3: [Không sửa được ❌] */}
                  <button
                    onClick={() => handleQuickStatusChange(t.id, 'UNFIXABLE')}
                    disabled={isFixed}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      isUnfixable
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span className="truncate">Không Sửa ❌</span>
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Input Modal for Parts or Unfixable Reason */}
      {activeDialog.type && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {activeDialog.type === 'PARTS' ? (
                <>
                  <Hourglass className="w-5 h-5 text-amber-400" />
                  <span>XÁC NHẬN CHỜ VẬT TƯ (BỔ SUNG)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>XÁC NHẬN KHÔNG SỬA ĐƯỢC (CHUYỂN SUP)</span>
                </>
              )}
            </h4>

            <p className="text-xs text-slate-300">
              {activeDialog.type === 'PARTS'
                ? 'Nhập tên thiết bị / vật tư kỹ thuật cần mua hoặc xuất kho:'
                : 'Nhập nguyên nhân không thể khắc phục tại chỗ:'}
            </p>

            <textarea
              rows={3}
              value={activeDialog.inputText}
              onChange={(e) => setActiveDialog(prev => ({ ...prev, inputText: e.target.value }))}
              placeholder={
                activeDialog.type === 'PARTS'
                  ? 'Ví dụ: Cần 1 van xả Toto 38mm, 2 mét ống đồng F10...'
                  : 'Ví dụ: Hỏng bo mạch chính điều hòa inverter, cần gọi đại lý Daikin bảo hành...'
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveDialog({ type: null, ticketId: '', inputText: '' })}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleDialogSubmit}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
              >
                Xác Nhận Đổi Trạng Thái
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
