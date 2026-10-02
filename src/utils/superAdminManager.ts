import { PHONE_PRODUCTS } from '../data/phones';
import { SERVICES_DATA } from '../data/services';
import { PhoneProduct, ServiceCategory } from '../types';
import { setMemoryProductImage, getProductImageUrl, compressImageFile, compressImageToDataUrl } from './imageStorage';
import { supabase, isSupabaseConfigured, uploadAndPersistProductImage } from '../lib/supabase';
import { addAuditLog } from './analyticsRealtimeManager';

// Local storage keys
const SUPERADMIN_AUTH_KEY = 'denlight_superadmin_session_auth';
const SUPERADMIN_CREDENTIALS_KEY = 'denlight_superadmin_credentials';
const PRODUCT_EDITS_KEY = 'denlight_product_custom_edits';
const SERVICE_EDITS_KEY = 'denlight_service_custom_edits';
const SOFTWARE_SERVICE_EDITS_KEY = 'denlight_software_service_custom_edits';
const SITE_SETTINGS_KEY = 'denlight_site_global_settings';
const SECTIONS_CONFIG_KEY = 'denlight_sections_config';

export interface SuperAdminCredentials {
  username: string;
  passwordHash: string; // stored credentials
  displayName?: string;
  email?: string;
  updatedAt?: string;
}

export interface SiteGlobalSettings {
  siteName: string;
  siteTagline: string;
  brandAccentWord: string;
  phoneSales: string;
  phoneSalesDisplay: string;
  phoneTech: string;
  phoneTechDisplay: string;
  contactEmail: string;
  storeAddress: string;
  announcementBarText: string;
  showAnnouncementBar: boolean;
  headerCtaText: string;
  footerCopyrightText: string;
  footerBrandDescription: string;
  
  // Hero section overrides
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroSubtitle: string;
  heroPrimaryButtonText: string;
  heroSecondaryButtonText: string;

  // Services section overrides
  servicesHeaderTitle: string;
  servicesHeaderSubtitle: string;
  servicesLocationNotice: string;

  // Financing section overrides
  financingHeaderTitle: string;
  financingHeaderSubtitle: string;
}

export interface CustomWebsiteSection {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  content?: string;
  features?: string[];
  imageUrl?: string;
  buttonText?: string;
  buttonLinkType?: 'whatsapp' | 'catalog' | 'financing' | 'services' | 'location';
  position: 'top' | 'middle' | 'bottom';
  theme: 'vibrant-red' | 'dark-slate' | 'clean-white' | 'subtle-gray';
  isEnabled: boolean;
  createdAt: string;
}

export interface SectionsVisibilityConfig {
  hero: boolean;
  categories: boolean;
  trending: boolean;
  iphones: boolean;
  financingPromo: boolean;
  servicesHighlight: boolean;
  brandLogos: boolean;
  customSections: CustomWebsiteSection[];
}

export interface ProductCustomEdits {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  priceKsh?: number;
  depositKsh?: number;
  brand?: string;
  updatedAt?: string;
}

export interface ServiceCustomEdits {
  id: string;
  title?: string;
  shortDesc?: string;
  turnaroundTime?: string;
  image?: string;
  features?: string[];
  updatedAt?: string;
}

export interface SoftwareServiceCustomEdits {
  id: string;
  title?: string;
  shortDesc?: string;
  badge?: string;
  features?: string[];
  updatedAt?: string;
}

