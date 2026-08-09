export type ProgramCategory = 'zakat' | 'infaq' | 'shadaqah' | 'wakaf';

export type GalleryType = 'photo' | 'video' | 'artikel';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Kajian Rutin' | 'Tabligh Akbar' | 'Bakti Sosial' | 'Program Ramadhan' | 'Pendidikan & TPA' | 'Lainnya';
  mediaType: GalleryType;
  mediaUrl: string;
  videoEmbedUrl?: string;
  thumbnailUrl?: string;
  date: string;
  ustadzName?: string;
  location?: string;
  summary: string;
  articleContent: string;
  likesCount: number;
  viewsCount: number;
  tags?: string[];
  isFeatured?: boolean;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  category: ProgramCategory;
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  imageUrl: string;
  description: string;
  isUrgent?: boolean;
  featured?: boolean;
}

export interface DonationRecord {
  id: string;
  programId: string;
  programTitle: string;
  category: ProgramCategory;
  amount: number;
  uniqueCode: number;
  totalAmount: number;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  paymentMethod: string;
  isAnonymous: boolean;
  recurringPeriod?: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'berhasil' | 'menunggu_pembayaran' | 'menunggu_verifikasi' | 'ditolak';
  createdAt: string;
  transactionRef: string;
  proofUrl?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'masuk' | 'keluar';
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  proofUrl?: string;
  coaId?: string;
}

export interface PetugasJadwal {
  id: string;
  date: string;
  dayName: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  khatibJumat?: string;
  imamJumat?: string;
  muadzinJumat?: string;
  bilalJumat?: string;
  topikJumat?: string;
  timeJumat?: string;
  notesJumat?: string;
}

export interface QurbanParticipant {
  id: string;
  groupId: string;
  groupTitle: string;
  mudhahhiName: string;
  phone: string;
  sharesCount: number;
  totalPaid: number;
  paymentStatus: 'Lunas' | 'Menunggu Pembayaran';
  createdAt: string;
  transactionRef: string;
}

export interface QurbanGroup {
  id: string;
  title: string;
  animalType: 'Sapi' | 'Kambing / Domba';
  type: 'sapi_patungan' | 'kambing_individual' | 'sapi_utuh';
  pricePerShare: number;
  totalShares: number;
  filledShares: number;
  weightEstimate: string;
  imageUrl: string;
  description: string;
  isCompleted: boolean;
  participants: QurbanParticipant[];
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  condition: 'Baik' | 'Perlu Perbaikan' | 'Rusak';
  location: string;
  lastMaintenance: string;
  imageUrl?: string;
  purchasePrice?: number;
  purchaseDate?: string; // YYYY-MM-DD
  usefulLifeMonths?: number;
  accumulatedDepreciation?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Penting' | 'Kajian' | 'Kegiatan' | 'Keuangan';
  date: string;
  isPinned?: boolean;
  author: string;
  imageUrl?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  translation: string;
  latin: string;
  numberInSurah: number;
  audio?: string;
}

export interface DoaItem {
  id: string;
  title: string;
  category: 'Harian' | 'Shalat' | 'Ramadhan' | 'Rezeki' | 'Perlindungan' | 'Al-Ma\'tsurat Pagi' | 'Al-Ma\'tsurat Petang';
  arabic: string;
  latin: string;
  translation: string;
  source: string;
}

export interface HadisItem {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  narrator: string;
  source: string;
}

export interface PrayerTimeData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  dateStr: string;
  hijriDate: string;
  city: string;
}

export type ColorPalette = 'emerald_green' | 'emerald_gold' | 'deep_blue' | 'sky_blue' | 'navy_gold' | 'royal_gold';

export type ThemeMode = 'light' | 'dark';

export interface AppRole {
  id: string;
  name: string;
  type: string; // The role identifier, e.g. 'direktur', 'ketua_dkm', 'bendahara'
  permissions: string[]; // List of permission keys, e.g. 'keuangan', 'approval_budget', 'galeri', 'users'
}

export type UserRole = string;

