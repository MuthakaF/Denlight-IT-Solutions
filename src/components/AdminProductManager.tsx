import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PHONE_PRODUCTS } from '../data/phones';
import { PhoneProduct } from '../types';
import {
  supabase,
  isSupabaseConfigured,
  getSupabaseConfig,
  signInAdmin,
  signOutAdmin,
  getAdminUser,
  uploadAndPersistProductImage,
  updateProductImageUrlInDb,
  testSupabaseConnection
} from '../lib/supabase';
import {
  getProductImageUrl,
  hasDatabaseProductImage,
  setMemoryProductImage,
  compressImageFile,
  syncWithSupabase,
  matchFilenameToProductId
} from '../utils/imageStorage';
import { checkSuperAdminCredentials } from '../utils/superAdminManager';
import {
  Lock,
  LogOut,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  X,
  ExternalLink,
  Shield,
  Layers,
  Database,
  HardDrive,
  Copy,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminProductManagerProps {
  onClose?: () => void;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({ onClose }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Diagnostic / Connection state
  const [diagnosticResult, setDiagnosticResult] = useState<{
    tested: boolean;
    databaseOk: boolean;
    storageOk: boolean;
    databaseError?: string;
    storageError?: string;
  }>({ tested: false, databaseOk: false, storageOk: false });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Product Selection & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<PhoneProduct | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  // Uploading state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Bulk Upload State
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [bulkFiles, setBulkFiles] = useState<Array<{ file: File; matchedProductId: string | null; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string }>>([]);
  const [isBulkUploading, setIsBulkUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      if (isSupabaseConfigured() && supabase) {
        const user = await getAdminUser();
        setCurrentUser(user);
      }
      setAuthLoading(false);
    };
    checkAuth();

    // Listen to Supabase auth state change
    const { data: authListener } = supabase?.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return PHONE_PRODUCTS.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      // Check SuperAdmin credentials (dynamic from profile or initial default)
      if (checkSuperAdminCredentials(emailInput, passwordInput)) {
        setCurrentUser({ id: 'superadmin', email: `${emailInput.trim()} (SuperAdmin)` } as any);
        await syncWithSupabase();
        setIsLoggingIn(false);
        return;
      }

      const { user, error } = await signInAdmin(emailInput, passwordInput);
      if (error) {
        setLoginError(error);
      } else if (user) {
        setCurrentUser(user);
        await syncWithSupabase();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setCurrentUser(null);
    setSelectedProduct(null);
  };

  const handleRunDiagnostic = async () => {
    setIsTestingConnection(true);
    const res = await testSupabaseConnection();
    setDiagnosticResult({
      tested: true,
      databaseOk: res.databaseOk,
      storageOk: res.storageOk,
      databaseError: res.databaseError,
      storageError: res.storageError
    });
    setIsTestingConnection(false);
  };

  const handleSelectProduct = (product: PhoneProduct) => {
    setSelectedProduct(product);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    setCustomUrlInput('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setUploadStatus(null);
  };

  const handleUploadAndSave = async () => {
    if (!selectedProduct || !selectedFile) return;

    setIsUploading(true);
    setUploadStatus({ message: 'Optimizing and uploading image to Supabase Storage (bucket: product-images)...' });

    try {
      // 1. Optimize image (convert/compress to crisp lightweight JPEG)
      const optimizedFile = await compressImageFile(selectedFile, 1200, 1200, 0.90);

      // 2. Upload to Supabase Storage & Upsert Database Record
      const result = await uploadAndPersistProductImage(selectedProduct.id, optimizedFile, {
        name: selectedProduct.name,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
        priceKsh: selectedProduct.priceKsh
      });

      if (result.success && result.imageUrl) {
        // 3. Update local cache immediately
        setMemoryProductImage(selectedProduct.id, result.imageUrl);
        setUploadStatus({
          success: true,
          message: `Successfully uploaded to Supabase Storage & saved in database! Image is permanently linked to ${selectedProduct.name}.`
        });
        setRefreshTrigger((prev) => prev + 1);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setUploadStatus({
          success: false,
          message: result.error || 'Upload failed. Check Supabase Storage and RLS configuration.'
        });
      }
    } catch (err: any) {
      setUploadStatus({
        success: false,
        message: err.message || 'An error occurred during upload.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCustomUrl = async () => {
    if (!selectedProduct || !customUrlInput.trim()) return;

    setIsUploading(true);
    setUploadStatus({ message: 'Updating product image URL in Supabase database...' });

    try {
      const result = await updateProductImageUrlInDb(
        selectedProduct.id,
        customUrlInput.trim(),
        {
          name: selectedProduct.name,
          brand: selectedProduct.brand,
          category: selectedProduct.category
        }
      );

      if (result.success) {
        setMemoryProductImage(selectedProduct.id, customUrlInput.trim());
        setUploadStatus({
          success: true,
          message: `Updated image URL in Supabase database for ${selectedProduct.name}!`
        });
        setRefreshTrigger((prev) => prev + 1);
        setCustomUrlInput('');
      } else {
        setUploadStatus({
          success: false,
          message: result.error || 'Failed to update database record.'
        });
      }
    } catch (err: any) {
      setUploadStatus({
        success: false,
        message: err.message || 'Error updating URL.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Bulk file handling
  const handleBulkFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mapped = (files as File[]).map((file: File) => {
      const matchedId = matchFilenameToProductId(file.name, PHONE_PRODUCTS);
      return {
        file,
        matchedProductId: matchedId,
        status: 'pending' as const
      };
    });

    setBulkFiles(mapped);
  };

  const handleRunBulkUpload = async () => {
    if (bulkFiles.length === 0) return;
    setIsBulkUploading(true);

    const updated = [...bulkFiles];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      if (!item.matchedProductId || item.status === 'done') continue;

      item.status = 'uploading';
      setBulkFiles([...updated]);

      try {
        const prod = PHONE_PRODUCTS.find((p) => p.id === item.matchedProductId);
        const optFile = await compressImageFile(item.file, 1000, 1000, 0.88);
        const res = await uploadAndPersistProductImage(item.matchedProductId, optFile, {
          name: prod?.name || item.matchedProductId,
          brand: prod?.brand,
          category: prod?.category
        });

        if (res.success && res.imageUrl) {
          setMemoryProductImage(item.matchedProductId, res.imageUrl);
          item.status = 'done';
        } else {
          item.status = 'error';
          item.error = res.error;
        }
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message;
      }
      setBulkFiles([...updated]);
    }

    setIsBulkUploading(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const copySqlSchema = () => {
    const sql = `-- Copy and run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  model TEXT,
  price_ksh NUMERIC,
  deposit_ksh NUMERIC,
  image_url TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const config = getSupabaseConfig();

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 lg:p-8 space-y-8 border border-slate-800 shadow-2xl min-h-[700px]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                Supabase Persistent Product Manager
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                  Admin Portal
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Store of truth: Supabase Database (`products`) & Supabase Storage (`product-images`)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-300 line-clamp-1 max-w-[180px]">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer ml-1"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Admin View"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Auth Gate: If not logged in */}
      {!currentUser ? (
        <div className="max-w-xl mx-auto py-8 space-y-6">
          
          {/* Diagnostic banner */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-red-400" />
                Supabase Connection Status
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${config.isConfigured ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                {config.isConfigured ? 'CONFIGURED' : 'ENV KEYS REQUIRED'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <p><strong className="text-slate-400">URL:</strong> {config.url || 'Not set (VITE_SUPABASE_URL)'}</p>
              <p><strong className="text-slate-400">Anon Key:</strong> {config.anonKey ? '•••••••••••• (VITE_SUPABASE_ANON_KEY)' : 'Not set'}</p>
            </div>

            {!config.isConfigured && (
              <div className="bg-amber-950/50 border border-amber-600/40 rounded-xl p-3 text-xs text-amber-200 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  Supabase credentials are required to persist images to your database.
                </p>
                <p className="text-[11px] text-amber-300/80">
                  Please add <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white">VITE_SUPABASE_URL</code> and <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white">VITE_SUPABASE_ANON_KEY</code> to your environment variables or <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white">.env</code> file.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleRunDiagnostic}
                disabled={isTestingConnection}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                <span>Test Live Connection</span>
              </button>
              
              <button
                onClick={copySqlSchema}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>{copiedSql ? '✓ SQL Copied to Clipboard!' : 'Copy SQL Table Schema'}</span>
              </button>
            </div>

            {/* Diagnostic Test Results */}
            {diagnosticResult.tested && (
              <div className="mt-3 p-3.5 bg-slate-900/90 rounded-xl border border-slate-700 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span>Database Table (`products`):</span>
                  <span className={diagnosticResult.databaseOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {diagnosticResult.databaseOk ? '✓ Connected & Table Ready' : `✕ Error: ${diagnosticResult.databaseError || 'Failed'}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage Bucket (`product-images`):</span>
                  <span className={diagnosticResult.storageOk ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {diagnosticResult.storageOk ? '✓ Bucket Ready' : `✕ ${diagnosticResult.storageError || 'Bucket Missing'}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Admin Login Box */}
          <form onSubmit={handleLogin} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Log in with your Supabase administrator or staff credentials to upload images and manage persistent catalog data.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 font-mono">
                {loginError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Admin Username / Email</label>
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Adminn or admin@denlight.co.ke"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || authLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 font-mono shadow-md"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

        </div>
      ) : (
        /* Authenticated Admin Product & Image Management Dashboard */
        <div className="space-y-6">
          
          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkMode(false)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  !bulkMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Single Product Editor
              </button>
              <button
                onClick={() => setBulkMode(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  bulkMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bulk Matcher & Uploader</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await syncWithSupabase();
                  setRefreshTrigger((prev) => prev + 1);
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Sync latest images from Supabase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync with Database</span>
              </button>
            </div>
          </div>

          {!bulkMode ? (
            /* Single Product Editor View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Product List Selector (Left Column) */}
              <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl border border-slate-700 p-4 space-y-4 flex flex-col h-[640px]">
                
                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 100+ inventory items..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Categories ({PHONE_PRODUCTS.length})</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops-desktops">Laptops & Desktops</option>
                    <option value="printers-toners">Printers & Toners</option>
                    <option value="oraimo-accessories">Oraimo & Accessories</option>
                    <option value="networking-cctv">Networking & CCTV</option>
                    <option value="ups-power">UPS & Power</option>
                    <option value="computer-peripherals">Computer Peripherals</option>
                  </select>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-700/50 pr-1 space-y-1">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    const hasDbImg = hasDatabaseProductImage(p.id);
                    const currentImg = getProductImageUrl(p.id, p.imageUrl);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-red-600/20 border border-red-500/50 text-white'
                            : 'hover:bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={currentImg}
                            alt={p.name}
                            className="w-9 h-9 object-contain bg-slate-900 rounded-lg border border-slate-700 p-0.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-mono uppercase bg-slate-900 px-1 rounded text-slate-400 font-bold">
                                {p.brand}
                              </span>
                              {hasDbImg && (
                                <span className="text-[8px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                  SUPABASE
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] font-mono text-slate-400 text-center pt-2 border-t border-slate-700">
                  Showing {filteredProducts.length} items
                </div>
              </div>

              {/* Product Image Editor & Uploader (Right Column) */}
              <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
                {selectedProduct ? (
                  <div className="space-y-6">
                    
                    {/* Selected Product Banner */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                            {selectedProduct.category}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            ID: <code className="text-white">{selectedProduct.id}</code>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">{selectedProduct.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">
                          Brand: {selectedProduct.brand} • Price: KES {selectedProduct.priceKsh?.toLocaleString() || 'N/A'}
                        </p>
                      </div>

                      {hasDatabaseProductImage(selectedProduct.id) ? (
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Active in Supabase DB
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700">
                            Using Default Fallback
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image Comparison & Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Current Active Image */}
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-2 text-center">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          Current Active Photo
                        </span>
                        <div className="aspect-square bg-slate-950 rounded-lg flex items-center justify-center p-3 border border-slate-800 overflow-hidden">
                          <img
                            src={getProductImageUrl(selectedProduct.id, selectedProduct.imageUrl)}
                            alt={selectedProduct.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 truncate" title={getProductImageUrl(selectedProduct.id, selectedProduct.imageUrl)}>
                          {getProductImageUrl(selectedProduct.id, selectedProduct.imageUrl)}
                        </p>
                      </div>

                      {/* New Image Upload Box */}
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-2 text-center flex flex-col justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          New Photo Preview
                        </span>

                        <div className="aspect-square bg-slate-950 rounded-lg flex items-center justify-center p-3 border border-dashed border-slate-700 overflow-hidden relative group">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Upload preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                              <ImageIcon className="w-8 h-8 text-slate-600" />
                              <span className="text-xs font-mono">No file chosen</span>
                              <span className="text-[10px] text-slate-600">Supports .jfif, .jpg, .png, .webp</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-red-400" />
                            <span>{selectedFile ? 'Choose Different File' : 'Select Local Photo'}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Status Alert */}
                    {uploadStatus && (
                      <div
                        className={`p-3.5 rounded-xl text-xs font-mono flex items-start gap-2.5 ${
                          uploadStatus.success === true
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                            : uploadStatus.success === false
                            ? 'bg-red-950/80 border border-red-500/50 text-red-200'
                            : 'bg-blue-950/80 border border-blue-500/50 text-blue-200'
                        }`}
                      >
                        {uploadStatus.success === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : uploadStatus.success === false ? (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 animate-spin" />
                        )}
                        <span>{uploadStatus.message}</span>
                      </div>
                    )}

                    {/* Action Buttons: Upload to Supabase Storage */}
                    <div className="space-y-4 pt-2">
                      <button
                        onClick={handleUploadAndSave}
                        disabled={!selectedFile || isUploading}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Uploading to Supabase Storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload & Persist to Supabase</span>
                          </>
                        )}
                      </button>

                      {/* Direct External URL alternative */}
                      <div className="pt-3 border-t border-slate-700/80 space-y-2">
                        <label className="text-xs font-mono text-slate-400 block">
                          Or enter direct image URL to save to database record:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            placeholder="https://images.example.com/phone.jpg"
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-red-500 focus:outline-none font-mono"
                          />
                          <button
                            onClick={handleSaveCustomUrl}
                            disabled={!customUrlInput.trim() || isUploading}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold cursor-pointer border border-slate-700"
                          >
                            Save URL
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3">
                    <HardDrive className="w-12 h-12 text-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-300">No Product Selected</h4>
                      <p className="text-xs text-slate-500">
                        Choose a product from the list on the left to upload or change its photo in Supabase.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Bulk Matcher & Uploader View */
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-500" />
                    Bulk Photo Matcher & Supabase Batch Uploader
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select multiple device photo files (e.g. <code className="text-slate-300">Itel 2163.jfif</code>, <code className="text-slate-300">Tecno Spark 30.jpg</code>). The system matches them to inventory and uploads all to Supabase Storage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    onChange={handleBulkFilesSelect}
                    multiple
                    accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif"
                    className="hidden"
                  />
                  <button
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-red-400" />
                    <span>Select Multiple Image Files</span>
                  </button>
                </div>
              </div>

              {bulkFiles.length > 0 ? (
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-700/60 bg-slate-900/80 rounded-xl border border-slate-700 p-2">
                    {bulkFiles.map((item, idx) => {
                      const matchedProd = PHONE_PRODUCTS.find((p) => p.id === item.matchedProductId);
                      return (
                        <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs font-mono">
                          <div className="min-w-0">
                            <span className="text-slate-300 font-bold block truncate">{item.file.name}</span>
                            <span className="text-[10px] text-slate-500">
                              Size: {(item.file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {matchedProd ? (
                              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                                ✓ Matched: <strong className="text-white">{matchedProd.name}</strong>
                              </span>
                            ) : (
                              <span className="text-amber-400 text-[11px] font-bold">
                                ⚠ No matching product found
                              </span>
                            )}

                            {item.status === 'uploading' && (
                              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 flex items-center gap-1 text-[10px]">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Uploading
                              </span>
                            )}
                            {item.status === 'done' && (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                                ✓ Saved in Supabase
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
                    onClick={handleRunBulkUpload}
                    disabled={isBulkUploading || bulkFiles.filter((b) => b.matchedProductId && b.status !== 'done').length === 0}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isBulkUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading & Syncing with Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload All Matched Photos to Supabase ({bulkFiles.filter((b) => b.matchedProductId && b.status !== 'done').length} Items)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2 font-mono text-xs">
                  <p>No bulk files selected yet.</p>
                  <p className="text-[11px] text-slate-600">
                    Click "Select Multiple Image Files" above to pick an entire folder of photos.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
