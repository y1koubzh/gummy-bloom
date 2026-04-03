import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function GetStartedButton({ onClick, className }: { onClick?: () => void, className?: string }) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <Button 
      onClick={onClick}
      className={`group relative overflow-hidden h-14 px-8 rounded-xl font-bold text-lg transition-all active:scale-95 ${className}`} 
      size="lg"
    >
      <span className={`${isArabic ? 'ml-8' : 'mr-8'} transition-opacity duration-500 group-hover:opacity-0`}>
        {isArabic ? "ابدأ الآن" : "Get Started"}
      </span>
      <i className={`absolute ${isArabic ? 'left-1' : 'right-1'} top-1 bottom-1 rounded-lg z-10 grid w-12 place-items-center transition-all duration-500 bg-white/20 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-white`}>
        <ChevronRight size={20} strokeWidth={3} aria-hidden="true" className={`${isArabic ? 'rotate-180' : ''}`} />
      </i>
    </Button>
  );
}
