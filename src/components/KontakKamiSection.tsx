import React, { useState } from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Globe } from 'lucide-react';
import { AppAdminSettings } from '../types';

interface KontakKamiProps {
  adminSettings: AppAdminSettings;
}

export const KontakKamiSection: React.FC<KontakKamiProps> = ({ adminSettings }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSendWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    
    // Format WA message
    const waText = `Assalamu'alaikum, saya ${name}.\n\n${message}`;
    // Find WA from admin settings
    const rawPhone = adminSettings?.masjidPhoneContact?.split('/')[0] || '6285810008899';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('whatsapp') || p.includes('telegram')) return <MessageCircle className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-0 font-sans">
      
      <div className="container mx-auto px-4 max-w-4xl mb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-5 border border-slate-100">
          
          {/* Kiri: Info Kontak */}
          <div className="md:col-span-2 bg-slate-50 p-8 md:p-10 border-r border-slate-200">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Kontak Kami</h2>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
              Jangan ragu untuk menghubungi kami melalui formulir di samping ini atau melalui media sosial kami.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Alamat</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {adminSettings?.masjidAddressInfo || 'Jl. Ir. H. Djuanda No.70 Sentul City Bogor - Indonesia'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Email</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {adminSettings?.masjidPhoneContact?.split('/')[1]?.trim() || 'masjidtazkia@tazkia.ac.id'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Telephone (WA)</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {adminSettings?.masjidPhoneContact?.split('/')[0]?.trim() || '+62 858 1000 8899\n+62 821 1111 8618'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-xs font-bold text-slate-500 mb-4">Follow Social Media</h4>
              <div className="flex gap-3">
                {adminSettings?.socialMediaLinks?.map((link: any) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-md"
                  >
                    {getIcon(link.platform)}
                  </a>
                ))}
                {(!adminSettings?.socialMediaLinks || adminSettings.socialMediaLinks.length === 0) && (
                  <p className="text-sm text-slate-400 italic">Belum ada tautan.</p>
                )}
              </div>
            </div>
          </div>

          {/* Kanan: Form */}
          <div className="md:col-span-3 p-8 md:p-10">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Kirim Pesan Sekarang</h2>
            
            <form onSubmit={handleSendWa} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap" 
                  className="w-full border border-slate-200 rounded-lg p-3.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pertanyaan atau Pesan</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis di sini..." 
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg p-3.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-slate-50/50 focus:bg-white resize-none"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm"
              >
                Kirim via WhatsApp
              </button>
            </form>
          </div>
          
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[450px] bg-slate-200 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.36307379761!2d106.86082907409241!3d-6.57245999342111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c762514ab1df%3A0xc68297b5f10257e8!2sMasjid%20Tazkia%20Islamic%20Center%20(d%2Fh%20Andalusia)!5e0!3m2!1sid!2sid!4v1723145455246!5m2!1sid!2sid" 
          className="absolute inset-0 w-full h-full border-0" 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Masjid Tazkia"
        ></iframe>
      </div>
    </div>
  );
};
