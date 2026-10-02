import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PhoneProduct, ServiceCategory } from '../types';
import {
  isSuperAdminLoggedIn,
  loginSuperAdmin,
  logoutSuperAdmin,
  getSuperAdminProfile,
  updateSuperAdminProfile,
  getSiteSettings,
  updateSiteSettings,
  resetSiteSettings,
  getSectionsConfig,
  toggleSectionVisibility,
  addCustomSection,
  deleteCustomSection,
  updateCustomSection,
  saveProductEdits,
  saveServiceEdits,
  resetProductEdits,
  resetServiceEdits,
  getEffectiveProducts,
  getEffectiveServices,
  uploadSuperAdminImage,
  SiteGlobalSettings,
  SectionsVisibilityConfig,
  CustomWebsiteSection
} from '../utils/superAdminManager';
import { matchFilenameToProductId, compressImageFile, setMemoryProductImage } from '../utils/imageStorage';
import { PlatformAnalyticsOverview } from './superadmin/PlatformAnalyticsOverview';
import { SystemHealthAlerts } from './superadmin/SystemHealthAlerts';
import { AuditLogsViewer } from './superadmin/AuditLogsViewer';
import { ThemeMode, getStoredTheme, applyTheme, toggleTheme } from '../utils/themeManager';
import { addAuditLog } from '../utils/analyticsRealtimeManager';
import {
  Lock,
  LogOut,
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  Layers,
  Image as ImageIcon,
  Wrench,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Sliders,
  FileCheck,
  Eye,
  EyeOff,
  User,
  Shield,
  Plus,
  Trash2,
  Edit3,
  Layout,
  Globe,
  Palette,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Activity,
  Bell,
  Sun,
  Moon,
  Monitor,
  BarChart3
} from 'lucide-react';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated?: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({
  isOpen,
  onClose,
  onProductUpdated
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'health' | 'audit' | 'products' | 'services' | 'bulk' | 'sections' | 'customizer' | 'profile'
  >('analytics');

  // Theme State (Dark / Light / System)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getStoredTheme);

  // --- Profile State ---
  const [profileUsername, setProfileUsername] = useState<string>('');
  const [profileDisplayName, setProfileDisplayName] = useState<string>('');
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [profileNewPassword, setProfileNewPassword] = useState<string>('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState<string>('');
  const [profileStatusMsg, setProfileStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // --- Site Settings State ---
  const [siteSettings, setSiteSettings] = useState<SiteGlobalSettings>(getSiteSettings);
  const [siteSettingsStatusMsg, setSiteSettingsStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // --- Sections Management State ---
  const [sectionsConfig, setSectionsConfig] = useState<SectionsVisibilityConfig>(getSectionsConfig);
  const [showAddSectionModal, setShowAddSectionModal] = useState<boolean>(false);
  const [newSecTitle, setNewSecTitle] = useState<string>('');
  const [newSecSubtitle, setNewSecSubtitle] = useState<string>('');
  const [newSecBadge, setNewSecBadge] = useState<string>('');
  const [newSecContent, setNewSecContent] = useState<string>('');
  const [newSecFeaturesText, setNewSecFeaturesText] = useState<string>('');
  const [newSecImageUrl, setNewSecImageUrl] = useState<string>('');
  const [newSecImageFile, setNewSecImageFile] = useState<File | null>(null);
  const [newSecButtonText, setNewSecButtonText] = useState<string>('Learn More');
  const [newSecButtonAction, setNewSecButtonAction] = useState<'whatsapp' | 'catalog' | 'financing' | 'services' | 'location'>('whatsapp');
  const [newSecPosition, setNewSecPosition] = useState<'top' | 'middle' | 'bottom'>('middle');
  const [newSecTheme, setNewSecTheme] = useState<'vibrant-red' | 'dark-slate' | 'clean-white' | 'subtle-gray'>('vibrant-red');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState<boolean>(false);
  const [sectionsStatusMsg, setSectionsStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // --- Products Tab State ---
  const [productsList, setProductsList] = useState<PhoneProduct[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState<string>('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<PhoneProduct | null>(null);
  
  // Product Form Fields
  const [productDescription, setProductDescription] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productDeposit, setProductDeposit] = useState<string>('');
  const [productImageUrlInput, setProductImageUrlInput] = useState<string>('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [productStatusMsg, setProductStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // --- Services Tab State ---
  const [servicesList, setServicesList] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [serviceTitle, setServiceTitle] = useState<string>('');
  const [serviceShortDesc, setServiceShortDesc] = useState<string>('');
  const [serviceTurnaround, setServiceTurnaround] = useState<string>('');
  const [serviceFeaturesText, setServiceFeaturesText] = useState<string>('');
  const [serviceImageUrlInput, setServiceImageUrlInput] = useState<string>('');
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const [isSavingService, setIsSavingService] = useState<boolean>(false);
  const [serviceStatusMsg, setServiceStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // --- Bulk Upload State ---
  const [bulkFiles, setBulkFiles] = useState<Array<{
    file: File;
    matchedProductId: string | null;
    status: 'pending' | 'processing' | 'done' | 'error';
    error?: string;
  }>>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState<boolean>(false);
  const [bulkStatusMsg, setBulkStatusMsg] = useState<string | null>(null);

  const productFileInputRef = useRef<HTMLInputElement>(null);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);
  const bulkFilesInputRef = useRef<HTMLInputElement>(null);
  const sectionFileInputRef = useRef<HTMLInputElement>(null);

  // Load and refresh state when modal opens
  useEffect(() => {
    if (isOpen) {
      const authed = isSuperAdminLoggedIn();
      setIsAuthenticated(authed);
      setProductsList(getEffectiveProducts());
      setServicesList(getEffectiveServices());
      setSiteSettings(getSiteSettings());
      setSectionsConfig(getSectionsConfig());

      const prof = getSuperAdminProfile();
      setProfileUsername(prof.username);
      setProfileDisplayName(prof.displayName || 'Super Admin');
      setProfileEmail(prof.email || 'admin@denlightitsolutions.co.ke');
    }
  }, [isOpen]);

  // Synchronize with external updates
  useEffect(() => {
    const handleContentUpdate = () => {
      setProductsList(getEffectiveProducts());
      setServicesList(getEffectiveServices());
      setSiteSettings(getSiteSettings());
      setSectionsConfig(getSectionsConfig());
    };
    window.addEventListener('denlight-content-updated', handleContentUpdate);

    const handleThemeChange = (e: any) => {
      if (e.detail?.theme) {
        setCurrentTheme(e.detail.theme);
      }
    };
    window.addEventListener('denlight-theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('denlight-content-updated', handleContentUpdate);
      window.removeEventListener('denlight-theme-changed', handleThemeChange);
    };
  }, []);

  const handleSelectTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    applyTheme(mode);
    addAuditLog({
      actor: profileUsername || 'SuperAdmin',
      role: 'SuperAdmin',
      action: 'THEME_CHANGE',
      target: 'UI Display Theme',
      details: `Switched dashboard & website display theme to ${mode.toUpperCase()} mode.`,
      ipAddress: '197.232.84.14 (Naivasha, KE)',
      severity: 'info'
    });
  };

  const handleToggleHeaderTheme = () => {
    const next = toggleTheme();
    setCurrentTheme(next);
  };

  // When selectedProduct changes, populate form fields
  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setProductDescription(selectedProduct.description || '');
      setProductPrice(selectedProduct.priceKsh ? selectedProduct.priceKsh.toString() : '');
      setProductDeposit(selectedProduct.depositKsh ? selectedProduct.depositKsh.toString() : '');
      setProductImageUrlInput(selectedProduct.imageUrl || '');
      setProductImageFile(null);
      setProductImagePreview(selectedProduct.imageUrl || null);
      setProductStatusMsg(null);
    }
  }, [selectedProduct]);

  // When selectedService changes, populate form fields
  useEffect(() => {
    if (selectedService) {
      setServiceTitle(selectedService.title);
      setServiceShortDesc(selectedService.shortDesc || '');
      setServiceTurnaround(selectedService.turnaroundTime || '');
      setServiceFeaturesText((selectedService.features || []).join('\n'));
      setServiceImageUrlInput(selectedService.image || '');
      setServiceImageFile(null);
      setServiceImagePreview(selectedService.image || null);
      setServiceStatusMsg(null);
    }
  }, [selectedService]);

  if (!isOpen) return null;

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginSuperAdmin(usernameInput, passwordInput);
    if (res.success) {
      setIsAuthenticated(true);
      setUsernameInput('');
      setPasswordInput('');
      setProductsList(getEffectiveProducts());
      setServicesList(getEffectiveServices());
      setSiteSettings(getSiteSettings());
      setSectionsConfig(getSectionsConfig());
      const prof = getSuperAdminProfile();
      setProfileUsername(prof.username);
    } else {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    logoutSuperAdmin();
    setIsAuthenticated(false);
    setSelectedProduct(null);
    setSelectedService(null);
  };

  // --- Profile Submit Handler ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatusMsg(null);

    if (profileNewPassword && profileNewPassword !== profileConfirmPassword) {
      setProfileStatusMsg({ success: false, text: 'New passwords do not match. Please re-enter.' });
      return;
    }

    const res = updateSuperAdminProfile(
      profileUsername,
      profileNewPassword || undefined,
      profileDisplayName,
      profileEmail
    );

    if (res.success) {
      setProfileStatusMsg({
        success: true,
        text: `SuperAdmin credentials updated successfully! You can now log in using username "${profileUsername}".`
      });
      setProfileNewPassword('');
      setProfileConfirmPassword('');
    } else {
      setProfileStatusMsg({ success: false, text: res.error || 'Failed to update credentials.' });
    }
  };

  // --- Site Settings Submit Handler ---
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteSettingsStatusMsg(null);

    const res = updateSiteSettings(siteSettings);
    if (res.success) {
      setSiteSettingsStatusMsg({
        success: true,
        text: 'Website customizations saved & applied immediately from head to footer!'
      });
    } else {
      setSiteSettingsStatusMsg({ success: false, text: res.error || 'Failed to save settings.' });
    }
  };

  const handleResetSiteSettingsToDefault = () => {
    if (confirm('Reset all website branding, headlines, and contacts back to original defaults?')) {
      resetSiteSettings();
      setSiteSettings(getSiteSettings());
      setSiteSettingsStatusMsg({ success: true, text: 'Website settings reset to defaults.' });
    }
  };

  // --- Sections Management Handlers ---
  const handleToggleDefaultSection = (sectionKey: keyof Omit<SectionsVisibilityConfig, 'customSections'>) => {
    const current = sectionsConfig[sectionKey];
    toggleSectionVisibility(sectionKey, !current);
    setSectionsConfig(getSectionsConfig());
    setSectionsStatusMsg({
      success: true,
      text: `Updated section visibility for "${sectionKey}". Applied live to website!`
    });
  };

  const handleToggleCustomSectionVisibility = (secId: string, currentEnabled: boolean) => {
    updateCustomSection(secId, { isEnabled: !currentEnabled });
    setSectionsConfig(getSectionsConfig());
  };

  const handleDeleteCustomSectionItem = (secId: string) => {
    if (confirm('Are you sure you want to permanently delete this custom section from the website?')) {
      deleteCustomSection(secId);
      setSectionsConfig(getSectionsConfig());
      setSectionsStatusMsg({ success: true, text: 'Custom section removed from website.' });
    }
  };

  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setNewSecTitle('');
    setNewSecSubtitle('');
    setNewSecBadge('');
    setNewSecContent('');
    setNewSecFeaturesText('');
    setNewSecImageUrl('');
    setNewSecImageFile(null);
    setNewSecButtonText('Learn More');
    setNewSecButtonAction('whatsapp');
    setNewSecPosition('middle');
    setNewSecTheme('vibrant-red');
    setShowAddSectionModal(true);
  };

  const handleStartEditCustomSection = (sec: CustomWebsiteSection) => {
    setEditingSectionId(sec.id);
    setNewSecTitle(sec.title);
    setNewSecSubtitle(sec.subtitle);
    setNewSecBadge(sec.badge || '');
    setNewSecContent(sec.content || '');
    setNewSecFeaturesText((sec.features || []).join('\n'));
    setNewSecImageUrl(sec.imageUrl || '');
    setNewSecImageFile(null);
    setNewSecButtonText(sec.buttonText || 'Learn More');
    setNewSecButtonAction(sec.buttonLinkType || 'whatsapp');
    setNewSecPosition(sec.position);
    setNewSecTheme(sec.theme);
    setShowAddSectionModal(true);
  };

  const handleCreateCustomSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSection(true);

    try {
      let finalImgUrl = newSecImageUrl.trim();

      if (newSecImageFile) {
        const uploadRes = await uploadSuperAdminImage(newSecImageFile, `section_${Date.now()}`);
        if (uploadRes.success && uploadRes.url) {
          finalImgUrl = uploadRes.url;
        }
      }

      const featuresArr = newSecFeaturesText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      if (editingSectionId) {
        const res = updateCustomSection(editingSectionId, {
          title: newSecTitle.trim(),
          subtitle: newSecSubtitle.trim(),
          badge: newSecBadge.trim() || undefined,
          content: newSecContent.trim() || undefined,
          features: featuresArr.length > 0 ? featuresArr : undefined,
          imageUrl: finalImgUrl || undefined,
          buttonText: newSecButtonText.trim() || undefined,
          buttonLinkType: newSecButtonAction,
          position: newSecPosition,
          theme: newSecTheme
        });

        if (res.success) {
          setSectionsConfig(getSectionsConfig());
          setShowAddSectionModal(false);
          setEditingSectionId(null);
          setSectionsStatusMsg({ success: true, text: 'Custom section updated and live on the website!' });
        } else {
          alert(res.error || 'Failed to update section');
        }
      } else {
        const res = addCustomSection({
          title: newSecTitle.trim(),
          subtitle: newSecSubtitle.trim(),
          badge: newSecBadge.trim() || undefined,
          content: newSecContent.trim() || undefined,
          features: featuresArr.length > 0 ? featuresArr : undefined,
          imageUrl: finalImgUrl || undefined,
          buttonText: newSecButtonText.trim() || undefined,
          buttonLinkType: newSecButtonAction,
          position: newSecPosition,
          theme: newSecTheme,
          isEnabled: true
        });

        if (res.success) {
          setSectionsConfig(getSectionsConfig());
          setShowAddSectionModal(false);
          setNewSecTitle('');
          setNewSecSubtitle('');
          setNewSecBadge('');
          setNewSecContent('');
          setNewSecFeaturesText('');
          setNewSecImageUrl('');
          setNewSecImageFile(null);
          setSectionsStatusMsg({ success: true, text: 'New custom section added and live on the website!' });
        } else {
          alert(res.error || 'Failed to add section');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Error saving section');
    } finally {
      setIsAddingSection(false);
    }
  };

  // --- Products Handlers ---
  const filteredProducts = productsList.filter((p) => {
    const matchSearch =
      !searchProductQuery ||
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchProductQuery.toLowerCase());
    const matchCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
    return matchSearch && matchCat;
  });

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setProductImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProductChanges = async () => {
    if (!selectedProduct) return;
    setIsSavingProduct(true);
    setProductStatusMsg(null);

    try {
      let finalImageUrl = productImageUrlInput.trim() || selectedProduct.imageUrl;

      if (productImageFile) {
        const uploadRes = await uploadSuperAdminImage(productImageFile, selectedProduct.id);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          throw new Error(uploadRes.error || 'Failed to upload photo');
        }
      }

      const res = await saveProductEdits(selectedProduct.id, {
        name: productName.trim() || selectedProduct.name,
        description: productDescription.trim(),
        imageUrl: finalImageUrl,
        priceKsh: productPrice ? Number(productPrice) : undefined,
        depositKsh: productDeposit ? Number(productDeposit) : undefined
      });

      if (res.success) {
        setProductStatusMsg({ success: true, text: `Successfully updated ${selectedProduct.name}! Changes applied to the website.` });
        setProductImageFile(null);
        setProductsList(getEffectiveProducts());
        if (onProductUpdated) onProductUpdated();
      } else {
        setProductStatusMsg({ success: false, text: res.error || 'Failed to save product edits.' });
      }
    } catch (err: any) {
      setProductStatusMsg({ success: false, text: err.message || 'Error saving product.' });
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleResetProduct = () => {
    if (!selectedProduct) return;
    if (confirm(`Reset ${selectedProduct.name} back to default original image and description?`)) {
      resetProductEdits(selectedProduct.id);
      setProductsList(getEffectiveProducts());
      const updated = getEffectiveProducts().find((p) => p.id === selectedProduct.id);
      if (updated) setSelectedProduct(updated);
      setProductStatusMsg({ success: true, text: 'Reset product back to original defaults.' });
      if (onProductUpdated) onProductUpdated();
    }
  };

  // --- Services Handlers ---
  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setServiceImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveServiceChanges = async () => {
    if (!selectedService) return;
    setIsSavingService(true);
    setServiceStatusMsg(null);

    try {
      let finalImageUrl = serviceImageUrlInput.trim() || selectedService.image;

      if (serviceImageFile) {
        const uploadRes = await uploadSuperAdminImage(serviceImageFile, `service_${selectedService.id}`);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          throw new Error(uploadRes.error || 'Failed to upload service image');
        }
      }

      const featuresArr = serviceFeaturesText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const res = saveServiceEdits(selectedService.id, {
        title: serviceTitle.trim() || selectedService.title,
        shortDesc: serviceShortDesc.trim(),
        turnaroundTime: serviceTurnaround.trim(),
        image: finalImageUrl,
        features: featuresArr
      });

      if (res.success) {
        setServiceStatusMsg({ success: true, text: `Successfully updated ${selectedService.title}! Applied live to services portal.` });
        setServiceImageFile(null);
        setServicesList(getEffectiveServices());
      } else {
        setServiceStatusMsg({ success: false, text: res.error || 'Failed to update service.' });
      }
    } catch (err: any) {
      setServiceStatusMsg({ success: false, text: err.message || 'Error saving service.' });
    } finally {
      setIsSavingService(false);
    }
  };

  const handleResetService = () => {
    if (!selectedService) return;
    if (confirm(`Reset ${selectedService.title} back to default original image and text?`)) {
      resetServiceEdits(selectedService.id);
      setServicesList(getEffectiveServices());
      const updated = getEffectiveServices().find((s) => s.id === selectedService.id);
      if (updated) setSelectedService(updated);
      setServiceStatusMsg({ success: true, text: 'Reset service back to original defaults.' });
    }
  };

  // --- Bulk Files Handlers ---
  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mapped = (files as File[]).map((file) => {
      const matchedId = matchFilenameToProductId(file.name, productsList);
      return {
        file,
        matchedProductId: matchedId,
        status: 'pending' as const
      };
    });

    setBulkFiles(mapped);
    setBulkStatusMsg(null);
  };

  const handleRunBulkApply = async () => {
    if (bulkFiles.length === 0) return;
    setIsProcessingBulk(true);
    setBulkStatusMsg(null);

    const items = [...bulkFiles];
    let successCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.matchedProductId || item.status === 'done') continue;

      item.status = 'processing';
      setBulkFiles([...items]);

      try {
        const uploadRes = await uploadSuperAdminImage(item.file, item.matchedProductId);
        if (uploadRes.success && uploadRes.url) {
          await saveProductEdits(item.matchedProductId, {
            imageUrl: uploadRes.url
          });
          item.status = 'done';
          successCount++;
        } else {
          item.status = 'error';
          item.error = uploadRes.error || 'Upload failed';
        }
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message || 'Failed';
      }

      setBulkFiles([...items]);
    }

    setIsProcessingBulk(false);
    setBulkStatusMsg(`Successfully matched and updated photos for ${successCount} products across the catalog!`);
    setProductsList(getEffectiveProducts());
    if (onProductUpdated) onProductUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                  SuperAdmin Central Console
                </h2>
                {isAuthenticated && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Logged In ({profileUsername || 'Adminn'})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Full site control: Edit profile credentials, add/remove sections, customize header to footer, edit photos & text.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Theme Toggle Button */}
            <button
              type="button"
              onClick={handleToggleHeaderTheme}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title={`Switch Theme (Current: ${currentTheme})`}
            >
              {currentTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : currentTheme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Monitor className="w-4 h-4 text-blue-400" />
              )}
              <span className="hidden sm:inline capitalize font-bold">{currentTheme}</span>
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 border border-slate-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of SuperAdmin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* Unauthenticated View: Login Form */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-300 shadow-md">
                  <span className="text-3xl font-black font-mono text-red-500">A</span>
                </div>
                <h3 className="text-xl font-bold text-white">SuperAdmin Authentication</h3>
                <p className="text-xs text-slate-400">
                  Please enter your SuperAdmin username & password to manage website content and structure.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter SuperAdmin username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 font-mono shadow-md mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In as SuperAdmin</span>
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated SuperAdmin Dashboard */
            <div className="space-y-6">
              
              {/* Comprehensive Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 p-2 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'analytics'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Analytics Overview</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('health')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'health'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>System Health & Alerts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('audit')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'audit'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Audit Logs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'products'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Products ({productsList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'services'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Services & Lab ({servicesList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('sections')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'sections'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span>Sections Manager</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('customizer')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'customizer'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Head-to-Footer Customizer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('bulk')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'bulk'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Bulk Matcher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'profile'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile & Theme</span>
                  </button>
                </div>
              </div>

              {/* --- TAB: REAL-TIME PLATFORM ANALYTICS --- */}
              {activeTab === 'analytics' && (
                <PlatformAnalyticsOverview />
              )}

              {/* --- TAB: SYSTEM HEALTH & ALERTS --- */}
              {activeTab === 'health' && (
                <SystemHealthAlerts />
              )}

              {/* --- TAB: AUDIT LOGS & EVENT TRAIL --- */}
              {activeTab === 'audit' && (
                <AuditLogsViewer />
              )}

              {/* --- TAB: PROFILE, CREDENTIALS & THEME --- */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-6">
                  <div className="pb-4 border-b border-slate-700">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-red-500" />
                      SuperAdmin Profile, Password & Theme
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your SuperAdmin login credentials and customize interface appearance with Light or Dark mode.
                    </p>
                  </div>

                  {/* Theme Mode Selector (Fulfills: enable light mode or dark mode feature in profile settings) */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-red-500" />
                        Interface Theme Mode
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Current: <strong className="text-white capitalize">{currentTheme}</strong>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans">
                      Select your preferred display style. This applies across the SuperAdmin dashboard and entire website.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* Dark Mode */}
                      <button
                        type="button"
                        onClick={() => handleSelectTheme('dark')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          currentTheme === 'dark'
                            ? 'bg-red-600/15 border-red-500 text-white shadow-md ring-1 ring-red-500/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Moon className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-red-400' : 'text-slate-500'}`} />
                          {currentTheme === 'dark' && <Check className="w-3.5 h-3.5 text-red-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold font-mono text-white">Dark Mode</div>
                          <div className="text-[10px] text-slate-400 font-sans">Sleek slate & deep contrast</div>
                        </div>
                      </button>

                      {/* Light Mode */}
                      <button
                        type="button"
                        onClick={() => handleSelectTheme('light')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          currentTheme === 'light'
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-md ring-1 ring-amber-500/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Sun className={`w-4 h-4 ${currentTheme === 'light' ? 'text-amber-400' : 'text-slate-500'}`} />
                          {currentTheme === 'light' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold font-mono text-white">Light Mode</div>
                          <div className="text-[10px] text-slate-400 font-sans">Crisp clean daytime styling</div>
                        </div>
                      </button>

                      {/* System Mode */}
                      <button
                        type="button"
                        onClick={() => handleSelectTheme('system')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          currentTheme === 'system'
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-md ring-1 ring-blue-500/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Monitor className={`w-4 h-4 ${currentTheme === 'system' ? 'text-blue-400' : 'text-slate-500'}`} />
                          {currentTheme === 'system' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold font-mono text-white">System Auto</div>
                          <div className="text-[10px] text-slate-400 font-sans">Follows device preference</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {profileStatusMsg && (
                    <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      profileStatusMsg.success
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/80 border border-red-500/50 text-red-200'
                    }`}>
                      {profileStatusMsg.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{profileStatusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                        SuperAdmin Username
                      </label>
                      <input
                        type="text"
                        required
                        value={profileUsername}
                        onChange={(e) => setProfileUsername(e.target.value)}
                        placeholder="e.g. Adminn"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                      />
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        This is the username required when pressing the grey letter "A" button.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileDisplayName}
                          onChange={(e) => setProfileDisplayName(e.target.value)}
                          placeholder="Super Admin"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="admin@denlight.co.ke"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/80 space-y-4">
                      <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                        Change Account Password
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={profileNewPassword}
                            onChange={(e) => setProfileNewPassword(e.target.value)}
                            placeholder="Leave blank to keep unchanged"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold uppercase">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={profileConfirmPassword}
                            onChange={(e) => setProfileConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md mt-4"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile & Update Credentials</span>
                    </button>
                  </form>
                </div>
              )}

              {/* --- TAB 2: SECTIONS MANAGER (ADD / REMOVE / REORDER) --- */}
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  
                  {/* Top Bar with Add Section Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layout className="w-4 h-4 text-red-500" />
                        Website Sections Manager
                      </h3>
                      <p className="text-xs text-slate-400">
                        Enable, disable, or remove any default section from the home page, or create entirely new custom sections.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddSection}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Custom Section</span>
                    </button>
                  </div>

                  {sectionsStatusMsg && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{sectionsStatusMsg.text}</span>
                    </div>
                  )}

                  {/* Built-in Website Sections Toggles */}
                  <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-4">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                      Default Website Sections Visibility
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'hero', name: 'Hero Banner & Promotions', desc: 'Main top headline, subtitle, buttons & graphics' },
                        { key: 'categories', name: 'Quick Category Grid', desc: 'Horizontal category cards with red circular arrows' },
                        { key: 'trending', name: 'Trending Best Sellers', desc: 'Top performing electronics, laptops & smartphones' },
                        { key: 'iphones', name: 'Promo Deal Banners', desc: 'Vibrant red & dark deal cards (Oraimo, Solar, Office)' },
                        { key: 'financingPromo', name: 'Lipa Mdogo Estimator Bar', desc: 'Smartphone financing calculator & terms notice' },
                        { key: 'brandLogos', name: 'Guarantee & Trust Strip', desc: '30-day warranty, shop visit, and secure payment badges' }
                      ].map((item) => {
                        const isVisible = sectionsConfig[item.key as keyof Omit<SectionsVisibilityConfig, 'customSections'>];
                        return (
                          <div
                            key={item.key}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                              isVisible
                                ? 'bg-slate-900 border-slate-700 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold truncate">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleDefaultSection(item.key as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                                isVisible
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-emerald-950 hover:text-emerald-300'
                              }`}
                            >
                              {isVisible ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Active (Shown)</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hidden (Removed)</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom User-Added Sections List */}
                  <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-4">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block flex items-center justify-between">
                      <span>Custom Added Sections ({sectionsConfig.customSections?.length || 0})</span>
                      <span className="text-[10px] text-slate-500">Live on the website</span>
                    </span>

                    {sectionsConfig.customSections && sectionsConfig.customSections.length > 0 ? (
                      <div className="space-y-3">
                        {sectionsConfig.customSections.map((sec) => (
                          <div
                            key={sec.id}
                            className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/30 font-bold">
                                  Position: {sec.position}
                                </span>
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  Theme: {sec.theme}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                              <p className="text-xs text-slate-400 line-clamp-1">{sec.subtitle}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditCustomSection(sec)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                                title="Edit Section"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-red-400" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleCustomSectionVisibility(sec.id, sec.isEnabled)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                                  sec.isEnabled
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                <span>{sec.isEnabled ? 'Visible' : 'Hidden'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCustomSectionItem(sec.id)}
                                className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 transition-colors cursor-pointer"
                                title="Delete Section"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 font-mono text-xs space-y-1">
                        <p>No custom sections created yet.</p>
                        <p className="text-[11px] text-slate-600">
                          Click "Add New Custom Section" above to publish a custom announcement banner, deal showcase, or seasonal promo.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add Custom Section Dialog / Form */}
                  {showAddSectionModal && (
                    <div className="p-5 bg-slate-900 border-2 border-red-600/50 rounded-2xl space-y-4 shadow-xl animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {editingSectionId ? (
                            <>
                              <Edit3 className="w-4 h-4 text-red-500" />
                              <span>Edit Website Section</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-red-500" />
                              <span>Create New Website Section</span>
                            </>
                          )}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddSectionModal(false);
                            setEditingSectionId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateCustomSection} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                              Section Title
                            </label>
                            <input
                              type="text"
                              required
                              value={newSecTitle}
                              onChange={(e) => setNewSecTitle(e.target.value)}
                              placeholder="e.g. Special Holiday Mega Sale"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                              Badge Label (Optional)
                            </label>
                            <input
                              type="text"
                              value={newSecBadge}
                              onChange={(e) => setNewSecBadge(e.target.value)}
                              placeholder="e.g. LIMITED OFFER / NEW ARRIVAL"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Subtitle / Brief Description
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={newSecSubtitle}
                            onChange={(e) => setNewSecSubtitle(e.target.value)}
                            placeholder="Detailed description of what you are showcasing or announcing..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Key Bullet Points / Features (One per line)
                          </label>
                          <textarea
                            rows={2}
                            value={newSecFeaturesText}
                            onChange={(e) => setNewSecFeaturesText(e.target.value)}
                            placeholder="Up to 50% discount on selected accessories&#10;Free screen protector on every smartphone&#10;Same day delivery within Naivasha"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                              Page Placement
                            </label>
                            <select
                              value={newSecPosition}
                              onChange={(e) => setNewSecPosition(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                            >
                              <option value="top">Top (Above Hero)</option>
                              <option value="middle">Middle (After Products)</option>
                              <option value="bottom">Bottom (Above Footer)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                              Visual Theme
                            </label>
                            <select
                              value={newSecTheme}
                              onChange={(e) => setNewSecTheme(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                            >
                              <option value="vibrant-red">Vibrant Red Banner</option>
                              <option value="dark-slate">Dark Slate Tech</option>
                              <option value="clean-white">Clean White</option>
                              <option value="subtle-gray">Subtle Gray</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                              Button Action
                            </label>
                            <select
                              value={newSecButtonAction}
                              onChange={(e) => setNewSecButtonAction(e.target.value as any)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                            >
                              <option value="whatsapp">Open WhatsApp</option>
                              <option value="catalog">Go to Shop Catalog</option>
                              <option value="financing">Go to Lipa Mdogo</option>
                              <option value="services">Go to Tech Repairs</option>
                              <option value="location">Go to Store Location</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                              Button Label
                            </label>
                            <input
                              type="text"
                              value={newSecButtonText}
                              onChange={(e) => setNewSecButtonText(e.target.value)}
                              placeholder="e.g. Inquire on WhatsApp"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                              Optional Photo URL
                            </label>
                            <input
                              type="url"
                              value={newSecImageUrl}
                              onChange={(e) => setNewSecImageUrl(e.target.value)}
                              placeholder="https://example.com/banner.jpg"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddSectionModal(false);
                              setEditingSectionId(null);
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={isAddingSection}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                          >
                            {isAddingSection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            <span>{editingSectionId ? 'Update Section on Website' : 'Publish Section to Website'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* --- TAB 3: HEAD-TO-FOOTER CUSTOMIZER --- */}
              {activeTab === 'customizer' && (
                <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-red-500" />
                        Website Head-to-Footer Customizer
                      </h3>
                      <p className="text-xs text-slate-400">
                        Edit website name, phone numbers, store address, hero headlines, announcement bar, and footer details.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetSiteSettingsToDefault}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Original Defaults</span>
                    </button>
                  </div>

                  {siteSettingsStatusMsg && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{siteSettingsStatusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                    
                    {/* 1. Global Brand & Contact Identity */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                        1. Brand & Contact Identity
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Website / Store Name
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettings.siteName}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Store Physical Address
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettings.storeAddress}
                            onChange={(e) => setSiteSettings({ ...siteSettings, storeAddress: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Sales & Lipa Mdogo Phone
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettings.phoneSalesDisplay}
                            onChange={(e) => {
                              const val = e.target.value;
                              const cleanDigits = val.replace(/[^0-9]/g, '');
                              setSiteSettings({
                                ...siteSettings,
                                phoneSalesDisplay: val,
                                phoneSales: cleanDigits
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Repairs & Lab Phone
                          </label>
                          <input
                            type="text"
                            required
                            value={siteSettings.phoneTechDisplay}
                            onChange={(e) => {
                              const val = e.target.value;
                              const cleanDigits = val.replace(/[^0-9]/g, '');
                              setSiteSettings({
                                ...siteSettings,
                                phoneTechDisplay: val,
                                phoneTech: cleanDigits
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Official Support Email
                          </label>
                          <input
                            type="email"
                            required
                            value={siteSettings.contactEmail}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Top Header & Announcement Bar */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                          2. Top Announcement Bar & Header Action
                        </span>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                          <input
                            type="checkbox"
                            checked={siteSettings.showAnnouncementBar}
                            onChange={(e) => setSiteSettings({ ...siteSettings, showAnnouncementBar: e.target.checked })}
                            className="rounded text-red-600 focus:ring-0"
                          />
                          <span>Show Announcement Bar</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Announcement Bar Message
                          </label>
                          <input
                            type="text"
                            value={siteSettings.announcementBarText}
                            onChange={(e) => setSiteSettings({ ...siteSettings, announcementBarText: e.target.value })}
                            placeholder="WATU, ONFON & MOGO Lipa Mdogo Available Today!"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 font-bold mb-1">
                            Header Button Text
                          </label>
                          <input
                            type="text"
                            value={siteSettings.headerCtaText}
                            onChange={(e) => setSiteSettings({ ...siteSettings, headerCtaText: e.target.value })}
                            placeholder="Naivasha Shop"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Hero Section Customization */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                        3. Hero Showcase Section Text
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Eyebrow Badge
                          </label>
                          <input
                            type="text"
                            value={siteSettings.heroEyebrow}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroEyebrow: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Main Headline First Line
                          </label>
                          <input
                            type="text"
                            value={siteSettings.heroHeadline}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Headline Red Accent Text
                          </label>
                          <input
                            type="text"
                            value={siteSettings.heroHeadlineAccent}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineAccent: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-red-400 focus:outline-none focus:border-red-500 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Hero Subtitle Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.heroSubtitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Primary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={siteSettings.heroPrimaryButtonText}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroPrimaryButtonText: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Secondary WhatsApp Button Label
                          </label>
                          <input
                            type="text"
                            value={siteSettings.heroSecondaryButtonText}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroSecondaryButtonText: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Tech Lab & Repairs Section Customization */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                        4. Tech Lab & Computer Repairs Section Headings
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Service Section Main Title
                          </label>
                          <input
                            type="text"
                            value={siteSettings.servicesHeaderTitle}
                            onChange={(e) => setSiteSettings({ ...siteSettings, servicesHeaderTitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                            Location & Badge Notice
                          </label>
                          <input
                            type="text"
                            value={siteSettings.servicesLocationNotice}
                            onChange={(e) => setSiteSettings({ ...siteSettings, servicesLocationNotice: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Service Section Subtitle Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.servicesHeaderSubtitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, servicesHeaderSubtitle: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* 5. Lipa Mdogo Financing Section Customization */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                        5. Lipa Mdogo Financing Headings & Notice
                      </span>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Financing Section Main Title
                        </label>
                        <input
                          type="text"
                          value={siteSettings.financingHeaderTitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, financingHeaderTitle: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Financing Subtitle & Terms Explanation
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.financingHeaderSubtitle}
                          onChange={(e) => setSiteSettings({ ...siteSettings, financingHeaderSubtitle: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* 6. Footer Content Customization */}
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 space-y-4">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                        6. Footer Branding & Copyright
                      </span>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Footer Brand Description
                        </label>
                        <textarea
                          rows={2}
                          value={siteSettings.footerBrandDescription}
                          onChange={(e) => setSiteSettings({ ...siteSettings, footerBrandDescription: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                          Footer Copyright Text
                        </label>
                        <input
                          type="text"
                          value={siteSettings.footerCopyrightText}
                          onChange={(e) => setSiteSettings({ ...siteSettings, footerCopyrightText: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save All Head-to-Footer Customizations & Apply Now</span>
                    </button>

                  </form>
                </div>
              )}

              {/* --- TAB 4: PRODUCTS & PHOTOS --- */}
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Product Selector */}
                  <div className="lg:col-span-5 bg-slate-800/60 rounded-2xl border border-slate-700/80 p-4 space-y-3 flex flex-col h-[580px]">
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchProductQuery}
                          onChange={(e) => setSearchProductQuery(e.target.value)}
                          placeholder="Search product name or brand..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <select
                        value={selectedProductCategory}
                        onChange={(e) => setSelectedProductCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="all">All Categories ({productsList.length})</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="laptops-desktops">Laptops & Desktops</option>
                        <option value="printers-toners">Printers & Toners</option>
                        <option value="oraimo-accessories">Oraimo & Accessories</option>
                        <option value="networking-cctv">Networking & CCTV</option>
                        <option value="ups-power">UPS & Power</option>
                        <option value="computer-peripherals">Computer Peripherals</option>
                      </select>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50 pr-1 space-y-1">
                      {filteredProducts.map((p) => {
                        const isSelected = selectedProduct?.id === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-red-600/20 border border-red-500/50 text-white'
                                : 'hover:bg-slate-700/40 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-9 h-9 object-contain bg-slate-900 rounded-lg border border-slate-700 p-0.5 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[9px] font-mono uppercase bg-slate-900 px-1 rounded text-slate-400 font-bold block truncate">
                                  {p.brand}
                                </span>
                                <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Product Editor */}
                  <div className="lg:col-span-7 bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-5">
                    {selectedProduct ? (
                      <div className="space-y-4">
                        
                        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-700">
                          <div>
                            <span className="text-[10px] font-mono uppercase bg-red-600/30 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                              {selectedProduct.category}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1">{selectedProduct.name}</h3>
                            <span className="text-[11px] font-mono text-slate-400">ID: {selectedProduct.id}</span>
                          </div>

                          <button
                            type="button"
                            onClick={handleResetProduct}
                            className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg hover:border-red-500/50 flex items-center gap-1 cursor-pointer"
                            title="Reset to default original"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Defaults</span>
                          </button>
                        </div>

                        {/* Image Preview & Changing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-900 rounded-xl p-3 border border-slate-700 space-y-2 text-center">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              Current Active Photo
                            </span>
                            <div className="aspect-square bg-slate-950 rounded-lg flex items-center justify-center p-2 border border-slate-800 overflow-hidden">
                              <img
                                src={productImagePreview || selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            {productImageFile && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                Selected file: {productImageFile.name}
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold uppercase">
                                1. Change Photo from Local File
                              </label>
                              <input
                                type="file"
                                ref={productFileInputRef}
                                onChange={handleProductFileChange}
                                accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => productFileInputRef.current?.click()}
                                className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 text-red-400" />
                                <span>{productImageFile ? 'Choose Different File' : 'Select Photo File (.jfif, .jpg, .png)'}</span>
                              </button>
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold uppercase">
                                2. Or Change Photo by Link / URL
                              </label>
                              <div className="relative">
                                <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="url"
                                  value={productImageUrlInput}
                                  onChange={(e) => {
                                    setProductImageUrlInput(e.target.value);
                                    if (e.target.value) setProductImagePreview(e.target.value);
                                  }}
                                  placeholder="https://example.com/product.jpg"
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description Editing */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-slate-300 font-bold uppercase flex items-center justify-between">
                            <span>Product Accurate Description</span>
                            <span className="text-[10px] text-slate-500">{productDescription.length} characters</span>
                          </label>
                          <textarea
                            rows={3}
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Enter detailed accurate product specs, features, and condition..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                          />
                        </div>

                        {/* Price & Name Overrides */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                              Price (KES)
                            </label>
                            <input
                              type="number"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              placeholder="Price in KES"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                              Lipa Mdogo Deposit (KES)
                            </label>
                            <input
                              type="number"
                              value={productDeposit}
                              onChange={(e) => setProductDeposit(e.target.value)}
                              placeholder="Deposit in KES"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>

                        {/* Status Message */}
                        {productStatusMsg && (
                          <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                            productStatusMsg.success
                              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                              : 'bg-red-950/80 border border-red-500/50 text-red-200'
                          }`}>
                            {productStatusMsg.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span>{productStatusMsg.text}</span>
                          </div>
                        )}

                        {/* Save Action */}
                        <button
                          type="button"
                          onClick={handleSaveProductChanges}
                          disabled={isSavingProduct}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {isSavingProduct ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Saving & Applying to Website...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Save Changes to Product & Apply Now</span>
                            </>
                          )}
                        </button>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-2">
                        <ShoppingBag className="w-10 h-10 text-slate-700" />
                        <h4 className="text-sm font-bold text-slate-300">No Product Selected</h4>
                        <p className="text-xs text-slate-500">
                          Select a product from the list on the left to change its photo, description, or pricing.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* --- TAB 5: SERVICES & REPAIRS --- */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Services List */}
                  <div className="lg:col-span-5 bg-slate-800/60 rounded-2xl border border-slate-700/80 p-4 space-y-3 flex flex-col h-[580px]">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Select Shop Service to Edit
                    </span>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50 pr-1 space-y-1">
                      {servicesList.map((s) => {
                        const isSelected = selectedService?.id === s.id;
                        return (
                          <div
                            key={s.id}
                            onClick={() => setSelectedService(s)}
                            className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-red-600/20 border border-red-500/50 text-white'
                                : 'hover:bg-slate-700/40 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={s.image}
                                alt={s.title}
                                className="w-10 h-10 object-cover bg-slate-900 rounded-lg border border-slate-700 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
                                <span className="text-[10px] text-slate-400 font-mono block truncate">
                                  {s.turnaroundTime}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Service Editor */}
                  <div className="lg:col-span-7 bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-5">
                    {selectedService ? (
                      <div className="space-y-4">
                        
                        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-700">
                          <div>
                            <h3 className="text-base font-bold text-white">{selectedService.title}</h3>
                            <span className="text-[11px] font-mono text-slate-400">Service ID: {selectedService.id}</span>
                          </div>

                          <button
                            type="button"
                            onClick={handleResetService}
                            className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg hover:border-red-500/50 flex items-center gap-1 cursor-pointer"
                            title="Reset to default original"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Defaults</span>
                          </button>
                        </div>

                        {/* Service Image */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-900 rounded-xl p-3 border border-slate-700 space-y-2 text-center">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              Service Image Preview
                            </span>
                            <div className="h-32 bg-slate-950 rounded-lg flex items-center justify-center p-2 border border-slate-800 overflow-hidden">
                              <img
                                src={serviceImagePreview || selectedService.image}
                                alt={selectedService.title}
                                className="max-h-full max-w-full object-cover rounded"
                              />
                            </div>
                            {serviceImageFile && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                Selected: {serviceImageFile.name}
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold uppercase">
                                1. Upload Service Photo File
                              </label>
                              <input
                                type="file"
                                ref={serviceFileInputRef}
                                onChange={handleServiceFileChange}
                                accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => serviceFileInputRef.current?.click()}
                                className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 text-red-400" />
                                <span>{serviceImageFile ? 'Choose Different File' : 'Select Photo File'}</span>
                              </button>
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold uppercase">
                                2. Or Paste Image Link / URL
                              </label>
                              <div className="relative">
                                <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="url"
                                  value={serviceImageUrlInput}
                                  onChange={(e) => {
                                    setServiceImageUrlInput(e.target.value);
                                    if (e.target.value) setServiceImagePreview(e.target.value);
                                  }}
                                  placeholder="https://example.com/service.jpg"
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Title & Turnaround */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                              Service Title
                            </label>
                            <input
                              type="text"
                              value={serviceTitle}
                              onChange={(e) => setServiceTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                              Turnaround Time
                            </label>
                            <input
                              type="text"
                              value={serviceTurnaround}
                              onChange={(e) => setServiceTurnaround(e.target.value)}
                              placeholder="e.g. 1 to 24 Hours"
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>

                        {/* Short Description */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 font-bold uppercase mb-1">
                            Service Short Description
                          </label>
                          <textarea
                            rows={3}
                            value={serviceShortDesc}
                            onChange={(e) => setServiceShortDesc(e.target.value)}
                            placeholder="Description of this service..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                          />
                        </div>

                        {/* Features / Scope (1 per line) */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 font-bold uppercase mb-1">
                            Scope of Service Features (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={serviceFeaturesText}
                            onChange={(e) => setServiceFeaturesText(e.target.value)}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono leading-relaxed"
                          />
                        </div>

                        {/* Status Message */}
                        {serviceStatusMsg && (
                          <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                            serviceStatusMsg.success
                              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                              : 'bg-red-950/80 border border-red-500/50 text-red-200'
                          }`}>
                            {serviceStatusMsg.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span>{serviceStatusMsg.text}</span>
                          </div>
                        )}

                        {/* Save Action */}
                        <button
                          type="button"
                          onClick={handleSaveServiceChanges}
                          disabled={isSavingService}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {isSavingService ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Saving Service Changes...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Save Changes to Service & Apply Now</span>
                            </>
                          )}
                        </button>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-2">
                        <Wrench className="w-10 h-10 text-slate-700" />
                        <h4 className="text-sm font-bold text-slate-300">No Service Selected</h4>
                        <p className="text-xs text-slate-500">
                          Select a service from the left list to modify its image, description, or turnaround time.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* --- TAB 6: BULK PHOTO MATCHER --- */}
              {activeTab === 'bulk' && (
                <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-5 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-red-500" />
                        Bulk Photo Matcher & Batch Applier
                      </h3>
                      <p className="text-xs text-slate-400">
                        Select multiple device photo files all at once (e.g. <code className="text-slate-300">Samsung A06.jpg</code>, <code className="text-slate-300">iPhone 12.jfif</code>, <code className="text-slate-300">Innovia A3.png</code>). The system matches them with names of catalog products and applies all photos at once.
                      </p>
                    </div>

                    <div>
                      <input
                        type="file"
                        ref={bulkFilesInputRef}
                        onChange={handleBulkFilesChange}
                        multiple
                        accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => bulkFilesInputRef.current?.click()}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Select Many Photos at Once</span>
                      </button>
                    </div>
                  </div>

                  {bulkStatusMsg && (
                    <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{bulkStatusMsg}</span>
                    </div>
                  )}

                  {bulkFiles.length > 0 ? (
                    <div className="space-y-4">
                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-700/60 bg-slate-900/80 rounded-xl border border-slate-700 p-2">
                        {bulkFiles.map((item, idx) => {
                          const matchedProduct = productsList.find((p) => p.id === item.matchedProductId);
                          return (
                            <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs font-mono">
                              <div className="min-w-0">
                                <span className="text-slate-200 font-bold block truncate">{item.file.name}</span>
                                <span className="text-[10px] text-slate-500">
                                  Size: {(item.file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {matchedProduct ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 text-[11px] font-bold">
                                      ✓ Matched: <strong className="text-white">{matchedProduct.name}</strong>
                                    </span>
                                  </div>
                                ) : (
                                  <select
                                    value={item.matchedProductId || ''}
                                    onChange={(e) => {
                                      const newItems = [...bulkFiles];
                                      newItems[idx].matchedProductId = e.target.value || null;
                                      setBulkFiles(newItems);
                                    }}
                                    className="bg-slate-800 border border-amber-500/50 text-amber-300 text-[11px] rounded-lg px-2 py-1 max-w-[200px]"
                                  >
                                    <option value="">-- Match manually --</option>
                                    {productsList.map((p) => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                  </select>
                                )}

                                {item.status === 'processing' && (
                                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 flex items-center gap-1 text-[10px]">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                                  </span>
                                )}
                                {item.status === 'done' && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                                    ✓ Applied Live
                                  </span>
                                )}
                                {item.status === 'error' && (
                                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px]" title={item.error}>
                                    ✕ {item.error || 'Failed'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={handleRunBulkApply}
                        disabled={isProcessingBulk || bulkFiles.filter((b) => b.matchedProductId && b.status !== 'done').length === 0}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isProcessingBulk ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Applying All Matched Photos to Website...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Apply All Matched Photos to Website ({bulkFiles.filter((b) => b.matchedProductId && b.status !== 'done').length} Items)</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 space-y-2 font-mono text-xs">
                      <p>No bulk photo files selected yet.</p>
                      <p className="text-[11px] text-slate-600">
                        Click "Select Many Photos at Once" to pick an entire set of photos from your computer.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
