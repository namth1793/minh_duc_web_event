import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function BrandStoryPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80"
            alt="Brand story"
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
            {t('brandStory.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('brandStory.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {t('brandStory.vision.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
                {t('brandStory.vision.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5 text-lg">
                {t('brandStory.vision.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed">
                {t('brandStory.vision.p2')}
              </motion.p>
            </motion.div>

            <motion.div
              className="img-hover-zoom"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
                alt="Our vision"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics bar */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { number: '500+', label: 'Events Hosted' },
              { number: '12', label: 'Years of Excellence' },
              { number: '50+', label: 'Expert Team Members' },
              { number: '98%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="font-serif text-5xl text-gold mb-2">{stat.number}</div>
                <div className="font-sans text-xs tracking-widest uppercase text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="img-hover-zoom"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
                alt="Architecture"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
                {t('brandStory.architecture.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
                {t('brandStory.architecture.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5 text-lg">
                {t('brandStory.architecture.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed">
                {t('brandStory.architecture.p2')}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hospitality Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('brandStory.hospitality.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark mb-6">
              {t('brandStory.hospitality.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider mb-10" />
            <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg mb-6">
              {t('brandStory.hospitality.p1')}
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg">
              {t('brandStory.hospitality.p2')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Full-width image break */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="Dining at Minh Duc Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/40" />
      </div>

      {/* Emotional Section */}
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
                {t('brandStory.emotional.eyebrow')}
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
                {t('brandStory.emotional.title')}
              </motion.h2>
              <motion.div variants={fadeUp} className="gold-divider-left mb-8" />
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed mb-5 text-lg">
                {t('brandStory.emotional.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed">
                {t('brandStory.emotional.p2')}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10">
                <Link to="/contact" className="btn-primary">
                  Start Your Journey
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="img-hover-zoom"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <img
                src="https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80"
                alt="Emotional moments"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
