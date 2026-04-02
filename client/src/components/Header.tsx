import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import SiteLogo from '@/components/SiteLogo';
import { ROUTES, SHOW_SITE_NAME_NEXT_TO_LOGO, SITE_NAME } from '@shared/constants';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { label: t('home'), href: ROUTES.HOME },
    { label: t('products'), href: ROUTES.PRODUCTS },
    { label: t('builder'), href: ROUTES.BUILDER },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo — الملف: client/public (انظر SITE_LOGO_PATH في shared/constants.ts) */}
          <div
            className="flex cursor-pointer items-center gap-2 sm:gap-3"
            onClick={() => navigate(ROUTES.HOME)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(ROUTES.HOME);
              }
            }}
            aria-label={SITE_NAME}
          >
            <SiteLogo />
            {SHOW_SITE_NAME_NEXT_TO_LOGO ? (
              <span className="hidden text-xl font-bold sm:inline">{SITE_NAME}</span>
            ) : null}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1 rounded transition-colors ${
                  language === 'ar'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                AR
              </button>
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => navigate(ROUTES.CART)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate(ROUTES.ACCOUNT)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                {user?.name || 'Account'}
              </button>
            ) : (
              <Button 
                onClick={() => navigate(ROUTES.ACCOUNT)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {t('login')}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4 border-t border-border pt-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
