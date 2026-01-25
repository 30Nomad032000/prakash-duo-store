import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  href?: string;
}

export default function PromoBanner({
  title,
  subtitle,
  buttonText = "Shop Now",
  onButtonClick,
  href
}: PromoBannerProps) {
  const BannerContent = () => (
    <div className="w-full bg-gradient-to-r from-burgundy via-burgundy to-gold py-12 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90">
              {subtitle}
            </p>
          )}
        </div>
        
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="group relative inline-flex items-center gap-2 bg-white text-burgundy px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-gold hover:text-white hover:shadow-xl"
          >
            {buttonText}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-95 transition-opacity">
        <BannerContent />
      </a>
    );
  }

  return <BannerContent />;
}
