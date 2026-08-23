import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from './supabase';
import {
  Program,
  DonationRecord,
  FinancialTransaction,
  PetugasJadwal,
  InventoryItem,
  Announcement,
  ColorPalette,
  UserSession,
  JournalEntry,
  GeneralLedgerAccount,
  PettyCashEntry,
  AppAdminSettings,
  ThemeMode,
  GalleryItem,
  QurbanGroup,
  QurbanParticipant,
  UserRole,
  ERPChartOfAccount,
  ERPGeneralJournal,
  ERPJournalEntry,
  ERPBudgetEntry,
  ERPDisbursementRequest,
  ReportSignature,
  ReportSignatory,
  AuditLog,
  JamaahProfile,
  BoardMember,
  GedungBooking,
  MasjidAgenda,
  AgendaRegistration,
  AppRole,
  JamaahFeedback,
  JamaahCalendarNote,
  KamarBooking,
  KeropakTransaction,
  JamaahTransaction,
  TpaRegistration,
  MuallafRegistration
} from '../types';

import { sendWhatsAppMessage } from './whatsapp';
import { formatRupiahFull } from './islamicUtils';

import {
  INITIAL_PROGRAMS,
  INITIAL_DONATIONS,
  INITIAL_FINANCIAL,
  INITIAL_PETUGAS,
  INITIAL_INVENTORY,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_GL_ACCOUNTS,
  INITIAL_PETTY_CASH,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_GALLERY,
  INITIAL_QURBAN_GROUPS,
  INITIAL_ERP_COA,
  INITIAL_JAMAAH_PROFILES,
  INITIAL_AUDIT_LOGS,
  INITIAL_BOARD_MEMBERS,
  INITIAL_REPORT_SIGNATORIES,
  INITIAL_AGENDAS,
  INITIAL_ERP_BUDGETS
} from './initialData';

const LOCAL_STORAGE_KEY = 'masjid_Tazkia_app_state_v3';

export interface AppState {
  programs: Program[];
  donations: DonationRecord[];
  financials: FinancialTransaction[];
  petugas: PetugasJadwal[];
  inventories: InventoryItem[];
  announcements: Announcement[];
  journalEntries: JournalEntry[];
  glAccounts: GeneralLedgerAccount[];
  pettyCash: PettyCashEntry[];
  adminSettings: AppAdminSettings;
  galleryItems: GalleryItem[];
  qurbanGroups: QurbanGroup[];
  colorPalette: ColorPalette;
  themeMode: ThemeMode;
  session: UserSession;
  supabaseUrl: string;
  supabaseAnonKey: string;
  erpCoa: ERPChartOfAccount[];
  erpJournals: ERPGeneralJournal[];
  erpJournalEntries: ERPJournalEntry[];
  keropakTransactions: KeropakTransaction[];
  erpBudgets: ERPBudgetEntry[];
  erpDisbursements: ERPDisbursementRequest[];
  erpSignatures: ReportSignature[];
  auditLogs: AuditLog[];
  jamaahProfiles: JamaahProfile[];
  jamaahTransactions: JamaahTransaction[];
  tpaRegistrations: TpaRegistration[];
  muallafRegistrations: MuallafRegistration[];
  boardMembers: BoardMember[];
  reportSignatories: ReportSignatory[];
  gedungBookings: GedungBooking[];
  agendas: MasjidAgenda[];
  agendaRegistrations: AgendaRegistration[];
  unreadDonationsCount: number;
  feedbacks: JamaahFeedback[];
  calendarNotes: JamaahCalendarNote[];
  appRoles: AppRole[];
  kamarBookings: KamarBooking[];
  onlinePrayerData: any | null;
}

const defaultState: AppState = {
  programs: INITIAL_PROGRAMS,
  donations: INITIAL_DONATIONS,
  financials: [],
  petugas: INITIAL_PETUGAS,
  inventories: INITIAL_INVENTORY,
  announcements: INITIAL_ANNOUNCEMENTS,
  journalEntries: [],
  glAccounts: INITIAL_GL_ACCOUNTS,
  pettyCash: [],
  adminSettings: INITIAL_ADMIN_SETTINGS as AppAdminSettings,
  galleryItems: INITIAL_GALLERY,
  qurbanGroups: INITIAL_QURBAN_GROUPS,
  colorPalette: 'emerald_green',
  themeMode: 'light',
  session: {
    isLoggedIn: false,
    email: '',
    name: 'Jamaah Tazkia',
    role: 'jamaah'
  },
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  erpCoa: INITIAL_ERP_COA as ERPChartOfAccount[],
  erpJournals: [],
  erpJournalEntries: [],
  keropakTransactions: [],
  erpBudgets: INITIAL_ERP_BUDGETS,
  erpDisbursements: [],
  erpSignatures: [],
  auditLogs: INITIAL_AUDIT_LOGS,
  jamaahProfiles: INITIAL_JAMAAH_PROFILES,
  jamaahTransactions: [],
  tpaRegistrations: [],
  muallafRegistrations: [],
  boardMembers: INITIAL_BOARD_MEMBERS,
  reportSignatories: INITIAL_REPORT_SIGNATORIES,
  gedungBookings: [],
  agendas: INITIAL_AGENDAS,
    agendaRegistrations: [],
  appRoles: [
    { id: 'ketua_dewan_pembina', name: 'Ketua Dewan Pembina', type: 'pengurus_dkm', permissions: ['keuangan', 'laporan', 'approval_direktur', 'master_data', 'semua'] },
    { id: 'direktur', name: 'Direktur', type: 'pengurus_dkm', permissions: ['keuangan', 'laporan', 'approval_direktur', 'master_data', 'semua'] },
    { id: 'ketua_dkm', name: 'Ketua DKM', type: 'pengurus_dkm', permissions: ['keuangan', 'laporan', 'approval_direktur', 'master_data', 'semua'] },
    { id: 'bendahara', name: 'Bendahara', type: 'admin_masjid', permissions: ['keuangan', 'approval_bendahara', 'laporan', 'inventaris'] },
    { id: 'penghimpunan', name: 'Bagian Penghimpunan', type: 'admin_masjid', permissions: ['donasi', 'ziswaf'] },
    { id: 'penyaluran', name: 'Bagian Penyaluran', type: 'admin_masjid', permissions: ['program', 'agenda'] }
  ],
  unreadDonationsCount: 0,
  feedbacks: [],
  calendarNotes: [],
  kamarBookings: [],
  onlinePrayerData: null
};

export function getStoredState(): AppState {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        // Ensure initial fallback lists if empty
        programs: parsed.programs !== undefined ? parsed.programs : INITIAL_PROGRAMS,
        donations: parsed.donations !== undefined ? parsed.donations : INITIAL_DONATIONS,
        financials: parsed.financials || [],
        petugas: parsed.petugas !== undefined ? parsed.petugas : INITIAL_PETUGAS,
        inventories: parsed.inventories !== undefined ? parsed.inventories : INITIAL_INVENTORY,
        announcements: parsed.announcements !== undefined ? parsed.announcements : INITIAL_ANNOUNCEMENTS,
        journalEntries: parsed.journalEntries || [],
        glAccounts: parsed.glAccounts !== undefined ? parsed.glAccounts : INITIAL_GL_ACCOUNTS,
        pettyCash: parsed.pettyCash || [],
        adminSettings: parsed.adminSettings ? { 
          ...INITIAL_ADMIN_SETTINGS, 
          ...parsed.adminSettings,
          masjidLogoUrl: parsed.adminSettings.masjidLogoUrl?.startsWith('<') ? parsed.adminSettings.masjidLogoUrl.substring(1) : parsed.adminSettings.masjidLogoUrl
        } : INITIAL_ADMIN_SETTINGS,
        galleryItems: parsed.galleryItems !== undefined ? parsed.galleryItems : INITIAL_GALLERY,
        qurbanGroups: parsed.qurbanGroups !== undefined ? parsed.qurbanGroups : INITIAL_QURBAN_GROUPS,
        erpCoa: parsed.erpCoa !== undefined ? parsed.erpCoa : INITIAL_ERP_COA,
        erpJournals: parsed.erpJournals || [],
        erpJournalEntries: parsed.erpJournalEntries || [],
        erpBudgets: parsed.erpBudgets || [],
        erpDisbursements: parsed.erpDisbursements || [],
        erpSignatures: parsed.erpSignatures || [],
        auditLogs: parsed.auditLogs !== undefined ? parsed.auditLogs : INITIAL_AUDIT_LOGS,
        jamaahProfiles: parsed.jamaahProfiles !== undefined ? parsed.jamaahProfiles : INITIAL_JAMAAH_PROFILES,
        jamaahTransactions: parsed.jamaahTransactions || [],
        tpaRegistrations: parsed.tpaRegistrations || [],
        muallafRegistrations: parsed.muallafRegistrations || [],
        boardMembers: parsed.boardMembers !== undefined ? parsed.boardMembers : INITIAL_BOARD_MEMBERS,
        reportSignatories: parsed.reportSignatories !== undefined ? parsed.reportSignatories : INITIAL_REPORT_SIGNATORIES,
        gedungBookings: parsed.gedungBookings || [],
        agendas: parsed.agendas || INITIAL_AGENDAS,
        appRoles: parsed.appRoles || defaultState.appRoles,
        unreadDonationsCount: parsed.unreadDonationsCount || 0,
        feedbacks: parsed.feedbacks || [],
        calendarNotes: parsed.calendarNotes || [],
        kamarBookings: parsed.kamarBookings || [],
        onlinePrayerData: parsed.onlinePrayerData || null
      };
    }
  } catch (e) {
    console.error('Failed to load local state', e);
  }
  return defaultState;
}


