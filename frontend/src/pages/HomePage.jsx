import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const lifestyleEvents = [
  {
    key: 'wedding',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
  },
  {
    key: 'anniversary',
    img: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80',
  },
  {
    key: 'dinnerParty',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    key: 'birthday',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
  },
  {
    key: 'privateCelebration',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  },
];

const businessEvents = [
  {
    key: 'galaDinner',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  },
  {
    key: 'conference',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
  {
    key: 'brandLaunch',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    key: 'corporateEvents',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
  {
    key: 'executiveMeeting',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', event_date: '', attendees: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

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
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"
            alt="Luxury event venue"
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
            Minh Đức Events
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-6"
          >
            {t('hero.tagline')}
          </motion.h1>

          <motion.div variants={fadeUp} className="gold-divider mb-8" />

          <motion.p
            variants={fadeUp}
            className="font-sans text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/lifestyle-events"
              className="btn-gold"
            >
              {t('hero.exploreEvents')}
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white px-8 py-3 tracking-widest uppercase text-xs font-sans font-medium hover:bg-white hover:text-dark transition-all duration-300"
            >
              {t('hero.inquireNow')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-xs tracking-widest uppercase text-white/50">Scroll</span>
          <div className="w-0.5 h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-24 bg-cream">
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
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                alt="Minh Duc Events venue"
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
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
                {t('about.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5">
                {t('about.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-8">
                {t('about.p2')}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/brand-story" className="btn-primary">
                  {t('about.discoverOurStory')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== LIFESTYLE EVENTS ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('lifestyle.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4">
              {t('lifestyle.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
            <motion.p variants={fadeUp} className="font-sans text-gray-500 max-w-xl mx-auto">
              {t('lifestyle.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {lifestyleEvents.map((ev) => (
              <motion.div
                key={ev.key}
                variants={fadeUp}
                className="group relative overflow-hidden cursor-pointer"
              >
                <div className="img-hover-zoom">
                  <img
                    src={ev.img}
                    alt={t(`lifestyle.${ev.key}.title`)}
                    className="w-full h-72 object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-white text-xl mb-1">{t(`lifestyle.${ev.key}.title`)}</h3>
                  <p className="font-sans text-white/70 text-sm mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                    {t(`lifestyle.${ev.key}.desc`)}
                  </p>
                  <Link
                    to="/lifestyle-events"
                    className="font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/50 pb-0.5 hover:border-gold transition-colors"
                  >
                    {t('lifestyle.explore')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BUSINESS EVENTS ===== */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('business.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4">
              {t('business.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
            <motion.p variants={fadeUp} className="font-sans text-gray-500 max-w-xl mx-auto">
              {t('business.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {businessEvents.map((ev) => (
              <motion.div
                key={ev.key}
                variants={fadeUp}
                className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="img-hover-zoom">
                  <img
                    src={ev.img}
                    alt={t(`business.${ev.key}.title`)}
                    className="w-full h-52 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-dark text-xl mb-2">{t(`business.${ev.key}.title`)}</h3>
                  <div className="w-8 h-0.5 bg-gold mb-3" />
                  <p className="font-sans text-gray-500 text-sm leading-relaxed mb-4">
                    {t(`business.${ev.key}.desc`)}
                  </p>
                  <Link
                    to="/business-events"
                    className="font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/50 pb-0.5 hover:border-gold transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80"
            alt="Philosophy background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/75" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-8">
              {t('philosophy.eyebrow')}
            </motion.p>
            <motion.div variants={fadeUp} className="gold-divider mb-10" />
            <motion.blockquote
              variants={fadeUp}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-light leading-relaxed italic mb-10"
            >
              "{t('philosophy.quote')}"
            </motion.blockquote>
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-sm text-gold/80 tracking-widest">
              {t('philosophy.author')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-24 bg-dark">
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
              <Link to="/lifestyle-events" className="border border-white/30 text-white px-8 py-3 tracking-widest uppercase text-xs font-sans hover:border-gold hover:text-gold transition-all duration-300">
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
                      {t('contactPage.form.attendees')}
                    </label>
                    <input
                      type="number"
                      name="attendees"
                      value={form.attendees}
                      onChange={handleChange}
                      min="1"
                      className="luxury-input"
                    />
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
