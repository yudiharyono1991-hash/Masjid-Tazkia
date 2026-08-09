import React, { useState, useEffect, useRef } from 'react';
import {
  FinancialTransaction,
  InventoryItem,
  PetugasJadwal,
  Announcement,
  Program,
  JournalEntry,
  GeneralLedgerAccount,
  PettyCashEntry,
  AppAdminSettings,
  GalleryItem,
  QurbanGroup,
  QurbanParticipant,
  AuditLog,
  JamaahProfile,
  DonationRecord,
  JamaahFeedback
} from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { AccountCombobox } from './AccountCombobox';
import { UserManual } from './admin/UserManual';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);
import { formatRupiahFull } from '../lib/islamicUtils';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  Send,
  Database,
  FileSpreadsheet,
  Package,
  Calendar,
  DollarSign,
  Megaphone,
  Copy,
  ShieldCheck,
  Sparkles,
  Settings,
  RefreshCw,
  BookOpen,
  FileText,
  Wallet,
  Building,
  Eye,
  EyeOff,
  Sliders,
  CheckCircle2,
  Receipt,
  Image,
  Upload,
  Camera,
  X,
  ExternalLink,
  Video,
  Play,
  Heart,
  Tv,
  Users,
  Edit3,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  LayoutDashboard,
  Clock,
  Globe,
  Calculator
} from 'lucide-react';

import { useMasjidStore } from '../lib/store';

import { ChartOfAccounts } from './accounting/ChartOfAccounts';
import { JurnalUmum } from './accounting/JurnalUmum';
import { BukuBesar } from './accounting/BukuBesar';
import { ReportPrinter } from './accounting/ReportPrinter';
import { InputAnggaran } from './accounting/InputAnggaran';
import { PencairanAnggaran } from './accounting/PencairanAnggaran';
import { AgendaAdmin } from './AgendaAdmin';
import { SewaGedungAdmin } from './SewaGedungAdmin';
import { BoardMemberAdmin } from './BoardMemberAdmin';
import { ReportSignatoryAdmin } from './ReportSignatoryAdmin';

import { AppManagerAdmin } from './AppManagerAdmin';
import { uploadMedia } from '../lib/mediaUpload';

interface PengurusDkmDashboardProps {
  financials: FinancialTransaction[];
  inventories: InventoryItem[];
  petugasList: PetugasJadwal[];
  announcements: Announcement[];
  programs: Program[];
  journalEntries?: JournalEntry[];
  glAccounts?: GeneralLedgerAccount[];
  pettyCash?: PettyCashEntry[];
  adminSettings?: AppAdminSettings;
  galleryItems?: GalleryItem[];
  qurbanGroups?: QurbanGroup[];
  auditLogs?: AuditLog[];
  jamaahProfiles?: JamaahProfile[];
  donations?: DonationRecord[];
  feedbacks?: JamaahFeedback[];
  onUpdateFeedback?: (id: string, updates: Partial<JamaahFeedback>) => void;
  onUpdateDonationStatus?: (id: string, status: 'berhasil' | 'menunggu_pembayaran' | 'menunggu_verifikasi' | 'ditolak') => void;
  onAddFinancial: (trx: Omit<FinancialTransaction, 'id'>) => void;
  onAddInventory: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateInventory?: (id: string, item: Partial<InventoryItem>) => void;
  onDeleteInventory: (id: string) => void;
  onUpdatePetugas: (petugas: PetugasJadwal) => void;
  onAddPetugasJadwal?: (p: Omit<PetugasJadwal, 'id'>) => void;
  onDeletePetugasJadwal?: (id: string) => void;
  onAddAnnouncement: (anc: Omit<Announcement, 'id' | 'date'>) => void;
  onUpdateAnnouncement?: (id: string, anc: Partial<Announcement>) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onAddProgram: (prog: Omit<Program, 'id' | 'collectedAmount' | 'donorsCount'>) => void;
  onDeleteProgram?: (id: string) => void;
  onAddJournalEntry?: (entry: Omit<JournalEntry, 'id'>) => void;
  onAddPettyCashEntry?: (entry: Omit<PettyCashEntry, 'id' | 'remainingBalance'>) => void;
  onUpdateAdminSettings?: (settings: Partial<AppAdminSettings>) => void;
  onAddGalleryItem?: (item: Omit<GalleryItem, 'id' | 'likesCount' | 'viewsCount'>) => void;
  onDeleteGalleryItem?: (id: string) => void;
  onAddQurbanGroup?: (group: Omit<QurbanGroup, 'id' | 'participants' | 'filledShares' | 'isCompleted'>) => void;
  onUpdateQurbanGroup?: (id: string, updated: Partial<QurbanGroup>) => void;
  onDeleteQurbanGroup?: (id: string) => void;
  onAddQurbanParticipant?: (groupId: string, participant: Omit<QurbanParticipant, 'id' | 'createdAt' | 'transactionRef'>) => void;
  onDeleteQurbanParticipant?: (groupId: string, participantId: string) => void;
  onUpdateQurbanParticipant?: (groupId: string, participantId: string, updated: Partial<QurbanParticipant>) => void;
  onAddJamaahProfile?: (profile: Omit<JamaahProfile, 'id' | 'joinDate' | 'lastLogin' | 'totalDonation'>) => void;
  onUpdateJamaahProfile?: (id: string, updated: Partial<JamaahProfile>) => void;
  onDeleteJamaahProfile?: (id: string) => void;
  openTvMode?: () => void;
  // The 'akuntansi' tab now serves as the main 'Modul Keuangan Terpadu'
  initialTab?: 'keuangan' | 'akuntansi' | 'inventaris' | 'petugas' | 'broadcast' | 'program' | 'pengumuman' | 'galeri' | 'qurban' | 'sewa' | 'pengaturan' | 'supabase' | 'aplikasi' | 'jamaah_manage' | 'audit_log' | 'verifikasi' | 'pengurus' | 'ttd_laporan' | 'kalender' | 'layanan_aduan';
}