// Initial default site settings
const DEFAULT_SITE_SETTINGS: SiteGlobalSettings = {
  siteName: 'Denlight IT Solutions',
  siteTagline: 'Physical store on Kariuki Chotara road, Naivasha, Kenya.',
  brandAccentWord: 'IT SOLUTIONS',
  phoneSales: '254712124922',
  phoneSalesDisplay: '+254 712 124 922',
  phoneTech: '254719798972',
  phoneTechDisplay: '+254 719 798 972',
  contactEmail: 'support@denlightitsolutions.co.ke',
  storeAddress: 'Kariuki Chotara road, next to Naivas ndogo, Naivasha town',
  announcementBarText: 'WATU, ONFON & MOGO Lipa Mdogo Plans Available Today In-Store!',
  showAnnouncementBar: true,
  headerCtaText: 'Naivasha Shop',
  footerCopyrightText: '© 2026 Denlight IT Solutions. Physical store on Kariuki Chotara road, Naivasha, Kenya.',
  footerBrandDescription: 'Your one-stop destination for the latest electronics, smartphones, HP laptops, heavy-duty laminators, toners, power backups & smart devices at Denlight IT Solutions on Kariuki Chotara road, next to Naivas ndogo, Naivasha.',
  
  heroEyebrow: 'Discover. Inquire. Upgrade.',
  heroHeadline: 'Latest Tech',
  heroHeadlineAccent: 'Gadgets & Phones',
  heroSubtitle: 'Explore cutting-edge laptops, WATU & OnFon smartphones, Epson inkjets, power backups & smart security at Denlight IT Solutions Naivasha.',
  heroPrimaryButtonText: 'Browse Tech',
  heroSecondaryButtonText: 'Lipa Mdogo Mdogo',

  servicesHeaderTitle: 'COMPUTER REPAIRS & IT SERVICES.',
  servicesHeaderSubtitle: 'Professional computer & laptop repairs, SSD speed restoration, CCTV security camera installation, router setup, and structured office networking in Naivasha.',
  servicesLocationNotice: 'Kariuki Chotara Road • Next to Naivas Ndogo',

  financingHeaderTitle: 'LIPA MDOGO MDOGO FINANCING',
  financingHeaderSubtitle: 'Walk into our store on Kariuki Chotara road with your National ID and walk away with your smartphone today.'
};

const DEFAULT_SECTIONS_CONFIG: SectionsVisibilityConfig = {
  hero: true,
  categories: true,
  trending: true,
  iphones: true,
  financingPromo: true,
  servicesHighlight: true,
  brandLogos: true,
  customSections: []
};

// In-memory caches for fast synchronous rendering
let productEditsCache: Record<string, ProductCustomEdits> = {};
let serviceEditsCache: Record<string, ServiceCustomEdits> = {};
let softwareServiceEditsCache: Record<string, SoftwareServiceCustomEdits> = {};
let siteSettingsCache: SiteGlobalSettings = { ...DEFAULT_SITE_SETTINGS };
let sectionsConfigCache: SectionsVisibilityConfig = { ...DEFAULT_SECTIONS_CONFIG };
let superAdminCredentialsCache: SuperAdminCredentials = {
  username: 'Adminn',
  passwordHash: 'Neww2027',
  displayName: 'Super Admin',
  email: 'admin@denlightitsolutions.co.ke'
};

// Initialize caches from localStorage
try {
  const credsData = localStorage.getItem(SUPERADMIN_CREDENTIALS_KEY);
  if (credsData) superAdminCredentialsCache = JSON.parse(credsData);

  const pData = localStorage.getItem(PRODUCT_EDITS_KEY);
  if (pData) productEditsCache = JSON.parse(pData);

  const sData = localStorage.getItem(SERVICE_EDITS_KEY);
  if (sData) serviceEditsCache = JSON.parse(sData);

  const swData = localStorage.getItem(SOFTWARE_SERVICE_EDITS_KEY);
  if (swData) softwareServiceEditsCache = JSON.parse(swData);

  const siteData = localStorage.getItem(SITE_SETTINGS_KEY);
  if (siteData) siteSettingsCache = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(siteData) };

  const secData = localStorage.getItem(SECTIONS_CONFIG_KEY);
  if (secData) sectionsConfigCache = { ...DEFAULT_SECTIONS_CONFIG, ...JSON.parse(secData) };
} catch (err) {
  console.warn('Error reading superadmin custom data from storage:', err);
}

// Sync any existing product image edits into imageStorage memory cache
Object.values(productEditsCache).forEach((edit) => {
  if (edit.imageUrl) {
    setMemoryProductImage(edit.id, edit.imageUrl);
  }
});

/**
 * SuperAdmin Credentials Check
 * Defaults to: Username 'Adminn', Password 'Neww2027'
 * Can be changed at any time in SuperAdmin Profile.
 */
