import React, { useState } from 'react';
import { AL_MATSURAT_DATA, AlMatsuratItem } from '../data/alMatsuratData';
import { BookOpen, Sun, Moon, CheckCircle2, RotateCcw } from 'lucide-react';

export const AlMatsurat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pagi' | 'petang' | null>(null);
  const [lastDzikir, setLastDzikir] = useState<string | null>(() => {
    return localStorage.getItem('lastDzikirDate');
  });
  
  // Initialize counters for all items based on their required count
  const [counters, setCounters] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    AL_MATSURAT_DATA.forEach(item => {
      initial[item.id] = 0;
    });
    return initial;
  });

  const getFilteredData = () => {
    return AL_MATSURAT_DATA.filter(item => item.type === 'keduanya' || item.type === activeTab);
  };

  const handleIncrement = (id: string, maxCount: number) => {
    setCounters(prev => {
      const current = prev[id] || 0;
      if (current < maxCount) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = (id: string) => {
    setCounters(prev => ({ ...prev, [id]: 0 }));
  };

  const calculateProgress = () => {
    const data = getFilteredData();
    let totalTarget = 0;
    let totalCurrent = 0;
    
    data.forEach(item => {
      totalTarget += item.count;
      totalCurrent += (counters[item.id] || 0);
    });
    
    return totalTarget === 0 ? 0 : Math.round((totalCurrent / totalTarget) * 100);
  };

  const progress = calculateProgress();

  // Save last dzikir when progress reaches 100%
  React.useEffect(() => {
    if (progress === 100 && activeTab) {
      const now = new Date();
      const dateString = `${now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} pukul ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
      localStorage.setItem('lastDzikirDate', dateString);
      setLastDzikir(dateString);
    }
  }, [progress, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header & Progress */}
      <div className="bg-emerald-900 border border-emerald-800 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen className="w-48 h-48 transform rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              Dzikir Harian
            </h2>
            <p className="text-emerald-100/80 text-sm max-w-md leading-relaxed">
              Kumpulan doa dan dzikir pagi & petang harian untuk ketenangan dan perlindungan diri. Rutinkan membacanya setiap hari.
            </p>
            {lastDzikir && (
              <div className="mt-3 inline-block bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white">
                <span className="opacity-80">Terakhir Dzikir:</span> <strong className="text-amber-300">{lastDzikir}</strong>
              </div>
            )}
          </div>
          
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto md:min-w-[200px]">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-emerald-100">Progres Membaca</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Pagi/Petang */}
      <div className="flex p-1.5 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('pagi')}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            activeTab === 'pagi' 
              ? 'bg-white text-emerald-700 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sun className={`w-4 h-4 ${activeTab === 'pagi' ? 'text-amber-500' : ''}`} />
          Dzikir Pagi
        </button>
        <button
          onClick={() => setActiveTab('petang')}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            activeTab === 'petang' 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Moon className={`w-4 h-4 ${activeTab === 'petang' ? 'text-blue-300' : ''}`} />
          Dzikir Petang
        </button>
      </div>

      {/* List Dzikir */}
      <div className="space-y-6">
        {!activeTab ? (
          <div className="bg-white/50 border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">Pilih Waktu Dzikir</h3>
            <p className="text-gray-500 text-sm">Klik tombol Dzikir Pagi atau Dzikir Petang di atas untuk mulai membaca.</p>
          </div>
        ) : (
          getFilteredData().map((item, index) => {
            const currentCount = counters[item.id] || 0;
            const isDone = currentCount >= item.count;
          
          return (
            <div key={item.id} className={`bg-white p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
              isDone ? 'border-emerald-200 shadow-emerald-100/50 shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'
            }`}>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    {item.title && (
                      <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                    )}
                    {item.reference && (
                      <span className="text-[10px] text-gray-500 font-mono mt-0.5">{item.reference}</span>
                    )}
                  </div>
                </div>
                {isDone && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selesai
                  </span>
                )}
              </div>

              {/* Teks Arab */}
              <div className="mb-8 text-right">
                <p className="font-arabic text-2xl sm:text-3xl leading-[2.5] text-gray-900" dir="rtl">
                  {item.arabic}
                </p>
              </div>

              {/* Teks Latin */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm font-medium text-emerald-700 leading-relaxed italic">
                  {item.latin}
                </p>
              </div>

              {/* Terjemahan */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{item.translation}"
                </p>
              </div>

              {/* Counter Action */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Dibaca</span>
                  <span className="font-mono font-bold text-gray-800">{currentCount} / {item.count} Kali</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {currentCount > 0 && (
                    <button
                      onClick={() => handleReset(item.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Ulangi"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleIncrement(item.id, item.count)}
                    disabled={isDone}
                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${
                      isDone 
                        ? 'bg-emerald-100 text-emerald-500 cursor-not-allowed opacity-50' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {isDone ? 'Selesai' : 'Hitung (+1)'}
                  </button>
                </div>
              </div>
              
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};
