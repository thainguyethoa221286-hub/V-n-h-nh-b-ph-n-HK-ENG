import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatrixTaskCellState, MaintenanceTask } from '../../types';
import { PrintSheetModal } from '../PrintSheetModal';
import { 
  Calendar, 
  Printer, 
  Plus, 
  Check, 
  RotateCcw, 
  CheckSquare, 
  Info,
  Layers,
  ChevronDown,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const MaintenanceMatrix: React.FC = () => {
  const { 
    maintenanceTasks, 
    selectedTaskId, 
    setSelectedTaskId, 
    updateMatrixState, 
    cycleMatrixStateForRoom,
    bulkUpdateMatrix,
    addMaintenanceTask,
    rooms,
    currentUser
  } = useApp();

  const [selectedRoomsForBulk, setSelectedRoomsForBulk] = useState<string[]>([]);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);

  // New task form state
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskStart, setNewTaskStart] = useState<string>('2026-08-01');
  const [newTaskEnd, setNewTaskEnd] = useState<string>('2026-08-15');
  const [newTaskCycle, setNewTaskCycle] = useState<'Tuần' | 'Tháng' | 'Quý' | 'Đột xuất'>('Tháng');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');

  const activeTask = maintenanceTasks.find(t => t.id === selectedTaskId) || maintenanceTasks[0];

  // Colors mapping matching requirement EXACTLY:
  // - Default: White (#FFFFFF)
  // - ENG Đề xuất: Gray (#E2E8F0)
  // - HK Duyệt 'Y' (Làm được): Yellow (#FEF08A)
  // - HK Duyệt 'N' (Không làm được): Red (#FECACA)
  // - HK/ENG 'D' (Đã xong): Green (#BBF7D0) + Biểu tượng ☑
  const getCellStyling = (state: MatrixTaskCellState) => {
    switch (state) {
      case 'PROPOSED':
        return {
          bgHex: '#E2E8F0',
          className: 'bg-[#E2E8F0] text-slate-900 border-slate-300 font-bold',
          label: 'ENG Đề Xuất',
          code: 'PROP',
        };
      case 'APPROVED_Y':
        return {
          bgHex: '#FEF08A',
          className: 'bg-[#FEF08A] text-slate-950 border-yellow-300 font-bold',
          label: 'HK Duyệt (Y)',
          code: 'Y',
        };
      case 'APPROVED_N':
        return {
          bgHex: '#FECACA',
          className: 'bg-[#FECACA] text-red-950 border-red-300 font-bold',
          label: 'HK Từ Chối (N)',
          code: 'N',
        };
      case 'DONE_D':
        return {
          bgHex: '#BBF7D0',
          className: 'bg-[#BBF7D0] text-emerald-950 border-emerald-300 font-black',
          label: 'Đã Xong (D) ☑',
          code: 'D ☑',
        };
      case 'NONE':
      default:
        return {
          bgHex: '#FFFFFF',
          className: 'bg-white text-slate-700 border-slate-200 font-medium',
          label: 'Chưa làm',
          code: '-',
        };
    }
  };

  // Divide all 55 rooms into 4 columns evenly as requested
  const totalRoomsList = rooms; // 55 rooms
  const quarterSize = Math.ceil(totalRoomsList.length / 4); // 14
  const col1 = totalRoomsList.slice(0, 14);
  const col2 = totalRoomsList.slice(14, 28);
  const col3 = totalRoomsList.slice(28, 42);
  const col4 = totalRoomsList.slice(42, 55);

  const columns = [col1, col2, col3, col4];

  // Bulk room checkbox handlers
  const handleToggleSelectRoom = (roomNum: string) => {
    setSelectedRoomsForBulk(prev => 
      prev.includes(roomNum) ? prev.filter(n => n !== roomNum) : [...prev, roomNum]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoomsForBulk.length === rooms.length) {
      setSelectedRoomsForBulk([]);
    } else {
      setSelectedRoomsForBulk(rooms.map(r => r.number));
    }
  };

  const applyBulkState = (newState: MatrixTaskCellState) => {
    if (selectedRoomsForBulk.length === 0) return;
    bulkUpdateMatrix(activeTask.id, selectedRoomsForBulk, newState);
    setSelectedRoomsForBulk([]);
  };

  // Count states summary
  const statesSummary = {
    none: rooms.filter(r => (activeTask.roomStates[r.number] || 'NONE') === 'NONE').length,
    proposed: rooms.filter(r => activeTask.roomStates[r.number] === 'PROPOSED').length,
    approvedY: rooms.filter(r => activeTask.roomStates[r.number] === 'APPROVED_Y').length,
    approvedN: rooms.filter(r => activeTask.roomStates[r.number] === 'APPROVED_N').length,
    doneD: rooms.filter(r => activeTask.roomStates[r.number] === 'DONE_D').length,
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;

    addMaintenanceTask({
      name: newTaskName,
      startDate: newTaskStart,
      endDate: newTaskEnd,
      cycle: newTaskCycle,
      description: newTaskDesc || 'Nhiệm vụ bảo trì hệ thống 55 phòng',
      roomStates: {},
      createdBy: currentUser?.name || 'Admin',
    });

    setShowNewTaskModal(false);
    setNewTaskName('');
  };

  return (
    <div className="space-y-4 text-slate-800">
      
      {/* Task Selector & Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          {/* Task Select Dropdown */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] uppercase font-bold text-slate-500 block">
                Chọn Task Bảo Trì Định Kỳ:
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full lg:w-96 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
              >
                {maintenanceTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.cycle}] {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons: Create Task & Print Task */}
          <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-200 transition-all"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>+ Tạo Task Mới</span>
            </button>

            {/* REQUIREMENT: Nút [🖨️ In Task này] */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ IN TASK NÀY</span>
            </button>
          </div>

        </div>

        {/* Task Details Info Header */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-500">Thời gian thực hiện: </span>
            <span className="font-bold text-blue-700 font-mono">
              Từ {activeTask.startDate} Đến {activeTask.endDate}
            </span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-slate-500">Chu kỳ: </span>
            <span className="font-bold text-slate-800">{activeTask.cycle}</span>
          </div>

          <p className="text-slate-600 text-xs italic truncate max-w-md">
            "{activeTask.description}"
          </p>
        </div>

      </div>

      {/* COLOR LEGEND & STATS BAR - Matching strict prompt rules */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700 text-[11px] uppercase">Quy trình Đổi Màu Matrix:</span>
        </div>

        {/* Legend Pills with exact hex codes */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white text-slate-900 font-bold border border-slate-200 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
            <span>Mặc định: Trắng ({statesSummary.none})</span>
          </div>

          <span className="text-slate-400 font-bold">➔</span>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#E2E8F0] text-slate-950 font-bold border border-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>ENG Đề xuất: Xám ({statesSummary.proposed})</span>
          </div>

          <span className="text-slate-400 font-bold">➔</span>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FEF08A] text-slate-950 font-bold border border-yellow-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span>HK Duyệt 'Y': Vàng ({statesSummary.approvedY})</span>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FECACA] text-slate-950 font-bold border border-red-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span>HK Duyệt 'N': Đỏ ({statesSummary.approvedN})</span>
          </div>

          <span className="text-slate-400 font-bold">➔</span>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#BBF7D0] text-slate-950 font-black border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Xong 'D' ☑ ({statesSummary.doneD})</span>
          </div>

        </div>

      </div>

      {/* Bulk Action Controls */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSelectAll}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-200 flex items-center gap-1"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>{selectedRoomsForBulk.length === rooms.length ? 'Bỏ chọn hết' : 'Chọn tất cả 55 phòng'}</span>
          </button>
          {selectedRoomsForBulk.length > 0 && (
            <span className="text-slate-600 font-semibold">
              Đã chọn <strong className="text-blue-600">{selectedRoomsForBulk.length}</strong> phòng
            </span>
          )}
        </div>

        {selectedRoomsForBulk.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Đổi trạng thái hàng loạt:</span>
            <button
              onClick={() => applyBulkState('PROPOSED')}
              className="px-2 py-1 bg-[#E2E8F0] text-slate-950 font-bold rounded-lg border border-slate-300"
            >
              Set Xám (ENG Đề xuất)
            </button>
            <button
              onClick={() => applyBulkState('APPROVED_Y')}
              className="px-2 py-1 bg-[#FEF08A] text-slate-950 font-bold rounded-lg border border-yellow-300"
            >
              Set Vàng (HK Duyệt Y)
            </button>
            <button
              onClick={() => applyBulkState('APPROVED_N')}
              className="px-2 py-1 bg-[#FECACA] text-slate-950 font-bold rounded-lg border border-red-300"
            >
              Set Đỏ (HK Duyệt N)
            </button>
            <button
              onClick={() => applyBulkState('DONE_D')}
              className="px-2 py-1 bg-[#BBF7D0] text-slate-950 font-black rounded-lg border border-emerald-300"
            >
              Set Xanh Lá (Xong D ☑)
            </button>
            <button
              onClick={() => applyBulkState('NONE')}
              className="px-2 py-1 bg-white text-slate-900 font-bold rounded-lg border border-slate-200"
            >
              Reset Trắng
            </button>
          </div>
        )}
      </div>

      {/* MATRIX TABLE BOARD: 4 COLUMNS CONTAINING ALL 55 ROOMS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[700px]">
          
          {columns.map((colRooms, colIdx) => (
            <div key={colIdx} className="space-y-2 border-r last:border-r-0 border-slate-200 pr-2">
              
              {/* Column Header */}
              <div className="bg-slate-100 p-2 rounded-xl text-center border border-slate-200 mb-2">
                <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                  CỘT {colIdx + 1} ({colRooms.length} PHÒNG)
                </span>
              </div>

              {/* Room Rows */}
              {colRooms.map((room) => {
                const state = activeTask.roomStates[room.number] || 'NONE';
                const style = getCellStyling(state);
                const isSelected = selectedRoomsForBulk.includes(room.number);

                return (
                  <div
                    key={room.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${style.className} shadow-sm`}
                  >
                    {/* [Checkbox] */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectRoom(room.number)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />

                    {/* [Số phòng] */}
                    <div className="flex-1 ml-2 font-mono text-xs">
                      <span className="text-sm font-black tracking-tight">{room.number}</span>
                      <span className="text-[10px] ml-1 opacity-70 font-sans">({room.type})</span>
                    </div>

                    {/* [Ô nhập ký hiệu Y/N/D & Interactive Button Cycle] */}
                    <div className="flex items-center space-x-1">
                      
                      {/* Direct state selector buttons */}
                      <button
                        onClick={() => cycleMatrixStateForRoom(activeTask.id, room.number)}
                        title="Click để chuyển nhanh trạng thái (Trắng ➔ Xám ➔ Vàng ➔ Đỏ ➔ Xanh Lá ☑)"
                        className="px-2.5 py-1 rounded-lg text-xs font-black shadow-inner border border-black/10 hover:opacity-80 transition-all flex items-center gap-1"
                      >
                        {state === 'DONE_D' && <span>☑</span>}
                        <span>{style.code}</span>
                      </button>

                      {/* Select Dropdown override */}
                      <select
                        value={state}
                        onChange={(e) => updateMatrixState(activeTask.id, room.number, e.target.value as MatrixTaskCellState)}
                        className="text-[10px] bg-slate-900/10 border border-slate-900/20 rounded p-0.5 font-bold cursor-pointer"
                      >
                        <option value="NONE">Mặc định (Trắng)</option>
                        <option value="PROPOSED">ENG Đề xuất (Xám)</option>
                        <option value="APPROVED_Y">HK Duyệt (Y - Vàng)</option>
                        <option value="APPROVED_N">HK Duyệt (N - Đỏ)</option>
                        <option value="DONE_D">Đã Xong (D - Xanh lá ☑)</option>
                      </select>

                    </div>

                  </div>
                );
              })}

            </div>
          ))}

        </div>
      </div>

      {/* New Task Creation Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>TẠO TASK BẢO TRÌ ĐỊNH KỲ MỚI</span>
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Tên Nhiệm Vụ Bảo Trì:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bảo dưỡng hệ thống vòi xịt Tháng 8..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Từ Ngày:</label>
                  <input
                    type="date"
                    value={newTaskStart}
                    onChange={(e) => setNewTaskStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Đến Ngày:</label>
                  <input
                    type="date"
                    value={newTaskEnd}
                    onChange={(e) => setNewTaskEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Chu Kỳ Bảo Trì:</label>
                <select
                  value={newTaskCycle}
                  onChange={(e) => setNewTaskCycle(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Tuần">Hàng Tuần</option>
                  <option value="Tháng">Hàng Tháng</option>
                  <option value="Quý">Hàng Quý</option>
                  <option value="Đột xuất">Đột Xuất / Khẩn Cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Ghi Chú Chi Tiết:</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Ghi chú các yêu cầu kỹ thuật tiêu chuẩn..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
                >
                  Tạo Task Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Sheet Modal */}
      {showPrintModal && (
        <PrintSheetModal
          task={activeTask}
          rooms={rooms}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
};
