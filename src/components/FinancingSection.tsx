import React, { useState, useEffect } from 'react';
import { FINANCING_PARTNERS } from '../data/financing';
import { getSiteSettings, SiteGlobalSettings } from '../utils/superAdminManager';
import { FinancingPartnerId } from '../types';
import { ShieldCheck, CheckCircle2, CreditCard, ArrowRight, UserCheck, HelpCircle } from 'lucide-react';

interface FinancingSectionProps {
  onSelectPartner: (partnerId: FinancingPartnerId) => void;
  onOpenWhatsApp: (text?: string) => void;
}

export const FinancingSection: React.FC<FinancingSectionProps> = ({
  onSelectPartner,
  onOpenWhatsApp
}) => {
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

  const [activePartnerId, setActivePartnerId] = useState<FinancingPartnerId>('watu');
  const [selectedIDType, setSelectedIDType] = useState('Kenyan National ID');
  const [hasMpesa, setHasMpesa] = useState(true);
  const [depositBudgetKes, setDepositBudgetKes] = useState(4000);

  const selectedPartner = FINANCING_PARTNERS.find((p) => p.id === activePartnerId) || FINANCING_PARTNERS[0];

  return (
    <section id="financing" className="bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-widest font-mono">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Smartphone Financing • Naivasha Store</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            {siteSettings.financingHeaderTitle || 'LIPA MDOGO MDOGO FINANCING'}
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            {siteSettings.financingHeaderSubtitle || `${siteSettings.siteName} partners with WATU Simu (exclusive to Samsung Galaxy A07) and OnFon Mobile & MOGO (supporting Tecno, Infinix, Itel, ZTE, Xiaomi, Oppo — excluding Samsung & Nokia). Pay a small deposit and clear the rest via daily or weekly M-Pesa installments.`}
          </p>
        </div>

        {/* Step-by-step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-black transition-all relative group">
            <div className="w-10 h-10 rounded-xl bg-black text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Select Your Phone</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Samsung A07 for WATU, or Tecno, Infinix, Itel, ZTE, Xiaomi for OnFon & MOGO.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-red-500 transition-all relative group">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 group-hover:bg-red-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4 transition-colors">
              02
            </div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Choose Partner</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              WATU Simu (Samsung A07), OnFon Mobile, or MOGO (Non-Samsung / Non-Nokia).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-red-500 transition-all relative group">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 group-hover:bg-red-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4 transition-colors">
              03
            </div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">15-Min Verification</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Bring your original Kenyan National ID and active M-Pesa line to our Naivasha store.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-red-500 transition-all relative group">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 group-hover:bg-red-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-4 transition-colors">
              04
            </div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Collect Device</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Pay initial deposit and walk away with your smartphone. Clear remainder in installments.
            </p>
          </div>

        </div>

        {/* Card-Based Showcase of Partners */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b border-zinc-200 pb-4">
            <h3 className="text-lg font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-600" />
              Financing Partners & Brand Compatibility
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Select a partner for details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FINANCING_PARTNERS.map((partner) => {
              const isSelected = partner.id === activePartnerId;
              return (
                <div
                  key={partner.id}
                  onClick={() => setActivePartnerId(partner.id)}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-2 border-red-600 shadow-xl shadow-red-950/20'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-red-500/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded ${isSelected ? 'bg-red-600 text-white' : 'bg-zinc-950 text-white'}`}>
                        {partner.badgeText}
                      </span>
                      <span className={`text-xs font-mono ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Up to {partner.maxDurationMonths} Months
                      </span>
                    </div>

                    <h4 className="text-2xl font-black tracking-tight">{partner.name}</h4>
                    <p className={`text-xs font-mono uppercase mt-1 ${isSelected ? 'text-red-400' : 'text-zinc-600'}`}>{partner.tagline}</p>
                    <p className={`text-xs mt-3 leading-relaxed line-clamp-3 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {partner.description}
                    </p>

                    <div className={`mt-4 pt-4 border-t space-y-2 ${isSelected ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <div className={`text-[10px] font-mono uppercase font-semibold mb-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>Rules:</div>
                      {partner.features.slice(0, 4).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-red-400' : 'text-red-600'}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isSelected ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <span className={`text-xs ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      Payment: <strong className={isSelected ? 'text-white' : 'text-black'}>{partner.paymentFrequencies.join(', ')}</strong>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPartner(partner.id);
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isSelected ? 'text-red-400 hover:text-red-300 hover:underline' : 'text-black hover:text-red-600 hover:underline'
                      }`}
                    >
                      Filter Catalog
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Selected Partner Requirements & Quick Eligibility Checker */}
        <div className="mt-12 rounded-2xl bg-zinc-50 border border-zinc-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-red-600 text-white">
                  {selectedPartner.badgeText}
                </span>
                <h3 className="text-xl font-black text-zinc-950 uppercase tracking-wider">{selectedPartner.name} Requirements</h3>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                To register under <strong className="text-black">{selectedPartner.name}</strong> at Denlight IT Solutions, Kariuki Chotara road, Naivasha, bring:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {selectedPartner.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-medium">
                    <UserCheck className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Interactive Eligibility Estimator */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-zinc-200 space-y-4 shadow-sm">
              <h4 className="text-xs font-mono font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-600" />
                Inquire Partner Requirements
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Your ID Document:</label>
                  <select
                    value={selectedIDType}
                    onChange={(e) => setSelectedIDType(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="Kenyan National ID">Kenyan National ID (Original)</option>
                    <option value="Alien ID">Alien ID / Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-medium mb-1">
                    Your Deposit Budget: <span className="text-red-600 font-bold">KES {depositBudgetKes.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={2500}
                    max={10000}
                    step={250}
                    value={depositBudgetKes}
                    onChange={(e) => setDepositBudgetKes(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                    <span>KES 2,500</span>
                    <span>KES 6,000</span>
                    <span>KES 10,000+</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-700">Active M-Pesa Line (&gt;6 months):</span>
                  <button
                    onClick={() => setHasMpesa(!hasMpesa)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                      hasMpesa
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {hasMpesa ? 'YES' : 'NO'}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenWhatsApp(`Hello Denlight Naivasha, I want to check my qualification for ${selectedPartner.name} with ID (${selectedIDType}) and deposit budget of KES ${depositBudgetKes.toLocaleString()}.`)}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm border border-zinc-800 hover:border-red-500 cursor-pointer"
                >
                  Inquire via WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
