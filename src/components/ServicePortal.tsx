import React, { useState, useEffect } from 'react';
import { SERVICES_DATA, DIAGNOSTIC_ISSUES } from '../data/services';
import { getEffectiveServices, getSiteSettings, SiteGlobalSettings } from '../utils/superAdminManager';
import { ServiceCategory } from '../types';
import { Wrench, Laptop, Network, Wifi, CheckCircle2, Clock, MessageSquare, HelpCircle, Phone } from 'lucide-react';

interface ServicePortalProps {
  onOpenWhatsApp: (text?: string) => void;
}

export const ServicePortal: React.FC<ServicePortalProps> = ({
  onOpenWhatsApp
}) => {
  const [services, setServices] = useState<ServiceCategory[]>(getEffectiveServices);
  const [siteSettings, setSiteSettings] = useState<SiteGlobalSettings>(getSiteSettings);

  useEffect(() => {
    const handleUpdate = () => {
      setServices(getEffectiveServices());
      setSiteSettings(getSiteSettings());
    };
    window.addEventListener('denlight-content-updated', handleUpdate);
    window.addEventListener('denlight-site-settings-updated', handleUpdate);
    return () => {
      window.removeEventListener('denlight-content-updated', handleUpdate);
      window.removeEventListener('denlight-site-settings-updated', handleUpdate);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<'laptop' | 'desktop' | 'networking' | 'internet'>('laptop');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(DIAGNOSTIC_ISSUES[0].id);

  const availableIssues = DIAGNOSTIC_ISSUES.filter((i) => i.category === selectedCategory);
  const currentIssue = DIAGNOSTIC_ISSUES.find((i) => i.id === selectedIssueId) || availableIssues[0] || DIAGNOSTIC_ISSUES[0];

  const getServiceIcon = (name: string) => {
    if (name === 'Laptop') return <Laptop className="w-5 h-5 text-black" />;
    if (name === 'Network') return <Network className="w-5 h-5 text-black" />;
    return <Wifi className="w-5 h-5 text-black" />;
  };

  return (
    <section id="services" className="bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-widest font-mono">
            <Wrench className="w-4 h-4 text-black" />
            <span>{siteSettings.servicesLocationNotice || 'Kariuki Chotara Road • Next to Naivas Ndogo'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            {siteSettings.servicesHeaderTitle || 'COMPUTER REPAIRS & IT SERVICES.'}
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            {siteSettings.servicesHeaderSubtitle || 'Professional computer & laptop repairs, SSD speed restoration, CCTV security camera installation, router setup, and structured office networking in Naivasha.'}
          </p>
        </div>

        {/* Services Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-zinc-200 hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 bg-zinc-100 border-b border-zinc-200 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white border border-zinc-300 shadow-sm">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <span className="absolute bottom-3 right-3 bg-black text-white font-mono text-xs font-bold px-3 py-1 rounded">
                    Naivasha Shop
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-zinc-950 group-hover:underline">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-200">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Scope of Service:</span>
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-black" />
                    Turnaround:
                  </span>
                  <strong className="text-black font-bold">{service.turnaroundTime}</strong>
                </div>

                <button
                  onClick={() => onOpenWhatsApp(`Hello Denlight IT Solutions, I would like to inquire about ${service.title} at your Kariuki Chotara road shop, Naivasha.`, '254719798972')}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  Inquire Service on WhatsApp
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Interactive Repair Diagnostic Quiz & Time Estimator */}
        <div className="mt-16 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-widest mb-2 font-mono">
                  <HelpCircle className="w-4 h-4 text-black" />
                  <span>Interactive Diagnostic Guide</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
                  DEVICE DIAGNOSTIC GUIDE
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Select your device type and issue to view repair timeline and book an appointment with our technicians in Naivasha.
                </p>
              </div>

              {/* Category Selector */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
                {[
                  { id: 'laptop', label: 'Laptop Repair' },
                  { id: 'desktop', label: 'Desktop PC' },
                  { id: 'networking', label: 'Wi-Fi / Network' },
                  { id: 'internet', label: 'Hotspot Link' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      const issue = DIAGNOSTIC_ISSUES.find((i) => i.category === cat.id);
                      if (issue) setSelectedIssueId(issue.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-black text-white'
                        : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Issue Options */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-black uppercase">Select Specific Issue:</label>
                <div className="space-y-2">
                  {availableIssues.length > 0 ? (
                    availableIssues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => setSelectedIssueId(issue.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          selectedIssueId === issue.id
                            ? 'bg-black text-white border-black font-bold shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-800 hover:border-black'
                        }`}
                      >
                        <span>{issue.label}</span>
                        <span className={`text-[11px] font-mono ${selectedIssueId === issue.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {issue.estimatedTime}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-white text-zinc-500 text-xs font-mono">
                      Custom issue diagnostic needed. Contact Denlight IT Solutions.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostic Output Estimate Box */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-black space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 font-mono">
                <span className="text-xs font-bold text-black uppercase tracking-widest">Diagnostic Result</span>
                <span className="text-[10px] bg-zinc-100 text-zinc-800 border border-zinc-300 px-2 py-0.5 rounded font-bold">
                  Naivasha Shop
                </span>
              </div>

              {currentIssue ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-black">{currentIssue.label}</h4>
                    <p className="text-xs font-mono text-zinc-600 mt-1">
                      Estimated Turnaround: <strong className="text-black text-sm font-bold">{currentIssue.estimatedTime}</strong>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                    <span className="text-zinc-400 font-mono font-bold block text-[10px] uppercase">Common Causes & Remediation:</span>
                    <ul className="list-disc list-inside text-zinc-700 space-y-0.5">
                      {currentIssue.commonCauses.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onOpenWhatsApp(`Hello Denlight IT Solutions, I want to book a repair for: "${currentIssue.label}" at your Kariuki Chotara road shop, Naivasha.`, '254719798972')}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    Book Repair via Tech Lab WhatsApp
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-zinc-500 font-mono">
                  Select an issue to view timeline.
                </div>
              )}

              <div className="pt-2 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
                <span className="text-zinc-500">Need immediate repair help?</span>
                <a
                  href="tel:+254719798972"
                  className="font-bold text-black hover:underline flex items-center gap-1 uppercase"
                >
                  <Phone className="w-3.5 h-3.5 text-black" />
                  Call Tech Lab (+254 719 798 972)
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
