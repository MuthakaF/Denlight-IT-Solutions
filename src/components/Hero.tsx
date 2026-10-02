import React, { useState, useEffect } from 'react';
import { SITE_IMAGES } from '../config/productImages';
import { getSiteSettings, SiteGlobalSettings } from '../utils/superAdminManager';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Headphones,
  Clock,
  Sparkles,
  ChevronRight,
  Watch,
  Volume2,
  Tag,
  Laptop
} from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenWhatsApp: (text?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenWhatsApp }) => {
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
  return (
    <section className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs space-y-8">
      
      {/* Main Hero Row */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: TechVerse Content */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Top Red Eyebrow Text */}
            <div className="text-red-600 font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>{siteSettings.heroEyebrow || 'Discover. Inquire. Upgrade.'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.05] font-display">
              {siteSettings.heroHeadline || 'Latest Tech'} <br />
              <span className="text-red-600">{siteSettings.heroHeadlineAccent || 'Gadgets & Phones'}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
              {siteSettings.heroSubtitle || `Explore cutting-edge laptops, WATU & OnFon smartphones, Epson inkjets, power backups & smart security at ${siteSettings.siteName}. Contact us to inquire about stock or visit our shop on ${siteSettings.storeAddress}.`}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
              >
                <span>{siteSettings.heroPrimaryButtonText || 'Browse Tech'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => onOpenWhatsApp(`Hello ${siteSettings.siteName}, I want to inquire about tech products in Naivasha.`)}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl text-xs sm:text-sm border border-slate-300 transition-all active:scale-95 hover:border-red-600 cursor-pointer shadow-2xs"
              >
                <span>Inquire on WhatsApp</span>
              </button>
            </div>

            {/* Region / Contact Badges */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-base">🇰🇪</span>
                <span>Naivasha CBD Shop</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Inquire Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Lipa Mdogo Plans</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Product Studio Photography Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
            
            {/* Big Red Background Circle (Exact match to TechVerse image) */}
            <div className="absolute w-[290px] sm:w-[380px] h-[290px] sm:h-[380px] rounded-full bg-red-600 -right-2 sm:right-6 top-1/2 -translate-y-1/2 z-0 opacity-95" />

            {/* Floating White Circular Badge "New Arrivals" */}
            <div className="absolute top-0 right-2 sm:right-8 z-30 shadow-xl rounded-full bg-white text-slate-900 border border-slate-200 w-20 h-20 p-2 flex flex-col items-center justify-center text-center font-bold animate-bounce-subtle">
              <span className="text-[10px] uppercase font-black tracking-tight leading-none text-slate-900">New</span>
              <span className="text-[10px] uppercase font-bold tracking-tight text-red-600 leading-tight">Arrivals</span>
              <div className="w-4 h-0.5 bg-red-600 rounded-full mt-1" />
            </div>

            {/* Studio Composition Product Cards Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3.5 w-full max-w-md p-2">
              
              {/* Product 1: Silver Over-Ear Headphones */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-2 group">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={SITE_IMAGES.heroAudioHeadphones}
                    alt="Oraimo Over-Ear Headphones"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Audio
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    Oraimo Boom Sound
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Wireless Noise Cancel</p>
                </div>
                <div className="text-xs font-black text-red-600">Ksh 4,500</div>
              </div>

              {/* Product 2: Smartwatch */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-2 translate-y-3 group">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={SITE_IMAGES.heroSmartWatch}
                    alt="Smart Watch"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Smart
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    Smart Watch Series 9
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Heart Rate & SpO2</p>
                </div>
                <div className="text-xs font-black text-slate-900">Ksh 4,800</div>
              </div>

              {/* Product 3: Smartphone */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-2 group">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={SITE_IMAGES.heroSmartphone}
                    alt="Samsung Smartphone"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Lipa Mdogo
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    Samsung Galaxy A15
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">WATU Deposit Ksh 3,200</p>
                </div>
                <div className="text-xs font-black text-slate-900">Ksh 19,500</div>
              </div>

              {/* Product 4: Wireless Earbuds */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-2 translate-y-3 group">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={SITE_IMAGES.heroWirelessEarbuds}
                    alt="Wireless Earbuds"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Earbuds
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    Wireless Earbuds Pro
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Clear Voice Mic</p>
                </div>
                <div className="text-xs font-black text-red-600">Ksh 2,200</div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Category Quick Cards Strip (Matching bottom row in reference image) */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Audio Category */}
          <div
            onClick={() => onNavigate('catalog')}
            className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-red-600 p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">Audio & Earbuds</h4>
                <p className="text-[10px] text-slate-500 font-medium">Oraimo Sound</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Smart Devices */}
          <div
            onClick={() => onNavigate('catalog')}
            className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-red-600 p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">Smartphones</h4>
                <p className="text-[10px] text-slate-500 font-medium">Apple & Android</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Laptops & PCs */}
          <div
            onClick={() => onNavigate('catalog')}
            className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-red-600 p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">Laptops & PCs</h4>
                <p className="text-[10px] text-slate-500 font-medium">HP ProBook / Core i7</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Accessories */}
          <div
            onClick={() => onNavigate('catalog')}
            className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-red-600 p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Watch className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">Smartwatches</h4>
                <p className="text-[10px] text-slate-500 font-medium">Fitness & Health</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Deals */}
          <div
            onClick={() => onNavigate('catalog')}
            className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-red-600 p-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md col-span-2 sm:col-span-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-red-50 shrink-0 border border-red-200 p-2 flex items-center justify-center text-red-600">
                <Tag className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">Top Deals</h4>
                <p className="text-[10px] text-slate-500 font-medium">Naivasha Store</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};


