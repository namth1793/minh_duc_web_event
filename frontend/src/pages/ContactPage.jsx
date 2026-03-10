import { useState } from 'react';
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

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '', event_date: '', attendees: '',
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', event_date: '', attendees: '' });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    {
      icon: '📞',
      label: 'Phone',
      value: t('contactPage.info.phone'),
      link: `tel:${t('contactPage.info.phone').replace(/\s/g, '')}`,
    },
    {
      icon: '✉️',
      label: 'Email',
      value: t('contactPage.info.email'),
      link: `mailto:${t('contactPage.info.email')}`,
    },
    {
      icon: '📍',
      label: 'Address',
      value: t('contactPage.info.address'),
    },
    {
      icon: '🕐',
      label: 'Hours',
      value: t('contactPage.info.hours'),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80"
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
            {t('contactPage.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('contactPage.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-3">
                Reach Out
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl text-dark font-light mb-4 leading-tight">
                {t('contactPage.form.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />

              <motion.form
                onSubmit={handleSubmit}
                variants={stagger}
                className="space-y-5"
              >
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                      {t('contactPage.form.name')} *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="luxury-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                      {t('contactPage.form.email')} *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="luxury-input"
                      placeholder="your@email.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                      {t('contactPage.form.phone')}
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="luxury-input"
                      placeholder="+84..."
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                      {t('contactPage.form.attendees')}
                    </label>
                    <input
                      name="attendees"
                      value={form.attendees}
                      onChange={handleChange}
                      className="luxury-input"
                      placeholder="Estimated guests"
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                    {t('contactPage.form.eventDate')}
                  </label>
                  <input
                    name="event_date"
                    type="date"
                    value={form.event_date}
                    onChange={handleChange}
                    className="luxury-input"
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                    {t('contactPage.form.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="luxury-textarea"
                    placeholder="Tell us about your event and any specific requirements..."
                  />
                </motion.div>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 font-sans text-sm"
                  >
                    {t('contactPage.form.success')}
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 font-sans text-sm"
                  >
                    {t('contactPage.form.error')}
                  </motion.div>
                )}

                <motion.div variants={fadeUp}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : t('contactPage.form.submit')}
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-3">
                Find Us
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl text-dark font-light mb-4">
                {t('contactPage.info.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />

              <motion.div variants={stagger} className="space-y-6 mb-10">
                {infoItems.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-cream flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-1">{item.label}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="font-sans text-sm text-gray-600 hover:text-gold transition-colors whitespace-pre-line"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-sm text-gray-600 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Google Maps Embed */}
              <motion.div
                variants={fadeUp}
                className="overflow-hidden border border-cream-dark"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.5!2d108.2603!3d15.9697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDU4JzEwLjkiTiAxMDjCsDE1JzM3LjEiRQ!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Minh Đức Events Location"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="py-14 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Quick Connect</p>
              <h3 className="font-serif text-2xl text-dark">Prefer to Call or Email?</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+842361234567"
                className="btn-primary text-center"
              >
                Call +84 236 123 4567
              </a>
              <a
                href="mailto:events@minhduc.vn"
                className="btn-secondary text-center"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
