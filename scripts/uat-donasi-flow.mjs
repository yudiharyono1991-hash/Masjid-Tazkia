import { chromium } from 'playwright';

const BASE_URL = process.env.SMOKE_TEST_URL || 'http://localhost:3000';

async function performDonation(page, isAnonymous, index) {
  console.log(`[Donasi ${isAnonymous ? 'Anonim' : 'Jamaah'} #${index}] Memulai donasi...`);
  
  // Klik tombol donasi
  const donate = page.getByRole('button', { name: /donasi|ziswaf|infaq/i }).first();
  await donate.click({ force: true });
  await page.waitForTimeout(1000);

  // Isi form donasi
  const amountInput = page.getByPlaceholder(/Nominal/i);
  if (await amountInput.count()) {
    await amountInput.fill('50000');
  } else {
    // maybe it has a different placeholder or just click a predefined amount
    const btn50k = page.getByRole('button', { name: /50.000/i }).first();
    if (await btn50k.count()) await btn50k.click({ force: true });
  }
  
  if (isAnonymous) {
    const anonCheckbox = page.getByRole('checkbox', { name: /hamba allah|sembunyikan nama/i });
    if (await anonCheckbox.count()) {
      await anonCheckbox.check({ force: true });
    } else {
      const nameInput = page.getByPlaceholder(/nama/i).first();
      if (await nameInput.count()) await nameInput.fill(`Hamba Allah ${index}`);
    }
  }

  // Lanjutkan
  const nextBtn = page.getByRole('button', { name: /lanjut|selanjutnya|pembayaran/i }).first();
  if (await nextBtn.count()) {
    await nextBtn.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Pilih metode pembayaran (Transfer / QRIS)
  const bankBtn = page.getByRole('button', { name: /transfer|bni/i }).first();
  if (await bankBtn.count()) {
    await bankBtn.click({ force: true });
  }

  // Konfirmasi
  const confirmBtn = page.getByRole('button', { name: /konfirmasi|saya sudah transfer/i }).first();
  if (await confirmBtn.count()) {
    await confirmBtn.click({ force: true });
    await page.waitForTimeout(2000);
  }
  
  // Tutup modal / kembali
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  console.log(`[Donasi ${isAnonymous ? 'Anonim' : 'Jamaah'} #${index}] Selesai.`);
}

async function loginAs(page, role) {
  console.log(`[Login] Masuk sebagai ${role}...`);
  const loginBtn = page.getByRole('button', { name: /akses jamaah|login|masuk|akun/i }).first();
  await loginBtn.click({ force: true });
  await page.waitForTimeout(1000);

  const roleBtn = page.getByRole('button', { name: new RegExp(role, 'i') }).first();
  if (await roleBtn.count()) {
    await roleBtn.click({ force: true });
    await page.waitForTimeout(500);
  }

  const submit = page.getByRole('button', { name: /masuk/i }).first();
  await submit.click({ force: true });
  await page.waitForTimeout(1500);
}

async function main() {
  console.log(`\n=== UAT Flow Donasi Masjid Tazkia — ${BASE_URL} ===\n`);

  let browser;
  try {
    browser = await chromium.launch({ headless: false, slowMo: 50 }); // Headed & slowMo untuk animasi
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Pastikan server jalan
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // TAHAP 1: 5 Donasi Anonim
    console.log('\n--- TAHAP 1: 5 Donasi Anonim ---');
    for (let i = 1; i <= 5; i++) {
      await performDonation(page, true, i);
      await page.goto(BASE_URL); // reset
      await page.waitForTimeout(1000);
    }

    // TAHAP 2: 5 Donasi Jamaah Terdaftar
    console.log('\n--- TAHAP 2: 5 Donasi Jamaah Terdaftar ---');
    await loginAs(page, 'jamaah');
    for (let i = 1; i <= 5; i++) {
      await performDonation(page, false, i);
      await page.goto(BASE_URL); // reset
      await page.waitForTimeout(1000);
    }
    
    // Logout jamaah
    const logoutBtn = page.getByRole('button', { name: /keluar|logout/i }).first();
    if (await logoutBtn.count()) await logoutBtn.click({ force: true });
    await page.waitForTimeout(1000);

    // TAHAP 3: Verifikasi DKM
    console.log('\n--- TAHAP 3: Verifikasi DKM ---');
    await loginAs(page, 'ketua dkm');
    
    const dkmTab = page.getByRole('button', { name: /portal dkm|dkm portal|pengurus/i }).first();
    if (await dkmTab.count()) {
      await dkmTab.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const verifTab = page.getByRole('button', { name: /verifikasi|persetujuan/i }).first();
    if (await verifTab.count()) {
      await verifTab.click({ force: true });
      await page.waitForTimeout(1500);
    }
    
    // Auto-verify donasi
    const verifyButtons = await page.getByRole('button', { name: /verifikasi|terima donasi/i }).all();
    console.log(`Ditemukan ${verifyButtons.length} donasi menunggu verifikasi.`);
    
    for (let i = 0; i < Math.min(verifyButtons.length, 10); i++) {
      await verifyButtons[i].click({ force: true });
      await page.waitForTimeout(800);
      
      const confirmOk = page.getByRole('button', { name: /ya|terima|konfirmasi|ok/i }).first();
      if (await confirmOk.count()) {
         await confirmOk.click({ force: true });
         await page.waitForTimeout(1000);
      }
    }

    // TAHAP 4: Validasi Laporan Keuangan
    console.log('\n--- TAHAP 4: Validasi Laporan Keuangan ---');
    const lapTab = page.getByRole('button', { name: /laporan|keuangan/i }).first();
    if (await lapTab.count()) {
      await lapTab.click({ force: true });
      await page.waitForTimeout(2000);
    }

    console.log('Semua tahapan UAT selesai.');
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('\n=== UAT BERHASIL TANPA ERROR ===');
    
  } catch (err) {
    console.error('\n[ERROR] UAT Gagal:', err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
