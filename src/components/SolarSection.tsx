import React, { useState } from 'react';
import { SOLAR_IMAGES } from '../config/productImages';
import {
  Sun,
  Zap,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  Calculator,
  ArrowRight,
  Sparkles,
  Layers,
  Flame,
  Droplets,
  Lightbulb,
  Building,
  Home,
  Check,
  Compass,
  Clock,
  TrendingDown,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface SolarSectionProps {
  onOpenWhatsApp: (customText?: string, phoneNumber?: string) => void;
}

export const SolarSection: React.FC<SolarSectionProps> = ({ onOpenWhatsApp }) => {
  // Sizing Calculator State
  const [propertyType, setPropertyType] = useState<'small-home' | 'family-home' | 'villa' | 'shop' | 'farm'>('family-home');
  const [backupDuration, setBackupDuration] = useState<'evening' | 'night' | 'offgrid'>('night');
  const [includeWaterPump, setIncludeWaterPump] = useState<boolean>(false);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    location: 'Naivasha',
    systemInterest: 'Family Home 3kVA Hybrid Solar System',
    estimatedBudget: 'KES 100,000 - 200,000',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Solar Consultation Phone & Email
  const solarContactPhone = '254712124922';
  const solarContactPhoneDisplay = '+254 712 124 922';
  const solarContactEmail = 'support@denlightitsolutions.co.ke';

  // Calculator Logic
  const getSizingEstimate = () => {
    switch (propertyType) {
      case 'small-home':
        return {
          inverter: '1.2kVA / 1000W Pure Sine Wave (12V)',
          panels: '2x 300W Monocrystalline Panels (600W Total)',
          battery: '1x 150Ah / 200Ah Deep Cycle Gel Battery',
          appliances: '8x LED Lights, 32"-43" TV, Decoder, Wi-Fi Router, Phones & Laptops',
          dailyProduction: '2.5 - 3.2 kWh / Day',
          priceRange: 'KES 55,000 - 85,000',
          recommendedKit: '1kVA Essential Light & Media Solar Kit'
        };
      case 'family-home':
        return {
          inverter: includeWaterPump ? '3.5kVA / 3000W Hybrid MPPT (24V)' : '3.0kVA / 2400W Hybrid MPPT (24V)',
          panels: '4x 450W - 550W Tier-1 Mono Half-Cut Panels (1.8kW - 2.2kW Total)',
          battery: '1x 24V 100Ah Lithium (LiFePO4) or 2x 200Ah Gel Batteries',
          appliances: 'All LED Lights, 55" TV, Fridge/Freezer, Wi-Fi, Laptops, Decoder, Blender' + (includeWaterPump ? ', 0.5HP Booster Pump' : ''),
          dailyProduction: '7.5 - 10.5 kWh / Day',
          priceRange: 'KES 155,000 - 215,000',
          recommendedKit: '3kVA Standard Family Home Hybrid Backup'
        };
      case 'villa':
        return {
          inverter: '5.0kVA - 6.0kVA High Voltage Hybrid Inverter (48V)',
          panels: '8x 550W Tier-1 Monocrystalline Panels (4.4kW Total)',
          battery: '48V 100Ah / 200Ah Lithium Powerwall (5.12kWh - 10.24kWh)',
          appliances: 'Full Villa lighting, 2x Double Door Fridges, Washing Machine, Microwave, CCTV Security, 1HP Water Pump, Entertainment',
          dailyProduction: '18.0 - 24.0 kWh / Day',
          priceRange: 'KES 320,000 - 450,000',
          recommendedKit: '5kVA Executive Villa & Off-Grid Hybrid'
        };
      case 'shop':
        return {
          inverter: '3.0kVA - 5.0kVA Commercial Hybrid Pure Sine Wave',
          panels: '4x to 6x 550W High-Efficiency Monocrystalline Panels',
          battery: '24V / 48V Lithium Storage (Fast Daytime Charging)',
          appliances: 'Computers, POS Billing Terminals, Receipt Printers, Security Cameras, Store LED Strip Lighting, Wi-Fi, Drink Cooler',
          dailyProduction: '12.0 - 16.0 kWh / Day',
          priceRange: 'KES 175,000 - 280,000',
          recommendedKit: 'Commercial Retail & Office Continuity Kit'
        };
      case 'farm':
        return {
          inverter: 'Solar VFD Pump Inverter (2.2kW - 7.5kW DC-to-AC)',
          panels: '8x to 16x 550W Monocrystalline Heavy Duty Array',
          battery: 'Direct Drive Daytime Pumping (Optional Battery for Night Ops)',
          appliances: '1.5HP - 5HP Submersible Borehole Pump, Drip Irrigation Controllers, Greenhouse Lighting & Security Fencing',
          dailyProduction: '20,000 - 60,000 Litres Water / Day',
          priceRange: 'KES 220,000 - 480,000 (Based on borehole depth & pump HP)',
          recommendedKit: 'Agricultural Solar Borehole & Pumping System'
        };
    }
  };

  const currentEstimate = getSizingEstimate();

  const handleSizingWhatsApp = () => {
    const propertyLabel =
      propertyType === 'small-home'
        ? 'Small Home / Bedsitter'
        : propertyType === 'family-home'
        ? '2-3 Bedroom Family Home'
        : propertyType === 'villa'
        ? '4-5 Bedroom Villa / Mansion'
        : propertyType === 'shop'
        ? 'Retail Store / Office / Cyber'
        : 'Farm / Borehole Pumping';

    const msg = `Hello Denlight Solar & Power Solutions,
I am interested in your UPCOMING Solar Power Solutions (Early Inquiry):

Property Type: ${propertyLabel}
Estimated Sizing: ${currentEstimate.inverter}
Panels: ${currentEstimate.panels}
Battery: ${currentEstimate.battery}
Estimated Budget Range: ${currentEstimate.priceRange}
Location: Naivasha / Kenya

Please register my pre-launch interest and provide early consultation details.`;

    onOpenWhatsApp(msg, solarContactPhone);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const msg = `Hello Denlight Solar & Power Solutions,
I am registering pre-launch interest for your upcoming Solar Power Solutions:

Name: ${formData.name}
Contact: ${formData.phoneOrEmail}
Location: ${formData.location}
System of Interest: ${formData.systemInterest}
Budget Range: ${formData.estimatedBudget}
Details / Requirements: ${formData.notes || 'N/A'}

Please keep me updated when this service launches and provide preliminary advice.`;

    setTimeout(() => {
      onOpenWhatsApp(msg, solarContactPhone);
      setSubmitted(false);
    }, 800);
  };

  const solarEquipmentCategories = [
    {
      title: 'Monocrystalline Solar Panels',
      desc: 'Tier-1 high efficiency half-cut cells (150W, 300W, 450W, 550W). Optimized for high energy harvest during cloudy Naivasha weather with 25-year performance warranty.',
      specs: '150W - 550W • 21.5% Efficiency • IP68 Weatherproof',
      image: SOLAR_IMAGES.solarPanelsMono,
      badge: 'Tier-1 Quality',
      tag: 'Panels'
    },
    {
      title: 'Pure Sine Wave Hybrid Inverters',
      desc: 'Smart inverters (1kVA, 3kVA, 5kVA, 10kVA) with integrated MPPT solar charge controllers, automatic KPLC mains bypass, and mobile Wi-Fi monitoring.',
      specs: '1kVA - 10kVA • Built-in MPPT • Auto Generator Start',
      image: SOLAR_IMAGES.hybridInverters,
      badge: 'Smart Inverter',
      tag: 'Inverters'
    },
    {
      title: 'Lithium (LiFePO4) & Gel Batteries',
      desc: 'Long-life energy storage (100Ah, 200Ah, 48V Powerwalls). Lithium iron phosphate chemistry rated for 6,000+ cycles (10+ year lifespan) with Smart BMS protection.',
      specs: '12V / 24V / 48V • 6,000 Cycles • 10-Year Life',
      image: SOLAR_IMAGES.lithiumBatteries,
      badge: 'High Life-Cycle',
      tag: 'Batteries'
    },
    {
      title: 'Solar LED Street & Security Lights',
      desc: 'All-in-one solar streetlights and heavy-duty floodlights (100W, 200W, 400W, 600W) with radar motion detection, remote control, and dusk-to-dawn sensors.',
      specs: '100W - 600W • Radar Motion • 12-16hr Night Glow',
      image: SOLAR_IMAGES.solarStreetlights,
      badge: 'Zero Power Bill',
      tag: 'Lighting'
    },
    {
      title: 'Solar Water Heating Systems',
      desc: 'Pressurized and non-pressurized solar water heaters (150L, 200L, 300L) with high-vacuum evacuated tubes and electric backup thermostat heating for cold Naivasha mornings.',
      specs: '150L, 200L, 300L • Stainless Steel • 72hr Insulation',
      image: SOLAR_IMAGES.solarWaterHeater,
      badge: 'Hot Water 24/7',
      tag: 'Water Heating'
    },
    {
      title: 'Solar Borehole & Agricultural Pumps',
      desc: 'DC and AC submersible solar pumps for farms, boreholes, greenhouses, and residential water towers. Zero electricity bills for daily irrigation.',
      specs: '0.5HP - 7.5HP • Head: 30m - 250m • High Flow Rate',
      image: SOLAR_IMAGES.solarWaterPumping,
      badge: 'Farm & Irrigation',
      tag: 'Pumping'
    }
  ];

  const turnkeyPackages = [
    {
      name: 'Essential Home Lighting & Media Kit',
      rating: '1.2kVA / 12V',
      idealFor: 'Bedsitters, small rural homes, security outposts, kiosks',
      price: 'KES 55,000 - 85,000',
      image: SOLAR_IMAGES.packageBasicHome,
      features: [
        '1.2kVA Pure Sine Wave Inverter + Charger',
        '2x 300W Monocrystalline Solar Panels (600W Total)',
        '1x 150Ah / 200Ah Deep Cycle Solar Battery',
        'Powers 8 LED bulbs, 32"-43" TV, Decoder, Wi-Fi, Phone Charging',
        'DC Breakers, MC4 Connectors & Installation Accessories'
      ],
      popular: false
    },
    {
      name: 'Standard Family Home Hybrid System',
      rating: '3.0kVA / 24V',
      idealFor: '2-3 Bedroom residential homes, townhouses & apartments in Naivasha',
      price: 'KES 155,000 - 215,000',
      image: SOLAR_IMAGES.packageFamilyHybrid,
      features: [
        '3.0kVA / 2400W Hybrid Inverter with 60A MPPT',
        '4x 450W - 550W Tier-1 Mono Solar Panels (1.8kW - 2.2kW Array)',
        '1x 24V 100Ah Lithium (LiFePO4) or 2x 200Ah Gel Batteries',
        'Powers All Lights, 55" TV, Fridge/Freezer, Laptops, Wi-Fi, Blender & CCTV',
        'Seamless automatic switchover during KPLC power blackouts (< 10ms)'
      ],
      popular: true
    },
    {
      name: 'Executive Villa & Off-Grid Hybrid System',
      rating: '5.0kVA / 48V',
      idealFor: '4-5 Bedroom villas, boutique hotels, cottages & large offices',
      price: 'KES 320,000 - 450,000',
      image: SOLAR_IMAGES.packageCommercialVilla,
      features: [
        '5.0kVA / 5000W Heavy-Duty Hybrid Inverter (48V, Parallel Capable)',
        '8x 550W Monocrystalline Tier-1 Panels (4.4kW Solar Array)',
        '48V 100Ah / 200Ah Lithium Wall-Mount Battery (5.12kWh - 10.24kWh)',
        'Powers Full House, 2x Fridges, Microwave, Washing Machine, Borehole Pump, CCTV & Alarm',
        'Mobile App live tracking for solar generation & battery state'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* 1. Hero Banner - Red Theme with Coming Soon / Future Venture Notice */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600/10 via-red-50/40 to-white text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-red-600/20 shadow-sm">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-slate-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span>COMING SOON • FUTURE EXPANSION</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold font-mono">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>Pre-Launch Inquiries & Interest Open</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 font-display leading-tight">
            SOLAR POWER & <span className="text-red-600">CLEAN ENERGY</span> SOLUTIONS.
          </h1>

          <div className="p-4 rounded-2xl bg-white/90 border border-red-200 text-slate-800 text-xs sm:text-sm leading-relaxed max-w-3xl space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-red-700 uppercase font-mono text-xs">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Upcoming Business Venture Notice:</span>
            </div>
            <p>
              Denlight IT Solutions is preparing to venture into <strong>turnkey solar power systems, hybrid inverters, and battery storage</strong> for homes, shops, lodges, and farms in Naivasha and across Kenya.
            </p>
            <p className="text-slate-600 text-xs">
              While we are finalizing official supplier partnerships and launch schedules, you can use our interactive sizing calculator below, explore upcoming packages, or register your early interest.
            </p>
          </div>

          {/* Quick CTA row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('solar-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>Try Sizing Calculator</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('solar-quote-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-red-400" />
              <span>Register Early Interest</span>
            </button>

            <a
              href={`https://wa.me/${solarContactPhone}?text=${encodeURIComponent('Hello Denlight IT Solutions, I am interested in your upcoming Solar Power solutions in Naivasha. Please register my early inquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>WhatsApp: {solarContactPhoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Planned Solar Benefits Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-2 hover:border-red-600 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Zero Blackouts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ultra-fast automatic transfer switchover. Lights, Wi-Fi, computers, and fridges stay running during KPLC power cuts.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-2 hover:border-red-600 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Save on Electricity Tokens</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Harness Kenya's sunshine. Power daytime loads directly from free solar energy to lower monthly power bills.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-2 hover:border-red-600 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Battery className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Lithium Storage</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Modern LiFePO4 battery chemistry with 6,000+ life cycles (over 10+ years of daily reliable usage).
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs space-y-2 hover:border-red-600 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Expert Naivasha Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Backed by Denlight IT Solutions technical support, certified components, and on-site engineering in Naivasha.
          </p>
        </div>
      </section>

      {/* 3. Interactive Solar Sizing & Cost Estimator Calculator - Red/Dark Theme */}
      <section id="solar-calculator" className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase">
            <Calculator className="w-3.5 h-3.5 text-red-400" />
            <span>Interactive Solar System Estimator (Preliminary)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            ESTIMATE YOUR SOLAR <span className="text-red-500">POWER REQUIREMENTS</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select your property type and load requirements to see our planned hardware configurations and approximate budget estimates for Naivasha & Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Property Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                1. Select Property or Application:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'small-home', label: 'Bedsitter / 1-Bed Home', desc: 'Lights, TV, Wi-Fi, Phone charging' },
                  { id: 'family-home', label: '2-3 Bedroom Family Home', desc: 'Lights, TV, Fridge, Laptops, Wi-Fi' },
                  { id: 'villa', label: '4-5 Bedroom Villa / Mansion', desc: 'Full house, Fridges, Washers, Pump' },
                  { id: 'shop', label: 'Retail Shop / Cyber / Office', desc: 'Computers, POS, Lighting, CCTV' },
                  { id: 'farm', label: 'Farm / Borehole Pumping', desc: '1.5HP - 5HP Submersible Irrigation' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPropertyType(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      propertyType === item.id
                        ? 'bg-red-600 text-white border-red-500 font-bold shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[11px] mt-0.5 ${propertyType === item.id ? 'text-red-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra appliances toggles */}
            {propertyType === 'family-home' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  2. Optional Heavy Loads:
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIncludeWaterPump(!includeWaterPump)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
                      includeWaterPump
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Include 0.5HP Booster Pump (+Ksh 20,000 capacity)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Duration selector */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                3. Desired Backup Autonomy:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'evening', label: 'Day + 4hrs Night' },
                  { id: 'night', label: 'Day + Full Night (8-12hrs)' },
                  { id: 'offgrid', label: '24/7 100% Off-Grid' }
                ].map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => setBackupDuration(dur.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-center text-xs font-bold border transition-colors cursor-pointer ${
                      backupDuration === dur.id
                        ? 'bg-white text-slate-950 border-white'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sizing Results Card */}
          <div className="lg:col-span-5 bg-slate-900 border-2 border-red-600/40 p-6 rounded-2xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono font-bold text-red-400 uppercase">Estimated Configuration</span>
              </div>
              <span className="text-[10px] font-mono bg-red-600/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                Coming Soon
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">System Name:</span>
                <h3 className="text-base font-black text-white">{currentEstimate.recommendedKit}</h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Hybrid Inverter Capacity:</span>
                  <span className="font-bold text-red-400 text-sm">{currentEstimate.inverter}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Solar Array Wattage:</span>
                  <span className="font-bold text-white text-sm">{currentEstimate.panels}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Battery Bank Storage:</span>
                  <span className="font-bold text-red-300 text-sm">{currentEstimate.battery}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Powered Load Capacity:</span>
                  <span className="text-slate-300 text-xs">{currentEstimate.appliances}</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Estimated Budget Range:</span>
                  <span className="text-lg font-black text-red-400">{currentEstimate.priceRange}</span>
                </div>
              </div>

              <button
                onClick={handleSizingWhatsApp}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Register Interest for this System</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Equipment Showcase Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full uppercase">
                Planned Hardware
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-1">
              PLANNED SOLAR HARDWARE & <span className="text-red-600">EQUIPMENT</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Anticipated hardware lines for our upcoming solar venture in Naivasha.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Launch In Preparation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solarEquipmentCategories.map((eq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={eq.image}
                    alt={eq.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
                    {eq.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    Coming Soon
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors font-display">
                    {eq.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {eq.desc}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                    <span className="font-bold text-slate-900">Specs: </span>
                    {eq.specs}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setFormData({ ...formData, systemInterest: eq.title });
                    const el = document.getElementById('solar-quote-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Pre-Register Interest</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Complete Turnkey Packages */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            UPCOMING TURNKEY <span className="text-red-600">PACKAGE KITS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Planned bundled kits including panels, hybrid inverters, batteries, DC cabling, and installation support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {turnkeyPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl border-2 transition-all p-6 flex flex-col justify-between space-y-6 ${
                pkg.popular
                  ? 'border-red-600 shadow-xl relative'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-md">
                  Planned Popular Kit
                </span>
              )}

              <div className="space-y-4">
                <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-red-600 block">
                    {pkg.rating} • COMING SOON
                  </span>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    <strong className="text-slate-800">Ideal for:</strong> {pkg.idealFor}
                  </p>
                </div>

                <div className="py-2 border-y border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Projected Budget</span>
                  <span className="text-xl font-black text-slate-950">{pkg.price}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">Kit Inclusions:</span>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    const msg = `Hello Denlight Solar Solutions, I want to register early interest for the ${pkg.name} (${pkg.price}) for my home/business in Naivasha.`;
                    onOpenWhatsApp(msg, solarContactPhone);
                  }}
                  className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    pkg.popular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-slate-900 hover:bg-red-600 text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Register Interest via WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Pre-Launch Interest & Consultation Form */}
      <section id="solar-quote-form" className="bg-gradient-to-br from-red-50 via-slate-50 to-white text-slate-900 rounded-3xl p-6 sm:p-10 border-2 border-red-600/20 space-y-8 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 text-xs font-mono font-bold uppercase">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Pre-Launch Interest Registration</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
            REGISTER YOUR SOLAR <span className="text-red-600">INTEREST & INQUIRIES</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Tell us about your property and power backup needs. We will reach out with early bird consultation details and launch updates in Naivasha.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 text-xs shadow-md">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Your Full Name / Business:
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Samuel Kariuki / Green View Farm"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Phone Number / WhatsApp:
              </label>
              <input
                type="text"
                required
                value={formData.phoneOrEmail}
                onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                placeholder="e.g. +254 712 124 922"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Location in Kenya:
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Naivasha Town / Moi South Lake"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                System Interested In:
              </label>
              <select
                value={formData.systemInterest}
                onChange={(e) => setFormData({ ...formData, systemInterest: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Family Home 3kVA Hybrid Solar System">3kVA Family Home Hybrid System</option>
                <option value="Executive Villa 5kVA Solar System">5kVA Villa / Off-Grid Solar System</option>
                <option value="Essential 1kVA Home Solar Kit">1kVA Essential Home Kit</option>
                <option value="Solar Water Heating System (150L-300L)">Solar Water Heating (150L - 300L)</option>
                <option value="Solar Borehole & Farm Water Pumping">Solar Borehole & Irrigation Pumping</option>
                <option value="Solar Streetlights & Security Lighting">Solar Streetlights & Security Lighting</option>
                <option value="Custom Solar Installation Proposal">Custom Engineered System</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
                Estimated Budget:
              </label>
              <select
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="KES 50,000 - 100,000">KES 50,000 - 100,000</option>
                <option value="KES 100,000 - 200,000">KES 100,000 - 200,000</option>
                <option value="KES 200,000 - 400,000">KES 200,000 - 400,000</option>
                <option value="Above KES 400,000">Above KES 400,000 (Commercial/Off-Grid)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-mono font-bold uppercase mb-1.5">
              Specific Needs, Appliances or Power Outage Issues:
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. We experience frequent KPLC blackouts on South Lake road. We want to run 1 fridge, lights, TV, and water pump when solar launches..."
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
                  <span>Register Interest via WhatsApp ({solarContactPhoneDisplay})</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${solarContactEmail}?subject=${encodeURIComponent(`Solar Pre-Launch Inquiry: ${formData.systemInterest}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nContact: ${formData.phoneOrEmail}\nLocation: ${formData.location}\nSystem: ${formData.systemInterest}\nBudget: ${formData.estimatedBudget}\n\nDetails:\n${formData.notes}`)}`}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Email Inquiry</span>
            </a>
          </div>

        </form>
      </section>

    </div>
  );
};