/** Role pengurus yang dapat mengakses Portal DKM (akan divalidasi lebih longgar atau dinamis) */
export function hasDkmPortalAccess(role: UserRole): boolean {
  return role !== 'jamaah' && role !== 'user';
}

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  voucherNo: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  category: 'Zakat' | 'Infaq' | 'Wakaf' | 'Amil' | 'Operasional';
  proofUrl?: string;
}

export interface GeneralLedgerAccount {
  code: string;
  name: string;
  category: 'Aset' | 'Kewajiban' | 'Penerimaan ZISWAF' | 'Beban Operasional';
  initialBalance: number;
  totalDebit: number;
  totalCredit: number;
  endingBalance: number;
}

export interface PettyCashEntry {
  id: string;
  date: string;
  refNo: string;
  purpose: string;
  picName: string;
  type: 'Pencairan' | 'Pengeluaran';
  amount: number;
  remainingBalance: number;
  receiptProof?: string;
  proofUrl?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface HeroSlideConfig {
  url: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface AppAdminSettings {
  showAiAssistant: boolean;
  showTvSignageOption: boolean;
  showQuranModule: boolean;
  showLiveMutations: boolean;
  showTargetDonationBar: boolean;
  allowAnonymousDonation: boolean;
  runningTextTv: string;
  goldNisabPrice: number;
  bankAccountBsi: string;
  bankAccountBca: string;
  qrisMerchantName: string;
  iqamahCountdownMinutes: number;
  adzanDurationMinutes?: number;
  adzanRunningText?: string;
  iqamahRunningText?: string;
  defaultRunningText?: string;
  sholatDurationMinutes?: number;
  sholatRunningText?: string;
  hijriOffsetDays?: number;
  reportPrintLocation?: string;
  reportTembusan?: string;
  enableJumatMode?: boolean;
  jumatKhutbahDurationMinutes?: number;
  enableIdulFitriMode?: boolean;
  idulFitriRunningText?: string;
  enableIdulAdhaMode?: boolean;
  idulAdhaRunningText?: string;
  eidPrayerTime?: string;
  tvEnableSlideJumat?: boolean;
  tvEnableSlideHadis?: boolean;
  tvEnableSlideWakaf?: boolean;
  iftarNotificationDurationMinutes?: number;
  iftarRunningText?: string;
  enableImsakMode?: boolean;
  imsakNotificationDurationMinutes?: number;
  imsakRunningText?: string;
  tvSlide1Title?: string;
  tvSlide1Arabic?: string;
  tvSlide1Indo?: string;
  tvSlide1Source?: string;
  tvSlide2Title?: string;
  tvSlide2Heading?: string;
  tvSlide2Desc?: string;
  tvSlide2Target?: string;
  tvVideoUrl?: string;
  tvVideoSourceType?: 'url' | 'camera';
  tvEnableVideoSlide?: boolean;
  tvCustomSlide1Enabled?: boolean;
  tvCustomSlide1Type?: 'image' | 'video';
  tvCustomSlide1Url?: string;
  tvCustomSlide2Enabled?: boolean;
  tvCustomSlide2Type?: 'image' | 'video';
  tvCustomSlide2Url?: string;
  masjidLogoUrl?: string;
  masjidHeroPhotoUrl?: string;
  masjidHeroCarouselUrls?: string[];
  qrisCodeImageUrl?: string;
  masjidHeroSlidesConfig?: HeroSlideConfig[];

  // Promo Text Settings
  heroPromoTitle?: string;
  heroPromoSubtitle?: string;
  heroPromoDescription?: string;

  // Hero Typography & Layout Settings
  heroTitleFontSize?: 'sm' | 'md' | 'lg' | 'xl'; // sm=3xl, md=5xl, lg=6xl, xl=7xl
  heroTitleFontFamily?: 'serif' | 'sans' | 'mono';
  heroTextAlign?: 'left' | 'center';

  // Beranda Section Visibility (checkboxes for DKM to control)
  showPrayerTimesOnHome?: boolean;
  showLayananKamiOnHome?: boolean;
  showProgramCardsOnHome?: boolean;
  showFridayInfoOnHome?: boolean;
  showSocialMediaOnHome?: boolean;

  // Laporan Transparansi Toggles
  showTransZiswaf?: boolean;
  showTransPengeluaran?: boolean;
  showTransSaldoBersih?: boolean;
  showTransKeropakIn?: boolean;
  showTransKeropakOut?: boolean;
  showTransKeropakSaldo?: boolean;

  // Friday Khutbah & Feature Info Settings
  jumatDate?: string;
  jumatKhatibName?: string;
  jumatImamName?: string;
  jumatMuadzinName?: string;
  jumatTopicTitle?: string;
  jumatTimeInfo?: string;
  masjidAddressInfo?: string;
  masjidPhoneContact?: string;
  footerPengurusIds?: string[];
  featureInfoAnnouncement?: string;
  layananJamaahLinks?: Array<{
    id: string;
    title: string;
    url?: string;
    action?: 'donation' | 'calculator' | 'quran' | 'salat' | 'link';
    iconName?: string;
  }>;
  socialMediaLinks?: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
}

export interface ERPChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  normalBalance: 'Debit' | 'Credit';
  groupName?: string;
  isHeader?: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface ERPGeneralJournal {
  id: string;
  journalNo: string;
  date: string;
  description: string;
  reference?: string;
  status: 'Draft' | 'Posted';
  createdBy?: string;
  createdAt?: string;
}

export interface ERPJournalEntry {
  id: string;
  journalId: string;
  accountId: string;
  accountCode?: string; // For UI convenience
  accountName?: string; // For UI convenience
  debit: number;
  credit: number;
  description?: string;
}

export interface ERPBudgetEntry {
  id: string;
  accountId: string; // The ID of the ERPChartOfAccount
  year: number; // e.g. 2026
  amount: number; // The budget amount
  description?: string;
  createdAt?: string;
}

export interface ERPDisbursementRequest {
  id: string;
  budgetId: string; // The ID of the ERPBudgetEntry
  amount: number;
  purpose: string;
  requestDate: string;
  requestedBy: string; // User Name or Role
  status: 'Pending' | 'Verified' | 'ApprovedKetua' | 'Approved' | 'Rejected';
  verifiedBy?: string; // User Name or Role of Finance/Admin
  verificationDate?: string;
  approvedBy?: string; // User Name or Role of Director
  approvalDate?: string;
  approvalNote?: string;
  rejectionReason?: string;
}

export interface ReportSignature {
  id: string;
  reportType: string;
  period: string;
  role: string;
  signerName?: string;
  status: 'Pending' | 'Signed' | 'Rejected';
  signatureDate?: string;
  notes?: string;
}

export interface ReportSignatory {
  id: string;
  role: string; // e.g. "Dibuat Oleh"
  name: string;
  title: string; // e.g. "Bendahara DKM"
  orderIdx: number;
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  groupTitle?: string;
  roleType: string;
  imageUrl: string;
  bio?: string;
  orderIdx: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  role: string;
  action: string;
  details: string;
}

export interface JamaahProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  joinDate: string;
  lastLogin: string;
  totalDonation: number;
  role: string;
  dkmPosition?: string; // e.g. "Ketua DKM", "Wakil Ketua DKM", "Bendahara", "Sekretaris", "Jamaah"
  password?: string;
  address?: string;
  isVerified?: boolean;
  photoUrl?: string;
  monthlyDonationTarget?: number;
  targetDate?: number; // Day of the month, e.g., 25
  adhanSettings?: {
    enabled: boolean;
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    soundType: 'makkah' | 'madinah' | 'local' | 'beep';
  };
}

export interface JamaahFeedback {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  reply?: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  repliedAt?: string;
}

export interface JamaahCalendarNote {
  id: string;
  jamaahId: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  type: 'puasa' | 'kajian' | 'pribadi' | 'lainnya';
}

export interface MasjidAgenda {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm - HH:mm
  location: string;
  speaker?: string;
  description: string;
  category: 'Kajian' | 'Rapat' | 'Kegiatan' | 'Lainnya';
  imageUrl?: string;
}


export interface GedungBooking {
  id: string;
  date: string;
  name: string;
  whatsapp: string;
  email: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface KamarBooking {
  id: string;
  date: string; // Check-in date
  checkoutDate: string;
  name: string;
  whatsapp: string;
  email?: string;
  roomType: 'Standar' | 'VIP' | 'Keluarga';
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

