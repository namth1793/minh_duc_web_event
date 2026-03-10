import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const events = [
  {
    key: 'wedding',
    img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    reverse: false,
  },
  {
    key: 'anniversary',
    img: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&q=80',
    reverse: true,
  },
  {
    key: 'birthday',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&q=80',
    reverse: false,
  },
  {
    key: 'dinnerParty',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    reverse: true,
  },
  {
    key: 'privateCelebration',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    reverse: false,
  },
];

export default function LifestyleEventsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', event_date: '', guests: '', info: '', newsletter: false,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/api/event-inquiry', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', event_date: '', guests: '', info: '', newsletter: false });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"
            alt="Lifestyle Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
            {t('lifestylePage.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('lifestylePage.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Event Sections */}
      {events.map((ev, idx) => (
        <section
          key={ev.key}
          className={`py-20 ${idx % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${ev.reverse ? 'lg:flex-row-reverse' : ''}`}
              style={{ direction: 'ltr' }}
            >
              <motion.div
                className={`img-hover-zoom ${ev.reverse ? 'lg:order-2' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, x: ev.reverse ? 40 : -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
              >
                <img
                  src={ev.img}
                  alt={t(`lifestyle.${ev.key}.title`)}
                  className="w-full h-[420px] object-cover"
                />
              </motion.div>

              <motion.div
                className={ev.reverse ? 'lg:order-1' : ''}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-3">
                  {t('lifestyle.eyebrow')}
                </motion.p>
                <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-4 leading-tight">
                  {t(`lifestyle.${ev.key}.title`)}
                </motion.h2>
                <motion.div variants={fadeUp} className="gold-divider-left mb-6" />
                <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg mb-8">
                  {t(`lifestyle.${ev.key}.desc`)}
                </motion.p>
                <motion.p variants={fadeUp} className="font-sans text-gray-500 leading-relaxed mb-8">
                  At Minh Đức Events, every celebration is crafted as a unique masterpiece. Our dedicated team of coordinators, designers, and culinary experts work in perfect harmony to bring your vision to life, ensuring each moment exceeds your highest expectations.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <a href="#inquiry" className="btn-primary">
                    Inquire About This Event
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Inquiry Form */}
      <section id="inquiry" className="py-24 bg-dark">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              Get In Touch
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-white font-light mb-4">
              {t('lifestylePage.inquiry.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-6" />
            <motion.p variants={fadeUp} className="font-sans text-gray-400">
              {t('lifestylePage.inquiry.subtitle')}
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={fadeUp}>
                <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                  {t('lifestylePage.inquiry.name')} *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="luxury-input bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-gold"
                  placeholder="Your full name"
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                  {t('lifestylePage.inquiry.email')} *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="luxury-input bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-gold"
                  placeholder="your@email.com"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={fadeUp}>
                <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                  {t('lifestylePage.inquiry.phone')}
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="luxury-input bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-gold"
                  placeholder="+84..."
                />
              </motion.div>
              <motion.div variants={fadeUp}>
                <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                  {t('lifestylePage.inquiry.eventDate')}
                </label>
                <input
                  name="event_date"
                  type="date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="luxury-input bg-white/5 border-white/20 text-white focus:border-gold"
                />
              </motion.div>
            </div>

            <motion.div variants={fadeUp}>
              <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                {t('lifestylePage.inquiry.guests')}
              </label>
              <input
                name="guests"
                value={form.guests}
                onChange={handleChange}
                className="luxury-input bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-gold"
                placeholder="Estimated number of guests"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <label className="block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2">
                {t('lifestylePage.inquiry.info')}
              </label>
              <textarea
                name="info"
                value={form.info}
                onChange={handleChange}
                rows={4}
                className="luxury-textarea bg-white/5 border-white/20 text-white placeholder-gray-500 focus:border-gold"
                placeholder="Tell us about your vision..."
              />
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-start gap-3">
              <input
                type="checkbox"
                name="newsletter"
                id="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
                className="mt-1 accent-gold"
              />
              <label htmlFor="newsletter" className="font-sans text-sm text-gray-400 cursor-pointer">
                {t('lifestylePage.inquiry.newsletter')}
              </label>
            </motion.div>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border border-green-600/30 text-green-400 px-5 py-4 font-sans text-sm"
              >
                {t('lifestylePage.inquiry.success')}
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-600/30 text-red-400 px-5 py-4 font-sans text-sm"
              >
                {t('lifestylePage.inquiry.error')}
              </motion.div>
            )}

            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : t('lifestylePage.inquiry.submit')}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
