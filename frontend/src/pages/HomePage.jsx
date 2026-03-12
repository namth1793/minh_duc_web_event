import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const services = [
  {
    slug: 'event',
    titleKey: 'services.event.title',
    descKey: 'services.event.desc',
    itemsKey: 'services.event.items',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    slug: 'booth',
    titleKey: 'services.booth.title',
    descKey: 'services.booth.desc',
    itemsKey: 'services.booth.items',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
  },
  {
    slug: 'livestream',
    titleKey: 'services.livestream.title',
    descKey: 'services.livestream.desc',
    itemsKey: 'services.livestream.items',
    img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
  },
  {
    slug: 'creative',
    titleKey: 'services.creative.title',
    descKey: 'services.creative.desc',
    itemsKey: 'services.creative.items',
    img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
  },
];

const processSteps = [
  { num: '01', titleKey: 'process.step1.title', descKey: 'process.step1.desc' },
  { num: '02', titleKey: 'process.step2.title', descKey: 'process.step2.desc' },
  { num: '03', titleKey: 'process.step3.title', descKey: 'process.step3.desc' },
  { num: '04', titleKey: 'process.step4.title', descKey: 'process.step4.desc' },
  { num: '05', titleKey: 'process.step5.title', descKey: 'process.step5.desc' },
];

