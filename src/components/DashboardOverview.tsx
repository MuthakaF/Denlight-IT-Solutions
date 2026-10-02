import React, { useState, useEffect } from 'react';
import { PHONE_PRODUCTS } from '../data/phones';
import {
  getEffectiveProducts,
  getSectionsConfig,
  getEffectiveCustomSections,
  getSiteSettings
} from '../utils/superAdminManager';
import { PhoneProduct, FinancingPartnerId } from '../types';
import { getProductImageUrl, hasCustomProductImage } from '../utils/imageStorage';
import { DeviceGraphic } from './DeviceGraphic';
import { Hero } from './Hero';
import { CustomDynamicSection } from './CustomDynamicSection';
import {
  Smartphone,
  ShieldCheck,
  Wrench,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Camera,
  Search,
  Zap,
  ShoppingBag,
  ExternalLink,
  Laptop,
  Printer,
  BatteryCharging,
  Video,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Lock,
  Tag,
  Headset,
  Globe,
  Sun
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectProduct: (product: PhoneProduct) => void;
  onOpenWhatsApp: (text?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onSelectProduct,
  onOpenWhatsApp
}) => {
  // Deposit calculator state
  const [calcBrand, setCalcBrand] = useState<'samsung' | 'tecno' | 'infinix' | 'itel' | 'oppo' | 'zte' | 'xiaomi'>('samsung');
  const [calcPartner, setCalcPartner] = useState<FinancingPartnerId>('watu');

  // Wishlist state for hearts
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [allProducts, setAllProducts] = useState<PhoneProduct[]>(getEffectiveProducts);
  const [sectionsConfig, setSectionsConfig] = useState(getSectionsConfig);
  const [siteSettings, setSiteSettings] = useState(getSiteSettings);

  useEffect(() => {
    const handleUpdate = () => {
      setAllProducts(getEffectiveProducts());
      setSectionsConfig(getSectionsConfig());
      setSiteSettings(getSiteSettings());
    };
    window.addEventListener('denlight-content-updated', handleUpdate);
    window.addEventListener('denlight-sections-updated', handleUpdate);
    window.addEventListener('denlight-site-settings-updated', handleUpdate);
    window.addEventListener('custom-images-updated', handleUpdate);
    return () => {
      window.removeEventListener('denlight-content-updated', handleUpdate);
      window.removeEventListener('denlight-sections-updated', handleUpdate);
      window.removeEventListener('denlight-site-settings-updated', handleUpdate);
      window.removeEventListener('custom-images-updated', handleUpdate);
    };
  }, []);

  const customTopSections = getEffectiveCustomSections('top');
  const customMiddleSections = getEffectiveCustomSections('middle');
  const customBottomSections = getEffectiveCustomSections('bottom');

  const exUsIphones = allProducts.filter((p) => p.brand === 'Apple');
  const bestSellerProducts = allProducts.filter((p) => p.bestSeller || p.featured).slice(0, 8);

  const categories = [
    { id: 'smartphones', name: 'Smartphones', sub: 'iPhones, Samsung, Tecno', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', sub: 'Ex-UK & Brand New', icon: Laptop },
    { id: 'printers', name: 'Printers & Inks', sub: 'Toners & Epson 103', icon: Printer },
    { id: 'accessories', name: 'Accessories', sub: 'Oraimo & Powerbanks', icon: ShoppingBag },
    { id: 'cctv', name: 'Smart CCTV', sub: 'Imou Wi-Fi Cameras', icon: Video },
    { id: 'software-services', name: 'Software Services', sub: 'Web, POS, Mobile Apps', icon: Globe },
    { id: 'solar', name: 'Solar Power', sub: 'Coming Soon • Future Venture', icon: Sun },
  ];

  const brandLogos = [
    { name: 'APPLE', badge: 'Ex-US iPhones' },
    { name: 'HP', badge: 'Laptops & Toners' },
    { name: 'SAMSUNG', badge: 'WATU Simu Exclusive' },
    { name: 'TECNO', badge: 'OnFon & MOGO' },
    { name: 'INFINIX', badge: 'OnFon & MOGO' },
    { name: 'ORAIMO', badge: 'Airpods & Watches' },
    { name: 'EPSON', badge: '103 EcoTank Inks' },
    { name: 'MERCURY', badge: 'UPS & Blowers' },
    { name: 'IMOU', badge: 'Smart Cameras' },
    { name: 'INNOVIA', badge: 'A3 Laminators' },
    { name: 'LOGITECH', badge: 'Mice & Keyboards' },
    { name: 'WATU', badge: 'Financing Partner' },
    { name: 'ONFON', badge: 'Financing Partner' },
    { name: 'MOGO', badge: 'Financing Partner' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* SuperAdmin Custom Sections (Top Position) */}
      {customTopSections.map((sec) => (
        <CustomDynamicSection
          key={sec.id}
          section={sec}
          onNavigateTab={onNavigateTab}
          onOpenWhatsApp={onOpenWhatsApp}
        />
      ))}

      {/* Hero Showcase Banner */}
      {sectionsConfig.hero && (
        <Hero onNavigate={onNavigateTab} onOpenWhatsApp={onOpenWhatsApp} />
      )}

      {/* 1. Category Quick Pill Cards */}
      {sectionsConfig.categories && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
              Explore <span className="text-red-600">Categories</span>
            </h2>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateTab(cat.id)}
                className="bg-slate-100/90 hover:bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-red-600 hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-2 pr-2">
                  <div className="p-2.5 rounded-xl bg-white shadow-2xs text-slate-900 group-hover:text-red-600 transition-colors w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{cat.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cat.sub}</p>
                  </div>
                </div>

                {/* Red Circular Arrow Button matching TechVerse image */}
                <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      )}

      {/* 2. Trending Best Sellers Section */}
      {sectionsConfig.trending && (
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              Trending <span className="text-red-600">Products</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Top performing electronics & devices in Naivasha shop</p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Products →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellerProducts.map((product) => {
            const displayImageUrl = getProductImageUrl(product.id, product.imageUrl);
            const userHasCustomImage = hasCustomProductImage(product.id);
            const isLiked = wishlist[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-red-600 hover:shadow-lg transition-all p-4 space-y-3 flex flex-col justify-between group cursor-pointer relative"
              >
                {/* Top Actions: Badge + Wishlist Heart */}
                <div className="space-y-3">
                  <div className="relative aspect-4/3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={displayImageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (product.category === 'laptops-desktops') {
                          target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
                        } else if (product.category === 'printers-toners') {
                          target.src = 'https://images.unsplash.com/photo-1612815150350-025983794b63?auto=format&fit=crop&w=800&q=80';
                        } else if (product.category === 'oraimo-accessories') {
                          target.src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80';
                        } else if (product.category === 'networking-cctv') {
                          target.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                        }
                      }}
                      className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Red Badge top left */}
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {product.badge || product.brand}
                    </span>

                    {/* Heart wishlist top right */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-red-50 border-red-300 text-red-600'
                          : 'bg-white/90 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-white'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    </button>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <div className="flex items-center text-red-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-red-500 text-red-500" />
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium">
                      ({product.rating || 4.9} • {product.reviewCount || 350})
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>
                  </div>

                  {/* Price Tag */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      {product.priceKsh ? (
                        <span className="text-base font-black text-slate-950">
                          Ksh {product.priceKsh.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">Inquire Price</span>
                      )}
                      {product.depositKsh && (
                        <span className="block text-[10px] text-red-600 font-bold">
                          Deposit from Ksh {product.depositKsh.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (Solid Red Button) */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWhatsApp(
                        `Hello Denlight IT Solutions, I want to inquire about ${product.name} at Kariuki Chotara road shop, Naivasha.`
                      );
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* SuperAdmin Custom Sections (Middle Position) */}
      {customMiddleSections.map((sec) => (
        <CustomDynamicSection
          key={sec.id}
          section={sec}
          onNavigateTab={onNavigateTab}
          onOpenWhatsApp={onOpenWhatsApp}
        />
      ))}

      {/* 3. Promo Banners Grid */}
      {sectionsConfig.iphones && (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Banner 1: Solid Vibrant RED */}
        <div className="bg-red-600 text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 shadow-md">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-900 bg-white/90 px-2.5 py-1 rounded-full font-sans">
              EXCLUSIVE DEALS
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              Exclusive Deals For You!
            </h3>
            <p className="text-xs text-red-100">Save big on Oraimo FreePods, powerbanks, laptops & WATU smartphones in Naivasha.</p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="w-fit bg-white hover:bg-slate-100 text-red-600 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Inquire Deals →
          </button>
        </div>

        {/* Banner 2: Solar Clean Energy Card (NEW - Red Theme & Coming Soon) */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 shadow-md border border-red-500/30">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-700 bg-white px-2.5 py-1 rounded-full font-mono">
              COMING SOON • FUTURE VENTURE
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              Solar & Backup Power Solutions
            </h3>
            <p className="text-xs text-red-100 font-medium">Hybrid inverters, Tier-1 solar panels & lithium batteries for zero blackouts in Naivasha.</p>
          </div>

          <button
            onClick={() => onNavigateTab('solar')}
            className="w-fit bg-slate-950 hover:bg-white hover:text-slate-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Preview Solar Venture →
          </button>
        </div>

        {/* Banner 3: Light Neutral Card */}
        <div className="bg-slate-100 text-slate-900 p-6 rounded-3xl border border-slate-200 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-2xs">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
              SMART LIVING
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
              Smart CCTV & UPS Power
            </h3>
            <p className="text-xs text-slate-600">Imou Wi-Fi Cameras, Mercury Maverick UPS & Full CCTV Installations.</p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="w-fit bg-slate-900 hover:bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Explore Security →
          </button>
        </div>

        {/* Banner 4: Dark Card */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-md">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
              OFFICE DEALS
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              HP Laptops & Laserjet Toners
            </h3>
            <p className="text-xs text-slate-300">HP ProBook convertible laptops, 201A toners & Innovia A3 laminators.</p>
          </div>

          <button
            onClick={() => onNavigateTab('catalog')}
            className="w-fit bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Inquire Laptops →
          </button>
        </div>

      </section>
      )}

      {/* 4. Lipa Mdogo Mdogo Deposit Calculator & Requirements */}
      {sectionsConfig.financingPromo && (
      <section className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Naivasha Store Smartphone Financing</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            LIPA MDOGO MDOGO ESTIMATOR
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get a brand new smartphone today at <strong className="text-white">Denlight IT Solutions on Kariuki Chotara road</strong>. Check partner rules and initial deposit terms before coming to the counter:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-red-400 font-bold block">WATU Simu</span>
              <span className="text-slate-400 text-[10px]">Samsung Galaxy A07 Exclusive</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-red-400 font-bold block">OnFon Mobile</span>
              <span className="text-slate-400 text-[10px]">Tecno, Infinix, Oppo, Itel, ZTE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-red-400 font-bold block">MOGO Kenya</span>
              <span className="text-slate-400 text-[10px]">Oppo, Tecno, Infinix, Itel</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 uppercase font-bold mb-1">Select Phone Brand:</label>
            <select
              value={calcBrand}
              onChange={(e) => {
                const b = e.target.value as any;
                setCalcBrand(b);
                if (b === 'samsung') setCalcPartner('watu');
                else setCalcPartner('onfon');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500 font-bold"
            >
              <option value="samsung">Samsung (Galaxy A07 - Ksh 3,500 Deposit)</option>
              <option value="tecno">Tecno (Spark 20 Pro - Ksh 4,800 Deposit)</option>
              <option value="infinix">Infinix (Hot 40 Pro - Ksh 5,000 Deposit)</option>
              <option value="oppo">Oppo (A18 128GB - Ksh 3,800 Deposit)</option>
              <option value="itel">Itel (A70 128GB - Ksh 2,800 Deposit)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-red-400 font-bold uppercase block text-[11px]">Required Documents at Naivasha Shop:</span>
            <ul className="space-y-1 text-slate-300 text-[10px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                <span>Original Kenyan National ID Card</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                <span>Registered M-Pesa SIM line</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                <span>Initial Deposit paid at store counter</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('financing')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Financing Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>
      )}

      {/* 5. Guarantee & Trust Strip */}
      {sectionsConfig.brandLogos && (
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Naivasha Store Visit</h4>
            <p className="text-[11px] text-slate-500">{siteSettings.storeAddress || 'Kariuki Chotara Rd Shop'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Secure Payments</h4>
            <p className="text-[11px] text-slate-500">M-Pesa & Lipa Mdogo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">30-Day Warranty</h4>
            <p className="text-[11px] text-slate-500">100% Genuine Devices</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 shrink-0">
            <Headset className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct Support</h4>
            <p className="text-[11px] text-slate-500">{siteSettings.phoneSalesDisplay || '+254 712 124 922'}</p>
          </div>
        </div>

      </section>
      )}

      {/* SuperAdmin Custom Sections (Bottom Position) */}
      {customBottomSections.map((sec) => (
        <CustomDynamicSection
          key={sec.id}
          section={sec}
          onNavigateTab={onNavigateTab}
          onOpenWhatsApp={onOpenWhatsApp}
        />
      ))}

    </div>
  );
};

