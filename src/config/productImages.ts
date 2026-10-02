/**
 * ==============================================================================
 * DENLIGHT IT SOLUTIONS - CENTRALIZED PHOTO & IMAGE REGISTRY
 * FILE LOCATION: /src/config/productImages.ts
 * ==============================================================================
 * 
 * HOW TO CHANGE ANY PHOTO ON THE WEBSITE:
 * ------------------------------------------------------------------------------
 * Option 1 (Web Image URL):
 *   Simply replace the URL with your own direct image URL:
 *   Example: 'ex-us-iphone-11-128gb': 'https://mywebsite.com/images/iphone11.jpg',
 * 
 * Option 2 (Local Image file in /public folder):
 *   1. Save your image file in the "/public" directory (e.g. /public/iphone11.jpg)
 *   2. Update the URL here to reference that file:
 *   Example: 'ex-us-iphone-11-128gb': '/iphone11.jpg',
 * 
 * Note: Whenever you download the codebase or deploy, all photos specified in 
 * this file will be permanently retained!
 * ==============================================================================
 */

/**
 * SITE-WIDE PROMO & HERO BANNER IMAGES
 */
export const SITE_IMAGES = {
  // Hero Section Featured Floating Cards
  heroAudioHeadphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  heroSmartWatch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  heroSmartphone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  heroWirelessEarbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",

  // Service Portal Showcase Images (Computer Repairs & IT Services)
  serviceComputerRepair: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
  serviceCctvSecurity: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80",
  serviceNetworkingWifi: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
  serviceInternetHotspot: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?auto=format&fit=crop&w=800&q=80"
};

/**
 * SOLAR & CLEAN ENERGY VENTURE PHOTO REGISTRY
 * Easily customize any photo for solar panels, inverters, batteries & kits here!
 */
export const SOLAR_IMAGES = {
  // Hero & Banner
  solarHeroBanner: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
  
  // Equipment Categories
  solarPanelsMono: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80",
  hybridInverters: "https://images.unsplash.com/photo-1548611716-ad0c7c34d3b6?auto=format&fit=crop&w=800&q=80",
  lithiumBatteries: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
  solarStreetlights: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  solarWaterHeater: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  solarWaterPumping: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=800&q=80",
  
  // Package Kits
  packageBasicHome: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  packageFamilyHybrid: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  packageCommercialVilla: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80"
};

/**
 * PRODUCT CATALOG PHOTO REGISTRY (127 PRODUCTS)
 * Map each Product ID to its photo URL.
 */
