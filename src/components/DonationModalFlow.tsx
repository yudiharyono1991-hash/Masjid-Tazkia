import React, { useState, useEffect } from 'react';
import { Program, ProgramCategory, DonationRecord, AppAdminSettings, UserSession } from '../types';
import { formatRupiahFull } from '../lib/islamicUtils';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  HeartHandshake,
  QrCode,
  Building,
  Smartphone,
  Copy,
  Check,
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  Maximize2,
  Download,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

interface DonationModalFlowProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  initialCategory?: string;
  initialProgram?: Program;
  adminSettings?: AppAdminSettings;
  session?: UserSession | null;
  onCompleteDonation: (donation: Omit<DonationRecord, 'id' | 'createdAt'>) => DonationRecord;
}

export const DonationModalFlow: React.FC<DonationModalFlowProps> = ({
  isOpen,
  onClose,
  programs,
  initialCategory,
  initialProgram,
  adminSettings,
  session,
  onCompleteDonation
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>(
    (initialCategory as ProgramCategory) || 'infaq'
  );
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(initialProgram || null);

  // Peruntukan / Hal Infaq Specific
  const [infaqPurpose, setInfaqPurpose] = useState<string>('Infaq Operasional & Kebersihan Masjid');

  // Form Inputs
  const [amount, setAmount] = useState<number>(100000);
  const [customAmountText, setCustomAmountText] = useState<string>('100.000');
  const [donorName, setDonorName] = useState<string>(session?.name || '');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorPhone, setDonorPhone] = useState<string>(session?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS Nasional');
  const [recurringPeriod, setRecurringPeriod] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  const [proofUrl, setProofUrl] = useState<string>('');
  const [zoomQrisModal, setZoomQrisModal] = useState<boolean>(false);

  // Completed State
  const [createdRecord, setCreatedRecord] = useState<DonationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Default fallback images from admin settings
  const qrisImage = adminSettings?.qrisCodeImageUrl || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80';
  const bsiAccount = adminSettings?.bankAccountBsi || '707-567-8899 (a.n. MASJID TAZKIA)';
  const bcaAccount = adminSettings?.bankAccountBca || '7303-600-501 (BSI Wakaf a.n. Yayasan Amanah Utama Tazkia)';

  useEffect(() => {
    if (initialProgram) {
      setSelectedProgram(initialProgram);
      setSelectedCategory(initialProgram.category);
      setStep(3);
    } else if (initialCategory) {
      setSelectedCategory(initialCategory as ProgramCategory);
      setStep(2);
    }
  }, [initialProgram, initialCategory]);

  // Update donor details when modal opens if user is logged in
  useEffect(() => {
    if (isOpen && session && session.isLoggedIn) {
      if (session.name && session.name !== 'Jamaah Tazkia') setDonorName(session.name);
      if (session.phone) setDonorPhone(session.phone);
    }
  }, [isOpen, session]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setCreatedRecord(null);
        setProofUrl('');
        setIsAnonymous(false);
        setAmount(100000);
        setCustomAmountText('100.000');
        setZoomQrisModal(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const uniqueCode = 0; // Removed automatic unique code addition
  const totalPayable = amount + uniqueCode;

  const filteredPrograms = programs.filter(p => p.category === selectedCategory);

  const handleAmountChipClick = (val: number) => {
    setAmount(val);
    setCustomAmountText(new Intl.NumberFormat('id-ID').format(val));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw || '0', 10);
    setAmount(num);
    setCustomAmountText(raw ? new Intl.NumberFormat('id-ID').format(num) : '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProofUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyAccount = (text: string, label: string) => {
    const cleanNumber = text.split(' ')[0];
    navigator.clipboard.writeText(cleanNumber);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };



  const handleSubmitDonation = () => {
    if (!selectedProgram && step === 3) {
      // Create ad-hoc program object if none pre-selected
      const defaultProg = programs.find(p => p.category === selectedCategory) || programs[0];
      setSelectedProgram(defaultProg || null);
    }

    if (amount < 10000) {
      alert('Nominal donasi minimal Rp 10.000');
      return;
    }

    const finalName = isAnonymous ? 'Hamba Allah' : (donorName.trim() || 'Hamba Allah');
    const trxRef = `TRX-TZK-${Math.floor(10000 + Math.random() * 90000)}`;

    const donationData = {
      programId: selectedProgram?.id || 'prog-gen',
      programTitle: `${selectedProgram?.title || 'Donasi ZISWAF Tazkia'} (${infaqPurpose})`,
      category: selectedCategory,
      amount,
      uniqueCode,
      totalAmount: totalPayable,
      donorName: finalName,
      donorPhone: donorPhone || '081234567890',
      donorEmail: session?.isLoggedIn ? session.email : undefined,
      paymentMethod,
      isAnonymous,
      recurringPeriod,
      transactionRef: trxRef,
      proofUrl,
      status: proofUrl ? 'menunggu_verifikasi' : 'menunggu_pembayaran'
    };

    const record = onCompleteDonation(donationData as Omit<DonationRecord, 'id' | 'createdAt'>);
    setCreatedRecord(record);
    setStep(4);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  const handleCopyCode = () => {
    if (!createdRecord) return;
    navigator.clipboard.writeText(createdRecord.transactionRef);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const waReceiptText = encodeURIComponent(
    `Assalamu'alaikum Pengurus DKM Masjid Tazkia,\n\nSaya telah menunaikan Infaq/Donasi ZISWAF:\n` +
    `ðŸ“Œ Kode Transaksi: ${createdRecord?.transactionRef}\n` +
    `ðŸ“Œ Peruntukan: ${createdRecord?.programTitle}\n` +
    `ðŸ“Œ Nominal: ${formatRupiahFull(createdRecord?.totalAmount || 0)}\n` +
    `ðŸ“Œ Nama Donatur: ${createdRecord?.donorName}\n` +
    `ðŸ“Œ Cara Infaq / Metode: ${createdRecord?.paymentMethod}\n\n` +
    `Mohon dicatat & didoakan agar menjadi amal jariah yang berkah. Terima kasih.`
  );

  const waLink = `https://wa.me/6281298765432?text=${waReceiptText}`;

  const handleDownloadQris = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(qrisImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "QRIS_Masjid_Tazkia.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image', error);
      window.open(qrisImage, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#F9F8F4] border border-black/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-gray-800 my-8">
        
        {/* Header Modal */}
        <div className="bg-[#1e3a8a] flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
                <span>Layanan Donasi & Infaq Tazkia</span>
                <ShieldCheck className="w-4 h-4 text-blue-300" />
              </h3>
              <p className="text-xs text-blue-300">
                Langkah {step} dari 4: {step === 1 ? 'Pilih Peruntukan Infaq' : step === 2 ? 'Pilih Campaign Program' : step === 3 ? 'Formulir & Cara Infaq' : 'Bukti Tanda Terima Digital'}
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

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* STEP 1: Pilih Peruntukan Infaq / ZISWAF */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold font-serif text-amber-400">
                  Pilih Peruntukan Infaq & ZISWAF
                </h4>
                <p className="text-xs text-gray-600">
                  Tentukan niat dan bidang peruntukan dana ibadah yang ingin Anda distribusikan
                </p>
              </div>

              {/* Specific Sub-Allocations Grid */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                  Pilihan Bidang Peruntukan Infaq Spesifik:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Infaq Operasional & Kebersihan Masjid', cat: 'infaq', desc: 'Pemeliharaan AC, Listrik PLN, Kebersihan Karpet & Sanitasi', icon: Building },
                    { title: 'Infaq Santunan Anak Yatim & Dhuafa', cat: 'shadaqah', desc: 'Bantuan Beasiswa & Bahan Pokok Keluarga Pra-sejahtera', icon: HeartHandshake },
                    { title: 'Wakaf Karpet, Sound System & Renovasi', cat: 'wakaf', desc: 'Pengembangan Fisik & Akustik Ruang Shalat Utama', icon: Sparkles },
                    { title: 'Zakat Mal & Penghasilan (2.5%)', cat: 'zakat', desc: 'Penyucian Harta Sesuai Ketentuan Syariah PSAK 409', icon: Award },
                    { title: 'Sedekah Subuh & Berkah Jum\'at', cat: 'shadaqah', desc: 'Sarapan Gratis Jamaah & Nasi Kotak Jum\'at', icon: Calendar },
                    { title: 'Pendidikan Al-Qur\'an & Santri Tahfidz', cat: 'infaq', desc: 'Operasional TPA, Beasiswa Santri & Kitab Suci Al-Qur\'an', icon: ShieldCheck }
                  ].map((p, idx) => {
                    const IconComp = p.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setInfaqPurpose(p.title);
                          setSelectedCategory(p.cat as ProgramCategory);
                          setStep(2);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer shadow-lg space-y-2 ${
                          infaqPurpose === p.title
                            ? 'border-amber-400 bg-amber-500/15'
                            : 'border-gray-200 bg-gray-50/80 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                            {p.cat}
                          </span>
                          <IconComp className="w-4 h-4 text-gray-500" />
                        </div>
                        <h5 className="font-serif font-bold text-[#1e3a8a] text-sm leading-snug">
                          {p.title}
                        </h5>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          {p.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Categories Quick Buttons */}
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[11px] text-gray-500 block mb-2">Akses Cepat Kategori Utama:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'zakat', name: 'Zakat' },
                    { id: 'infaq', name: 'Infaq' },
                    { id: 'shadaqah', name: 'Sedekah' },
                    { id: 'wakaf', name: 'Wakaf' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id as ProgramCategory);
                        setStep(2);
                      }}
                      className="py-2 px-3 bg-[#1e3a8a] rounded-xl text-xs text-white font-bold text-center cursor-pointer shadow-md hover:bg-blue-800 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pilih Program Campaign Spesifik */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali Ke Peruntukan
                </button>
                <span className="text-xs text-blue-900 font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Peruntukan: {infaqPurpose}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold font-serif text-[#1e3a8a]">
                  Pilih Campaign Program (Atau Lanjut Umum):
                </h4>

                {/* Default General Purpose Option */}
                <div
                  onClick={() => {
                    setSelectedProgram(null);
                    setStep(3);
                  }}
                  className="p-4 rounded-2xl border border-blue-500/40 bg-gray-50/20 hover:bg-gray-50/30 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-gray-500 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#1e3a8a] font-serif">
                        Donasi Bebas / Kas Umum ({infaqPurpose})
                      </h5>
                      <p className="text-xs text-gray-600">
                        Penyaluran fleksibel ke kebutuhan paling mendesak di masjid
                      </p>
                    </div>
                  </div>
                  <button className="bg-blue-500 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0">
                    Pilih Ini <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {filteredPrograms.map(prog => (
                  <div
                    key={prog.id}
                    onClick={() => {
                      setSelectedProgram(prog);
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      selectedProgram?.id === prog.id
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-[#1e3a8a] font-serif">
                          {prog.title}
                        </h5>
                        <p className="text-xs text-amber-400 font-medium font-mono">
                          Target: {formatRupiahFull(prog.targetAmount)}
                        </p>
                      </div>
                    </div>

                    <button className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0">
                      Pilih <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Formulir & CARA INFAQ (Metode Pembayaran & Scan QRIS & Real Pict Proof) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-blue-900 font-bold uppercase tracking-wider block">
                    {selectedProgram ? selectedProgram.title : infaqPurpose}
                  </span>
                </div>
              </div>

              {/* Nominal Quick Chips */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-600 block">
                  Pilih atau Masukkan Nominal Infaq (Rp):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[20000, 50000, 100000, 250000, 500000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountChipClick(val)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                        amount === val
                          ? 'bg-amber-500 text-blue-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:border-gray-300'
                      }`}
                    >
                      {formatRupiahFull(val).replace(',00', '')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customAmountText}
                    onChange={handleCustomAmountChange}
                    placeholder="Masukkan nominal custom..."
                    className="w-full bg-gray-50 border border-gray-300 focus:border-amber-400 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold font-mono text-gray-900 outline-none"
                  />
                </div>
              </div>

              {/* CARA INFAQ / METODE PEMBAYARAN */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Pilih Cara Infaq / Metode Pembayaran:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'QRIS Nasional', label: 'Scan QRIS', icon: QrCode },
                    { id: 'Transfer Bank BSI', label: 'BSI Infaq', icon: Building },
                    { id: 'Transfer BSI Wakaf', label: 'BSI Wakaf', icon: Building },
                    { id: 'E-Wallet Direct', label: 'E-Wallet', icon: Smartphone }
                  ].map(method => {
                    const IconComp = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          paymentMethod === method.id
                            ? 'border-amber-400 bg-amber-500/20 text-[#1e3a8a] shadow-lg font-bold'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <IconComp className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* DISPLAY CARA INFAQ TERPILIH */}
                {/* 1. QRIS CODE SCAN DISPLAY */}
                {paymentMethod === 'QRIS Nasional' && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-amber-500/30 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-gray-200 pb-2">
                      <span className="flex items-center gap-1">
                        <QrCode className="w-4 h-4 text-gray-500" />
                        Scan QRIS Bebas Biaya Admin (BCA/GoPay/OVO/DANA/All Bank)
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomQrisModal(true)}
                        className="text-[10px] bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3 text-gray-500" />
                        Perbesar QRIS
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-2xl inline-block shadow-xl border-2 border-amber-400 relative group">
                      <img
                        src={qrisImage}
                        alt="Barcode QRIS Masjid Tazkia"
                        className="w-48 h-48 object-contain cursor-pointer"
                        onClick={() => setZoomQrisModal(true)}
                      />
                      <div
                        onClick={() => setZoomQrisModal(true)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer text-[#1e3a8a] text-xs font-bold gap-1"
                      >
                        <Maximize2 className="w-4 h-4" /> Klik Untuk Zoom
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 font-mono">
                      Merchant: Masjid Tazkia QRIS NASIONAL (NMID: ID10200394819)
                    </p>
                  </div>
                )}

                {/* 2. TRANSFER BANK BSI */}
                {paymentMethod === 'Transfer Bank BSI' && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1e3a8a] flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" /> Bank Syariah Indonesia (BSI)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(bsiAccount, 'BSI')}
                        className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount === 'BSI' ? <Check className="w-3.5 h-3.5 text-gray-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount === 'BSI' ? 'Tersalin!' : 'Salin Rekening'}</span>
                      </button>
                    </div>
                    <div className="bg-white text-gray-900 border border-gray-200 shadow-sm font-mono text-sm text-gray-800 font-bold flex justify-between items-center">
                      <span>{bsiAccount}</span>
                    </div>
                  </div>
                )}

                {/* 3. TRANSFER BSI WAKAF */}
                {paymentMethod === 'Transfer BSI Wakaf' && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1e3a8a] flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" /> Bank Syariah Indonesia (Wakaf)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(bcaAccount, 'BSI_WAKAF')}
                        className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount === 'BSI_WAKAF' ? <Check className="w-3.5 h-3.5 text-gray-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount === 'BSI_WAKAF' ? 'Tersalin!' : 'Salin Rekening'}</span>
                      </button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-sm text-gray-600 font-bold flex justify-between items-center">
                      <span>{bcaAccount}</span>
                    </div>
                  </div>
                )}

                {/* 4. E-WALLET */}
                {paymentMethod === 'E-Wallet Direct' && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1e3a8a] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-amber-400" /> GoPay / DANA / OVO / ShopeePay
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount('0812-9876-5432 (a.n. DKM Tazkia)', 'EWALLET')}
                        className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedAccount === 'EWALLET' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount === 'EWALLET' ? 'Tersalin!' : 'Salin Nomor'}</span>
                      </button>
                    </div>
                    <div className="bg-white text-gray-900 border border-gray-200 shadow-sm font-mono text-sm text-blue-900 font-bold">
                      0812-9876-5432 (a.n. Bendahara DKM Tazkia)
                    </div>
                  </div>
                )}
              </div>

              {/* UPLOAD FOTO STRUK / BUKTI TRANSFER REAL PICT */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span>Upload Foto Struk Bukti Transfer (Real Pict Optional)</span>
                  </label>
                  <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Atau masukkan URL Foto Struk Pembayaran..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full bg-white text-gray-900 border border-gray-200 shadow-sm text-xs rounded-xl px-3 py-2 font-mono outline-none"
                />

                {proofUrl && (
                  <div className="flex items-center gap-3 bg-white text-gray-900 border border-gray-200 shadow-sm">
                    <img
                      src={proofUrl}
                      alt="Struk Pembayaran"
                      className="w-12 h-12 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                      onClick={() => setZoomQrisModal(true)}
                    />
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block">
                        Foto Struk Real Pict Siap Dihubungkan
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Akan langsung tercatat di Laporan Keuangan Masjid
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Donor Contact Details */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Nama Lengkap Donatur:
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-gray-300 bg-gray-50 text-amber-500 focus:ring-0"
                      />
                      <span>Hamba Allah</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    placeholder={isAnonymous ? 'Hamba Allah (Nama Disembunyikan)' : 'Masukkan Nama Anda...'}
                    value={isAnonymous ? '' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-200 shadow-sm focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-gray-900 outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    No. WhatsApp Donatur (Untuk Tanda Terima Digital):
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890..."
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-200 shadow-sm focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-gray-900 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs font-semibold text-amber-700">Total Nominal Infaq:</p>
                  <p className="text-xl font-bold font-mono text-amber-600">
                    {formatRupiahFull(totalPayable)}
                  </p>
                </div>

                <button
                  onClick={handleSubmitDonation}
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-900/20 cursor-pointer transition-colors"
                >
                  <span>Konfirmasi & Selesaikan Infaq</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Konfirmasi & Tanda Terima Digital */}
          {step === 4 && createdRecord && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 text-gray-500 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-bold font-serif text-[#1e3a8a]">
                  Jazakallahu Khairan Katsiran!
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Infaq & Donasi Anda telah tercatat secara sah di database resmi DKM Masjid Tazkia.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-gray-50 border border-amber-500/30 rounded-2xl p-6 text-left space-y-4 relative">
                <div className="text-center pb-4 border-b border-gray-200 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">
                    JUMLAH DONASI WAKAF / ZISWAF
                  </span>
                  <p className="text-3xl font-extrabold font-mono text-amber-400">
                    {formatRupiahFull(createdRecord.totalAmount)}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    (Infaq Peruntukan: {createdRecord.programTitle})
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">No. Referensi Kuitansi:</span>
                    <span className="font-mono font-bold text-gray-900 flex items-center gap-1">
                      {createdRecord.transactionRef}
                      <button onClick={handleCopyCode} className="text-amber-400 hover:text-amber-300 cursor-pointer">
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-gray-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Cara Infaq:</span>
                    <span className="font-semibold text-gray-500">{createdRecord.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Atas Nama Donatur:</span>
                    <span className="font-semibold text-gray-900">{createdRecord.donorName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Status Database:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      createdRecord.status === 'berhasil' ? 'bg-emerald-500/20 text-emerald-400' : 
                      createdRecord.status === 'ditolak' ? 'bg-red-500/20 text-red-400' : 
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {createdRecord.status === 'berhasil' ? 'Terverifikasi Masuk Kas Masjid' : 
                       createdRecord.status === 'ditolak' ? 'Bukti Ditolak / Tidak Sah' : 
                       'Menunggu Verifikasi DKM'}
                    </span>
                  </div>
                </div>

                {proofUrl && (
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">Foto Struk Real Pict:</span>
                    <img
                      src={proofUrl}
                      alt="Bukti Struk"
                      className="w-10 h-10 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                      onClick={() => setZoomQrisModal(true)}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Konfirmasi Tanda Terima ke WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Selesai & Tutup</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL FOR QRIS / PROOF PHOTO */}
      {zoomQrisModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-50 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 relative space-y-4 text-center shadow-2xl">
            <button
              onClick={() => setZoomQrisModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-gray-100 text-gray-600 hover:text-[#1e3a8a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif font-bold text-[#1e3a8a] text-base flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-gray-500" />
              <span>Barcode QRIS Resmi Masjid Tazkia</span>
            </h4>

            <div className="p-4 bg-white rounded-2xl border-2 border-amber-400 inline-block shadow-2xl">
              <img
                src={qrisImage}
                alt="Barcode QRIS Full"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>

            <p className="text-xs text-gray-600 font-mono">
              Buka aplikasi M-Banking (BCA, BSI, Mandiri, BRI) atau E-Wallet (GoPay, OVO, DANA, ShopeePay) lalu arahkan kamera ke barcode ini.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadQris}
                className="w-full bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar QRIS</span>
              </button>
              <button
                onClick={() => setZoomQrisModal(false)}
                className="w-full bg-gray-100 hover:bg-blue-700 text-[#1e3a8a] font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

