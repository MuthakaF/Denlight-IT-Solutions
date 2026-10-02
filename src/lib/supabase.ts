import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Retrieve Supabase environment variables from Vite
const env = (import.meta as any).env || {};
const supabaseUrl = (env.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL) as string | undefined;
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY) as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'your-anon-public-key'
  );
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl || '',
    anonKey: supabaseAnonKey || '',
    isConfigured: isSupabaseConfigured()
  };
};

// Create a safe client instance that does not crash if env variables are empty during initial setup
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Fetch all persistent product image URLs from Supabase `products` table
 * Returns a map of productId -> imageUrl
 */
export const fetchDbProductImages = async (): Promise<Record<string, string>> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {};
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, image_url')
      .not('image_url', 'is', null);

    if (error) {
      console.warn('Could not fetch products from Supabase:', error.message);
      return {};
    }

    const imageMap: Record<string, string> = {};
    if (data && Array.isArray(data)) {
      for (const item of data) {
        if (item.id && item.image_url) {
          imageMap[item.id] = item.image_url;
        }
      }
    }
    return imageMap;
  } catch (err) {
    console.error('Error querying Supabase products:', err);
    return {};
  }
};

/**
 * Upload a new product image to the `product-images` Supabase Storage bucket
 * and immediately update/upsert the product record in the `products` table.
 * Uses a unique timestamped path to eliminate browser & CDN caching issues.
 */
export const uploadAndPersistProductImage = async (
  productId: string,
  file: File,
  productMeta?: { name?: string; brand?: string; category?: string; priceKsh?: number }
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings or .env.'
    };
  }

  try {
    // 1. Determine file extension and unique name
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = fileExt === 'jfif' ? 'jpeg' : fileExt;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const sanitizedId = productId.replace(/[^a-z0-9_-]/gi, '_');
    const filePath = `${sanitizedId}/${timestamp}-${randomSuffix}.${cleanExt}`;

    // 2. Upload to Supabase Storage Bucket `product-images`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || `image/${cleanExt}`
      });

    if (uploadError) {
      return {
        success: false,
        error: `Storage upload failed: ${uploadError.message}. Make sure the 'product-images' bucket exists and has upload policies enabled.`
      };
    }

    // 3. Obtain the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Upsert product record in Supabase Database `products` table
    const { error: dbError } = await supabase
      .from('products')
      .upsert(
        {
          id: productId,
          name: productMeta?.name || productId,
          brand: productMeta?.brand || '',
          category: productMeta?.category || '',
          price_ksh: productMeta?.priceKsh || null,
          image_url: publicUrl,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (dbError) {
      return {
        success: false,
        error: `Database update failed: ${dbError.message}. Make sure the 'products' table exists with RLS insert/update permissions.`
      };
    }

    return {
      success: true,
      imageUrl: publicUrl
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during image persistence.'
    };
  }
};

/**
 * Directly update an image URL in the database (e.g. from an external CDN or custom URL)
 */
export const updateProductImageUrlInDb = async (
  productId: string,
  imageUrl: string,
  productMeta?: { name?: string; brand?: string; category?: string }
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured.'
    };
  }

  try {
    const { error } = await supabase
      .from('products')
      .upsert(
        {
          id: productId,
          name: productMeta?.name || productId,
          brand: productMeta?.brand || '',
          category: productMeta?.category || '',
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error updating product record.' };
  }
};

/**
 * Test Supabase Database and Storage connection
 */
export const testSupabaseConnection = async (): Promise<{
  databaseOk: boolean;
  storageOk: boolean;
  databaseError?: string;
  storageError?: string;
}> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      databaseOk: false,
      storageOk: false,
      databaseError: 'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set.',
      storageError: 'Supabase is not configured.'
    };
  }

  let dbOk = false;
  let dbErr: string | undefined;
  let stOk = false;
  let stErr: string | undefined;

  // Test DB
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      dbErr = error.message;
    } else {
      dbOk = true;
    }
  } catch (e: any) {
    dbErr = e.message;
  }

  // Test Storage
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      stErr = error.message;
    } else {
      const hasProductBucket = buckets?.some((b: any) => b.name === 'product-images');
      if (hasProductBucket) {
        stOk = true;
      } else {
        stErr = "Bucket 'product-images' not found. Please create a public bucket named 'product-images' in Supabase Storage.";
      }
    }
  } catch (e: any) {
    stErr = e.message;
  }

  return {
    databaseOk: dbOk,
    storageOk: stOk,
    databaseError: dbErr,
    storageError: stErr
  };
};

/**
 * Authentication Helpers for Staff / Admin access
 */
export const signInAdmin = async (email: string, password: string): Promise<{ user: User | null; session: Session | null; error: string | null }> => {
  if (!supabase || !isSupabaseConfigured()) {
    return { user: null, session: null, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return {
    user: data.user,
    session: data.session,
    error: error ? error.message : null
  };
};

export const signOutAdmin = async (): Promise<void> => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};

export const getAdminUser = async (): Promise<User | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
};
