import React, { useState } from 'react';
import { useMasjidStore } from './lib/store';
import { Program, ProgramCategory, hasDkmPortalAccess } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgramCardsSection } from './components/ProgramCardsSection';
import { DonationModalFlow } from './components/DonationModalFlow';
import { ZiswafCalculatorModal } from './components/ZiswafCalculatorModal';
import { DigitalIbadahModal } from './components/DigitalIbadahModal';
import { TransparencySection } from './components/TransparencySection';
import { PengurusDkmDashboard } from './components/PengurusDkmDashboard';
import { TvDisplayMode } from './components/TvDisplayMode';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { LoginModal } from './components/LoginModal';
import { CatalogPdfModal } from './components/CatalogPdfModal';
import { GallerySection } from './components/GallerySection';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { EdukasiZiswafSection } from './components/EdukasiZiswafSection';
import { KalenderKegiatanSection } from './components/KalenderKegiatanSection';
import { PatunganQurbanSection } from './components/PatunganQurbanSection';
import { ProfilTazkiaSection } from './components/ProfilTazkiaSection';
import { MuallafCenterSection } from './components/MuallafCenterSection';
import { TpaProgramSection } from './components/TpaProgramSection';
import { ZiswafLandingSection } from './components/ZiswafLandingSection';
import { KontakKamiSection } from './components/KontakKamiSection';
import { FloatingMobileNav } from './components/FloatingMobileNav';
import { SocialMediaSection } from './components/SocialMediaSection';
import { seedTestData } from './utils/seedTestData';
import { LayananKamiSection } from './components/LayananKamiSection';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { FridayAgendaSection } from './components/FridayAgendaSection';
import { BookingGedung } from './components/BookingGedung';
import { BookingKamar } from './components/BookingKamar';
import { PortalJamaahDashboard } from './components/PortalJamaahDashboard';
import { Footer } from './components/Footer';
import { RoleSwitcherWidget } from './components/admin/RoleSwitcherWidget';
import { Bot } from 'lucide-react';

