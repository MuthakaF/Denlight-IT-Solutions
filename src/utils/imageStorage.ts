import { PRODUCT_IMAGES } from '../config/productImages';
import { fetchDbProductImages, isSupabaseConfigured, supabase } from '../lib/supabase';

const SUPABASE_STORAGE_CACHE_KEY = 'denlight_supabase_product_images';
const LEGACY_STORAGE_KEY = 'denlight_custom_product_images';

// In-memory cache for fast synchronous access during React renders
let memoryDbImagesCache: Record<string, string> = {};

// Initialize memory cache from localStorage on load
try {
  const cached = localStorage.getItem(SUPABASE_STORAGE_CACHE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (cached) {
    memoryDbImagesCache = JSON.parse(cached);
  }
} catch {
  memoryDbImagesCache = {};
}

/**
 * High efficiency canvas-based image compressor
 * Compresses input image file (e.g. 5MB .jfif, .jpg, .png) down to ~40-100KB 
 * with crisp quality before uploading to Supabase Storage.
 */
export const compressImageFile = async (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.88
): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const optimizedFile = new File([blob], cleanName, { type: 'image/jpeg' });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export const compressImageToDataUrl = async (
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Synchronize product images from Supabase `products` table.
 * Fetches all persistent database image URLs and caches them.
 */
export const syncWithSupabase = async (): Promise<Record<string, string>> => {
  if (!isSupabaseConfigured()) {
    return memoryDbImagesCache;
  }

  try {
    const dbImages = await fetchDbProductImages();
    if (Object.keys(dbImages).length > 0) {
      memoryDbImagesCache = { ...memoryDbImagesCache, ...dbImages };
      try {
        localStorage.setItem(SUPABASE_STORAGE_CACHE_KEY, JSON.stringify(memoryDbImagesCache));
      } catch (e) {
        console.warn('Could not cache images in localStorage:', e);
      }
      window.dispatchEvent(new Event('custom-images-updated'));
    }
    return memoryDbImagesCache;
  } catch (err) {
    console.error('Error syncing images with Supabase:', err);
    return memoryDbImagesCache;
  }
};

/**
 * Subscribe to Supabase real-time updates on `products` table
 */
export const subscribeToProductImageChanges = () => {
  if (!supabase || !isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('public:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        const newRecord = payload.new as { id?: string; image_url?: string };
        if (newRecord?.id && newRecord?.image_url) {
          memoryDbImagesCache[newRecord.id] = newRecord.image_url;
          try {
            localStorage.setItem(SUPABASE_STORAGE_CACHE_KEY, JSON.stringify(memoryDbImagesCache));
          } catch {}
          window.dispatchEvent(new Event('custom-images-updated'));
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
};

/**
 * Get the effective image URL for any product with safe fallback chain:
 * 1. Supabase Database image_url (the persistent source of truth)
 * 2. Hardcoded config in /src/config/productImages.ts
 * 3. Default hardcoded fallback in product dataset
 */
export const getProductImageUrl = (productId: string, defaultUrl?: string): string => {
  // 1. Supabase persistent image URL from database
  if (memoryDbImagesCache[productId]) {
    return memoryDbImagesCache[productId];
  }

  // 2. Centralized custom config in /src/config/productImages.ts
  if (PRODUCT_IMAGES[productId]) {
    return PRODUCT_IMAGES[productId];
  }

  // 3. Fallback to hardcoded default
  return defaultUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
};

/**
 * Check if a product currently has a Supabase database image
 */
export const hasDatabaseProductImage = (productId: string): boolean => {
  return Boolean(memoryDbImagesCache[productId]);
};

/**
 * Backward compatibility alias for hasDatabaseProductImage
 */
export const hasCustomProductImage = (productId: string): boolean => {
  return hasDatabaseProductImage(productId);
};

export const getCustomImagesMap = (): Record<string, string> => {
  return { ...memoryDbImagesCache };
};

export const saveCustomProductImage = (productId: string, imageUrl: string): void => {
  setMemoryProductImage(productId, imageUrl);
};

export const saveBatchCustomProductImages = (imagesMap: Record<string, string>): void => {
  memoryDbImagesCache = { ...memoryDbImagesCache, ...imagesMap };
  try {
    localStorage.setItem(SUPABASE_STORAGE_CACHE_KEY, JSON.stringify(memoryDbImagesCache));
    window.dispatchEvent(new Event('custom-images-updated'));
  } catch {}
};

export const resetCustomProductImage = (productId: string): void => {
  delete memoryDbImagesCache[productId];
  try {
    localStorage.setItem(SUPABASE_STORAGE_CACHE_KEY, JSON.stringify(memoryDbImagesCache));
    window.dispatchEvent(new Event('custom-images-updated'));
  } catch {}
};

export const resetAllCustomProductImages = (): void => {
  memoryDbImagesCache = {};
  localStorage.removeItem(SUPABASE_STORAGE_CACHE_KEY);
  window.dispatchEvent(new Event('custom-images-updated'));
};

/**
 * Update the in-memory and local cache when an admin uploads a photo
 */
export const setMemoryProductImage = (productId: string, imageUrl: string): void => {
  memoryDbImagesCache[productId] = imageUrl;
  try {
    localStorage.setItem(SUPABASE_STORAGE_CACHE_KEY, JSON.stringify(memoryDbImagesCache));
    window.dispatchEvent(new Event('custom-images-updated'));
  } catch (e) {
    console.warn('Failed to cache image in localStorage', e);
  }
};

/**
 * Clear local cache and re-sync from Supabase
 */
export const clearImageCacheAndResync = async (): Promise<void> => {
  localStorage.removeItem(SUPABASE_STORAGE_CACHE_KEY);
  memoryDbImagesCache = {};
  await syncWithSupabase();
};

/**
 * Intelligent file-to-product matcher for admin bulk tools
 */
export const matchFilenameToProductId = (
  filename: string,
  productList: Array<{ id: string; name: string; model?: string }>
): string | null => {
  const cleanName = filename
    .replace(/\.(jfif|jpe?g|png|webp|gif|avif)$/i, '')
    .trim()
    .toLowerCase();

  // 1. Direct ID match
  const directId = productList.find((p) => p.id.toLowerCase() === cleanName);
  if (directId) return directId.id;

  // 2. Exact name match (case-insensitive)
  const exactName = productList.find((p) => p.name.toLowerCase() === cleanName);
  if (exactName) return exactName.id;

  // 3. Normalized alphanumeric token matching
  const cleanAlpha = cleanName.replace(/[^a-z0-9]/g, ' ');
  const tokens = cleanAlpha.split(/\s+/).filter(Boolean);

  let bestMatch: { id: string; score: number } | null = null;

  for (const product of productList) {
    const pNameNorm = product.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const pIdNorm = product.id.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const pTokens = new Set([...pNameNorm.split(/\s+/), ...pIdNorm.split(/\s+/)]);

    let matchedTokens = 0;
    for (const token of tokens) {
      if (pTokens.has(token)) {
        matchedTokens += 1;
      }
    }

    const score = matchedTokens / Math.max(tokens.length, 1);
    if (score >= 0.5) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { id: product.id, score };
      }
    }
  }

  return bestMatch ? bestMatch.id : null;
};
