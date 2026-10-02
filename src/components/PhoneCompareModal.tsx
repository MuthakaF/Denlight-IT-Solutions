import React from 'react';
import { PhoneProduct } from '../types';
import { getProductImageUrl, hasCustomProductImage } from '../utils/imageStorage';
import { DeviceGraphic } from './DeviceGraphic';
import { X, Trash2, Smartphone, MessageSquare } from 'lucide-react';

interface PhoneCompareModalProps {
  products: PhoneProduct[];
  onClose: () => void;
  onRemove: (product: PhoneProduct) => void;
  onClearAll: () => void;
  onOpenWhatsApp: (text?: string) => void;
}

export const PhoneCompareModal: React.FC<PhoneCompareModalProps> = ({
  products,
  onClose,
  onRemove,
  onClearAll,
  onOpenWhatsApp
}) => {
  if (products.length === 0) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-xl font-black text-black flex items-center gap-2 uppercase tracking-tight font-display">
              <Smartphone className="w-5 h-5 text-black" />
              Smartphone Specifications Comparison ({products.length})
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Compare hardware specs, cameras, battery capacity, and partner options in Naivasha</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-800 hover:bg-zinc-200 text-xs font-mono font-bold uppercase border border-zinc-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Comparison
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="p-3 text-zinc-400 uppercase font-bold w-36">Device</th>
                {products.map((phone) => {
                  const displayImageUrl = getProductImageUrl(phone.id, phone.imageUrl);
                  const hasCustom = hasCustomProductImage(phone.id);
                  return (
                    <th key={phone.id} className="p-3 min-w-[220px]">
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-center relative group">
                        <button
                          onClick={() => onRemove(phone)}
                          className="absolute top-2 right-2 text-zinc-400 hover:text-black p-1"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={displayImageUrl}
                          alt={phone.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-20 h-20 object-contain mx-auto mb-2"
                        />
                        <h4 className="text-sm font-black text-black line-clamp-1 font-display">{phone.name}</h4>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{phone.brand}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              <tr>
                <td className="p-3 font-bold text-zinc-500 uppercase bg-zinc-50">Financing Partners</td>
                {products.map((p) => {
                  const partners = p.availablePartners || [];
                  return (
                    <td key={p.id} className="p-3 text-black font-bold">
                      {partners.includes('watu') && <span className="block text-emerald-600">WATU Simu Exclusive</span>}
                      {partners.includes('onfon') && <span className="block text-blue-600">OnFon Mobile</span>}
                      {partners.includes('mogo') && <span className="block text-red-600">MOGO Kenya (Oppo/Tecno/Infinix/Itel)</span>}
                      {partners.length === 0 && <span className="block text-zinc-500">Cash Purchase Only</span>}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-3 font-bold text-zinc-500 uppercase bg-zinc-50">Naivasha Store</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-semibold text-emerald-700">
                    Kariuki Chotara road (In Stock)
                  </td>
                ))}
              </tr>

              {/* Dynamic Spec Rows */}
              {['Storage & RAM', 'Display', 'Main Camera', 'Selfie Camera', 'Battery & Charging', 'Processor', 'OS & UI', 'Connectivity'].map((specKey) => (
                <tr key={specKey}>
                  <td className="p-3 font-bold text-zinc-500 uppercase bg-zinc-50">{specKey}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 font-medium">
                      {p.specs[specKey] || '-'}
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <td className="p-3 font-bold text-zinc-500 uppercase bg-zinc-50">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWhatsApp(`Hi Denlight IT Solutions, I compared ${p.name} and want to inquire about availability at Kariuki Chotara road, Naivasha.`);
                      }}
                      className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Inquire WhatsApp
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
