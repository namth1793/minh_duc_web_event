import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function BlogDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lang = i18n.language;

  useEffect(() => {
    setLoading(true);
    api.get(`/api/blog/${id}`)
      .then((res) => { setPost(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <p className="font-sans text-gray-400">{t('blogDetail.loading')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20">
        <p className="font-sans text-gray-400 mb-6">{t('blogDetail.error')}</p>
        <Link to="/blog" className="btn-primary">{t('blogDetail.back')}</Link>
      </div>
    );
  }

  const title = lang === 'vi' ? post.title_vi : post.title_en;
  const content = lang === 'vi' ? post.content_vi : post.content_en;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs tracking-widest uppercase text-gold border border-gold/50 px-3 py-1">
                {post.category}
              </span>
              <span className="font-sans text-xs text-white/60">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight">
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-warm hover:text-gold transition-colors duration-200 mb-10"
            >
              <span>←</span> {t('blogDetail.back')}
            </Link>

            {/* Gold divider */}
            <div className="gold-divider-left mb-10" />

            {/* Content */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Bottom divider */}
            <div className="mt-16 pt-10 border-t border-cream-dark">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-gold mb-1">Share This Article</p>
                  <div className="flex gap-4">
                    <a href="#" className="font-sans text-sm text-gray-500 hover:text-gold transition-colors">Facebook</a>
                    <a href="#" className="font-sans text-sm text-gray-500 hover:text-gold transition-colors">Twitter</a>
                    <a href="#" className="font-sans text-sm text-gray-500 hover:text-gold transition-colors">LinkedIn</a>
                  </div>
                </div>
                <Link to="/blog" className="btn-secondary">
                  {t('blogDetail.back')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Ready to Begin?</p>
            <h2 className="font-serif text-3xl text-dark font-light mb-4">
              Let's Create Your Perfect Event
            </h2>
            <div className="gold-divider mb-8" />
            <p className="font-sans text-gray-500 mb-8 leading-relaxed">
              Inspired by what you've read? Our team is ready to make your vision a reality.
            </p>
            <Link to="/contact" className="btn-primary">
              Start Planning Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
