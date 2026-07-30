import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  Filter, 
  Download, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  DollarSign,
  Building2,
  PieChart
} from 'lucide-react';

export const ReportsAndPrint: React.FC = () => {
  const { tickets, rooms, maintenanceTasks } = useApp();

  // Date Filter range
  const [startDate, setStartDate] = useState<string>('2026-07-01');
  const [endDate, setEndDate] = useState<string>('2026-07-31');
  const [floorFilter, setFloorFilter] = useState<string>('ALL');
  const [reportType, setReportType] = useState<string>('ISSUES');

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    const room = rooms.find(r => r.number === t.roomNumber);
    const matchesFloor = floorFilter === 'ALL' || (room && String(room.floor) === floorFilter);
    return matchesFloor;
  });

  // Calculate KPIs
  const totalTicketsCount = filteredTickets.length;
  const fixedCount = filteredTickets.filter(t => t.status === 'FIXED').length;
  const waitingPartsCount = filteredTickets.filter(t => t.status === 'WAITING_PARTS').length;
  const urgentCount = filteredTickets.filter(t => t.isUrgent).length;
  const successRate = totalTicketsCount > 0 ? Math.round((fixedCount / totalTicketsCount) * 100) : 100;

  // Active Task progress for 55 rooms
  const activeTask = maintenanceTasks[0];
  const totalRoomsCount = 55;
  const doneDCount = Object.values(activeTask?.roomStates || {}).filter(s => s === 'DONE_D').length;
  const periodicProgressRate = Math.round((doneDCount / totalRoomsCount) * 100);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              BÁO CÁO VẬN HÀNH & XUẤT IN FORM A4
            </h3>
            <p className="text-[11px] text-slate-500">
              Tổng hợp dữ liệu sự cố hỏng hóc & Ma trận bảo trì định kỳ 55 phòng
            </p>
          </div>
        </div>

        {/* Date Range Inputs & Print Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500 text-[10px]">Từ:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-800 font-mono focus:outline-none"
            />
            <span className="text-slate-500 text-[10px] ml-2">Đến:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-800 font-mono focus:outline-none"
            />
          </div>

          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả Tầng (1-5)</option>
            <option value="1">Tầng 1</option>
            <option value="2">Tầng 2</option>
            <option value="3">Tầng 3</option>
            <option value="4">Tầng 4</option>
            <option value="5">Tầng 5</option>
          </select>

          {/* REQUIREMENT: Nút in A4 */}
          <button
            onClick={handlePrintReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ IN BÁO CÁO A4</span>
          </button>

        </div>

      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase">TỔNG SỰ CỐ PHÁT SINH</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-black text-slate-900">{totalTicketsCount} phiếu</h3>
            <span className="text-[10px] text-rose-600 font-bold">{urgentCount} phiếu GẤP</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Ghi nhận từ HK & KTS</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase">TỶ LỆ KHẮC PHỤC THÀNH CÔNG</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-black text-emerald-600">{successRate}%</h3>
            <span className="text-[10px] text-emerald-600 font-bold">{fixedCount} / {totalTicketsCount}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Đã sửa & nghiệm thu</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase">TIẾN ĐỘ BẢO TRÌ 55 PHÒNG</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-black text-blue-600">{periodicProgressRate}%</h3>
            <span className="text-[10px] text-blue-600 font-bold">{doneDCount} / 55 xong</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Task bảo trì tháng {activeTask.cycle}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase">VẬT TƯ ĐANG ĐỜI BỔ SUNG</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-black text-rose-600">{waitingPartsCount} vật tư</h3>
            <span className="text-[10px] text-slate-500">Đã gửi mua</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Chờ nhập kho kỹ thuật</p>
        </div>

      </div>

      {/* FORM PREVIEW FOR A4 PRINT SHEET (Mẫu Báo Cáo A4 Chuẩn Form) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>MẪU FORM BÁO CÁO A4 (XUẤT IN & LƯU HỒ SƠ)</span>
          </h3>
          <span className="text-xs text-slate-500 italic">Khổ giấy A4 Portrait Standard</span>
        </div>

        {/* Printable Paper Canvas Sheet */}
        <div className="bg-white text-black p-6 sm:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto font-sans leading-relaxed">
          
          {/* Paper Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                GRAND HOTEL 55 PHÒNG
              </h2>
              <p className="text-xs text-slate-700">Bộ phận: Vận Hành, Buồng Phòng (HK) & Kỹ Thuật (ENG)</p>
              <p className="text-xs text-slate-700">Địa chỉ: 123 Đường Bờ Biển, Phường 1, TP Khách Sạn</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-800 block">MÃ BC: BC-2026-07</span>
              <span className="text-xs text-slate-600 block">Thời gian lập: {new Date().toLocaleDateString('vi-VN')}</span>
              <span className="text-xs text-slate-600 block">Người lập: {useApp().currentUser?.name || 'Admin'}</span>
            </div>
          </div>

          {/* Paper Title */}
          <div className="text-center my-4">
            <h1 className="text-xl font-black uppercase text-slate-950">
              BÁO CÁO TỔNG HỢP VẬN HÀNH & SỬA CHỮA BẢO TRÌ
            </h1>
            <p className="text-xs font-bold text-slate-700 mt-1">
              Giai đoạn: Từ ngày {startDate} đến ngày {endDate}
            </p>
          </div>

          {/* Section 1: Summary Table */}
          <div className="my-4">
            <h3 className="text-xs font-black uppercase text-slate-900 mb-2 border-b border-slate-400 pb-1">
              I. BẢNG TỔNG HỢP SỰ CỐ THEO TẦNG (55 PHÒNG)
            </h3>

            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold text-left">
                  <th className="border border-slate-400 p-1.5">Khu Vực Tầng</th>
                  <th className="border border-slate-400 p-1.5 text-center">Số Phòng</th>
                  <th className="border border-slate-400 p-1.5 text-center">Tổng Sự Cố</th>
                  <th className="border border-slate-400 p-1.5 text-center">Phiếu GẤP 🔴</th>
                  <th className="border border-slate-400 p-1.5 text-center">Đã Sửa ☑</th>
                  <th className="border border-slate-400 p-1.5 text-center">Chờ Vật Tư ⌛</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((f) => {
                  const tgs = tickets.filter(t => {
                    const rm = rooms.find(r => r.number === t.roomNumber);
                    return rm && rm.floor === f;
                  });
                  return (
                    <tr key={f} className="border-b border-slate-300">
                      <td className="border border-slate-400 p-1.5 font-bold">Tầng {f}</td>
                      <td className="border border-slate-400 p-1.5 text-center font-mono">11 phòng</td>
                      <td className="border border-slate-400 p-1.5 text-center font-bold">{tgs.length}</td>
                      <td className="border border-slate-400 p-1.5 text-center text-rose-600 font-bold">
                        {tgs.filter(t => t.isUrgent).length}
                      </td>
                      <td className="border border-slate-400 p-1.5 text-center text-emerald-700 font-bold">
                        {tgs.filter(t => t.status === 'FIXED').length}
                      </td>
                      <td className="border border-slate-400 p-1.5 text-center text-amber-700 font-bold">
                        {tgs.filter(t => t.status === 'WAITING_PARTS').length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 2: Detailed Ticket Log Table */}
          <div className="my-5">
            <h3 className="text-xs font-black uppercase text-slate-900 mb-2 border-b border-slate-400 pb-1">
              II. CHI TIẾT DANH SÁCH SỰ CỐ BÁO HỎNG REALTIME
            </h3>

            <table className="w-full text-[11px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold">
                  <th className="border border-slate-400 p-1 text-center">Mã Phiếu</th>
                  <th className="border border-slate-400 p-1 text-center">Số Phòng</th>
                  <th className="border border-slate-400 p-1">Sự Cố Chi Tiết</th>
                  <th className="border border-slate-400 p-1 text-center">Mức Độ</th>
                  <th className="border border-slate-400 p-1 text-center">Có Khách</th>
                  <th className="border border-slate-400 p-1 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="border-b border-slate-300">
                    <td className="border border-slate-400 p-1 font-mono text-center">{t.id}</td>
                    <td className="border border-slate-400 p-1 font-bold text-center">P.{t.roomNumber}</td>
                    <td className="border border-slate-400 p-1">
                      <strong className="text-slate-900">{t.issueType}</strong> - ({t.location})
                    </td>
                    <td className="border border-slate-400 p-1 text-center font-bold">
                      {t.isUrgent ? '🔴 GẤP' : 'Thường'}
                    </td>
                    <td className="border border-slate-400 p-1 text-center">
                      {t.isGuestInRoom ? 'Có' : 'Không'}
                    </td>
                    <td className="border border-slate-400 p-1 text-center font-bold">
                      {t.status === 'FIXED' ? 'Đã sửa ☑' : t.status === 'WAITING_PARTS' ? 'Chờ vật tư ⌛' : 'Đang xử lý'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Signatures */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-10 pt-4 border-t border-slate-400">
            <div>
              <p className="font-bold uppercase text-slate-900">Người Lập Báo Cáo</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Ký và ghi rõ họ tên)</p>
              <p className="font-bold">Nguyễn Văn An</p>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-900">Giám Sát Kỹ Thuật (ENG)</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Ký duyệt nghiệp vụ)</p>
              <p className="font-bold">Phạm Hoàng Dũng</p>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-900">Giám Đốc Điều Hành (GM)</p>
              <p className="text-[10px] text-slate-500 italic mb-12">(Duyệt lưu trữ tài liệu)</p>
              <p className="font-bold">Võ Thị Quản Trị</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
