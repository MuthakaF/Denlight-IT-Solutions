import React, { useState } from 'react';
import {
  Code,
  Globe,
  Smartphone,
  Server,
  ShoppingCart,
  Database,
  Palette,
  ShieldAlert,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Terminal,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface SoftwareServicesSectionProps {
  onOpenWhatsApp: (customText?: string, phoneNumber?: string) => void;
}

export const SoftwareServicesSection: React.FC<SoftwareServicesSectionProps> = ({ onOpenWhatsApp }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    serviceType: 'Web Development & E-Commerce',
    budgetRange: 'Ksh 15,000 - Ksh 50,000',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const softwareContactPhone = '254793062448';
  const softwareContactPhoneDisplay = '+254 793 062 448';
  const softwareContactEmail = 'faithmuthaka@gmail.com';

  const servicesList = [
    {
      id: 'web-dev',
      icon: Globe,
      title: 'Custom Web Development & E-Commerce',
      shortDesc: 'Modern responsive websites, custom web applications, e-commerce stores, and high-converting landing pages built with React, Node.js, and Tailwind CSS.',
      features: [
        'Custom E-Commerce & M-Pesa Integration',
        'Mobile-First Responsive Web Design',
        'High Speed SSD Cloud Hosting Included',
        'SEO-Optimized Code & Fast Page Load'
      ],
      badge: 'Popular',
      color: 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400'
    },
    {
      id: 'pos-systems',
      icon: ShoppingCart,
      title: 'POS & Inventory Management Systems',
      shortDesc: 'Tailored Point of Sale software for supermarkets, electronics shops, pharmacies, hotels, and retail stores in Naivasha and across Kenya.',
      features: [
        'Stock & Inventory Tracking in Real-Time',
        'Barcode Scanner & Receipt Printer Drivers',
        'Sales Analytics & Profit Loss Reports',
        'Multi-User Staff Permissions & Shift Audit'
      ],
      badge: 'Retail Ready',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
    },
    {
      id: 'mobile-apps',
      icon: Smartphone,
      title: 'Android & iOS Mobile App Development',
      shortDesc: 'Native and cross-platform mobile apps for delivery services, booking portals, store catalogs, school systems, and business tools.',
      features: [
        'Smooth Intuitive UI/UX Navigation',
        'Offline Mode & Data Synchronization',
        'Push Notifications & Instant SMS Alerts',
        'Play Store & App Store Deployment'
      ],
      badge: 'Custom Build',
      color: 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400'
    },
    {
      id: 'domain-hosting',
      icon: Server,
      title: 'Domain Registration, Hosting & Custom Email',
      shortDesc: 'Professional domain acquisition (.co.ke, .com, .org), high-speed SSD cloud cPanel hosting, and official business emails.',
      features: [
        'Custom Business Email (info@yourbrand.co.ke)',
        '99.9% Uptime Guarantee & Free SSL Security',
        'Automated Daily Website Backups',
        'DNS Management & Fast Propagation'
      ],
      badge: 'Essential',
      color: 'bg-red-50 border-red-200 text-red-700 hover:border-red-400'
    },
    {
      id: 'custom-software',
      icon: Database,
      title: 'Custom Enterprise Software & Databases',
      shortDesc: 'Bespoke ERP systems, school management portals, hospital records software, and cloud-hosted relational databases tailored to your workflow.',
      features: [
        'Relational Database Architecture (PostgreSQL/MySQL)',
        'Cloud-Based Multi-Branch Access',
        'Automated Financial & Operations Reporting',
        'Role-Based Security & Audit Trail'
      ],
      badge: 'Enterprise',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-400'
    },
    {
      id: 'graphics-branding',
      icon: Palette,
      title: 'UI/UX Design & Brand Identity Graphics',
      shortDesc: 'Professional vector logo design, company profiles, social media banner design, business cards, and marketing artwork.',
      features: [
        'Vector Logo Files (PNG, SVG, AI, PDF)',
        'Comprehensive Brand Style Guides',
        'Print-Ready Flyers & Posters',
        'High Quality Social Media Templates'
      ],
      badge: 'Creative',
      color: 'bg-pink-50 border-pink-200 text-pink-700 hover:border-pink-400'
    },
    {
      id: 'seo-marketing',
      icon: Search,
      title: 'SEO & Google My Business Ranking',
      shortDesc: 'Put your Naivasha business on top of Google Search and Google Maps. Attract more local customers searching for your services.',
      features: [
        'Google Maps Pin Creation & Verification',
        'Local Keyword Research & On-Page SEO',
        'Business Listing & Online Reputation',
        'Monthly Traffic & Inquiries Growth Reports'
      ],
      badge: 'Growth',
      color: 'bg-red-50 border-red-200 text-red-700 hover:border-red-400'
    },
    {
      id: 'cybersecurity',
      icon: ShieldAlert,
      title: 'Cybersecurity, Cloud Backup & IT Audit',
      shortDesc: 'Protect your business databases and server hardware from ransomware, system crashes, and data loss with managed cloud backups.',
      features: [
        'Automated Off-Site Data Synchronization',
        'Ransomware & Malware Security Shield',
        'System Crash & Disaster Recovery',
        'Network Firewall & Access Control Audit'
      ],
      badge: 'Security',
      color: 'bg-slate-100 border-slate-300 text-slate-800 hover:border-slate-500'
    }
  ];

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const messageText = `Hello Faith / Denlight IT Software Services,
I would like to inquire about software solutions:

Name: ${formData.name}
Contact: ${formData.phoneOrEmail}
Service Required: ${formData.serviceType}
Budget Estimate: ${formData.budgetRange}
Project Details: ${formData.description || 'N/A'}

Please get back to me with a consultation or quote.`;

    setTimeout(() => {
      onOpenWhatsApp(messageText, softwareContactPhone);
      setSubmitted(false);
    }, 800);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50/80 via-white to-slate-100 text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-red-600/20 shadow-sm">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-mono font-bold uppercase tracking-wider">
            <Code className="w-4 h-4 text-red-600" />
            <span>SOFTWARE & DIGITAL SOLUTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 font-display leading-tight">
            CUSTOM SOFTWARE & <span className="text-red-600">WEB DEVELOPMENT</span> SERVICES.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            From high-converting e-commerce websites and POS store inventory systems to Android apps, domain hosting, and brand design — Denlight IT Solutions brings your digital business ideas to life with clean, modern technology.
          </p>

          {/* Contact Direct Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-200">
            <a
              href={`https://wa.me/${softwareContactPhone}?text=${encodeURIComponent('Hello Faith / Denlight Software Services, I want to inquire about custom software or web development.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Direct WhatsApp: {softwareContactPhoneDisplay}</span>
            </a>

            <a
              href={`mailto:${softwareContactEmail}`}
              className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider border border-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Email: {softwareContactEmail}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Cards Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Direct Phone Card */}
        <div className="bg-white border-2 border-red-600/30 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-red-600 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-red-600 tracking-wider block">
              Software Consultation & Inquiries
            </span>
            <h3 className="text-xl font-black text-slate-900 font-display">
              {softwareContactPhoneDisplay}
            </h3>
            <p className="text-xs text-slate-500">
              Call or WhatsApp Faith directly for custom software proposals & quotes.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${softwareContactPhone}?text=${encodeURIComponent('Hello Faith, I need software services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline"
              >
                <span>Chat on WhatsApp now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-slate-900 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7 text-red-500" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider block">
              Official Email Address
            </span>
            <h3 className="text-xl font-black text-slate-900 font-display break-all">
              {softwareContactEmail}
            </h3>
            <p className="text-xs text-slate-500">
              Send your project specifications, RFP document, or contract terms.
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${softwareContactEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline"
              >
                <span>Send Email directly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              SOFTWARE & DIGITAL <span className="text-red-600">CAPABILITIES</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              High-performance software systems engineered for business growth in Naivasha and across East Africa.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Tailored to Your Specifications</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicesList.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 hover:border-red-600 p-5 rounded-2xl shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-900 text-white group-hover:bg-red-600 transition-colors shadow-xs">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors font-display">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setFormData({ ...formData, serviceType: service.title });
                      const el = document.getElementById('software-inquiry-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Software Project Consultation Form */}
      <section id="software-inquiry-form" className="bg-gradient-to-br from-red-50/60 via-slate-50 to-white text-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-red-600/20 space-y-8 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 text-xs font-mono font-bold uppercase">
            <Terminal className="w-3.5 h-3.5 text-red-600" />
            <span>Instant Project Consultation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            START YOUR <span className="text-red-600">SOFTWARE PROJECT</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Fill in your requirements below to connect directly with Faith at Denlight IT Solutions via WhatsApp ({softwareContactPhoneDisplay}) or email ({softwareContactEmail}).
          </p>
        </div>

        <form onSubmit={handleSubmitWhatsApp} className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 text-xs shadow-md">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Your Name / Business Name:
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Faith Muthaka / Retail Store Naivasha"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Phone Number or Email:
              </label>
              <input
                type="text"
                required
                value={formData.phoneOrEmail}
                onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                placeholder="e.g. +254 793 062 448 or faithmuthaka@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Software Service Needed:
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Web Development & E-Commerce">Web Development & E-Commerce Store</option>
                <option value="POS & Inventory System">POS & Inventory Management Software</option>
                <option value="Android & iOS App">Android & iOS Mobile Application</option>
                <option value="Domain, Hosting & Email">Domain Registration, Cloud Hosting & Custom Email</option>
                <option value="Custom Enterprise Database">Custom Enterprise Software & Database</option>
                <option value="UI/UX & Branding Graphics">UI/UX Design, Logo & Branding Graphics</option>
                <option value="SEO & Google Maps Ranking">SEO & Google Maps Ranking</option>
                <option value="Cybersecurity & Cloud Backup">Cybersecurity & Automated Cloud Backup</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Estimated Budget Range:
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Under Ksh 15,000">Under Ksh 15,000 (Basic Landing / Logo)</option>
                <option value="Ksh 15,000 - Ksh 50,000">Ksh 15,000 - Ksh 50,000 (Standard Website / POS)</option>
                <option value="Ksh 50,000 - Ksh 150,000">Ksh 50,000 - Ksh 150,000 (Full E-Commerce / App)</option>
                <option value="Above Ksh 150,000">Above Ksh 150,000 (Custom Enterprise System)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
              Project Brief or Requirements:
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you want to build or achieve (e.g. E-commerce website for my Naivasha store with M-Pesa integration)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={submitted}
              className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Preparing Inquiry...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Inquire via WhatsApp (+254 793 062 448)</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${softwareContactEmail}?subject=${encodeURIComponent(`Software Inquiry: ${formData.serviceType}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nContact: ${formData.phoneOrEmail}\nService: ${formData.serviceType}\nBudget: ${formData.budgetRange}\n\nDetails:\n${formData.description}`)}`}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Email Quote (faithmuthaka@gmail.com)</span>
            </a>
          </div>

        </form>
      </section>

    </div>
  );
};