export default function App() {
  const {
    state,
    addDonation,
    updateDonationStatus,
    addFinancialTransaction,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updatePetugasJadwal,
    addPetugasJadwal,
    deletePetugasJadwal,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addProgram,
    deleteProgram,
    addJournalEntry,
    addPettyCashEntry,
    updateAdminSettings,
    addGalleryItem,
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
    setPalette,
    setThemeMode,
    toggleThemeMode,
    login,
    logout,
    saveSupabaseKeys,
    addFeedback,
    updateFeedback,
    addCalendarNote,
    removeCalendarNote
  } = useMasjidStore();

  // Tab State
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return window.location.hash.replace('#', '').split('?')[0] || 'beranda';
  });

  React.useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(window.location.hash.replace('#', '').split('?')[0] || 'beranda');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab: string) => {
    window.location.hash = tab.includes('?') ? tab : tab.split('?')[0];
  };

  // Modal Overlays State
  const [donationModalOpen, setDonationModalOpen] = useState<boolean>(false);
  const [selectedDonationCategory, setSelectedDonationCategory] = useState<string | undefined>();
  const [selectedDonationProgram, setSelectedDonationProgram] = useState<Program | undefined>();
  const [selectedDetailProgram, setSelectedDetailProgram] = useState<Program | null>(null);

  const [calculatorModalOpen, setCalculatorModalOpen] = useState<boolean>(false);

  const [digitalIbadahOpen, setDigitalIbadahOpen] = useState<boolean>(false);
  const [digitalIbadahTab, setDigitalIbadahTab] = useState<'quran' | 'salat' | 'kiblat' | 'doa'>('quran');

  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [tvModeOpen, setTvModeOpen] = useState<boolean>(false);
  const [catalogPdfOpen, setCatalogPdfOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Computed KPI figures matching PDF exact numbers or store
  const totalCollected = state.programs.reduce((sum, p) => sum + p.collectedAmount, 0);
  const activeDonors = state.programs.reduce((sum, p) => sum + p.donorsCount, 0);
  const totalDisbursed = 9700000000; // Rp 9.7M from PDF
  const efficiencyRate = 91; // 91% from PDF

  const handleOpenDonationModal = (category?: string) => {
    setSelectedDonationProgram(undefined);
    setSelectedDonationCategory(category);
    setDonationModalOpen(true);
  };

  const handleOpenDonationForProgram = (program: Program) => {
    setSelectedDonationProgram(program);
    setSelectedDonationCategory(program.category);
    setDonationModalOpen(true);
  };

  const handleOpenDigitalIbadah = (tab: 'quran' | 'salat' | 'kiblat' | 'doa' = 'quran') => {
    setDigitalIbadahTab(tab);
    setDigitalIbadahOpen(true);
  };

  const handleSelectAmountFromCalculator = (amount: number, category: string) => {
    setSelectedDonationCategory(category);
    setSelectedDonationProgram(state.programs.find(p => p.category === category));
    setDonationModalOpen(true);
  };

  // Theme Mode & Palette styling
  const isDark = state.themeMode === 'dark';
  const themeContainerBg = isDark
    ? 'bg-[#0a1128] text-blue-100 dark'
    : 'bg-[#F9F8F4] text-blue-900';

  return (
    <div className={`min-h-screen ${themeContainerBg} font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-16 xl:pb-0`}>
      <RoleSwitcherWidget />
      
      {/* 1. Header Navigation */}
      <div className="print:hidden">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openDonationModal={handleOpenDonationModal}
          openCalculator={() => setCalculatorModalOpen(true)}
          openDigitalIbadah={handleOpenDigitalIbadah}
          openSupabaseModal={() => setSupabaseModalOpen(true)}
          openTvMode={() => setTvModeOpen(true)}
          openCatalogPdf={() => setCatalogPdfOpen(true)}
          session={state.session}
          openLoginModal={() => setLoginModalOpen(true)}
          logout={logout}
          palette={state.colorPalette}
          setPalette={setPalette}
          themeMode={state.themeMode}
          toggleThemeMode={toggleThemeMode}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>

      {/* 2. Main Views according to activeTab */}
      <main>
        {activeTab === 'beranda' && (
          <>
            <HeroSection
              openDigitalIbadah={handleOpenDigitalIbadah}
              openDonationModal={handleOpenDonationModal}
              isDark={isDark}
            />
            
            {state.adminSettings.showPrayerTimesOnHome !== false && <PrayerTimesCard />}
            
            {state.adminSettings.showFridayInfoOnHome !== false && (
              <FridayAgendaSection 
                adminSettings={state.adminSettings}
                isDark={isDark}
              />
            )}
            
            {state.adminSettings.showLayananKamiOnHome !== false && <LayananKamiSection />}

            {state.adminSettings.showProgramCardsOnHome !== false && (
              <ProgramCardsSection
                programs={state.programs}
                adminSettings={state.adminSettings}
                openDonationForProgram={handleOpenDonationForProgram}
                onSelectProgramDetail={(prog) => setSelectedDetailProgram(prog)}
                totalCollected={totalCollected}
                activeDonors={activeDonors}
                totalDisbursed={totalDisbursed}
                efficiencyRate={efficiencyRate}
                openDonationModal={handleOpenDonationModal}
                openCalculator={() => setCalculatorModalOpen(true)}
                openCatalogPdf={() => setCatalogPdfOpen(true)}
              />
            )}
          </>
        )}

        {activeTab === 'program' && (
          <ZiswafLandingSection 
            programs={state.programs}
            adminSettings={state.adminSettings}
            openDonationForProgram={handleOpenDonationForProgram}
            onSelectProgramDetail={(prog) => setSelectedDetailProgram(prog)}
            totalCollected={totalCollected}
            activeDonors={activeDonors}
            totalDisbursed={totalDisbursed}
            efficiencyRate={efficiencyRate}
            openDonationModal={handleOpenDonationModal}
            openCalculator={() => setCalculatorModalOpen(true)}
            openCatalogPdf={() => setCatalogPdfOpen(true)}
            isDark={isDark}
          />
        )}

        {activeTab === 'transparansi' && (
          <TransparencySection 
            financials={state.financials} 
            petugasList={state.petugas} 
            erpJournalEntries={state.erpJournalEntries}
          />
        )}

        {activeTab === 'jadwal_khatib' && (
          <KalenderKegiatanSection
            isDark={isDark}
          />
        )}

        {activeTab === 'qurban' && (
          <PatunganQurbanSection
            qurbanGroups={state.qurbanGroups || []}
            onAddParticipant={addQurbanParticipant}
            onUpdateGroupImage={updateQurbanGroup}
            isDark={isDark}
            session={state.session}
          />
        )}

        {activeTab === 'booking' && (
          <BookingGedung isDark={isDark} />
        )}

        {activeTab === 'booking_kamar' && (
          <BookingKamar isDark={isDark} />
        )}

        {activeTab === 'sejarah' && (
          <ProfilTazkiaSection />
        )}

        {activeTab === 'muallaf' && (
          <MuallafCenterSection />
        )}

        {activeTab === 'tpa' && (
          <TpaProgramSection />
        )}

        {activeTab === 'edukasi' && (
          <EdukasiZiswafSection
            isDark={isDark}
            onOpenCalculator={() => setCalculatorModalOpen(true)}
            onSelectCategoryDonate={(cat) => handleOpenDonationModal(cat)}
          />
        )}

        {activeTab === 'galeri' && (
          <GallerySection
            galleryItems={state.galleryItems}
            onLikeItem={likeGalleryItem}
            onIncrementView={incrementGalleryViews}
            isDark={isDark}
          />
        )}

        {activeTab === 'kontak' && (
          <KontakKamiSection adminSettings={state.adminSettings} />
        )}

        {activeTab === 'dkm_portal' && hasDkmPortalAccess(state.session.role) && (() => {
          let initialRoleTab: any = 'akuntansi';
          const r = state.session.role;
          if (['direktur', 'ketua_dkm', 'ketua_dewan_pembina', 'pembina'].includes(r)) {
            initialRoleTab = 'dashboard_utama';
          } else if (r === 'bendahara') {
            initialRoleTab = 'akuntansi';
          } else if (r === 'penghimpunan') {
            initialRoleTab = 'keuangan'; // Tab Donasi is inside keuangan
          } else if (r === 'penyaluran') {
            initialRoleTab = 'program';
          }
          
          return (
            <PengurusDkmDashboard
              initialTab={initialRoleTab}
              financials={state.financials}
            inventories={state.inventories}
            petugasList={state.petugas}
            announcements={state.announcements}
            programs={state.programs}
            journalEntries={state.journalEntries}
            glAccounts={state.glAccounts}
            pettyCash={state.pettyCash}
            adminSettings={state.adminSettings}
            galleryItems={state.galleryItems}
            qurbanGroups={state.qurbanGroups || []}
            auditLogs={state.auditLogs || []}
            jamaahProfiles={state.jamaahProfiles || []}
            donations={state.donations}
            onAddFinancial={addFinancialTransaction}
            onUpdateDonationStatus={updateDonationStatus}
            onAddInventory={addInventoryItem}
            onUpdateInventory={updateInventoryItem}
            onDeleteInventory={deleteInventoryItem}
            onUpdatePetugas={updatePetugasJadwal}
            onAddPetugasJadwal={addPetugasJadwal}
            onDeletePetugasJadwal={deletePetugasJadwal}
            onAddAnnouncement={addAnnouncement}
            onUpdateAnnouncement={updateAnnouncement}
            onDeleteAnnouncement={deleteAnnouncement}
            onAddProgram={addProgram}
            onDeleteProgram={deleteProgram}
            onAddJournalEntry={addJournalEntry}
            onAddPettyCashEntry={addPettyCashEntry}
            onUpdateAdminSettings={updateAdminSettings}
            onAddGalleryItem={addGalleryItem}
            onDeleteGalleryItem={deleteGalleryItem}
            onAddQurbanGroup={addQurbanGroup}
            onUpdateQurbanGroup={updateQurbanGroup}
            onDeleteQurbanGroup={deleteQurbanGroup}
            onAddQurbanParticipant={addQurbanParticipant}
            onDeleteQurbanParticipant={deleteQurbanParticipant}
            onUpdateQurbanParticipant={updateQurbanParticipant}
            onAddJamaahProfile={addJamaahProfile}
            onUpdateJamaahProfile={updateJamaahProfile}
            onDeleteJamaahProfile={deleteJamaahProfile}
            openTvMode={() => setTvModeOpen(true)}
            feedbacks={state.feedbacks}
            onUpdateFeedback={updateFeedback}
          />
          );
        })()}

        {activeTab === 'jamaah_portal' && state.session.role === 'jamaah' && (
          <PortalJamaahDashboard 
            session={state.session}
            jamaahProfiles={state.jamaahProfiles || []}
            donations={state.donations}
            onUpdateProfile={updateJamaahProfile}
            openDonationModal={() => handleOpenDonationModal()}
            onNavigateToHome={() => {
              setActiveTab('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            feedbacks={state.feedbacks}
            calendarNotes={state.calendarNotes}
            onSendMessage={addFeedback}
            onAddNote={addCalendarNote}
            onRemoveNote={removeCalendarNote}
          />
        )}
      </main>

      {/* Social Media Section */}
      {state.adminSettings.showSocialMediaOnHome !== false && (
        <div className="print:hidden">
          <SocialMediaSection isDark={isDark} />
        </div>
      )}

      {/* 3. Footer */}
      <div className="print:hidden">
        <Footer
          openDonationModal={() => handleOpenDonationModal()}
          openCalculator={() => setCalculatorModalOpen(true)}
          openDigitalIbadah={handleOpenDigitalIbadah}
          openTvMode={() => setTvModeOpen(true)}
          session={state.session}
          isDark={isDark}
        />
      </div>

      {/* 4. Modals & Overlays */}
      {selectedDetailProgram && (
        <ProgramDetailModal
          program={selectedDetailProgram}
          onClose={() => setSelectedDetailProgram(null)}
          onDonate={(prog) => handleOpenDonationForProgram(prog)}
        />
      )}

      <DonationModalFlow
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        programs={state.programs}
        initialCategory={selectedDonationCategory}
        initialProgram={selectedDonationProgram}
        adminSettings={state.adminSettings}
        onCompleteDonation={addDonation}
        session={state.session}
      />

      <ZiswafCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        onSelectAmountForDonation={handleSelectAmountFromCalculator}
      />

      <DigitalIbadahModal
        isOpen={digitalIbadahOpen}
        onClose={() => setDigitalIbadahOpen(false)}
        initialTab={digitalIbadahTab}
      />

      <CatalogPdfModal
        isOpen={catalogPdfOpen}
        onClose={() => setCatalogPdfOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        currentUrl={state.supabaseUrl}
        currentKey={state.supabaseAnonKey}
        onSave={saveSupabaseKeys}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        session={state.session}
        onLogin={(email, name, role) => {
          login(email, name, role);
          if (hasDkmPortalAccess(role)) {
            setActiveTab('dkm_portal');
          } else if (role === 'jamaah') {
            setActiveTab('jamaah_portal');
          }
        }}
        onLogout={() => {
          logout();
          setActiveTabState('beranda');
          window.location.hash = 'beranda';
          setLoginModalOpen(false);
        }}
      />

      {/* Fullscreen TV Mode */}
      {tvModeOpen && (
        <TvDisplayMode
          onExit={() => setTvModeOpen(false)}
          announcements={state.announcements}
          petugasList={state.petugas}
          adminSettings={state.adminSettings}
        />
      )}

      {/* Floating Mobile Bottom Bar */}
      <FloatingMobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDonationModal={handleOpenDonationModal}
        openDigitalIbadah={handleOpenDigitalIbadah}
        toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isDark={isDark}
        session={state.session}
      />
    </div>
  );
}

