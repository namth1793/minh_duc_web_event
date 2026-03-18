import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const SERVICE_DEFAULTS = {
  event: {
    heroImg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    titleKey: 'services.event.title',
    descKey: 'services.event.desc',
    itemsKey: 'services.event.items',
  },
  booth: {
    heroImg: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80',
    titleKey: 'services.booth.title',
    descKey: 'services.booth.desc',
    itemsKey: 'services.booth.items',
  },
  livestream: {
    heroImg: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1920&q=80',
    titleKey: 'services.livestream.title',
    descKey: 'services.livestream.desc',
    itemsKey: 'services.livestream.items',
  },
  creative: {
    heroImg: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1920&q=80',
    titleKey: 'services.creative.title',
    descKey: 'services.creative.desc',
    itemsKey: 'services.creative.items',
  },
  sports: {
    heroImg: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&q=80',
    titleKey: 'services.sports.title',
    descKey: 'services.sports.desc',
    itemsKey: 'services.sports.items',
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [content, setContent] = useState(null);
  const [cardImg, setCardImg] = useState(null);

  const defaults = SERVICE_DEFAULTS[slug];

  useEffect(() => {
    api.get(`/api/content/service-${slug}`)
      .then((res) => { if (Object.keys(res.data).length > 0) setContent(res.data); })
      .catch(() => {});
    api.get('/api/content/home')
      .then((res) => {
        const ov = res.data?.[`service-${slug}`];
        if (ov?.content_en) {
          const en = JSON.parse(ov.content_en);
          if (en.img) setCardImg(en.img);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!defaults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <p className="font-sans text-gray-400 mb-6">Service not found.</p>
        <Link to="/#services" className="btn-primary">Back to Services</Link>
      </div>
    );
  }

  // Helper: get text from admin content or fall back to i18n
  const get = (sectionKey, field, fallback) => {
    if (!content?.[sectionKey]) return fallback;
    const data = lang === 'vi' ? content[sectionKey].vi : content[sectionKey].en;
    const parsed = typeof data === 'string' ? (() => { try { return JSON.parse(data); } catch { return null; } })() : data;
    return parsed?.[field] ?? fallback;
  };

  const getArray = (sectionKey, field, fallback) => {
    if (!content?.[sectionKey]) return fallback;
    const data = lang === 'vi' ? content[sectionKey].vi : content[sectionKey].en;
    const parsed = typeof data === 'string' ? (() => { try { return JSON.parse(data); } catch { return null; } })() : data;
    const val = parsed?.[field];
    return Array.isArray(val) ? val : fallback;
  };

  const heroImg = get('hero', 'heroImg', cardImg || defaults.heroImg);
  const eyebrow = get('hero', 'eyebrow', t('services.eyebrow'));
  const heroTitle = get('hero', 'title', t(defaults.titleKey));

  const sectionEyebrow = get('description', 'eyebrow', t('about.eyebrow'));
  const sectionTitle = get('description', 'title', t(defaults.titleKey));
  const p1 = get('description', 'p1', t(defaults.descKey));
  const p2 = get('description', 'p2', '');
  const features = getArray('features', 'items', t(defaults.itemsKey, { returnObjects: true }) || []);

  const ctaTitle = get('cta', 'title', t('cta.title'));
  const ctaBody = get('cta', 'body', t('cta.subtitle'));

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt={heroTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
            {eyebrow}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {heroTitle}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Description */}
      <section className="py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {sectionEyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4 leading-tight">
              {sectionTitle}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg mb-5">
              {p1}
            </motion.p>
            {p2 && (
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed">
                {p2}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features / What We Offer */}
      {features.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {lang === 'vi' ? 'Những Gì Chúng Tôi Cung Cấp' : 'What We Offer'}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl text-dark font-light mb-4">
                {lang === 'vi' ? 'Dịch Vụ Chi Tiết' : 'Service Details'}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-10" />
              <motion.div
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {features.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-4 bg-cream p-6 border border-cream-dark hover:border-gold transition-colors duration-200"
                  >
                    <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-2" />
                    <span className="font-sans text-gray-700 leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-3xl text-white font-light mb-4">
              {ctaTitle}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-gray-400 mb-8 leading-relaxed">
              {ctaBody}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-gold">
                {t('hero.inquireNow')}
              </Link>
              <Link to="/#services" className="border border-white/30 text-white px-8 py-3 tracking-widest uppercase text-xs font-sans hover:border-gold hover:text-gold transition-all duration-300">
                {lang === 'vi' ? 'Xem Tất Cả Dịch Vụ' : 'All Services'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
