import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, KeyRound, ShieldCheck, UserCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { users, loginWithPin } = useApp();
  
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const handleNumClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setErrorMessage('');
    }
  };

  const handleDeletePin = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setErrorMessage('Vui lòng nhập Mã PIN của bạn!');
      return;
    }
    const res = loginWithPin(selectedUserId, pin);
    if (!res.success) {
      setErrorMessage(res.message || 'Mã PIN chưa chính xác!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-center border-b border-slate-700 relative">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">GRAND HOTEL</h2>
          <p className="text-xs text-amber-400 font-semibold mt-0.5 uppercase tracking-wider">
            Quản Lý Vận Hành & Bảo Trì 55 Phòng
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Đăng nhập nhanh không cần Tên tài khoản (Username Hidden)
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Step 1: Employee Select (Dropdown / Avatar Cards) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Chọn Nhân Viên Vào Ca:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-slate-700">
              {users.map((u) => {
                const isSelected = u.id === selectedUserId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setPin('');
                      setErrorMessage('');
                    }}
                    className={`flex items-center space-x-2.5 p-2 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.roleTitle.split(' ')[0]} {u.role.split('_')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected User Badge */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <p className="text-xs font-bold text-white">{selectedUser.name}</p>
                <p className="text-[11px] text-amber-400 font-semibold">{selectedUser.roleTitle}</p>
                <p className="text-[10px] text-slate-400">Ca làm việc: {selectedUser.shift}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-slate-800 text-amber-300 font-mono px-2 py-1 rounded border border-slate-700">
                PIN Demo: {selectedUser.pin}
              </span>
            </div>
          </div>

          {/* Step 2: PIN Code Entry */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  2. Nhập Mã PIN (4 - 6 Số):
                </label>
                <span className="text-[11px] text-slate-400 font-mono">{pin.length}/6 ký tự</span>
              </div>

              {/* PIN Display Dots */}
              <div className="flex justify-center space-x-3 bg-slate-900 p-3.5 rounded-xl border border-slate-700 my-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const hasValue = idx < pin.length;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        hasValue
                          ? 'bg-amber-400 border-amber-300 scale-110 shadow-sm shadow-amber-400/50'
                          : 'bg-slate-800 border-slate-600'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Touch Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleNumClick(digit)}
                  className="bg-slate-700/80 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-bold text-lg py-3 rounded-xl transition-all border border-slate-600 shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleDeletePin}
                className="bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-sm py-3 rounded-xl transition-all border border-slate-700"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => handleNumClick('0')}
                className="bg-slate-700/80 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-bold text-lg py-3 rounded-xl transition-all border border-slate-600 shadow-sm"
              >
                0
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-1 shadow-lg shadow-amber-500/20"
              >
                <span>VÀO CA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

        </div>

        {/* Footer Demo PIN Reminder */}
        <div className="bg-slate-900/90 p-3 text-center border-t border-slate-700/80 text-[11px] text-slate-400">
          <p>Danh sách PIN Demo test 5 vai trò:</p>
          <p className="text-amber-300 font-mono font-semibold mt-0.5">
            HK: 1111 | ENG: 2222 | HK Sup: 3333 | ENG Sup: 4444 | Admin: 9999
          </p>
        </div>

      </div>
    </div>
  );
};
