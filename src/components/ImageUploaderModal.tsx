import React, { useState, useRef } from 'react';
import { PhoneProduct } from '../types';
import { saveCustomProductImage, resetCustomProductImage, getProductImageUrl, compressImageToDataUrl } from '../utils/imageStorage';
import { X, Upload, Link as LinkIcon, Check, RotateCcw, Image as ImageIcon, Sparkles, AlertCircle, FileImage } from 'lucide-react';

interface ImageUploaderModalProps {
  product: PhoneProduct | null;
  onClose: () => void;
  onImageUpdated?: () => void;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({
  product,
  onClose,
  onImageUpdated
}) => {
  if (!product) return null;

  const currentDisplayUrl = getProductImageUrl(product.id, product.imageUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>(currentDisplayUrl.startsWith('data:') ? '' : currentDisplayUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentDisplayUrl);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process and compress image file
  const processImageFile = async (file: File) => {
    setErrorMsg('');
    if (!file) return;

    // Check type or extension
    const isImage = file.type.startsWith('image/') || /\.(jfif|jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name);
    if (!isImage) {
      setErrorMsg('Please select a valid image file (.jfif, .jpg, .png, .webp, .gif).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 20MB.');
      return;
    }

    try {
      setIsCompressing(true);
      const originalSizeKb = Math.round(file.size / 1024);
      const compressedDataUrl = await compressImageToDataUrl(file, 900, 900, 0.85);
      setPreviewUrl(compressedDataUrl);
      setFileDetails(`${file.name} (${originalSizeKb} KB)`);
    } catch (err) {
      console.error('Error compressing image:', err);
      setErrorMsg('Failed to process image file. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle local file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle Drag and Drop in Modal
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle URL change
  const handleUrlSubmit = () => {
    setErrorMsg('');
    if (!urlInput.trim()) {
      setErrorMsg('Please enter a valid image URL');
      return;
    }
    setPreviewUrl(urlInput.trim());
    setFileDetails('Web Image URL');
  };

  // Apply changes
  const handleApply = () => {
    if (!previewUrl) return;
    saveCustomProductImage(product.id, previewUrl);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      if (onImageUpdated) onImageUpdated();
      onClose();
    }, 600);
  };

  // Reset to default
  const handleReset = () => {
    resetCustomProductImage(product.id);
    setPreviewUrl(product.imageUrl);
    setUrlInput(product.imageUrl);
    setFileDetails('Default Stock Photo');
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      if (onImageUpdated) onImageUpdated();
      onClose();
    }, 600);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 transition-colors z-20 cursor-pointer"
          title="Close / Go Back"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Change Product Image File</span>
          </div>
          <h3 className="text-xl font-black text-zinc-950 font-display">{product.name}</h3>
          <p className="text-xs text-zinc-600">
            Select an image file from your phone, laptop, or desktop computer (.jfif, .jpg, .png, .webp). The catalog will update immediately.
          </p>
        </div>

        {/* Drag & Drop Preview Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-video rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all border-2 border-dashed ${
            isDragOver 
              ? 'border-red-600 bg-red-50/80 scale-[1.02]' 
              : 'border-zinc-300 hover:border-zinc-500 bg-zinc-50 hover:bg-zinc-100/80'
          }`}
          title="Click to browse image files or drag & drop here"
        >
          {isCompressing ? (
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-700 font-bold">Optimizing image file...</p>
            </div>
          ) : previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain pointer-events-none"
                onError={() => setErrorMsg('Failed to load image preview. Check URL or file format.')}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity font-mono text-xs font-bold gap-1">
                <Upload className="w-5 h-5 text-white" />
                <span>Click or Drop File to Replace</span>
              </div>
            </>
          ) : (
            <div className="text-center space-y-2 text-zinc-400 font-mono text-xs p-4">
              <ImageIcon className="w-10 h-10 mx-auto text-zinc-400" />
              <p className="font-bold text-zinc-700">Click to choose image file or drop here</p>
              <p className="text-[10px] text-zinc-400">Supports .jfif, .jpg, .png, .webp (up to 20MB)</p>
            </div>
          )}

          {isDragOver && (
            <div className="absolute inset-0 bg-red-600/90 text-white flex flex-col items-center justify-center font-mono text-xs font-bold space-y-1">
              <Upload className="w-8 h-8 animate-bounce" />
              <span>Drop Image File Here</span>
            </div>
          )}
        </div>

        {fileDetails && (
          <div className="flex items-center justify-between text-[11px] font-mono bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700">
            <span className="flex items-center gap-1.5 truncate">
              <FileImage className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{fileDetails}</span>
            </span>
            <span className="text-emerald-700 font-bold shrink-0 ml-2">Ready</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Hidden File Input for Native Dialog */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.gif,.avif,.bmp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Option Tabs */}
        <div className="space-y-4">
          <div className="flex rounded-xl bg-zinc-100 p-1 border border-zinc-300 font-mono text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Choose Image File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Paste Image URL
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4 text-red-500" />
                <span>Browse Your Computer / Phone Files</span>
              </button>
              <p className="text-[10px] text-zinc-500 font-mono text-center">
                Accepts .jfif, .jpg, .png, .webp, camera photos & downloads.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-black uppercase">
                Enter Web Image URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/my-device-photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-black font-mono"
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-black text-xs font-mono font-bold rounded-xl uppercase cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-100 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-mono font-medium uppercase transition-colors cursor-pointer"
              title="Revert to original stock photo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <button
            onClick={handleApply}
            disabled={isCompressing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
              isSavedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isSavedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Saved & Updated!
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Apply & Save Image</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

