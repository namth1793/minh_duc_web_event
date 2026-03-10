import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/brand-story', label: t('nav.brandStory') },
    { to: '/lifestyle-events', label: t('nav.lifestyleEvents') },
    { to: '/business-events', label: t('nav.businessEvents') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/careers', label: t('nav.careers') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
  };

  const headerBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-sm'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-dark' : 'text-white';
  const logoColor = scrolled || !isHome ? 'text-gold' : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Elevate Media"
              className={`h-16 w-auto object-contain transition-all duration-500 ${scrolled || !isHome ? '' : 'brightness-0 invert'}`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `font-sans text-xs tracking-widest uppercase transition-colors duration-300 pb-0.5 border-b border-transparent
                  ${isActive
                    ? 'text-gold border-gold'
                    : `${textColor} hover:text-gold hover:border-gold`
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 flex items-center gap-1 ${textColor} hover:text-gold`}
            >
              <span className={i18n.language === 'en' ? 'text-gold font-semibold' : 'opacity-50'}>EN</span>
              <span className="opacity-30">|</span>
              <span className={i18n.language === 'vi' ? 'text-gold font-semibold' : 'opacity-50'}>VI</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled || !isHome ? 'bg-dark' : 'bg-white'} ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled || !isHome ? 'bg-dark' : 'bg-white'} ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled || !isHome ? 'bg-dark' : 'bg-white'} ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-cream overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `font-sans text-sm tracking-widest uppercase py-2 border-b border-cream/50 transition-colors
                    ${isActive ? 'text-gold' : 'text-dark hover:text-gold'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
