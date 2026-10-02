import React, { useState } from 'react';
import { PhoneProduct } from '../types';
import { getProductImageUrl } from '../utils/imageStorage';
import { getEffectiveProduct } from '../utils/superAdminManager';
import { X, CheckCircle2, MessageSquare, HardDrive, MapPin, ShieldCheck, Phone } from 'lucide-react';

interface ProductDetailModalProps {
  product: PhoneProduct | null;
  onClose: () => void;
  onOpenWhatsApp: (text?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
  onOpenWhatsApp
}) => {
  if (!initialProduct) return null;

  const product = getEffectiveProduct(initialProduct);

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#000000' }
  );

  const isSmartphone = product.category === 'smartphones';
  const partners = product.availablePartners || [];
  const displayImageUrl = getProductImageUrl(product.id, product.imageUrl);

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
        >
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:text-black hover:bg-zinc-200 transition-colors z-30 cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image & Colors */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={displayImageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (product.category === 'laptops-desktops') {
                      target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
                    } else if (product.category === 'printers-toners') {
                      target.src = 'https://images.unsplash.com/photo-1612815150350-025983794b63?auto=format&fit=crop&w=800&q=80';
                    } else if (product.category === 'oraimo-accessories') {
                      target.src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80';
                    } else if (product.category === 'networking-cctv') {
                      target.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                  className="max-h-full object-contain"
                />
                <span className="absolute top-3 left-3 z-20 bg-black text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase">
                  {product.brand}
                </span>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="text-xs text-zinc-500 font-mono font-bold uppercase block mb-2">Available Color Finishes:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          selectedColor.name === color.name
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-zinc-400" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Store availability badge */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>In stock at Kariuki Chotara road, next to Naivas ndogo, Naivasha.</span>
              </div>
            </div>

            {/* Right Column: Specs & Partner Options */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-black uppercase tracking-wider">{product.brand}</span>
                  {product.badge && (
                    <span className="text-[10px] bg-black text-white font-mono px-2 py-0.5 rounded uppercase font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 font-display">{product.name}</h2>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{product.description}</p>
              </div>

              {/* Partner Financing Banner for Smartphones */}
              {isSmartphone && (
                <div className="p-4 rounded-xl bg-zinc-950 text-white space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <span className="font-bold uppercase text-white">Financing Partners (Lipa Mdogo Mdogo)</span>
                  </div>
                  {partners.includes('watu') ? (
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Exclusive <strong className="text-white">WATU Simu</strong> financing supported for this Samsung Galaxy A07 at our Naivasha shop.
                    </p>
                  ) : partners.length > 0 ? (
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Supported by <strong className="text-white">OnFon Mobile</strong> & <strong className="text-white">MOGO Kenya</strong> (MOGO strictly supports Oppo, Tecno, Infinix, & Itel ONLY). Walk in with your Kenyan ID.
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Direct cash purchase or M-Pesa at Denlight IT Solutions. (WATU Simu is exclusive to Samsung A07; OnFon excludes Samsung/Nokia; MOGO is strictly Oppo, Tecno, Infinix, Itel).
                    </p>
                  )}
                  
                  <div className="pt-2 border-t border-zinc-800 flex items-center gap-2 flex-wrap text-[10px]">
                    {partners.includes('watu') && (
                      <span className="bg-emerald-500 text-black px-2.5 py-1 rounded font-bold">WATU SIMU</span>
                    )}
                    {partners.includes('onfon') && (
                      <span className="bg-blue-400 text-black px-2.5 py-1 rounded font-bold">ONFON MOBILE</span>
                    )}
                    {partners.includes('mogo') && (
                      <span className="bg-red-600 text-white px-2.5 py-1 rounded font-bold">MOGO (OPPO/TECNO/INFINIX/ITEL)</span>
                    )}
                    {partners.length === 0 && (
                      <span className="bg-zinc-800 text-white px-2.5 py-1 rounded border border-zinc-700 font-bold">CASH PURCHASE</span>
                    )}
                  </div>
                </div>
              )}

              {/* Complete Specifications Sheet */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-black uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Technical Specifications
                </h4>
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2.5 text-xs font-mono">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-12 gap-2 border-b border-zinc-200/80 pb-2 last:border-0 last:pb-0">
                      <span className="col-span-5 sm:col-span-4 text-zinc-500 font-semibold">{key}:</span>
                      <strong className="col-span-7 sm:col-span-8 text-zinc-950 font-bold">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                  <MapPin className="w-4 h-4 text-black shrink-0" />
                  <span>Visit Denlight IT Solutions on Kariuki Chotara road, next to Naivas ndogo, Naivasha.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWhatsApp(
                        `Hello Denlight IT Solutions, I want to inquire about ${product.name} (${selectedColor.name}) at your Kariuki Chotara road shop, Naivasha.`
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    Inquire via WhatsApp
                  </button>

                  <a
                    href="tel:+254712124922"
                    className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors border border-zinc-300 shadow-sm cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-black" />
                    Call Sales (+254 712 124 922)
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};
