import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room, RoomStatus } from '../../types';
import { ReportBugModal } from './ReportBugModal';
import { ENGTaskView } from './ENGTaskView';
import { 
  Building2, 
  Layers, 
  Wrench, 
  Hourglass, 
  AlertOctagon, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export const RoomMap: React.FC = () => {
  const { rooms, tickets, updateRoomStatus, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'MAP' | 'ENG_VIEW'>('MAP');
  const [floorFilter, setFloorFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchRoom, setSearchRoom] = useState<string>('');

  // Modals
  const [selectedRoomForBug, setSelectedRoomForBug] = useState<string | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);

  // Statistics
  const totalRooms = rooms.length; // 55
  const occCount = rooms.filter(r => r.status === 'OCC').length;
  const arrCount = rooms.filter(r => r.status === 'ARR').length;
  const doCount = rooms.filter(r => r.status === 'DO').length;
  const vacCount = rooms.filter(r => r.status === 'VAC').length;
  const issueCount = rooms.filter(r => r.hasIssue).length;
  const waitingPartsCount = rooms.filter(r => r.waitingMaterials).length;

  // Filter logic
  const filteredRooms = rooms.filter(r => {
    const matchesFloor = floorFilter === 'ALL' || r.floor === Number(floorFilter);
    const matchesSearch = r.number.toLowerCase().includes(searchRoom.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'OCC') matchesStatus = r.status === 'OCC';
    else if (statusFilter === 'ARR') matchesStatus = r.status === 'ARR';
    else if (statusFilter === 'DO') matchesStatus = r.status === 'DO';
    else if (statusFilter === 'VAC') matchesStatus = r.status === 'VAC';
    else if (statusFilter === 'ISSUE') matchesStatus = r.hasIssue;
    else if (statusFilter === 'WAITING') matchesStatus = r.waitingMaterials;

    return matchesFloor && matchesSearch && matchesStatus;
  });

  // Group filtered rooms by Floor
  const floors = [1, 2, 3, 4, 5];

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'OCC':
        return {
          label: 'OCC (Có khách)',
          className: 'bg-red-100 text-red-800 border-red-200 font-bold',
        };
      case 'ARR':
        return {
          label: 'ARR (Khách sắp đến)',
          className: 'bg-blue-100 text-blue-800 border-blue-200 font-bold',
        };
      case 'DO':
        return {
          label: 'DO (Phòng bẩn/trả)',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 font-bold',
        };
      case 'VAC':
        return {
          label: 'VAC (Trống sạch)',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
        };
      default:
        return {
          label: status,
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Top Bar: View Switcher Tabs & Quick Bug Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Tab View Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('MAP')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MAP'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>SƠ ĐỒ 55 PHÒNG (HK)</span>
          </button>

          <button
            onClick={() => setActiveTab('ENG_VIEW')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'ENG_VIEW'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>TIẾP NHẬN BÁO HỎNG (ENG)</span>
            {issueCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded-full font-bold">
                {issueCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Button: Báo hỏng ngay */}
        <button
          onClick={() => setSelectedRoomForBug('101')}
          className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all border border-rose-500/50"
        >
          <Plus className="w-4 h-4" />
          <span>+ BÁO PHIẾU HỎNG HÓC MỚI</span>
        </button>

      </div>

      {/* Main Tab 1: Sơ đồ 55 phòng Grid */}
      {activeTab === 'MAP' ? (
        <div className="space-y-4">
          
          {/* KPI Stat Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'ALL' ? 'bg-blue-50/80 border-blue-400 text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-slate-500">TỔNG PHÒNG</p>
              <p className="text-xl font-black text-slate-900">{totalRooms} phòng</p>
            </button>

            <button
              onClick={() => setStatusFilter('OCC')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'OCC' ? 'bg-red-100 border-red-400' : 'bg-red-50/60 border-red-200 hover:border-red-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-red-800">OCC (Có khách)</p>
              <p className="text-xl font-black text-red-900">{occCount}</p>
            </button>

            <button
              onClick={() => setStatusFilter('ARR')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'ARR' ? 'bg-blue-100 border-blue-400' : 'bg-blue-50/60 border-blue-200 hover:border-blue-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-blue-800">ARR (Sắp đến)</p>
              <p className="text-xl font-black text-blue-900">{arrCount}</p>
            </button>

            <button
              onClick={() => setStatusFilter('DO')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'DO' ? 'bg-yellow-100 border-yellow-400' : 'bg-yellow-50/60 border-yellow-200 hover:border-yellow-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-yellow-800">DO (Bẩn/Trả)</p>
              <p className="text-xl font-black text-yellow-900">{doCount}</p>
            </button>

            <button
              onClick={() => setStatusFilter('VAC')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'VAC' ? 'bg-emerald-100 border-emerald-400' : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-emerald-800">VAC (Trống sạch)</p>
              <p className="text-xl font-black text-emerald-900">{vacCount}</p>
            </button>

            <button
              onClick={() => setStatusFilter('ISSUE')}
              className={`p-3 rounded-xl border text-left transition-all shadow-xs ${
                statusFilter === 'ISSUE' ? 'bg-rose-100 border-rose-400' : 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1">
                <span>SỰ CỐ</span>
                <Wrench className="w-3 h-3" />
              </p>
              <p className="text-xl font-black text-rose-900">{issueCount} 🛠️</p>
            </button>

          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Floor selector */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">Lọc Tầng:</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFloorFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    floorFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả
                </button>
                {[1, 2, 3, 4, 5].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFloorFilter(String(f))}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      floorFilter === String(f) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tầng {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Nhập số phòng (vd: 204)..."
                value={searchRoom}
                onChange={(e) => setSearchRoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-8 pr-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* 55 Rooms Display Grid grouped by floor */}
          <div className="space-y-5">
            {floors.map((floorNum) => {
              if (floorFilter !== 'ALL' && floorFilter !== String(floorNum)) return null;

              const roomsOnFloor = filteredRooms.filter(r => r.floor === floorNum);
              if (roomsOnFloor.length === 0) return null;

              return (
                <div key={floorNum} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      TẦNG {floorNum} (11 PHÒNG)
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">
                      Hiển thị {roomsOnFloor.length} / 11 phòng
                    </span>
                  </div>

                  {/* Room Cards Grid (11 rooms responsive) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2.5">
                    {roomsOnFloor.map((room) => {
                      const badge = getStatusBadge(room.status);
                      const relatedTicket = tickets.find(t => t.roomNumber === room.number && t.status !== 'FIXED');

                      return (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomDetails(room)}
                          className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 shadow-xs hover:shadow-md hover:scale-102 ${
                            room.hasIssue
                              ? 'border-2 border-rose-400 bg-rose-50/80 hover:bg-rose-100'
                              : room.waitingMaterials
                              ? 'border-2 border-amber-400 bg-amber-50/80 hover:bg-amber-100'
                              : 'bg-white border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          {/* Top Card Info: Room Number & Type */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900 group-hover:text-blue-600">
                              {room.number}
                            </span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1 rounded font-semibold">
                              {room.type}
                            </span>
                          </div>

                          {/* Center Icons / Warnings */}
                          <div className="my-1 flex items-center justify-center space-x-1">
                            {room.hasIssue && (
                              <span
                                title="Đang có báo hỏng!"
                                className="text-rose-700 font-bold text-xs bg-rose-200/80 p-1 rounded-md border border-rose-300 animate-pulse flex items-center gap-0.5"
                              >
                                🛠️ Hỏng
                              </span>
                            )}
                            {room.waitingMaterials && (
                              <span
                                title="Đang chờ vật tư ⌛"
                                className="text-amber-800 font-bold text-xs bg-amber-200/80 p-1 rounded-md border border-amber-300 flex items-center gap-0.5"
                              >
                                ⌛ Chờ
                              </span>
                            )}
                          </div>

                          {/* Bottom Status Badge */}
                          <div className="text-center">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border block truncate ${badge.className}`}>
                              {badge.label.split(' ')[0]}
                            </span>
                          </div>

                          {/* Quick Add Issue Hover Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoomForBug(room.number);
                            }}
                            title="Báo hỏng phòng này"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md transition-all shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Tab 2: ENG Task Receiver View */
        <ENGTaskView />
      )}

      {/* Room Details & Quick Status Update Modal */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xl text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">THÔNG TIN CHI TIẾT</span>
                <h3 className="text-xl font-black text-slate-900">PHÒNG {selectedRoomDetails.number} ({selectedRoomDetails.type})</h3>
              </div>
              <button
                onClick={() => setSelectedRoomDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Update for Housekeeping */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Đổi Trạng Thái Phòng Cho HK:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { code: 'OCC', label: 'OCC - Có Khách', class: 'bg-red-100 text-red-800 border-red-200' },
                  { code: 'ARR', label: 'ARR - Sắp Đến', class: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { code: 'DO', label: 'DO - Phòng Bẩn', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { code: 'VAC', label: 'VAC - Trống Sạch', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                ].map((s) => (
                  <button
                    key={s.code}
                    onClick={() => {
                      updateRoomStatus(selectedRoomDetails.number, s.code as RoomStatus);
                      setSelectedRoomDetails(prev => prev ? { ...prev, status: s.code as RoomStatus } : null);
                    }}
                    className={`p-2.5 rounded-xl border transition-all text-center ${s.class} ${
                      selectedRoomDetails.status === s.code ? 'ring-2 ring-blue-600 font-black' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bug Report */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  const rNum = selectedRoomDetails.number;
                  setSelectedRoomDetails(null);
                  setSelectedRoomForBug(rNum);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xs"
              >
                <Wrench className="w-4 h-4" />
                <span>+ TẠO PHIẾU BÁO HỎNG CHO PHÒNG NÀY</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Report Bug Pop-up Modal */}
      {selectedRoomForBug && (
        <ReportBugModal
          initialRoomNumber={selectedRoomForBug}
          onClose={() => setSelectedRoomForBug(null)}
        />
      )}

    </div>
  );
};
