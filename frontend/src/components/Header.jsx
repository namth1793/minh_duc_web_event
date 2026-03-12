import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Track active section on home page
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = ['services', 'home'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'home');
            break;
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  // type: 'anchor' = scroll-to-section on homepage | 'page' = direct route navigation
  const navLinks = [
    { label: t('nav.home'), id: 'home', href: '/', type: 'anchor' },
    { label: t('nav.aboutUs'), id: 'about', href: '/brand-story', type: 'page' },
    { label: t('nav.ourServices'), id: 'services', href: '/#services', type: 'anchor' },
    { label: t('nav.blog'), id: 'blog', href: '/blog', type: 'page' },
    { label: t('nav.careers'), id: 'careers', href: '/careers', type: 'page' },
    { label: t('nav.contact'), id: 'contact', href: '/contact', type: 'page' },
  ];

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileOpen(false);
    if (link.type === 'page') {
      navigate(link.href);
      return;
    }
    // anchor type
    if (link.id === 'home') {
      if (!isHome) navigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (isHome) {
      const el = document.getElementById(link.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(link.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
  };

  const headerBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-sm'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-dark' : 'text-white';

  const isActive = (link) => {
    if (link.type === 'page') {
      if (link.id === 'blog') return location.pathname.startsWith('/blog');
      return location.pathname === link.href;
    }
    if (!isHome) return false;
    return activeSection === link.id;
  };

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
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 pb-0.5 border-b border-transparent cursor-pointer
                  ${isActive(link)
                    ? 'text-gold border-gold'
                    : `${textColor} hover:text-gold hover:border-gold`
                  }`}
              >
                {link.label}
              </a>
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
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`font-sans text-sm tracking-widest uppercase py-2 border-b border-cream/50 transition-colors cursor-pointer
                    ${isActive(link) ? 'text-gold' : 'text-dark hover:text-gold'}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
