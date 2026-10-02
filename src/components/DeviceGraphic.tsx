import React from 'react';
import { PhoneProduct } from '../types';
import { Smartphone, Laptop, Printer, Video, HardDrive, Wifi, ShieldCheck, BatteryCharging, Zap, Cpu, Headphones, Keyboard, Mouse, Plug } from 'lucide-react';

interface DeviceGraphicProps {
  product: PhoneProduct;
  className?: string;
  compact?: boolean;
}

export const DeviceGraphic: React.FC<DeviceGraphicProps> = ({ product, className = '', compact = false }) => {
  const brand = (product.brand || '').toLowerCase();
  const name = product.name || '';
  const category = product.category;
  const isApple = brand.includes('apple') || name.toLowerCase().includes('iphone');
  const isFeaturePhone = 
    name.toLowerCase().includes('feature') ||
    name.toLowerCase().includes('nokia 105') ||
    name.toLowerCase().includes('t372') ||
    name.toLowerCase().includes('t302') ||
    name.toLowerCase().includes('t101') ||
    name.toLowerCase().includes('t316') ||
    name.toLowerCase().includes('t301') ||
    name.toLowerCase().includes('t528') ||
    name.toLowerCase().includes('2160') ||
    name.toLowerCase().includes('2163') ||
    name.toLowerCase().includes('2165') ||
    name.toLowerCase().includes('v110') ||
    name.toLowerCase().includes('v201') ||
    name.toLowerCase().includes('visiontel') ||
    name.toLowerCase().includes('winro') ||
    name.toLowerCase().includes('bontel') ||
    name.toLowerCase().includes('s501');

  const ram = product.specs?.RAM || product.specs?.['RAM / Storage']?.split('/')[0] || '';
  const storage = product.specs?.Storage || product.specs?.['RAM / Storage']?.split('/')[1] || '';
  const display = product.specs?.Display || '';
  const camera = product.specs?.Camera || '';

  // Determine Brand Theme Colors
  const getBrandTheme = () => {
    if (isApple) {
      return {
        bgGradient: 'from-slate-900 via-zinc-900 to-stone-900',
        accentColor: 'text-zinc-200',
        badgeBg: 'bg-zinc-800 text-zinc-100 border-zinc-700',
        ringColor: 'ring-zinc-400/30',
        deviceBody: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-zinc-700',
        brandLabel: 'iPhone',
      };
    }
    if (brand.includes('samsung')) {
      return {
        bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
        accentColor: 'text-blue-400',
        badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-700/50',
        ringColor: 'ring-blue-500/30',
        deviceBody: 'bg-gradient-to-b from-slate-800 via-slate-900 to-blue-950 border-slate-700',
        brandLabel: 'GALAXY',
      };
    }
    if (brand.includes('tecno')) {
      return {
        bgGradient: 'from-indigo-950 via-zinc-900 to-slate-900',
        accentColor: 'text-red-500',
        badgeBg: 'bg-red-950/60 text-red-300 border-red-700/50',
        ringColor: 'ring-red-500/30',
        deviceBody: 'bg-gradient-to-b from-zinc-800 via-slate-900 to-indigo-950 border-zinc-700',
        brandLabel: 'TECNO',
      };
    }
    if (brand.includes('infinix')) {
      return {
        bgGradient: 'from-emerald-950 via-zinc-900 to-teal-950',
        accentColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
        ringColor: 'ring-emerald-500/30',
        deviceBody: 'bg-gradient-to-b from-slate-800 via-zinc-900 to-emerald-950 border-zinc-700',
        brandLabel: 'INFINIX',
      };
    }
    if (brand.includes('oppo')) {
      return {
        bgGradient: 'from-teal-950 via-slate-900 to-zinc-900',
        accentColor: 'text-teal-300',
        badgeBg: 'bg-teal-900/60 text-teal-200 border-teal-700/50',
        ringColor: 'ring-teal-500/30',
        deviceBody: 'bg-gradient-to-b from-slate-800 via-teal-950 to-slate-900 border-teal-800/40',
        brandLabel: 'OPPO',
      };
    }
    if (brand.includes('realme') || brand.includes('redmi')) {
      return {
        bgGradient: 'from-red-950 via-zinc-900 to-stone-900',
        accentColor: 'text-red-400',
        badgeBg: 'bg-red-900/60 text-red-200 border-red-700/50',
        ringColor: 'ring-red-500/30',
        deviceBody: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-red-950 border-zinc-700',
        brandLabel: product.brand.toUpperCase(),
      };
    }
    if (brand.includes('vivo')) {
      return {
        bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
        accentColor: 'text-cyan-300',
        badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-700/50',
        ringColor: 'ring-cyan-500/30',
        deviceBody: 'bg-gradient-to-b from-slate-800 via-cyan-950 to-slate-900 border-slate-700',
        brandLabel: 'VIVO',
      };
    }
    return {
      bgGradient: 'from-zinc-900 via-slate-900 to-zinc-950',
      accentColor: 'text-red-500',
      badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
      ringColor: 'ring-red-500/30',
      deviceBody: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-zinc-700',
      brandLabel: (product.brand || 'TECH').toUpperCase(),
    };
  };

  const theme = getBrandTheme();

  // Render Category Specific Graphics
  if (category === 'laptops-desktops') {
    return (
      <div className={`relative w-full h-full min-h-[190px] bg-gradient-to-br ${theme.bgGradient} p-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        {/* Background Mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Vector Laptop Frame */}
        <div className="relative z-10 w-full max-w-[210px] flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          {/* Screen Top Lid */}
          <div className="w-full h-28 bg-zinc-900 border-2 border-zinc-600 rounded-t-xl p-2 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Webcam & Sensor */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 border border-zinc-500" />
            </div>
            
            {/* Screen Inner Display */}
            <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-950 to-zinc-950 rounded border border-zinc-800 p-2 flex flex-col justify-between relative">
              <div className="flex items-center justify-between text-[9px] font-mono text-blue-400">
                <span className="font-bold flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> HP PROBOOK</span>
                <span className="text-emerald-400 font-semibold">1080p FHD</span>
              </div>
              <div className="my-auto text-center">
                <p className="text-[11px] font-extrabold text-white tracking-wide uppercase drop-shadow">{product.name}</p>
                <p className="text-[9px] font-mono text-zinc-400 mt-0.5">{product.specs?.Processor || 'Intel Core i5/i7'}</p>
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-zinc-400">
                <span>{product.specs?.RAM || '8GB RAM'}</span>
                <span className="text-red-400 font-bold">{product.specs?.Storage || '256GB SSD'}</span>
              </div>
            </div>
          </div>

          {/* Laptop Base Keyboard Deck */}
          <div className="w-[112%] h-3.5 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded-b-md shadow-lg border-t border-zinc-500 relative flex items-center justify-center">
            {/* Trackpad notch */}
            <div className="w-12 h-1 bg-zinc-800 rounded-xs border border-zinc-600/50" />
          </div>
        </div>

        {/* Spec Pill */}
        <div className="mt-3 z-10 flex items-center gap-1.5">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
            {product.specs?.RAM || 'SSD FAST'}
          </span>
          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded-full border border-zinc-700">
            {product.specs?.Storage || 'Win 11 Pro'}
          </span>
        </div>
      </div>
    );
  }

  if (category === 'printers-toners') {
    return (
      <div className={`relative w-full h-full min-h-[190px] bg-gradient-to-br ${theme.bgGradient} p-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Vector Printer Illustration */}
        <div className="relative z-10 w-full max-w-[180px] flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          {/* Top Paper Tray */}
          <div className="w-24 h-5 bg-zinc-700 border border-zinc-500 rounded-t-sm relative flex justify-center overflow-hidden">
            <div className="w-20 h-4 bg-white/90 rounded-t-xs -mt-1 shadow-inner border border-zinc-300" />
          </div>

          {/* Printer Body */}
          <div className="w-full h-20 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-xl shadow-2xl p-2.5 flex flex-col justify-between relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Printer className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-mono font-bold text-white tracking-wider">EPSON / HP</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                <span className="text-[8px] font-mono text-emerald-400">READY</span>
              </div>
            </div>

            {/* Ink Reservoir / Cartridge Slot Indicator */}
            <div className="w-full bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 flex items-center justify-around">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-cyan-300 shadow-xs" title="Cyan Ink" />
              <div className="w-3.5 h-3.5 rounded-full bg-magenta-500 bg-pink-500 border border-pink-300 shadow-xs" title="Magenta Ink" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-200 shadow-xs" title="Yellow Ink" />
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-600 shadow-xs" title="Black Ink" />
            </div>

            {/* Output slot */}
            <div className="w-full h-1.5 bg-zinc-950 rounded border-b border-zinc-700" />
          </div>
        </div>

        <div className="mt-3 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
            {product.name.includes('Toner') ? 'LASERJET TONER' : 'OFFICE INKJET'}
          </span>
        </div>
      </div>
    );
  }

  if (category === 'networking-cctv') {
    return (
      <div className={`relative w-full h-full min-h-[190px] bg-gradient-to-br ${theme.bgGradient} p-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* CCTV / Router Vector Graphic */}
        <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          {/* Dome CCTV Camera */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 border-4 border-zinc-500 shadow-2xl p-2 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full bg-black border-2 border-cyan-500/50 flex items-center justify-center relative shadow-inner">
              {/* Camera Glass Lens */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-cyan-500 border-2 border-cyan-400 flex items-center justify-center shadow-md">
                <div className="w-4 h-4 rounded-full bg-black border border-cyan-300 shadow-inner" />
              </div>
              {/* IR LED Ring dots */}
              <div className="absolute inset-1 rounded-full border border-dashed border-red-500/60 opacity-80" />
            </div>
            {/* Live Indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-950/80 px-1.5 py-0.5 rounded-full border border-red-500/50">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[7px] font-mono font-bold text-red-200">LIVE HD</span>
            </div>
          </div>
        </div>

        <div className="mt-3 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 flex items-center gap-1">
            <Video className="w-3 h-3 text-cyan-400" /> SMART SURVEILLANCE
          </span>
        </div>
      </div>
    );
  }

  // Accessories & Peripherals (Keyboards, Mice, Power, Audio)
  if (category === 'oraimo-accessories' || category === 'ups-power' || category === 'computer-peripherals') {
    const isKeyboard = name.toLowerCase().includes('keyboard');
    const isMouse = name.toLowerCase().includes('mouse');
    const isPower = name.toLowerCase().includes('power') || name.toLowerCase().includes('ups') || name.toLowerCase().includes('surge') || name.toLowerCase().includes('battery');

    return (
      <div className={`relative w-full h-full min-h-[190px] bg-gradient-to-br ${theme.bgGradient} p-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          {isKeyboard ? (
            <div className="w-40 h-16 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-xl shadow-2xl p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-mono font-bold text-red-400 flex items-center gap-1">
                  <Keyboard className="w-3 h-3" /> {product.brand.toUpperCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-8 gap-0.5 px-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="h-2 bg-zinc-700 rounded-xs border border-zinc-600/60 shadow-inner" />
                ))}
              </div>
              <div className="w-16 h-1.5 bg-zinc-600 rounded-full mx-auto" />
            </div>
          ) : isMouse ? (
            <div className="w-14 h-24 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-3xl shadow-2xl p-1.5 flex flex-col items-center justify-between relative overflow-hidden">
              {name.toLowerCase().includes('rgb') || name.toLowerCase().includes('gaming') ? (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-cyan-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
              ) : null}
              <div className="w-full flex justify-center gap-1 pt-1">
                <div className="w-4 h-6 bg-zinc-700 rounded-t-lg border border-zinc-600" />
                <div className="w-1.5 h-4 bg-red-500 rounded-full border border-red-300 my-auto shadow-xs" />
                <div className="w-4 h-6 bg-zinc-700 rounded-t-lg border border-zinc-600" />
              </div>
              <div className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-tighter">
                {product.brand}
              </div>
              <div className="w-8 h-2 bg-zinc-800 rounded-full border border-zinc-700" />
            </div>
          ) : isPower ? (
            <div className="w-28 h-24 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-xl shadow-2xl p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/80 px-1 rounded border border-emerald-700/50">PROTECTED</span>
              </div>
              <div className="space-y-1 my-auto">
                <div className="flex justify-around items-center bg-zinc-950 p-1 rounded border border-zinc-800">
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                  </div>
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                  </div>
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="text-center text-[8px] font-mono text-zinc-300 uppercase font-bold">
                {product.brand} • {product.model || 'POWER'}
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-2xl shadow-2xl p-2 flex flex-col items-center justify-center">
              <Headphones className="w-8 h-8 text-red-500 animate-pulse" />
              <span className="text-[8px] font-mono text-zinc-300 mt-1 font-bold">{product.brand}</span>
            </div>
          )}
        </div>

        <div className="mt-3 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/60 flex items-center gap-1">
            {isKeyboard ? <Keyboard className="w-3 h-3 text-red-400" /> : isMouse ? <Mouse className="w-3 h-3 text-red-400" /> : isPower ? <Zap className="w-3 h-3 text-amber-400" /> : <Plug className="w-3 h-3 text-red-400" />}
            {isKeyboard ? 'KEYBOARD PERIPHERAL' : isMouse ? 'PRECISION MOUSE' : isPower ? 'POWER & SURGE BACKUP' : 'GENUINE ACCESSORY'}
          </span>
        </div>
      </div>
    );
  }

  // Feature Phones (Keypad Phones)
  if (isFeaturePhone) {
    return (
      <div className={`relative w-full h-full min-h-[200px] bg-gradient-to-br ${theme.bgGradient} p-3 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:10px_10px]" />

        {/* Keypad Phone Body */}
        <div className="relative z-10 w-28 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-600 rounded-2xl p-2.5 shadow-2xl flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
          {/* Top Speaker & Flashlight */}
          <div className="w-full flex justify-between items-center mb-1.5 px-1">
            <div className="w-2 h-1 bg-red-500 rounded-full" title="Torch LED" />
            <div className="w-8 h-1 bg-zinc-600 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          </div>

          {/* Color Display Screen */}
          <div className="w-full h-16 bg-gradient-to-b from-blue-950 via-slate-900 to-black rounded-lg border border-blue-500/40 p-1 flex flex-col justify-between overflow-hidden shadow-inner">
            <div className="flex justify-between items-center text-[7px] font-mono text-blue-300">
              <span className="flex items-center gap-0.5"><Wifi className="w-2 h-2" /> 2G/4G</span>
              <span className="text-emerald-400"><BatteryCharging className="w-2 h-2" /></span>
            </div>
            <div className="text-center my-auto">
              <p className="text-[10px] font-extrabold text-white tracking-wider uppercase drop-shadow">{product.brand}</p>
              <p className="text-[7px] font-mono text-zinc-300">{product.name.replace(/(Feature Phone|Phone)/gi, '').trim()}</p>
            </div>
            <div className="text-[7px] font-mono text-red-300 text-center bg-red-950/60 rounded">
              FM RADIO & TORCH
            </div>
          </div>

          {/* D-Pad Navigation Buttons */}
          <div className="w-full my-1.5 flex items-center justify-between px-1">
            <div className="w-5 h-3 bg-zinc-700 rounded text-[7px] font-mono text-zinc-300 flex items-center justify-center font-bold">―</div>
            <div className="w-7 h-5 bg-gradient-to-b from-red-600 to-red-700 rounded-md border border-red-400 shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
              OK
            </div>
            <div className="w-5 h-3 bg-zinc-700 rounded text-[7px] font-mono text-zinc-300 flex items-center justify-center font-bold">―</div>
          </div>

          {/* 3x4 Physical T9 Keypad */}
          <div className="w-full grid grid-cols-3 gap-0.5 text-center font-mono text-[7px] text-zinc-200">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
              <div key={key} className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xs py-0.5 font-bold shadow-xs">
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Tag */}
        <div className="mt-2 z-10 flex items-center gap-1">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-red-400 border border-zinc-700">
            LONG BATTERY & TORCH
          </span>
        </div>
      </div>
    );
  }

  // Modern Smartphones (iPhone & Android)
  return (
    <div className={`relative w-full h-full min-h-[200px] bg-gradient-to-br ${theme.bgGradient} p-3 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
      
      {/* Phone Chassis Container */}
      <div className="relative z-10 flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
        
        {/* Phone Frame */}
        <div className={`relative w-28 h-48 ${theme.deviceBody} rounded-[2rem] border-2 p-2 shadow-2xl flex flex-col justify-between overflow-hidden relative`}>
          
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
            {isApple ? (
              <div className="w-10 h-2.5 bg-black rounded-full border border-zinc-800 flex items-center justify-end px-1 shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>
            ) : (
              <div className="w-2.5 h-2.5 bg-black rounded-full border border-zinc-800 shadow-inner" />
            )}
          </div>

          {/* Screen Glass Viewport */}
          <div className="w-full h-full bg-gradient-to-b from-slate-900/95 via-zinc-950 to-black rounded-[1.5rem] border border-zinc-800/80 p-2 flex flex-col justify-between relative overflow-hidden">
            
            {/* Screen Top HUD Header */}
            <div className="flex justify-between items-center text-[7px] font-mono text-zinc-400 pt-3 px-0.5">
              <span className="font-bold text-red-500 tracking-wider uppercase">{theme.brandLabel}</span>
              <span className="text-emerald-400 font-semibold">100% CLEAN</span>
            </div>

            {/* Screen Center Device Branding */}
            <div className="my-auto text-center px-1">
              <p className="text-[11px] font-black text-white uppercase tracking-tight leading-tight drop-shadow">
                {product.model || product.name.split('(')[0]}
              </p>
              {ram && storage && (
                <p className="text-[9px] font-mono font-bold text-red-300 mt-1 bg-red-950/60 border border-red-800/50 py-0.5 px-1 rounded-md inline-block">
                  {ram} / {storage}
                </p>
              )}
            </div>

            {/* Screen Bottom Spec Bar */}
            <div className="space-y-0.5 text-[7.5px] font-mono text-zinc-300 border-t border-zinc-800/80 pt-1">
              {camera && (
                <div className="flex items-center justify-between text-zinc-300">
                  <span>CAM:</span>
                  <span className="text-white font-bold">{camera.split('/')[0]}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-zinc-400">
                <span>VER:</span>
                <span className="text-emerald-400 font-bold">{isApple ? 'EX-US ORIGINAL' : 'NEW BRAND'}</span>
              </div>
            </div>
          </div>

          {/* Rear Camera Island Silhouette (Simulated Reflection) */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-600/60 p-1 grid grid-cols-2 gap-0.5 opacity-90 shadow-lg pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-black border border-zinc-500" />
            <div className="w-2 h-2 rounded-full bg-black border border-zinc-500" />
            <div className="w-2 h-2 rounded-full bg-black border border-zinc-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          </div>
        </div>
      </div>

      {/* Spec Pills below Phone */}
      <div className="mt-2.5 z-10 flex items-center gap-1.5 flex-wrap justify-center">
        {ram && (
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
            {ram} RAM
          </span>
        )}
        {storage && (
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700">
            {storage} STORAGE
          </span>
        )}
      </div>
    </div>
  );
};
