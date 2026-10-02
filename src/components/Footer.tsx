import React, { useState, useEffect } from 'react';
import { DenlightLogo } from './DenlightLogo';
import { getSiteSettings, SiteGlobalSettings } from '../utils/superAdminManager';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp, Send, ShieldCheck, Truck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhatsApp: (text?: string) => void;
  onOpenSuperAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWhatsApp, onOpenSuperAdmin }) => {
  const [siteSettings, setSiteSettings] = useState<SiteGlobalSettings>(getSiteSettings);

  useEffect(() => {
    const handleUpdate = () => setSiteSettings(getSiteSettings());
    window.addEventListener('denlight-site-settings-updated', handleUpdate);
    window.addEventListener('denlight-content-updated', handleUpdate);
    return () => {
      window.removeEventListener('denlight-site-settings-updated', handleUpdate);
      window.removeEventListener('denlight-content-updated', handleUpdate);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs font-sans">
      
      {/* Upper Newsletter & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <DenlightLogo variant="light" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {siteSettings.footerBrandDescription || `Your one-stop destination for the latest electronics, smartphones, HP laptops, heavy-duty laminators, toners, power backups & smart devices at ${siteSettings.siteName} on ${siteSettings.storeAddress}.`}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
              <span className="text-slate-400 uppercase font-bold">Financing Supported:</span>
              <span className="px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 font-bold border border-red-500/30">WATU SIMU</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white font-bold border border-slate-700">ONFON</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-red-400 font-bold border border-slate-700">MOGO</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-red-500 transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('financing')} className="hover:text-red-500 transition-colors">
                  Lipa Mdogo Mdogo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-red-500 transition-colors">
                  Service & Repair Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solar')} className="hover:text-red-400 text-red-400 font-bold transition-colors flex items-center gap-1.5">
                  <span>Solar Power (Coming Soon)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-red-500 transition-colors">
                  Naivasha Store Location
                </button>
              </li>
              <li className="pt-2 border-t border-slate-900">
                <button 
                  onClick={() => onOpenSuperAdmin ? onOpenSuperAdmin() : onNavigate('admin')} 
                  className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5 text-[11px] font-mono cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Staff / Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Popular Categories</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Smartphones & WATU Simu</li>
              <li>HP ProBook Laptops</li>
              <li>Innovia A3 Laminators</li>
              <li>Laserjet Toners & Epson Inks</li>
              <li>Mercury Maverick UPS</li>
              <li>Imou Smart Net Cameras</li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Naivasha Store</h4>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings.storeAddress || 'Kariuki Chotara road, next to Naivas ndogo, Naivasha town'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Lipa Mdogo & Sales:</span>
                    <a href={`tel:+${siteSettings.phoneSales}`} className="hover:text-red-400 font-bold text-white block">
                      {siteSettings.phoneSalesDisplay || '+254 712 124 922'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2 pl-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Tech Lab, Repairs & Networking:</span>
                    <a href={`tel:+${siteSettings.phoneTech}`} className="hover:text-red-400 font-bold text-slate-200 block">
                      {siteSettings.phoneTechDisplay || '+254 719 798 972'}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-red-400 text-slate-300 font-medium break-all">
                  {siteSettings.contactEmail || 'support@denlightitsolutions.co.ke'}
                </a>
              </div>
            </div>

            <button
              onClick={() => onOpenWhatsApp(`Hello ${siteSettings.siteName}, I am inquiring from your store website.`)}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-full text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              WhatsApp Store
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p className="flex flex-col items-start gap-1">
            <span>{siteSettings.footerCopyrightText || `© ${new Date().getFullYear()} ${siteSettings.siteName}. Physical store on Kariuki Chotara road, Naivasha, Kenya.`}</span>
            <button
              type="button"
              onClick={onOpenSuperAdmin}
              className="text-slate-600 hover:text-slate-400 text-[11px] font-mono select-none cursor-pointer transition-colors p-0.5 leading-none opacity-60 hover:opacity-100"
              title=""
              aria-label="A"
            >
              A
            </button>
          </p>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Payment Partners:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold font-mono text-[10px]">M-PESA</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-red-400 font-bold font-mono text-[10px]">WATU</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold font-mono text-[10px]">ONFON</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-red-400 font-bold font-mono text-[10px]">MOGO</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors uppercase cursor-pointer"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-4 h-4 text-red-500" />
          </button>
        </div>

      </div>
    </footer>
  );
};

