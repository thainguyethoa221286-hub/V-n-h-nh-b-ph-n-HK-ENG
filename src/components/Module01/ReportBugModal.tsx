import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, AlertOctagon, UserCheck, Key, Send, CheckSquare, Wrench } from 'lucide-react';

interface ReportBugModalProps {
  initialRoomNumber?: string;
  onClose: () => void;
}

export const ReportBugModal: React.FC<ReportBugModalProps> = ({ initialRoomNumber = '101', onClose }) => {
  const { rooms, currentUser, reportIssue } = useApp();

  const [roomNumber, setRoomNumber] = useState<string>(initialRoomNumber);
  const [location, setLocation] = useState<string>('Phòng tắm');
  const [issueType, setIssueType] = useState<string>('Điều hòa chảy nước');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80');

  // 3 Checkboxes required
  const [isUrgent, setIsUrgent] = useState<boolean>(true);       // 🔴 Gấp
  const [isGuestInRoom, setIsGuestInRoom] = useState<boolean>(true);// 👤 Có khách
  const [isDoorUnlocked, setIsDoorUnlocked] = useState<boolean>(true);// 🔑 Đã mở cửa

  const presetLocations = [
    'Phòng tắm / Vệ sinh',
    'Giường ngủ & Nội thất',
    'Điều hòa / Thông gió',
    'Cửa chính & Khóa từ',
    'Ban công & Cửa sổ',
    'Hệ thống Điện & Đèn',
    'Tivi & Mạng Wifi',
  ];

  const presetIssues = [
    'Điều hòa chảy nước / Không mát',
    'Vòi xịt xả nước yếu / Bị rò',
    'Bồn cầu tắc / Hỏng van xả',
    'Khóa từ không nhận thẻ',
    'Đèn phòng chớp nháy / Hỏng bóng',
    'Cửa ban công kẹt không khóa được',
    'Tivi mất tín hiệu truyền hình',
    'Khác (Nhập chi tiết bên dưới)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    reportIssue({
      roomNumber,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      location,
      issueType,
      description: description || `${issueType} tại ${location}`,
      photoUrl,
      isUrgent,
      isGuestInRoom,
      isDoorUnlocked,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                BÁO SỰ CỐ / HỎNG HÓC PHÒNG
              </h3>
              <p className="text-[11px] text-slate-400">
                Gửi thông tin trực tiếp tới bộ phận Kỹ Thuật (ENG)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Room Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Số Phòng Báo Hỏng:
            </label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-bold focus:ring-2 focus:ring-amber-500"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.number}>
                  Phòng {r.number} - [{r.type}] ({r.status === 'OCC' ? 'Có khách' : r.status === 'DO' ? 'Phòng bẩn' : 'Trống'})
                </option>
              ))}
            </select>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Vị Trí Xảy Ra Lỗi:
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500"
            >
              {presetLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Type Select */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Loại Sự Cố / Lỗi:
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500"
            >
              {presetIssues.map((iss, idx) => (
                <option key={idx} value={iss}>
                  {iss}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Chi Tiết Mô Tả Lỗi (Ghi chú HK):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Điều hòa chảy nước giọt xuống đệm, cần KTS mang máng hứng..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Simulated Photo Capture */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Chụp Ảnh Hiện Trường:</span>
              <span className="text-[10px] text-slate-400 font-normal">Mô phỏng đính kèm camera</span>
            </label>
            <div className="flex items-center space-x-3 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
              <img
                src={photoUrl}
                alt="Hiện trường"
                className="w-14 h-14 object-cover rounded-lg border border-slate-600"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Ảnh_HienTruong_P{roomNumber}.jpg</p>
                <p className="text-[10px] text-slate-400">Đã chụp từ điện thoại HK</p>
                <button
                  type="button"
                  onClick={() => {
                    const photos = [
                      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80',
                    ];
                    setPhotoUrl(photos[Math.floor(Math.random() * photos.length)]);
                  }}
                  className="mt-1 flex items-center space-x-1 text-[11px] text-amber-400 font-semibold hover:underline"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Chụp ảnh mới</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 MANDATORY CHECKBOXES REQUIREMENT */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              3 Ô Đánh Dấu Trạng Thái Bắt Buộc:
            </p>

            {/* Checkbox 1: 🔴 GẤP */}
            <label className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all border ${
              isUrgent ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold">🔴 PHIẾU GẤP (Báo động ưu tiên cao)</span>
                  <p className="text-[10px] opacity-80">Phát tin cảnh báo tràn màn hình KTS lập tức</p>
                </div>
              </div>
            </label>

            {/* Checkbox 2: 👤 Có khách */}
            <label className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all border ${
              isGuestInRoom ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={isGuestInRoom}
                onChange={(e) => setIsGuestInRoom(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold">👤 CÓ KHÁCH TRONG PHÒNG</span>
                  <p className="text-[10px] opacity-80">KTS cần gõ cửa lịch sự & đeo thẻ nhân viên</p>
                </div>
              </div>
            </label>

            {/* Checkbox 3: 🔑 Đã mở cửa */}
            <label className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all border ${
              isDoorUnlocked ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={isDoorUnlocked}
                onChange={(e) => setIsDoorUnlocked(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold">🔑 ĐÃ MỞ CỬA / MASTER KEY ĐÃ SẴN SÀNG</span>
                  <p className="text-[10px] opacity-80">KTS vào sửa ngay không cần đợi tìm chìa</p>
                </div>
              </div>
            </label>
          </div>

          {/* Action Submit */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>GỬI BÁO HỎNG REALTIME</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