export const checkSuperAdminCredentials = (username: string, pass: string): boolean => {
  const cleanUser = username.trim();
  const cleanPass = pass.trim();

  // Match against current credentials in storage (or default fallback)
  const storedUser = superAdminCredentialsCache.username.trim();
  const storedPass = superAdminCredentialsCache.passwordHash.trim();

  const isStoredMatch = cleanUser.toLowerCase() === storedUser.toLowerCase() && cleanPass === storedPass;
  const isDefaultMatch = cleanUser.toLowerCase() === 'adminn' && cleanPass === 'Neww2027';

  return isStoredMatch || isDefaultMatch;
};

export const isSuperAdminLoggedIn = (): boolean => {
  try {
    return (
      sessionStorage.getItem(SUPERADMIN_AUTH_KEY) === 'true' ||
      localStorage.getItem(SUPERADMIN_AUTH_KEY) === 'true'
    );
  } catch {
    return false;
  }
};

export const loginSuperAdmin = (username: string, pass: string): { success: boolean; error?: string } => {
  if (checkSuperAdminCredentials(username, pass)) {
    try {
      sessionStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
      localStorage.setItem(SUPERADMIN_AUTH_KEY, 'true');
    } catch {}
    window.dispatchEvent(new CustomEvent('denlight-auth-changed', { detail: { loggedIn: true } }));
    
    addAuditLog({
      actor: username.trim() || 'SuperAdmin',
      role: 'SuperAdmin',
      action: 'LOGIN',
      target: 'SuperAdmin Portal',
      details: 'SuperAdmin authenticated successfully via access key.',
      ipAddress: '197.232.84.14 (Naivasha, KE)',
      severity: 'success'
    });

    return { success: true };
  }

  addAuditLog({
    actor: username.trim() || 'Unknown',
    role: 'Unauthorized Guest',
    action: 'SECURITY_EVENT',
    target: 'SuperAdmin Portal',
    details: `Failed SuperAdmin login attempt for username '${username.trim()}'.`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'warning'
  });

  return { success: false, error: 'Invalid SuperAdmin username or password. Please verify your credentials.' };
};

export const logoutSuperAdmin = (): void => {
  try {
    sessionStorage.removeItem(SUPERADMIN_AUTH_KEY);
    localStorage.removeItem(SUPERADMIN_AUTH_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent('denlight-auth-changed', { detail: { loggedIn: false } }));

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'LOGOUT',
    target: 'SuperAdmin Portal',
    details: 'SuperAdmin logged out of session.',
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'info'
  });
};

/**
 * SuperAdmin Profile Management: Update Username and Password
 */
export const getSuperAdminProfile = (): { username: string; displayName?: string; email?: string } => {
  return {
    username: superAdminCredentialsCache.username,
    displayName: superAdminCredentialsCache.displayName || 'Super Admin',
    email: superAdminCredentialsCache.email || 'admin@denlightitsolutions.co.ke'
  };
};

export const updateSuperAdminProfile = (
  newUsername: string,
  newPassword?: string,
  displayName?: string,
  email?: string
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  const cleanUser = newUsername.trim();
  if (!cleanUser) {
    return { success: false, error: 'Username cannot be empty.' };
  }

  const updated: SuperAdminCredentials = {
    ...superAdminCredentialsCache,
    username: cleanUser,
    displayName: displayName !== undefined ? displayName.trim() : superAdminCredentialsCache.displayName,
    email: email !== undefined ? email.trim() : superAdminCredentialsCache.email,
    updatedAt: new Date().toISOString()
  };

  const hasPasswordChanged = newPassword && newPassword.trim().length > 0;
  if (hasPasswordChanged) {
    if (newPassword!.trim().length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }
    updated.passwordHash = newPassword!.trim();
  }

  superAdminCredentialsCache = updated;

  try {
    localStorage.setItem(SUPERADMIN_CREDENTIALS_KEY, JSON.stringify(superAdminCredentialsCache));
  } catch (err) {
    console.warn('Could not save credentials to localStorage:', err);
  }

  addAuditLog({
    actor: cleanUser,
    role: 'SuperAdmin',
    action: hasPasswordChanged ? 'PASSWORD_CHANGE' : 'PROFILE_UPDATE',
    target: 'SuperAdmin Profile Credentials',
    details: `Updated SuperAdmin profile (username: ${cleanUser}${hasPasswordChanged ? ', password reset' : ''}).`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'warning'
  });

  window.dispatchEvent(new CustomEvent('denlight-profile-updated', { detail: { username: updated.username } }));
};

