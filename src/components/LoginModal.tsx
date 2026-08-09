import React, { useState, useEffect } from 'react';
import { UserSession, UserRole } from '../types';
import { useMasjidStore } from '../lib/store';
import { getSupabaseClient } from '../lib/supabase';
import {
  UserCheck,
  X,
  Mail,
  Lock,
  Calendar,
  Sparkles,
  History,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  onLogin: (email: string, name: string, role: UserRole, phone?: string) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  session,
  onLogin,
  onLogout
}) => {
  const [email, setEmail] = useState(session.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('jamaah');
  const [name, setName] = useState('');
  const { state } = useMasjidStore();
  const { appRoles } = state;

  useEffect(() => {
    if (isOpen && !session.isLoggedIn) {
      setEmail('');
      setPassword('');
      setName('');
      setRole('jamaah');
      setShowPassword(false);
    }
  }, [isOpen, session.isLoggedIn]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalRole: UserRole = 'jamaah';
    let finalName = name || 'Jamaah Tazkia';

    // Auto-detect admin & pengurus logins based on email
    if (email === 'admin@tazkia.id' || email === 'direktur@tazkia.id') {
      if (password === 'admin123' || password === '123456') {
        finalRole = email === 'admin@tazkia.id' ? 'ketua_dewan_pembina' : 'direktur';
        finalName = email === 'admin@tazkia.id' ? 'Super Admin Tazkia' : 'Direktur';
      } else {
        alert("Kredensial akses khusus tidak valid.");
        return;
      }
    } else {
      // Check if it's an existing user in database
      const user = state.jamaahProfiles?.find(u => 
        u.email === email || u.name === email || u.phone === email
      );
      
      if (user) {
        if (user.password === password || (!user.password && password === '123456')) {
          finalRole = (user.role as UserRole) || 'jamaah';
          finalName = user.name;
        } else {
          alert("Maaf, Kata Sandi Anda salah.");
          return;
        }
      } else {
        // Fallback for new Jamaah (Pendaftaran Otomatis)
        finalRole = 'jamaah';
        finalName = name || 'Jamaah Tazkia';
      }
    }
    
    onLogin(email, finalName, finalRole);
    
    alert(`Assalamualaikum, selamat datang di aplikasi Masjid Tazkia${finalName ? ', ' + finalName : ''}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Back button & close for mobile — sticky at top */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#1e3a8a] sm:hidden shadow-lg">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-bold cursor-pointer"
        >
          <span className="text-lg leading-none">←</span>
          <span>Kembali</span>
        </button>
        <span className="text-white text-xs font-mono font-bold uppercase tracking-wider">Portal Keanggotaan</span>
        <button onClick={onClose} className="text-white/80 hover:text-white p-1 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-start justify-center min-h-full p-4 py-6 sm:py-8">
      <div className="bg-[#F9F8F4] border border-black/15 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative text-[#1A1A1A]">
        {/* Header Bar */}
        <div className="bg-[#1e3a8a] text-white px-6 py-4 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-serif italic font-semibold text-white truncate">
                Masjid Tazkia - Portal Keanggotaan
              </h3>
              <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 truncate">
                Selamat Datang di Portal Transaksi ZISWAF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid matching Screenshot 3 Layout */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Left Side */}
          {session.isLoggedIn ? (
            <div className="space-y-4 text-center py-6 my-auto">
              <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center mx-auto text-2xl font-bold font-serif">
                {session.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 font-serif">{session.name}</h4>
                <p className="text-xs text-blue-600 font-mono mt-0.5">{session.email}</p>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded mt-2 inline-block uppercase">
                  Akses {session.role.replace(/_/g, ' ')}
                </span>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
              >
                Keluar Akun (Logout)
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Panduan Login Block - Only show Jamaah view publicly */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-left">
                <h5 className="text-xs font-bold text-amber-800 mb-1">Panduan Login Khusus Jamaah:</h5>
                <ul className="text-[10px] text-amber-700 space-y-1 list-disc pl-4">
                  <li><strong className="text-amber-900">Pendaftaran Otomatis:</strong> Anda tidak perlu mendaftar terpisah. Cukup isi formulir di bawah, akun akan terdaftar dan langsung masuk secara otomatis!</li>
                  <li>Gunakan <strong>Email atau No. Handphone (WhatsApp)</strong> yang aktif.</li>
                  <li>Sistem akan menyinkronkan riwayat donasi dan layanan Anda secara otomatis.</li>
                </ul>
              </div>

              {/* Input section remains standard for both */}
              <div className="text-left">
                <label className="text-xs font-semibold text-blue-800 block mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-blue-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl px-4 py-2.5 text-xs text-blue-900 outline-none"
                />
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold text-blue-800 block mb-1">
                  {role === 'jamaah' ? 'Email atau No. Handphone (Jamaah):' : 'Email / Username Petugas:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-blue-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-blue-900 outline-none font-mono"
                    placeholder={role === 'jamaah' ? "Contoh: 08123456789 atau user@email.com" : "Contoh: admin_keuangan@tazkia.id"}
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold text-blue-800 block mb-1">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-blue-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-blue-900 outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="https://wa.me/6285810008899?text=Assalamu'alaikum%20Admin,%20saya%20lupa%20password%20akun%20Aplikasi%20Masjid%20Tazkia%20saya.%20Mohon%20bantuannya." target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Lupa Password? Hubungi Admin
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span>Masuk / Daftar Otomatis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {role === 'jamaah' && (
                <div className="text-center pt-2">
                  <p className="text-[11px] text-blue-800 font-medium">
                    Belum punya akun Jamaah?{' '}
                    <a href="#" className="font-bold text-amber-600 hover:text-amber-700 hover:underline">
                      Daftar Sekarang
                    </a>
                  </p>
                </div>
              )}
            </form>
          )}

          {/* Right Highlights Panel matching Screenshot 3 Right Sidebar */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-4 my-auto">
            <h4 className="font-bold text-blue-900 text-sm mb-2 text-center pb-2 border-b border-blue-100">
              Fitur Portal Jamaah (Tersedia Setelah Login):
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-blue-900">Donasi Otomatis</p>
                  <p className="text-blue-600 text-[11px]">(Harian / Mingguan / Bulanan)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-blue-900">Kalkulator Zakat Pribadi</p>
                  <p className="text-blue-600 text-[11px]">Hitung nisab zakat mal & penghasilan</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <History className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-blue-900">Histori Transaksi Cepat</p>
                  <p className="text-blue-600 text-[11px]">Laporan tanda terima resmi DKM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-blue-900">Manajemen Profil</p>
                  <p className="text-blue-600 text-[11px]">Keanggotaan terverifikasi jamaah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
