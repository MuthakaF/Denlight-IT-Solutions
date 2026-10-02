import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DenlightLogo } from './DenlightLogo';
import { Footer } from './Footer';
import { PHONE_PRODUCTS } from '../data/phones';
import { PhoneProduct } from '../types';
import { sanitizeSearchInput, matchProductWithSearch } from '../utils/sanitizeInput';
import { getProductImageUrl } from '../utils/imageStorage';
import {
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Wrench,
  MapPin,
  MessageSquare,
  Phone,
  Layers,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Laptop,
  Printer,
  BatteryCharging,
  Video,
  ShoppingBag,
  Search,
  User,
  Heart,
  Globe,
  Sparkles
} from 'lucide-react';

import { getEffectiveProducts, getSiteSettings, SiteGlobalSettings, isSuperAdminLoggedIn } from '../utils/superAdminManager';

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  currentCatalogCategory?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  compareCount: number;
  onOpenCompareModal: () => void;
  onOpenWhatsApp: (text?: string) => void;
  onSelectProduct?: (product: PhoneProduct) => void;
  onOpenSuperAdmin?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  currentCatalogCategory = 'all',
  searchQuery = '',
  onSearch,
  onClearSearch,
  compareCount,
  onOpenCompareModal,
  onOpenWhatsApp,
  onSelectProduct,
  onOpenSuperAdmin,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputVal, setInputVal] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [siteSettings, setSiteSettings] = useState<SiteGlobalSettings>(getSiteSettings);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(isSuperAdminLoggedIn);

  useEffect(() => {
    const handleUpdate = () => {
      setSiteSettings(getSiteSettings());
      setIsAdminLoggedIn(isSuperAdminLoggedIn());
    };
    window.addEventListener('denlight-site-settings-updated', handleUpdate);
    window.addEventListener('denlight-auth-changed', handleUpdate);
    window.addEventListener('denlight-content-updated', handleUpdate);
    return () => {
      window.removeEventListener('denlight-site-settings-updated', handleUpdate);
      window.removeEventListener('denlight-auth-changed', handleUpdate);
      window.removeEventListener('denlight-content-updated', handleUpdate);
    };
  }, []);

  // Sync input string with searchQuery prop
  useEffect(() => {
    setInputVal(searchQuery);
  }, [searchQuery]);

  // Click outside listener to close search autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = useMemo(() => sanitizeSearchInput(inputVal), [inputVal]);

  // Fast live matching preview products (up to 5 items)
  const liveSuggestions = useMemo(() => {
    if (!cleanQuery) return [];
    return getEffectiveProducts().filter((p) => matchProductWithSearch(p, cleanQuery)).slice(0, 5);
  }, [cleanQuery]);

  const menuItems = [
    { id: 'overview', label: 'Home' },
    { id: 'catalog', label: 'Shop Catalog' },
    { id: 'software-services', label: 'Software Services' },
    { id: 'financing', label: 'Lipa Mdogo' },
    { id: 'services', label: 'Tech Lab' },
    { id: 'location', label: 'Naivasha Store' },
    { id: 'solar', label: 'Solar (Coming Soon)' }
  ];

  const categoryTabs = [
    { id: 'overview', label: 'Gadgets' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'printers', label: 'Printers & Inks' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'cctv', label: 'Smart CCTV' },
    { id: 'financing', label: 'Lipa Mdogo' },
    { id: 'software-services', label: 'Software Services' },
    { id: 'solar', label: 'Solar (Coming Soon)' }
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCategoryActive = (catId: string) => {
    if (activeTab === catId) return true;
    if (activeTab === 'catalog') {
      if (catId === 'smartphones' && currentCatalogCategory === 'smartphones') return true;
      if (catId === 'laptops' && currentCatalogCategory === 'laptops-desktops') return true;
      if (catId === 'printers' && currentCatalogCategory === 'printers-toners') return true;
      if (catId === 'accessories' && currentCatalogCategory === 'oraimo-accessories') return true;
      if (catId === 'cctv' && currentCatalogCategory === 'networking-cctv') return true;
    }
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = sanitizeSearchInput(raw);
    setInputVal(clean);
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    if (onSearch) {
      onSearch(inputVal);
    }
  };

  const handleClear = () => {
    setInputVal('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleSelectSuggestion = (product: PhoneProduct) => {
    setIsFocused(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSearch) {
      onSearch(product.name);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Store Overview';
      case 'catalog':
        return 'Product & Accessories Catalog';
      case 'software-services':
        return 'Software & Digital Solutions';
      case 'solar':
        return 'Solar Power & Clean Energy Solutions';
      case 'financing':
        return 'Lipa Mdogo Mdogo Financing';
      case 'services':
        return 'Service Lab & Tech Repairs';
      case 'location':
        return 'Naivasha Store Location & Contact';
      case 'admin':
        return 'Staff / Admin Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col antialiased selection:bg-red-600 selection:text-white font-sans text-slate-900">
      
      {/* Top Announcement Bar (Configurable by SuperAdmin) */}
      {siteSettings.showAnnouncementBar && (
        <div className="bg-slate-900 text-slate-200 text-[11px] font-mono py-1.5 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="truncate">{siteSettings.announcementBarText || 'WATU, ONFON & MOGO Lipa Mdogo Plans Available Today In-Store!'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
              <span>Store: {siteSettings.storeAddress}</span>
              <span>•</span>
              <a href={`tel:+${siteSettings.phoneSales}`} className="text-white hover:text-red-400 font-bold">
                {siteSettings.phoneSalesDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Row matching TechVerse */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabChange('overview')}
              className="flex items-center gap-2 text-left focus:outline-none shrink-0 cursor-pointer"
            >
              <DenlightLogo variant="dark" size="md" />
            </button>
          </div>

          {/* Centered Wide Search Pill with Fast Live Autocomplete */}
          <div 
            ref={searchContainerRef}
            className="hidden md:block flex-1 max-w-xl mx-4 relative"
          >
            <form 
              onSubmit={handleSubmitSearch}
              className="w-full flex items-center relative"
            >
              <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                placeholder="Search laptops, Samsung A07, toners, Oraimo, WATU phones..."
                className="w-full bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium pl-5 pr-16 py-2.5 rounded-full border border-transparent focus:border-red-600 focus:outline-none transition-all shadow-2xs"
              />

              {inputVal && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-10 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Search store"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Fast Search Suggestions Autocomplete Dropdown */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                {cleanQuery ? (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Fast Search Results for "<strong className="text-slate-900">{cleanQuery}</strong>"</span>
                      <span>{liveSuggestions.length} found</span>
                    </div>

                    {liveSuggestions.length > 0 ? (
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        {liveSuggestions.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectSuggestion(prod)}
                            className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={getProductImageUrl(prod.id, prod.imageUrl)}
                                alt={prod.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                                  {prod.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                  <span className="uppercase text-red-600 font-bold">{prod.brand}</span>
                                  <span>•</span>
                                  <span>KES {prod.priceKes.toLocaleString()}</span>
                                  {prod.financing?.depositKes && (
                                    <>
                                      <span>•</span>
                                      <span className="text-emerald-600 font-semibold">Deposit KES {prod.financing.depositKes.toLocaleString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button className="text-[11px] font-bold text-red-600 group-hover:underline shrink-0">
                              View →
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={handleSubmitSearch}
                          className="w-full text-center py-2.5 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          See All Matching Products in Catalog →
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <p className="text-xs text-slate-600 font-medium">No items match "<strong className="text-slate-900">{cleanQuery}</strong>"</p>
                        <p className="text-[11px] text-slate-400">Try searching "HP", "Samsung", "Oraimo", "WATU", or "Printers"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      Popular Fast Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Samsung A07', 'HP Ex-UK Laptops', 'Epson Printers', 'WATU Simu', 'Oraimo AirBuds', 'CCTV Cameras'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setInputVal(tag);
                            if (onSearch) onSearch(tag);
                            setIsFocused(false);
                          }}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-red-500" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Links & Actions */}
          <div className="flex items-center gap-5 shrink-0 text-xs font-semibold">
            
            {/* Nav Menu Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isActive ? 'text-red-600 font-bold' : 'text-slate-700 hover:text-red-600'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="h-4 w-px bg-slate-200 hidden lg:block" />

            {/* Compare Counter */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="flex items-center gap-1.5 text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                title="Compare Products"
              >
                <Layers className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Direct WhatsApp Callout */}
            <button
              onClick={() => onOpenWhatsApp(`Hello ${siteSettings.siteName}, I want to inquire about products in Naivasha.`)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{siteSettings.headerCtaText || 'Naivasha Shop'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Category Horizontal Bar with RED Bottom Underline Active State (Matching TechVerse Header Row 2) */}
        <div className="border-t border-slate-100 bg-white px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {categoryTabs.map((cat) => {
                const isActive = isCategoryActive(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                      isActive
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-slate-700 hover:text-red-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Naivasha CBD</span>
              </span>
              <span>•</span>
              <span className="text-slate-800 font-semibold">Store Visit & Lipa Mdogo Plans</span>
            </div>

          </div>
        </div>

      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col">
          <div className="bg-white text-slate-900 p-4 border-b border-slate-200 flex items-center justify-between">
            <DenlightLogo variant="dark" size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-900 cursor-pointer"
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
          </div>

          <div className="bg-white flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Store Menu
              </span>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWhatsApp('Hello Denlight IT Solutions, I need assistance in Naivasha.');
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href="tel:+254712124922"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-2xl text-xs font-semibold border border-slate-200"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call Sales (+254 712 124 922)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Bar when inside sub-tabs */}
        {activeTab !== 'overview' && (
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
            <button
              onClick={() => handleTabChange('overview')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-red-500 group-hover:text-white transition-transform group-hover:-translate-x-1" />
              <span>Back to Store Overview</span>
            </button>

            <div className="flex items-center gap-2 text-slate-500 hidden sm:flex">
              <span>Store</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tabId) => handleTabChange(tabId)}
        onOpenWhatsApp={onOpenWhatsApp}
        onOpenSuperAdmin={onOpenSuperAdmin}
      />

      {/* SuperAdmin Quick Indicator Pill */}
      {isAdminLoggedIn && onOpenSuperAdmin && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            type="button"
            onClick={onOpenSuperAdmin}
            className="bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full border border-red-500/50 shadow-xl flex items-center gap-2 text-xs font-mono backdrop-blur-sm transition-all hover:scale-105 cursor-pointer group"
            title="SuperAdmin Mode Active - Click to Manage Website"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-red-400">SuperAdmin Active</span>
            <span className="text-slate-400 group-hover:text-white transition-colors text-[11px] underline">Edit Site</span>
          </button>
        </div>
      )}

    </div>
  );
};

