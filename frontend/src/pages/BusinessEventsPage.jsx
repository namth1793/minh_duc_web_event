import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const businessEventDetails = [
  {
    key: 'conference',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    capacity: 'Up to 120 delegates',
    features: ['State-of-the-art AV system', 'High-speed WiFi', 'Breakout rooms', 'Professional lighting'],
  },
  {
    key: 'brandLaunch',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    capacity: 'Up to 500 guests',
    features: ['Theatrical staging', 'LED walls', 'Custom set design', 'Media coordination'],
  },
  {
    key: 'galaDinner',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    capacity: 'Up to 800 guests',
    features: ['Fine dining service', 'Live entertainment', 'Awards ceremonies', 'Custom theming'],
  },
  {
    key: 'corporateEvents',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    capacity: 'Flexible layouts',
    features: ['Team building areas', 'Networking spaces', 'Catering flexibility', 'Dedicated coordinator'],
  },
  {
    key: 'executiveMeeting',
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
    capacity: 'Up to 50 attendees',
    features: ['Private boardroom', 'Secure WiFi', 'Concierge service', 'Bespoke catering'],
  },
  {
    key: 'fashionShow',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    capacity: 'Up to 300 guests',
    features: ['Custom runway setup', 'Professional lighting rigs', 'Backstage facilities', 'Media backdrop'],
  },
];

export default function BusinessEventsPage() {
  const { t } = useTranslation();

  const getDesc = (key) => {
    const map = {
      conference: t('business.conference.desc'),
      brandLaunch: t('business.brandLaunch.desc'),
      galaDinner: t('business.galaDinner.desc'),
      corporateEvents: t('business.corporateEvents.desc'),
      executiveMeeting: t('business.executiveMeeting.desc'),
      fashionShow: 'A dramatic runway experience showcasing the finest fashion in an architectural masterpiece.',
    };
    return map[key] || '';
  };

  const getTitle = (key) => {
    const map = {
      conference: t('business.conference.title') || 'Conference',
      brandLaunch: t('business.brandLaunch.title') || 'Brand Launch',
      galaDinner: t('business.galaDinner.title') || 'Gala Dinner',
      corporateEvents: t('business.corporateEvents.title') || 'Corporate Events',
      executiveMeeting: t('business.executiveMeeting.title') || 'Executive Meeting',
      fashionShow: 'Fashion Show & Exhibition',
    };
    return map[key] || key;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
            alt="Business Events"
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
            {t('businessPage.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('businessPage.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
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
            <motion.div variants={fadeUp} className="gold-divider mb-8" />
            <motion.p variants={fadeUp} className="font-sans text-gray-600 leading-relaxed text-lg">
              {t('business.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Event Cards Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessEventDetails.map((ev, idx) => (
              <motion.div
                key={ev.key}
                className="group bg-white border border-cream-dark hover:border-gold transition-all duration-300 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: (idx % 3) * 0.1 } } }}
              >
                <div className="img-hover-zoom">
                  <img
                    src={ev.img}
                    alt={getTitle(ev.key)}
                    className="w-full h-52 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-dark text-xl">{getTitle(ev.key)}</h3>
                    <span className="font-sans text-xs text-gold border border-gold/30 px-2 py-1 ml-2 whitespace-nowrap">
                      {ev.capacity}
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-gold mb-4" />
                  <p className="font-sans text-gray-500 text-sm leading-relaxed mb-5">
                    {getDesc(ev.key)}
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    {ev.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 font-sans text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors"
                  >
                    Enquire Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity Section */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              {t('businessPage.capacity.eyebrow')}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-white font-light mb-4">
              {t('businessPage.capacity.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                title: t('businessPage.capacity.mainBallroom'),
                desc: t('businessPage.capacity.mainBallroomDesc'),
                icon: '🏛️',
              },
              {
                title: t('businessPage.capacity.gardenPavilion'),
                desc: t('businessPage.capacity.gardenPavilionDesc'),
                icon: '🌿',
              },
              {
                title: t('businessPage.capacity.conferenceSuite'),
                desc: t('businessPage.capacity.conferenceSuiteDesc'),
                icon: '💼',
              },
              {
                title: t('businessPage.capacity.privateDining'),
                desc: t('businessPage.capacity.privateDiningDesc'),
                icon: '🕯️',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="border border-white/10 p-8 text-center hover:border-gold transition-colors duration-300"
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-serif text-white text-xl mb-3">{item.title}</h3>
                <div className="w-8 h-0.5 bg-gold mx-auto mb-4" />
                <p className="font-sans text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology & Services */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              Our Capabilities
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-dark font-light mb-4">
              Everything You Need to Succeed
            </motion.h2>
            <motion.div variants={fadeUp} className="gold-divider" />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: '📡', label: 'High-Speed WiFi' },
              { icon: '🎬', label: 'Pro AV Systems' },
              { icon: '🌐', label: 'Live Streaming' },
              { icon: '🍽️', label: 'Bespoke Catering' },
              { icon: '🚗', label: 'Valet Parking' },
              { icon: '🎤', label: 'Sound Engineering' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center bg-white p-6 border border-cream-dark"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-sans text-xs tracking-wide text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-dark font-light mb-6">
              Ready to Plan Your Business Event?
            </motion.h2>
            <motion.p variants={fadeUp} className="font-sans text-gray-500 mb-10 leading-relaxed">
              Our corporate events team is standing by to discuss your requirements and create a bespoke proposal tailored to your objectives and budget.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Request a Proposal
              </Link>
              <a href="tel:+842361234567" className="btn-secondary">
                Call Us Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
