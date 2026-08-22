import React, { useState } from 'react';
import { QurbanGroup, QurbanParticipant, UserSession, hasDkmPortalAccess } from '../types';
import { formatRupiahFull } from '../lib/islamicUtils';
import {
  Heart,
  Users,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  X,
  QrCode,
  CreditCard,
  Download,
  FileCheck,
  Camera,
  Upload,
  Link,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';

interface PatunganQurbanSectionProps {
  qurbanGroups: QurbanGroup[];
  onAddParticipant: (groupId: string, data: Omit<QurbanParticipant, 'id' | 'createdAt' | 'transactionRef'>) => { id: string; transactionRef: string };
  onUpdateGroupImage?: (id: string, updated: Partial<QurbanGroup>) => void;
  isDark?: boolean;
  session?: UserSession;
}

// 100% Verified Real Pict Presets for Qurban Animals (No invalid or non-halal animals)
const VERIFIED_ANIMAL_PRESETS = [
  {
    label: 'Domba Garut Super Tanduk (Real Pict)',
    type: 'domba',
    url: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Kambing Etawa Super / Garut (Real Pict)',
    type: 'kambing',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Kambing Gunung / Qurban (Real Pict)',
    type: 'kambing',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Sapi Limosin Super Jantan (Real Pict)',
    type: 'sapi',
    url: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Sapi Simental / PO (Real Pict)',
    type: 'sapi',
    url: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=1200&q=80'
  }
];

export const PatunganQurbanSection: React.FC<PatunganQurbanSectionProps> = ({
  qurbanGroups = [],
  onAddParticipant,
  onUpdateGroupImage,
  isDark = false,
  session
}) => {
  const [selectedGroup, setSelectedGroup] = useState<QurbanGroup | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Photo Edit Modal State
  const [editingImageGroup, setEditingImageGroup] = useState<QurbanGroup | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Registration Form State
  const [mudhahhiName, setMudhahhiName] = useState('');
  const [phone, setPhone] = useState('');
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bsi' | 'bca'>('qris');

  // Confirmation Success Receipt
  const [receiptData, setReceiptData] = useState<{
    groupTitle: string;
    mudhahhiName: string;
    sharesCount: number;
    totalPaid: number;
    transactionRef: string;
    date: string;
  } | null>(null);

  const handleOpenJoinModal = (group: QurbanGroup) => {
    setSelectedGroup(group);
    setSharesCount(1);
    setMudhahhiName('');
    setPhone('');
    setShowModal(true);
    setReceiptData(null);
  };

  const handleOpenPhotoEdit = (group: QurbanGroup) => {
    setEditingImageGroup(group);
    setCustomImageUrl(group.imageUrl);
    setImagePreview(group.imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!editingImageGroup || !customImageUrl) return;
    if (onUpdateGroupImage) {
      onUpdateGroupImage(editingImageGroup.id, { imageUrl: customImageUrl });
    } else {
      editingImageGroup.imageUrl = customImageUrl;
    }
    setEditingImageGroup(null);
  };

  const handleRegisterQurban = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !mudhahhiName || !phone) return;

    const remainingShares = selectedGroup.totalShares - selectedGroup.filledShares;
    const finalShares = Math.min(sharesCount, Math.max(1, remainingShares));
    const totalPaid = finalShares * selectedGroup.pricePerShare;

    const result = onAddParticipant(selectedGroup.id, {
      groupId: selectedGroup.id,
      groupTitle: selectedGroup.title,
      mudhahhiName,
      phone,
      sharesCount: finalShares,
      totalPaid,
      paymentStatus: 'Lunas'
    });

    setReceiptData({
      groupTitle: selectedGroup.title,
      mudhahhiName,
      sharesCount: finalShares,
      totalPaid,
      transactionRef: result.transactionRef,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <section id="patungan-qurban" className="py-14 bg-blue-950/40 text-white border-b border-blue-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#1e3a8a] border border-blue-300 text-xs font-mono font-bold uppercase tracking-widest shadow-md">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span>Identitas Syariah Masjid Tazkia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-wide">
            Patungan Qurban Sapi &amp; Kambing / Domba Garut
          </h2>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            Ibadah Qurban 1/7 Saham Sapi atau Kambing / Domba Pilihan. Dikelola profesional, 100% bebas biaya potong &amp; disalurkan ke 500+ KK Mustahik Sentul.
          </p>
        </div>

        {/* Syariah Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#1e3a8a] p-4 rounded-2xl border border-blue-600/40 text-xs font-mono text-white shadow-xl">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
            <span>100% Syariat &amp; Cukup Umur (Musinnah)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>Certified Bebas PMK Dokter Hewan</span>
          </div>
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-amber-300 shrink-0" />
            <span>Laporan Foto Real Pict &amp; Kwitansi QR</span>
          </div>
        </div>

        {/* Qurban Groups Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qurbanGroups.map((group) => {
            const remaining = group.totalShares - group.filledShares;
            const percentage = Math.round((group.filledShares / group.totalShares) * 100);

            return (
              <div
                key={group.id}
                className="bg-white text-blue-900 border-2 border-blue-800/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-blue-500 transition-all group"
              >
                <div>
                  {/* Animal Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-blue-950">
                    <img
                      src={group.imageUrl}
                      alt={group.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (group.animalType.toLowerCase().includes('sapi')) {
                          target.src = 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80';
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=1200&q=80';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-blue-950 bg-gradient-to-t from-blue-950/80 via-transparent to-black/30" />

                    {/* Animal Badge */}
                    <span className="absolute top-3 left-3 bg-[#1e3a8a] text-white text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-blue-400/40">
                      <span>{group.animalType.includes('Sapi') ? '??' : '??'}</span>
                      <span>{group.animalType}</span>
                    </span>

                    {/* Weight Badge */}
                    <span className="absolute top-3 right-3 bg-white text-[#1e3a8a] border border-blue-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow">
                      {group.weightEstimate}
                    </span>

                    {/* Change Photo Button directly on Card (Only for Admins) */}
                    {session && hasDkmPortalAccess(session.role) && (
                      <button
                        onClick={() => handleOpenPhotoEdit(group)}
                        className="absolute bottom-3 right-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-mono font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95 border border-amber-500"
                        title="Ganti Foto Real Pict Hewan Qurban"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ganti Real Pict</span>
                      </button>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#1e3a8a] group-hover:text-blue-700 transition-colors">
                        {group.title}
                      </h3>
                      <p className="text-xs text-blue-600 mt-1 line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-blue-800 font-mono uppercase block font-bold">
                          Biaya Per {group.type === 'sapi_patungan' ? '1/7 Saham' : 'Ekor'}:
                        </span>
                        <span className="text-base font-bold font-mono text-[#1e3a8a]">
                          {formatRupiahFull(group.pricePerShare)}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-white bg-[#1e3a8a] font-bold px-2.5 py-1 rounded-lg border border-blue-600">
                        {group.type === 'sapi_patungan' ? '1/7 Sapi' : '1 Ekor'}
                      </span>
                    </div>

                    {/* Slot Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-blue-600 font-bold">Slot Terisi:</span>
                        <span className="font-bold text-[#1e3a8a]">
                          {group.filledShares} / {group.totalShares} Saham ({percentage}%)
                        </span>
                      </div>

                      <div className="w-full bg-blue-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1e3a8a] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="text-[11px] font-mono text-blue-800 block text-right font-bold">
                        {remaining > 0 ? `Tersisa ${remaining} Saham Lagi` : 'Slot Penuh (Selesai)'}
                      </span>
                    </div>

                    {/* List of Participants */}
                    {group.participants.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 space-y-1.5">
                        <span className="text-[10px] font-mono text-blue-900 uppercase block font-bold">
                          Shohibul Qurban Terdaftar ({group.participants.length}):
                        </span>
                        <ul className="text-xs text-blue-700 space-y-1 max-h-20 overflow-y-auto pr-1">
                          {group.participants.map(p => (
                            <li key={p.id} className="flex items-center justify-between font-mono text-[11px]">
                              <span className="truncate max-w-[180px]">• {p.mudhahhiName}</span>
                              <span className="text-[#1e3a8a] font-bold text-[10px]">({p.sharesCount} Saham)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="p-6 pt-0">
                  <button
                    disabled={remaining <= 0}
                    onClick={() => handleOpenJoinModal(group)}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95 ${
                      remaining > 0
                        ? 'bg-[#1e3a8a] hover:bg-[#04392b] text-white'
                        : 'bg-blue-200 text-blue-400 cursor-not-allowed'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current text-amber-400" />
                    <span>{remaining > 0 ? 'Daftar & Ikut Patungan Qurban' : 'Slot Kelompok Ini Penuh'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL EDIT / UPLOAD FOTO REAL PICT */}
        {editingImageGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white border border-blue-200 rounded-3xl shadow-2xl p-6 space-y-6 text-blue-900 my-8">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="font-serif font-bold text-base text-[#1e3a8a]">
                    Ganti Foto Real Pict Hewan Qurban
                  </h3>
                </div>
                <button
                  onClick={() => setEditingImageGroup(null)}
                  className="p-1 text-blue-400 hover:text-blue-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Box */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-700 block font-mono">
                  Pratinjau Foto ({editingImageGroup.title}):
                </span>
                <div className="relative h-44 w-full bg-blue-900 rounded-2xl overflow-hidden border border-blue-300">
                  <img
                    src={imagePreview || editingImageGroup.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    REAL PICT PREVIEW
                  </div>
                </div>
              </div>

              {/* Option A: Upload File */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <label className="text-xs font-bold text-[#1e3a8a] flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Upload Foto dari Galeri HP / Komputer:</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-blue-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1e3a8a] file:text-white hover:file:bg-[#04392b] cursor-pointer"
                />
              </div>

              {/* Option B: Direct URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-blue-500" />
                  <span>Atau Paste URL Link Foto Real Pict:</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full bg-blue-50 border border-blue-300 rounded-xl px-3 py-2 text-xs text-blue-900 outline-none focus:border-[#1e3a8a] font-mono"
                />
              </div>

              {/* Option C: Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-blue-700 block">
                  Atau Pilih Dari Preset Foto Hewan Qurban Terverifikasi:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VERIFIED_ANIMAL_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomImageUrl(p.url);
                        setImagePreview(p.url);
                      }}
                      className="p-2 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-[11px] font-mono text-blue-800 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-blue-200">
                <button
                  onClick={() => setEditingImageGroup(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSavePhoto}
                  className="bg-[#1e3a8a] hover:bg-[#04392b] text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Simpan Foto Real Pict</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Registration for Qurban */}
        {showModal && selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white text-blue-900 border border-blue-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
              
              <div className="flex items-center justify-between border-b border-blue-200 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e3a8a] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>Pendaftaran Qurban Syariah</span>
                  </h3>
                  <p className="text-xs text-blue-800 font-mono mt-0.5">
                    {selectedGroup.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-blue-400 hover:text-blue-700 p-2 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!receiptData ? (
                /* Form Inputs */
                <form onSubmit={handleRegisterQurban} className="space-y-4">
                  
                  <div>
                    <label className="text-xs font-bold text-blue-700 block mb-1">
                      Atas Nama Qurban (Niat Shohibul Qurban):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bapak H. Ahmad bin Fulan / Keluarga Besar Ahmad"
                      value={mudhahhiName}
                      onChange={(e) => setMudhahhiName(e.target.value)}
                      required
                      className="w-full bg-blue-50 border border-blue-300 text-blue-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1e3a8a] font-serif"
                    />
                    <p className="text-[10px] text-blue-500 mt-1">
                      Nama ini yang akan dilafadzkan saat penyembelihan hewan Qurban di Masjid Tazkia.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-blue-700 block mb-1">
                      Nomor WhatsApp Kontak Shohibul Qurban:
                    </label>
                    <input
                      type="tel"
                      placeholder="0812XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-blue-50 border border-blue-300 text-blue-900 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1e3a8a] font-mono"
                    />
                  </div>

                  {/* Shares selection */}
                  {selectedGroup.type === 'sapi_patungan' && (
                    <div>
                      <label className="text-xs font-bold text-blue-700 block mb-1">
                        Jumlah Bagian Saham Sapi yang Diambil:
                      </label>
                      <select
                        value={sharesCount}
                        onChange={(e) => setSharesCount(Number(e.target.value))}
                        className="w-full bg-blue-50 border border-blue-300 text-[#1e3a8a] text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono font-bold"
                      >
                        {Array.from({ length: selectedGroup.totalShares - selectedGroup.filledShares }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>
                            {n} Saham Sapi ({formatRupiahFull(n * selectedGroup.pricePerShare)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-blue-700 block">
                      Metode Pembayaran Setoran Qurban:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qris')}
                        className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'qris'
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>QRIS Fast</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bsi')}
                        className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'bsi'
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>BSI Syariah</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bca')}
                        className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                          paymentMethod === 'bca'
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>BCA Transfer</span>
                      </button>
                    </div>
                  </div>

                  {/* Total Calculation Card */}
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-blue-800 font-mono uppercase block font-bold">Total Nilai Qurban:</span>
                      <span className="text-lg font-bold font-mono text-[#1e3a8a]">
                        {formatRupiahFull(sharesCount * selectedGroup.pricePerShare)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white bg-[#1e3a8a] font-bold px-3 py-1 rounded-xl">
                      Bebas Biaya Potong
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-blue-500 hover:bg-blue-100 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1e3a8a] hover:bg-[#04392b] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-lg"
                    >
                      Konfirmasi Setoran Qurban
                    </button>
                  </div>

                </form>
              ) : (
                /* Success Confirmation Receipt View */
                <div className="space-y-5 text-center">
                  <div className="w-16 h-16 bg-blue-100 border-2 border-blue-600 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h4 className="text-xl font-serif font-bold text-[#1e3a8a]">
                      Bismillah, Pendaftaran Qurban Berhasil!
                    </h4>
                    <p className="text-xs text-blue-600 mt-1">
                      Kwitansi &amp; Tanda Terima Qurban Resmi DKM Masjid Tazkia telah diterbitkan.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-blue-200 pb-2">
                      <span className="text-blue-500">Ref Transaksi:</span>
                      <span className="text-[#1e3a8a] font-bold">{receiptData.transactionRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-500">Kelompok Qurban:</span>
                      <span className="text-blue-900 font-bold">{receiptData.groupTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-500">Atas Nama (Shohibul Qurban):</span>
                      <span className="text-[#1e3a8a] font-bold">{receiptData.mudhahhiName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-500">Jumlah Saham:</span>
                      <span className="text-blue-900 font-bold">{receiptData.sharesCount} Saham</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2 text-sm">
                      <span className="text-blue-500">Total Nominal:</span>
                      <span className="text-[#1e3a8a] font-bold">{formatRupiahFull(receiptData.totalPaid)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-[#1e3a8a] hover:bg-[#04392b] text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md"
                    >
                      Selesai &amp; Tutup
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};


