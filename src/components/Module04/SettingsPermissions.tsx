import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, RoomType } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Users, 
  Building2, 
  Check, 
  X, 
  AlertTriangle,
  KeyRound,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

export const SettingsPermissions: React.FC = () => {
  const { users, rooms, toggleUserLock, updateUserRole, updateRoomDetails, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'USERS' | 'ROLES_MATRIX' | 'ROOMS_CONFIG'>('USERS');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('101');

  const roleList: { code: UserRole; title: string; desc: string }[] = [
    { code: 'HK_STAFF', title: '1. Nhân viên HK', desc: 'Xem sơ đồ phòng, tạo phiếu báo hỏng, đổi trạng thái DO/VAC' },
    { code: 'ENG_STAFF', title: '2. Nhân viên ENG', desc: 'Tiếp nhận báo hỏng, đổi trạng thái Đã sửa/Chờ vật tư/Không sửa' },
    { code: 'HK_SUPERVISOR', title: '3. Giám sát HK', desc: 'Duyệt ma trận bảo trì Y/N, xem báo cáo bộ phận buồng phòng' },
    { code: 'ENG_SUPERVISOR', title: '4. Giám sát ENG', desc: 'Tạo task ma trận định kỳ, duyệt vật tư & phân công KTS' },
    { code: 'ADMIN', title: '5. Admin Hệ Thống', desc: 'Toàn quyền cấu hình, phân quyền nhân sự, mở khóa công tắc chống bấm nhầm' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Header Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              CÀI ĐẶT & PHÂN QUYỀN HỆ THỐNG
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                ADMIN ONLY
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Quản lý danh sách nhân sự, 5 cấp bậc phân quyền & Khóa an toàn chống bấm nhầm
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'USERS' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Quản Lý User
          </button>
          <button
            onClick={() => setActiveTab('ROLES_MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ROLES_MATRIX' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Ma Trận 5 Quyền
          </button>
          <button
            onClick={() => setActiveTab('ROOMS_CONFIG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ROOMS_CONFIG' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sơ Đồ 55 Phòng Master
          </button>
        </div>

      </div>

      {/* TAB 1: USER MANAGEMENT & LOCK SWITCH */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-4 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">DANH SÁCH NHÂN VIÊN & CÔNG TẮC KHÓA QUYỀN</h4>
              <p className="text-xs text-slate-400">
                Gạt công tắc [🔒 Khóa / 🔓 Mở] để bảo vệ vai trò nhân viên tránh bị thao tác bấm nhầm.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Nhân Viên</th>
                  <th className="p-3">Bộ Phận / Ca</th>
                  <th className="p-3">Mã PIN Vô Ca</th>
                  <th className="p-3">Vai Trò Phân Quyền (5 Roles)</th>
                  <th className="p-3 text-center">CÔNG TẮC BẢO VỆ [🔒 KHÓA / 🔓 MỞ]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  const isLocked = u.permissionsLocked;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-all">
                      
                      {/* Avatar & Name */}
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department & Shift */}
                      <td className="p-3">
                        <p className="font-semibold text-slate-200">{u.department}</p>
                        <p className="text-[10px] text-amber-400">{u.shift}</p>
                      </td>

                      {/* PIN */}
                      <td className="p-3">
                        <span className="font-mono bg-slate-950 text-amber-300 px-2 py-1 rounded border border-slate-800 font-bold">
                          **** ({u.pin})
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td className="p-3">
                        {isLocked ? (
                          <span className="font-bold text-slate-200 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 inline-block">
                            {u.roleTitle}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                            className="bg-slate-800 border-2 border-amber-500 text-white font-bold text-xs p-1.5 rounded-xl focus:ring-2 focus:ring-amber-400"
                          >
                            {roleList.map((r) => (
                              <option key={r.code} value={r.code}>
                                {r.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* REQUIREMENT: NÚT CÔNG TẮC [🔒 Khóa / 🔓 Mở] */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleUserLock(u.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 mx-auto shadow-md ${
                            isLocked
                              ? 'bg-rose-600/20 text-rose-300 border-2 border-rose-500/50 hover:bg-rose-600/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50 hover:bg-emerald-500/30 animate-pulse'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Lock className="w-4 h-4 text-rose-400" />
                              <span>🔒 ĐÃ KHÓA (CHỐNG BẤM NHẦM)</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 text-emerald-400" />
                              <span>🔓 ĐANG MỞ (CHO PHÉP SỬA)</span>
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: ROLES PERMISSION BREAKDOWN MATRIX */}
      {activeTab === 'ROLES_MATRIX' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl">
          <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            CHI TIẾT MA TRẬN CẤP QUYỀN VẬN HÀNH (5 PHÂN QUYỀN KHÁCH SẠN)
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border-collapse border border-slate-800">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="p-3 border border-slate-800">Chức Năng Thao Tác</th>
                  <th className="p-3 border border-slate-800 text-center text-amber-300">1. HK Staff</th>
                  <th className="p-3 border border-slate-800 text-center text-amber-300">2. ENG Staff</th>
                  <th className="p-3 border border-slate-800 text-center text-amber-300">3. HK Sup</th>
                  <th className="p-3 border border-slate-800 text-center text-amber-300">4. ENG Sup</th>
                  <th className="p-3 border border-slate-800 text-center text-amber-300">5. Admin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Xem Sơ đồ 55 phòng & Báo hỏng', hk: true, eng: true, hksup: true, engsup: true, admin: true },
                  { name: 'Gửi Phiếu Báo Hỏng Realtime (HK)', hk: true, eng: false, hksup: true, engsup: false, admin: true },
                  { name: 'Sửa / Đổi Trạng Thái Báo Hỏng (ENG)', hk: false, eng: true, hksup: false, engsup: true, admin: true },
                  { name: 'Duyệt Ma Trận Bảo Trì Y/N (HK)', hk: false, eng: false, hksup: true, engsup: false, admin: true },
                  { name: 'Đề Xuất Matrix Bảo Trì Định Kỳ (ENG)', hk: false, eng: true, hksup: false, engsup: true, admin: true },
                  { name: 'In Báo Cáo A4 & Xuất PDF', hk: false, eng: false, hksup: true, engsup: true, admin: true },
                  { name: 'Mở Khóa [🔒 Khóa/🔓 Mở] Phân Quyền', hk: false, eng: false, hksup: false, engsup: false, admin: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 border-b border-slate-800">
                    <td className="p-3 font-bold text-white border border-slate-800">{row.name}</td>
                    <td className="p-3 text-center border border-slate-800">{row.hk ? '☑ Có' : '❌ Không'}</td>
                    <td className="p-3 text-center border border-slate-800">{row.eng ? '☑ Có' : '❌ Không'}</td>
                    <td className="p-3 text-center border border-slate-800">{row.hksup ? '☑ Có' : '❌ Không'}</td>
                    <td className="p-3 text-center border border-slate-800">{row.engsup ? '☑ Có' : '❌ Không'}</td>
                    <td className="p-3 text-center border border-slate-800 text-emerald-400 font-bold">{row.admin ? '☑ Toàn Quyền' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER ROOM CONFIG */}
      {activeTab === 'ROOMS_CONFIG' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-white">CẤU HÌNH DANH SÁCH 55 PHÒNG MASTER</h4>
            <span className="text-xs text-amber-400 font-mono">Đã tải 55 / 55 Phòng</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 max-h-96 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRoomNumber(r.number)}
                className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                  selectedRoomNumber === r.number ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <p className="font-mono text-xs font-black">{r.number}</p>
                <p className="text-[9px] text-slate-400">{r.type}</p>
              </div>
            ))}
          </div>

          {/* Edit Selected Room details */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <p className="text-xs font-bold text-amber-400">Đang chọn điều chỉnh: PHÒNG {selectedRoomNumber}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Loại Phòng:</label>
                <select
                  value={rooms.find(r => r.number === selectedRoomNumber)?.type || 'STD'}
                  onChange={(e) => updateRoomDetails(selectedRoomNumber, { type: e.target.value as RoomType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold"
                >
                  <option value="STD">STD (Standard)</option>
                  <option value="SUP">SUP (Superior)</option>
                  <option value="DLX">DLX (Deluxe)</option>
                  <option value="SUT">SUT (Suite)</option>
                  <option value="CUL">CUL (Executive Corner)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ghi Chú Đặc Biệt:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng góc ban công rộng..."
                  onChange={(e) => updateRoomDetails(selectedRoomNumber, { notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
