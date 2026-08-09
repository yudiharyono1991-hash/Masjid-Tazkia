import {
  Program,
  DonationRecord,
  FinancialTransaction,
  PetugasJadwal,
  InventoryItem,
  Announcement,
  DoaItem,
  HadisItem,
  GalleryItem,
  QurbanGroup,
  JamaahProfile,
  AuditLog,
  BoardMember,
  ReportSignatory,
  MasjidAgenda,
  ERPBudgetEntry,
  AppAdminSettings
} from '../types';

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prg-1',
    title: 'Operasional Masjid',
    subtitle: 'Mendukung Kegiatan Ibadah & Dakwah',
    category: 'infaq',
    targetAmount: 500000000,
    collectedAmount: 180000000,
    donorsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    description: 'Bantuan operasional untuk perawatan masjid, kebersihan, listrik, serta penyelenggaraan ibadah rutin jamaah.',
    isUrgent: false,
    featured: true
  },
  {
    id: 'prg-2',
    title: 'Santunan Yatim Piatu',
    subtitle: 'Meringankan Beban Yatim Piatu',
    category: 'infaq',
    targetAmount: 250000000,
    collectedAmount: 150000000,
    donorsCount: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=800&q=80',
    description: 'Program santunan pendidikan dan kebutuhan pokok bagi anak-anak yatim piatu di sekitar lingkungan Masjid Tazkia.',
    isUrgent: true,
    featured: true
  },
  {
    id: 'prg-3',
    title: 'Wakaf Masjid (Pemeliharaan & Pengembangan)',
    subtitle: 'Amal Jariyah Tak Terputus',
    category: 'wakaf',
    targetAmount: 10000000000,
    collectedAmount: 6500000000,
    donorsCount: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    description: 'Pekerjaan perbaikan infrastruktur masjid, perluasan area ibadah, dan pengadaan sarana prasana dakwah yang berkelanjutan.',
    isUrgent: false,
    featured: true
  },
  {
    id: 'prg-4',
    title: 'Santunan Dhuafa (& Fakir Miskin)',
    subtitle: 'Meringankan Beban Saudara Kita',
    category: 'zakat',
    targetAmount: 750000000,
    collectedAmount: 450000000,
    donorsCount: 1120,
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    description: 'Penyaluran zakat dan infaq bagi fakir miskin, keluarga prasejahtera, dan bantuan modal usaha kecil berbasis syariah (Baitul Maal).',
    isUrgent: false,
    featured: true
  },

];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'DON-9821',
    programId: 'prg-1',
    programTitle: 'Wakaf Tunai Sound Masjid & Akustik Ruang Utama',
    category: 'wakaf',
    amount: 1000000,
    uniqueCode: 14,
    totalAmount: 1000014,
    donorName: 'Haji Ahmad Subagja',
    donorPhone: '081298765432',
    paymentMethod: 'QRIS Auto-Confirm',
    isAnonymous: false,
    status: 'berhasil',
    createdAt: '2026-07-26T04:30:00Z',
    transactionRef: 'TRX-TZK-88219'
  },
  {
    id: 'DON-9822',
    programId: 'prg-2',
    programTitle: 'Program Sahur & Buka Puasa Ramadhan Jamaah',
    category: 'infaq',
    amount: 500000,
    uniqueCode: 22,
    totalAmount: 500022,
    donorName: 'Hamba Allah',
    donorPhone: '081311223344',
    paymentMethod: 'Bank Transfer BCA',
    isAnonymous: true,
    status: 'berhasil',
    createdAt: '2026-07-26T03:15:00Z',
    transactionRef: 'TRX-TZK-88220'
  },
  {
    id: 'DON-9823',
    programId: 'prg-5',
    programTitle: 'TPA & Rumah Tahfidz Anak Kurang Mampu',
    category: 'zakat',
    amount: 2500000,
    uniqueCode: 37,
    totalAmount: 2500037,
    donorName: 'Ibu Ratna Dewi',
    donorPhone: '085699887766',
    paymentMethod: 'Bank Transfer Mandiri',
    isAnonymous: false,
    status: 'berhasil',
    createdAt: '2026-07-25T18:40:00Z',
    transactionRef: 'TRX-TZK-88221'
  }
];