const whyReasons = [
  { titleKey: 'why.r1.title', descKey: 'why.r1.desc' },
  { titleKey: 'why.r2.title', descKey: 'why.r2.desc' },
  { titleKey: 'why.r3.title', descKey: 'why.r3.desc' },
  { titleKey: 'why.r4.title', descKey: 'why.r4.desc' },
  { titleKey: 'why.r5.title', descKey: 'why.r5.desc' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', event_date: '', attendees: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', event_date: '', attendees: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
            alt="Elevate Media events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="font-sans text-xs tracking-widest uppercase text-gold mb-6"
          >
            Elevate Media
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-4"
          >
            {t('hero.tagline')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-sans text-sm md:text-base text-gold/90 tracking-wider mb-6 font-medium"
          >
            {t('about.title')}.
          </motion.p>

          <motion.div variants={fadeUp} className="gold-divider mb-8" />

          <motion.p
            variants={fadeUp}
            className="font-sans text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-gold"
            >
              {t('hero.exploreEvents')}
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="border border-white text-white px-8 py-3 tracking-widest uppercase text-xs font-sans font-medium hover:bg-white hover:text-dark transition-all duration-300"
            >
              {t('hero.inquireNow')}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-xs tracking-widest uppercase text-white/50">Scroll</span>
          <div className="w-0.5 h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section id="about" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="img-hover-zoom relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"
                alt="Elevate Media team"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gold/20 -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 border border-gold/30 -z-10" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {t('about.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-2">
                {t('about.title')}
              </motion.h2>
              <motion.p variants={fadeUp} className="font-sans text-sm text-gold/80 tracking-wider mb-6 font-medium">
                {t('about.tagline')}
              </motion.p>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5">
                {t('about.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5">
                {t('about.p2')}
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-2 mb-8">
                {[t('about.tagline1'), t('about.tagline2'), t('about.tagline3')].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    <span className="font-sans text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <a
                  href="#services"
                  onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="btn-primary"
                >
                  {t('hero.exploreEvents')}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== OUR SERVICES ===== */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('services.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4">
              {t('services.sectionTitle')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
            <motion.p variants={fadeUp} className="font-sans text-gray-500 max-w-xl mx-auto">
              {t('services.sectionSubtitle')}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="group bg-cream border border-cream-dark hover:border-gold transition-all duration-300 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: (idx % 2) * 0.1 } } }}
              >
                <div className="img-hover-zoom">
                  <img src={service.img} alt="" className="w-full h-48 object-cover" />
                </div>
                <div className="p-8">
                  <Link to={`/services/${service.slug}`}>
                    <h3 className="font-serif text-dark text-2xl mb-2 hover:text-gold transition-colors duration-200 cursor-pointer">{t(service.titleKey)}</h3>
                  </Link>
                  <div className="w-8 h-0.5 bg-gold mb-4" />
                  <p className="font-sans text-gray-600 text-sm leading-relaxed mb-5">{t(service.descKey)}</p>
                  <ul className="space-y-2">
                    {(t(service.itemsKey, { returnObjects: true }) || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 font-sans text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKING PROCESS ===== */}
      <section id="process" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('process.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl text-white font-light mb-4">
              {t('process.sectionTitle')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
            <motion.p variants={fadeUp} className="font-sans text-gray-400 max-w-xl mx-auto">
              {t('process.sectionSubtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative border border-white/10 p-6 hover:border-gold transition-colors duration-300 text-center group"
              >
                <div className="font-serif text-5xl text-gold/30 group-hover:text-gold/60 transition-colors duration-300 mb-4 leading-none">
                  {step.num}
                </div>
                <h3 className="font-serif text-white text-lg mb-3">{t(step.titleKey)}</h3>
                <div className="w-6 h-0.5 bg-gold mx-auto mb-3" />
                <p className="font-sans text-xs text-gray-400 leading-relaxed">{t(step.descKey)}</p>
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gold/30 z-10" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section id="why-us" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('whyus.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4">
              {t('whyus.sectionTitle')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {whyReasons.map((reason, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-white p-8 border border-cream-dark hover:border-gold transition-all duration-300 flex gap-5"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold font-serif text-lg">✔</span>
                </div>
                <div>
                  <h3 className="font-serif text-dark text-xl mb-2">{t(reason.titleKey)}</h3>
                  <p className="font-sans text-gray-500 text-sm leading-relaxed">{t(reason.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section id="mission" className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80"
            alt="Elevate Media mission"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-6">
              {t('mission.eyebrow')}
            </motion.p>
            <motion.div variants={fadeUp} className="gold-divider mb-10" />
            <motion.blockquote
              variants={fadeUp}
              className="font-serif text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed italic mb-8"
            >
              "{t('mission.quote')}"
            </motion.blockquote>
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-sm text-gold/80 tracking-widest">
              — Elevate Media
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { number: '200+', labelKey: 'stats.projects' },
              { number: '100+', labelKey: 'stats.clients' },
              { number: '5+', labelKey: 'stats.years' },
              { number: '98%', labelKey: 'stats.satisfaction' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="font-serif text-5xl text-gold mb-2">{stat.number}</div>
                <div className="font-sans text-xs tracking-widest uppercase text-white/60">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section id="contact" className="py-24 bg-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-6">
              Get Started
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl text-white font-light mb-6 leading-tight">
              {t('cta.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
              {t('cta.subtitle')}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-gold">
                {t('cta.startPlanning')}
              </Link>
              <Link to="/business-events" className="border border-white/30 text-white px-8 py-3 tracking-widest uppercase text-xs font-sans hover:border-gold hover:text-gold transition-all duration-300">
                {t('cta.viewVenues')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: info panel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {t('contactInfo.title')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
                {t('cta.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-10" />

              <motion.div variants={stagger} className="space-y-8">
                {[
                  { label: t('contactInfo.phone.label'), value: t('contactInfo.phone.value') },
                  { label: t('contactInfo.email.label'), value: t('contactInfo.email.value') },
                  { label: t('contactInfo.address.label'), value: t('contactInfo.address.value') },
                  { label: t('contactInfo.hours.label'), value: t('contactInfo.hours.value') },
                ].map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="flex gap-6 items-start">
                    <div className="w-0.5 h-10 bg-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-1">{item.label}</p>
                      <p className="font-sans text-sm text-gray-700 leading-relaxed">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white p-10 shadow-sm"
            >
              <h3 className="font-serif text-2xl text-dark mb-2">{t('contactPage.form.title')}</h3>
              <div className="gold-divider-left mb-8" />

              {status === 'success' ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />
                  <p className="font-serif text-xl text-dark mb-3">{t('contactPage.form.success')}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/50 hover:border-gold transition-colors mt-4"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-2">
                        {t('contactPage.form.name')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="luxury-input"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-2">
                        {t('contactPage.form.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="luxury-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-2">
                        {t('contactPage.form.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="luxury-input"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-2">
                        {t('contactPage.form.eventDate')}
                      </label>
                      <input
                        type="date"
                        name="event_date"
                        value={form.event_date}
                        onChange={handleChange}
                        className="luxury-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-2">
                      {t('contactPage.form.message')} *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="luxury-textarea"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="font-sans text-xs text-red-500">{t('contactPage.form.error')}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? '...' : t('contactPage.form.submit')}
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