export const PengurusDkmDashboard: React.FC<PengurusDkmDashboardProps> = ({
  initialTab,
  financials,
  inventories,
  petugasList,
  announcements,
  programs,
  journalEntries = [],
  glAccounts = [],
  pettyCash = [],
  adminSettings,
  galleryItems = [],
  qurbanGroups = [],
  auditLogs = [],
  jamaahProfiles = [],
  donations = [],
  feedbacks = [],
  onUpdateFeedback,
  onUpdateDonationStatus,
  onAddFinancial,
  onAddInventory,
  onUpdateInventory,
  onDeleteInventory,
  onUpdatePetugas,
  onAddPetugasJadwal,
  onDeletePetugasJadwal,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onAddProgram,
  onDeleteProgram,
  onAddJournalEntry,
  onAddPettyCashEntry,
  onUpdateAdminSettings,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onAddQurbanGroup,
  onUpdateQurbanGroup,
  onDeleteQurbanGroup,
  onAddQurbanParticipant,
  onDeleteQurbanParticipant,
  onUpdateQurbanParticipant,
  onAddJamaahProfile,
  onUpdateJamaahProfile,
  onDeleteJamaahProfile,
  openTvMode
}) => {
  const store = useMasjidStore();
  const [dkmTab, setDkmTab] = useState<'dashboard_utama' | 'keuangan' | 'akuntansi' | 'inventaris' | 'petugas' | 'broadcast' | 'program' | 'pengumuman' | 'galeri' | 'qurban' | 'sewa' | 'pengaturan' | 'supabase' | 'aplikasi' | 'jamaah_manage' | 'audit_log' | 'verifikasi' | 'pengurus' | 'ttd_laporan' | 'kalender' | 'layanan_aduan' | 'panduan'>(() => {
    // 1. Try URL first
    try {
      const urlHash = window.location.hash;
      if (urlHash.includes('?')) {
        const queryParams = new URLSearchParams(urlHash.split('?')[1]);
        const tab = queryParams.get('tab');
        if (tab) return tab as any;
      }
    } catch (e) {
      console.error('Error parsing URL for tab', e);
    }

    return initialTab || 'dashboard_utama';
  });

  useEffect(() => {
    // Update URL Hash automatically without triggering full app reload
    const currentHashBase = window.location.hash.split('?')[0];
    if (currentHashBase) {
      window.history.replaceState(null, '', `${currentHashBase}?tab=${dkmTab}`);
    }
  }, [dkmTab, store.state.session?.role]);
  const [finSubTab, setFinSubTab] = useState<'mutasi' | 'jurnal' | 'bukubesar' | 'kaskecil' | 'psak109'>('mutasi');
  const [erpSubTab, setErpSubTab] = useState<'coa' | 'jurnal_umum' | 'buku_besar' | 'anggaran' | 'pencairan' | 'laporan'>('coa');
  const [tabSearchQuery, setTabSearchQuery] = useState('');

  const tabsRef = useRef<HTMLDivElement>(null);
  const erpTabsRef = useRef<HTMLDivElement>(null);
  
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollErpTabs = (direction: 'left' | 'right') => {
    if (erpTabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      erpTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Date utils
  const getFirstDayOfMonth = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  // Audit Log State
  const [auditStartDate, setAuditStartDate] = useState(getFirstDayOfMonth());
  const [auditEndDate, setAuditEndDate] = useState(getToday());
  const [auditPage, setAuditPage] = useState(1);
  const auditPerPage = 10;

  // Jamaah Master Data State
  const [jamaahPage, setJamaahPage] = useState(1);
  const jamaahPerPage = 20;
  const [expandedJamaahId, setExpandedJamaahId] = useState<string | null>(null);

  // Zustand Store (Moved to top to prevent ReferenceError)
  // const store = useMasjidStore();

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Preview Modal State for Photos
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // Gallery Management Form Inputs
  const [showAddGal, setShowAddGal] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galSubtitle, setGalSubtitle] = useState('');
  const [galCategory, setGalCategory] = useState<'Kajian Rutin' | 'Tabligh Akbar' | 'Bakti Sosial' | 'Program Ramadhan' | 'Pendidikan & TPA' | 'Lainnya'>('Kajian Rutin');
  const [galMediaType, setGalMediaType] = useState<'photo' | 'video' | 'artikel'>('video');
  const [galMediaUrl, setGalMediaUrl] = useState('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80');
  const [galVideoEmbedUrl, setGalVideoEmbedUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [galUstadz, setGalUstadz] = useState('');
  const [galSummary, setGalSummary] = useState('');
  const [galArticleContent, setGalArticleContent] = useState('');
  const [galTagsStr, setGalTagsStr] = useState('Kajian, Sentul');

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle || !galArticleContent) return;
    const tags = galTagsStr.split(',').map(t => t.trim()).filter(Boolean);
    if (onAddGalleryItem) {
      onAddGalleryItem({
        title: galTitle,
        subtitle: galSubtitle,
        category: galCategory,
        mediaType: galMediaType,
        mediaUrl: galMediaUrl,
        videoEmbedUrl: galMediaType === 'video' ? galVideoEmbedUrl : undefined,
        date: new Date().toISOString().split('T')[0],
        ustadzName: galUstadz,
        summary: galSummary || galTitle,
        articleContent: galArticleContent,
        tags
      });
      setShowAddGal(false);
      setGalTitle('');
      setGalSubtitle('');
      setGalSummary('');
      setGalArticleContent('');
    }
  };

  // Form Modals / Toggles
  const [showAddTrx, setShowAddTrx] = useState(false);
  const [newTrxType, setNewTrxType] = useState<'masuk' | 'keluar'>('masuk');
  const [newTrxTitle, setNewTrxTitle] = useState('');
  const [newTrxCategory, setNewTrxCategory] = useState('Infaq');
  const [newTrxAmount, setNewTrxAmount] = useState(100000);
  const [newTrxDesc, setNewTrxDesc] = useState('');
  const [newTrxProofUrl, setNewTrxProofUrl] = useState('https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=800&q=80');
  const [newTrxCoa, setNewTrxCoa] = useState('coa-1101');

  // Jurnal Umum Form Inputs
  const [showAddJrn, setShowAddJrn] = useState(false);
  const [jrnVoucher, setJrnVoucher] = useState(`VCH-${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2,'0')}/0${Math.floor(Math.random()*90+10)}`);
  const [jrnAccountCode, setJrnAccountCode] = useState('1101');
  const [jrnAccountName, setJrnAccountName] = useState('Kas Utama Operasional Masjid');
  const [jrnDebit, setJrnDebit] = useState(500000);
  const [jrnCredit, setJrnCredit] = useState(0);
  const [jrnCategory, setJrnCategory] = useState<'Zakat' | 'Infaq' | 'Wakaf' | 'Amil' | 'Operasional'>('Infaq');
  const [jrnDesc, setJrnDesc] = useState('');

  // Kas Kecil Form Inputs
  const [showAddKasKecil, setShowAddKasKecil] = useState(false);
  const [kcPurpose, setKcPurpose] = useState('');
  const [kcPic, setKcPic] = useState('Pengurus DKM');
  const [kcType, setKcType] = useState<'Pencairan' | 'Pengeluaran'>('Pengeluaran');
  const [kcAmount, setKcAmount] = useState(250000);
  const [kcProof, setKcProof] = useState('Kuitansi / Nota Resmi');
  const [kcProofUrl, setKcProofUrl] = useState('https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=800&q=80');

  // Inventory Modal Inputs
  const [showAddInv, setShowAddInv] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState('Elektronik');
  const [invQty, setInvQty] = useState(1);
  const [invUnit, setInvUnit] = useState('Unit');
  const [invCondition, setInvCondition] = useState<'Baik' | 'Perlu Perbaikan' | 'Rusak'>('Baik');
  const [invLocation, setInvLocation] = useState('Ruang Utama');
  const [invImageUrl, setInvImageUrl] = useState('https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=800&q=80');
  const [invPurchasePrice, setInvPurchasePrice] = useState<number>(0);
  const [invPurchaseDate, setInvPurchaseDate] = useState<string>('');
  const [invUsefulLifeMonths, setInvUsefulLifeMonths] = useState<number>(0);

  // Broadcast WA Input
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Program Input Modal
  const [showAddProg, setShowAddProg] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progSubtitle, setProgSubtitle] = useState('');
  const [progCategory, setProgCategory] = useState<'zakat' | 'infaq' | 'shadaqah' | 'wakaf'>('wakaf');
  const [progTarget, setProgTarget] = useState(1000000000);
  const [progDesc, setProgDesc] = useState('');
  const [progImageUrl, setProgImageUrl] = useState('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80');

  // Pengumuman Input
  const [showAddAnc, setShowAddAnc] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancCategory, setAncCategory] = useState<'Penting' | 'Kajian' | 'Kegiatan' | 'Keuangan'>('Kajian');
  const [ancAuthor, setAncAuthor] = useState('Pengurus DKM Tazkia');
  const [ancImageUrl, setAncImageUrl] = useState('https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=800&q=80');

  // Admin Settings Image States - URL dari Supabase Storage atau store
  const [logoUrlInput, setLogoUrlInput] = useState(adminSettings?.masjidLogoUrl || '/logo.png');
  const [heroUrlInput, setHeroUrlInput] = useState(adminSettings?.masjidHeroCarouselUrls?.join(', ') || adminSettings?.masjidHeroPhotoUrl || '/hero-1.jpg');
  const [qrisUrlInput, setQrisUrlInput] = useState(adminSettings?.qrisCodeImageUrl || '');

  // Settings Saved State Notification
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Qurban management states
  const [showAddQurbanGroupForm, setShowAddQurbanGroupForm] = useState(false);
  const [editingQurbanGroupId, setEditingQurbanGroupId] = useState<string | null>(null);
  const [qurbanGroupTitle, setQurbanGroupTitle] = useState('');
  const [qurbanAnimalType, setQurbanAnimalType] = useState<'SAPI' | 'KAMBING / DOMBA'>('SAPI');
  const [qurbanWeightEstimate, setQurbanWeightEstimate] = useState('');
  const [qurbanPricePerShare, setQurbanPricePerShare] = useState(3500000);
  const [qurbanTotalShares, setQurbanTotalShares] = useState(7);
  const [qurbanImageUrl, setQurbanImageUrl] = useState('https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80');

  // Shohibul Qurban states
  const [addingParticipantGroupId, setAddingParticipantGroupId] = useState<string | null>(null);
  const [editingParticipantData, setEditingParticipantData] = useState<{ groupId: string; participantId: string } | null>(null);
  const [shohibulName, setShohibulName] = useState('');
  const [shohibulSharesCount, setShohibulSharesCount] = useState(1);
  const [shohibulTotalPaid, setShohibulTotalPaid] = useState(3500000);
  const [shohibulPhone, setShohibulPhone] = useState('');

  // User management states
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUserProfileId, setEditingUserProfileId] = useState<string | null>(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormRole, setUserFormRole] = useState<'jamaah' | 'dkm' | 'super_admin'>('jamaah');
  const [userFormPosition, setUserFormPosition] = useState('Jamaah');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [changingPasswordUserId, setChangingPasswordUserId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  const handleSaveQurbanGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qurbanGroupTitle) return;
    if (editingQurbanGroupId) {
      if (onUpdateQurbanGroup) {
        onUpdateQurbanGroup(editingQurbanGroupId, {
          title: qurbanGroupTitle,
          animalType: qurbanAnimalType,
          weightEstimate: qurbanWeightEstimate,
          pricePerShare: Number(qurbanPricePerShare),
          totalShares: Number(qurbanTotalShares),
          imageUrl: qurbanImageUrl
        });
      }
      setEditingQurbanGroupId(null);
    } else {
      if (onAddQurbanGroup) {
        onAddQurbanGroup({
          title: qurbanGroupTitle,
          animalType: qurbanAnimalType,
          weightEstimate: qurbanWeightEstimate,
          pricePerShare: Number(qurbanPricePerShare),
          totalShares: Number(qurbanTotalShares),
          imageUrl: qurbanImageUrl
        });
      }
    }
    setShowAddQurbanGroupForm(false);
    setQurbanGroupTitle('');
    setQurbanWeightEstimate('');
    setEditingQurbanGroupId(null);
  };

  const handleEditQurbanGroup = (group: any) => {
    setEditingQurbanGroupId(group.id);
    setQurbanGroupTitle(group.title);
    setQurbanAnimalType(group.animalType);
    setQurbanWeightEstimate(group.weightEstimate);
    setQurbanPricePerShare(group.pricePerShare);
    setQurbanTotalShares(group.totalShares);
    setQurbanImageUrl(group.imageUrl);
    setShowAddQurbanGroupForm(true);
  };

  const handleDeleteQurbanGroup = (id: string) => {
    if (window.confirm('Hapus kelompok qurban ini beserta seluruh anggotanya?')) {
      if (onDeleteQurbanGroup) onDeleteQurbanGroup(id);
    }
  };

  const handleSaveParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shohibulName) return;

    if (editingParticipantData) {
      if (onUpdateQurbanParticipant) {
        onUpdateQurbanParticipant(editingParticipantData.groupId, editingParticipantData.participantId, {
          mudhahhiName: shohibulName,
          sharesCount: Number(shohibulSharesCount),
          totalPaid: Number(shohibulTotalPaid),
          phone: shohibulPhone
        });
      }
      setEditingParticipantData(null);
    } else if (addingParticipantGroupId) {
      if (onAddQurbanParticipant) {
        onAddQurbanParticipant(addingParticipantGroupId, {
          mudhahhiName: shohibulName,
          sharesCount: Number(shohibulSharesCount),
          totalPaid: Number(shohibulTotalPaid),
          phone: shohibulPhone,
          groupTitle: qurbanGroups.find(g => g.id === addingParticipantGroupId)?.title || ''
        });
      }
      setAddingParticipantGroupId(null);
    }

    setShohibulName('');
    setShohibulPhone('');
    setAddingParticipantGroupId(null);
    setEditingParticipantData(null);
  };

  const handleEditParticipant = (groupId: string, p: any) => {
    setEditingParticipantData({ groupId, participantId: p.id });
    setShohibulName(p.mudhahhiName);
    setShohibulSharesCount(p.sharesCount);
    setShohibulTotalPaid(p.totalPaid);
    setShohibulPhone(p.phone || '');
  };

  const handleDeleteParticipant = (groupId: string, participantId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus shohibul qurban ini dari kelompok?')) {
      if (onDeleteQurbanParticipant) onDeleteQurbanParticipant(groupId, participantId);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormName || !userFormEmail) return;

    if (editingUserProfileId) {
      if (onUpdateJamaahProfile) {
        onUpdateJamaahProfile(editingUserProfileId, {
          name: userFormName,
          email: userFormEmail,
          phone: userFormPhone,
          role: userFormRole,
          dkmPosition: userFormPosition,
          ...(userFormPassword ? { password: userFormPassword } : {})
        });
      }
      setEditingUserProfileId(null);
      showToast('Alhamdulillah, Akun Pengguna berhasil diperbarui! ✓');
    } else {
      if (onAddJamaahProfile) {
        onAddJamaahProfile({
          name: userFormName,
          email: userFormEmail,
          phone: userFormPhone,
          role: userFormRole,
          dkmPosition: userFormPosition,
          password: userFormPassword || '123456'
        });
      }
      showToast('Alhamdulillah, Pengurus/Jamaah baru berhasil didaftarkan! ✓');
    }

    // Reset Form
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPhone('');
    setUserFormRole('jamaah');
    setUserFormPosition('Jamaah');
    setUserFormPassword('');
    setShowAddUserForm(false);
  };

  const handleEditUser = (user: JamaahProfile) => {
    setEditingUserProfileId(user.id);
    setUserFormName(user.name);
    setUserFormEmail(user.email);
    setUserFormPhone(user.phone || '');
    setUserFormRole(user.role);
    setUserFormPosition(user.dkmPosition || 'Jamaah');
    setUserFormPassword(user.password || '');
    setShowAddUserForm(true);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      if (onDeleteJamaahProfile) onDeleteJamaahProfile(id);
    }
  };

  const handleUpdatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPasswordUserId || !newPasswordVal) return;
    if (onUpdateJamaahProfile) {
      onUpdateJamaahProfile(changingPasswordUserId, {
        password: newPasswordVal
      });
    }
    setChangingPasswordUserId(null);
    setNewPasswordVal('');
    showToast('Alhamdulillah, kata sandi berhasil diubah! ✓');
  };

  // Helper file uploader - simpan ke IndexedDB untuk kapasitas besar
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    folder?: 'logo' | 'hero' | 'qris' | 'gallery' | 'pengurus' | 'booking' | 'program'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Langsung tampilkan preview lokal dulu (agar tidak menunggu)
    const reader = new FileReader();
    reader.onload = async (event) => {
      const localUrl = event.target?.result as string;
      setUrl(localUrl); // tampilkan preview

      // Upload ke Supabase Storage di background
      if (folder) {
        showToast(`Mengunggah ${file.name} ke server...`, 'success');
        const result = await uploadMedia(file, folder);
        if (!result.isLocal) {
          setUrl(result.url); // ganti dengan URL Supabase
          showToast(`✅ ${file.name} berhasil disimpan ke server! Bisa diakses dari perangkat lain.`, 'success');
        } else {
          showToast(`⚠️ Tersimpan lokal saja. Pastikan bucket 'masjid-media' sudah dibuat di Supabase.`, 'error');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTrx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrxTitle || newTrxAmount <= 0) return;
    onAddFinancial({
      type: newTrxType,
      title: newTrxTitle,
      category: newTrxCategory,
      amount: newTrxAmount,
      date: new Date().toISOString().split('T')[0],
      description: newTrxDesc || 'Pencatatan DKM Tazkia',
      proofUrl: newTrxProofUrl,
      coaId: newTrxCoa
    });
    setNewTrxTitle('');
    setShowAddTrx(false);
    showToast('Alhamdulillah, Transaksi berhasil disimpan! ✓');
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jrnDesc || (!jrnDebit && !jrnCredit)) return;
    if (onAddJournalEntry) {
      onAddJournalEntry({
        date: new Date().toISOString().split('T')[0],
        voucherNo: jrnVoucher,
        accountCode: jrnAccountCode,
        accountName: jrnAccountName,
        debit: Number(jrnDebit),
        credit: Number(jrnCredit),
        category: jrnCategory,
        description: jrnDesc
      });
    }
    setJrnDesc('');
    setShowAddJrn(false);
    showToast('Alhamdulillah, Jurnal berhasil disimpan! ✓');
  };

  const handleCreateKasKecil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kcPurpose || kcAmount <= 0) return;
    if (onAddPettyCashEntry) {
      onAddPettyCashEntry({
        date: new Date().toISOString().split('T')[0],
        refNo: `PKC-${Math.floor(10 + Math.random()*90)}`,
        purpose: kcPurpose,
        picName: kcPic,
        type: kcType,
        amount: kcAmount,
        receiptProof: kcProof,
        proofUrl: kcProofUrl
      });
    }
    setKcPurpose('');
    setShowAddKasKecil(false);
    showToast('Alhamdulillah, Transaksi Kas Kecil berhasil disimpan! ✓');
  };

  const handleCreateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName) return;
    
    if (editingInventoryId) {
      if (onUpdateInventory) {
        onUpdateInventory(editingInventoryId, {
          name: invName,
          category: invCategory,
          quantity: invQty,
          unit: invUnit,
          condition: invCondition,
          location: invLocation,
          imageUrl: invImageUrl,
          purchasePrice: invPurchasePrice,
          purchaseDate: invPurchaseDate,
          usefulLifeMonths: invUsefulLifeMonths
        });
      }
      setEditingInventoryId(null);
      showToast('Alhamdulillah, Inventaris Aset berhasil diperbarui! ✓');
    } else {
      const code = `INV-${Math.floor(100 + Math.random() * 900)}`;
      onAddInventory({
        code,
        name: invName,
        category: invCategory,
        quantity: invQty,
        unit: invUnit,
        condition: invCondition,
        location: invLocation,
        lastMaintenance: new Date().toISOString().split('T')[0],
        imageUrl: invImageUrl,
        purchasePrice: invPurchasePrice,
        purchaseDate: invPurchaseDate,
        usefulLifeMonths: invUsefulLifeMonths
      });
      showToast('Alhamdulillah, Inventaris Aset baru berhasil ditambah! ✓');
    }
    setInvName('');
    setShowAddInv(false);
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle) return;
    onAddProgram({
      title: progTitle,
      subtitle: progSubtitle || 'Program Kebaikan DKM Tazkia',
      category: progCategory,
      targetAmount: progTarget,
      imageUrl: progImageUrl || 'https://images.unsplash.com/photo-1609599006352-d35d9472e1c3?auto=format&fit=crop&w=800&q=80',
      description: progDesc || 'Deskripsi program sosial dan ZISWAF.'
    });
    setProgTitle('');
    setShowAddProg(false);
    showToast('Alhamdulillah, Program/Campaign baru berhasil dipublikasi! ✓');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;

    if (editingAnnouncementId) {
      if (onUpdateAnnouncement) {
        onUpdateAnnouncement(editingAnnouncementId, {
          title: ancTitle,
          content: ancContent,
          category: ancCategory,
          author: ancAuthor || 'Pengurus DKM Tazkia',
          imageUrl: ancImageUrl
        });
      }
      setEditingAnnouncementId(null);
      showToast('Alhamdulillah, Pengumuman berhasil diperbarui! ✓');
    } else {
      if (onAddAnnouncement) {
        onAddAnnouncement({
          title: ancTitle,
          content: ancContent,
          category: ancCategory,
          author: ancAuthor || 'Pengurus DKM Tazkia',
          imageUrl: ancImageUrl,
          isPinned: true
        });
      }
      showToast('Alhamdulillah, Pengumuman berhasil dipublikasi! ✓');
    }
    setAncTitle('');
    setAncContent('');
    setShowAddAnc(false);
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSaveAdminPhotos = () => {
    if (!onUpdateAdminSettings) {
      showToast('Gagal: Pengaturan admin tidak tersedia.', 'error');
      return;
    }
    onUpdateAdminSettings({
      masjidLogoUrl: logoUrlInput,
      masjidHeroPhotoUrl: heroUrlInput.split(',')[0].trim(),
      masjidHeroCarouselUrls: heroUrlInput.split(',').map(u => u.trim()).filter(Boolean),
      qrisCodeImageUrl: qrisUrlInput
    });
    showToast('Alhamdulillah, Foto & Media Masjid berhasil disimpan!');
  };

  const handleSendWaBroadcast = () => {
    if (!broadcastMessage) return;
    const text = encodeURIComponent(
      `📢 *BROADCAST RESMI Masjid Tazkia*\n` +
      `*${broadcastTitle || 'Pengumuman Jamaah'}*\n\n` +
      `${broadcastMessage}\n\n` +
      `_Pesan otomatis dikirim oleh Portal DKM Masjid Tazkia._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleToggleSetting = (key: keyof AppAdminSettings) => {
    if (!adminSettings || !onUpdateAdminSettings) return;
    onUpdateAdminSettings({
      [key]: !adminSettings[key]
    });
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 2000);
  };

  const handleTextSettingChange = (key: keyof AppAdminSettings, val: any) => {
    if (!onUpdateAdminSettings) return;
    onUpdateAdminSettings({
      [key]: val
    });
    setSavedSettingsMsg(true);
    showToast('Pengaturan Khutbah/Fitur otomatis tersimpan', 'success');
    setTimeout(() => setSavedSettingsMsg(false), 2000);
  };

  return (
    <section className="py-12 bg-[#0b1329] text-blue-100 min-h-screen print:bg-white print:text-black print:p-0 print:min-h-0">
      {/* ===== TOAST NOTIFICATION ===== */}
      {toastMsg && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold transition-all animate-fadeIn print:hidden ${
          toastMsg.type === 'success'
            ? 'bg-emerald-900 border-emerald-500/50 text-emerald-200'
            : 'bg-red-900 border-red-500/50 text-red-200'
        }`}>
          <span className="text-lg">{toastMsg.type === 'success' ? '✅' : '❌'}</span>
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Bar */}
        <div className="bg-gradient-to-r from-blue-950/80 via-blue-900 to-blue-950/80 border border-blue-500/30 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                Portal Admin & Pengurus DKM Tazkia Sentul
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border border-amber-500/30 shadow-sm flex items-center gap-1.5">
                  👤 {store.state.session?.name}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border border-emerald-500/30 shadow-sm flex items-center gap-1.5">
                  🛡️ Role: {store.state.appRoles.find(r => r.id === store.state.session?.role)?.name || 'Pengurus / Administrator'}
                </span>
                {openTvMode && (
                  <button
                    onClick={openTvMode}
                    className="ml-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-blue-950 px-2 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
                    title="Buka Tampilan TV Masjid"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Display TV</span>
                  </button>
                )}
                <button
                  onClick={handleRefreshClick}
                  disabled={isRefreshing}
                  className={`ml-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white px-2 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Refresh Sistem"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh Data</span>
                </button>
              </div>
              <p className="text-xs text-blue-400 mt-0.5">
                {dkmTab === 'dashboard_utama' ? 'Ringkasan aktivitas, statistik, dan status operasional harian Masjid Tazkia' : 
                 dkmTab === 'akuntansi' ? 'Modul Akuntansi & Keuangan Terpadu (Jurnal, Buku Besar, Kas Kecil, Neraca)' :
                 dkmTab === 'keuangan' ? 'Pencatatan pemasukan, pengeluaran, mutasi kas bank, dan rekap sederhana' :
                 dkmTab === 'inventaris' ? 'Pencatatan aset, barang masuk/keluar, dan kondisi inventaris masjid' :
                 dkmTab === 'qurban' ? 'Sistem patungan Qurban, pembagian porsi, dan laporan penyembelihan' :
                 dkmTab === 'sewa' ? 'Manajemen booking ruangan, penyewaan gedung, dan jadwal pemakaian' :
                 dkmTab === 'galeri' ? 'Manajemen foto, video dokumentasi, dan artikel kajian masjid' :
                 dkmTab === 'program' ? 'Manajemen program ZISWAF, Kampanye Donasi, dan target pengumpulan' :
                 dkmTab === 'pengumuman' ? 'Pengaturan papan informasi, agenda, dan pengumuman jamaah' :
                 dkmTab === 'petugas' ? 'Jadwal Muadzin, Imam, Khotib, dan petugas operasional masjid' :
                 dkmTab === 'broadcast' ? 'Kirim pesan siaran (WhatsApp/Email) massal ke Jamaah' :
                 dkmTab === 'pengaturan' ? 'Pengaturan sistem, hak akses, dan preferensi modul aplikasi' :
                 dkmTab === 'aplikasi' ? 'Pengaturan profil masjid, estetika UI, dan tema aplikasi' :
                 dkmTab === 'jamaah_manage' ? 'Data induk jamaah, histori donasi, dan manajemen profil' :
                 dkmTab === 'audit_log' ? 'Catatan aktivitas sistem dan riwayat aksi pengurus (Log Audit)' :
                 dkmTab === 'verifikasi' ? 'Pusat verifikasi transaksi donasi manual dan transfer bank' :
                 dkmTab === 'pengurus' ? 'Manajemen data pengurus, DKM, dewan pembina, dan peran sistem' :
                 dkmTab === 'ttd_laporan' ? 'Persetujuan dan tanda tangan digital dokumen & laporan keuangan' :
                 dkmTab === 'kalender' ? 'Kalender hijriah, jadwal waktu sholat, dan agenda tahunan' :
                 dkmTab === 'layanan_aduan' ? 'Pusat bantuan, umpan balik, kritik & saran dari jamaah' :
                 dkmTab === 'panduan' ? 'Buku panduan penggunaan sistem ERP Masjid Tazkia untuk setiap peran' :
                 'Sistem ERP Manajemen Terpadu Masjid Tazkia Sentul'}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        {/* Mobile: Dropdown Select */}
        <div className="sm:hidden bg-blue-950 p-3 rounded-2xl border border-blue-800 print:hidden">
          <label className="text-[10px] font-mono text-blue-400 block mb-1.5 uppercase tracking-wider">Pilih Menu Dashboard:</label>
          <select
            value={dkmTab}
            onChange={e => setDkmTab(e.target.value as any)}
            className="w-full bg-blue-900 border border-blue-700 text-white text-sm font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer"
          >
            {[
              { id: 'dashboard_utama', label: 'Ringkasan Utama' },
              { id: 'akuntansi', label: 'Keuangan Terpadu' },
              { id: 'panduan', label: 'Buku Panduan' },
              { id: 'galeri', label: 'Galeri & Artikel Kajian' },
              { id: 'qurban', label: 'Patungan Qurban' },
              { id: 'sewa', label: 'Sewa & Booking' },
              { id: 'kalender', label: 'Kalender & Agenda' },
              { id: 'aplikasi', label: 'Pengaturan Aplikasi' },
              { id: 'pengaturan', label: 'Pengaturan Admin & Foto' },
              { id: 'pengurus', label: 'Profil & Pengurus' },
              { id: 'ttd_laporan', label: 'Tanda Tangan Laporan' },
              { id: 'inventaris', label: 'Inventaris & Foto Aset' },
              { id: 'program', label: 'Program & Campaign' },
              { id: 'pengumuman', label: 'Pengumuman & Berita' },
              { id: 'petugas', label: 'Jadwal Petugas & Jumat' },
              { id: 'broadcast', label: 'Broadcast WhatsApp' },
              { id: 'verifikasi', label: 'Verifikasi ZISWAF' },
              { id: 'audit_log', label: 'Audit Log System' }
            ].filter(tab => {
              const r = store.state.session?.role;
              const isTopManagement = ['direktur', 'ketua_dkm', 'ketua_dewan_pembina'].includes(r || '');
              const isConfidential = ['aplikasi', 'pengaturan', 'jamaah_manage', 'supabase', 'audit_log', 'ttd_laporan', 'pengurus'].includes(tab.id);
              if (isConfidential && !isTopManagement) return false;
              if (tabSearchQuery) {
                return tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase());
              }
              return true;
            }).map(tab => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>
        {/* Desktop: Horizontal Tabs with Search */}
        <div className="hidden sm:flex flex-col gap-3 print:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-blue-400" />
            </div>
            <input
              type="text"
              name="tab_search_query"
              autoComplete="off"
              placeholder="Cari fitur atau pengaturan (misal: 'sewa', 'galeri', 'pengguna')..."
              value={tabSearchQuery}
              onChange={(e) => setTabSearchQuery(e.target.value)}
              className="w-full bg-blue-900 border border-blue-700 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          
          <div className="relative group bg-blue-950 p-2 rounded-2xl border-b border-blue-800 flex items-center">
            <button
              onClick={() => scrollTabs('left')}
              className="absolute left-0 z-10 p-2 bg-gradient-to-r from-blue-950 via-blue-950 to-transparent text-blue-300 hover:text-white h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div ref={tabsRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth w-full px-6">
            {[
              { id: 'dashboard_utama', label: 'Ringkasan Utama', icon: LayoutDashboard },
              { id: 'akuntansi', label: 'Modul Keuangan Terpadu', icon: BookOpen },
              { id: 'panduan', label: 'Buku Panduan', icon: BookOpen },
              { id: 'galeri', label: 'Galeri & Artikel Kajian', icon: Video },
              { id: 'qurban', label: 'Patungan Qurban', icon: Heart },
              { id: 'sewa', label: 'Sewa & Booking', icon: Building },
              { id: 'kalender', label: 'Kalender & Agenda', icon: Calendar },
              { id: 'aplikasi', label: 'Pengaturan Aplikasi', icon: Settings },
              { id: 'pengaturan', label: 'Pengaturan Dasar', icon: Settings },
              { id: 'jamaah_manage', label: 'Manajemen Akun & Role', icon: Heart },
              { id: 'layanan_aduan', label: 'Layanan Aduan', icon: MessageCircle },
              { id: 'supabase', label: 'Konfigurasi Supabase', icon: Database },
              { id: 'pengurus', label: 'Profil & Pengurus', icon: Users },
              { id: 'ttd_laporan', label: 'Tanda Tangan Laporan', icon: Edit3 },
              { id: 'inventaris', label: 'Inventaris & Foto Aset', icon: Package },
              { id: 'program', label: 'Program & Campaign', icon: Sparkles },
              { id: 'pengumuman', label: 'Pengumuman & Berita', icon: Image },
              { id: 'petugas', label: 'Jadwal Petugas & Jumat', icon: Calendar },
              { id: 'broadcast', label: 'Broadcast WhatsApp', icon: Megaphone },
              { id: 'audit_log', label: 'Audit Log System', icon: BookOpen }
            ]
            .filter(tab => tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase()))
            .map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDkmTab(tab.id as any)}
                  className={`shrink-0 py-3.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    dkmTab === tab.id
                      ? 'bg-blue-500 text-blue-950 shadow-md shadow-blue-500/20 font-extrabold'
                      : 'text-white hover:text-orange-400 hover:bg-blue-900'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
            
            {tabSearchQuery && [
              { id: 'akuntansi', label: 'Modul Keuangan Terpadu' },
            ].filter(tab => tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase())).length === 0 && (
              <div className="flex-1 py-2 text-center text-blue-400 text-xs italic">
                Fitur tidak ditemukan
              </div>
            )}
            </div>
            <button
              onClick={() => scrollTabs('right')}
              className="absolute right-0 z-10 p-2 bg-gradient-to-l from-blue-950 via-blue-950 to-transparent text-blue-300 hover:text-white h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {dkmTab === 'kalender' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AgendaAdmin />
          </div>
        )}

        {/* TAB 2: GALERI & ARTIKEL KAJIAN UNLIMITED */}
        {dkmTab === 'galeri' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-900 border border-blue-800 p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-300" />
                  <span>Manajemen Galeri Media & Artikel Kajian Unlimited</span>
                </h3>
                <p className="text-xs text-blue-400 mt-1">
                  Upload video YouTube kajian, foto dokumentasi kegiatan real pict, serta artikel berita & ilmu keislaman yang dipublikasikan langsung ke jamaah.
                </p>
              </div>

              <button
                onClick={() => setShowAddGal(!showAddGal)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0 border border-blue-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Media / Artikel Kajian</span>
              </button>
            </div>

            {/* Form Modal for Add Gallery/Article */}
            {showAddGal && (
              <form onSubmit={handleCreateGalleryItem} className="bg-blue-900 border-2 border-blue-500/40 p-6 rounded-2xl space-y-5 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                  <h4 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-300" />
                    <span>Form Publikasi Galeri Media & Artikel Baru</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddGal(false)}
                    className="text-blue-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Judul Artikel / Video / Kegiatan:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tabligh Akbar - Fiqih Muamalah & ZISWAF..."
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      required
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Sub-Judul / Label Pendukung:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kajian Spesial Ahad..."
                      value={galSubtitle}
                      onChange={(e) => setGalSubtitle(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Jenis Media Publikasi:
                    </label>
                    <select
                      value={galMediaType}
                      onChange={(e) => setGalMediaType(e.target.value as any)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400 font-bold"
                    >
                      <option value="video">Video Kajian (YouTube / Video)</option>
                      <option value="photo">Foto Dokumentasi Kegiatan</option>
                      <option value="artikel">Artikel / Berita Tulis</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Kategori Kajian / Kegiatan:
                    </label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as any)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400 font-bold"
                    >
                      <option value="Kajian Rutin">Kajian Rutin</option>
                      <option value="Tabligh Akbar">Tabligh Akbar</option>
                      <option value="Bakti Sosial">Bakti Sosial</option>
                      <option value="Program Ramadhan">Program Ramadhan</option>
                      <option value="Pendidikan & TPA">Pendidikan & TPA</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Nama Penceramah / Ustadz:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dr. KH. M. Hidayatullah, M.A."
                      value={galUstadz}
                      onChange={(e) => setGalUstadz(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Media Thumbnail & Video Embed URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-950 p-4 rounded-xl border border-blue-800">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-blue-300" />
                        <span>Foto Sampul / Poster Dokumentasi</span>
                      </label>
                      <label className="cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>Upload Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setGalMediaUrl)}
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={galMediaUrl}
                      onChange={(e) => setGalMediaUrl(e.target.value)}
                      className="w-full bg-blue-900 border border-blue-800 text-blue-200 text-xs rounded-xl px-3 py-2 outline-none"
                    />

                    {galMediaUrl && (
                      <img
                        src={galMediaUrl}
                        alt="Preview"
                        className="w-20 h-12 rounded-lg object-cover border border-blue-500/40"
                      />
                    )}
                  </div>

                  {galMediaType === 'video' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-blue-300 block">
                        URL Embed Video YouTube:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: https://www.youtube.com/embed/XXXXX"
                        value={galVideoEmbedUrl}
                        onChange={(e) => setGalVideoEmbedUrl(e.target.value)}
                        className="w-full bg-blue-900 border border-blue-800 text-blue-200 text-xs rounded-xl px-3 py-2 outline-none font-mono"
                      />
                      <p className="text-[10px] text-blue-400">
                        Format URL embed YouTube disarankan: <code className="text-amber-300">https://www.youtube.com/embed/ID_VIDEO</code>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-300 block mb-1">
                    Ringkasan Singkat (Summary):
                  </label>
                  <input
                    type="text"
                    placeholder="Singkat 1-2 kalimat untuk pratinjau kartu media..."
                    value={galSummary}
                    onChange={(e) => setGalSummary(e.target.value)}
                    className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-300 block mb-1">
                    Isi Artikel Lengkap Unlimited (Dapat Menampung Teks Panjang):
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tuliskan ulasan kajian, transkrip khutbah, atau laporan lengkap kegiatan. Pisahkan paragraf dengan baris baru."
                    value={galArticleContent}
                    onChange={(e) => setGalArticleContent(e.target.value)}
                    required
                    className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl p-3.5 outline-none focus:border-blue-400 leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-300 block mb-1">
                    Tag Kata Kunci (Dipisahkan Koma):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: KajianSentul, Fiqih, ZISWAF, Ramadhan"
                    value={galTagsStr}
                    onChange={(e) => setGalTagsStr(e.target.value)}
                    className="w-full bg-blue-950 border border-blue-800 text-blue-300 font-mono text-xs rounded-xl px-3.5 py-2 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs text-blue-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-md border border-blue-400/30"
                  >
                    Terbitkan Ke Galeri Publik
                  </button>
                </div>
              </form>
            )}

            {/* List Table of Published Gallery Items */}
            <div className="bg-blue-900 border border-blue-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 bg-blue-950 border-b border-blue-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">
                  Daftar Media & Artikel Terbit ({galleryItems.length} Item)
                </span>
                <span className="text-[11px] text-blue-400">
                  Dapat diperbarui langsung kapan saja oleh Pengurus DKM
                </span>
              </div>

              <div className="divide-y divide-blue-800">
                {galleryItems.map(item => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-blue-700 cursor-pointer shrink-0"
                        onClick={() => setPreviewPhotoUrl(item.mediaUrl)}
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-blue-500/20 text-blue-300 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                            {item.mediaType}
                          </span>
                          <span className="text-[10px] text-blue-500 font-mono">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-white text-sm">
                          {item.title}
                        </h4>
                        {item.ustadzName && (
                          <p className="text-xs text-blue-300 font-mono">
                            Penceramah: {item.ustadzName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-blue-400 self-end sm:self-auto">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-300" />
                        {item.viewsCount}
                      </span>
                      {onDeleteGalleryItem && (
                        <button
                          onClick={() => onDeleteGalleryItem(item.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors"
                          title="Hapus Artikel / Media Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {dkmTab === 'sewa' && (
          <SewaGedungAdmin />
        )}

        {/* 0. VERIFIKASI ZISWAF */}
        {dkmTab === 'verifikasi' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Verifikasi Bukti Transfer ZISWAF</h3>
                <p className="text-xs text-blue-400 mt-1">Daftar transaksi ZISWAF jamaah yang menunggu verifikasi DKM</p>
              </div>
              <button
                onClick={() => {
                  const programId = programs.length > 0 ? programs[0].id : 'PRG-DUMMY';
                  const programTitle = programs.length > 0 ? programs[0].title : 'Program Dummy';
                  store.addDonation({
                    programId,
                    programTitle,
                    category: 'infaq',
                    amount: 50000,
                    uniqueCode: 123,
                    totalAmount: 50123,
                    donorName: 'Hamba Allah (Simulasi)',
                    donorPhone: '08123456789',
                    paymentMethod: 'Transfer BSI',
                    isAnonymous: false,
                    status: 'menunggu_verifikasi',
                    transactionRef: `SIM-${Math.floor(Date.now() / 1000)}`,
                    proofUrl: 'https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=800&q=80'
                  });
                  showToast('Simulasi donasi berhasil dibuat!');
                }}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Simulasi Donasi Masuk</span>
              </button>
            </div>

            <div className="bg-blue-950/50 border border-blue-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 border-b border-blue-800 text-blue-300 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-4 rounded-tl-2xl">Tanggal & Ref</th>
                      <th className="p-4">Donatur</th>
                      <th className="p-4">Kategori / Program</th>
                      <th className="p-4 text-right">Nominal</th>
                      <th className="p-4 text-center">Bukti Transfer</th>
                      <th className="p-4 rounded-tr-2xl text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-800/50">
                    {donations.filter(d => d.status === 'menunggu_verifikasi').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-blue-400 text-xs">
                          Alhamdulillah, tidak ada transaksi yang menunggu verifikasi.
                        </td>
                      </tr>
                    ) : (
                      donations.filter(d => d.status === 'menunggu_verifikasi').map((d) => (
                        <tr key={d.id} className="hover:bg-blue-900/40 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-bold text-white">{new Date(d.createdAt).toLocaleDateString('id-ID')}</p>
                            <p className="text-[10px] font-mono text-amber-400 mt-1">{d.transactionRef}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-bold text-white">{d.donorName}</p>
                            <p className="text-xs text-blue-300">{d.donorPhone}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-[10px] bg-blue-900 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase inline-block mb-1">{d.category}</p>
                            <p className="text-xs text-white max-w-[200px] truncate" title={d.programTitle}>{d.programTitle}</p>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-sm font-bold font-mono text-emerald-400">{formatRupiahFull(d.totalAmount)}</p>
                            <p className="text-[10px] text-blue-400 mt-1">Via {d.paymentMethod}</p>
                          </td>
                          <td className="p-4 text-center">
                            {d.proofUrl ? (
                              <button
                                onClick={() => setPreviewPhotoUrl(d.proofUrl!)}
                                className="inline-flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border border-blue-500/30"
                              >
                                <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Tidak ada bukti</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onUpdateDonationStatus?.(d.id, 'berhasil')}
                                className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl transition-colors"
                                title="Verifikasi & Terima"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Tolak bukti transfer ini?')) {
                                    onUpdateDonationStatus?.(d.id, 'ditolak');
                                  }
                                }}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-colors"
                                title="Tolak"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Riwayat Verifikasi (Approved/Rejected) */}
            <div className="mt-8">
              <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-4 border-b border-blue-800 pb-2">Riwayat Transaksi Terverifikasi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donations.filter(d => d.status === 'berhasil' || d.status === 'ditolak').slice(0, 6).map(d => (
                  <div key={d.id} className="bg-blue-950 p-4 rounded-xl border border-blue-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-blue-400">{d.transactionRef}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === 'berhasil' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-white font-bold">{d.donorName}</p>
                    <p className="text-lg font-mono font-bold text-amber-400 mt-1">{formatRupiahFull(d.totalAmount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {dkmTab === 'akuntansi' && (
          <div className="space-y-6">
            <div className="relative group flex items-center bg-blue-900 border border-blue-800 p-1.5 rounded-2xl print:hidden">
              <button
                onClick={() => scrollErpTabs('left')}
                className="absolute left-0 z-10 p-2 bg-gradient-to-r from-blue-900 via-blue-900 to-transparent text-blue-300 hover:text-white h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div ref={erpTabsRef} className="flex gap-2 overflow-x-auto text-xs font-mono scrollbar-hide scroll-smooth w-full px-6">
                {[
                  { id: 'coa', label: 'Bagan Akun (COA)' },
                  { id: 'jurnal_umum', label: 'Jurnal Umum' },
                  { id: 'buku_besar', label: 'Buku Besar' },
                  { id: 'anggaran', label: 'Input Anggaran' },
                  { id: 'pencairan', label: 'Pencairan Anggaran' },
                  { id: 'laporan', label: 'Laporan Keuangan' },
                  { id: 'verifikasi', label: 'Verifikasi ZISWAF' },
                  { id: 'kas_kecil', label: 'Kas Kecil (Lama)' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setErpSubTab(sub.id as any)}
                    className={`shrink-0 whitespace-nowrap px-4 py-2.5 rounded-xl cursor-pointer font-bold transition-all ${
                      erpSubTab === sub.id
                        ? 'bg-amber-400 text-blue-950 shadow'
                        : 'text-blue-400 hover:text-white hover:bg-blue-800'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => scrollErpTabs('right')}
                className="absolute right-0 z-10 p-2 bg-gradient-to-l from-blue-900 via-blue-900 to-transparent text-blue-300 hover:text-white h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-2xl"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-blue-800">
              {erpSubTab === 'coa' && <ChartOfAccounts />}
              {erpSubTab === 'jurnal_umum' && <JurnalUmum />}
              {erpSubTab === 'buku_besar' && <BukuBesar />}
              {erpSubTab === 'anggaran' && <InputAnggaran />}
              {erpSubTab === 'pencairan' && <PencairanAnggaran />}
              {erpSubTab === 'laporan' && <ReportPrinter />}
              {erpSubTab === 'verifikasi' && (
                <div className="bg-white/5 p-4 rounded-xl">
                  <h2 className="text-xl font-bold text-amber-400 mb-4">Verifikasi & Approval Transaksi ZISWAF</h2>
                  {/* Reuse the logic for 'verifikasi' tab here, or just inform user to use the tab if it's too big, but let's just render it */}
                  <p className="text-blue-200">Fitur Verifikasi ZISWAF kini bisa diakses dari Modul Keuangan Terpadu (Atau kembali ke Dashboard Utama).</p>
                </div>
              )}
              {erpSubTab === 'kas_kecil' && (
                <div className="bg-white/5 p-4 rounded-xl">
                  <h2 className="text-xl font-bold text-amber-400 mb-4">Pencatatan Kas Sederhana (Lama)</h2>
                  <p className="text-blue-200">Gunakan menu Jurnal Umum untuk pencatatan standar PSAK 409.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {dkmTab === 'panduan' && <UserManual />}

        {dkmTab === 'dashboard_utama' && (() => {
          // Calculate chart data
          const kasAccounts = store.state.erpCoa.filter(c => c.type === 'KAS');
          const kasChartData = {
            labels: kasAccounts.map(c => c.accountName),
            datasets: [{
              data: kasAccounts.map(c => c.saldo || 0),
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'],
              borderWidth: 0,
            }]
          };

          const topPrograms = programs.slice(0, 5);
          const programChartData = {
            labels: topPrograms.map(p => p.title.substring(0, 15) + '...'),
            datasets: [
              {
                label: 'Terkumpul',
                data: topPrograms.map(p => p.collected),
                backgroundColor: '#10b981',
              },
              {
                label: 'Target',
                data: topPrograms.map(p => p.target),
                backgroundColor: '#e2e8f0',
              }
            ]
          };

          return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Ahlan wa Sahlan, {store.state.session?.name}</h3>
                  <p className="text-gray-500 dark:text-gray-300">Ringkasan operasional dan keuangan Masjid Tazkia saat ini.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1">Total Jamaah Terdaftar</h4>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{jamaahProfiles.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1">Total Program Donasi</h4>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{programs.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1">Jadwal Petugas Aktif</h4>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{petugasList.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-1">Aset & Inventaris</h4>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{inventories.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">Saldo Kas Utama (COA)</h4>
                <div className="h-64 flex items-center justify-center">
                  {kasAccounts.length > 0 ? (
                    <Doughnut data={kasChartData} options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { labels: { color: store.state.themeMode === 'dark' ? '#fff' : '#000' } } } }} />
                  ) : (
                    <p className="text-gray-400 text-sm">Belum ada data kas.</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-serif">Progres Program Donasi</h4>
                <div className="h-64 flex items-center justify-center">
                  {programs.length > 0 ? (
                    <Bar data={programChartData} options={{ maintainAspectRatio: false, indexAxis: 'y', scales: { x: { ticks: { color: store.state.themeMode === 'dark' ? '#9ca3af' : '#6b7280' } }, y: { ticks: { color: store.state.themeMode === 'dark' ? '#9ca3af' : '#6b7280' } } }, plugins: { legend: { display: false } } }} />
                  ) : (
                    <p className="text-gray-400 text-sm">Belum ada data program.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {dkmTab === 'keuangan' && (
          <div className="space-y-6">
            {/* Financial Module Subtabs */}
            <div className="flex bg-blue-900 border border-blue-800 p-1.5 rounded-2xl gap-2 overflow-x-auto text-xs font-mono">
              {[
                { id: 'mutasi', label: 'Mutasi Kas Live', icon: FileSpreadsheet },
                { id: 'jurnal', label: 'Jurnal Umum (Voucher)', icon: BookOpen },
                { id: 'bukubesar', label: 'Buku Besar (Ledger)', icon: Building },
                { id: 'kaskecil', label: 'Kas Kecil (Petty Cash)', icon: Wallet },
                { id: 'psak109', label: 'Laporan Keuangan PSAK 409', icon: FileText }
              ].map(sub => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setFinSubTab(sub.id as any)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-bold transition-all ${
                      finSubTab === sub.id
                        ? 'bg-amber-400 text-blue-950 font-black shadow'
                        : 'text-blue-400 hover:text-white hover:bg-blue-800'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUBTAB 1.1: MUTASI KAS LIVE */}
            {finSubTab === 'mutasi' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">
                      Pencatatan Pemasukan & Pengeluaran Kas Masjid
                    </h3>
                    <p className="text-xs text-blue-400">Stream transaksi penerimaan ZISWAF dan pengeluaran operasional.</p>
                  </div>

                  <button
                    onClick={() => setShowAddTrx(!showAddTrx)}
                    className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Mutasi Baru</span>
                  </button>
                </div>

                {/* Add Transaction Form Modal */}
                {showAddTrx && (
                  <form onSubmit={handleCreateTrx} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Jenis Transaksi:</label>
                        <select
                          value={newTrxType}
                          onChange={(e) => setNewTrxType(e.target.value as any)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        >
                          <option value="masuk">Pemasukan (+)</option>
                          <option value="keluar">Pengeluaran (-)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Judul Transaksi:</label>
                        <input
                          type="text"
                          placeholder="Contoh: Infaq Kotak Jumat..."
                          value={newTrxTitle}
                          onChange={(e) => setNewTrxTitle(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Nominal (Rp):</label>
                        <input
                          type="number"
                          value={newTrxAmount}
                          onChange={(e) => setNewTrxAmount(Number(e.target.value))}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Akun COA (Chart of Account):</label>
                        <select
                          value={newTrxCoa}
                          onChange={(e) => setNewTrxCoa(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                        >
                          {glAccounts.map(c => (
                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Foto / Upload Nota Bukti Transaksi */}
                    <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-blue-400" />
                          <span>Foto Bukti Transaksi / Kuitansi Nota (Real Pict)</span>
                        </label>
                        <label className="cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>Upload Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setNewTrxProofUrl)}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="Atau masukkan URL Foto Bukti Nota..."
                        value={newTrxProofUrl}
                        onChange={(e) => setNewTrxProofUrl(e.target.value)}
                        className="w-full bg-blue-900 border border-blue-800 text-blue-300 text-xs rounded-xl px-3 py-2 outline-none"
                      />

                      {newTrxProofUrl && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={newTrxProofUrl}
                            alt="Preview Nota"
                            className="w-12 h-12 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                            onClick={() => setPreviewPhotoUrl(newTrxProofUrl)}
                          />
                          <span className="text-[10px] text-blue-400 font-mono">Pratinjau Foto Real Pict Nota</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTrx(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-blue-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Simpan Transaksi
                      </button>
                    </div>
                  </form>
                )}

                {/* Financial Stream Table */}
                <div className="bg-blue-900 border border-blue-800 rounded-2xl overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs text-blue-300 min-w-[700px]">
                    <thead className="bg-blue-950 text-blue-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Jenis</th>
                        <th className="p-4">Uraian Transaksi</th>
                        <th className="p-4">Bukti Real Pict</th>
                        <th className="p-4 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-800">
                      {financials.map(f => (
                        <tr key={f.id} className="hover:bg-blue-800/40">
                          <td className="p-4 font-mono text-blue-500">{f.id}</td>
                          <td className="p-4 font-mono text-blue-400">{f.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.type === 'masuk' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {f.type}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">{f.title}</td>
                          <td className="p-4">
                            {f.proofUrl ? (
                              <button
                                onClick={() => setPreviewPhotoUrl(f.proofUrl!)}
                                className="flex items-center gap-1.5 bg-blue-950 border border-blue-800 hover:border-blue-500/50 px-2 py-1 rounded-lg text-[10px] font-mono text-blue-300 transition-all cursor-pointer"
                              >
                                <img src={f.proofUrl} alt="Bukti" className="w-6 h-6 rounded object-cover" />
                                <span>Lihat Nota</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-blue-600 font-mono">-</span>
                            )}
                          </td>
                          <td className={`p-4 text-right font-mono font-bold whitespace-nowrap ${f.type === 'masuk' ? 'text-blue-400' : 'text-rose-400'}`}>
                            {formatRupiahFull(f.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 1.2: JURNAL UMUM */}
            {finSubTab === 'jurnal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      Jurnal Umum Akuntansi (Double-Entry General Journal)
                    </h3>
                    <p className="text-xs text-blue-400">
                      Pencatatan voucher debet dan kredit berpasangan sesuai standar pencatatan ZISWAF.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddJrn(!showAddJrn)}
                    className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Input Voucher Jurnal</span>
                  </button>
                </div>

                {/* Add Journal Voucher Form */}
                {showAddJrn && (
                  <form onSubmit={handleCreateJournal} className="bg-blue-900 border border-amber-500/30 p-5 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">No. Voucher:</label>
                        <input
                          type="text"
                          value={jrnVoucher}
                          onChange={(e) => setJrnVoucher(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-amber-300 font-mono text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Kode Akun / Nama Akun:</label>
                        <AccountCombobox
                          value={jrnAccountCode}
                          onChange={(id, label) => {
                            setJrnAccountCode(id);
                            // Extract just the name part from the label formatted as "[1101] Kas Utama..."
                            const nameOnly = label.replace(/^\[\d+\]\s*/, '');
                            setJrnAccountName(nameOnly || 'Akun ZISWAF');
                          }}
                          options={[
                            { id: '1101', label: '[1101] Kas Utama Operasional Masjid' },
                            { id: '1102', label: '[1102] Bank BSI - Zakat Fitrah & Maal' },
                            { id: '1103', label: '[1103] Kas Kecil Operasional Harian' },
                            { id: '2101', label: '[2101] Kewajiban Penyaluran Mustahik' },
                            { id: '4101', label: '[4101] Penerimaan Infaq & Shadaqah' },
                            { id: '5101', label: '[5101] Beban Operasional & Pemeliharaan' }
                          ]}
                          className="w-full bg-blue-950 border border-blue-800 text-amber-300 font-mono text-xs rounded-xl px-3 py-2 outline-none placeholder-blue-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          listClassName="absolute z-50 w-full mt-1 bg-blue-950 border border-blue-800 rounded-lg shadow-xl max-h-60 overflow-y-auto top-full left-0 text-amber-300"
                          itemClassName="px-3 py-2 text-xs cursor-pointer hover:bg-blue-900 border-b border-blue-900 last:border-0"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Kategori Dana:</label>
                        <select
                          value={jrnCategory}
                          onChange={(e) => setJrnCategory(e.target.value as any)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        >
                          <option value="Infaq">Infaq</option>
                          <option value="Zakat">Zakat</option>
                          <option value="Wakaf">Wakaf</option>
                          <option value="Amil">Amil</option>
                          <option value="Operasional">Operasional</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Debet (Rp):</label>
                        <input
                          type="number"
                          value={jrnDebit}
                          onChange={(e) => setJrnDebit(Number(e.target.value))}
                          className="w-full bg-blue-950 border border-blue-800 text-blue-400 font-mono text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Kredit (Rp):</label>
                        <input
                          type="number"
                          value={jrnCredit}
                          onChange={(e) => setJrnCredit(Number(e.target.value))}
                          className="w-full bg-blue-950 border border-blue-800 text-rose-400 font-mono text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Keterangan / Deskripsi Transaksi:</label>
                        <input
                          type="text"
                          placeholder="Tuliskan keterangan lengkap pencatatan jurnal..."
                          value={jrnDesc}
                          onChange={(e) => setJrnDesc(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddJrn(false)}
                        className="px-4 py-2 rounded-xl text-xs text-blue-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-400 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs"
                      >
                        Simpan Voucher Jurnal
                      </button>
                    </div>
                  </form>
                )}

                {/* Journal Entries Table */}
                <div className="bg-blue-900 border border-blue-800 rounded-2xl overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs text-blue-300 min-w-[800px]">
                    <thead className="bg-blue-950 text-blue-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">No. Voucher</th>
                        <th className="p-3">Kode Akun</th>
                        <th className="p-3">Nama Akun & Keterangan</th>
                        <th className="p-3 text-right">Debet (Rp)</th>
                        <th className="p-3 text-right">Kredit (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-800 font-mono">
                      {journalEntries.map(j => (
                        <tr key={j.id} className="hover:bg-blue-800/40">
                          <td className="p-3 text-blue-400">{j.date}</td>
                          <td className="p-3 text-amber-300 font-bold">{j.voucherNo}</td>
                          <td className="p-3 text-blue-400 font-bold">{j.accountCode}</td>
                          <td className="p-3">
                            <span className="font-sans font-bold text-white block">{j.accountName}</span>
                            <span className="font-sans text-[11px] text-blue-400 block">{j.description}</span>
                          </td>
                          <td className="p-3 text-right text-blue-400 font-bold whitespace-nowrap">
                            {j.debit > 0 ? formatRupiahFull(j.debit) : '-'}
                          </td>
                          <td className="p-3 text-right text-rose-400 font-bold whitespace-nowrap">
                            {j.credit > 0 ? formatRupiahFull(j.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 1.3: BUKU BESAR */}
            {finSubTab === 'bukubesar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-400" />
                      Buku Besar & Daftar Akun (Chart of Accounts / COA)
                    </h3>
                    <p className="text-xs text-blue-400">
                      Saldo kumulatif debet, kredit, dan saldo akhir setiap akun Aset, Kewajiban, dan Dana ZISWAF.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {glAccounts.map(acc => (
                    <div key={acc.code} className="bg-blue-900 border border-blue-800 rounded-2xl p-4 space-y-3 shadow-lg">
                      <div className="flex justify-between items-start border-b border-blue-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">
                            {acc.code}
                          </span>
                          <h4 className="font-serif font-bold text-white text-sm mt-1">{acc.name}</h4>
                        </div>
                        <span className="text-[10px] bg-blue-800 text-blue-300 font-mono px-2 py-0.5 rounded">
                          {acc.category}
                        </span>
                      </div>

                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-blue-400">
                          <span>Saldo Awal:</span>
                          <span>{formatRupiahFull(acc.initialBalance)}</span>
                        </div>
                        <div className="flex justify-between text-blue-400">
                          <span>Total Debet (+):</span>
                          <span>{formatRupiahFull(acc.totalDebit)}</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                          <span>Total Kredit (-):</span>
                          <span>{formatRupiahFull(acc.totalCredit)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-amber-300 pt-2 border-t border-blue-800 text-sm">
                          <span>Saldo Akhir:</span>
                          <span>{formatRupiahFull(acc.endingBalance)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 1.4: KAS KECIL */}
            {finSubTab === 'kaskecil' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-amber-400" />
                      Sistem Kas Kecil Operasional (Petty Cash Imprest System)
                    </h3>
                    <p className="text-xs text-blue-400">
                      Dana tunai siap pakai untuk operasional harian, konsumsi pengajian, dan marbot masjid.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddKasKecil(!showAddKasKecil)}
                    className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Pengajuan Kas Kecil</span>
                  </button>
                </div>

                {/* Petty Cash Overview Balance Box */}
                <div className="bg-gradient-to-r from-amber-950/60 to-blue-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold block">
                      SALDO KAS KECIL SAAT INI (IMPREST LIMIT: RP 10.000.000)
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-white mt-1">
                      {formatRupiahFull(pettyCash.length > 0 ? pettyCash[0].remainingBalance : 5550000)}
                    </h2>
                  </div>

                  <div className="flex gap-2 text-xs font-mono">
                    <div className="bg-blue-950/80 px-3 py-2 rounded-xl border border-blue-800">
                      <span className="text-blue-400 block text-[9px]">Status Plafond</span>
                      <span className="text-blue-400 font-bold">Aman (≥50%)</span>
                    </div>
                    <div className="bg-blue-950/80 px-3 py-2 rounded-xl border border-blue-800">
                      <span className="text-blue-400 block text-[9px]">Pengeluaran Bulan Ini</span>
                      <span className="text-rose-300 font-bold">Rp 1.450.000</span>
                    </div>
                  </div>
                </div>

                {/* Form Add Petty Cash */}
                {showAddKasKecil && (
                  <form onSubmit={handleCreateKasKecil} className="bg-blue-900 border border-amber-500/30 p-5 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Jenis Transaksi Kas Kecil:</label>
                        <select
                          value={kcType}
                          onChange={(e) => setKcType(e.target.value as any)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        >
                          <option value="Pengeluaran">Pengeluaran Biaya (-)</option>
                          <option value="Pencairan">Pencairan Top-Up Bank (+)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Keperluan / Keterangan:</label>
                        <input
                          type="text"
                          placeholder="Contoh: Pembelian Sabun Pembersih & Snack..."
                          value={kcPurpose}
                          onChange={(e) => setKcPurpose(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Penanggung Jawab (PIC):</label>
                        <input
                          type="text"
                          value={kcPic}
                          onChange={(e) => setKcPic(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Nominal (Rp):</label>
                        <input
                          type="number"
                          value={kcAmount}
                          onChange={(e) => setKcAmount(Number(e.target.value))}
                          className="w-full bg-blue-950 border border-blue-800 text-amber-300 font-mono text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-blue-300 block mb-1">Bukti Kuitansi (Keterangan):</label>
                        <input
                          type="text"
                          value={kcProof}
                          onChange={(e) => setKcProof(e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    {/* Photo Proof Upload for Kas Kecil */}
                    <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-amber-400" />
                          <span>Foto Kuitansi Kas Kecil (Real Pict Nota)</span>
                        </label>
                        <label className="cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>Upload Nota</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setKcProofUrl)}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="Atau masukan URL Foto Kuitansi..."
                        value={kcProofUrl}
                        onChange={(e) => setKcProofUrl(e.target.value)}
                        className="w-full bg-blue-900 border border-blue-800 text-blue-300 text-xs rounded-xl px-3 py-2 outline-none"
                      />

                      {kcProofUrl && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={kcProofUrl}
                            alt="Preview Kuitansi"
                            className="w-12 h-12 rounded-lg object-cover border border-amber-500/40 cursor-pointer"
                            onClick={() => setPreviewPhotoUrl(kcProofUrl)}
                          />
                          <span className="text-[10px] text-blue-400 font-mono">Pratinjau Foto Kuitansi Kas Kecil</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddKasKecil(false)}
                        className="px-4 py-2 rounded-xl text-xs text-blue-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-400 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Simpan Klaim Kas Kecil
                      </button>
                    </div>
                  </form>
                )}

                {/* Petty Cash Table */}
                <div className="bg-blue-900 border border-blue-800 rounded-2xl overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs text-blue-300 min-w-[800px]">
                    <thead className="bg-blue-950 text-blue-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Ref No</th>
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Keperluan</th>
                        <th className="p-3">PIC / Penerima</th>
                        <th className="p-3">Foto Nota Real Pict</th>
                        <th className="p-3">Jenis</th>
                        <th className="p-3 text-right">Nominal</th>
                        <th className="p-3 text-right">Sisa Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-800 font-mono">
                      {pettyCash.map(k => (
                        <tr key={k.id} className="hover:bg-blue-800/40">
                          <td className="p-3 text-amber-300 font-bold">{k.refNo}</td>
                          <td className="p-3 text-blue-400">{k.date}</td>
                          <td className="p-3 font-sans font-bold text-white">{k.purpose}</td>
                          <td className="p-3 font-sans text-blue-300">{k.picName}</td>
                          <td className="p-3 font-sans">
                            {k.proofUrl ? (
                              <button
                                onClick={() => setPreviewPhotoUrl(k.proofUrl!)}
                                className="flex items-center gap-1.5 bg-blue-950 border border-blue-800 hover:border-amber-500/50 px-2 py-1 rounded-lg text-[10px] font-mono text-amber-300 transition-all cursor-pointer"
                              >
                                <img src={k.proofUrl} alt="Nota" className="w-6 h-6 rounded object-cover" />
                                <span>Lihat Real Pict</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-blue-600 font-mono">-</span>
                            )}
                          </td>
                          <td className="p-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              k.type === 'Pencairan' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {k.type}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold text-white whitespace-nowrap">
                            {formatRupiahFull(k.amount)}
                          </td>
                          <td className="p-3 text-right font-bold text-blue-400 whitespace-nowrap">
                            {formatRupiahFull(k.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 1.5: LAPORAN PSAK 409 */}
            {finSubTab === 'psak109' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Laporan Keuangan Standar Akuntansi Syariah PSAK 409
                    </h3>
                    <p className="text-xs text-blue-400">
                      Format standar Ikatan Akuntan Indonesia (IAI) untuk Amil Zakat, Infaq, Shadaqah, & Wakaf.
                    </p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold px-3 py-1 rounded-full">
                    AUDITED SYARIAH READY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  {/* Laporan Perubahan Dana Zakat */}
                  <div className="bg-blue-900 border border-blue-800 p-4 rounded-2xl space-y-3">
                    <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5 border-b border-blue-800 pb-2">
                      <span>1. Laporan Perubahan Dana Zakat</span>
                    </h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-blue-300">
                        <span>Penerimaan Zakat Muzakki:</span>
                        <span className="text-blue-400 font-bold">Rp 3.850.000.000</span>
                      </div>
                      <div className="flex justify-between text-blue-300">
                        <span>Penyaluran Mustahik Fakir Miskin:</span>
                        <span className="text-rose-400 font-bold">(Rp 2.950.000.000)</span>
                      </div>
                      <div className="flex justify-between text-blue-300">
                        <span>Hak Amil Zakat (12.5%):</span>
                        <span className="text-rose-400 font-bold">(Rp 481.250.000)</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-2 border-t border-blue-800">
                        <span>Saldo Dana Zakat Akhir:</span>
                        <span className="text-amber-300">Rp 418.750.000</span>
                      </div>
                    </div>
                  </div>

                  {/* Laporan Perubahan Dana Infaq / Sedekah */}
                  <div className="bg-blue-900 border border-blue-800 p-4 rounded-2xl space-y-3">
                    <h4 className="font-serif font-bold text-blue-300 text-sm flex items-center gap-1.5 border-b border-blue-800 pb-2">
                      <span>2. Laporan Perubahan Dana Infaq & Sedekah</span>
                    </h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-blue-300">
                        <span>Penerimaan Infaq Terikat & Bebas:</span>
                        <span className="text-blue-400 font-bold">Rp 12.450.000.000</span>
                      </div>
                      <div className="flex justify-between text-blue-300">
                        <span>Beban Program Sosial & Syiar:</span>
                        <span className="text-rose-400 font-bold">(Rp 8.200.000.000)</span>
                      </div>
                      <div className="flex justify-between text-blue-300">
                        <span>Beban Pemeliharaan & Energi:</span>
                        <span className="text-rose-400 font-bold">(Rp 1.150.000.000)</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-2 border-t border-blue-800">
                        <span>Saldo Dana Infaq Akhir:</span>
                        <span className="text-blue-300">Rp 3.100.000.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENGATURAN ADMIN & VISIBILITAS MODUL */}
        {dkmTab === 'pengaturan' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-blue-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  Pengaturan Modul & Kontrol Visibilitas Admin DKM
                </h3>
                <p className="text-xs text-blue-400">
                  Aktifkan atau sembunyikan modul aplikasi, atur parameter nisab zakat, running text TV signage, serta rekening bank.
                </p>
              </div>

              {savedSettingsMsg && (
                <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Pengaturan Tersimpan Otomatis!</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Box 0: Ganti Sandi Admin */}
                <div className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-4">
                  <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2 border-b border-blue-800 pb-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span>Ubah Kata Sandi Akses Portal Admin</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">Kata Sandi Lama</label>
                      <input type="password" autoComplete="new-password" placeholder="Masukkan kata sandi lama" className="w-full bg-blue-950 border border-blue-800 text-white rounded-xl px-3 py-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">Kata Sandi Baru</label>
                      <input type="password" autoComplete="new-password" placeholder="Masukkan kata sandi baru" className="w-full bg-blue-950 border border-blue-800 text-white rounded-xl px-3 py-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1">Konfirmasi Kata Sandi Baru</label>
                      <input type="password" autoComplete="new-password" placeholder="Ketik ulang kata sandi baru" className="w-full bg-blue-950 border border-blue-800 text-white rounded-xl px-3 py-2 outline-none text-xs" />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl mt-2 transition-colors" onClick={() => alert('Kata sandi berhasil diperbarui')}>
                      Perbarui Kata Sandi
                    </button>
                  </div>
                </div>

                {/* Box 1: Sakelar Visibilitas Modul Aplikasi */}
                <div className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2 border-b border-blue-800 pb-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>1. Visibilitas Modul Antarmuka Jamaah</span>
                </h4>

                <div className="space-y-3 text-xs">
                  {[
                    { key: 'showTvSignageOption', label: 'Modul Mode Display TV Signage Masjid', desc: 'Menampilkan opsi layar penuh jadwal jam shalat TV masjid.' },
                    { key: 'showQuranModule', label: 'Modul Digital Ibadah (Al-Qur\'an, Shalat, Doa)', desc: 'Menyediakan fitur membaca surah mp3 & jadwal shalat.' },
                    { key: 'showLiveMutations', label: 'Stream Live Mutasi Kas Transparansi', desc: 'Menampilkan tabel live pencatatan keuangan ke publik.' },
                    { key: 'showTargetDonationBar', label: 'Bar Progress Target Donasi Program', desc: 'Menampilkan persentase pencapaian donasi di hero banner.' },
                    { key: 'allowAnonymousDonation', label: 'Izinkan Opsi Donasi Anonim ("Hamba Allah")', desc: 'Memungkinkan donatur menyembunyikan identitas nama.' }
                  ].map(item => {
                    const isChecked = adminSettings ? (adminSettings[item.key as keyof AppAdminSettings] as boolean) : true;
                    return (
                      <div key={item.key} className="flex items-center justify-between bg-blue-950 p-3 rounded-xl border border-blue-800">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-blue-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleToggleSetting(item.key as any)}
                          className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all ${
                            isChecked ? 'bg-blue-500 text-blue-950' : 'bg-blue-800 text-blue-400'
                          }`}
                        >
                          {isChecked ? 'TAMPIL' : 'SEMBUNYI'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Parameter Finansial & Signage TV */}
              <div className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2 border-b border-blue-800 pb-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>2. Parameter Bank, QRIS, & Display TV</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-blue-300 font-semibold block mb-1">
                      Pesan Running Text Display TV Signage Masjid:
                    </label>
                    <textarea
                      rows={3}
                      value={adminSettings?.runningTextTv || ''}
                      onChange={(e) => handleTextSettingChange('runningTextTv', e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2.5 text-amber-300 font-sans text-xs outline-none"
                    />
                  </div>
                  
                  {/* Promo Text Editor */}
                  <div className="bg-blue-950/50 p-4 rounded-xl border border-blue-800 space-y-3 mt-4">
                    <h5 className="font-bold text-white text-xs mb-2">Teks Promosi Halaman Utama (ZISWAF & Dakwah)</h5>
                    
                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">Judul Promosi Utama:</label>
                      <input
                        type="text"
                        value={adminSettings?.heroPromoTitle || ''}
                        onChange={(e) => handleTextSettingChange('heroPromoTitle', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-lg p-2 font-serif text-white text-xs outline-none"
                        placeholder="Contoh: Pusat Peradaban Islam & Kesejahteraan Umat"
                      />
                    </div>

                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">Sub-Judul Promosi:</label>
                      <input
                        type="text"
                        value={adminSettings?.heroPromoSubtitle || ''}
                        onChange={(e) => handleTextSettingChange('heroPromoSubtitle', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-lg p-2 font-serif text-amber-300 text-xs outline-none"
                        placeholder="Contoh: Melalui Optimalisasi ZISWAF, Dakwah & Zikir"
                      />
                    </div>

                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">Deskripsi & Ajakan Promosi:</label>
                      <textarea
                        rows={3}
                        value={adminSettings?.heroPromoDescription || ''}
                        onChange={(e) => handleTextSettingChange('heroPromoDescription', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-lg p-2 text-blue-200 text-xs outline-none leading-relaxed"
                        placeholder="Salurkan Zakat, Infaq, Shadaqah..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">
                        Harga Acuan Emas/Gram (Nisab Zakat):
                      </label>
                      <input
                        type="number"
                        value={adminSettings?.goldNisabPrice || 1350000}
                        onChange={(e) => handleTextSettingChange('goldNisabPrice', Number(e.target.value))}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-blue-400 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">
                        Durasi Adzan (Menit):
                      </label>
                      <input
                        type="number"
                        value={adminSettings?.adzanDurationMinutes || 4}
                        onChange={(e) => handleTextSettingChange('adzanDurationMinutes', Number(e.target.value))}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-amber-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">
                        Countdown Timer Iqamah (Menit):
                      </label>
                      <input
                        type="number"
                        value={adminSettings?.iqamahCountdownMinutes || 10}
                        onChange={(e) => handleTextSettingChange('iqamahCountdownMinutes', Number(e.target.value))}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-amber-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-blue-300 font-semibold block mb-1">
                        Durasi Shalat & Layar Gelap (Menit):
                      </label>
                      <input
                        type="number"
                        value={adminSettings?.sholatDurationMinutes || 15}
                        onChange={(e) => handleTextSettingChange('sholatDurationMinutes', Number(e.target.value))}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-amber-300 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-blue-800/50 mt-4">
                    <h5 className="font-bold text-blue-200 text-xs uppercase tracking-wider">Pengaturan Teks Peringatan Waktu Shalat</h5>
                    <div>
                      <label className="text-blue-300 font-semibold block mb-1 text-xs">
                        Teks Berjalan Saat Adzan:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.adzanRunningText || 'SAAT INI WAKTU ADZAN. HARAP TENANG DAN LURUSKAN SHAF.'}
                        onChange={(e) => handleTextSettingChange('adzanRunningText', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-blue-300 font-semibold block mb-1 text-xs">
                        Teks Berjalan Saat Jeda Iqamah:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.iqamahRunningText || 'WAKTU SHOLAT BERJAMAAH AKAN SEGERA DIMULAI. HARAP NONAKTIFKAN PONSEL ANDA.'}
                        onChange={(e) => handleTextSettingChange('iqamahRunningText', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-blue-300 font-semibold block mb-1 text-xs">
                        Teks Saat Shalat Berlangsung (Layar Gelap):
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.sholatRunningText || 'SHALAT BERJAMAAH SEDANG BERLANGSUNG'}
                        onChange={(e) => handleTextSettingChange('sholatRunningText', e.target.value)}
                        className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-blue-800/50 mt-4">
                    <h5 className="font-bold text-blue-200 text-xs uppercase tracking-wider">Pengaturan Mode Khusus (Jumat, Hari Raya & Buka Puasa)</h5>
                    
                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-blue-300 font-semibold text-sm">Aktifkan Mode Shalat Jumat</label>
                        <button
                          onClick={() => handleToggleSetting('enableJumatMode')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings?.enableJumatMode ?? true ? 'bg-amber-500' : 'bg-blue-950 border border-blue-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings?.enableJumatMode ?? true ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {(adminSettings?.enableJumatMode ?? true) && (
                        <div>
                          <label className="text-blue-300 font-semibold block mb-1 text-xs">Durasi Khutbah Jumat (Menit):</label>
                          <input
                            type="number"
                            value={adminSettings?.jumatKhutbahDurationMinutes || 40}
                            onChange={(e) => handleTextSettingChange('jumatKhutbahDurationMinutes', Number(e.target.value))}
                            className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-amber-300 text-xs outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-blue-300 font-semibold text-sm">Aktifkan Mode Idul Fitri</label>
                        <button
                          onClick={() => handleToggleSetting('enableIdulFitriMode')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings?.enableIdulFitriMode ? 'bg-amber-500' : 'bg-blue-950 border border-blue-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings?.enableIdulFitriMode ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {adminSettings?.enableIdulFitriMode && (
                        <div>
                          <label className="text-blue-300 font-semibold block mb-1 text-xs">Teks Layar Idul Fitri:</label>
                          <input
                            type="text"
                            value={adminSettings?.idulFitriRunningText || 'SELAMAT HARI RAYA IDUL FITRI 1 SYAWAL. MOHON MAAF LAHIR DAN BATIN.'}
                            onChange={(e) => handleTextSettingChange('idulFitriRunningText', e.target.value)}
                            className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-blue-800/50">
                        <label className="text-blue-300 font-semibold text-sm">Aktifkan Mode Idul Adha</label>
                        <button
                          onClick={() => handleToggleSetting('enableIdulAdhaMode')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings?.enableIdulAdhaMode ? 'bg-amber-500' : 'bg-blue-950 border border-blue-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings?.enableIdulAdhaMode ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {adminSettings?.enableIdulAdhaMode && (
                        <div>
                          <label className="text-blue-300 font-semibold block mb-1 text-xs">Teks Layar Idul Adha:</label>
                          <input
                            type="text"
                            value={adminSettings?.idulAdhaRunningText || 'SELAMAT HARI RAYA IDUL ADHA. SEMOGA AMAL IBADAH QURBAN KITA DITERIMA ALLAH SWT.'}
                            onChange={(e) => handleTextSettingChange('idulAdhaRunningText', e.target.value)}
                            className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                          />
                        </div>
                      )}

                      {(adminSettings?.enableIdulFitriMode || adminSettings?.enableIdulAdhaMode) && (
                        <div className="pt-2">
                          <label className="text-blue-300 font-semibold block mb-1 text-xs">Jam Pelaksanaan Shalat Ied (HH:MM):</label>
                          <input
                            type="time"
                            value={adminSettings?.eidPrayerTime || '07:00'}
                            onChange={(e) => handleTextSettingChange('eidPrayerTime', e.target.value)}
                            className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Durasi Tampil Notifikasi Buka Puasa (Menit):</label>
                        <input
                          type="number"
                          value={adminSettings?.iftarNotificationDurationMinutes || 10}
                          onChange={(e) => handleTextSettingChange('iftarNotificationDurationMinutes', Number(e.target.value))}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 font-mono text-amber-300 text-xs outline-none"
                          title="Berapa lama teks Buka Puasa tampil saat Maghrib tiba"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Teks Berjalan Saat Buka Puasa (Maghrib):</label>
                        <input
                          type="text"
                          value={adminSettings?.iftarRunningText || 'SELAMAT BERBUKA PUASA UNTUK WILAYAH SENTUL DAN SEKITARNYA.'}
                          onChange={(e) => handleTextSettingChange('iftarRunningText', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="space-y-4 pt-4 border-t border-blue-800/50 mt-4">
                    <h5 className="font-bold text-blue-200 text-xs uppercase tracking-wider">Pengaturan Konten Tengah TV Display</h5>
                    
                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <h6 className="text-amber-400 font-semibold text-xs border-b border-blue-800/50 pb-2">Slide 2: Pesan / Hadis Harian</h6>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Judul Label:</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide1Title || 'HADIS SHAHIH HARI INI'}
                          onChange={(e) => handleTextSettingChange('tvSlide1Title', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Teks Utama (Arab/Besar):</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide1Arabic || 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ'}
                          onChange={(e) => handleTextSettingChange('tvSlide1Arabic', e.target.value)}
                          dir="rtl"
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-serif text-sm outline-none text-right"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Terjemahan / Arti:</label>
                        <textarea
                          value={adminSettings?.tvSlide1Indo || '"Sedekah itu tidak akan pernah mengurangi harta sedikit pun, melainkan Allah akan menambah kemuliaan."'}
                          onChange={(e) => handleTextSettingChange('tvSlide1Indo', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-sans text-xs outline-none min-h-[60px]"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Sumber (Riwayat):</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide1Source || '(HR. Muslim no. 2588)'}
                          onChange={(e) => handleTextSettingChange('tvSlide1Source', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-amber-300 font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <h6 className="text-amber-400 font-semibold text-xs border-b border-blue-800/50 pb-2">Slide 3: Program / Donasi Spesial</h6>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Judul Label:</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide2Title || 'PROGRAM WAKAF UTAMA'}
                          onChange={(e) => handleTextSettingChange('tvSlide2Title', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Nama Program:</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide2Heading || 'Wakaf Tunai Sound System & Akustik Ruang Shalat Utama'}
                          onChange={(e) => handleTextSettingChange('tvSlide2Heading', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-serif text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Deskripsi Singkat:</label>
                        <textarea
                          value={adminSettings?.tvSlide2Desc || "Dukung pengadaan tata suara jernih kristal untuk kekhusyu'an ibadah jamaah Masjid Tazkia."}
                          onChange={(e) => handleTextSettingChange('tvSlide2Desc', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-sans text-xs outline-none min-h-[60px]"
                        />
                      </div>
                      <div>
                        <label className="text-blue-300 font-semibold block mb-1 text-xs">Status / Target (Teks Kuning):</label>
                        <input
                          type="text"
                          value={adminSettings?.tvSlide2Target || 'Terkumpul: Rp 8.25M / Target: Rp 15M'}
                          onChange={(e) => handleTextSettingChange('tvSlide2Target', e.target.value)}
                          className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-amber-300 font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800/50 space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-800/50 pb-2">
                        <h6 className="text-amber-400 font-semibold text-xs">Slide 4: Video CCTV / YouTube Live</h6>
                        <button
                          onClick={() => handleToggleSetting('tvEnableVideoSlide')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings?.tvEnableVideoSlide ? 'bg-amber-500' : 'bg-blue-950 border border-blue-800'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings?.tvEnableVideoSlide ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {adminSettings?.tvEnableVideoSlide && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-blue-300 font-semibold block mb-2 text-xs">Pilih Sumber Video:</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition-colors ${adminSettings?.tvVideoSourceType !== 'camera' ? 'bg-blue-900 border-amber-500/50' : 'bg-blue-950 border-blue-800'}`}>
                                <input 
                                  type="radio" 
                                  name="videoSource" 
                                  checked={adminSettings?.tvVideoSourceType !== 'camera'}
                                  onChange={() => handleTextSettingChange('tvVideoSourceType', 'url')}
                                  className="text-amber-500"
                                />
                                <div className="text-xs">
                                  <div className="font-bold text-blue-200">Internet (URL)</div>
                                  <div className="text-blue-400 text-[10px]">YouTube Live, HLS, IP Camera web</div>
                                </div>
                              </label>
                              <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition-colors ${adminSettings?.tvVideoSourceType === 'camera' ? 'bg-blue-900 border-amber-500/50' : 'bg-blue-950 border-blue-800'}`}>
                                <input 
                                  type="radio" 
                                  name="videoSource" 
                                  checked={adminSettings?.tvVideoSourceType === 'camera'}
                                  onChange={() => handleTextSettingChange('tvVideoSourceType', 'camera')}
                                  className="text-amber-500"
                                />
                                <div className="text-xs">
                                  <div className="font-bold text-blue-200">Kabel Fisik CCTV</div>
                                  <div className="text-blue-400 text-[10px]">Capture Card USB / Kamera Web</div>
                                </div>
                              </label>
                            </div>
                          </div>

                          {adminSettings?.tvVideoSourceType !== 'camera' ? (
                            <div>
                              <label className="text-blue-300 font-semibold block mb-1 text-xs">URL YouTube Video (Harap gunakan link 'Embed' YouTube / link CCTV iFrame-compatible):</label>
                              <input
                                type="text"
                                value={adminSettings?.tvVideoUrl || ''}
                                onChange={(e) => handleTextSettingChange('tvVideoUrl', e.target.value)}
                                placeholder="Contoh: https://www.youtube.com/embed/XXXXXXX?autoplay=1&mute=1"
                                className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                              />
                              <p className="text-[10px] text-blue-400 mt-1">Tambahkan <code className="text-amber-300 bg-blue-950 px-1 rounded">?autoplay=1&mute=1</code> di akhir URL agar video memutar otomatis tanpa suara dan tidak mengganggu murottal.</p>
                            </div>
                          ) : (
                            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                              <p className="text-xs text-amber-300 font-medium">
                                ⚠️ Pastikan kabel Capture Card / Mesin DVR CCTV sudah dicolokkan ke USB komputer yang memutar TV Display ini.
                                Browser akan meminta izin kamera (Allow Camera) saat TV Display dimuat ulang.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-blue-300 font-semibold block mb-1">
                      Nomor Rekening BSI (ZISWAF):
                    </label>
                    <input
                      type="text"
                      value={adminSettings?.bankAccountBsi || ''}
                      onChange={(e) => handleTextSettingChange('bankAccountBsi', e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-blue-300 font-semibold block mb-1">
                      Nomor Rekening BSI (Wakaf):
                    </label>
                    <input
                      type="text"
                      value={adminSettings?.bankAccountBca || ''}
                      onChange={(e) => handleTextSettingChange('bankAccountBca', e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-white font-mono text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-blue-300 font-semibold block mb-1">
                      Nama Merchant QRIS Masjid:
                    </label>
                    <input
                      type="text"
                      value={adminSettings?.qrisMerchantName || ''}
                      onChange={(e) => handleTextSettingChange('qrisMerchantName', e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 rounded-xl p-2 text-blue-300 font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Pengaturan Foto Profil, Hero Banner, & Gambar QRIS Masjid */}
            <div className="bg-blue-900 border border-blue-500/30 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                <h4 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  <span>3. Foto Profil, Banner Utama, & Barcode QRIS Masjid (Database Media)</span>
                </h4>
                <button
                  onClick={handleSaveAdminPhotos}
                  className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Semua Foto Database</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Logo Masjid */}
                <div className="bg-blue-950 p-4 rounded-xl border border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-blue-400" />
                      Logo Resmi Masjid
                    </span>
                    <label className="cursor-pointer bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setLogoUrlInput, 'logo')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-blue-300 italic leading-snug">
                    Logo ini akan tampil di bagian atas navigasi dan bagian paling bawah (footer) website.
                  </p>

                  <div className="h-32 bg-blue-900 rounded-lg overflow-hidden border border-blue-800 flex items-center justify-center relative group">
                    <img
                      src={logoUrlInput}
                      alt="Logo Masjid"
                      className="h-full w-full object-contain p-2 cursor-pointer"
                      onClick={() => setPreviewPhotoUrl(logoUrlInput)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-blue-400 block mb-1">URL Foto Logo:</label>
                    <input
                      type="text"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      className="w-full bg-blue-900 border border-blue-800 text-xs text-blue-200 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                </div>

                {/* 2. Hero Banner Foto Masjid */}
                <div className="bg-blue-950 p-4 rounded-xl border border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      Foto Banner Hero Masjid
                    </span>
                    <label className="cursor-pointer bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setHeroUrlInput, 'hero')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-blue-300 italic leading-snug">
                    Foto ini akan menjadi latar belakang besar (background) saat pertama kali halaman beranda (Home) dibuka.
                  </p>

                  <div className="h-32 bg-blue-900 rounded-lg overflow-hidden border border-blue-800 flex items-center justify-center relative group">
                    <img
                      src={heroUrlInput.split(',')[0].trim()}
                      alt="Hero Masjid"
                      className="h-full w-full object-cover cursor-pointer"
                      onClick={() => setPreviewPhotoUrl(heroUrlInput.split(',')[0].trim())}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-blue-400 block mb-1">URL Foto Landscape Masjid (pisahkan dengan koma jika banyak):</label>
                    <input
                      type="text"
                      value={heroUrlInput}
                      onChange={(e) => setHeroUrlInput(e.target.value)}
                      className="w-full bg-blue-900 border border-blue-800 text-xs text-blue-200 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                </div>

                {/* 3. Barcode QRIS Code Image */}
                <div className="bg-blue-950 p-4 rounded-xl border border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-blue-400" />
                      Gambar Barcode QRIS Resmi
                    </span>
                    <label className="cursor-pointer bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setQrisUrlInput, 'qris')}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-blue-300 italic leading-snug">
                    Gambar ini akan muncul saat jamaah menekan tombol donasi via QRIS di halaman beranda.
                  </p>

                  <div className="h-32 bg-blue-900 rounded-lg overflow-hidden border border-blue-800 flex items-center justify-center relative group">
                    <img
                      src={qrisUrlInput}
                      alt="QRIS Barcode"
                      className="h-full w-full object-contain p-2 cursor-pointer"
                      onClick={() => setPreviewPhotoUrl(qrisUrlInput)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-blue-400 block mb-1">URL Barcode QRIS:</label>
                    <input
                      type="text"
                      value={qrisUrlInput}
                      onChange={(e) => setQrisUrlInput(e.target.value)}
                      className="w-full bg-blue-900 border border-blue-800 text-xs text-blue-200 rounded-lg p-2 font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 4: Pengaturan Khutbah Jumat & Informasi Fitur Aplikasi */}
            <div className="bg-blue-900 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <h4 className="font-serif font-bold text-white text-base flex items-center gap-2 border-b border-blue-800 pb-3">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>4. Pengaturan Informasi Khutbah Jumat & Fitur Aplikasi</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Khutbah Jumat */}
                <div className="bg-blue-950 p-4 rounded-xl border border-blue-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono block border-b border-blue-800 pb-2">
                    📋 Parameter Petugas & Khutbah Jumat
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Tanggal Khutbah:
                      </label>
                      <input
                        type="date"
                        value={adminSettings?.jumatDate || ''}
                        onChange={(e) => handleTextSettingChange('jumatDate', e.target.value)}
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2.5 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Topik / Tema Khutbah Jumat:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.jumatTopicTitle || ''}
                        onChange={(e) => handleTextSettingChange('jumatTopicTitle', e.target.value)}
                        placeholder="Contoh: Memperkokoh Ukhuwah..."
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2.5 text-amber-300 font-serif text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Nama Khatib Jumat:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.jumatKhatibName || ''}
                        onChange={(e) => handleTextSettingChange('jumatKhatibName', e.target.value)}
                        placeholder="Ustadz / Prof..."
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Nama Imam Jumat:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.jumatImamName || ''}
                        onChange={(e) => handleTextSettingChange('jumatImamName', e.target.value)}
                        placeholder="Ustadz..."
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Nama Muadzin Jumat:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.jumatMuadzinName || ''}
                        onChange={(e) => handleTextSettingChange('jumatMuadzinName', e.target.value)}
                        placeholder="Ustadz..."
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-white text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-blue-300 font-semibold block mb-1">
                        Waktu Pelaksanaan:
                      </label>
                      <input
                        type="text"
                        value={adminSettings?.jumatTimeInfo || ''}
                        onChange={(e) => handleTextSettingChange('jumatTimeInfo', e.target.value)}
                        placeholder="Jumat Ini, 11:55 WIB"
                        className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-amber-300 font-mono text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Fitur & Kontak Masjid */}
                <div className="bg-blue-950 p-4 rounded-xl border border-blue-800 space-y-3">
                  <span className="text-xs font-bold text-blue-400 uppercase font-mono block border-b border-blue-800 pb-2">
                    📌 Info Fitur Aplikasi & Kontak DKM
                  </span>

                  <div>
                    <label className="text-xs text-blue-300 font-semibold block mb-1">
                      Deskripsi Ringkas Fitur Aplikasi:
                    </label>
                    <textarea
                      rows={2}
                      value={adminSettings?.featureInfoAnnouncement || ''}
                      onChange={(e) => handleTextSettingChange('featureInfoAnnouncement', e.target.value)}
                      placeholder="Informasi fitur aplikasi untuk publik..."
                      className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-blue-200 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300 font-semibold block mb-1">
                      Alamat Lengkap Masjid:
                    </label>
                    <input
                      type="text"
                      value={adminSettings?.masjidAddressInfo || ''}
                      onChange={(e) => handleTextSettingChange('masjidAddressInfo', e.target.value)}
                      placeholder="Jl. Ir. H. Juanda No. 78, Sentul City..."
                      className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300 font-semibold block mb-1">
                      No. Kontak WhatsApp Sekertariat DKM:
                    </label>
                    <input
                      type="text"
                      value={adminSettings?.masjidPhoneContact || ''}
                      onChange={(e) => handleTextSettingChange('masjidPhoneContact', e.target.value)}
                      placeholder="+62 812-9876-5432"
                      className="w-full bg-blue-900 border border-blue-800 rounded-xl p-2 text-blue-400 font-mono text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-blue-300 font-semibold block mb-1">
                      Pilih Pengurus Utama untuk Footer (Maksimal 3):
                    </label>
                    <div className="space-y-2 bg-blue-900 border border-blue-800 p-3 rounded-xl max-h-48 overflow-y-auto">
                      {(store.state.boardMembers || []).sort((a,b)=>a.orderIdx-b.orderIdx).map(member => (
                        <label key={member.id} className="flex items-center gap-2 text-xs text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(adminSettings?.footerPengurusIds || []).includes(member.id)}
                            onChange={(e) => {
                              const currentSelected = adminSettings?.footerPengurusIds || [];
                              let newSelected = [...currentSelected];
                              if (e.target.checked) {
                                if (currentSelected.length < 3) {
                                  newSelected.push(member.id);
                                } else {
                                  alert('Maksimal hanya 3 pengurus untuk footer.');
                                  return;
                                }
                              } else {
                                newSelected = newSelected.filter(id => id !== member.id);
                              }
                              if (onUpdateAdminSettings) {
                                onUpdateAdminSettings({ footerPengurusIds: newSelected });
                              }
                            }}
                            className="w-4 h-4 rounded text-blue-600 bg-blue-950 border-blue-700"
                          />
                          <span>{member.name} - {member.position}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-800">
                    <label className="text-xs text-blue-300 font-semibold block mb-2">
                      Menu Khusus Layanan Jamaah (Kosongkan untuk pakai default):
                    </label>
                    <div className="space-y-2">
                      {(adminSettings?.layananJamaahLinks || []).map((link, idx) => (
                        <div key={link.id || idx} className="flex gap-2 bg-blue-900 border border-blue-800 p-2 rounded-lg items-center">
                          <input 
                            type="text" 
                            value={link.title} 
                            onChange={(e) => {
                              const newLinks = [...(adminSettings?.layananJamaahLinks || [])];
                              newLinks[idx] = { ...newLinks[idx], title: e.target.value };
                              if (onUpdateAdminSettings) onUpdateAdminSettings({ layananJamaahLinks: newLinks });
                            }}
                            className="bg-blue-950 border border-blue-800 rounded p-1 text-xs text-white flex-1 outline-none" 
                            placeholder="Judul Menu"
                          />
                          <select
                            value={link.action || 'link'}
                            onChange={(e) => {
                              const newLinks = [...(adminSettings?.layananJamaahLinks || [])];
                              newLinks[idx] = { ...newLinks[idx], action: e.target.value as any };
                              if (onUpdateAdminSettings) onUpdateAdminSettings({ layananJamaahLinks: newLinks });
                            }}
                            className="bg-blue-950 border border-blue-800 rounded p-1 text-xs text-blue-200 outline-none w-28"
                          >
                            <option value="donation">Donasi</option>
                            <option value="calculator">Kalkulator</option>
                            <option value="quran">Al-Qur'an</option>
                            <option value="salat">Jadwal Shalat</option>
                            <option value="link">URL Link</option>
                          </select>
                          {link.action === 'link' && (
                            <input 
                              type="text" 
                              value={link.url || ''} 
                              onChange={(e) => {
                                const newLinks = [...(adminSettings?.layananJamaahLinks || [])];
                                newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                                if (onUpdateAdminSettings) onUpdateAdminSettings({ layananJamaahLinks: newLinks });
                              }}
                              className="bg-blue-950 border border-blue-800 rounded p-1 text-xs text-blue-200 flex-1 outline-none font-mono" 
                              placeholder="https://..."
                            />
                          )}
                          <button 
                            onClick={() => {
                              const newLinks = [...(adminSettings?.layananJamaahLinks || [])];
                              newLinks.splice(idx, 1);
                              if (onUpdateAdminSettings) onUpdateAdminSettings({ layananJamaahLinks: newLinks });
                            }}
                            className="p-1 text-red-400 hover:bg-red-900/30 rounded"
                            title="Hapus Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newLinks = [...(adminSettings?.layananJamaahLinks || [])];
                          newLinks.push({ id: Date.now().toString(), title: 'Menu Baru', action: 'link', url: '' });
                          if (onUpdateAdminSettings) onUpdateAdminSettings({ layananJamaahLinks: newLinks });
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Menu Layanan Jamaah
                      </button>
                  </div>
                </div>

                {/* Danger Zone: Hard Reset Data */}
                <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50 space-y-3 mt-6">
                  <span className="text-xs font-bold text-red-400 uppercase font-mono block border-b border-red-900/50 pb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Danger Zone (Pembersihan Data Browser)
                  </span>
                  <p className="text-xs text-red-200/80">
                    Perhatian: Tombol di bawah ini akan menghapus SELURUH data lokal (Local Storage) di browser ini, termasuk sesi login Anda. Gunakan fitur ini jika Anda ingin melakukan reset sebelum aplikasi Go-Live atau jika terjadi error sinkronisasi yang parah.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('PERINGATAN KERAS!\n\nApakah Anda YAKIN ingin menghapus seluruh data lokal Masjid Tazkia di browser ini?\nAnda akan otomatis ter-logout.')) {
                        localStorage.clear();
                        alert('Data lokal berhasil dibersihkan. Aplikasi akan dimuat ulang.');
                        window.location.href = '/';
                      }
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Seluruh Data Local Storage</span>
                  </button>
                </div>
              </div>
            </div>
            </div>

            {/* Box 5: Pengaturan Media Sosial */}
            <div className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-4">
              <h4 className="font-serif font-bold text-white text-base flex items-center gap-2 border-b border-blue-800 pb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>5. Pengaturan Tautan Media Sosial</span>
              </h4>
              <p className="text-xs text-blue-300">Kelola tautan media sosial yang akan muncul di halaman beranda (Footer). Kosongkan jika ingin menghapus, atau tambah baru.</p>

              <div className="space-y-3">
                {(adminSettings?.socialMediaLinks || []).map((link, idx) => (
                  <div key={link.id || idx} className="flex gap-2 items-center bg-blue-950 p-3 rounded-xl border border-blue-800">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-blue-400 block mb-1">Nama Platform (Misal: Facebook, TikTok):</label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...(adminSettings?.socialMediaLinks || [])];
                            newLinks[idx] = { ...newLinks[idx], platform: e.target.value };
                            if (onUpdateAdminSettings) onUpdateAdminSettings({ socialMediaLinks: newLinks });
                          }}
                          className="w-full bg-blue-900 border border-blue-800 rounded-lg p-2 text-white text-xs outline-none"
                          placeholder="Platform"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-blue-400 block mb-1">URL (Tautan Lengkap):</label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...(adminSettings?.socialMediaLinks || [])];
                            newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                            if (onUpdateAdminSettings) onUpdateAdminSettings({ socialMediaLinks: newLinks });
                          }}
                          className="w-full bg-blue-900 border border-blue-800 rounded-lg p-2 text-blue-200 font-mono text-xs outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newLinks = [...(adminSettings?.socialMediaLinks || [])];
                        newLinks.splice(idx, 1);
                        if (onUpdateAdminSettings) onUpdateAdminSettings({ socialMediaLinks: newLinks });
                      }}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg self-end mb-1"
                      title="Hapus Media Sosial"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newLinks = [...(adminSettings?.socialMediaLinks || [])];
                    newLinks.push({ id: `sm-${Date.now()}`, platform: 'Platform Baru', url: '' });
                    if (onUpdateAdminSettings) onUpdateAdminSettings({ socialMediaLinks: newLinks });
                  }}
                  className="mt-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors border border-blue-500/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Media Sosial Baru</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INVENTARIS MASJID */}
        {dkmTab === 'inventaris' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-white">
                Manajemen Aset & Inventaris Masjid
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingInventoryId(null);
                    setInvName('');
                    setInvCategory('Elektronik');
                    setInvQty(1);
                    setInvUnit('Unit');
                    setInvCondition('Baik');
                    setInvLocation('Ruang Utama');
                    setInvImageUrl('https://images.unsplash.com/photo-1589803138861-5915e8b62562?auto=format&fit=crop&w=800&q=80');
                    setInvPurchasePrice(0);
                    setInvPurchaseDate('');
                    setInvUsefulLifeMonths(0);
                    setShowAddInv(!showAddInv);
                  }}
                  className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Barang Inventaris</span>
                </button>
                <button
                  onClick={() => {
                    if(window.confirm('Anda yakin ingin menghitung penyusutan semua Aset Tetap bulan ini? Jurnal beban penyusutan akan otomatis dibuat.')) {
                      store.hitungPenyusutanAset();
                      alert('Perhitungan Penyusutan Berhasil!');
                    }
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Hitung Penyusutan Aset Tetap (Bulan Ini)</span>
                </button>
              </div>
            </div>

            {/* Add Inventory Form */}
            {showAddInv && (
              <form onSubmit={handleCreateInventory} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nama Barang:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wireless Mic Shure..."
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Kategori:</label>
                    <input
                      type="text"
                      value={invCategory}
                      onChange={(e) => setInvCategory(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Jumlah & Satuan:</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={invQty}
                        onChange={(e) => setInvQty(Number(e.target.value))}
                        className="w-20 bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                      />
                      <input
                        type="text"
                        value={invUnit}
                        onChange={(e) => setInvUnit(e.target.value)}
                        className="flex-1 bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Harga Beli (Rp):</label>
                    <input
                      type="number"
                      value={invPurchasePrice}
                      onChange={(e) => setInvPurchasePrice(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Tanggal Beli:</label>
                    <input
                      type="date"
                      value={invPurchaseDate}
                      onChange={(e) => setInvPurchaseDate(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Umur Ekonomis (Bulan):</label>
                    <input
                      type="number"
                      value={invUsefulLifeMonths}
                      onChange={(e) => setInvUsefulLifeMonths(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload & Real Pict Presets for Inventory */}
                <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Foto Barang Real Pict Aset Inventaris</span>
                    </label>
                    <label className="cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setInvImageUrl)}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="URL Foto Aset Inventaris..."
                    value={invImageUrl}
                    onChange={(e) => setInvImageUrl(e.target.value)}
                    className="w-full bg-blue-900 border border-blue-800 text-blue-300 text-xs rounded-xl px-3 py-2 outline-none"
                  />

                  {invImageUrl && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={invImageUrl}
                        alt="Preview Barang"
                        className="w-12 h-12 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                        onClick={() => setPreviewPhotoUrl(invImageUrl)}
                      />
                      <span className="text-[10px] text-blue-400 font-mono">Pratinjau Foto Aset Barang</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInventoryId(null);
                      setInvName('');
                      setShowAddInv(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs text-blue-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Simpan Barang
                  </button>
                </div>
              </form>
            )}

            <div className="bg-blue-900 border border-blue-800 rounded-2xl overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-blue-300 min-w-[800px]">
                <thead className="bg-blue-950 text-blue-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Foto Aset</th>
                    <th className="p-4">Kode Aset</th>
                    <th className="p-4">Nama Barang</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Jumlah</th>
                    <th className="p-4">Kondisi</th>
                    <th className="p-4">Lokasi</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800">
                  {inventories.map(inv => (
                    <tr key={inv.id} className="hover:bg-blue-800/40">
                      <td className="p-4">
                        {inv.imageUrl ? (
                          <img
                            src={inv.imageUrl}
                            alt={inv.name}
                            className="w-10 h-10 rounded-lg object-cover border border-blue-700 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setPreviewPhotoUrl(inv.imageUrl!)}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center text-blue-500 text-[10px]">
                            No Foto
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-blue-400 font-bold">{inv.code}</td>
                      <td className="p-4 font-bold text-white">{inv.name}</td>
                      <td className="p-4 text-blue-400">{inv.category}</td>
                      <td className="p-4 font-mono font-bold text-blue-200">
                        {inv.quantity} {inv.unit}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.condition === 'Baik' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {inv.condition}
                        </span>
                      </td>
                      <td className="p-4 text-blue-400">{inv.location}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingInventoryId(inv.id);
                              setInvName(inv.name);
                              setInvCategory(inv.category || '');
                              setInvQty(inv.quantity);
                              setInvUnit(inv.unit || 'Unit');
                              setInvCondition(inv.condition || 'Baik');
                              setInvLocation(inv.location || '');
                              setInvImageUrl(inv.imageUrl || '');
                              setInvPurchasePrice(inv.purchasePrice || 0);
                              setInvPurchaseDate(inv.purchaseDate || '');
                              setInvUsefulLifeMonths(inv.usefulLifeMonths || 0);
                              setShowAddInv(true);
                            }}
                            title="Edit Barang"
                            className="text-blue-400 hover:text-blue-300 p-1 rounded cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus barang inventaris "${inv.name}"?`)) {
                                onDeleteInventory(inv.id);
                              }
                            }}
                            title="Hapus Barang"
                            className="text-rose-400 hover:text-rose-300 p-1 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: JADWAL PETUGAS */}
        {dkmTab === 'petugas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                Penjadwalan Imam, Muadzin, & Khatib Jumat
              </h3>
              <button
                onClick={() => setDkmTab('pengaturan')}
                className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold px-4 py-2 rounded-xl text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Settings className="w-4 h-4" /> <span>Pengaturan Khutbah Jumat Lengkap</span>
              </button>
            </div>

            {/* Featured Friday Khutbah Card */}
            <div className="bg-gradient-to-r from-blue-900 via-[#0e1d38] to-blue-900 border-2 border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <span className="bg-amber-500 text-blue-950 font-bold font-mono text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  INFORMASI KHUTBAH JUMAT TERKINI (AKTIF DI TV SIGNAGE)
                </span>
                <span className="text-xs text-amber-300 font-mono font-bold">
                  {adminSettings?.jumatTimeInfo || 'Jumat Ini, 11:55 WIB'}
                </span>
              </div>
              <h4 className="text-sm sm:text-lg font-serif font-bold text-amber-300 leading-snug">
                "{adminSettings?.jumatTopicTitle || 'Memperkokoh Ukhuwah & Transparansi Pengelolaan Aset Umat'}"
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-200 font-sans pt-1">
                <div className="bg-blue-950/80 p-2.5 rounded-xl border border-blue-800">
                  <span className="text-[10px] text-blue-400 block font-mono">Khatib Jumat:</span>
                  <p className="font-serif font-bold text-white text-xs sm:text-sm">{adminSettings?.jumatKhatibName || 'Prof. Dr. KH. Nasaruddin Umar, MA'}</p>
                </div>
                <div className="bg-blue-950/80 p-2.5 rounded-xl border border-blue-800">
                  <span className="text-[10px] text-blue-400 block font-mono">Imam Jumat:</span>
                  <p className="font-serif font-bold text-white text-xs sm:text-sm">{adminSettings?.jumatImamName || 'Ustadz H. M. Zainuddin, Sq'}</p>
                </div>
                <div className="bg-blue-950/80 p-2.5 rounded-xl border border-blue-800">
                  <span className="text-[10px] text-blue-400 block font-mono">Muadzin Jumat:</span>
                  <p className="font-serif font-bold text-white text-xs sm:text-sm">{adminSettings?.jumatMuadzinName || 'Ustadz Bilal Al-Hafiz'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {petugasList.map(p => (
                <div key={p.id} className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-blue-800 pb-2">
                    <span className="font-serif font-bold text-blue-400 text-sm">{p.dayName}, {p.date}</span>
                    <span className="text-[10px] bg-blue-800 text-blue-400 font-mono px-2 py-0.5 rounded">Jadwal Tugas</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-400 text-[10px]">Imam Subuh:</span>
                      <p className="font-bold text-white">{p.subuh}</p>
                    </div>
                    <div>
                      <span className="text-blue-400 text-[10px]">Imam Dzuhur:</span>
                      <p className="font-bold text-white">{p.dzuhur}</p>
                    </div>
                    <div>
                      <span className="text-blue-400 text-[10px]">Imam Ashar:</span>
                      <p className="font-bold text-white">{p.ashar}</p>
                    </div>
                    <div>
                      <span className="text-blue-400 text-[10px]">Imam Maghrib:</span>
                      <p className="font-bold text-white">{p.maghrib}</p>
                    </div>
                  </div>

                  {p.khatibJumat && (
                    <div className="bg-blue-950 p-3 rounded-xl border border-blue-500/30 text-xs">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">Khatib & Imam Shalat Jumat</span>
                      <p className="font-serif font-bold text-white text-xs sm:text-sm mt-0.5">{p.khatibJumat}</p>
                      <p className="text-[11px] text-blue-400 mt-1 italic">"{p.topikJumat || 'Kutbah Keutamaan Ketaatan'}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BROADCAST WHATSAPP */}
        {dkmTab === 'broadcast' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif text-white">
              Fitur Pengiriman Broadcast WhatsApp Resmi DKM
            </h3>

            <div className="bg-blue-900 border border-blue-800 rounded-2xl p-6 max-w-2xl mx-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-1">
                  Judul Pengumuman:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Undangan Kajian Subuh Berkah..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-300 block mb-1">
                  Isi Pesan Siaran:
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan isi pesan pengumuman untuk jamaah..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-blue-950 border border-blue-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <button
                onClick={handleSendWaBroadcast}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Siaran via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB QURBAN: MANAJEMEN PATUNGAN QURBAN & AQIQAH */}
        {dkmTab === 'qurban' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Manajemen Patungan Qurban & Shohibul Qurban Terdaftar
                </h3>
                <p className="text-xs text-blue-400 mt-0.5">
                  Kelola kelompok 1/7 Saham Sapi Qurban, Kambing Individual, dan Data Shohibul Qurban Jamaah.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingQurbanGroupId(null);
                  setQurbanGroupTitle('');
                  setQurbanWeightEstimate('');
                  setQurbanPricePerShare(3500000);
                  setQurbanTotalShares(7);
                  setShowAddQurbanGroupForm(!showAddQurbanGroupForm);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Kelompok Qurban Baru</span>
              </button>
            </div>

            {/* Form Add/Edit Qurban Group */}
            {showAddQurbanGroupForm && (
              <form onSubmit={handleSaveQurbanGroup} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-blue-800 pb-2">
                  {editingQurbanGroupId ? 'Edit Kelompok Qurban' : 'Buat Kelompok Qurban Baru'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nama Kelompok:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kelompok Sapi A (Tazkia 1447H)"
                      value={qurbanGroupTitle}
                      onChange={(e) => setQurbanGroupTitle(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Jenis Hewan:</label>
                    <select
                      value={qurbanAnimalType}
                      onChange={(e) => {
                        setQurbanAnimalType(e.target.value as any);
                        // Auto total shares based on type
                        if (e.target.value === 'SAPI') {
                          setQurbanTotalShares(7);
                          setQurbanPricePerShare(3500000);
                        } else {
                          setQurbanTotalShares(1);
                          setQurbanPricePerShare(2800000);
                        }
                      }}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="SAPI">SAPI (Patungan 1/7)</option>
                      <option value="KAMBING / DOMBA">KAMBING / DOMBA (Individual)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Estimasi Berat:</label>
                    <input
                      type="text"
                      placeholder="Contoh: 320 - 350 KG"
                      value={qurbanWeightEstimate}
                      onChange={(e) => setQurbanWeightEstimate(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Harga per Saham (Rp):</label>
                    <input
                      type="number"
                      value={qurbanPricePerShare}
                      onChange={(e) => setQurbanPricePerShare(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Jumlah Kuota Saham:</label>
                    <input
                      type="number"
                      value={qurbanTotalShares}
                      onChange={(e) => setQurbanTotalShares(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Link Gambar Banner Hewan:</label>
                    <input
                      type="text"
                      value={qurbanImageUrl}
                      onChange={(e) => setQurbanImageUrl(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-blue-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddQurbanGroupForm(false)}
                    className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 text-xs px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Simpan Kelompok
                  </button>
                </div>
              </form>
            )}

            {/* Form Add/Edit Participant Shohibul Qurban */}
            {(addingParticipantGroupId !== null || editingParticipantData !== null) && (
              <form onSubmit={handleSaveParticipant} className="bg-blue-900 border border-amber-500/30 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-amber-400 border-b border-blue-800 pb-2">
                  {editingParticipantData ? 'Koreksi Data Shohibul Qurban' : 'Tambah Shohibul Qurban'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nama Shohibul (Mudhahhi):</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap shohibul qurban..."
                      value={shohibulName}
                      onChange={(e) => setShohibulName(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Jumlah Bagian / Saham:</label>
                    <input
                      type="number"
                      min="1"
                      value={shohibulSharesCount}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setShohibulSharesCount(count);
                        // Auto calculate total paid
                        const activeGroupId = editingParticipantData?.groupId || addingParticipantGroupId;
                        const price = qurbanGroups.find(g => g.id === activeGroupId)?.pricePerShare || 3500000;
                        setShohibulTotalPaid(count * price);
                      }}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Total Setoran Qurban (Rp):</label>
                    <input
                      type="number"
                      value={shohibulTotalPaid}
                      onChange={(e) => setShohibulTotalPaid(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nomor WA / Kontak:</label>
                    <input
                      type="text"
                      placeholder="Contoh: 08123456789"
                      value={shohibulPhone}
                      onChange={(e) => setShohibulPhone(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-blue-800 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingParticipantGroupId(null);
                      setEditingParticipantData(null);
                      setShohibulName('');
                      setShohibulPhone('');
                    }}
                    className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 text-xs px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Simpan Data Shohibul
                  </button>
                </div>
              </form>
            )}

            {/* Qurban Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {qurbanGroups.map(group => (
                <div key={group.id} className="bg-blue-900 border border-blue-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img src={group.imageUrl} alt={group.title} className="w-14 h-14 rounded-xl object-cover border border-blue-800" />
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{group.animalType} ({group.weightEstimate})</span>
                          <h4 className="font-serif font-bold text-white text-sm leading-tight">{group.title}</h4>
                          <p className="text-xs text-blue-400 font-mono font-bold mt-0.5">{formatRupiahFull(group.pricePerShare)} / Saham</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditQurbanGroup(group)}
                          title="Edit Kelompok"
                          className="p-1 text-blue-300 hover:text-blue-100 hover:bg-blue-800 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQurbanGroup(group.id)}
                          title="Hapus Kelompok"
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-blue-800 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-blue-400">Slot Terisi:</span>
                        <span className="text-amber-300 font-bold">{group.filledShares} / {group.totalShares} Saham</span>
                      </div>

                      <span className="text-[10px] font-mono text-blue-300 uppercase block font-bold border-t border-blue-800 pt-2">
                        Daftar Shohibul Qurban ({group.participants.length}):
                      </span>
                      {group.participants.length > 0 ? (
                        <ul className="text-xs text-blue-300 space-y-1.5 divide-y divide-blue-900/30">
                          {group.participants.map(p => (
                            <li key={p.id} className="flex justify-between items-center text-[11px] font-mono pt-1.5 first:pt-0">
                              <div className="flex flex-col truncate max-w-[150px]">
                                <span className="text-white font-medium truncate">• {p.mudhahhiName}</span>
                                {p.phone && <span className="text-[9px] text-blue-500">WA: {p.phone}</span>}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-blue-400 font-bold">Ref: {p.transactionRef}</span>
                                <div className="flex gap-0.5">
                                  <button
                                    onClick={() => handleEditParticipant(group.id, p)}
                                    title="Edit Shohibul"
                                    className="p-0.5 text-blue-400 hover:text-white"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteParticipant(group.id, p.id)}
                                    title="Hapus Shohibul"
                                    className="p-0.5 text-red-400 hover:text-white"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-blue-500 italic">Belum ada peserta terdaftar.</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAddingParticipantGroupId(group.id);
                      setEditingParticipantData(null);
                      setShohibulName('');
                      setShohibulPhone('');
                      setShohibulSharesCount(1);
                      setShohibulTotalPaid(group.pricePerShare);
                    }}
                    className="w-full mt-4 bg-blue-950 hover:bg-blue-800 border border-blue-800 text-blue-300 hover:text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Shohibul</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: MANAJEMEN PROGRAM */}
        {dkmTab === 'program' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-white">
                Manajemen Campaign Program ZISWAF
              </h3>

              <button
                onClick={() => setShowAddProg(!showAddProg)}
                className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Program Donasi Baru</span>
              </button>
            </div>

            {showAddProg && (
              <form onSubmit={handleCreateProgram} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Judul Program:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wakaf Karpet Turki..."
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Kategori:</label>
                    <select
                      value={progCategory}
                      onChange={(e) => setProgCategory(e.target.value as any)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="wakaf">Wakaf</option>
                      <option value="zakat">Zakat</option>
                      <option value="infaq">Infaq</option>
                      <option value="shadaqah">Shadaqah</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Target Dana (Rp):</label>
                    <input
                      type="number"
                      value={progTarget}
                      onChange={(e) => setProgTarget(Number(e.target.value))}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs font-mono rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                {/* Program Real Pict Upload */}
                <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Foto Banner Campaign Program Real Pict</span>
                    </label>
                    <label className="cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>Upload Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setProgImageUrl)}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="URL Banner Foto Program..."
                    value={progImageUrl}
                    onChange={(e) => setProgImageUrl(e.target.value)}
                    className="w-full bg-blue-900 border border-blue-800 text-blue-300 text-xs rounded-xl px-3 py-2 outline-none"
                  />

                  {progImageUrl && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={progImageUrl}
                        alt="Preview Program"
                        className="w-16 h-12 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                        onClick={() => setPreviewPhotoUrl(progImageUrl)}
                      />
                      <span className="text-[10px] text-blue-400 font-mono">Pratinjau Foto Campaign Program</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProg(false)}
                    className="px-4 py-2 rounded-xl text-xs text-blue-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Simpan Program
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map(p => (
                <div key={p.id} className="bg-blue-900 border border-blue-800 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/40 transition-all">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-20 h-20 rounded-xl object-cover border border-blue-700 cursor-pointer shrink-0"
                    onClick={() => setPreviewPhotoUrl(p.imageUrl)}
                  />
                  <div className="flex-1">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      {p.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{p.title}</h4>
                    <p className="text-xs font-mono text-blue-400 mt-1">
                      Target: {formatRupiahFull(p.targetAmount)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {onDeleteProgram && (
                      <button
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
                            onDeleteProgram(p.id);
                          }
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors border border-red-500/30 cursor-pointer"
                        title="Hapus Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PENGUMUMAN & GALERI KEGIATAN */}
        {dkmTab === 'pengumuman' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Manajemen Pengumuman & Galeri Foto Kegiatan Masjid
                </h3>
                <p className="text-xs text-blue-400">
                  Kelola siaran berita, galeri dokumentasi kajian, & informasi kegiatan jamaah dengan foto real pict.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAnnouncementId(null);
                  setAncTitle('');
                  setAncContent('');
                  setAncCategory('Kajian');
                  setAncAuthor('Pengurus DKM Tazkia');
                  setAncImageUrl('https://images.unsplash.com/photo-1598492212952-475ea7aeb6e2?auto=format&fit=crop&w=800&q=80');
                  setShowAddAnc(!showAddAnc);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengumuman / Foto Dokumentasi</span>
              </button>
            </div>

            {/* Add Announcement Form Modal */}
            {showAddAnc && (
              <form onSubmit={handleCreateAnnouncement} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Judul Pengumuman:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kajian Bulanan Fiqih..."
                      value={ancTitle}
                      onChange={(e) => setAncTitle(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Kategori:</label>
                    <select
                      value={ancCategory}
                      onChange={(e) => setAncCategory(e.target.value as any)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="Kajian">Kajian</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Penting">Penting</option>
                      <option value="Keuangan">Keuangan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Penulis / Redaksi:</label>
                    <input
                      type="text"
                      value={ancAuthor}
                      onChange={(e) => setAncAuthor(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-300 block mb-1">Isi Berita / Keterangan:</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan detail pengumuman atau laporan kegiatan..."
                    value={ancContent}
                    onChange={(e) => setAncContent(e.target.value)}
                    className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl p-3 outline-none"
                  />
                </div>

                {/* Photo Upload for Announcement */}
                <div className="bg-blue-950 p-3 rounded-xl border border-blue-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Foto Dokumentasi Kegiatan Real Pict</span>
                    </label>
                    <label className="cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setAncImageUrl)}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="URL Foto Dokumentasi..."
                    value={ancImageUrl}
                    onChange={(e) => setAncImageUrl(e.target.value)}
                    className="w-full bg-blue-900 border border-blue-800 text-blue-300 text-xs rounded-xl px-3 py-2 outline-none"
                  />

                  {ancImageUrl && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={ancImageUrl}
                        alt="Preview Foto"
                        className="w-16 h-12 rounded-lg object-cover border border-blue-500/40 cursor-pointer"
                        onClick={() => setPreviewPhotoUrl(ancImageUrl)}
                      />
                      <span className="text-[10px] text-blue-400 font-mono">Pratinjau Foto Dokumentasi Real Pict</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAnnouncementId(null);
                      setAncTitle('');
                      setAncContent('');
                      setShowAddAnc(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs text-blue-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-blue-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    {editingAnnouncementId ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {announcements.map(a => (
                <div key={a.id} className="bg-blue-900 border border-blue-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all flex flex-col">
                  {a.imageUrl && (
                    <div className="h-40 bg-blue-950 overflow-hidden relative group">
                      <img
                        src={a.imageUrl}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setPreviewPhotoUrl(a.imageUrl!)}
                      />
                      <span className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-md text-blue-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/30">
                        {a.category}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif font-bold text-white text-base leading-snug">{a.title}</h4>
                      <p className="text-xs text-blue-400 mt-2 line-clamp-3">{a.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-800 text-[10px] font-mono text-blue-500">
                      <div className="flex flex-col">
                        <span>{a.date}</span>
                        <span>By {a.author}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAnnouncementId(a.id);
                            setAncTitle(a.title);
                            setAncContent(a.content);
                            setAncCategory(a.category);
                            setAncAuthor(a.author);
                            setAncImageUrl(a.imageUrl || '');
                            setShowAddAnc(true);
                          }}
                          title="Edit Pengumuman"
                          className="text-blue-400 hover:text-blue-300 p-1 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus pengumuman "${a.title}"?`)) {
                              if (onDeleteAnnouncement) onDeleteAnnouncement(a.id);
                            }
                          }}
                          title="Hapus Pengumuman"
                          className="text-rose-400 hover:text-rose-300 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB: LAYANAN ADUAN */}
        {dkmTab === 'layanan_aduan' && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-amber-400" />
                  Layanan Aduan & Pesan Jamaah
                </h3>
                <p className="text-xs text-blue-400 mt-1">Kelola dan tanggapi masukan, pertanyaan, atau testimoni dari jamaah.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-1/4">Pengirim & Waktu</th>
                      <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-1/2">Pesan & Balasan</th>
                      <th className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center w-1/4">Status & Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feedbacks.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-400">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Belum ada pesan dari jamaah.</p>
                        </td>
                      </tr>
                    ) : (
                      feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(f => (
                        <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 align-top">
                            <p className="text-sm font-bold text-gray-800">{f.senderName}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{new Date(f.createdAt).toLocaleString('id-ID')}</p>
                          </td>
                          <td className="p-4 align-top">
                            <div className="bg-blue-50 text-blue-900 p-3 rounded-xl rounded-tl-sm text-sm mb-2 shadow-sm border border-blue-100">
                              {f.message}
                            </div>
                            {f.reply ? (
                              <div className="ml-4 mt-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Balasan DKM:</span>
                                <div className="bg-white border border-gray-200 text-gray-700 p-3 rounded-xl rounded-tl-sm text-sm shadow-sm relative">
                                  {f.reply}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 pl-1 block">
                                  {f.repliedAt ? new Date(f.repliedAt).toLocaleString('id-ID') : ''}
                                </span>
                              </div>
                            ) : (
                              <div className="mt-2 text-[10px] text-amber-500 italic flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Menunggu Balasan
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-top">
                            <div className="flex flex-col items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase w-24 text-center ${
                                f.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {f.status === 'replied' ? 'Dijawab' : 'Tertunda'}
                              </span>
                              {!f.reply && (
                                <button
                                  onClick={() => {
                                    const replyMsg = prompt('Masukkan balasan untuk ' + f.senderName + ':');
                                    if (replyMsg && replyMsg.trim() && onUpdateFeedback) {
                                      onUpdateFeedback(f.id, {
                                        reply: replyMsg.trim(),
                                        status: 'replied',
                                        repliedAt: new Date().toISOString()
                                      });
                                    }
                                  }}
                                  className="w-24 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <Send className="w-3 h-3" /> Balas
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* TAB: MANAJEMEN AKUN & ROLE */}
        {dkmTab === 'jamaah_manage' && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  Manajemen Akun & Role Pengguna
                </h3>
                <p className="text-xs text-blue-400 mt-1">Kelola data jamaah, atur hak akses (role) pengurus, jabatan DKM, dan kelola sandi pengguna.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingUserProfileId(null);
                  setUserFormName('');
                  setUserFormEmail('');
                  setUserFormPhone('');
                  setUserFormRole('dkm');
                  setUserFormPosition('Anggota DKM');
                  setUserFormPassword('');
                  setShowAddUserForm(!showAddUserForm);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengurus Baru</span>
              </button>
            </div>

            {/* Form Add/Edit User Profile */}
            {showAddUserForm && (
              <form onSubmit={handleSaveUser} className="bg-blue-900 border border-blue-500/30 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-blue-800 pb-2">
                  {editingUserProfileId ? 'Edit Profil Pengguna' : 'Tambah Pengurus / Jamaah Baru'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nama Lengkap:</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap..."
                      value={userFormName}
                      onChange={(e) => setUserFormName(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Email:</label>
                    <input
                      type="email"
                      placeholder="Email pengguna..."
                      value={userFormEmail}
                      onChange={(e) => setUserFormEmail(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Nomor Kontak / WA:</label>
                    <input
                      type="text"
                      placeholder="Contoh: 08123456789..."
                      value={userFormPhone}
                      onChange={(e) => setUserFormPhone(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Role Akses:</label>
                    <select
                      value={userFormRole}
                      onChange={(e) => {
                        const r = e.target.value as any;
                        setUserFormRole(r);
                        if (r === 'jamaah') setUserFormPosition('Jamaah');
                        else if (r === 'super_admin') setUserFormPosition('Super Admin & IT');
                      }}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="jamaah">Jamaah Biasa</option>
                      {store.state.appRoles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                      <option value="super_admin">Super Admin / Pengurus Utama</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">Jabatan / Tingkatan DKM:</label>
                    <select
                      value={userFormPosition}
                      onChange={(e) => setUserFormPosition(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="Ketua Dewan Pembina / Dewan Pembina Yayasan">Ketua Dewan Pembina / Dewan Pembina Yayasan</option>
                      <option value="Direktur / Direktur Masjid Tazkia Islamic Center">Direktur / Direktur Masjid Tazkia Islamic Center</option>
                      <option value="Ketua DKM Masjid Tazkia Islamic Center">Ketua DKM Masjid Tazkia Islamic Center</option>
                      <option value="Bendahara">Bendahara</option>
                      <option value="Bagian Penghimpunan">Bagian Penghimpunan</option>
                      <option value="Anggota DKM">Anggota DKM / Staff</option>
                      <option value="Super Admin & IT">Super Admin & IT</option>
                      <option value="Jamaah">Jamaah</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-blue-300 block mb-1">
                      Kata Sandi / Password {editingUserProfileId && '(Kosongkan jika tidak diubah)'}:
                    </label>
                    <input
                      type="password"
                      placeholder={editingUserProfileId ? "Biarkan kosong..." : "Masukkan sandi..."}
                      value={userFormPassword}
                      onChange={(e) => setUserFormPassword(e.target.value)}
                      className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      required={!editingUserProfileId}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-blue-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 text-xs px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Simpan Akun
                  </button>
                </div>
              </form>
            )}

            {/* Form Change Password Form */}
            {changingPasswordUserId !== null && (
              <form onSubmit={handleUpdatePasswordSubmit} className="bg-blue-900 border border-amber-500/30 p-5 rounded-2xl space-y-4 max-w-md mx-auto">
                <h4 className="text-sm font-bold text-amber-400 border-b border-blue-800 pb-2 flex items-center gap-1.5">
                  <span>Ubah Sandi Akun</span>
                </h4>
                <div>
                  <label className="text-xs font-semibold text-blue-300 block mb-1">Sandi Baru:</label>
                  <input
                    type="password"
                    placeholder="Masukkan sandi baru minimal 6 karakter..."
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-blue-800 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setChangingPasswordUserId(null);
                      setNewPasswordVal('');
                    }}
                    className="bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 text-xs px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Simpan Sandi Baru
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#0a1128] rounded-2xl shadow-xl overflow-hidden border border-blue-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-blue-950 text-blue-300 font-mono text-[10px] uppercase tracking-wider border-b border-blue-800">
                    <tr>
                      <th className="px-4 py-3">Nama Jamaah & Tingkatan</th>
                      <th className="px-4 py-3">Email & Kontak</th>
                      <th className="px-4 py-3">Role Akses</th>
                      <th className="px-4 py-3">Tanggal Bergabung</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-800/50">
                    {(() => {
                      const totalJamaahPages = Math.ceil(jamaahProfiles.length / jamaahPerPage);
                      const paginatedJamaah = jamaahProfiles.slice((jamaahPage - 1) * jamaahPerPage, jamaahPage * jamaahPerPage);
                      
                      if (paginatedJamaah.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-blue-500 font-medium">Belum ada data pengguna.</td>
                          </tr>
                        );
                      }

                      return paginatedJamaah.map((j) => (
                        <React.Fragment key={j.id}>
                          <tr className="hover:bg-blue-900/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-white text-xs">{j.name}</div>
                              {j.dkmPosition && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 uppercase">
                                  {j.dkmPosition}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-blue-300 text-xs">
                              <div>{j.email}</div>
                              <div className="text-[10px] opacity-70">{j.phone || '-'}</div>
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={j.role} 
                                onChange={(e) => {
                                  const newRole = e.target.value as any;
                                  if (onUpdateJamaahProfile) {
                                    onUpdateJamaahProfile(j.id, { 
                                      role: newRole,
                                      dkmPosition: newRole === 'jamaah' ? 'Jamaah' : j.dkmPosition 
                                    });
                                  }
                                }}
                                className="bg-blue-950 border border-blue-800 text-amber-300 text-[10px] font-bold rounded-lg px-2 py-1 outline-none cursor-pointer"
                              >
                                <option value="jamaah">Jamaah Biasa</option>
                                {store.state.appRoles.map(r => (
                                  <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-blue-400 font-mono text-[10px]">{new Date(j.joinDate || j.createdAt || new Date()).toLocaleDateString('id-ID')}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center items-center gap-1.5 flex-wrap">
                                <button 
                                  onClick={() => setExpandedJamaahId(expandedJamaahId === j.id ? null : j.id)}
                                  className="text-xs text-emerald-400 hover:text-white font-bold px-2 py-1 rounded bg-blue-950 border border-blue-800 transition"
                                >
                                  {expandedJamaahId === j.id ? 'Tutup Histori' : 'Histori ZISWAF'}
                                </button>
                                <button 
                                  onClick={() => handleEditUser(j)}
                                  className="text-xs text-blue-400 hover:text-white font-bold px-2 py-1 rounded bg-blue-950 border border-blue-800 transition"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => setChangingPasswordUserId(j.id)}
                                  className="text-xs text-amber-400 hover:text-white font-bold px-2 py-1 rounded bg-blue-950 border border-blue-800 transition"
                                >
                                  Sandi
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(j.id, j.name)}
                                  className="text-xs text-rose-400 hover:text-white font-bold px-2 py-1 rounded bg-blue-950 border border-blue-800 transition"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Row for Donation History */}
                          {expandedJamaahId === j.id && (
                            <tr>
                              <td colSpan={5} className="bg-blue-950 p-4 border-t border-blue-800">
                                <div className="bg-blue-900 border border-blue-800 rounded-xl p-4">
                                  <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    Rekap Histori ZISWAF & Donasi: {j.name}
                                  </h4>
                                  
                                  {(() => {
                                    const userDonations = donations.filter(d => 
                                      (d.donorName.toLowerCase() === j.name.toLowerCase()) || 
                                      (d.donorEmail && d.donorEmail.toLowerCase() === j.email.toLowerCase()) ||
                                      (d.donorPhone && d.donorPhone === j.phone)
                                    );
                                    
                                    if (userDonations.length === 0) {
                                      return <p className="text-xs text-blue-400">Belum ada histori transaksi untuk jamaah ini.</p>;
                                    }
                                    
                                    return (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                          <thead className="text-blue-300 border-b border-blue-800">
                                            <tr>
                                              <th className="py-2">Tanggal</th>
                                              <th className="py-2">Kategori</th>
                                              <th className="py-2">Keterangan / Program</th>
                                              <th className="py-2 text-right">Nominal</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-blue-800/30">
                                            {userDonations.map(d => (
                                              <tr key={d.id}>
                                                <td className="py-2 text-white">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                                                <td className="py-2">
                                                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-emerald-500/30">
                                                    {d.category}
                                                  </span>
                                                </td>
                                                <td className="py-2 text-blue-200">
                                                  <div>{d.programTitle}</div>
                                                  {d.notes && <div className="text-[10px] text-blue-400 opacity-80 mt-0.5 italic">"{d.notes}"</div>}
                                                </td>
                                                <td className="py-2 text-right font-mono font-bold text-amber-300">{formatRupiahFull(d.totalAmount)}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {Math.ceil(jamaahProfiles.length / jamaahPerPage) > 1 && (
                <div className="bg-blue-950 p-3 border-t border-blue-800 flex justify-between items-center text-xs">
                  <span className="text-blue-400 font-mono">
                    Halaman {jamaahPage} dari {Math.ceil(jamaahProfiles.length / jamaahPerPage)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setJamaahPage(prev => Math.max(1, prev - 1))}
                      disabled={jamaahPage === 1}
                      className="px-3 py-1 bg-blue-900 text-blue-300 rounded hover:bg-blue-800 disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setJamaahPage(prev => Math.min(Math.ceil(jamaahProfiles.length / jamaahPerPage), prev + 1))}
                      disabled={jamaahPage === Math.ceil(jamaahProfiles.length / jamaahPerPage)}
                      className="px-3 py-1 bg-blue-900 text-blue-300 rounded hover:bg-blue-800 disabled:opacity-50"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: AUDIT LOG */}
        {dkmTab === 'audit_log' && (
          <div className="space-y-6">
            <div className="bg-blue-900 border border-blue-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Sistem Audit Log Petugas
              </h3>
              <p className="text-xs text-blue-400 mt-1">Rekam jejak aktivitas login dan logout seluruh pengguna sistem.</p>
              
              {/* Date Filter */}
              <div className="mt-4 flex items-center gap-2">
                <input 
                  type="date" 
                  value={auditStartDate} 
                  onChange={(e) => { setAuditStartDate(e.target.value); setAuditPage(1); }}
                  className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none"
                />
                <span className="text-blue-400 text-sm font-bold">s/d</span>
                <input 
                  type="date" 
                  value={auditEndDate} 
                  onChange={(e) => { setAuditEndDate(e.target.value); setAuditPage(1); }}
                  className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none"
                />
              </div>
            </div>
            
            <div className="bg-[#0a1128] rounded-2xl shadow-xl overflow-hidden border border-blue-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-blue-950 text-blue-300 font-mono text-[10px] uppercase tracking-wider border-b border-blue-800">
                    <tr>
                      <th className="px-4 py-3">Waktu (WIB)</th>
                      <th className="px-4 py-3">Pengguna</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Aksi</th>
                      <th className="px-4 py-3">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-800/50">
                    {(() => {
                      const filteredAudit = auditLogs.filter(log => {
                        const logDate = log.timestamp.split('T')[0];
                        return logDate >= auditStartDate && logDate <= auditEndDate;
                      });
                      
                      const totalPages = Math.ceil(filteredAudit.length / auditPerPage);
                      const paginatedAudit = filteredAudit.slice((auditPage - 1) * auditPerPage, auditPage * auditPerPage);
                      
                      if (filteredAudit.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-blue-500 font-medium">Belum ada rekaman audit log pada periode ini.</td>
                          </tr>
                        );
                      }
                      
                      return (
                        <>
                          {paginatedAudit.map((log) => (
                            <tr key={log.id} className="hover:bg-blue-900/50 transition-colors">
                              <td className="px-4 py-3 font-mono text-[11px] text-blue-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-white">
                                <span className="font-bold block">{log.userName}</span>
                                <span className="text-[10px] text-blue-400">{log.userEmail}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="bg-blue-800 text-blue-200 font-mono text-[10px] px-2 py-0.5 rounded-full uppercase">
                                  {log.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                                  log.action === 'LOGIN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-blue-300 text-xs">
                                {log.details}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {(() => {
                const filteredAudit = auditLogs.filter(log => {
                  const logDate = log.timestamp.split('T')[0];
                  return logDate >= auditStartDate && logDate <= auditEndDate;
                });
                const totalPages = Math.ceil(filteredAudit.length / auditPerPage);
                
                if (totalPages > 1) {
                  return (
                    <div className="flex items-center justify-between p-4 bg-blue-950/50 border-t border-blue-800">
                      <span className="text-xs text-blue-400">
                        Halaman {auditPage} dari {totalPages} (Total {filteredAudit.length} data)
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                          disabled={auditPage === 1}
                          className="px-3 py-1 bg-blue-900 border border-blue-700 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                        >
                          Sebelumnya
                        </button>
                        <button 
                          onClick={() => setAuditPage(p => Math.min(totalPages, p + 1))}
                          disabled={auditPage === totalPages}
                          className="px-3 py-1 bg-blue-900 border border-blue-700 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                        >
                          Selanjutnya
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* TAB: PROFIL & PENGURUS */}
        {dkmTab === 'pengurus' && (
          <div className="animate-fadeIn">
            <BoardMemberAdmin />
          </div>
        )}

        {/* TAB: PENGATURAN APLIKASI */}
        {dkmTab === 'aplikasi' && (
          <div className="animate-fadeIn">
            <AppManagerAdmin />
          </div>
        )}

        {/* TAB: KONFIGURASI SUPABASE */}
        {dkmTab === 'supabase' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-blue-900 border border-blue-800 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/50">
                  <Database className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif">Status Database Supabase</h2>
                  <p className="text-blue-300 text-sm">Konfigurasi koneksi ke server backend Supabase PostgreSQL</p>
                </div>
              </div>

              <div className="bg-blue-950 p-4 rounded-xl border border-blue-800/50 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-emerald-400 text-sm">Terkoneksi via Environment Variables (.env)</span>
                </div>
                <p className="text-blue-200 text-xs leading-relaxed">
                  Untuk standar keamanan tertinggi (Enterprise Grade), aplikasi Masjid Tazkia mengamankan kunci rahasia Supabase Anda di tingkat <strong>Environment Build (sistem .env dan Netlify)</strong>, bukan di *browser* atau aplikasi secara langsung.
                </p>
              </div>

              <div className="space-y-4 text-sm text-blue-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-blue-800/50">
                  <div className="font-bold text-blue-300">URL Proyek</div>
                  <div className="sm:col-span-2 font-mono text-xs break-all bg-blue-950 px-3 py-2 rounded border border-blue-800">
                    {import.meta.env.VITE_SUPABASE_URL || 'Memuat...'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="font-bold text-blue-300">Anon Key / Public API</div>
                  <div className="sm:col-span-2 font-mono text-xs break-all bg-blue-950 px-3 py-2 rounded border border-blue-800 text-slate-400">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '•••••••••••••••••••••••••••••••• (Disembunyikan demi keamanan)' : 'Memuat...'}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-xs leading-relaxed">
                <strong>Catatan Pengurus:</strong> Jika Anda perlu mengubah kredensial database ini suatu saat nanti (misalnya pindah server), silakan ubah pengaturan <strong>Environment Variables</strong> di dashboard <strong>Netlify</strong> Anda secara langsung. Hal ini secara efektif akan mencegah peretas (*hacker*) mengetahui kunci API *database* Anda melalui celah aplikasi *front-end*.
              </div>
            </div>
          </div>
        )}

        {/* TAB: TANDA TANGAN LAPORAN */}
        {dkmTab === 'ttd_laporan' && (
          <div className="animate-fadeIn">
            <ReportSignatoryAdmin />
          </div>
        )}

      </div>

      {/* Lightbox / Zoom Photo Preview Modal */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-blue-900 border border-blue-500/30 rounded-3xl max-w-3xl w-full p-4 relative space-y-3 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-blue-800 pb-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Detail Foto Real Pict Database</span>
              </span>
              <button
                onClick={() => setPreviewPhotoUrl(null)}
                className="p-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] min-h-[300px] overflow-hidden rounded-2xl bg-black/50 flex items-center justify-center">
              <img
                src={previewPhotoUrl}
                alt="Foto Database Full"
                className="max-h-[70vh] w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-blue-400">
              <span className="truncate max-w-md">{previewPhotoUrl}</span>
              <a
                href={previewPhotoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Gambar Asli</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


