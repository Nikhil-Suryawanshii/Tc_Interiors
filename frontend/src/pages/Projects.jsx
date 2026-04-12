// PATH: frontend/src/pages/Projects.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGrid, FiList } from 'react-icons/fi';
import Nav    from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO    from '@components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '@services/api';
import { usePageTracking } from '@hooks/useAnalytics';

const useProjects = (params) => useQuery({
  queryKey: ['projects', params],
  queryFn: () => projectsAPI.getAll(params).then(r => r.data?.data || r.data || []),
});

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 animate-pulse">
    <div className="h-56 bg-stone-100 dark:bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-2/3 rounded-full bg-stone-100 dark:bg-white/5" />
      <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-white/5" />
      <div className="h-3 w-4/5 rounded-full bg-stone-100 dark:bg-white/5" />
    </div>
  </div>
);

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const [view, setView] = useState('grid');
  usePageTracking();

  const projects = Array.isArray(data) ? data : (data?.projects || []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <SEO title="Our Projects" description="Explore TC Interior's portfolio of luxury interior design and furniture projects across residential and commercial spaces." />
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#b8860b 1px,transparent 1px),linear-gradient(90deg,#b8860b 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-amber-200/40 dark:bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full text-amber-600 dark:text-amber-300 text-sm mb-6">
            🏠 Our Work
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            <span className="text-stone-900 dark:text-white">Featured</span>{' '}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">Projects</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-500 dark:text-stone-400 text-lg max-w-xl mx-auto">
            From concept to completion — a showcase of our finest interior transformations.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {/* View toggle */}
        <div className="flex justify-end mb-8 gap-2">
          <button onClick={() => setView('grid')}
            className={`p-2 rounded-lg border transition-colors ${view === 'grid' ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-200 dark:border-white/10 text-stone-400 hover:text-stone-700 dark:hover:text-white'}`}>
            <FiGrid size={16} />
          </button>
          <button onClick={() => setView('list')}
            className={`p-2 rounded-lg border transition-colors ${view === 'list' ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-200 dark:border-white/10 text-stone-400 hover:text-stone-700 dark:hover:text-white'}`}>
            <FiList size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className={`grid gap-6 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-300 mb-2">Projects Coming Soon</h3>
            <p className="text-stone-400 mb-6">We're building something beautiful. Check back soon.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
              Discuss Your Project <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {projects.map((project, i) => (
              <motion.div key={project._id || i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`group rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-600/40 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 ${view === 'list' ? 'flex gap-0' : ''}`}>
                {/* Image */}
                {project.images?.[0] ? (
                  <div className={`overflow-hidden ${view === 'list' ? 'w-64 shrink-0' : 'h-56'}`}>
                    <img src={project.images[0]} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className={`flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-amber-900/20 dark:to-stone-800 ${view === 'list' ? 'w-64 shrink-0' : 'h-56'}`}>
                    <span className="text-5xl opacity-30">🏠</span>
                  </div>
                )}
                {/* Info */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  {project.category && (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{project.category}</span>
                  )}
                  <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2">{project.description}</p>
                  )}
                  {project.location && (
                    <p className="text-xs text-stone-400">📍 {project.location}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm font-semibold">
                    View Project <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
