import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useAdmin } from '../context/AdminContext';

export default function Footer() {
  const { t } = useTranslation();
  const { isAdminLoggedIn } = useAdmin();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/#about', label: t('nav.aboutUs') },
    { to: '/#services', label: t('nav.ourServices') },
    { to: '/#process', label: t('nav.workingProcess') },
    { to: '/#why-us', label: t('nav.whyChooseUs') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/careers', label: t('nav.careers') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-dark text-white">
      {/* Top gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={logo}
              alt="Elevate Media"
              className="h-16 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-5">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-gray-400 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-5">
              Contact
            </h4>
            <div className="space-y-3">
              <p className="font-sans text-sm text-gray-400">
                <span className="block text-white text-xs mb-0.5">Phone</span>
                +84 236 123 4567
              </p>
              <p className="font-sans text-sm text-gray-400">
                <span className="block text-white text-xs mb-0.5">Email</span>
                info@elevatemedia.vn
              </p>
              <p className="font-sans text-sm text-gray-400">
                <span className="block text-white text-xs mb-0.5">Address</span>
                123 Trần Phú, Hải Châu<br />
                Đà Nẵng, Vietnam
              </p>
              <p className="font-sans text-sm text-gray-400">
                <span className="block text-white text-xs mb-0.5">Hours</span>
                Mon–Sun: 8:00 AM – 9:00 PM
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-5">
              {t('footer.connect')}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-gray-400 hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {t('footer.facebook')}
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-gray-400 hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {t('footer.instagram')}
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-gray-400 hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {t('footer.linkedin')}
              </a>
            </div>

            {/* Newsletter teaser */}
            <div className="mt-8">
              <p className="font-sans text-xs text-gray-500 uppercase tracking-wider mb-3">
                Stay Inspired
              </p>
              <Link
                to="/contact"
                className="inline-block font-sans text-xs tracking-widest uppercase border border-gold/40 text-gold px-5 py-2 hover:bg-gold hover:text-white transition-all duration-300"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="font-sans text-xs text-gray-500">
              {t('footer.copyright')}
            </p>
            <Link
              to={isAdminLoggedIn ? '/admin' : '/admin/login'}
              className="font-sans text-xs text-gray-700 hover:text-gray-500 transition-colors duration-200"
            >
              {isAdminLoggedIn ? 'Admin Panel' : 'Admin'}
            </Link>
          </div>
          <p className="font-sans text-xs text-gray-600">
            Crafted with care in Đà Nẵng, Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
