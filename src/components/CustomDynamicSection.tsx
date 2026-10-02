import React from 'react';
import { CustomWebsiteSection } from '../utils/superAdminManager';
import { ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface CustomDynamicSectionProps {
  section: CustomWebsiteSection;
  onNavigateTab: (tabId: string) => void;
  onOpenWhatsApp: (customText?: string) => void;
}

export const CustomDynamicSection: React.FC<CustomDynamicSectionProps> = ({
  section,
  onNavigateTab,
  onOpenWhatsApp
}) => {
  if (!section.isEnabled) return null;

  const handleActionClick = () => {
    if (section.buttonLinkType === 'whatsapp' || !section.buttonLinkType) {
      onOpenWhatsApp(`Hello, I am inquiring about: ${section.title}`);
    } else if (section.buttonLinkType === 'catalog') {
      onNavigateTab('catalog');
    } else if (section.buttonLinkType === 'financing') {
      onNavigateTab('financing');
    } else if (section.buttonLinkType === 'services') {
      onNavigateTab('services');
    } else if (section.buttonLinkType === 'location') {
      onNavigateTab('location');
    } else {
      onNavigateTab('catalog');
    }
  };

  // Theme styling definitions
  const themeStyles = {
    'vibrant-red': {
      container: 'bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white border-red-500 shadow-lg shadow-red-600/20',
      badge: 'bg-white/20 text-white border-white/30',
      title: 'text-white',
      subtitle: 'text-red-100',
      featureItem: 'text-white',
      featureIcon: 'text-red-200',
      button: 'bg-white hover:bg-slate-100 text-red-700 font-bold shadow-md'
    },
    'dark-slate': {
      container: 'bg-slate-900 text-white border-slate-800 shadow-xl',
      badge: 'bg-red-600/20 text-red-400 border-red-500/30',
      title: 'text-white',
      subtitle: 'text-slate-400',
      featureItem: 'text-slate-200',
      featureIcon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-md'
    },
    'clean-white': {
      container: 'bg-white text-slate-900 border-slate-200 shadow-sm hover:border-slate-300',
      badge: 'bg-red-50 text-red-600 border-red-200',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
      featureItem: 'text-slate-700',
      featureIcon: 'text-emerald-600',
      button: 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-md'
    },
    'subtle-gray': {
      container: 'bg-slate-100/90 text-slate-900 border-slate-200 shadow-2xs',
      badge: 'bg-slate-200 text-slate-800 border-slate-300',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
      featureItem: 'text-slate-700',
      featureIcon: 'text-red-600',
      button: 'bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md'
    }
  }[section.theme || 'clean-white'];

  return (
    <section className={`rounded-3xl border p-6 sm:p-8 lg:p-10 transition-all overflow-hidden relative ${themeStyles.container}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Content Column */}
        <div className={section.imageUrl ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4 max-w-4xl'}>
          {section.badge && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${themeStyles.badge}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{section.badge}</span>
            </div>
          )}

          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-display ${themeStyles.title}`}>
            {section.title}
          </h2>

          {section.subtitle && (
            <p className={`text-xs sm:text-sm leading-relaxed ${themeStyles.subtitle}`}>
              {section.subtitle}
            </p>
          )}

          {section.content && (
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${themeStyles.subtitle}`}>
              {section.content}
            </p>
          )}

          {section.features && section.features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {section.features.map((feat, idx) => (
                <div key={idx} className={`flex items-start gap-2 text-xs ${themeStyles.featureItem}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${themeStyles.featureIcon}`} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {section.buttonText && (
            <div className="pt-3">
              <button
                type="button"
                onClick={handleActionClick}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm tracking-wide transition-all cursor-pointer active:scale-95 ${themeStyles.button}`}
              >
                {section.buttonLinkType === 'whatsapp' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{section.buttonText}</span>
              </button>
            </div>
          )}
        </div>

        {/* Optional Section Image */}
        {section.imageUrl && (
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-h-72 rounded-2xl overflow-hidden bg-black/10 border border-black/10 flex items-center justify-center p-2">
              <img
                src={section.imageUrl}
                alt={section.title}
                className="max-h-64 w-full object-cover rounded-xl"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