export function saveStoredState(state: AppState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    // Push ke Supabase di background
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase) {
      // Hilangkan data session agar tidak ter-sync ke user lain
      const { session, ...syncState } = state;
      supabase.from('app_sync_state').upsert({ id: 1, state_json: syncState, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('Failed to sync state to Supabase', error);
        });
    }
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

// React custom hook for global state with automatic persistence
export function useMasjidStore() {
  const [state, setState] = useState<AppState>(getStoredState);
  const isInitialMount = useRef(true);
  const isGlobalStateLoaded = useRef(false);

  // Sync state ke LocalStorage dan Supabase jika berubah (kecuali reload pertama kali)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // CEGAH OVERWRITE! Jangan push ke Supabase sebelum data global berhasil di-load
    // agar setelan default di localhost tidak menimpa data production (Cpanel).
    if (getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey) && !isGlobalStateLoaded.current) {
      // Kita tetap simpan ke localStorage secara lokal, tapi JANGAN panggil saveStoredState
      // yang akan melakukan upsert ke Supabase.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      return;
    }
    saveStoredState(state);
  }, [state]);

  // Download global state dari Supabase saat aplikasi dibuka
  // Cloud adalah SUMBER KEBENARAN UTAMA (source of truth)
  // Jika ada data di Supabase, data tersebut MENGGANTIKAN data lokal sepenuhnya
  useEffect(() => {
    const fetchGlobalState = async () => {
      const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
      if (!supabase) {
        isGlobalStateLoaded.current = true;
        return;
      }
      try {
        const { data, error } = await supabase.from('app_sync_state').select('state_json').eq('id', 1).single();
        if (data && data.state_json) {
          setState(prev => {
            // Cloud wins completely - spread cloud data over defaults
            const cloudState = data.state_json;
            const newState: AppState = {
              ...defaultState,
              ...cloudState,
            };

            // Merge adminSettings: Cloud is source of truth, but fill missing keys from defaults
            if (cloudState.adminSettings) {
              newState.adminSettings = {
                ...INITIAL_ADMIN_SETTINGS,
                ...cloudState.adminSettings,
              };
            }

            // Preserve local session (login status)
            newState.session = prev.session;
            // Preserve local Supabase credentials  
            newState.supabaseUrl = prev.supabaseUrl || cloudState.supabaseUrl;
            newState.supabaseAnonKey = prev.supabaseAnonKey || cloudState.supabaseAnonKey;
            return newState;
          });
        }
      } catch (err) {
        console.error('Error fetching global state from Supabase', err);
      } finally {
        isGlobalStateLoaded.current = true;
      }
    };
    fetchGlobalState();
  }, []);

  const fetchPrograms = useCallback(async () => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching programs from Supabase:', error);
        return;
      }
      
      if (data) {
        // Map Supabase snake_case to camelCase
        const mappedPrograms = data.map(p => ({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          targetAmount: Number(p.target_amount),
          collectedAmount: Number(p.collected_amount),
          donorsCount: Number(p.donors_count),
          imageUrl: p.image_url,
          description: p.description,
          isUrgent: p.is_urgent,
          featured: p.featured
        }));
        setState(prev => ({ ...prev, programs: mappedPrograms as Program[] }));
      }
    } catch (err) {
      console.error('Failed to load programs from Supabase', err);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const addProgram = async (program: Omit<Program, 'id'>) => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase) {
      const { data, error } = await supabase.from('programs').insert([{
        title: program.title,
        subtitle: program.subtitle,
        category: program.category,
        target_amount: program.targetAmount,
        collected_amount: program.collectedAmount,
        donors_count: program.donorsCount,
        image_url: program.imageUrl,
        description: program.description,
        is_urgent: program.isUrgent,
        featured: program.featured
      }]).select();
      if (!error && data && data.length > 0) {
        fetchPrograms();
        return;
      }
    }
    
    // Fallback if no supabase or error
    const newProgram: Program = {
      ...program,
      id: `prg-${Math.floor(100 + Math.random() * 900)}`
    };
    setState(prev => ({ ...prev, programs: [newProgram, ...prev.programs] }));
  };

  const updateProgram = async (id: string, updated: Partial<Program>) => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase && id.length > 10) { // Supabase UUID is > 10 chars
      const updateData: any = {};
      if (updated.title !== undefined) updateData.title = updated.title;
      if (updated.subtitle !== undefined) updateData.subtitle = updated.subtitle;
      if (updated.category !== undefined) updateData.category = updated.category;
      if (updated.targetAmount !== undefined) updateData.target_amount = updated.targetAmount;
      if (updated.collectedAmount !== undefined) updateData.collected_amount = updated.collectedAmount;
      if (updated.donorsCount !== undefined) updateData.donors_count = updated.donorsCount;
      if (updated.imageUrl !== undefined) updateData.image_url = updated.imageUrl;
      if (updated.description !== undefined) updateData.description = updated.description;
      if (updated.isUrgent !== undefined) updateData.is_urgent = updated.isUrgent;
      if (updated.featured !== undefined) updateData.featured = updated.featured;

      const { error } = await supabase.from('programs').update(updateData).eq('id', id);
      if (!error) {
        fetchPrograms();
        return;
      }
    }

    // Fallback
    setState(prev => ({
      ...prev,
      programs: prev.programs.map(p => p.id === id ? { ...p, ...updated } : p)
    }));
  };

  const deleteProgram = async (id: string) => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase && id.length > 10) {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (!error) {
        fetchPrograms();
        return;
      }
    }

    // Fallback
    setState(prev => ({
      ...prev,
      programs: prev.programs.filter(p => p.id !== id)
    }));
  };

  const addDonation = (newDonation: Omit<DonationRecord, 'id' | 'createdAt'>) => {
    const id = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    const created: DonationRecord = {
      ...newDonation,
      id,
      createdAt
    };

    setState(prev => {
      let updatedPrograms = prev.programs;
      let newFinancials = prev.financials;

      let newErpJournals = prev.erpJournals || [];
      let newErpJournalEntries = prev.erpJournalEntries || [];
      let newJamaahProfiles = prev.jamaahProfiles || [];

      // Auto-create/sync Jamaah Profile
      const existingJamaahIdx = newJamaahProfiles.findIndex(j => {
        const emailMatch = created.donorEmail && j.email && j.email.toLowerCase() === created.donorEmail.toLowerCase();
        const normDonorPhone = created.donorPhone ? created.donorPhone.replace(/^0/, '+62').replace(/\s/g, '') : null;
        const normJPhone = j.phone ? j.phone.replace(/^0/, '+62').replace(/\s/g, '') : null;
        const phoneMatch = normDonorPhone && normJPhone && (normDonorPhone === normJPhone || created.donorPhone === j.phone);
        return emailMatch || phoneMatch;
      });

      if (existingJamaahIdx >= 0) {
        // Update total donation if successful
        if (created.status === 'berhasil') {
          newJamaahProfiles[existingJamaahIdx] = {
            ...newJamaahProfiles[existingJamaahIdx],
            totalDonation: (newJamaahProfiles[existingJamaahIdx].totalDonation || 0) + created.amount
          };
        }
      } else {
        // Create new
        const newProfile: JamaahProfile = {
          id: `JM-${Math.floor(1000 + Math.random() * 9000)}`,
          name: created.donorName,
          email: created.donorEmail || `jamaah${Math.floor(1000+Math.random()*9000)}@tazkia.id`,
          phone: created.donorPhone || '',
          totalDonation: created.status === 'berhasil' ? created.amount : 0,
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          role: 'jamaah'
        };
        newJamaahProfiles = [...newJamaahProfiles, newProfile];
      }

      if (created.status === 'berhasil') {
        // Update target collected in programs
        updatedPrograms = prev.programs.map(p => {
          if (p.id === created.programId) {
            return {
              ...p,
              collectedAmount: p.collectedAmount + created.amount,
              donorsCount: p.donorsCount + 1
            };
          }
          return p;
        });

        // Also automatically create a financial transaction record
        const newFinancial: FinancialTransaction = {
          id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
          type: 'masuk',
          title: `Donasi ${created.category.toUpperCase()} - ${created.programTitle}`,
          category: created.category.toUpperCase(),
          amount: created.amount,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan donasi dari ${created.donorName} via ${created.paymentMethod} (Ref: ${created.transactionRef})`
        };
        newFinancials = [newFinancial, ...prev.financials];

        // Accounting Integration: Create ERP Journal for ZISWAF
        let debitAccountId = 'coa-1102'; // Default Kas Bank Operasional
        let creditAccountId = 'coa-4100'; // Default Penerimaan ZISWAF

        const categoryUpper = created.category.toUpperCase();
        if (categoryUpper.includes('ZAKAT')) {
          debitAccountId = 'coa-1103'; // Kas Bank Zakat
          creditAccountId = 'coa-4102'; // Penerimaan Zakat Maal
        } else if (categoryUpper.includes('INFAQ') || categoryUpper.includes('SEDEKAH') || categoryUpper.includes('SHADAQAH')) {
          debitAccountId = 'coa-1104'; // Kas Bank Infaq/Sedekah
          creditAccountId = 'coa-4104'; // Penerimaan Infaq Transfer
        } else if (categoryUpper.includes('WAKAF')) {
          debitAccountId = 'coa-1105'; // Kas Bank Wakaf
          creditAccountId = 'coa-4105'; // Penerimaan Wakaf Tunai
        }

        const journalId = `JRN-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 100)}`;
        const newErpJournal: ERPGeneralJournal = {
          id: journalId,
          journalNo: `JV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan ${categoryUpper} - ${created.programTitle} (${created.donorName})`,
          reference: created.transactionRef || created.id,
          status: 'Posted',
          createdBy: 'Sistem ZISWAF',
          createdAt: new Date().toISOString()
        };

        const debitEntry: ERPJournalEntry = {
          id: `JE-D-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: debitAccountId,
          debit: created.amount,
          credit: 0,
          description: `Penerimaan ke Kas/Bank`
        };

        const creditEntry: ERPJournalEntry = {
          id: `JE-C-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: creditAccountId,
          debit: 0,
          credit: created.amount,
          description: `Pendapatan ${categoryUpper}`
        };

        newErpJournals = [newErpJournal, ...newErpJournals];
        newErpJournalEntries = [debitEntry, creditEntry, ...newErpJournalEntries];

        // WhatsApp Notification
        if (created.donorPhone) {
          const waMessage = `*ALHAMDULILLAH*\nTerima kasih Akhi/Ukhti *${created.donorName}* atas donasi *${created.category.toUpperCase()}* sebesar *${formatRupiahFull(created.amount)}* untuk program *${created.programTitle}*.\n\nSemoga Allah SWT membalas kebaikan Anda dengan pahala yang berlipat ganda dan menjadikan harta yang tersisa penuh berkah. Aamiin.\n\n_Pesan otomatis dari DKM Masjid Tazkia._`;
          sendWhatsAppMessage(created.donorPhone, waMessage);
        }
      }

      return {
        ...prev,
        programs: updatedPrograms,
        donations: [created, ...prev.donations],
        financials: newFinancials,
        erpJournals: newErpJournals,
        erpJournalEntries: newErpJournalEntries,
        jamaahProfiles: newJamaahProfiles,
        unreadDonationsCount: prev.unreadDonationsCount + 1
      };
    });

    return created;
  };

  const clearUnreadDonations = () => {
    setState(prev => ({ ...prev, unreadDonationsCount: 0 }));
  };

  const updateDonationStatus = (id: string, status: 'berhasil' | 'menunggu_pembayaran' | 'menunggu_verifikasi' | 'ditolak') => {
    setState(prev => {
      const donation = prev.donations.find(d => d.id === id);
      if (!donation || donation.status === status) return prev; // No change

      let updatedPrograms = prev.programs;
      let newFinancials = prev.financials;

      let newErpJournals = prev.erpJournals || [];
      let newErpJournalEntries = prev.erpJournalEntries || [];
      let newJamaahProfiles = prev.jamaahProfiles || [];

      // If it is becoming 'berhasil' from a pending state
      if (status === 'berhasil' && donation.status !== 'berhasil') {
        const existingJamaahIdx = newJamaahProfiles.findIndex(j => 
          (donation.donorEmail && j.email && j.email.toLowerCase() === donation.donorEmail.toLowerCase()) ||
          (donation.donorPhone && j.phone === donation.donorPhone)
        );

        if (existingJamaahIdx >= 0) {
          newJamaahProfiles[existingJamaahIdx] = {
            ...newJamaahProfiles[existingJamaahIdx],
            totalDonation: (newJamaahProfiles[existingJamaahIdx].totalDonation || 0) + donation.amount
          };
        } else {
          // Create new profile if it didn't exist
          const newProfile: JamaahProfile = {
            id: `JM-${Math.floor(1000 + Math.random() * 9000)}`,
            name: donation.donorName,
            email: donation.donorEmail || `jamaah${Math.floor(1000+Math.random()*9000)}@tazkia.id`,
            phone: donation.donorPhone || '',
            totalDonation: donation.amount,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            role: 'jamaah'
          };
          newJamaahProfiles = [...newJamaahProfiles, newProfile];
        }
        updatedPrograms = prev.programs.map(p => {
          if (p.id === donation.programId) {
            return {
              ...p,
              collectedAmount: p.collectedAmount + donation.amount,
              donorsCount: p.donorsCount + 1
            };
          }
          return p;
        });

        const newFinancial: FinancialTransaction = {
          id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
          type: 'masuk',
          title: `Donasi ${donation.category.toUpperCase()} - ${donation.programTitle}`,
          category: donation.category.toUpperCase(),
          amount: donation.amount,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan donasi dari ${donation.donorName} via ${donation.paymentMethod} (Ref: ${donation.transactionRef}) - Diverifikasi`,
          proofUrl: donation.proofUrl
        };
        newFinancials = [newFinancial, ...prev.financials];

        // Accounting Integration: Create ERP Journal for ZISWAF
        let debitAccountId = 'coa-1102'; // Default Kas Bank Operasional
        let creditAccountId = 'coa-4100'; // Default Penerimaan ZISWAF

        const categoryUpper = donation.category.toUpperCase();
        if (categoryUpper.includes('ZAKAT')) {
          debitAccountId = 'coa-1103'; // Kas Bank Zakat
          creditAccountId = 'coa-4102'; // Penerimaan Zakat Maal
        } else if (categoryUpper.includes('INFAQ') || categoryUpper.includes('SEDEKAH') || categoryUpper.includes('SHADAQAH')) {
          debitAccountId = 'coa-1104'; // Kas Bank Infaq/Sedekah
          creditAccountId = 'coa-4104'; // Penerimaan Infaq Transfer
        } else if (categoryUpper.includes('WAKAF')) {
          debitAccountId = 'coa-1105'; // Kas Bank Wakaf
          creditAccountId = 'coa-4105'; // Penerimaan Wakaf Tunai
        }

        const journalId = `JRN-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 100)}`;
        const newErpJournal: ERPGeneralJournal = {
          id: journalId,
          journalNo: `JV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan ${categoryUpper} - ${donation.programTitle} (${donation.donorName})`,
          reference: donation.transactionRef || donation.id,
          status: 'Posted',
          createdBy: 'Sistem ZISWAF',
          createdAt: new Date().toISOString()
        };

        const debitEntry: ERPJournalEntry = {
          id: `JE-D-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: debitAccountId,
          debit: donation.amount,
          credit: 0,
          description: `Penerimaan ke Kas/Bank`
        };

        const creditEntry: ERPJournalEntry = {
          id: `JE-C-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: creditAccountId,
          debit: 0,
          credit: donation.amount,
          description: `Pendapatan ${categoryUpper}`
        };

        newErpJournals = [newErpJournal, ...newErpJournals];
        newErpJournalEntries = [debitEntry, creditEntry, ...newErpJournalEntries];

        // WhatsApp Notification
        if (donation.donorPhone) {
          const waMessage = `*ALHAMDULILLAH*\nTerima kasih Akhi/Ukhti *${donation.donorName}* atas donasi *${donation.category.toUpperCase()}* sebesar *${formatRupiahFull(donation.amount)}* untuk program *${donation.programTitle}*.\n\nSemoga Allah SWT membalas kebaikan Anda dengan pahala yang berlipat ganda dan menjadikan harta yang tersisa penuh berkah. Aamiin.\n\n_Pesan otomatis dari DKM Masjid Tazkia._`;
          sendWhatsAppMessage(donation.donorPhone, waMessage);
        }
      }

      return {
        ...prev,
        programs: updatedPrograms,
        donations: prev.donations.map(d => d.id === id ? { ...d, status } : d),
        financials: newFinancials,
        erpJournals: newErpJournals,
        erpJournalEntries: newErpJournalEntries,
        jamaahProfiles: newJamaahProfiles
      };
    });
  };

  const addFinancialTransaction = (trx: Omit<FinancialTransaction, 'id'>) => {
    const newTrx: FinancialTransaction = {
      ...trx,
      id: `FIN-${Math.floor(200 + Math.random() * 800)}`
    };
    setState(prev => ({
      ...prev,
      financials: [newTrx, ...prev.financials]
    }));
  };

  
  const addKeropakTransaction = (keropak: Omit<KeropakTransaction, 'id' | 'createdAt'>) => {
    const newKeropak: KeropakTransaction = {
      ...keropak,
      id: 'keropak-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, keropakTransactions: [...(prev.keropakTransactions || []), newKeropak] }));
  };

  const deleteKeropakTransaction = (id: string) => {
    setState(prev => ({ ...prev, keropakTransactions: (prev.keropakTransactions || []).filter(k => k.id !== id) }));
  };

  const addJamaahTransaction = (newTrx: Omit<JamaahTransaction, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      jamaahTransactions: [
        {
          ...newTrx,
          id: `JT-${Math.floor(Date.now() / 1000)}`,
          createdAt: new Date().toISOString()
        },
        ...(prev.jamaahTransactions || [])
      ]
    }));
  };

  const deleteJamaahTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      jamaahTransactions: (prev.jamaahTransactions || []).filter(t => t.id !== id)
    }));
  };

  const addKamarBooking = (booking: Omit<KamarBooking, 'id' | 'createdAt'>) => {
    const newBooking: KamarBooking = {
      ...booking,
      id: `KMB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, kamarBookings: [newBooking, ...prev.kamarBookings] }));
  };

  const updateKamarBookingStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setState(prev => {
      const booking = prev.kamarBookings.find(b => b.id === id);
      if (!booking || booking.status === status) return prev; // No change

      const newKamarBookings = prev.kamarBookings.map(b => 
        b.id === id ? { ...b, status } : b
      );

      if (status === 'approved') {
        const amount = booking.roomType === 'VIP' ? 500000 : booking.roomType === 'Keluarga' ? 350000 : 200000;
        
        const newFinancial: FinancialTransaction = {
          id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
          type: 'masuk',
          title: `Pendapatan Sewa Kamar - ${booking.name}`,
          category: 'SEWA ASET',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan sewa kamar ${booking.roomType} dari ${booking.name}`,
        };
        
        const journalId = `JRN-SEWAKAMAR-${Math.floor(Date.now() / 1000)}`;
        const newErpJournal: ERPGeneralJournal = {
          id: journalId,
          journalNo: `JV-SEWA-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan Sewa Kamar ${booking.roomType} - ${booking.name}`,
          reference: booking.id,
          status: 'Posted',
          createdBy: 'Sistem Sewa',
          createdAt: new Date().toISOString()
        };

        const debitEntry: ERPJournalEntry = {
          id: `JE-D-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: 'coa-1102', // Kas Bank Operasional
          debit: amount,
          credit: 0,
          description: `Penerimaan ke Kas/Bank`
        };

        const creditEntry: ERPJournalEntry = {
          id: `JE-C-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: 'coa-4200', // Pendapatan Sewa & Aset
          debit: 0,
          credit: amount,
          description: `Pengakuan Pendapatan Sewa Kamar`
        };

        return {
          ...prev,
          kamarBookings: newKamarBookings,
          financials: [newFinancial, ...prev.financials],
          erpJournals: [newErpJournal, ...(prev.erpJournals || [])],
          erpJournalEntries: [debitEntry, creditEntry, ...(prev.erpJournalEntries || [])]
        };
      }

      return {
        ...prev,
        kamarBookings: newKamarBookings
      };
    });
  };


  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `INV-${Math.floor(100 + Math.random() * 900)}`
    };
    setState(prev => ({
      ...prev,
      inventories: [...prev.inventories, newItem]
    }));
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setState(prev => ({
      ...prev,
      inventories: prev.inventories.map(inv => inv.id === id ? { ...inv, ...updated } : inv)
    }));
  };

  const deleteInventoryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      inventories: prev.inventories.filter(inv => inv.id !== id)
    }));
  };

  const addAnnouncement = (anc: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...anc,
      id: `ANC-${Math.floor(10 + Math.random() * 90)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setState(prev => ({
      ...prev,
      announcements: [newAnc, ...prev.announcements]
    }));
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    setState(prev => ({
      ...prev,
      announcements: prev.announcements.map(anc => anc.id === id ? { ...anc, ...updated } : anc)
    }));
  };

  const deleteAnnouncement = (id: string) => {
    setState(prev => ({
      ...prev,
      announcements: prev.announcements.filter(anc => anc.id !== id)
    }));
  };

  const updatePetugasJadwal = (updatedPetugas: PetugasJadwal) => {
    setState(prev => ({
      ...prev,
      petugas: prev.petugas.map(p => p.id === updatedPetugas.id ? updatedPetugas : p)
    }));
  };

  const addPetugasJadwal = (newPetugas: Omit<PetugasJadwal, 'id'>) => {
    const created: PetugasJadwal = {
      ...newPetugas,
      id: `JDW-${Math.floor(10 + Math.random() * 90)}`
    };
    setState(prev => ({
      ...prev,
      petugas: [created, ...prev.petugas]
    }));
  };

  const deletePetugasJadwal = (id: string) => {
    setState(prev => ({
      ...prev,
      petugas: prev.petugas.filter(p => p.id !== id)
    }));
  };


  const setPalette = (colorPalette: ColorPalette) => {
    setState(prev => ({ ...prev, colorPalette }));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setState(prev => ({ ...prev, themeMode: mode }));
  };

  const toggleThemeMode = () => {
    setState(prev => ({ ...prev, themeMode: prev.themeMode === 'light' ? 'dark' : 'light' }));
  };

  const login = (email: string, name: string, role: UserRole, phone?: string) => {
    setState(prev => {
      const newAuditLog: AuditLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userEmail: email,
        userName: name,
        role,
        action: 'LOGIN',
        details: 'User logged in successfully'
      };

      let newJamaahProfiles = [...prev.jamaahProfiles];
      if (role === 'jamaah') {
        const existingIdx = newJamaahProfiles.findIndex(p => p.email === email);
        if (existingIdx >= 0) {
          newJamaahProfiles[existingIdx] = {
            ...newJamaahProfiles[existingIdx],
            lastLogin: new Date().toISOString(),
            name,
            phone: phone || newJamaahProfiles[existingIdx].phone
          };
        } else {
          newJamaahProfiles.push({
            id: crypto.randomUUID(),
            email,
            name,
            phone,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            totalDonation: 0
          });
        }
      }

      return {
        ...prev,
        session: {
          isLoggedIn: true,
          email,
          name,
          role,
          phone
        },
        auditLogs: [newAuditLog, ...prev.auditLogs],
        jamaahProfiles: newJamaahProfiles
      };
    });
  };

  const logout = () => {
    setState(prev => {
      const newAuditLog: AuditLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userEmail: prev.session.email,
        userName: prev.session.name,
        role: prev.session.role,
        action: 'LOGOUT',
        details: 'User logged out successfully'
      };

      return {
        ...prev,
        session: {
          isLoggedIn: false,
          email: '',
          name: 'Jamaah Tazkia',
          role: 'jamaah'
        },
        auditLogs: prev.session.isLoggedIn ? [newAuditLog, ...prev.auditLogs] : prev.auditLogs
      };
    });
  };

  const saveSupabaseKeys = (supabaseUrl: string, supabaseAnonKey: string) => {
    setState(prev => ({
      ...prev,
      supabaseUrl,
      supabaseAnonKey
    }));
  };

  const updateAdminSettings = (newSettings: Partial<AppAdminSettings>) => {
    setState(prev => ({
      ...prev,
      adminSettings: {
        ...prev.adminSettings,
        ...newSettings
      }
    }));
  };

  const addJournalEntry = (entry: Omit<ERPJournalEntry, 'id'>) => {
    const id = `JRN-${Math.floor(100 + Math.random() * 900)}`;
    const created: ERPJournalEntry = { ...entry, id };
    setState(prev => ({
      ...prev,
      journalEntries: [created, ...prev.journalEntries]
    }));
  };

  const setErpCoa = (coa: ERPChartOfAccount[]) => {
    setState(prev => ({ ...prev, erpCoa: coa }));
  };

  const addErpCoa = (account: ERPChartOfAccount) => {
    setState(prev => ({ ...prev, erpCoa: [...prev.erpCoa, account] }));
  };

  const updateErpCoa = (id: string, updated: Partial<ERPChartOfAccount>) => {
    setState(prev => ({
      ...prev,
      erpCoa: prev.erpCoa.map(c => c.id === id ? { ...c, ...updated } : c)
    }));
  };

  const deleteErpCoa = (id: string) => {
    setState(prev => ({
      ...prev,
      erpCoa: prev.erpCoa.filter(c => c.id !== id)
    }));
  };

  const setErpJournals = (journals: ERPGeneralJournal[]) => {
    setState(prev => ({ ...prev, erpJournals: journals }));
  };

  const addErpJournal = (journal: ERPGeneralJournal) => {
    setState(prev => ({ ...prev, erpJournals: [...prev.erpJournals, journal] }));
  };

  const deleteErpJournal = (id: string) => {
    setState(prev => ({
      ...prev,
      erpJournals: prev.erpJournals.filter(j => j.id !== id),
      erpJournalEntries: prev.erpJournalEntries.filter(e => e.journalId !== id)
    }));
  };

  const updateErpJournal = (id: string, updatedJournal: ERPGeneralJournal, updatedEntries: ERPJournalEntry[]) => {
    setState(prev => {
      const filteredEntries = prev.erpJournalEntries.filter(e => e.journalId !== id);
      return {
        ...prev,
        erpJournals: prev.erpJournals.map(j => j.id === id ? updatedJournal : j),
        erpJournalEntries: [...filteredEntries, ...updatedEntries]
      };
    });
  };

  const setErpJournalEntries = (entries: ERPJournalEntry[]) => {
    setState(prev => ({ ...prev, erpJournalEntries: entries }));
  };

  const addErpJournalEntry = (entry: ERPJournalEntry) => {
    setState(prev => ({ ...prev, erpJournalEntries: [...prev.erpJournalEntries, entry] }));
  };

  const setErpSignatures = (signatures: ReportSignature[]) => {
    setState(prev => ({ ...prev, erpSignatures: signatures }));
  };

  const updateErpSignature = (id: string, status: 'Pending' | 'Signed' | 'Rejected', notes?: string) => {
    setState(prev => ({
      ...prev,
      erpSignatures: prev.erpSignatures.map(sig => 
        sig.id === id ? { ...sig, status, notes, signatureDate: new Date().toISOString() } : sig
      )
    }));
  };

  const addErpBudget = (budget: ERPBudgetEntry) => {
    setState(prev => ({ ...prev, erpBudgets: [...prev.erpBudgets, budget] }));
  };

  const updateErpBudget = (id: string, updated: Partial<ERPBudgetEntry>) => {
    setState(prev => ({
      ...prev,
      erpBudgets: prev.erpBudgets.map(b => b.id === id ? { ...b, ...updated } : b)
    }));
  };

  const deleteErpBudget = (id: string) => {
    setState(prev => ({
      ...prev,
      erpBudgets: prev.erpBudgets.filter(b => b.id !== id)
    }));
  };

  const addErpDisbursement = (req: ERPDisbursementRequest) => {
    setState(prev => ({
      ...prev,
      erpDisbursements: [...prev.erpDisbursements, req]
    }));
  };

  const updateErpDisbursementRequest = (id: string, updates: Partial<Omit<ERPDisbursementRequest, 'id'>>) => {
    setState(prev => ({
      ...prev,
      erpDisbursements: prev.erpDisbursements.map(d => 
        d.id === id ? { ...d, ...updates } : d
      )
    }));
  };

  const deleteErpDisbursementRequest = (id: string) => {
    setState(prev => ({
      ...prev,
      erpDisbursements: prev.erpDisbursements.filter(d => d.id !== id)
    }));
  };

  const updateErpDisbursementStatus = (
    id: string, 
    status: 'Verified' | 'ApprovedKetua' | 'Approved' | 'Rejected', 
    processedBy: string, 
    note?: string
  ) => {
    setState(prev => {
      let updatedDisbursements = prev.erpDisbursements.map(d => {
        if (d.id !== id) return d;
        if (status === 'Verified') {
          return { ...d, status, verifiedBy: processedBy, verificationDate: new Date().toISOString(), approvalNote: note };
        } else if (status === 'Approved') {
          return { ...d, status, approvedBy: processedBy, approvalDate: new Date().toISOString(), approvalNote: note };
        } else if (status === 'ApprovedKetua') {
          return { ...d, status, approvedBy: processedBy, approvalDate: new Date().toISOString(), approvalNote: note };
        } else {
          return { ...d, status, rejectionReason: note };
        }
      });

      if (status === 'Approved') {
        const d = prev.erpDisbursements.find(d => d.id === id);
        if (d) {
          const newFinancial: FinancialTransaction = {
            id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
            type: 'keluar',
            title: `Pencairan Dana - ${d.purpose}`,
            category: 'OPERASIONAL',
            amount: d.amount,
            date: new Date().toISOString().split('T')[0],
            description: `Pencairan dana yang disetujui untuk ${d.requestedBy}: ${d.purpose}`,
          };
          
          const journalId = `JRN-OUT-${Math.floor(Date.now() / 1000)}`;
          const newErpJournal: ERPGeneralJournal = {
            id: journalId,
            journalNo: `JV-OUT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split('T')[0],
            description: `Pencairan Dana: ${d.purpose}`,
            reference: d.id,
            status: 'Posted',
            createdBy: processedBy,
            createdAt: new Date().toISOString()
          };

          const debitEntry: ERPJournalEntry = {
            id: `JE-D-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            journalId,
            accountId: 'coa-5100', // Beban Operasional / Program
            debit: d.amount,
            credit: 0,
            description: `Pengakuan Beban: ${d.purpose}`
          };

          const creditEntry: ERPJournalEntry = {
            id: `JE-C-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            journalId,
            accountId: 'coa-1102', // Kas Bank Operasional
            debit: 0,
            credit: d.amount,
            description: `Pengeluaran dari Kas/Bank`
          };

          return {
            ...prev,
            erpDisbursements: updatedDisbursements,
            financials: [newFinancial, ...prev.financials],
            erpJournals: [newErpJournal, ...(prev.erpJournals || [])],
            erpJournalEntries: [debitEntry, creditEntry, ...(prev.erpJournalEntries || [])]
          };
        }
      }

      return {
        ...prev,
        erpDisbursements: updatedDisbursements
      };
    });
  };

  const addPettyCashEntry = (entry: Omit<PettyCashEntry, 'id' | 'remainingBalance'>) => {
    const id = `KC-${Math.floor(100 + Math.random() * 900)}`;
    setState(prev => {
      const lastBal = prev.pettyCash.length > 0 ? prev.pettyCash[0].remainingBalance : 5000000;
      const newBal = entry.type === 'Pencairan' ? lastBal + entry.amount : lastBal - entry.amount;
      const created: PettyCashEntry = {
        ...entry,
        id,
        remainingBalance: newBal
      };
      return {
        ...prev,
        pettyCash: [created, ...prev.pettyCash]
      };
    });
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'likesCount' | 'viewsCount'>) => {
    const id = `gal-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: GalleryItem = { ...item, id, likesCount: 0, viewsCount: 1 };
    
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase) {
      await supabase.from('gallery_items').insert({
        id: newItem.id,
        title: newItem.title,
        type: newItem.mediaType,
        url: newItem.mediaUrl,
        thumbnail_url: newItem.thumbnailUrl || null,
        description: newItem.summary || null,
        date: newItem.date,
        category: newItem.category,
        likes_count: newItem.likesCount,
        views_count: newItem.viewsCount
      });
    }

    setState(prev => ({
      ...prev,
      galleryItems: [newItem, ...(prev.galleryItems || [])]
    }));
  };

  const updateGalleryItem = async (id: string, updated: Partial<GalleryItem>) => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase && id.length > 3) {
      const updateData: any = {};
      if (updated.title !== undefined) updateData.title = updated.title;
      if (updated.mediaType !== undefined) updateData.type = updated.mediaType;
      if (updated.mediaUrl !== undefined) updateData.url = updated.mediaUrl;
      if (updated.thumbnailUrl !== undefined) updateData.thumbnail_url = updated.thumbnailUrl;
      if (updated.summary !== undefined) updateData.description = updated.summary;
      if (updated.date !== undefined) updateData.date = updated.date;
      if (updated.category !== undefined) updateData.category = updated.category;
      
      await supabase.from('gallery_items').update(updateData).eq('id', id);
    }

    setState(prev => ({
      ...prev,
      galleryItems: (prev.galleryItems || []).map(g => g.id === id ? { ...g, ...updated } : g)
    }));
  };

  const deleteGalleryItem = async (id: string) => {
    const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
    if (supabase && id.length > 3) {
      await supabase.from('gallery_items').delete().eq('id', id);
    }
    setState(prev => ({
      ...prev,
      galleryItems: (prev.galleryItems || []).filter(g => g.id !== id)
    }));
  };

  const likeGalleryItem = async (id: string) => {
    setState(prev => {
      const newItems = (prev.galleryItems || []).map(g => g.id === id ? { ...g, likesCount: g.likesCount + 1 } : g);
      const target = newItems.find(g => g.id === id);
      const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
      if (supabase && target && id.length > 3) {
        supabase.from('gallery_items').update({ likes_count: target.likesCount }).eq('id', id);
      }
      return { ...prev, galleryItems: newItems };
    });
  };

  const incrementGalleryViews = async (id: string) => {
    setState(prev => {
      const newItems = (prev.galleryItems || []).map(g => g.id === id ? { ...g, viewsCount: g.viewsCount + 1 } : g);
      const target = newItems.find(g => g.id === id);
      const supabase = getSupabaseClient(state.supabaseUrl, state.supabaseAnonKey);
      if (supabase && target && id.length > 3) {
        supabase.from('gallery_items').update({ views_count: target.viewsCount }).eq('id', id);
      }
      return { ...prev, galleryItems: newItems };
    });
  };

  const addQurbanParticipant = (groupId: string, participantData: Omit<QurbanParticipant, 'id' | 'createdAt' | 'transactionRef'>) => {
    const id = `p-${Math.floor(100 + Math.random() * 900)}`;
    const txRef = `QRB-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString().split('T')[0];

    setState(prev => {
      const groups = (prev.qurbanGroups || INITIAL_QURBAN_GROUPS).map(group => {
        if (group.id === groupId) {
          const participant: QurbanParticipant = {
            ...participantData,
            id,
            createdAt,
            transactionRef: txRef
          };
          const updatedParticipants = [participant, ...group.participants];
          const newFilled = group.filledShares + participantData.sharesCount;
          return {
            ...group,
            filledShares: newFilled,
            isCompleted: newFilled >= group.totalShares,
            participants: updatedParticipants
          };
        }
        return group;
      });

      // Also create a financial transaction record for transparency
      const newTrx: FinancialTransaction = {
        id: `FIN-QRB-${Math.floor(100 + Math.random() * 900)}`,
        type: 'masuk',
        title: `Penerimaan Setoran Qurban: ${participantData.mudhahhiName}`,
        category: 'Penerimaan Qurban',
        amount: participantData.totalPaid,
        date: createdAt,
        description: `Setoran Qurban ${participantData.sharesCount} Bagian (${participantData.groupTitle}) - Ref: ${txRef}`
      };

      return {
        ...prev,
        qurbanGroups: groups,
        financials: [newTrx, ...prev.financials]
      };
    });

    return { id, transactionRef: txRef };
  };

  const deleteQurbanParticipant = (groupId: string, participantId: string) => {
    setState(prev => {
      const groups = (prev.qurbanGroups || []).map(group => {
        if (group.id === groupId) {
          const participant = group.participants.find(p => p.id === participantId);
          if (!participant) return group;
          const updatedParticipants = group.participants.filter(p => p.id !== participantId);
          const newFilled = Math.max(0, group.filledShares - participant.sharesCount);
          return {
            ...group,
            filledShares: newFilled,
            isCompleted: newFilled >= group.totalShares,
            participants: updatedParticipants
          };
        }
        return group;
      });
      return { ...prev, qurbanGroups: groups };
    });
  };

  const updateQurbanParticipant = (groupId: string, participantId: string, updatedData: Partial<QurbanParticipant>) => {
    setState(prev => {
      const groups = (prev.qurbanGroups || []).map(group => {
        if (group.id === groupId) {
          let filledSharesDiff = 0;
          const updatedParticipants = group.participants.map(p => {
            if (p.id === participantId) {
              if (updatedData.sharesCount !== undefined) {
                filledSharesDiff = updatedData.sharesCount - p.sharesCount;
              }
              return { ...p, ...updatedData };
            }
            return p;
          });
          const newFilled = Math.min(group.totalShares, Math.max(0, group.filledShares + filledSharesDiff));
          return {
            ...group,
            filledShares: newFilled,
            isCompleted: newFilled >= group.totalShares,
            participants: updatedParticipants
          };
        }
        return group;
      });
      return { ...prev, qurbanGroups: groups };
    });
  };

  const addQurbanGroup = (groupData: Omit<QurbanGroup, 'id' | 'participants' | 'filledShares' | 'isCompleted'>) => {
    const newGroup: QurbanGroup = {
      ...groupData,
      id: `qrb-${Math.floor(100 + Math.random() * 900)}`,
      filledShares: 0,
      isCompleted: false,
      participants: []
    };
    setState(prev => ({
      ...prev,
      qurbanGroups: [newGroup, ...(prev.qurbanGroups || [])]
    }));
  };

  const updateQurbanGroup = (id: string, updated: Partial<QurbanGroup>) => {
    setState(prev => ({
      ...prev,
      qurbanGroups: (prev.qurbanGroups || []).map(g => g.id === id ? { ...g, ...updated } : g)
    }));
  };

  const deleteQurbanGroup = (id: string) => {
    setState(prev => ({
      ...prev,
      qurbanGroups: (prev.qurbanGroups || []).filter(g => g.id !== id)
    }));
  };

  const addJamaahProfile = (profile: Omit<JamaahProfile, 'id' | 'joinDate' | 'lastLogin' | 'totalDonation'>) => {
    setState(prev => {
      const existingProfiles = prev.jamaahProfiles || [];
      const emailExists = profile.email ? existingProfiles.find(p => p.email?.toLowerCase() === profile.email?.toLowerCase()) : undefined;
      const phoneExists = profile.phone ? existingProfiles.find(p => p.phone === profile.phone || p.phone === profile.phone?.replace(/^0/, '+62')) : undefined;
      
      if (emailExists || phoneExists) {
        // Prevent duplicate from being added at the store level
        return prev;
      }

      const newProfile: JamaahProfile = {
        ...profile,
        id: `jam-${Math.floor(100 + Math.random() * 900)}`,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalDonation: 0
      };
      
      return {
        ...prev,
        jamaahProfiles: [...existingProfiles, newProfile]
      };
    });
  };

  const updateJamaahProfile = (id: string, updated: Partial<JamaahProfile>) => {
    setState(prev => {
      const jamaahProfiles = (prev.jamaahProfiles || []).map(j => j.id === id ? { ...j, ...updated } : j);
      
      // Update session if it's the current user
      let newSession = prev.session;
      const targetUser = prev.jamaahProfiles?.find(j => j.id === id);
      if (targetUser && prev.session.isLoggedIn && targetUser.email === prev.session.email) {
        newSession = {
          ...prev.session,
          name: updated.name || prev.session.name,
          phone: updated.phone !== undefined ? updated.phone : prev.session.phone
        };
      }
      
      return {
        ...prev,
        jamaahProfiles,
        session: newSession
      };
    });
  };

  const deleteJamaahProfile = (id: string) => {
    setState(prev => ({
      ...prev,
      jamaahProfiles: (prev.jamaahProfiles || []).filter(j => j.id !== id)
    }));
  };

  const addBoardMember = (member: Omit<BoardMember, 'id'>) => {
    setState(prev => ({
      ...prev,
      boardMembers: [...(prev.boardMembers || []), { ...member, id: `bm-${Date.now()}` }]
    }));
  };

  const updateBoardMember = (id: string, updated: Partial<BoardMember>) => {
    setState(prev => ({
      ...prev,
      boardMembers: (prev.boardMembers || []).map(m => m.id === id ? { ...m, ...updated } : m)
    }));
  };

  const deleteBoardMember = (id: string) => {
    setState(prev => ({
      ...prev,
      boardMembers: (prev.boardMembers || []).filter(m => m.id !== id)
    }));
  };

  const addReportSignatory = (sig: Omit<ReportSignatory, 'id'>) => {
    setState(prev => ({
      ...prev,
      reportSignatories: [...(prev.reportSignatories || []), { ...sig, id: `sig-${Date.now()}` }]
    }));
  };

  const updateReportSignatory = (id: string, updated: Partial<ReportSignatory>) => {
    setState(prev => ({
      ...prev,
      reportSignatories: (prev.reportSignatories || []).map(s => s.id === id ? { ...s, ...updated } : s)
    }));
  };

  const deleteReportSignatory = (id: string) => {
    setState(prev => ({
      ...prev,
      reportSignatories: (prev.reportSignatories || []).filter(s => s.id !== id)
    }));
  };

  const addGedungBooking = (booking: Omit<GedungBooking, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      gedungBookings: [{
        ...booking,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }, ...prev.gedungBookings]
    }));
  };

  const updateGedungBookingStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setState(prev => {
      const booking = prev.gedungBookings.find(b => b.id === id);
      if (!booking || booking.status === status) return prev; // No change

      const newGedungBookings = prev.gedungBookings.map(b => 
        b.id === id ? { ...b, status } : b
      );

      if (status === 'approved') {
        const amount = 5000000; // Asumsi biaya sewa gedung default
        
        const newFinancial: FinancialTransaction = {
          id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
          type: 'masuk',
          title: `Pendapatan Sewa Gedung - ${booking.name}`,
          category: 'SEWA ASET',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan sewa gedung untuk acara ${booking.notes || 'Pernikahan/Acara'} dari ${booking.name}`,
        };
        
        const journalId = `JRN-SEWA-${Math.floor(Date.now() / 1000)}`;
        const newErpJournal: ERPGeneralJournal = {
          id: journalId,
          journalNo: `JV-SEWA-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          description: `Penerimaan Sewa Gedung - ${booking.name}`,
          reference: booking.id,
          status: 'Posted',
          createdBy: 'Sistem Sewa',
          createdAt: new Date().toISOString()
        };

        const debitEntry: ERPJournalEntry = {
          id: `JE-D-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: 'coa-1102', // Kas Bank Operasional
          debit: amount,
          credit: 0,
          description: `Penerimaan ke Kas/Bank`
        };

        const creditEntry: ERPJournalEntry = {
          id: `JE-C-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          journalId,
          accountId: 'coa-4200', // Pendapatan Sewa & Aset (Asumsi atau fallback)
          debit: 0,
          credit: amount,
          description: `Pengakuan Pendapatan Sewa Gedung`
        };

        return {
          ...prev,
          gedungBookings: newGedungBookings,
          financials: [newFinancial, ...prev.financials],
          erpJournals: [newErpJournal, ...(prev.erpJournals || [])],
          erpJournalEntries: [debitEntry, creditEntry, ...(prev.erpJournalEntries || [])]
        };
      }

      return {
        ...prev,
        gedungBookings: newGedungBookings
      };
    });
  };

  const deleteGedungBooking = (id: string) => {
    setState(prev => ({
      ...prev,
      gedungBookings: prev.gedungBookings.filter(b => b.id !== id)
    }));
  };

  
  const addTpaRegistration = (reg: Omit<TpaRegistration, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      tpaRegistrations: [{
        ...reg,
        id: `tpa-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      }, ...(prev.tpaRegistrations || [])]
    }));
  };

  const updateTpaRegistrationStatus = (id: string, status: TpaRegistration['status'], paymentStatus?: TpaRegistration['paymentStatus']) => {
    setState(prev => ({
      ...prev,
      tpaRegistrations: (prev.tpaRegistrations || []).map(t => {
        if (t.id === id) {
          const updated = { ...t, status };
          if (paymentStatus) updated.paymentStatus = paymentStatus;
          return updated;
        }
        return t;
      })
    }));
  };

  const addMuallafRegistration = (reg: Omit<MuallafRegistration, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      muallafRegistrations: [{
        ...reg,
        id: `mual-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      }, ...(prev.muallafRegistrations || [])]
    }));
  };

  const updateMuallafRegistrationStatus = (id: string, status: MuallafRegistration['status']) => {
    setState(prev => ({
      ...prev,
      muallafRegistrations: (prev.muallafRegistrations || []).map(m => m.id === id ? { ...m, status } : m)
    }));
  };

  const addAgenda = (agenda: Omit<MasjidAgenda, 'id'>) => {
    const newAgenda: MasjidAgenda = {
      ...agenda,
      id: `agenda-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setState(prev => ({
      ...prev,
      agendas: [newAgenda, ...(prev.agendas || [])]
    }));
  };

  const updateAgenda = (id: string, updated: Partial<MasjidAgenda>) => {
    setState(prev => ({
      ...prev,
      agendas: (prev.agendas || []).map(a => a.id === id ? { ...a, ...updated } : a)
    }));
  };

  const deleteAgenda = (id: string) => {
    setState(prev => ({
      ...prev,
      agendas: (prev.agendas || []).filter(a => a.id !== id)
    }));
  };

  
  const addAgendaRegistration = (registration: Omit<AgendaRegistration, 'id' | 'createdAt'>) => {
    const newRegistration: AgendaRegistration = {
      ...registration,
      id: `reg-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      agendaRegistrations: [newRegistration, ...(prev.agendaRegistrations || [])]
    }));
  };

  const deleteAgendaRegistration = (id: string) => {
    setState(prev => ({
      ...prev,
      agendaRegistrations: (prev.agendaRegistrations || []).filter(r => r.id !== id)
    }));
  };

  const resetToDefault = () => {
    setState(defaultState);
  };

  const setAppRoles = (roles: AppRole[]) => {
    setState(prev => ({ ...prev, appRoles: roles }));
  };

  // Jamaah Feedback & Notes
  const addFeedback = (feedback: Omit<JamaahFeedback, 'id' | 'createdAt' | 'status'>) => {
    setState(prev => ({
      ...prev,
      feedbacks: [
        {
          ...feedback,
          id: `FDB-${Math.floor(Date.now() / 1000)}`,
          status: 'unread',
          createdAt: new Date().toISOString()
        },
        ...(prev.feedbacks || [])
      ]
    }));
  };

  const updateFeedback = (id: string, updates: Partial<JamaahFeedback>) => {
    setState(prev => ({
      ...prev,
      feedbacks: (prev.feedbacks || []).map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const addCalendarNote = (note: Omit<JamaahCalendarNote, 'id'>) => {
    setState(prev => ({
      ...prev,
      calendarNotes: [
        {
          ...note,
          id: `NOT-${Math.floor(Date.now() / 1000)}`
        },
        ...(prev.calendarNotes || [])
      ]
    }));
  };

  const removeCalendarNote = (id: string) => {
    setState(prev => ({
      ...prev,
      calendarNotes: (prev.calendarNotes || []).filter(n => n.id !== id)
    }));
  };

  const hitungPenyusutanAset = () => {
    setState(prev => {
      // Very basic straight-line depreciation logic for demo
      // Find asset depreciation accounts
      const bebanPenyusutanCoa = prev.erpCoa.find(c => c.accountName.toLowerCase().includes('beban penyusutan'));
      const akumulasiCoa = prev.erpCoa.find(c => c.accountName.toLowerCase().includes('akumulasi penyusutan'));
      
      if (!bebanPenyusutanCoa || !akumulasiCoa) return prev; // Cannot depreciate without COA

      let totalDepreciation = 0;
      const newInventories = (prev.inventories || []).map(item => {
        if (item.category === 'Aset Tetap' && item.value > 0) {
          // Assume 5 years useful life (60 months) -> 1/60 per month
          const monthlyDep = Math.round(item.value / 60);
          totalDepreciation += monthlyDep;
          return { ...item, value: Math.max(0, item.value - monthlyDep) };
        }
        return item;
      });

      if (totalDepreciation === 0) return prev; // Nothing to depreciate

      const journalId = `JRN-DEP-${Math.floor(Date.now() / 1000)}`;
      const newErpJournal: ERPGeneralJournal = {
        id: journalId,
        journalNo: `JV-DEP-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
        date: new Date().toISOString().split('T')[0],
        description: `Penyusutan Aset Tetap Bulan ${new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`,
        reference: 'SYS-DEP',
        status: 'Posted',
        createdBy: 'System',
        createdAt: new Date().toISOString()
      };

      const debitEntry: ERPJournalEntry = {
        id: `JE-D-${Date.now()}`,
        journalId,
        accountId: bebanPenyusutanCoa.id,
        debit: totalDepreciation,
        credit: 0,
        description: `Beban Penyusutan Aset`
      };

      const creditEntry: ERPJournalEntry = {
        id: `JE-C-${Date.now()}`,
        journalId,
        accountId: akumulasiCoa.id,
        debit: 0,
        credit: totalDepreciation,
        description: `Akumulasi Penyusutan Aset`
      };

      return {
        ...prev,
        inventories: newInventories,
        erpJournals: [newErpJournal, ...(prev.erpJournals || [])],
        erpJournalEntries: [debitEntry, creditEntry, ...(prev.erpJournalEntries || [])]
      };
    });
  };

  const tutupBuku = (tipe: 'bulanan' | 'tahunan') => {
    setState(prev => {
      const retainedEarningsCoa = prev.erpCoa.find(c => c.accountName.toLowerCase().includes('laba ditahan') || c.accountName.toLowerCase().includes('saldo dana'));
      if (!retainedEarningsCoa) return prev;

      // Calculate total revenue and expense
      let totalRevenue = 0;
      let totalExpense = 0;
      
      prev.erpJournalEntries.forEach(entry => {
        const coa = prev.erpCoa.find(c => c.id === entry.accountId);
        if (coa && coa.category === 'Pendapatan') {
          totalRevenue += (entry.credit - entry.debit);
        } else if (coa && coa.category === 'Beban') {
          totalExpense += (entry.debit - entry.credit);
        }
      });

      const netIncome = totalRevenue - totalExpense;

      const journalId = `JRN-CLOSE-${Math.floor(Date.now() / 1000)}`;
      const newErpJournal: ERPGeneralJournal = {
        id: journalId,
        journalNo: `JV-CLS-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
        date: new Date().toISOString().split('T')[0],
        description: `Jurnal Penutup ${tipe === 'tahunan' ? 'Tahun' : 'Bulan'} ${new Date().getFullYear()}`,
        reference: 'SYS-CLOSE',
        status: 'Posted',
        createdBy: 'System',
        createdAt: new Date().toISOString()
      };

      const entryRetainedEarnings: ERPJournalEntry = {
        id: `JE-CLOSE-${Date.now()}`,
        journalId,
        accountId: retainedEarningsCoa.id,
        debit: netIncome < 0 ? Math.abs(netIncome) : 0,
        credit: netIncome >= 0 ? netIncome : 0,
        description: `Pemindahan Saldo (Surplus/Defisit)`
      };

      return {
        ...prev,
        erpJournals: [newErpJournal, ...(prev.erpJournals || [])],
        erpJournalEntries: [entryRetainedEarnings, ...(prev.erpJournalEntries || [])]
      };
    });
  };

  const syncLegacyDonationsToErp = () => {
    setState(prev => {
      let newFinancials = [...prev.financials];
      let newErpJournals = [...(prev.erpJournals || [])];
      let newErpJournalEntries = [...(prev.erpJournalEntries || [])];
      let syncedCount = 0;

      prev.donations.forEach(donation => {
        if (donation.status === 'berhasil') {
          const hasFinancial = newFinancials.some(f => 
            f.description.includes(donation.transactionRef || donation.id) || 
            (f.title.includes(donation.programTitle) && f.amount === donation.amount && f.date === donation.createdAt.split('T')[0])
          );
          
          const hasErp = newErpJournals.some(j => 
            j.reference === donation.transactionRef || j.reference === donation.id ||
            (j.description.includes(donation.donorName) && j.description.includes(donation.programTitle))
          );

          if (!hasFinancial || !hasErp) {
            syncedCount++;
            const categoryUpper = donation.category.toUpperCase();

            if (!hasFinancial) {
              const newFinancial: FinancialTransaction = {
                id: `FIN-${Math.floor(200 + Math.random() * 800)}`,
                type: 'masuk',
                title: `Donasi ${categoryUpper} - ${donation.programTitle}`,
                category: categoryUpper,
                amount: donation.amount,
                date: donation.createdAt.split('T')[0],
                description: `Penerimaan donasi dari ${donation.donorName} via ${donation.paymentMethod} (Ref: ${donation.transactionRef}) - Tersinkronisasi`
              };
              newFinancials.push(newFinancial);
            }

            if (!hasErp) {
              let debitAccountId = 'coa-1102'; 
              let creditAccountId = 'coa-4100'; 
              
              if (categoryUpper.includes('ZAKAT')) {
                debitAccountId = 'coa-1103'; 
                creditAccountId = 'coa-4102'; 
              } else if (categoryUpper.includes('INFAQ') || categoryUpper.includes('SEDEKAH') || categoryUpper.includes('SHADAQAH')) {
                debitAccountId = 'coa-1104'; 
                creditAccountId = 'coa-4104'; 
              } else if (categoryUpper.includes('WAKAF')) {
                debitAccountId = 'coa-1105'; 
                creditAccountId = 'coa-4105'; 
              }

              const journalId = `JRN-SYNC-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 1000)}`;
              const newErpJournal: ERPGeneralJournal = {
                id: journalId,
                journalNo: `JV-SYNC-${donation.createdAt.split('T')[0].replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
                date: donation.createdAt.split('T')[0],
                description: `Penerimaan ${categoryUpper} - ${donation.programTitle} (${donation.donorName}) [SYNC]`,
                reference: donation.transactionRef || donation.id,
                status: 'Posted',
                createdBy: 'System Maintenance',
                createdAt: new Date().toISOString()
              };

              const debitEntry: ERPJournalEntry = {
                id: `JE-D-SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                journalId,
                accountId: debitAccountId,
                debit: donation.amount,
                credit: 0,
                description: `Penerimaan ke Kas/Bank`
              };

              const creditEntry: ERPJournalEntry = {
                id: `JE-C-SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                journalId,
                accountId: creditAccountId,
                debit: 0,
                credit: donation.amount,
                description: `Pendapatan ${categoryUpper}`
              };

              newErpJournals.push(newErpJournal);
              newErpJournalEntries.push(debitEntry, creditEntry);
            }
          }
        }
      });

      if (syncedCount > 0) {
        alert(`Berhasil mensinkronkan ${syncedCount} transaksi donasi lama ke Buku Besar.`);
        return {
          ...prev,
          financials: newFinancials,
          erpJournals: newErpJournals,
          erpJournalEntries: newErpJournalEntries
        };
      } else {
        alert("Tidak ada transaksi donasi lama yang perlu disinkronisasi. Semua sudah masuk Buku Besar.");
        return prev;
      }
    });
  };

  return {
    syncLegacyDonationsToErp,
    fetchOnlinePrayerTimes: async () => {
      try {
        const today = new Date();
        const d = String(today.getDate()).padStart(2, '0');
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const y = today.getFullYear();
        const dateStr = `${d}-${m}-${y}`;
        const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=-6.5815&longitude=106.8710&method=20`);
        const json = await response.json();
        if (json.code === 200 && json.data) {
          setState(prev => ({ ...prev, onlinePrayerData: json.data }));
        }
      } catch (err) {
        console.error('Failed to fetch online prayer times', err);
      }
    },
    state,
    tutupBuku,
    hitungPenyusutanAset,
    setAppRoles,
    addDonation,
    clearUnreadDonations,
    updateDonationStatus,
    addFinancialTransaction,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addKamarBooking,
    updateKamarBookingStatus,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    updatePetugasJadwal,
    addPetugasJadwal,
    deletePetugasJadwal,
    fetchPrograms,
    addKeropakTransaction,
    deleteKeropakTransaction,
    addJamaahTransaction,
    deleteJamaahTransaction,
    addProgram,
    updateProgram,
    deleteProgram,
    setPalette,
    setThemeMode,
    toggleThemeMode,
    login,
    logout,
    saveSupabaseKeys,
    updateAdminSettings,
    addJournalEntry,
    setErpCoa,
    addErpCoa,
    updateErpCoa,
    deleteErpCoa,
    setErpJournals,
    addErpJournal,
    deleteErpJournal,
    updateErpJournal,
    setErpJournalEntries,
    addErpJournalEntry,
    addErpBudget,
    updateErpBudget,
    deleteErpBudget,
    addErpDisbursement,
    updateErpDisbursementRequest,
    deleteErpDisbursementRequest,
    updateErpDisbursementStatus,
    setErpSignatures,
    updateErpSignature,
    addPettyCashEntry,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    likeGalleryItem,
    incrementGalleryViews,
    addQurbanParticipant,
    deleteQurbanParticipant,
    updateQurbanParticipant,
    addQurbanGroup,
    updateQurbanGroup,
    deleteQurbanGroup,
    addJamaahProfile,
    updateJamaahProfile,
    deleteJamaahProfile,
    addBoardMember,
    updateBoardMember,
    deleteBoardMember,
    addReportSignatory,
    updateReportSignatory,
    deleteReportSignatory,
    addGedungBooking,
    updateGedungBookingStatus,
    deleteGedungBooking,
    addTpaRegistration,
    updateTpaRegistrationStatus,
    addMuallafRegistration,
    updateMuallafRegistrationStatus,
    addAgenda,
    addAgendaRegistration,
    deleteAgendaRegistration,
    updateAgenda,
    deleteAgenda,
    resetToDefault,
    addFeedback,
    updateFeedback,
    addCalendarNote,
    removeCalendarNote
  };
}

export function generateSupabaseSQLSchema(): string {
  return `-- ==========================================
-- SUPABASE POSTGRESQL SCHEMA FOR Masjid Tazkia
-- Paste ini ke Supabase SQL Editor untuk membuat tabel
-- ==========================================

-- 1. TABEL PROGRAM DONASI & ZISWAF
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('zakat', 'infaq', 'shadaqah', 'wakaf')),
  target_amount NUMERIC NOT NULL DEFAULT 0,
  collected_amount NUMERIC NOT NULL DEFAULT 0,
  donors_count INT NOT NULL DEFAULT 0,
  image_url TEXT,
  description TEXT,
  is_urgent BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL RIWAYAT DONASI
CREATE TABLE IF NOT EXISTS public.donations (
  id TEXT PRIMARY KEY,
  program_id TEXT REFERENCES public.programs(id) ON DELETE SET NULL,
  program_title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  unique_code INT NOT NULL,
  total_amount NUMERIC NOT NULL,
  donor_name TEXT NOT NULL,
  donor_phone TEXT,
  payment_method TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  recurring_period TEXT DEFAULT 'none',
  status TEXT NOT NULL DEFAULT 'berhasil',
  transaction_ref TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL TRANSPARANSI KEUANGAN
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('masuk', 'keluar')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL JADWAL PETUGAS SALAT & KHATIB
CREATE TABLE IF NOT EXISTS public.petugas_jadwal (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  day_name TEXT NOT NULL,
  subuh TEXT,
  dzuhur TEXT,
  ashar TEXT,
  maghrib TEXT,
  isya TEXT,
  khatib_jumat TEXT,
  imam_jumat TEXT,
  topik_jumat TEXT
);

-- 5. TABEL INVENTARIS MASJID
CREATE TABLE IF NOT EXISTS public.inventories (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'Unit',
  condition TEXT CHECK (condition IN ('Baik', 'Perlu Perbaikan', 'Rusak')),
  location TEXT,
  last_maintenance DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL PENGUMUMAN & SIARAN
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  author TEXT DEFAULT 'Pengurus DKM Tazkia',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6B. TABEL AGENDA REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.agenda_registrations (
  id TEXT PRIMARY KEY,
  agenda_id TEXT NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.agenda_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Agenda Registrations" ON public.agenda_registrations FOR SELECT USING (true);
CREATE POLICY "Public Insert Agenda Registrations" ON public.agenda_registrations FOR INSERT WITH CHECK (true);

-- 7. TABEL JURNAL UMUM & KAS KECIL
CREATE TABLE IF NOT EXISTS public.petty_cash (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  ref_no TEXT NOT NULL,
  purpose TEXT NOT NULL,
  pic_name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Pencairan', 'Pengeluaran')),
  amount NUMERIC NOT NULL,
  remaining_balance NUMERIC NOT NULL,
  receipt_proof TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL PENGATURAN AKUN & FOTO PROFIL MASJID
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id INT PRIMARY KEY DEFAULT 1,
  masjid_logo_url TEXT,
  masjid_hero_photo_url TEXT,
  qris_code_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITASI ROW LEVEL SECURITY (RLS)
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petugas_jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN AKSES PUBLIC READ (Membaca publik)
CREATE POLICY "Public Read Programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public Read Donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Public Read Financials" ON public.financial_transactions FOR SELECT USING (true);
CREATE POLICY "Public Read Petugas" ON public.petugas_jadwal FOR SELECT USING (true);
CREATE POLICY "Public Read Inventories" ON public.inventories FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);

-- KEBIJAKAN AKSES DONASI PUBLIC INSERT
CREATE POLICY "Public Insert Donations" ON public.donations FOR INSERT WITH CHECK (true);
`;
}

