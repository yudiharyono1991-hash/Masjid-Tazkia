import React, { useState, useMemo } from 'react';
import { Program, ProgramCategory, AppAdminSettings } from '../types';
import { formatRupiah, formatRupiahFull } from '../lib/islamicUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import {
  HeartHandshake,
  Users,
  Flame,
  Building2,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  PieChart,
  CheckCircle2,
  ArrowRight,
  FileText
} from 'lucide-react';

interface ProgramCardsSectionProps {
  programs: Program[];
  openDonationForProgram: (program?: Program | string) => void;
  onSelectProgramDetail?: (program: Program) => void;
  totalCollected: number;
  activeDonors: number;
  totalDisbursed: number;
  efficiencyRate: number;
  openDonationModal: (category?: string) => void;
  openCalculator: () => void;
  openCatalogPdf?: () => void;
  isDark?: boolean;
  adminSettings?: AppAdminSettings;
  hideHeader?: boolean;
}

export const ProgramCardsSection: React.FC<ProgramCardsSectionProps> = ({
  programs,
  openDonationForProgram,
  onSelectProgramDetail,
  totalCollected,
  activeDonors,
  totalDisbursed,
  efficiencyRate,
  openDonationModal,
  openCalculator,
  openCatalogPdf,
  isDark = false,
  adminSettings,
  hideHeader = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = programs.filter(prog => {
    const matchesCategory = selectedCategory === 'semua' || prog.category === selectedCategory;
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate statistics for the chart
  const chartData = useMemo(() => {
    const categories = ['zakat', 'infaq', 'wakaf'];
    const data = categories.map(cat => {
      return programs
        .filter(p => p.category === cat)
        .reduce((sum, p) => sum + p.collectedAmount, 0);
    });

    return {
      labels: ['Zakat Maal', 'Infaq & Shadaqah', 'Wakaf Produktif'],
      datasets: [
        {
          label: 'Total Perolehan (Rp)',
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)', // blue-500
            'rgba(16, 185, 129, 0.85)', // emerald-500
            'rgba(245, 158, 11, 0.85)', // amber-500
          ],
          borderColor: [
            'rgb(37, 99, 235)',
            'rgb(5, 150, 105)',
            'rgb(217, 119, 6)',
          ],
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.6,
          hoverBackgroundColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(5, 150, 105, 1)',
            'rgba(217, 119, 6, 1)',
          ]
        },
      ],
    };
  }, [programs]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#94a3b8' : '#64748b',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 13,
          weight: 'normal' as const
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 15,
          weight: 'bold' as const
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          maxRotation: 0,
          minRotation: 0,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            weight: 'bold' as const,
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 10000000,
        border: {
          display: false
        },
        grid: {
          color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)',
          drawTicks: false,
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          padding: 10,
          callback: function(value: any) {
            if (value >= 1000000000) {
              return 'Rp ' + (value / 1000000000) + ' M';
            }
            if (value >= 1000000) {
              return 'Rp ' + (value / 1000000) + ' Jt';
            }
            return 'Rp ' + value;
          }
        }
      }
    }
  };

  return (
    <section id="ziswaf-section" className={`py-16 border-b transition-colors ${isDark ? "bg-blue-950 text-blue-100 border-blue-800" : "bg-stone-50 text-blue-900 border-blue-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Program Cards Start Directly Below Hero */}
        {!hideHeader && (
          <div className="text-center pt-8 pb-4">
            <h2 className={`text-2xl sm:text-3xl font-serif transition-colors ${isDark ? "text-white" : "text-blue-950"}`}>
              Daftar Program
            </h2>
          </div>
        )}

        {/* ZISWAF Statistics Chart */}
        <div className={`p-6 rounded-2xl border shadow-sm transition-colors mb-8 ${isDark ? "bg-blue-900/50 border-blue-800" : "bg-white border-blue-200"}`}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className={`w-5 h-5 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
            <h3 className={`font-bold font-serif ${isDark ? "text-white" : "text-blue-950"}`}>
              Grafik Statistik Perolehan ZISWAF
            </h3>
          </div>
          <div className="h-64 w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl border transition-colors ${isDark ? "bg-blue-950/80 border-blue-800" : "bg-white border-blue-200 shadow-sm"}`}>
          <div className="relative w-full sm:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <input
              type="text"
              placeholder="Cari program donasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isDark ? "bg-blue-900 border-blue-800 focus:border-amber-400 text-white" : "bg-stone-50 border-blue-200 focus:border-blue-500 text-blue-900"}`}
            />
          </div>
          
          <div className="w-full sm:w-1/3 flex justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full sm:w-auto border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer appearance-none transition-colors ${isDark ? "bg-blue-900 border-blue-800 focus:border-amber-400 text-white" : "bg-stone-50 border-blue-200 focus:border-blue-500 text-blue-900"}`}
            >
              <option value="semua">Semua Kategori</option>
              <option value="infaq">Infaq & Shadaqah</option>
              <option value="wakaf">Wakaf Produktif</option>
              <option value="zakat">Zakat Maal</option>
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(prog => {
            const percentage = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));

            return (
              <div
                key={prog.id}
                className={`border rounded-2xl overflow-hidden transition-all flex flex-col group shadow-md ${isDark ? "bg-blue-900/90 border-blue-800 hover:border-blue-400/60" : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg"}`}
              >
                {/* Image Banner */}
                <div 
                  onClick={() => onSelectProgramDetail && onSelectProgramDetail(prog)}
                  className="relative h-48 overflow-hidden bg-blue-950 cursor-pointer"
                >
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-950 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent" />

                  {/* Badge Category */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow">
                      {prog.category}
                    </span>
                    {prog.isUrgent && (
                      <span className="bg-rose-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3" /> Urgent
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                      {prog.subtitle}
                    </span>
                    <h3 
                      onClick={() => onSelectProgramDetail && onSelectProgramDetail(prog)}
                      className={`text-lg font-serif font-bold mt-1 transition-colors line-clamp-2 cursor-pointer ${isDark ? "text-white group-hover:text-blue-300" : "text-blue-950 group-hover:text-blue-600"}`}
                    >
                      {prog.title}
                    </h3>
                    <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                      {prog.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectProgramDetail && onSelectProgramDetail(prog)}
                      className="mt-2 text-[11px] text-blue-300 font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Rincian Program Lengkap</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress Bar & Amount */}
                  <div className="space-y-3 pt-3 border-t border-blue-800">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span className="text-blue-400">Terkumpul</span>
                        <span className="text-amber-400">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-950 rounded-full h-2 overflow-hidden border border-blue-800">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-blue-400 font-bold">Terkumpul:</p>
                        <p className={`font-bold font-mono text-sm ${isDark ? "text-white" : "text-blue-950"}`}>
                          {formatRupiah(prog.collectedAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono uppercase tracking-wider text-blue-400 font-bold">Target:</p>
                        <p className={`font-mono text-xs font-bold ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                          {formatRupiah(prog.targetAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Donors Count */}
                    <div className={`flex items-center justify-between text-xs pt-1 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{(prog.donorsCount || 0).toLocaleString('id-ID')} Donatur</span>
                      </div>
                      <span className="text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-amber-300" /> Verifikasi DKM
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => openDonationForProgram(prog)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-2 border border-blue-400/30"
                    >
                      <HeartHandshake className="w-4 h-4 text-amber-300" />
                      <span>Bayar Sekarang</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

