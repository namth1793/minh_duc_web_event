import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function ApplyModal({ job, lang, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/career-apply', { ...form, job_id: job.id });
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative bg-white max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-sans text-gray-400 hover:text-dark text-lg"
        >
          ✕
        </button>

        <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">
          {t('careersPage.modal.title')}
        </p>
        <h3 className="font-serif text-2xl text-dark mb-1">
          {lang === 'vi' ? job.title_vi : job.title_en}
        </h3>
        <p className="font-sans text-sm text-warm mb-6">
          {lang === 'vi' ? job.department_vi : job.department_en} · {job.type}
        </p>
        <div className="gold-divider-left mb-6" />

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <p className="font-sans text-gray-600">{t('careersPage.modal.success')}</p>
            <button onClick={onClose} className="btn-primary mt-6">
              {t('careersPage.modal.close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                {t('careersPage.modal.name')} *
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
                {t('careersPage.modal.email')} *
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
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-gray-500 mb-1.5">
                {t('careersPage.modal.phone')}
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
                {t('careersPage.modal.message')}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="luxury-textarea"
                placeholder="Tell us about yourself and why you'd like to join Elevate Media..."
              />
            </div>

            {status === 'error' && (
              <p className="font-sans text-sm text-red-500">{t('careersPage.modal.error')}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : t('careersPage.modal.submit')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                {t('careersPage.modal.cancel')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CareersPage() {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    api.get('/api/careers')
      .then((res) => { setJobs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
            alt="Careers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/65" />
        </div>
        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
            {t('careersPage.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('careersPage.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {t('careersPage.culture.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-6 leading-tight">
                {t('careersPage.culture.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg mb-5">
                {t('careersPage.culture.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed">
                {t('careersPage.culture.p2')}
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {(t('careersPage.cultureCards', { returnObjects: true }) || []).map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white p-6 border border-cream-dark"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-serif text-dark text-lg mb-2">{item.title}</h4>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              Opportunities
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-dark font-light mb-4">
              {t('careersPage.positions')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider" />
          </motion.div>

          {loading && (
            <p className="text-center font-sans text-gray-400 py-10">Loading positions...</p>
          )}

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={fadeUp}
                className="border border-cream-dark hover:border-gold transition-all duration-300 p-8 group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-serif text-2xl text-dark group-hover:text-gold transition-colors duration-200">
                        {lang === 'vi' ? job.title_vi : job.title_en}
                      </h3>
                      <span className="font-sans text-xs text-gold border border-gold/30 px-2 py-0.5">
                        {t('careersPage.fullTime')}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-warm tracking-wide">
                      {lang === 'vi' ? job.department_vi : job.department_en}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="btn-primary flex-shrink-0"
                  >
                    {t('careersPage.applyNow')}
                  </button>
                </div>
                <div className="w-10 h-0.5 bg-gold mb-4" />
                <p className="font-sans text-sm text-gray-600 leading-relaxed">
                  {lang === 'vi' ? job.description_vi : job.description_en}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Application */}
      <section className="py-20 bg-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('careersPage.openApp.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl text-white font-light mb-4">
              {t('careersPage.openApp.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-gray-400 mb-8 leading-relaxed">
              {t('careersPage.openApp.body')}
            </motion.p>
            <motion.div variants={fadeUp}>
              <a href="mailto:careers@elevatemedia.vn" className="btn-gold">
                {t('careersPage.openApp.cta')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplyModal
            job={selectedJob}
            lang={lang}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
