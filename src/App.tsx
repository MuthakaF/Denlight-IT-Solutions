import { useState, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductCatalog } from './components/ProductCatalog';
import { SoftwareServicesSection } from './components/SoftwareServicesSection';
import { FinancingSection } from './components/FinancingSection';
import { ServicePortal } from './components/ServicePortal';
import { ContactSection } from './components/ContactSection';
import { SolarSection } from './components/SolarSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PhoneCompareModal } from './components/PhoneCompareModal';
import { AdminProductManager } from './components/AdminProductManager';
import { SuperAdminModal } from './components/SuperAdminModal';
import { Toast } from './components/Toast';
import { PhoneProduct, FinancingPartnerId } from './types';
import { sanitizeSearchInput } from './utils/sanitizeInput';
import { syncWithSupabase, subscribeToProductImageChanges } from './utils/imageStorage';
import { applyTheme, getStoredTheme } from './utils/themeManager';
import { addAuditLog } from './utils/analyticsRealtimeManager';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [laptopCondition, setLaptopCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<PhoneProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<PhoneProduct[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Initial theme initialization
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  // Initial Supabase database synchronization and realtime subscriptions
  useEffect(() => {
    // 1. Fetch persistent image URLs from Supabase `products` table
    syncWithSupabase();

    // 2. Subscribe to live changes
    const unsubscribe = subscribeToProductImageChanges();

    // 3. Check URL hash / search params for admin portal
    const handleUrlCheck = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || path === '/admin' || params.get('admin') === 'true') {
        setActiveTab('admin');
      }
    };
    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);

  const handleOpenWhatsApp = (customText?: string, phoneNumber?: string) => {
    const phone = phoneNumber || '254712124922';
    const text = customText || 'Hello Denlight IT Solutions, I want to inquire about products at Kariuki Chotara road shop, Naivasha.';
    const encoded = encodeURIComponent(text);

    // Record realtime audit log for customer engagement
    addAuditLog({
      actor: 'Store Visitor',
      role: 'Customer Lead',
      action: 'SYSTEM_ALERT',
      target: 'WhatsApp Sales Channel',
      details: `Customer initiated WhatsApp inquiry: "${text.slice(0, 55)}..."`,
      ipAddress: '197.232.84.14 (Kenya)',
      severity: 'info'
    });

    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleSearch = (query: string) => {
    const cleanQuery = sanitizeSearchInput(query);
    setSearchQuery(cleanQuery);
    setCatalogCategory('all');
    setLaptopCondition('all');
    setActiveTab('catalog');
    
    // Scroll smoothly to catalog
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleNavigateTab = (tabId: string) => {
    if (tabId === 'smartphones') {
      setCatalogCategory('smartphones');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'laptops' || tabId === 'laptops-desktops') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'printers' || tabId === 'printers-toners') {
      setCatalogCategory('printers-toners');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'accessories' || tabId === 'oraimo-accessories') {
      setCatalogCategory('oraimo-accessories');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'cctv' || tabId === 'networking-cctv') {
      setCatalogCategory('networking-cctv');
      setLaptopCondition('all');
      setActiveTab('catalog');
    } else if (tabId === 'ex-uk') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('ex-uk');
      setActiveTab('catalog');
    } else if (tabId === 'new-laptops') {
      setCatalogCategory('laptops-desktops');
      setLaptopCondition('new');
      setActiveTab('catalog');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleToggleCompare = (product: PhoneProduct) => {
    const exists = comparedProducts.some((p) => p.id === product.id);
    if (exists) {
      setComparedProducts((prev) => prev.filter((p) => p.id !== product.id));
      setToastMessage(`Removed ${product.name} from comparison.`);
    } else {
      if (comparedProducts.length >= 3) {
        setToastMessage('You can compare up to 3 devices at a time.');
        return;
      }
      setComparedProducts((prev) => [...prev, product]);
      setToastMessage(`Added ${product.name} to comparison list.`);
    }
  };

  const handleSelectPartnerFromFinancing = (partnerId: FinancingPartnerId) => {
    setActiveTab('catalog');
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={handleNavigateTab}
      currentCatalogCategory={catalogCategory}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      compareCount={comparedProducts.length}
      onOpenCompareModal={() => setIsCompareModalOpen(true)}
      onOpenWhatsApp={handleOpenWhatsApp}
      onSelectProduct={(p) => setSelectedProductForModal(p)}
      onOpenSuperAdmin={() => setIsSuperAdminModalOpen(true)}
    >
      {/* View Switching */}
      {activeTab === 'overview' && (
        <DashboardOverview
          onNavigateTab={handleNavigateTab}
          onSelectProduct={(p) => setSelectedProductForModal(p)}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'catalog' && (
        <ProductCatalog
          initialCategory={catalogCategory}
          initialLaptopCondition={laptopCondition}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
          onSelectProduct={(p) => setSelectedProductForModal(p)}
          onToggleCompare={handleToggleCompare}
          comparedProducts={comparedProducts}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'software-services' && (
        <SoftwareServicesSection
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'financing' && (
        <FinancingSection
          onSelectPartner={handleSelectPartnerFromFinancing}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'services' && (
        <ServicePortal
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'solar' && (
        <SolarSection
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'location' && (
        <ContactSection
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {activeTab === 'admin' && (
        <AdminProductManager
          onClose={() => setActiveTab('overview')}
        />
      )}

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {isCompareModalOpen && (
        <PhoneCompareModal
          products={comparedProducts}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={(p) => handleToggleCompare(p)}
          onClearAll={() => setComparedProducts([])}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      {/* SuperAdmin Modal */}
      <SuperAdminModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        onProductUpdated={() => setToastMessage('SuperAdmin update applied immediately to the website!')}
      />

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={() => handleOpenWhatsApp('Hello Denlight IT Solutions Naivasha, I need assistance.')}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full border border-blue-400/30 shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Chat"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold tracking-wide pl-0 group-hover:pl-2">
          WhatsApp Naivasha
        </span>
      </button>

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

    </DashboardLayout>
  );
}
