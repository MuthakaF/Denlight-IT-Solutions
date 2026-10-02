import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  onOpenWhatsApp: (text?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenWhatsApp }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceInterest: 'Smartphone Financing (Lipa Mdogo Mdogo)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = `Hello Denlight IT Solutions, my name is ${formData.name} (${formData.phone}).
Interest: ${formData.serviceInterest}
Message: ${formData.message}`;
    
    setTimeout(() => {
      onOpenWhatsApp(msg);
      setSubmitted(false);
    }, 1200);
  };

  return (
    <section id="contact" className="bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-4 h-4 text-black" />
            <span>Naivasha Store</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            CONTACT & LOCATION.
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Have questions regarding smartphone financing or IT repair services? Contact Denlight IT Solutions Naivasha directly or visit our shop on Moi Avenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
          
          {/* Contact Cards Info Column */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-4">
              <h3 className="text-lg font-black text-zinc-950 uppercase border-b border-zinc-200 pb-3">
                Store Information
              </h3>

              <div className="space-y-3.5 text-xs">
                
                <a
                  href="tel:+254712124922"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all text-zinc-900"
                >
                  <div className="p-2.5 rounded-lg bg-zinc-100 text-black shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Lipa Mdogo Mdogo & Sales</span>
                    <strong className="text-sm font-bold text-black">+254 712 124 922</strong>
                  </div>
                </a>

                <a
                  href="tel:+254719798972"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all text-zinc-900"
                >
                  <div className="p-2.5 rounded-lg bg-zinc-100 text-black shrink-0">
                    <Phone className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Tech Lab (Laptops, Repairs & CCTV)</span>
                    <strong className="text-sm font-bold text-black">+254 719 798 972</strong>
                  </div>
                </a>

                <a
                  href="mailto:support@denlightitsolutions.co.ke"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-black transition-all text-zinc-900"
                >
                  <div className="p-2.5 rounded-lg bg-zinc-100 text-black shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Official Support Email</span>
                    <strong className="text-sm font-bold text-black break-all">support@denlightitsolutions.co.ke</strong>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900">
                  <div className="p-2.5 rounded-lg bg-zinc-100 text-black shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Physical Store</span>
                    <strong className="text-xs font-bold text-black">Kariuki Chotara road, next to Naivas ndogo, Naivasha</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900">
                  <div className="p-2.5 rounded-lg bg-zinc-100 text-black shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block">Hours</span>
                    <strong className="text-xs font-bold text-black">Mon - Sat: 8:00 AM - 7:00 PM</strong>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">Sunday: Closed</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Map Preview Graphic */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-700">
                <span>Naivasha Store Location</span>
                <span className="text-black font-bold text-[10px] uppercase">Kariuki Chotara Road</span>
              </div>
              <div className="relative h-44 rounded-xl bg-white border border-zinc-200 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                
                {/* Map Pin */}
                <div className="relative text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-black text-white font-bold flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <strong className="text-xs font-black text-black uppercase block">Denlight IT Solutions</strong>
                  <span className="text-[10px] font-mono text-zinc-500 block">Kariuki Chotara road, next to Naivas ndogo, Naivasha</span>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-zinc-50 p-6 sm:p-8 rounded-2xl border border-zinc-200 space-y-6">
            <div>
              <h3 className="text-xl font-black text-zinc-950 uppercase">SEND US A MESSAGE</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Fill out your details to connect directly with Denlight IT Solutions Naivasha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 font-mono font-bold uppercase mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Kamau"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-mono font-bold uppercase mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0722123456"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-mono font-bold uppercase mb-1">Service or Phone Interest:</label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-black"
                >
                  <option value="Smartphone Financing (Lipa Mdogo Mdogo)">Smartphone Financing (Lipa Mdogo Mdogo - WATU / OnFon / MOGO)</option>
                  <option value="Cash Smartphone Purchase">Cash Smartphone Purchase</option>
                  <option value="Laptop / PC Repair">Laptop / Computer Repair</option>
                  <option value="Networking Services">Networking & Wi-Fi Setup Services</option>
                  <option value="Internet Connectivity">Internet Connectivity Links in Naivasha</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-mono font-bold uppercase mb-1">Details or Inquiry:</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="State the phone model or repair service you require..."
                  className="w-full bg-white border border-zinc-300 rounded-xl p-4 text-zinc-900 focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    Submit & Chat on WhatsApp
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
