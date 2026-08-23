import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useMasjidStore } from '../lib/store';

interface KalenderKegiatanSectionProps {
  isDark?: boolean;
}

export const KalenderKegiatanSection: React.FC<KalenderKegiatanSectionProps> = ({
  isDark = false
}) => {
  const { state } = useMasjidStore();
  const agendas = state.agendas || [];
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Registration Modal State
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', whatsapp: '', email: '' });
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgenda || !regForm.name || !regForm.whatsapp) return;
    
    if (state.addAgendaRegistration) {
      state.addAgendaRegistration({
        agendaId: selectedAgenda.id,
        name: regForm.name,
        whatsapp: regForm.whatsapp,
        email: regForm.email
      });
      alert('Pendaftaran berhasil! Terimakasih telah mendaftar.');
    } else {
      alert('Fitur pendaftaran sedang dalam pembaruan sistem.');
    }
    
    setShowRegModal(false);
    setRegForm({ name: '', whatsapp: '', email: '' });
  };


  // Helper functions for calendar
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfMonth(year, month); // 0 (Sun) to 6 (Sat)
  
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get agendas for current month
  const currentMonthAgendas = agendas.filter(agenda => {
    const agendaDate = new Date(agenda.date);
    return agendaDate.getFullYear() === year && agendaDate.getMonth() === month;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Dates that have events in current month
  const eventDays = currentMonthAgendas.map(agenda => new Date(agenda.date).getDate());

  const renderCalendar = () => {
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const currentDay = today.getDate();

  
  const renderRegistrationModal = () => {
    if (!showRegModal || !selectedAgenda) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
          {/* Left Side: Agenda Info */}
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <h2 className={`text-2xl font-bold font-serif mb-2 ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
              {selectedAgenda.title}
            </h2>
            {selectedAgenda.speaker && (
              <p className={`text-lg mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {selectedAgenda.speaker}
              </p>
            )}
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Tanggal</p>
                  <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {new Date(selectedAgenda.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Waktu</p>
                  <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {selectedAgenda.time} WIB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Lokasi</p>
                  <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {selectedAgenda.location}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Detail Acara</h4>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedAgenda.description}
              </p>
            </div>
          </div>
          
          {/* Right Side: Registration Form */}
          <div className="w-full md:w-1/2 p-8 relative">
            <button 
              onClick={() => setShowRegModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Daftar Sekarang</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Amankan kuota Anda dengan mengisi formulir di bawah ini.
              </p>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  NAMA LENGKAP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTP"
                  value={regForm.name}
                  onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  NO. WHATSAPP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812..."
                  value={regForm.whatsapp}
                  onChange={(e) => setRegForm({...regForm, whatsapp: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  EMAIL (opsional)
                </label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                Kirim Pendaftaran
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
      <div className={`p-6 rounded-3xl shadow-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
            <div key={day} className="text-xs font-bold text-slate-400 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === currentDay;
            const hasEvent = eventDays.includes(day);

            return (
              <button
                key={day}
                onClick={() => {
                  const dayAgendas = currentMonthAgendas.filter(a => new Date(a.date).getDate() === day);
                  if (dayAgendas.length > 0) {
                    alert(`Terdapat ${dayAgendas.length} agenda pada tanggal ${day} ${monthNames[month]} ${year}`);
                  }
                }}
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer hover:scale-105 active:scale-95
                  ${isToday ? 'bg-blue-600 text-white shadow-md font-bold' : ''}
                  ${hasEvent && !isToday ? (isDark ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-700 border border-blue-200') : ''}
                  ${!isToday && !hasEvent ? (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100') : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 text-[10px] sm:text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-slate-300"></div> Tersedia</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-100 border border-blue-300"></div> Ada Event</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Hari Ini</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={`min-h-screen ${isDark ? 'bg-[#0a1128]' : 'bg-slate-50'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Side */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            {renderCalendar()}
          </div>

          {/* Agenda List Side */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className={`text-xl font-bold font-serif mb-6 ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
              Agenda Mendatang ({monthNames[month]} {year})
            </h2>

            <div className="space-y-4">
              {currentMonthAgendas.map((agenda) => (
                <div key={agenda.id} className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    
                    {/* Image / Date Badge */}
                    <div className="flex-shrink-0 w-32 h-28 rounded-xl border border-blue-100 overflow-hidden shadow-sm relative group bg-blue-50">
                      {agenda.imageUrl ? (
                        <img src={agenda.imageUrl} alt={agenda.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-300">
                          <CalendarIcon size={32} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-center shadow-sm">
                        <span className="block text-xs font-bold text-blue-900 leading-none">
                          {agenda.date.split('-')[2]}
                        </span>
                        <span className="block text-[9px] font-semibold text-blue-700 uppercase">
                          {monthNames[parseInt(agenda.date.split('-')[1]) - 1].substring(0, 3)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                        {agenda.category}
                      </div>
                      <h3 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
                        {agenda.title} {agenda.speaker ? `| ${agenda.speaker}` : ''}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{agenda.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{agenda.location}</span>
                        </div>
                      </div>

                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {agenda.description}
                      </p>

                      <div className="pt-2">
                        {(agenda as any).requiresRegistration || agenda.category === 'Kajian' || agenda.category === 'Kegiatan' ? (
                          <button
                            onClick={() => {
                              setSelectedAgenda(agenda);
                              setShowRegModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                          >
                            Detail & Daftar
                          </button>
                        ) : null}
                      </div>

                    </div>

                  </div>
                </div>
              ))}

              {currentMonthAgendas.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  Belum ada agenda yang dijadwalkan pada bulan {monthNames[month]}.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {renderRegistrationModal()}
    </section>
  );
};