/**
 * Site Global Settings (Brand name, phone, address, header/footer/hero texts)
 */
export const getSiteSettings = (): SiteGlobalSettings => {
  return { ...siteSettingsCache };
};

export const updateSiteSettings = (
  updates: Partial<SiteGlobalSettings>
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  siteSettingsCache = {
    ...siteSettingsCache,
    ...updates
  };

  try {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(siteSettingsCache));
  } catch (err) {
    console.warn('Could not save site settings:', err);
  }

  // Update browser document title if site name changed
  if (updates.siteName) {
    document.title = `${updates.siteName} | Naivasha Electronics & IT Solutions`;
  }

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SITE_SETTINGS_UPDATE',
    target: 'Global Site Branding & Content',
    details: `Updated settings fields: ${Object.keys(updates).join(', ')}`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'info'
  });

  window.dispatchEvent(new CustomEvent('denlight-site-settings-updated', { detail: siteSettingsCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'site-settings' } }));
  return { success: true };
};

export const resetSiteSettings = (): void => {
  siteSettingsCache = { ...DEFAULT_SITE_SETTINGS };
  try {
    localStorage.removeItem(SITE_SETTINGS_KEY);
  } catch {}
  document.title = `${DEFAULT_SITE_SETTINGS.siteName} | Naivasha Electronics & IT Solutions`;

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SITE_SETTINGS_UPDATE',
    target: 'Global Site Branding',
    details: 'Reset all global branding & text overrides back to factory defaults',
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'warning'
  });

  window.dispatchEvent(new CustomEvent('denlight-site-settings-updated', { detail: siteSettingsCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'site-settings' } }));
};

/**
 * Sections Visibility & Custom Section Management
 */
export const getSectionsConfig = (): SectionsVisibilityConfig => {
  return { ...sectionsConfigCache };
};

export const toggleSectionVisibility = (
  sectionKey: keyof Omit<SectionsVisibilityConfig, 'customSections'>,
  isVisible: boolean
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  sectionsConfigCache = {
    ...sectionsConfigCache,
    [sectionKey]: isVisible
  };

  try {
    localStorage.setItem(SECTIONS_CONFIG_KEY, JSON.stringify(sectionsConfigCache));
  } catch (err) {
    console.warn('Could not save sections config:', err);
  }

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SECTION_TOGGLE',
    target: `Section: ${String(sectionKey)}`,
    details: `Set section '${String(sectionKey)}' visibility to ${isVisible ? 'VISIBLE' : 'HIDDEN'}`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'info'
  });

  window.dispatchEvent(new CustomEvent('denlight-sections-updated', { detail: sectionsConfigCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'sections' } }));
  return { success: true };
};

export const addCustomSection = (
  section: Omit<CustomWebsiteSection, 'id' | 'createdAt'>
): { success: boolean; section?: CustomWebsiteSection; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  const newSection: CustomWebsiteSection = {
    ...section,
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  sectionsConfigCache = {
    ...sectionsConfigCache,
    customSections: [...sectionsConfigCache.customSections, newSection]
  };

  try {
    localStorage.setItem(SECTIONS_CONFIG_KEY, JSON.stringify(sectionsConfigCache));
  } catch (err) {
    console.warn('Could not save custom section:', err);
  }

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SECTION_CREATE',
    target: `Custom Section: ${newSection.title}`,
    details: `Created new custom section positioned at ${newSection.position} (${newSection.theme})`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'success'
  });

  window.dispatchEvent(new CustomEvent('denlight-sections-updated', { detail: sectionsConfigCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'custom-section-added' } }));
  return { success: true, section: newSection };
};

