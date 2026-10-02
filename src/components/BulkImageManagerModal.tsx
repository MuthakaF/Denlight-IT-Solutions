import React, { useState, useMemo } from 'react';
import { PhoneProduct } from '../types';
import { 
  compressImageToDataUrl, 
  saveBatchCustomProductImages, 
  saveCustomProductImage,
  resetCustomProductImage, 
  resetAllCustomProductImages, 
  getCustomImagesMap,
  matchFilenameToProductId,
  getProductImageUrl
} from '../utils/imageStorage';
import { 
  X, 
  Upload, 
  Check, 
  RotateCcw, 
  Image as ImageIcon, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Download,
  Trash2,
  Search
} from 'lucide-react';

interface BulkImageManagerModalProps {
  products: PhoneProduct[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: PhoneProduct) => void;
}

export const BulkImageManagerModal: React.FC<BulkImageManagerModalProps> = ({
  products,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [matchedResults, setMatchedResults] = useState<{ filename: string; productName: string; status: 'matched' | 'unmatched' }[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Stored images map
  const customMap = getCustomImagesMap();

  const brands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach((p) => bSet.add(p.brand));
    return ['all', ...Array.from(bSet)];
  }, [products]);

  const categoriesList = useMemo(() => {
    const cSet = new Set<string>();
    products.forEach((p) => cSet.add(p.category));
    return ['all', ...Array.from(cSet)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesSearch = 
        !searchTerm.trim() || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  if (!isOpen) return null;

  // Handle multi-file drop or selection (.jfif, .jpg, .png, etc.)
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessedCount(0);
    setSuccessMessage('');
    const newMatches: { filename: string; productName: string; status: 'matched' | 'unmatched' }[] = [];
    const batchToSave: Record<string, string> = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const matchedId = matchFilenameToProductId(file.name, products);

      if (matchedId) {
        const product = products.find((p) => p.id === matchedId);
        try {
          // Compress on the fly to avoid exceeding browser storage
          const compressedDataUrl = await compressImageToDataUrl(file, 720, 720, 0.82);
          batchToSave[matchedId] = compressedDataUrl;
          newMatches.push({
            filename: file.name,
            productName: product?.name || matchedId,
            status: 'matched'
          });
        } catch (err) {
          console.error('Failed to compress image:', file.name, err);
          newMatches.push({
            filename: file.name,
            productName: 'Failed to compress',
            status: 'unmatched'
          });
        }
      } else {
        newMatches.push({
          filename: file.name,
          productName: 'No matching product found in catalog',
          status: 'unmatched'
        });
      }
      setProcessedCount(i + 1);
    }

    if (Object.keys(batchToSave).length > 0) {
      saveBatchCustomProductImages(batchToSave);
      setSuccessMessage(`Successfully processed and applied ${Object.keys(batchToSave).length} product photo(s)!`);
    }

    setMatchedResults(newMatches);
    setIsProcessing(false);
  };

  // Handle single file upload for specific product
  const handleSingleFileUpload = async (product: PhoneProduct, file: File) => {
    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 720, 720, 0.82);
      saveCustomProductImage(product.id, compressedDataUrl);
      setSuccessMessage(`Updated photo for ${product.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Export custom images backup
  const handleExportBackup = () => {
    const current = getCustomImagesMap();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(current, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "denlight_product_photos_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const customUploadedTotal = Object.keys(customMap).length;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border-2 border-zinc-900 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Bulk Product Photo Manager</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-950 tracking-tight font-display">
              Upload & Match Device Photos (.jfif, .jpg, .png)
            </h2>
            <p className="text-zinc-600 text-xs mt-1">
              Select or drag-and-drop all your phone photos at once. The system automatically identifies each phone by filename and applies it to your live store.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold font-mono">
              {customUploadedTotal} / {products.length} Custom Photos
            </span>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* Bulk Drag & Drop Zone */}
          <div className="relative border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-all rounded-2xl p-6 sm:p-8 text-center cursor-pointer group">
            <input 
              type="file" 
              multiple 
              accept=".jfif,.jpg,.jpeg,.png,.webp,image/*"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Drop all phone photos here"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Drop all 41 Phone Photos Here (.jfif, .jpg, .png)
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-lg mx-auto">
                  Drag and drop multiple files at once (e.g. <span className="font-mono font-semibold text-zinc-700">"Itel 2163.jfif"</span>, <span className="font-mono font-semibold text-zinc-700">"Tecno Spark 30 TRANSFORMER.jfif"</span>, <span className="font-mono font-semibold text-zinc-700">"Infinix Hot 70.jfif"</span>).
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold tracking-wide">
                <Upload className="w-4 h-4" />
                <span>Browse Files on Device</span>
              </div>
            </div>
          </div>

          {/* Processing / Success Banner */}
          {isProcessing && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-xs font-semibold">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Compressing and matching {processedCount} photo(s)...</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-emerald-900 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Matched Batch Report */}
          {matchedResults.length > 0 && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Batch Upload Summary ({matchedResults.length} Files Processed)</span>
                </h4>
                <button
                  onClick={() => setMatchedResults([])}
                  className="text-[11px] font-mono text-zinc-500 hover:text-black"
                >
                  Clear Log
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 font-mono text-[11px]">
                {matchedResults.map((res, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded-lg flex items-center justify-between ${
                      res.status === 'matched' 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                        : 'bg-red-50 text-red-900 border border-red-200'
                    }`}
                  >
                    <span className="font-semibold truncate max-w-xs">{res.filename}</span>
                    <span className="truncate max-w-xs text-right">
                      {res.status === 'matched' ? `✓ Matched: ${res.productName}` : '✗ No product match'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Products Listing & Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter products (e.g. Itel 2163, Spark 30, iPhone 14)..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="laptops-desktops">Laptops</option>
                  <option value="printers-toners">Printers & Inks</option>
                  <option value="oraimo-accessories">Accessories & Power</option>
                  <option value="networking-cctv">Smart CCTV</option>
                </select>

                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportBackup}
                  className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export photos config"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Backup JSON</span>
                </button>

                {customUploadedTotal > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Reset all custom uploaded images back to defaults?')) {
                        resetAllCustomProductImages();
                      }
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Reset all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Table / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredProducts.map((product) => {
                const isCustom = Boolean(customMap[product.id]);
                const displayUrl = getProductImageUrl(product.id, product.imageUrl);

                return (
                  <div 
                    key={product.id}
                    className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img 
                          src={displayUrl} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-950 truncate font-display">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                          <span>{product.brand}</span>
                          <span>•</span>
                          {isCustom ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Custom Photo Active
                            </span>
                          ) : (
                            <span className="text-zinc-400">Default Stock Photo</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Individual File Pick */}
                      <label className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-600 border border-zinc-200 hover:border-blue-300 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1" title="Upload Photo">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Upload</span>
                        <input 
                          type="file" 
                          accept=".jfif,.jpg,.jpeg,.png,.webp,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSingleFileUpload(product, file);
                          }}
                        />
                      </label>

                      {isCustom && (
                        <button
                          onClick={() => resetCustomProductImage(product.id)}
                          className="p-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Reset to default photo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4">
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredProducts.length} devices
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Apply & Done
          </button>
        </div>

      </div>
    </div>
  );
};
