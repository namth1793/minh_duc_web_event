import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const lang = i18n.language;

  useEffect(() => {
    api.get('/api/blog')
      .then((res) => { setPosts(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
            alt="Blog"
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
            {t('blogPage.hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-light">
            {t('blogPage.hero.title')}
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mt-6" />
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-10 bg-cream border-b border-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-xs tracking-widest uppercase px-6 py-2.5 border transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-dark text-white border-dark'
                    : 'border-warm/30 text-warm hover:border-dark hover:text-dark'
                  }`}
              >
                {cat === 'All' ? t('blogPage.all') : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <p className="text-center font-sans text-gray-400 py-20">
              {t('blogPage.loading')}
            </p>
          )}

          {error && (
            <p className="text-center font-sans text-red-400 py-20">
              {t('blogPage.error')}
            </p>
          )}

          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {filtered.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  className="group bg-white border border-cream-dark hover:border-gold transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="img-hover-zoom">
                    <Link to={`/blog/${post.id}`}>
                      <img
                        src={post.thumbnail}
                        alt={lang === 'vi' ? post.title_vi : post.title_en}
                        className="w-full h-56 object-cover"
                      />
                    </Link>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5">
                        {post.category}
                      </span>
                      <span className="font-sans text-xs text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    <h2 className="font-serif text-dark text-xl mb-3 leading-snug group-hover:text-gold transition-colors duration-200">
                      <Link to={`/blog/${post.id}`}>
                        {lang === 'vi' ? post.title_vi : post.title_en}
                      </Link>
                    </h2>

                    <div className="w-8 h-0.5 bg-gold mb-4" />

                    <p className="font-sans text-sm text-gray-500 leading-relaxed flex-grow mb-5">
                      {lang === 'vi' ? post.excerpt_vi : post.excerpt_en}
                    </p>

                    <Link
                      to={`/blog/${post.id}`}
                      className="font-sans text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors self-start"
                    >
                      {t('blogPage.readMore')}
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center font-sans text-gray-400 py-20">
              No posts found in this category.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