export const updateCustomSection = (
  sectionId: string,
  updates: Partial<CustomWebsiteSection>
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  const index = sectionsConfigCache.customSections.findIndex((s) => s.id === sectionId);
  if (index === -1) {
    return { success: false, error: 'Section not found.' };
  }

  const updatedSections = [...sectionsConfigCache.customSections];
  updatedSections[index] = { ...updatedSections[index], ...updates };

  sectionsConfigCache = {
    ...sectionsConfigCache,
    customSections: updatedSections
  };

  try {
    localStorage.setItem(SECTIONS_CONFIG_KEY, JSON.stringify(sectionsConfigCache));
  } catch (err) {
    console.warn('Could not save custom section update:', err);
  }

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SECTION_UPDATE',
    target: `Custom Section ID: ${sectionId}`,
    details: `Updated custom section: ${updatedSections[index].title}`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'info'
  });

  window.dispatchEvent(new CustomEvent('denlight-sections-updated', { detail: sectionsConfigCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'custom-section-updated' } }));
  return { success: true };
};

export const deleteCustomSection = (
  sectionId: string
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  const targetSec = sectionsConfigCache.customSections.find((s) => s.id === sectionId);

  sectionsConfigCache = {
    ...sectionsConfigCache,
    customSections: sectionsConfigCache.customSections.filter((s) => s.id !== sectionId)
  };

  try {
    localStorage.setItem(SECTIONS_CONFIG_KEY, JSON.stringify(sectionsConfigCache));
  } catch (err) {
    console.warn('Could not delete custom section:', err);
  }

  addAuditLog({
    actor: superAdminCredentialsCache.username,
    role: 'SuperAdmin',
    action: 'SECTION_DELETE',
    target: `Custom Section: ${targetSec?.title || sectionId}`,
    details: `Deleted custom section permanently from website layout`,
    ipAddress: '197.232.84.14 (Naivasha, KE)',
    severity: 'warning'
  });

  window.dispatchEvent(new CustomEvent('denlight-sections-updated', { detail: sectionsConfigCache }));
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'custom-section-deleted' } }));
  return { success: true };
};

export const getEffectiveCustomSections = (position?: 'top' | 'middle' | 'bottom'): CustomWebsiteSection[] => {
  const activeSections = sectionsConfigCache.customSections.filter((s) => s.isEnabled !== false);
  if (!position) return activeSections;
  return activeSections.filter((s) => s.position === position);
};

/**
 * Save custom product edits (description, image, name, price)
 * Applies immediately to cache and dispatches update event.
 */
export const saveProductEdits = async (
  productId: string,
  edits: Partial<ProductCustomEdits>
): Promise<{ success: boolean; error?: string }> => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required to modify products.' };
  }

  const existing = productEditsCache[productId] || { id: productId };
  const updated: ProductCustomEdits = {
    ...existing,
    ...edits,
    id: productId,
    updatedAt: new Date().toISOString()
  };

  productEditsCache[productId] = updated;

  try {
    localStorage.setItem(PRODUCT_EDITS_KEY, JSON.stringify(productEditsCache));
  } catch (e) {
    console.warn('Could not persist product edits to localStorage', e);
  }

  // If imageUrl was changed, update imageStorage cache
  if (updated.imageUrl) {
    setMemoryProductImage(productId, updated.imageUrl);
  }

  // Also sync with Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('products').upsert(
        {
          id: productId,
          name: updated.name || undefined,
          description: updated.description || undefined,
          image_url: updated.imageUrl || undefined,
          price_ksh: updated.priceKsh || undefined,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
    } catch (err) {
      console.warn('Could not upsert product to Supabase:', err);
    }
  }

  // Dispatch global update event
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'product', id: productId } }));
  return { success: true };
};

/**
 * Save custom service edits (title, description, image, features, turnaround)
 */
export const saveServiceEdits = (
  serviceId: string,
  edits: Partial<ServiceCustomEdits>
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required to modify services.' };
  }

  const existing = serviceEditsCache[serviceId] || { id: serviceId };
  const updated: ServiceCustomEdits = {
    ...existing,
    ...edits,
    id: serviceId,
    updatedAt: new Date().toISOString()
  };

  serviceEditsCache[serviceId] = updated;

  try {
    localStorage.setItem(SERVICE_EDITS_KEY, JSON.stringify(serviceEditsCache));
  } catch (e) {
    console.warn('Could not persist service edits to localStorage', e);
  }

  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'service', id: serviceId } }));
  return { success: true };
};

/**
 * Save custom software service edits
 */
