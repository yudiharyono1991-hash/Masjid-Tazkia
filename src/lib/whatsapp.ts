/**
 * Utilitas untuk mengirim pesan WhatsApp menggunakan API internal server Masjid Tazkia.
 * (Server akan meneruskannya ke Gateway WA seperti Fonnte/Wablas/Wazzup)
 */
export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  try {
    // Pastikan nomor berformat 62...
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+62')) {
      formattedPhone = formattedPhone.substring(1);
    }

    const response = await fetch('/api/wa/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message
      })
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Gagal mengirim WhatsApp:', error);
    return false;
  }
}

/**
 * Utilitas untuk membuat tautan WhatsApp langsung (jika API gagal/belum di-set)
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  }
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
