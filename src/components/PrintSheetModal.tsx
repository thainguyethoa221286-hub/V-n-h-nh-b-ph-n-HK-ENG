import React from 'react';
import { MaintenanceTask, Room } from '../types';
import { Printer, X } from 'lucide-react';

interface PrintSheetModalProps {
  task: MaintenanceTask;
  rooms: Room[];
  onClose: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({ task, rooms, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Divide 55 rooms into 4 columns for A4 print
  const col1 = rooms.slice(0, 14);
  const col2 = rooms.slice(14, 28);
  const col3 = rooms.slice(28, 42);
  const col4 = rooms.slice(42, 55);

  const getStateText = (state?: string) => {
    switch (state) {
      case 'PROPOSED': return 'ENG Đề xuất';
      case 'APPROVED_Y': return 'HK Duyệt Y';
      case 'APPROVED_N': return 'HK Từ chối N';
      case 'DONE_D': return 'Đã xong D ☑';
      default: return 'Chưa làm';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Container */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]">
        
        {/* Header - Hidden on Print */}
        <div className="no-print bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">MẪU TRANG IN TẢI PHIẾU BẢO TRÌ (A4 CHUẨN)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>IN BẢN GIẤY / XUẤT PDF A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 CONTENT */}
        <div className="p-6 bg-white text-black overflow-y-auto font-sans leading-snug">
          
          {/* Header Hotel info */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">GRAND HOTEL 55 PHÒNG</h1>
              <p className="text-xs text-slate-700">Địa chỉ: 123 Đường Bờ Biển, Phường 1, Thành Phố Khách Sạn</p>
              <p className="text-xs text-slate-700">Hotline Kỹ Thuật (ENG): Ext. 8888 | Buồng Phòng (HK): Ext. 1111</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-600 block">MÃ PHIẾU: {task.id}</span>
              <span className="text-xs text-slate-600 block">Ngày in: {new Date().toLocaleDateString('vi-VN')}</span>
              <span className="text-xs font-bold bg-slate-200 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                {task.cycle}
              </span>
            </div>
          </div>

          {/* Task Title */}
          <div className="text-center my-3">
            <h2 className="text-lg font-black uppercase text-slate-900">
              BẢNG TIẾN ĐỘ BẢO TRÌ ĐỊNH KỲ (MA TRẬN 55 PHÒNG)
            </h2>
            <p className="text-sm font-bold text-slate-800 my-0.5">{task.name}</p>
            <p className="text-xs text-slate-600 font-mono">
              Thời gian thực hiện: Từ ngày {task.startDate} đến ngày {task.endDate}
            </p>
          </div>

          {/* 4 Columns Matrix Table for 55 Rooms */}
          <div className="grid grid-cols-4 gap-2 my-4 border border-slate-900 p-2 text-xs">
            {[col1, col2, col3, col4].map((col, colIdx) => (
              <div key={colIdx} className="space-y-1">
                <div className="bg-slate-200 font-bold text-center py-1 border border-slate-400">
                  CỘT {colIdx + 1}
                </div>
                {col.map((room) => {
                  const state = task.roomStates[room.number] || 'NONE';
                  return (
                    <div
                      key={room.id}
                      className="flex items-center justify-between border-b border-slate-300 py-1 px-1 text-[11px]"
                    >
                      <span className="font-bold text-slate-900">{room.number}</span>
                      <span className={`font-mono text-[10px] px-1 rounded ${
                        state === 'DONE_D'
                          ? 'bg-emerald-200 font-bold text-emerald-950'
                          : state === 'APPROVED_Y'
                          ? 'bg-yellow-200 font-bold'
                          : state === 'APPROVED_N'
                          ? 'bg-red-200 font-bold'
                          : state === 'PROPOSED'
                          ? 'bg-slate-200'
                          : 'text-slate-500'
                      }`}>
                        {getStateText(state)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Task Description & Notes */}
          <div className="border border-slate-300 p-2 text-xs mb-6 rounded">
            <p className="font-bold text-slate-800">Ghi chú hướng dẫn kỹ thuật:</p>
            <p className="text-slate-700">{task.description}</p>
          </div>

          {/* Signature Blocks */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-8 pt-4 border-t border-slate-400">
            <div>
              <p className="font-bold uppercase text-slate-900">Giám Sát Buồng Phòng (HK)</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Ký và ghi rõ họ tên)</p>
              <p className="font-bold">Lê Văn Cường</p>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-900">Giám Sát Kỹ Thuật (ENG)</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Ký và ghi rõ họ tên)</p>
              <p className="font-bold">Phạm Hoàng Dũng</p>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-900">Ban Giám Đốc Duyệt</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Ký duyệt lưu hồ sơ)</p>
              <p className="font-bold">Võ Thị Quản Trị</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
