import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Info } from 'lucide-react';
import { JamaahCalendarNote } from '../types';
import { useMasjidStore } from '../lib/store';

interface JamaahCalendarProps {
  notes: JamaahCalendarNote[];
  onAddNote: (note: Omit<JamaahCalendarNote, 'id'>) => void;
  onRemoveNote: (id: string) => void;
  jamaahId: string;
}

// Data statis sebagai fallback awal
const FALLBACK_HOLIDAYS: Record<string, string> = {
  '2026-01-01': 'Tahun Baru Masehi',
  '2026-03-20': 'Hari Raya Idul Fitri',
  '2026-08-17': 'Hari Kemerdekaan RI'
};

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export const JamaahCalendar: React.FC<JamaahCalendarProps> = ({ notes, onAddNote, onRemoveNote, jamaahId }) => {
  const { adminSettings } = useMasjidStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteType, setNewNoteType] = useState<'puasa' | 'kajian' | 'pribadi' | 'lainnya'>('pribadi');
  const [holidays, setHolidays] = useState<Record<string, string>>(FALLBACK_HOLIDAYS);

  React.useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentDate.getFullYear()}/ID`);
        if (response.ok) {
          const data = await response.json();
          const holidayMap: Record<string, string> = {};
          data.forEach((h: any) => {
            holidayMap[h.date] = h.localName;
          });
          setHolidays(holidayMap);
        }
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };
    fetchHolidays();
  }, [currentDate.getFullYear()]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust so Monday is 0
  };

  const toISODate = (date: Date) => {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0]
  };

  const getHijriDate = (date: Date) => {
    const offsetDays = adminSettings?.hijriOffsetDays || 0;
    const offsetDate = new Date(date.getTime() + (offsetDays * 24 * 60 * 60 * 1000));
    return new Intl.DateTimeFormat('id-u-ca-islamic', {day: 'numeric', month: 'short'}).format(offsetDate);
  };

  const getHijriMonthYear = (date: Date) => {
    const offsetDays = adminSettings?.hijriOffsetDays || 0;
    const offsetDate = new Date(date.getTime() + (offsetDays * 24 * 60 * 60 * 1000));
    return new Intl.DateTimeFormat('id-u-ca-islamic', {month: 'long', year: 'numeric'}).format(offsetDate).replace(' AH', ' H').replace(' H', ' H');
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const handleAddNote = () => {
    if (!selectedDate || !newNoteTitle.trim()) return;
    onAddNote({
      jamaahId,
      date: toISODate(selectedDate),
      title: newNoteTitle,
      type: newNoteType
    });
    setNewNoteTitle('');
    setShowNoteForm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <h3 className="font-bold font-serif flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-400" />
          Kalender Pintar
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full transition"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm min-w-[100px] text-center">{MONTHS[month]} {year}</span>
            <span className="text-[10px] text-amber-300 font-serif">{getHijriMonthYear(currentDate)}</span>
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full transition"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {DAYS.map((day, idx) => (
            <div key={day} className={`text-xs font-bold ${idx >= 5 ? 'text-rose-500' : 'text-blue-900'}`}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-gray-50/50 rounded-xl" />;
            
            const dateStr = toISODate(date);
            const isToday = dateStr === toISODate(new Date());
            const isSelected = selectedDate && dateStr === toISODate(selectedDate);
            const holiday = holidays[dateStr];
            const isSunday = date.getDay() === 0;
            const dayNotes = notes.filter(n => n.date === dateStr && n.jamaahId === jamaahId);
            
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(date)}
                className={`h-16 sm:h-24 relative p-1 sm:p-2 border rounded-xl flex flex-col items-start transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : isToday ? 'border-amber-400 bg-amber-50' 
                  : 'border-gray-100 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex justify-between w-full items-start">
                  <span className={`text-sm sm:text-base font-bold ${holiday || isSunday ? 'text-rose-600' : isToday ? 'text-amber-600' : 'text-slate-700'}`}>
                    {date.getDate()}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-mono mt-0.5 leading-tight text-right w-full block sm:hidden">
                    {getHijriDate(date).split(' ')[0]}<br/>{getHijriDate(date).split(' ')[1]}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-600 font-mono mt-1 hidden sm:block text-right">
                    {getHijriDate(date)}
                  </span>
                </div>
                
                <div className="flex-1 w-full mt-1 overflow-hidden flex flex-col gap-0.5">
                  {holiday && (
                    <div className="text-[7px] sm:text-[9px] bg-rose-100 text-rose-700 px-1 py-0.5 rounded truncate font-bold w-full text-left" title={holiday}>
                      {holiday}
                    </div>
                  )}
                  {dayNotes.map(n => (
                    <div key={n.id} className="text-[7px] sm:text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate w-full text-left flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      {n.title}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {!selectedDate && (
          <div className="mt-6 text-center text-sm text-gray-500 bg-blue-50/50 py-4 rounded-xl border border-blue-100">
            <Info className="w-4 h-4 inline-block mr-1 text-blue-400" />
            Klik tanggal pada kalender untuk melihat atau menambahkan catatan pribadi, kajian, dll.
          </div>
        )}

        {selectedDate && (
          <div className="mt-6 border-t border-gray-100 pt-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg text-blue-950 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h4>
                <p className="text-sm text-emerald-600 font-bold mt-1">{getHijriDate(selectedDate)} Hijriah</p>
                {holidays[toISODate(selectedDate)] && (
                  <p className="text-sm text-rose-600 font-bold mt-1 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Libur: {holidays[toISODate(selectedDate)]}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowNoteForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition"
              >
                <Plus className="w-4 h-4" /> Catatan
              </button>
            </div>

            {showNoteForm && (
              <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100 flex flex-col gap-3">
                <input 
                  type="text" 
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  placeholder="Misal: Puasa Ayyamul Bidh / Kajian Fiqih"
                  className="w-full text-sm p-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 text-sm">
                  <label className="flex items-center gap-1"><input type="radio" checked={newNoteType === 'pribadi'} onChange={() => setNewNoteType('pribadi')} /> Pribadi</label>
                  <label className="flex items-center gap-1"><input type="radio" checked={newNoteType === 'puasa'} onChange={() => setNewNoteType('puasa')} /> Puasa</label>
                  <label className="flex items-center gap-1"><input type="radio" checked={newNoteType === 'kajian'} onChange={() => setNewNoteType('kajian')} /> Kajian</label>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setShowNoteForm(false)} className="text-xs text-gray-500 px-3 py-1 hover:bg-gray-200 rounded-lg">Batal</button>
                  <button onClick={handleAddNote} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 font-bold">Simpan</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {notes.filter(n => n.date === toISODate(selectedDate) && n.jamaahId === jamaahId).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Belum ada catatan.</p>
                  <p className="text-xs text-gray-400 mt-1">Anda dapat menambahkan jadwal kajian, puasa, atau aktivitas pribadi di sini.</p>
                </div>
              ) : (
                notes.filter(n => n.date === toISODate(selectedDate) && n.jamaahId === jamaahId).map(n => (
                  <div key={n.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg">
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${n.type === 'puasa' ? 'bg-amber-500' : n.type === 'kajian' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                        {n.title}
                      </h5>
                      <span className="text-xs text-gray-500 uppercase mt-1 inline-block bg-gray-200 px-1.5 py-0.5 rounded">{n.type}</span>
                    </div>
                    <button onClick={() => onRemoveNote(n.id)} className="text-gray-400 hover:text-rose-500 p-1 bg-white rounded-md shadow-sm border border-gray-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