export const PRODUCT_IMAGES: Record<string, string> = {

  // --------------------------------------------------------------------------
  // SECTION: 1. EX-US IPHONES (DIRECT IMPORTS)
  // --------------------------------------------------------------------------
  // Ex-US iPhone 11 128GB
  'ex-us-iphone-11-128gb': 'https://images.unsplash.com/photo-1574944985070-8f3297426f59?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 12 128GB
  'ex-us-iphone-12-128gb': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 12 Pro 128GB
  'ex-us-iphone-12-pro-128gb': 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 12 Pro 256GB
  'ex-us-iphone-12-pro-256gb': 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 13 128GB
  'ex-us-iphone-13-128gb': 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 13 Pro 128GB
  'ex-us-iphone-13-pro-128gb': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 13 Pro 256GB
  'ex-us-iphone-13-pro-256gb': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 13 Pro Max 256GB
  'ex-us-iphone-13-pro-max-256gb': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 13 256GB
  'ex-us-iphone-13-256gb': 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 128GB
  'ex-us-iphone-14-128gb': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 256GB
  'ex-us-iphone-14-256gb': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 Pro 256GB eSIM
  'ex-us-iphone-14-pro-esim-256gb': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 Pro Max 256GB eSIM
  'ex-us-iphone-14-pro-max-256gb-esim': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 Pro Max 512GB eSIM
  'ex-us-iphone-14-pro-max-512gb-esim': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 14 Pro Max 256GB
  'ex-us-iphone-14-pro-max-256gb': 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 15 Plus 128GB eSIM
  'ex-us-iphone-15-plus-128gb-esim': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 15 Pro 128GB eSIM
  'ex-us-iphone-15-pro-128gb-esim': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',

  // Ex-US iPhone 15 256GB eSIM
  'ex-us-iphone-15-256gb-esim': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 2. TECNO
  // --------------------------------------------------------------------------
  // Tecno Camon 50 Pro (8GB / 256GB)
  'tecno-camon-50-pro-8-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Tecno Camon 50 (8GB / 256GB)
  'tecno-camon-50-8-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Tecno Spark 30 TRANSFORMER (8GB / 128GB)
  'tecno-spark-30-transformer-8-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Tecno Spark 50 (4GB / 256GB)
  'tecno-spark-50-4-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Tecno Spark 50 (4GB / 128GB)
  'tecno-spark-50-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Tecno Pop 20 (4GB / 128GB)
  'tecno-pop-20-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Tecno S501
  'tecno-s501': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T372 Feature Phone
  'tecno-t372': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T302 Feature Phone
  'tecno-t302': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T101 Feature Phone
  'tecno-t101': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T316 Feature Phone
  'tecno-t316': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T301 Feature Phone
  'tecno-t301': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Tecno T528 Feature Phone
  'tecno-t528': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 3. INFINIX
  // --------------------------------------------------------------------------
  // Infinix Note 60 Pro 5G (8GB / 256GB)
  'infinix-note-60-pro-8-256-5g': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Infinix GT 30 PRO (12GB / 256GB)
  'infinix-gt-30-pro-12-256': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 60 Pro Plus (8GB / 256GB)
  'infinix-hot-60-pro-plus-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 60 Pro (8GB / 128GB)
  'infinix-hot-60-pro-8-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 60i (8GB / 256GB)
  'infinix-hot-60i-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 60i (6GB / 128GB)
  'infinix-hot-60i-6-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Smart 20 (4GB / 128GB)
  'infinix-smart-20-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Smart 20 (4GB / 64GB)
  'infinix-smart-20-4-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 70 (4GB / 128GB)
  'infinix-hot-70-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Infinix Hot 70 (6GB / 256GB)
  'infinix-hot-70-6-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 4. ITEL
  // --------------------------------------------------------------------------
  // Itel S26 Ultra (8GB / 256GB)
  'itel-s26-ultra-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel Power 80
  'itel-power-80': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel P55 Plus (8GB / 128GB)
  'itel-p55-plus-8-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel City 200 (4GB / 128GB)
  'itel-city-200-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel A200 (4GB / 128GB)
  'itel-a200-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel P65 (4GB / 128GB)
  'itel-p65-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel A50c (2GB / 32GB)
  'itel-a50c-2-32': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel A06 (2GB / 64GB)
  'itel-a06-2-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Itel 2160 Feature Phone
  'itel-2160': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Itel 2163 Feature Phone
  'itel-2163': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Itel 2165 Feature Phone
  'itel-2165': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 5. OPPO
  // --------------------------------------------------------------------------
  // Oppo Pad SE (4GB / 128GB)
  'oppo-pad-se-4-128': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',

  // Oppo Reno 15 Pro 5G (12GB / 512GB)
  'oppo-reno-15-pro-12-512': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Oppo Reno 15 5G (12GB / 512GB)
  'oppo-reno-15-5g-12-512': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Oppo Reno 15f 5G (12GB / 512GB)
  'oppo-reno-15f-5g-12-512': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Oppo Reno 14f 5G (12GB / 512GB)
  'oppo-reno-14f-5g-12-512': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Oppo A6 Pro 4G (8GB / 256GB)
  'oppo-a6-pro-4g-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Oppo A5 (6GB / 128GB)
  'oppo-a5-6-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Oppo A3 (6GB / 128GB)
  'oppo-a3-6-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Oppo A6 (8GB / 256GB)
  'oppo-a6-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Oppo A6 (6GB / 256GB)
  'oppo-a6-6-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Oppo A6x (4GB / 64GB)
  'oppo-a6x-4-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 6. REALME
  // --------------------------------------------------------------------------
  // Realme C75 (8GB / 512GB)
  'realme-c75-8-512': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme C75 (8GB / 256GB)
  'realme-c75-8-256': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme C85 Pro (8GB / 256GB)
  'realme-c85pro-8-256': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme C75x (6GB / 128GB)
  'realme-c75x-6-128': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme C100i (4GB / 128GB)
  'realme-c100i-4-128': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme C100i (4GB / 64GB)
  'realme-c100i-4-64': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme Note 70 (4GB / 128GB)
  'realme-note-70-4-128': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme Note 60x (4GB / 64GB)
  'realme-note-60x-4-64': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',

  // Realme Note 60x (3GB / 64GB)
  'realme-note-60x-3-64': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 7. REDMI (XIAOMI)
  // --------------------------------------------------------------------------
  // Redmi Note 15 (8GB / 256GB)
  'redmi-note-15-8-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi Note 15 (6GB / 128GB)
  'redmi-note-15-6-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi 15 (6GB / 128GB)
  'redmi-15-6-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi 15c (8GB / 256GB)
  'redmi-15c-8-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi 15c (4GB / 128GB)
  'redmi-15c-4-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi A7 Pro (4GB / 64GB)
  'redmi-a7-pro-4-64': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Redmi A7 (3GB / 64GB)
  'redmi-a7-3-64': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 8. SAMSUNG
  // --------------------------------------------------------------------------
  // Samsung Galaxy A06 (4GB / 64GB)
  'samsung-galaxy-a06-4-64': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A06 (4GB / 128GB)
  'samsung-galaxy-a06-4-128': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A07 (4GB / 64GB)
  'samsung-galaxy-a07-4-64': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A07 (4GB / 128GB)
  'samsung-galaxy-a07-4-128': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A16 (4GB / 128GB)
  'samsung-galaxy-a16-4-128': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A17 (4GB / 128GB)
  'samsung-galaxy-a17-4-128': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A17 (8GB / 256GB)
  'samsung-galaxy-a17-8-256': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A37 (6GB / 128GB)
  'samsung-galaxy-a37-6-128': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A57 (8GB / 256GB)
  'samsung-galaxy-a57-8-256': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',

  // Samsung Galaxy A11 Plus Tablet (8GB / 256GB)
  'samsung-a11-plus-tablet-8-256': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 9. VIVO
  // --------------------------------------------------------------------------
  // Vivo V70FE (8GB / 512GB)
  'vivo-v70fe-8-512': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo V70FE (8GB / 256GB)
  'vivo-v70fe-8-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y28 (8GB / 128GB)
  'vivo-y28-8-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y31d (6GB / 256GB)
  'vivo-y31d-6-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y31d (6GB / 128GB)
  'vivo-y31d-6-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y21d (6GB / 256GB)
  'vivo-y21d-6-256': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y21d (6GB / 128GB)
  'vivo-y21d-6-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y05 (4GB / 128GB)
  'vivo-y05-4-128': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y05 (4GB / 64GB)
  'vivo-y05-4-64': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',

  // Vivo Y04 (4GB / 64GB)
  'vivo-y04-4-64': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 10. HONOR
  // --------------------------------------------------------------------------
  // Honor Play 10 (3GB / 64GB)
  'honor-play-10-3-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Honor X5c (4GB / 128GB)
  'honor-x5c-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Honor X6c (6GB / 128GB)
  'honor-x6c-6-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 11. BLADE ZTE
  // --------------------------------------------------------------------------
  // ZTE Blade A36 (4GB / 64GB)
  'blade-zte-a36-4-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // ZTE Blade V80 MAX (8GB / 256GB)
  'blade-zte-v80-max-8-256': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 12. VILLAON
  // --------------------------------------------------------------------------
  // Villaon V110 Feature Phone
  'villaon-v110': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Villaon V201 Feature Phone
  'villaon-v201': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Villaon V25 (2GB / 32GB)
  'villaon-v25-2-32': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Villaon V50s (4GB / 64GB)
  'villaon-v50s-4-64': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 13. MBLU
  // --------------------------------------------------------------------------
  // Mblu 22 (4GB / 128GB)
  'mblu-22-4-128': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 14. VISIONTEL
  // --------------------------------------------------------------------------
  // Visiontel V111 Feature Phone
  'visiontel-v111': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Visiontel 580 Feature Phone
  'visiontel-580': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 15. WINRO
  // --------------------------------------------------------------------------
  // Winro W7575 Feature Phone
  'winro-w7575': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 16. NOKIA
  // --------------------------------------------------------------------------
  // Nokia 105 HMD
  'nokia-105-hmd': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',

  // Nokia 105
  'nokia-105': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 17. BONTEL
  // --------------------------------------------------------------------------
  // Bontel Mobile Phone
  'bontel-phone': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 18. LAPTOPS (EX-UK REFURBISHED & BRAND NEW)
  // --------------------------------------------------------------------------
  // HP EliteBook 840 G5 Core i5 (16GB / 512GB SSD)
  'hp-elitebook-840-g5-ex-uk': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',

  // HP EliteBook 840 G6 Core i7 (16GB / 512GB SSD)
  'hp-elitebook-840-g6-ex-uk': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',

  // Lenovo ThinkPad T480 Core i5 (16GB / 256GB SSD)
  'lenovo-thinkpad-t480-ex-uk': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',

  // Dell Latitude 5490 Core i5 (8GB / 256GB SSD)
  'dell-latitude-5490-ex-uk': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',

  // Brand New HP Laptop 15 Core i3 12th Gen (8GB / 512GB SSD)
  'hp-laptop-15-dw-new': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',

  // Brand New Asus VivoBook 15 Core i5 (8GB / 512GB SSD)
  'asus-vivobook-15-new': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',

  // Brand New Lenovo IdeaPad 3 Core i5 (8GB / 512GB SSD)
  'lenovo-ideapad-3-new': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 19. PRINTERS & TONERS
  // --------------------------------------------------------------------------
  // HP LaserJet Pro M12a Mono Printer
  'hp-laserjet-pro-m12a': 'https://images.unsplash.com/photo-1612815150350-025983794b63?auto=format&fit=crop&w=800&q=80',

  // Epson EcoTank L3250 Wi-Fi All-in-One InkTank Printer
  'epson-ecotank-l3250': 'https://images.unsplash.com/photo-1612815150350-025983794b63?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 20. ORAIMO ACCESSORIES & SMART CCTV
  // --------------------------------------------------------------------------
  // Oraimo FreePods 4 Active Noise Cancellation Earbuds
  'oraimo-freepods-4': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',

  // Oraimo 27000mAh Traveler 3 Byte Fast Charge Power Bank
  'oraimo-27000mah-powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',

  // Imou Ranger 2 4MP Smart Wi-Fi CCTV Camera
  'imou-ranger-2-4mp': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',


  // --------------------------------------------------------------------------
  // SECTION: 21. KEYBOARDS, MICE, POWER & OFFICE ACCESSORIES
  // --------------------------------------------------------------------------
  // Aitnt USB Wired Multimedia Keyboard
  'aitnt-keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',

  // HP USB Wired Desktop Keyboard
  'hp-keyboard': 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',

  // Wireless Ultra-Slim Keyboard & Mouse Set (White)
  'wireless-keyboard-mouse-set-white': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',

  // HP Optical USB Wired Desktop Mouse
  'hp-mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',

  // Logitech M-Series Precision Optical Mouse
  'logitech-mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',

  // RGB Chroma LED Backlit Gaming Mouse (Lights Up)
  'gaming-mouse-rgb': 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=800&q=80',

  // APC Schneider Easy UPS 650VA / 1000VA Battery Backup
  'easyups-ups': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',

  // Innovia Heavy Duty Multi-Socket Surge Protector Extension
  'innovia-power-extension': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80',

  // Heavy Duty A3 / A4 Thermal & Cold Document Laminating Machine
  'office-laminator-a3-a4': 'https://images.unsplash.com/photo-1612815150350-025983794b63?auto=format&fit=crop&w=800&q=80',

};

/**
 * Helper function to retrieve the configured image URL for a given product ID.
 * Falls back to the fallbackUrl if the ID is not found.
 */
export function getProductConfigImageUrl(productId: string, fallbackUrl?: string): string {
  return PRODUCT_IMAGES[productId] || fallbackUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
}