export const INITIAL_FINANCIAL: FinancialTransaction[] = [
  {
    id: 'FIN-101',
    type: 'masuk',
    title: 'Penerimaan Zakat Mal Jamaah Periode Juli 2026',
    category: 'Zakat Mal',
    amount: 125000000,
    date: '2026-07-25',
    description: 'Penerimaan dana zakat mal via transfer bank & QRIS resmi Masjid Tazkia.',
    proofUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'FIN-102',
    type: 'keluar',
    title: 'Penyaluran Santunan 150 Paket Sembako Fakir Miskin',
    category: 'Penyaluran ZISWAF',
    amount: 45000000,
    date: '2026-07-24',
    description: 'Pendistribusian bahan pokok kepada keluarga dhuafa terdaftar di 5 kelurahan sekitar.',
    proofUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'FIN-103',
    type: 'masuk',
    title: 'Infaq Keliling Shalat Jumat Tazkia',
    category: 'Infaq Jumat',
    amount: 18450000,
    date: '2026-07-24',
    description: 'Perhitungan kotam infaq Jumat jamaah masjid.',
    proofUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'FIN-104',
    type: 'keluar',
    title: 'Biaya Listrik, Kebersihan, & Pemeliharaan AC Utama',
    category: 'Operasional Masjid',
    amount: 12800000,
    date: '2026-07-22',
    description: 'Pembayaran tagihan utilitas PLN, PDAM, dan servis berkala 12 unit AC Sentral.',
    proofUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PETUGAS: PetugasJadwal[] = [
  {
    id: 'JDW-1',
    date: '2026-07-31',
    dayName: 'Jumat Ini',
    subuh: 'Ustadz Ahmad Fawzi, S.Ag',
    dzuhur: 'Prof. Dr. KH. Nasaruddin Umar, MA',
    ashar: 'Ustadz Dr. H. Abdul Malik',
    maghrib: 'KH. Ridwan Kamil, Lc',
    isya: 'Ustadz Farhan Basalamah, M.A',
    khatibJumat: 'Prof. Dr. KH. Nasaruddin Umar, MA',
    imamJumat: 'Ustadz H. M. Zainuddin, Sq',
    muadzinJumat: 'Ustadz Bilal Al-Habsyi',
    bilalJumat: 'Ustadz Ridwan Syah, S.Pd.I',
    topikJumat: 'Keberkahan Rezeki dalam Zakat, Wakaf Produktif & Spirit Qurban',
    timeJumat: '11:45 WIB - Selesai',
    notesJumat: 'Diharapkan jamaah hadir lebih awal, membawa sajadah sendiri, serta menjaga kerapian shaf shalat.'
  },
  {
    id: 'JDW-2',
    date: '2026-08-07',
    dayName: 'Jumat Depan',
    subuh: 'Ustadz Farhan Basalamah, M.A',
    dzuhur: 'Dr. KH. M. Hidayatullah, M.A.',
    ashar: 'Ustadz Ahmad Fawzi, S.Ag',
    maghrib: 'Ustadz Dr. H. Abdul Malik',
    isya: 'KH. Ridwan Kamil, Lc',
    khatibJumat: 'Dr. KH. M. Hidayatullah, M.A.',
    imamJumat: 'Ustadz H. M. Zainuddin, Sq',
    muadzinJumat: 'Ustadz Hasan Basri',
    bilalJumat: 'Ustadz Salman Al-Farisi',
    topikJumat: 'Membangun Keluarga Rabbani Bebas Riba di Era Digital',
    timeJumat: '11:45 WIB - Selesai',
    notesJumat: 'Kajian ba\'da Jumat dilanjutkan dengan konsultasi zakat & waris syariah gratis.'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-001',
    code: 'SND-01',
    name: 'Sistem Line Array Sound Speaker TOA Professional',
    category: 'Elektronik & Audio',
    quantity: 8,
    unit: 'Unit',
    condition: 'Baik',
    location: 'Ruang Shalat Utama Lt 1',
    lastMaintenance: '2026-07-10',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'INV-002',
    code: 'AC-04',
    name: 'AC Inverter Standing Floor 5 PK Daikin',
    category: 'Elektronik & Pendingin',
    quantity: 12,
    unit: 'Unit',
    condition: 'Baik',
    location: 'Ruang Shalat Utama & Hall',
    lastMaintenance: '2026-07-22',
    imageUrl: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'INV-003',
    code: 'KRP-02',
    name: 'Karpet Masjid Sajadah Tebal Turkish Super Red',
    category: 'Peralatan Ibadah',
    quantity: 45,
    unit: 'Gulung',
    condition: 'Baik',
    location: 'Ruang Shalat Utama',
    lastMaintenance: '2026-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'INV-004',
    code: 'MIC-03',
    name: 'Microphone Wireless Shure SM58 Professional',
    category: 'Elektronik & Audio',
    quantity: 6,
    unit: 'Set',
    condition: 'Perlu Perbaikan',
    location: 'Mimbar Utama',
    lastMaintenance: '2026-07-18',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANC-1',
    title: 'Kajian Rutin Subuh Berkah: Fiqh Muamalah & ZISWAF',
    content: 'Diberitahukan kepada seluruh jamaah bahwa Kajian Subuh Berkah bersama KH. Ridwan Kamil, Lc akan dilaksanakan setiap Sabtu subuh dilanjutkan dengan sarapan ramah tamah.',
    category: 'Kajian',
    date: '2026-07-25',
    isPinned: true,
    author: 'Pengurus DKM Tazkia',
    imageUrl: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ANC-2',
    title: 'Laporan Akuntabilitas & Transparansi Kas Masjid Bulan Juni 2026',
    content: 'Laporan rincian pemasukan dan pengeluaran kas Masjid Tazkia periode Juni 2026 telah terverifikasi oleh Tim Audit Internal. Informasi selengkapnya dapat diakses pada menu Transparansi.',
    category: 'Keuangan',
    date: '2026-07-20',
    isPinned: true,
    author: 'Bendahara DKM Tazkia',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ANC-3',
    title: 'Pendaftaran Santri Baru TPA Anak & Pembina Muallaf Center',
    content: 'Gelombang pendaftaran santri TPA Anak dan pembinaan Muallaf Center angkatan 2026/2027 telah dibuka. Silakan daftar via Sekretariat DKM.',
    category: 'Kegiatan',
    date: '2026-07-18',
    isPinned: false,
    author: 'Divisi Pendidikan DKM',
    imageUrl: 'https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_DOA: DoaItem[] = [
  {
    id: 'doa-1',
    title: 'Doa Memohon Kelapangan Rezeki & Keberkahan',
    category: 'Rezeki',
    arabic: '╪º┘ä┘ä┘Ä┘æ┘ç┘Å┘à┘Ä┘æ ╪Ñ┘É┘å┘É┘æ┘è ╪ú┘Ä╪│┘Æ╪ú┘Ä┘ä┘Å┘â┘Ä ╪╣┘É┘ä┘Æ┘à┘ï╪º ┘å┘Ä╪º┘ü┘É╪╣┘ï╪º ┘ê┘Ä╪▒┘É╪▓┘Æ┘é┘ï╪º ╪╖┘Ä┘è┘É┘æ╪¿┘ï╪º ┘ê┘Ä╪╣┘Ä┘à┘Ä┘ä┘ï╪º ┘à┘Å╪¬┘Ä┘é┘Ä╪¿┘Ä┘æ┘ä┘ï╪º',
    latin: 'Allahumma inni as-aluka \'ilman nafi\'an wa rizqan thayyiban wa \'amalan mutaqabbalan',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima. (HR. Ibn Majah)',
    source: 'HR. Ibn Majah no. 925'
  },
  {
    id: 'doa-2',
    title: 'Doa Setelah Bersedekah / Menunaikan Zakat',
    category: 'Rezeki',
    arabic: '╪▒┘Ä╪¿┘Ä┘æ┘å┘Ä╪º ╪¬┘Ä┘é┘Ä╪¿┘Ä┘æ┘ä┘Æ ┘à┘É┘å┘Ä┘æ╪º ╪Ñ┘É┘å┘Ä┘æ┘â┘Ä ╪ú┘Ä┘å┘Æ╪¬┘Ä ╪º┘ä╪│┘Ä┘æ┘à┘É┘è╪╣┘Å ╪º┘ä┘Æ╪╣┘Ä┘ä┘É┘è┘à┘Å',
    latin: 'Rabbana taqabbal minna innaka antas-sami\'ul-\'alim',
    translation: 'Ya Tuhan kami, terimalah amalan dari kami, sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui. (QS. Al-Baqarah: 127)',
    source: 'QS. Al-Baqarah: 127'
  },
  {
    id: 'doa-3',
    title: 'Doa Memohon Perlindungan dari Kesusahan & Utang',
    category: 'Perlindungan',
    arabic: '╪º┘ä┘ä┘Ä┘æ┘ç┘Å┘à┘Ä┘æ ╪Ñ┘É┘å┘É┘æ┘è ╪ú┘Ä╪╣┘Å┘ê╪░┘Å ╪¿┘É┘â┘Ä ┘à┘É┘å┘Ä ╪º┘ä┘Æ┘ç┘Ä┘à┘É┘æ ┘ê┘Ä╪º┘ä┘Æ╪¡┘Ä╪▓┘Ä┘å┘É ┘ê┘Ä╪º┘ä┘Æ╪╣┘Ä╪¼┘Æ╪▓┘É ┘ê┘Ä╪º┘ä┘Æ┘â┘Ä╪│┘Ä┘ä┘É ┘ê┘Ä╪º┘ä┘Æ╪¿┘Å╪«┘Æ┘ä┘É ┘ê┘Ä╪º┘ä┘Æ╪¼┘Å╪¿┘Æ┘å┘É ┘ê┘Ä╪╢┘Ä┘ä┘Ä╪╣┘É ╪º┘ä╪»┘Ä┘æ┘è┘Æ┘å┘É ┘ê┘Ä╪║┘Ä┘ä┘Ä╪¿┘Ä╪⌐┘É ╪º┘ä╪▒┘É┘æ╪¼┘Ä╪º┘ä┘É',
    latin: 'Allahumma inni a\'udzu bika minal-hammi wal-hazani wal-\'agzi wal-kasali wal-bukhli wal-jubni wa dhala\'id-daini wa ghalabatir-rijal',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari rasa sedih dan gelisah, kecemasan, kelemahan dan kemalasan, sifat kikir dan penakut, beban utang dan tekanan orang lain. (HR. Bukhari)',
    source: 'HR. Bukhari no. 2893'
  },
  {
    id: 'doa-4',
    title: 'Doa Masuk Masjid',
    category: 'Shalat',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaf-tah lii abwaaba rahmatika',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    source: 'HR. Muslim'
  }
];

export const INITIAL_HADIS: HadisItem[] = [
  {
    id: 'hds-1',
    title: 'Sedekah Tidak Mengurangi Harta',
    arabic: '┘à┘Ä╪º ┘å┘Ä┘é┘Ä╪╡┘Ä╪¬┘Æ ╪╡┘Ä╪»┘Ä┘é┘Ä╪⌐┘î ┘à┘É┘å┘Æ ┘à┘Ä╪º┘ä┘ì',
    translation: 'Sedekah itu tidak akan mengurangi harta sedikit pun, melainkan Allah akan menambah kemuliaan bagi orang yang bersedekah.',
    narrator: 'Abu Hurairah radhiyallahu \'anhu',
    source: 'HR. Muslim no. 2588'
  },
  {
    id: 'hds-2',
    title: 'Amal Jariah Yang Terus Mengalir',
    arabic: '╪Ñ┘É╪░┘Ä╪º ┘à┘Ä╪º╪¬┘Ä ╪º┘ä┘Æ╪Ñ┘É┘å┘Æ╪│┘Ä╪º┘å┘Å ╪º┘å┘Æ┘é┘Ä╪╖┘Ä╪╣┘Ä ╪╣┘Ä┘å┘Æ┘ç┘Å ╪╣┘Ä┘à┘Ä┘ä┘Å┘ç┘Å ╪Ñ┘É┘ä┘Ä┘æ╪º ┘à┘É┘å┘Æ ╪½┘Ä┘ä┘Ä╪º╪½┘ì: ╪╡┘Ä╪»┘Ä┘é┘Ä╪⌐┘ì ╪¼┘Ä╪º╪▒┘É┘è┘Ä╪⌐┘ì╪î ╪ú┘Ä┘ê┘Æ ╪╣┘É┘ä┘Æ┘à┘ì ┘è┘Å┘å┘Æ╪¬┘Ä┘ü┘Ä╪╣┘Å ╪¿┘É┘ç┘É╪î ╪ú┘Ä┘ê┘Æ ┘ê┘Ä┘ä┘Ä╪»┘ì ╪╡┘Ä╪º┘ä┘É╪¡┘ì ┘è┘Ä╪»┘Æ╪╣┘Å┘ê ┘ä┘Ä┘ç┘Å',
    translation: 'Apabila manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariah (wakaf), ilmu yang bermanfaat, atau anak saleh yang mendoakannya.',
    narrator: 'Abu Hurairah radhiyallahu \'anhu',
    source: 'HR. Muslim no. 1631'
  },
  {
    id: 'hds-3',
    title: 'Pahala Membangun Masjid',
    arabic: '┘à┘Ä┘å┘Æ ╪¿┘Ä┘å┘Ä┘ë ┘à┘Ä╪│┘Æ╪¼┘É╪»┘ï╪º ┘ä┘É┘ä┘Ä┘æ┘ç┘É ╪¿┘Ä┘å┘Ä┘ë ╪º┘ä┘ä┘Ä┘æ┘ç┘Å ┘ä┘Ä┘ç┘Å ┘à┘É╪½┘Æ┘ä┘Ä┘ç┘Å ┘ü┘É┘è ╪º┘ä┘Æ╪¼┘Ä┘å┘Ä┘æ╪⌐┘É',
    translation: 'Barangsiapa membangun masjid karena Allah, maka Allah akan membangunkan baginya rumah yang serupa di dalam surga.',
    narrator: 'Utsman bin Affan radhiyallahu \'anhu',
    source: 'HR. Bukhari & Muslim'
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'JRN-001',
    date: '2026-07-26',
    voucherNo: 'VCH-2026/07/001',
    accountCode: '1101',
    accountName: 'Kas Utama Operasional Masjid',
    debit: 1500000,
    credit: 0,
    description: 'Penerimaan Infaq Subuh Jamaah via QRIS',
    category: 'Infaq' as const
  },
  {
    id: 'JRN-002',
    date: '2026-07-26',
    voucherNo: 'VCH-2026/07/001',
    accountCode: '4101',
    accountName: 'Penerimaan Infaq Terikat/Bebas',
    debit: 0,
    credit: 1500000,
    description: 'Penerimaan Infaq Subuh Jamaah via QRIS',
    category: 'Infaq' as const
  },
  {
    id: 'JRN-003',
    date: '2026-07-25',
    voucherNo: 'VCH-2026/07/002',
    accountCode: '1102',
    accountName: 'Bank BSI - Zakat Fitrah & Maal',
    debit: 5000000,
    credit: 0,
    description: 'Penerimaan Zakat Profesi Hamba Allah',
    category: 'Zakat' as const
  },
  {
    id: 'JRN-004',
    date: '2026-07-25',
    voucherNo: 'VCH-2026/07/002',
    accountCode: '4201',
    accountName: 'Penerimaan Zakat Harta & Profesi',
    debit: 0,
    credit: 5000000,
    description: 'Penerimaan Zakat Profesi Hamba Allah',
    category: 'Zakat' as const
  },
  {
    id: 'JRN-005',
    date: '2026-07-24',
    voucherNo: 'VCH-2026/07/003',
    accountCode: '5101',
    accountName: 'Beban Operasional Kebersihan & AC',
    debit: 750000,
    credit: 0,
    description: 'Servis Berkala AC Ruang Shalat Utama & Pengadaan Sabun',
    category: 'Operasional' as const
  },
  {
    id: 'JRN-006',
    date: '2026-07-24',
    voucherNo: 'VCH-2026/07/003',
    accountCode: '1103',
    accountName: 'Kas Kecil Operasional Harian',
    debit: 0,
    credit: 750000,
    description: 'Servis Berkala AC Ruang Shalat Utama & Pengadaan Sabun',
    category: 'Operasional' as const
  }
];

export const INITIAL_GL_ACCOUNTS = [
  {
    code: '1101',
    name: 'Kas Utama Operasional Masjid',
    category: 'Aset' as const,
    initialBalance: 125000000,
    totalDebit: 15500000,
    totalCredit: 4200000,
    endingBalance: 136300000
  },
  {
    code: '1102',
    name: 'Bank BSI - Zakat Fitrah & Maal',
    category: 'Aset' as const,
    initialBalance: 450000000,
    totalDebit: 32000000,
    totalCredit: 12500000,
    endingBalance: 469500000
  },
  {
    code: '1103',
    name: 'Kas Kecil Operasional Harian (Petty Cash)',
    category: 'Aset' as const,
    initialBalance: 5000000,
    totalDebit: 2000000,
    totalCredit: 1450000,
    endingBalance: 5550000
  },
  {
    code: '2101',
    name: 'Kewajiban Penyaluran Mustahik (Zakat Unspent)',
    category: 'Kewajiban' as const,
    initialBalance: 180000000,
    totalDebit: 25000000,
    totalCredit: 42000000,
    endingBalance: 197000000
  },
  {
    code: '4101',
    name: 'Penerimaan Infaq & Shadaqah (PSAK 409)',
    category: 'Penerimaan ZISWAF' as const,
    initialBalance: 240000000,
    totalDebit: 0,
    totalCredit: 35000000,
    endingBalance: 275000000
  },
  {
    code: '5101',
    name: 'Beban Operasional & Pemeliharaan Masjid',
    category: 'Beban Operasional' as const,
    initialBalance: 48000000,
    totalDebit: 6200000,
    totalCredit: 0,
    endingBalance: 54200000
  }
];

export const INITIAL_PETTY_CASH = [
  {
    id: 'KC-001',
    date: '2026-07-26',
    refNo: 'PKC-01',
    purpose: 'Pembelian Konsumsi Pengajian Rutin Ba\'da Maghrib',
    picName: 'Ust. Marzuki (DKM)',
    type: 'Pengeluaran' as const,
    amount: 350000,
    remainingBalance: 5550000,
    receiptProof: 'Nota Toko Berkah Jaya',
    proofUrl: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'KC-002',
    date: '2026-07-25',
    refNo: 'PKC-02',
    purpose: 'Pengisian Kasbon Operasional Kebersihan Masjid',
    picName: 'Bpk. Hendra (Marbot)',
    type: 'Pengeluaran' as const,
    amount: 250000,
    remainingBalance: 5900000,
    receiptProof: 'Kuitansi Petugas',
    proofUrl: 'https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'KC-003',
    date: '2026-07-20',
    refNo: 'PKC-03',
    purpose: 'Pencairan Dana Top-Up Imprest System dari Bank BSI',
    picName: 'Bendahara DKM',
    type: 'Pencairan' as const,
    amount: 3000000,
    remainingBalance: 6150000,
    receiptProof: 'Slip Penarikan BSI',
    proofUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_ADMIN_SETTINGS = {
  showAiAssistant: true,
  showTvSignageOption: true,
  showQuranModule: true,
  showLiveMutations: true,
  showTargetDonationBar: true,
  allowAnonymousDonation: true,
  runningTextTv: 'Selamat Datang di Masjid Tazkia (Kampung Sunnah Sentul) - Mohon menonaktifkan nada dering HP selama pelaksanaan Ibadah Shalat Jamaah & Dzikir Akbar.',
  goldNisabPrice: 1350000,
  bankAccountBsi: '7130-2498-17 (a.n. DKM Masjid Tazkia ZISWAF)',
  bankAccountBca: '8820-1192-33 (a.n. Yayasan Tazkia Sentul)',
  qrisMerchantName: 'Masjid Tazkia QRIS NASIONAL',
  iqamahCountdownMinutes: 10,
  masjidLogoUrl: 'https://firebasestorage.googleapis.com/v0/b/tazkia-masjid.appspot.com/o/tazkia-logo-white-bg.png?alt=media&token=335472e6-45a3-489c-b1c4-332375b00e31',
  masjidHeroPhotoUrl: 'https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=1200&q=80',
  qrisCodeImageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
  heroPromoTitle: 'Pusat Peradaban Islam & Kesejahteraan Umat',
  heroPromoSubtitle: 'Melalui Optimalisasi ZISWAF, Dakwah & Zikir',
  heroPromoDescription: 'Salurkan Zakat, Infaq, Shadaqah, dan Wakaf Anda secara transparan di Masjid Tazkia untuk dakwah, pendidikan pesantren, dan pemberdayaan ekonomi umat.',
  heroTitleFontSize: 'lg',
  heroTitleFontFamily: 'serif',
  heroTextAlign: 'left',
  showPrayerTimesOnHome: true,
  showLayananKamiOnHome: true,
  showProgramCardsOnHome: true,
  showFridayInfoOnHome: true,
  showSocialMediaOnHome: true,
  jumatKhatibName: 'Prof. Dr. KH. Nasaruddin Umar, MA',
  jumatImamName: 'Ustadz H. M. Zainuddin, Sq',
  jumatMuadzinName: 'Ustadz Bilal Al-Hafiz',
  jumatTopicTitle: 'Keagungan Zikir & Transparansi Pengelolaan Aset Umat',
  jumatTimeInfo: 'Jumat Ini, 11:55 WIB - Selesai',
  masjidAddressInfo: 'Jl. Ir. H. Djuanda No. 78 Sentul City, Bogor Indonesia',
  masjidPhoneContact: '0858 1000 8899 (Sekretariat DKM) / masjidtazkia@tazkia.ac.id',
  featureInfoAnnouncement: 'Ekosistem Digital Masjid Tazkia melayani ZISWAF, Al-Qur\'an MP3, Jadwal Shalat & Adzan, Penunjuk Arah Kiblat, Sejarah Masjid, serta TV Signage Display.',
  socialMediaLinks: [
    { id: 'sm-1', platform: 'Facebook', url: 'https://www.facebook.com/MasjidTazkia/' },
    { id: 'sm-2', platform: 'Instagram', url: 'https://www.instagram.com/masjidtazkia/' },
    { id: 'sm-3', platform: 'Youtube', url: 'https://www.youtube.com/@masjidtazkia' }
  ]
};

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Tabligh Akbar Sentul: Membangun Peradaban Berbasis Al-Qur\'an',
    subtitle: 'Kajian Utama Masjid Tazkia',
    category: 'Tabligh Akbar',
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: '<https://www.youtube.com/embed/dQw4w9WgXcQ',
    date: '2026-07-20',
    ustadzName: 'Dr. KH. M. Hidayatullah, M.A.',
    location: 'Ruang Utama Masjid Tazkia',
    summary: 'Dokumentasi video dan artikel lengkap Tabligh Akbar yang dihadiri lebih dari 3.000 jamaah di Masjid Tazkia City.',
    articleContent: `Alhamdulillah, pelaksanaan Tabligh Akbar Sentul City dengan tema "Membangun Peradaban Berbasis Al-Qur'an" berjalan dengan sangat khidmat, lancar, dan penuh keberkahan.\n\nDalam tausiyah utamanya, Dr. KH. M. Hidayatullah menegaskan pentingnya menjadikan nilai-nilai Al-Qur'an sebagai pondasi utama kehidupan modern â€” tidak hanya dalam dimensi ibadah ritual, namun juga dalam etika bermuamalah, pendidikan generasi muda, serta penguatan kemandirian ekonomi umat melalui optimalisasi ZISWAF.\n\nAcara dimulai sejak pukul 08.00 WIB diawali pembacaan ayat suci Al-Qur'an oleh Qari Internasional, dilanjutkan sambutan hangat Ketua DKM Masjid Tazkia. Ribuan jamaah dari Bogor, Jakarta, dan sekitarnya memadati area dalam dan plaza outdoor masjid.\n\nSimak video dokumentasi lengkap serta foto kegiatan di atas untuk meraih ilmu serta keberkahan bersama.`,
    likesCount: 342,
    viewsCount: 2150,
    tags: ['TablighAkbar', 'KajianSentul', 'PeradabanIslam'],
    isFeatured: true
  },
  {
    id: 'gal-2',
    title: 'Penyaluran Zakat & Sembako Bagi 500 Mustahik Sentul & Babakan Madang',
    subtitle: 'Aksi Nyata Kepedulian Sosial Umat',
    category: 'Bakti Sosial',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    date: '2026-07-15',
    ustadzName: 'Tim UPZ DKM Tazkia',
    location: 'Plaza & Sekretariat ZISWAF Tazkia',
    summary: 'Penyaluran beras premium, paket minyak, dan santunan tunai secara terverifikasi bagi lansia, janda kurang mampu, dan kaum dhuafa.',
    articleContent: `Program Bakti Sosial Keumatan ini merupakan wujud pertanggungjawaban dan penyaluran amanah zakat, infaq, dan shadaqah yang dipercayakan oleh para muzakki kepada DKM Masjid Tazkia.\n\nSebanyak 500 paket bantuan pangan dan uang tunai diserahkan secara tertib dan penuh kehangatan. Pendataan dilakukan secara presisi oleh Tim Unit Pengumpul Zakat (UPZ) DKM bekerjasama dengan pengurus RT/RW setempat agar tepat sasaran.\n\nKetua UPZ DKM menyampaikan ucapan terima kasih mendalam kepada para donatur: "Jazakumullah khairan katsiran. Semoga setiap bulir beras dan rupiah yang disalurkan menjadi pembersih harta serta penolak bala bagi para muzakki beserta keluarga."`,
    likesCount: 289,
    viewsCount: 1820,
    tags: ['BaktiSosial', 'ZakatTepatSasaran', 'SentulPeduli'],
    isFeatured: true
  },
  {
    id: 'gal-3',
    title: 'Kajian Subuh Syariah: Fiqih Muamalah & Investasi Bebas Riba',
    subtitle: 'Literasi Keuangan Syariah Kontemporer',
    category: 'Kajian Rutin',
    mediaType: 'artikel',
    mediaUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    date: '2026-07-12',
    ustadzName: 'Prof. Dr. Syafi\'i Antonio, M.Ec.',
    location: 'Aula Utama Institut Tazkia Sentul',
    summary: 'Bedah tuntas rukun transaksi syariah, bahaya riba implisit, dan cara memilih instrumen investasi syariah yang aman di era digital.',
    articleContent: `Pentingnya memahami Fiqih Muamalah bagi setiap muslim yang berbisnis, berinvestasi, dan mengelola keuangan keluarga menjadi fokus utama dalam Kajian Subuh Tematik ini.\n\nProf. Dr. Syafi'i Antonio menjelaskan bahwa transaksi keuangan dalam Islam harus memenuhi prinsip keadilan ('adl), keterbukaan (transparansi), dan kerelaan (anta taradin minkum). Beliau menekankan agar jamaah mewaspadai skema investasi bodong yang berkedok syariah.\n\nPoin-poin Penting Kajian:\n1. Membedakan antara akad Mudharabah (bagi hasil) dan Musyarakah (kemitraan modal).\n2. Bahaya unsur Gharar (ketidakjelasan) dan Maisir (spekulasi perjudian).\n3. Tata cara menghitung zakat investasi saham dan emas simpanan.\n\nSesi dilanjutkan dengan tanya jawab interaktif bersama jamaah mengenai transaksi QRIS, e-wallet, dan zakat penghasilan bulanan.`,
    likesCount: 512,
    viewsCount: 3400,
    tags: ['FiqihMuamalah', 'EkonomiSyariah', 'KajianSubuh'],
    isFeatured: false
  },
  {
    id: 'gal-4',
    title: 'Wisuda Santri TPA & Tahfidz Al-Qur\'an Angkatan VI',
    subtitle: 'Mencetak Generasi Rabbani Penghafal Al-Qur\'an',
    category: 'Pendidikan & TPA',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=1200&q=80',
    date: '2026-06-28',
    ustadzName: 'Ustadz H. M. Zainuddin, Sq & Pengasuh TPA',
    location: 'Ruang Utama Masjid Tazkia',
    summary: 'Sebanyak 85 santri cilik TPA Tazkia lulus ujian munaqosyah hafalan Juz 30 dan Juz 29 dengan predikat Mumtaz.',
    articleContent: `Suasana penuh haru dan kebanggaan menyelimuti Wisuda Santri TPA & Tahfidz Al-Qur'an Masjid Tazkia. Para santri memasangkan mahkota secara simbolis di hadapan kedua orang tua mereka sebagai perlambang syafaat Al-Qur'an di akhirat kelak.\n\nDKM Masjid Tazkia memberikan penghargaan apresiasi serta beasiswa sekolah penuh bagi santri berprestasi yang berasal dari keluarga dhuafa.\n\n"Kami berkomitmen melahirkan generasi yang tidak hanya mahir membaca Al-Qur'an, namun juga berakhlaqul karimah dan berprestasi secara akademis," pungkas Kepala Pengasuh TPA Tazkia.`,
    likesCount: 410,
    viewsCount: 2900,
    tags: ['WisudaSantri', 'TahfidzAnak', 'PendidikanAlquran'],
    isFeatured: false
  }
];

export const INITIAL_QURBAN_GROUPS: QurbanGroup[] = [
  {
    id: 'qrb-sapi-1',
    title: 'Kelompok Sapi Patungan A (Tazkia 1447H)',
    animalType: 'Sapi',
    type: 'sapi_patungan',
    pricePerShare: 3500000,
    totalShares: 7,
    filledShares: 5,
    weightEstimate: '320 - 350 kg (Sapi Limosin / Simental)',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    description: 'Patungan Qurban Sapi 1/7 Saham Sesuai Syariat Islam. Bebas Biaya Operasional & Pemotongan di Masjid Tazkia. Daging disalurkan ke 350+ KK Mustahik & Fakir Miskin Sentul.',
    isCompleted: false,
    participants: [
      {
        id: 'p-1',
        groupId: 'qrb-sapi-1',
        groupTitle: 'Kelompok Sapi Patungan A (Tazkia 1447H)',
        mudhahhiName: 'Bapak H. Bambang Soetrisno & Keluarga',
        phone: '081298761234',
        sharesCount: 1,
        totalPaid: 3500000,
        paymentStatus: 'Lunas',
        createdAt: '2026-07-20',
        transactionRef: 'QRB-8821'
      },
      {
        id: 'p-2',
        groupId: 'qrb-sapi-1',
        groupTitle: 'Kelompok Sapi Patungan A (Tazkia 1447H)',
        mudhahhiName: 'Ibu Hj. Siti Aminah binti Fulan',
        phone: '081388123456',
        sharesCount: 2,
        totalPaid: 7000000,
        paymentStatus: 'Lunas',
        createdAt: '2026-07-22',
        transactionRef: 'QRB-8825'
      },
      {
        id: 'p-3',
        groupId: 'qrb-sapi-1',
        groupTitle: 'Kelompok Sapi Patungan A (Tazkia 1447H)',
        mudhahhiName: 'Drs. Ahmad Hidayat',
        phone: '08119022311',
        sharesCount: 2,
        totalPaid: 7000000,
        paymentStatus: 'Lunas',
        createdAt: '2026-07-24',
        transactionRef: 'QRB-8830'
      }
    ]
  },
  {
    id: 'qrb-sapi-2',
    title: 'Kelompok Sapi Patungan B (Tazkia 1447H)',
    animalType: 'Sapi',
    type: 'sapi_patungan',
    pricePerShare: 3500000,
    totalShares: 7,
    filledShares: 2,
    weightEstimate: '330 - 360 kg (Sapi PO Super)',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    description: 'Sapi Patungan Kloter B. Kesempatan meraih pahala Qurban bersama 7 shohibul qurban di Masjid Tazkia.',
    isCompleted: false,
    participants: [
      {
        id: 'p-4',
        groupId: 'qrb-sapi-2',
        groupTitle: 'Kelompok Sapi Patungan B (Tazkia 1447H)',
        mudhahhiName: 'Bapak Dr. Hendra Wijaya',
        phone: '081277665544',
        sharesCount: 2,
        totalPaid: 7000000,
        paymentStatus: 'Lunas',
        createdAt: '2026-07-25',
        transactionRef: 'QRB-8841'
      }
    ]
  },
  {
    id: 'qrb-kambing-1',
    title: 'Kambing / Domba Individual Premium',
    animalType: 'Kambing / Domba',
    type: 'kambing_individual',
    pricePerShare: 2800000,
    totalShares: 1,
    filledShares: 0,
    weightEstimate: '28 - 32 kg (Kambing Etawa / Garut)',
    imageUrl: 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=1200&q=80',
    description: 'Qurban 1 Ekor Kambing / Domba Individual Atas Nama Pribadi. Hewan sehat, cukup umur (musinnah), certified oleh dokter hewan & DKM Masjid Tazkia.',
    isCompleted: false,
    participants: []
  },
  {
    id: 'qrb-kambing-2',
    title: 'Domba Garut Super Tanduk (Kambing / Domba)',
    animalType: 'Kambing / Domba',
    type: 'kambing_individual',
    pricePerShare: 3500000,
    totalShares: 1,
    filledShares: 0,
    weightEstimate: '35 - 40 kg (Domba Garut Super)',
    imageUrl: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=1200&q=80',
    description: 'Domba Garut Pilihan dengan bobot ekstra besar. Bebas PMK, sehat & cukup umur sesuai syariat ibadah Qurban.',
    isCompleted: false,
    participants: []
  }
];


export const INITIAL_ERP_COA = [
  { id: 'coa-1000', accountCode: '1000', accountName: 'ASET', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: true, isActive: true },
  { id: 'coa-1100', accountCode: '1100', accountName: 'ASET LANCAR', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: true, isActive: true },
  { id: 'coa-1101', accountCode: '1101', accountName: 'Kas Tunai', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1102', accountCode: '1102', accountName: 'Kas Bank Operasional', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1103', accountCode: '1103', accountName: 'Kas Bank Zakat', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1104', accountCode: '1104', accountName: 'Kas Bank Infaq/Sedekah', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1105', accountCode: '1105', accountName: 'Kas Bank Wakaf', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1106', accountCode: '1106', accountName: 'Kas Keropak Infaq Masjid', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1107', accountCode: '1107', accountName: 'Perlengkapan Masjid', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Lancar', isHeader: false, isActive: true },
  { id: 'coa-1200', accountCode: '1200', accountName: 'ASET TETAP', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Tetap', isHeader: true, isActive: true },
  { id: 'coa-1201', accountCode: '1201', accountName: 'Tanah', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Tetap', isHeader: false, isActive: true },
  { id: 'coa-1202', accountCode: '1202', accountName: 'Bangunan Masjid', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Tetap', isHeader: false, isActive: true },
  { id: 'coa-1203', accountCode: '1203', accountName: 'Kendaraan Operasional', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Tetap', isHeader: false, isActive: true },
  { id: 'coa-1204', accountCode: '1204', accountName: 'Inventaris Masjid', accountType: 'Asset', normalBalance: 'Debit', groupName: 'Aset Tetap', isHeader: false, isActive: true },
  { id: 'coa-1290', accountCode: '1290', accountName: 'AKUMULASI PENYUSUTAN', accountType: 'Asset', normalBalance: 'Credit', groupName: 'Kontra Aset', isHeader: true, isActive: true },
  { id: 'coa-1291', accountCode: '1291', accountName: 'Akumulasi Penyusutan Bangunan', accountType: 'Asset', normalBalance: 'Credit', groupName: 'Kontra Aset', isHeader: false, isActive: true },
  { id: 'coa-1292', accountCode: '1292', accountName: 'Akumulasi Penyusutan Kendaraan', accountType: 'Asset', normalBalance: 'Credit', groupName: 'Kontra Aset', isHeader: false, isActive: true },
  { id: 'coa-1293', accountCode: '1293', accountName: 'Akumulasi Penyusutan Inventaris', accountType: 'Asset', normalBalance: 'Credit', groupName: 'Kontra Aset', isHeader: false, isActive: true },
  { id: 'coa-2000', accountCode: '2000', accountName: 'LIABILITAS', accountType: 'Liability', normalBalance: 'Credit', groupName: 'Liabilitas', isHeader: true, isActive: true },
  { id: 'coa-2100', accountCode: '2100', accountName: 'LIABILITAS JANGKA PENDEK', accountType: 'Liability', normalBalance: 'Credit', groupName: 'Liabilitas', isHeader: true, isActive: true },
  { id: 'coa-2101', accountCode: '2101', accountName: 'Utang Operasional', accountType: 'Liability', normalBalance: 'Credit', groupName: 'Liabilitas', isHeader: false, isActive: true },
  { id: 'coa-2102', accountCode: '2102', accountName: 'Utang Kegiatan', accountType: 'Liability', normalBalance: 'Credit', groupName: 'Liabilitas', isHeader: false, isActive: true },
  { id: 'coa-2103', accountCode: '2103', accountName: 'Utang Honor', accountType: 'Liability', normalBalance: 'Credit', groupName: 'Liabilitas', isHeader: false, isActive: true },
  { id: 'coa-3000', accountCode: '3000', accountName: 'ASET NETO (EKUITAS)', accountType: 'Equity', normalBalance: 'Credit', groupName: 'Ekuitas', isHeader: true, isActive: true },
  { id: 'coa-3101', accountCode: '3101', accountName: 'Aset Neto Tidak Terikat', accountType: 'Equity', normalBalance: 'Credit', groupName: 'Ekuitas', isHeader: false, isActive: true },
  { id: 'coa-3102', accountCode: '3102', accountName: 'Aset Neto Terikat Sementara', accountType: 'Equity', normalBalance: 'Credit', groupName: 'Ekuitas', isHeader: false, isActive: true },
  { id: 'coa-3103', accountCode: '3103', accountName: 'Aset Neto Terikat Permanen', accountType: 'Equity', normalBalance: 'Credit', groupName: 'Ekuitas', isHeader: false, isActive: true },
  { id: 'coa-4000', accountCode: '4000', accountName: 'PENERIMAAN (PENDAPATAN)', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: true, isActive: true },
  { id: 'coa-4100', accountCode: '4100', accountName: 'PENERIMAAN ZISWAF', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: true, isActive: true },
  { id: 'coa-4101', accountCode: '4101', accountName: 'Penerimaan Zakat Fitrah', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4102', accountCode: '4102', accountName: 'Penerimaan Zakat Maal', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4103', accountCode: '4103', accountName: 'Penerimaan Infaq Kotak Amal', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4104', accountCode: '4104', accountName: 'Penerimaan Infaq Transfer', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4105', accountCode: '4105', accountName: 'Penerimaan Wakaf Tunai', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4106', accountCode: '4106', accountName: 'Penerimaan Infaq Kotak Amal / Keropak', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4200', accountCode: '4200', accountName: 'PENERIMAAN LAINNYA', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: true, isActive: true },
  { id: 'coa-4201', accountCode: '4201', accountName: 'Penerimaan Qurban', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4202', accountCode: '4202', accountName: 'Penerimaan Acara/Kajian', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-4203', accountCode: '4203', accountName: 'Jasa Giro/Bagi Hasil', accountType: 'Revenue', normalBalance: 'Credit', groupName: 'Pendapatan', isHeader: false, isActive: true },
  { id: 'coa-5000', accountCode: '5000', accountName: 'PENGELUARAN (BEBAN)', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: true, isActive: true },
  { id: 'coa-5100', accountCode: '5100', accountName: 'PENYALURAN ZISWAF', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: true, isActive: true },
  { id: 'coa-5101', accountCode: '5101', accountName: 'Penyaluran Zakat (Asnaf)', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5102', accountCode: '5102', accountName: 'Penyaluran Infaq (Operasional)', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5103', accountCode: '5103', accountName: 'Penyaluran Infaq (Pembangunan)', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5104', accountCode: '5104', accountName: 'Penyaluran Infaq (Santunan)', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5105', accountCode: '5105', accountName: 'Penyaluran Infaq Kotak Amal / Keropak', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5200', accountCode: '5200', accountName: 'BEBAN OPERASIONAL MASJID', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: true, isActive: true },
  { id: 'coa-5201', accountCode: '5201', accountName: 'Beban Listrik, Air, & Telepon', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5202', accountCode: '5202', accountName: 'Beban Kebersihan & Keamanan', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5203', accountCode: '5203', accountName: 'Beban Perawatan & Perbaikan', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5204', accountCode: '5204', accountName: 'Honorarium Imam, Khatib, & Muadzin', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5205', accountCode: '5205', accountName: 'Gaji Pegawai/Pengurus', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5300', accountCode: '5300', accountName: 'BEBAN KEGIATAN & LAINNYA', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: true, isActive: true },
  { id: 'coa-5301', accountCode: '5301', accountName: 'Beban Kegiatan PHBI', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5302', accountCode: '5302', accountName: 'Beban Kegiatan Ramadhan', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5303', accountCode: '5303', accountName: 'Beban Pelaksanaan Qurban', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5304', accountCode: '5304', accountName: 'Beban Administrasi Bank', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5305', accountCode: '5305', accountName: 'Beban Penyusutan Aset Tetap', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true },
  { id: 'coa-5900', accountCode: '5900', accountName: 'BEBAN LAIN-LAIN', accountType: 'Expense', normalBalance: 'Debit', groupName: 'Beban', isHeader: false, isActive: true }
];

export const INITIAL_JAMAAH_PROFILES: JamaahProfile[] = [
  {
    id: 'jam-ketua-dewan',
    name: 'Ketua Dewan Pembina',
    email: 'ketua.dewan@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'ketua_dewan_pembina',
    dkmPosition: 'Ketua Dewan Pembina',
    password: 'password123'
  },
  {
    id: 'jam-direktur',
    name: 'Direktur',
    email: 'direktur@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'direktur',
    dkmPosition: 'Direktur',
    password: 'password123'
  },
  {
    id: 'jam-ketua-dkm',
    name: 'Ketua DKM',
    email: 'ketua.dkm@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'ketua_dkm',
    dkmPosition: 'Ketua DKM',
    password: 'password123'
  },
  {
    id: 'jam-bendahara',
    name: 'Bendahara',
    email: 'bendahara@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'bendahara',
    dkmPosition: 'Bendahara',
    password: 'password123'
  },
  {
    id: 'jam-penghimpunan',
    name: 'Bagian Penghimpunan',
    email: 'penghimpunan@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'penghimpunan',
    dkmPosition: 'Bagian Penghimpunan',
    password: 'password123'
  },
  {
    id: 'jam-penyaluran',
    name: 'Bagian Penyaluran',
    email: 'penyaluran@tazkia.id',
    joinDate: '2026-01-01T08:00:00Z',
    lastLogin: '2026-07-26T10:00:00Z',
    totalDonation: 0,
    role: 'penyaluran',
    dkmPosition: 'Bagian Penyaluran',
    password: 'password123'
  },
  {
    id: 'jam-1',
    name: 'Haji Ahmad Subagja',
    email: 'ahmad.subagja@gmail.com',
    phone: '081298765432',
    joinDate: '2026-01-10T08:00:00Z',
    lastLogin: '2026-07-28T09:00:00Z',
    totalDonation: 5400000,
    role: 'ketua_dkm',
    dkmPosition: 'Ketua DKM'
  },
  {
    id: 'jam-2',
    name: 'Haji Bambang Pamungkas, M.M.',
    email: 'bambang.pamungkas@outlook.com',
    phone: '081311223344',
    joinDate: '2026-01-15T09:00:00Z',
    lastLogin: '2026-07-28T10:15:00Z',
    totalDonation: 12500000,
    role: 'bendahara',
    dkmPosition: 'Bendahara DKM'
  },
  {
    id: 'jam-3',
    name: 'Ustadz H. M. Zainuddin, Sq',
    email: 'zainuddin.sq@masjidtazkia.id',
    phone: '081555667788',
    joinDate: '2026-02-01T10:00:00Z',
    lastLogin: '2026-07-27T18:30:00Z',
    totalDonation: 2500000,
    role: 'dkm',
    dkmPosition: 'Sekretaris DKM'
  },
  {
    id: 'jam-4',
    name: 'Yudi Haryono',
    email: 'yudi.haryono@masjidtazkia.id',
    phone: '081234567890',
    joinDate: '2026-03-01T08:00:00Z',
    lastLogin: '2026-07-28T15:30:00Z',
    totalDonation: 7500000,
    role: 'direktur',
    dkmPosition: 'Direktur'
  },
  {
    id: 'jam-5',
    name: 'Ibu Siti Aisyah',
    email: 'siti.aisyah@yahoo.com',
    phone: '081899887766',
    joinDate: '2026-03-15T14:20:00Z',
    lastLogin: '2026-07-26T12:00:00Z',
    totalDonation: 1800000,
    role: 'jamaah',
    dkmPosition: 'Jamaah'
  },
  {
    id: 'jam-6',
    name: 'Ibu Fatimah Azzahra',
    email: 'fatimah.azzahra@gmail.com',
    phone: '085211223344',
    joinDate: '2026-04-01T11:00:00Z',
    lastLogin: '2026-07-25T16:45:00Z',
    totalDonation: 3200000,
    role: 'jamaah',
    dkmPosition: 'Jamaah'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-28T09:00:00Z',
    userName: 'Haji Ahmad Subagja',
    userEmail: 'ahmad.subagja@gmail.com',
    role: 'dkm',
    action: 'LOGIN',
    details: 'Berhasil melakukan login ke dashboard Pengurus DKM dari perangkat seluler.'
  },
  {
    id: 'log-2',
    timestamp: '2026-07-28T09:15:00Z',
    userName: 'Haji Ahmad Subagja',
    userEmail: 'ahmad.subagja@gmail.com',
    role: 'dkm',
    action: 'CREATE_ANNOUNCEMENT',
    details: 'Berhasil mempublikasikan pengumuman berita: "Kajian Subuh Fiqih Kontemporer".'
  },
  {
    id: 'log-3',
    timestamp: '2026-07-28T10:15:00Z',
    userName: 'Haji Bambang Pamungkas, M.M.',
    userEmail: 'bambang.pamungkas@outlook.com',
    role: 'dkm',
    action: 'LOGIN',
    details: 'Berhasil melakukan login ke dashboard Pengurus Bendahara.'
  },
  {
    id: 'log-4',
    timestamp: '2026-07-28T10:30:00Z',
    userName: 'Haji Bambang Pamungkas, M.M.',
    userEmail: 'bambang.pamungkas@outlook.com',
    role: 'dkm',
    action: 'ADD_JOURNAL_ENTRY',
    details: 'Berhasil menginput data Jurnal Umum untuk Zakat Mal Jamaah senilai Rp 12.500.000.'
  },
  {
    id: 'log-5',
    timestamp: '2026-07-28T15:30:00Z',
    userName: 'Yudi Haryono',
    userEmail: 'yudi.haryono@masjidtazkia.id',
    role: 'super_admin',
    action: 'LOGIN',
    details: 'Berhasil melakukan login sebagai Super Admin dari konsol IT.'
  }
];

export const INITIAL_BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'bm-1',
    name: 'Prof. Dr. M. Syafii Antonio',
    position: 'Dewan Pembina Yayasan',
    roleType: 'pembina',
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80',
    bio: 'Pakar Ekonomi Syariah Nasional & Pendiri STEI SEBI',
    orderIdx: 1
  },
  {
    id: 'bm-2',
    name: 'Ustadz H. M. Zainuddin, SQ',
    position: 'Ketua / Direktur DKM',
    roleType: 'pengurus',
    imageUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80',
    bio: 'Pengasuh Majelis Taklim Tazkia',
    orderIdx: 2
  },
  {
    id: 'bm-3',
    name: 'H. Ahmad',
    position: 'Bendahara Umum',
    roleType: 'pengurus',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Praktisi Akuntansi & Keuangan',
    orderIdx: 3
  }
];

export const INITIAL_REPORT_SIGNATORIES: ReportSignatory[] = [
  {
    id: 'sig-1',
    role: 'Pembuat Laporan',
    name: 'Staf Keuangan',
    title: 'Akuntan Masjid',
    orderIdx: 1
  },
  {
    id: 'sig-2',
    role: 'Diperiksa Oleh',
    name: 'H. Ahmad',
    title: 'Bendahara DKM',
    orderIdx: 2
  },
  {
    id: 'sig-3',
    role: 'Disetujui Oleh',
    name: 'Ustadz H. M. Zainuddin, SQ',
    title: 'Ketua / Direktur DKM',
    orderIdx: 3
  },
  {
    id: 'sig-4',
    role: 'Mengetahui',
    name: 'Prof. Dr. M. Syafii Antonio',
    title: 'Dewan Pembina',
    orderIdx: 4
  }
];

export const INITIAL_AGENDAS: MasjidAgenda[] = [
  {
    id: 'agenda-1',
    title: 'Kajian Subuh Bulanan',
    date: '2026-08-01',
    time: '04:30 - 06:00',
    location: 'Ruang Utama Masjid Tazkia',
    speaker: 'Ust. Abdul Somad',
    description: 'Kajian rutin bulanan membahas tafsir tematik.',
    category: 'Kajian',
    imageUrl: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_ERP_BUDGETS: ERPBudgetEntry[] = [
  {
    id: 'budget-1',
    accountId: 'coa-5101',
    year: 2026,
    amount: 50000000,
    description: 'Anggaran Penyaluran Zakat (Asnaf) 2026',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'budget-2',
    accountId: 'coa-5102',
    year: 2026,
    amount: 25000000,
    description: 'Anggaran Penyaluran Infaq (Operasional) 2026',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'budget-3',
    accountId: 'coa-5201',
    year: 2026,
    amount: 15000000,
    description: 'Anggaran Listrik, Air, & Telepon 2026',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'budget-4',
    accountId: 'coa-5204',
    year: 2026,
    amount: 30000000,
    description: 'Anggaran Honorarium Imam & Khatib 2026',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'budget-5',
    accountId: 'coa-5302',
    year: 2026,
    amount: 45000000,
    description: 'Anggaran Kegiatan Ramadhan 2026',
    createdAt: '2026-01-01T00:00:00Z'
  }
];
