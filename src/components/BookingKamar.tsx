import React, { useState } from 'react';
import { CalendarIcon, User, Phone, CheckCircle, ChevronLeft, ChevronRight, BedDouble } from 'lucide-react';
import { useMasjidStore } from '../lib/store';

interface BookingKamarProps {
  isDark?: boolean;
}

const ROOM_TYPES = [
  { id: 'standard', name: 'Standard Room', price: 'Rp 150.000 / malam' },
  { id: 'family', name: 'Family Room', price: 'Rp 300.000 / malam' }
];

export const BookingKamar: React.FC<BookingKamarProps> = ({ isDark = false }) => {
  const { state, addKamarBooking } = useMasjidStore();
  const kamarBookings = state.kamarBookings || [];
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    roomType: 'standard',
    notes: ''
  });
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleDateClick = (date: Date) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else {
      if (date > checkInDate) {
        setCheckOutDate(date);
      } else {
        setCheckInDate(date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (checkInDate && checkOutDate) {
      return date > checkInDate && date < checkOutDate;
    }
    return false;
  };

  return (
    <div className={`min-h-screen py-16 transition-colors ${isDark ? 'bg-[#0a1128] text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
            Booking Guest House / Penginapan Jamaah
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fasilitas penginapan nyaman dan Islami bagi jamaah musafir, peziarah, maupun peserta kajian di Masjid Tazkia.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Calendar Widget */}
          <div className={`md:col-span-5 rounded-2xl p-6 shadow-xl border ${isDark ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
                <div key={day} className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const dateStr = date.toISOString().split('T')[0];
                const today = new Date();
                today.setHours(0,0,0,0);
                
                const isPast = date < today;
                
                const isCheckIn = checkInDate?.toISOString().split('T')[0] === dateStr;
                const isCheckOut = checkOutDate?.toISOString().split('T')[0] === dateStr;
                const inRange = isDateInRange(date);

                let cellClass = `p-2 rounded-lg text-sm transition-all `;
                
                if (isPast) {
                  cellClass += isDark ? 'text-slate-700' : 'text-slate-300';
                } else if (isCheckIn || isCheckOut) {
                  cellClass += 'bg-amber-400 text-blue-950 font-bold';
                } else if (inRange) {
                  cellClass += 'bg-amber-200/50 text-amber-800 dark:text-amber-200';
                } else {
                  cellClass += `cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
                }

                return (
                  <button
                    key={i}
                    disabled={isPast}
                    onClick={() => handleDateClick(date)}
                    className={cellClass}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-xs">
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                <strong>Tip:</strong> Klik tanggal untuk Check-In, lalu klik tanggal lain untuk Check-Out.
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className={`md:col-span-7 rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-[#0b1329]' : 'bg-white'}`}>
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-amber-300" /> Form Reservasi Kamar
              </h3>
            </div>
            
            <div className="p-6 sm:p-8">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Reservasi Berhasil Diajukan!
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Alhamdulillah, pesanan kamar untuk tanggal <strong className={isDark ? 'text-amber-400' : 'text-blue-600'}>{checkInDate?.toLocaleDateString('id-ID')} - {checkOutDate?.toLocaleDateString('id-ID')}</strong> telah kami terima. Tim Admin akan segera menghubungi Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setCheckInDate(null);
                      setCheckOutDate(null);
                      setFormData({ name: '', whatsapp: '', roomType: 'standard', notes: '' });
                    }}
                    className="mt-4 bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-xl font-bold text-sm transition-colors"
                  >
                    Buat Reservasi Baru
                  </button>
                </div>
              ) : (
                <form 
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!checkInDate || !checkOutDate) {
                      alert('Silakan pilih tanggal Check-In dan Check-Out di kalender.');
                      return;
                    }
                    setIsSubmitting(true);
                    setTimeout(() => {
                      addKamarBooking({
                        ...formData,
                        date: checkInDate.toISOString().split('T')[0],
                        checkoutDate: checkOutDate.toISOString().split('T')[0],
                        status: 'pending'
                      });
                      setIsSubmitting(false);
                      setSubmitSuccess(true);
                    }, 1000);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Lengkap</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Nama Anda"
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No. WhatsApp</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          required
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                          placeholder="0812..."
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipe Kamar</label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      {ROOM_TYPES.map(rt => (
                        <option key={rt.id} value={rt.name}>{rt.name} - {rt.price}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Check-In</label>
                      <input 
                        type="text" 
                        readOnly
                        value={checkInDate ? checkInDate.toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none font-medium ${
                          isDark ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-blue-700'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Check-Out</label>
                      <input 
                        type="text" 
                        readOnly
                        value={checkOutDate ? checkOutDate.toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none font-medium ${
                          isDark ? 'bg-slate-800/50 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-blue-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tujuan Menginap / Catatan Tambahan</label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Contoh: Mengikuti Kajian Subuh, Transit ziarah, dll..."
                      className={`w-full px-4 py-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !checkInDate || !checkOutDate}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2"
                  >
                    {isSubmitting ? 'Mengirim Data...' : 'Ajukan Reservasi Kamar'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