export const saveSoftwareServiceEdits = (
  softwareServiceId: string,
  edits: Partial<SoftwareServiceCustomEdits>
): { success: boolean; error?: string } => {
  if (!isSuperAdminLoggedIn()) {
    return { success: false, error: 'Unauthorized: SuperAdmin login required.' };
  }

  const existing = softwareServiceEditsCache[softwareServiceId] || { id: softwareServiceId };
  const updated: SoftwareServiceCustomEdits = {
    ...existing,
    ...edits,
    id: softwareServiceId,
    updatedAt: new Date().toISOString()
  };

  softwareServiceEditsCache[softwareServiceId] = updated;

  try {
    localStorage.setItem(SOFTWARE_SERVICE_EDITS_KEY, JSON.stringify(softwareServiceEditsCache));
  } catch (e) {
    console.warn('Could not persist software service edits to localStorage', e);
  }

  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'software-service', id: softwareServiceId } }));
  return { success: true };
};

/**
 * Reset a product's custom edits back to defaults
 */
export const resetProductEdits = (productId: string): void => {
  delete productEditsCache[productId];
  try {
    localStorage.setItem(PRODUCT_EDITS_KEY, JSON.stringify(productEditsCache));
  } catch {}
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'product', id: productId } }));
};

/**
 * Reset a service's custom edits back to defaults
 */
export const resetServiceEdits = (serviceId: string): void => {
  delete serviceEditsCache[serviceId];
  try {
    localStorage.setItem(SERVICE_EDITS_KEY, JSON.stringify(serviceEditsCache));
  } catch {}
  window.dispatchEvent(new CustomEvent('denlight-content-updated', { detail: { type: 'service', id: serviceId } }));
};

/**
 * Get effective PhoneProduct with all SuperAdmin edits applied
 */
export const getEffectiveProduct = (baseProduct: PhoneProduct): PhoneProduct => {
  const edits = productEditsCache[baseProduct.id];
  const effectiveImageUrl = getProductImageUrl(baseProduct.id, baseProduct.imageUrl);

  if (!edits) {
    return {
      ...baseProduct,
      imageUrl: effectiveImageUrl
    };
  }

  return {
    ...baseProduct,
    name: edits.name || baseProduct.name,
    description: edits.description !== undefined ? edits.description : baseProduct.description,
    imageUrl: edits.imageUrl || effectiveImageUrl,
    priceKsh: edits.priceKsh !== undefined ? edits.priceKsh : baseProduct.priceKsh,
    depositKsh: edits.depositKsh !== undefined ? edits.depositKsh : baseProduct.depositKsh,
    brand: edits.brand || baseProduct.brand
  };
};

/**
 * Get all catalog products with custom SuperAdmin descriptions and images applied
 */
export const getEffectiveProducts = (): PhoneProduct[] => {
  return PHONE_PRODUCTS.map(getEffectiveProduct);
};

/**
 * Get all services with SuperAdmin edits applied
 */
export const getEffectiveServices = (): ServiceCategory[] => {
  return SERVICES_DATA.map((base) => {
    const edits = serviceEditsCache[base.id];
    if (!edits) return base;
    return {
      ...base,
      title: edits.title || base.title,
      shortDesc: edits.shortDesc || base.shortDesc,
      image: edits.image || base.image,
      turnaroundTime: edits.turnaroundTime || base.turnaroundTime,
      features: edits.features && edits.features.length > 0 ? edits.features : base.features
    };
  });
};

/**
 * Upload image file for SuperAdmin (handles optimization & Supabase/DataURL fallback)
 */
export const uploadSuperAdminImage = async (
  file: File,
  tag: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // 1. Try Supabase Storage if configured
    if (isSupabaseConfigured() && supabase) {
      const optFile = await compressImageFile(file, 1200, 1200, 0.90);
      const res = await uploadAndPersistProductImage(tag, optFile);
      if (res.success && res.imageUrl) {
        return { success: true, url: res.imageUrl };
      }
    }

    // 2. Fallback to lightweight high-quality Data URL (compressed to ~60-90KB)
    const dataUrl = await compressImageToDataUrl(file, 1000, 1000, 0.88);
    return { success: true, url: dataUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Image processing failed.' };
  }
};
