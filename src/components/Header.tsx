import React, { useState, useEffect } from 'react';
import { sanitizeSearchInput } from '../utils/sanitizeInput';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Menu,
  X,
  Smartphone,
  Wrench,
  ShieldCheck,
  ChevronRight,
  Search,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Sun
} from 'lucide-react';
import { DenlightLogo } from './DenlightLogo';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenWhatsApp: (customText?: string) => void;
  compareCount: number;
  onOpenCompareModal: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenWhatsApp,
  compareCount,
  onOpenCompareModal,
  onSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'catalog', label: 'Shop All', icon: Smartphone },
    { id: 'financing', label: 'Lipa Mdogo Mdogo', icon: ShieldCheck },
    { id: 'services', label: 'Service & Repair Lab', icon: Wrench },
    { id: 'contact', label: 'Naivasha Store', icon: MapPin },
    { id: 'solar', label: 'Solar (Coming Soon)', icon: Sun },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTriggerSearch = () => {
    const clean = sanitizeSearchInput(searchQuery);
    if (onSearch) {
      onSearch(clean);
    } else {
      handleNavClick('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      
      {/* Top Electro Announcement Bar */}
      <div className="bg-[#0B132B] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-6 flex-wrap text-[11px] font-medium">
            <span className="inline-flex items-center gap-1.5 text-slate-200">
              <span className="text-red-500">📍</span> Naivasha Shop: Kariuki Chotara Rd, next to Naivas ndogo • Inquire Stock
            </span>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-200">
              <span className="text-red-500">🏷️</span> Lipa Mdogo Mdogo Deposit Plans Supported
            </span>
            <span className="hidden lg:inline-block text-slate-700">|</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-200">
              <span className="text-emerald-400">🔄</span> Official Warranties & On-Site Tech Repairs
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+254712124922"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-red-400 transition-colors font-medium"
              title="Sales & Lipa Mdogo Mdogo"
            >
              <Phone className="w-3 h-3 text-red-500" />
              Sales & Lipa Mdogo: +254 712 124 922
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href="tel:+254719798972"
              className="hidden lg:inline-flex items-center gap-1.5 text-slate-200 hover:text-red-400 transition-colors font-medium"
              title="Tech Lab, Repairs & Networking"
            >
              <Phone className="w-3 h-3 text-red-500" />
              Tech Lab: +254 719 798 972
            </a>
            <button
              onClick={() => onOpenWhatsApp('Hello Denlight IT Solutions, I want to inquire about store products.')}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp Us
            </button>
          </div>

        </div>
      </div>

      {/* Main Electro Header Nav */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-3'
            : 'bg-white border-b border-slate-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('catalog')}
            className="flex items-center gap-3 group text-left focus:outline-none shrink-0 cursor-pointer"
          >
            <DenlightLogo variant="dark" size="md" />
          </button>

          {/* Search Input Bar (Electro Style) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search laptops, toners, cameras, phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(sanitizeSearchInput(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTriggerSearch();
                }}
                className="w-full bg-slate-100 border border-slate-300 rounded-full py-2.5 pl-4 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              />
              <button
                onClick={handleTriggerSearch}
                className="absolute right-1.5 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                title="Search Products"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {compareCount > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="relative inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
                <span>Compare</span>
                <span className="bg-red-600 text-white w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              </button>
            )}

            <button
              onClick={() => onOpenWhatsApp('Hello Denlight IT Solutions, I want to inquire about products in Naivasha.')}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-full text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span>Inquire via WhatsApp</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-black hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search */}
          <div className="relative w-full flex items-center mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(sanitizeSearchInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTriggerSearch();
              }}
              className="w-full bg-slate-100 border border-slate-300 rounded-full py-2 pl-4 pr-10 text-xs text-slate-900"
            />
            <button
              onClick={handleTriggerSearch}
              className="absolute right-1 p-1.5 rounded-full bg-red-600 text-white cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsApp('Hi Denlight, I need assistance at Kariuki Chotara road shop, Naivasha.');
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-full text-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </button>
            <a
              href="tel:+254712124922"
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-black font-medium py-2.5 rounded-full text-xs border border-slate-300"
            >
              <Phone className="w-4 h-4 text-slate-700" />
              Call Shop
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
