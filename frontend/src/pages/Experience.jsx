// PATH: frontend/src/pages/Experience.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiAward, FiArrowRight } from 'react-icons/fi';
import Nav    from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO    from '@components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { experienceAPI } from '@services/api';
import { usePageTracking } from '@hooks/useAnalytics';

const useExperience = () => useQuery({
  queryKey: ['experience'],
  queryFn: () => experienceAPI.getAll().then(r => r.data?.data || r.data || []),
});

const SkeletonItem = () => (
  <div className="flex gap-6 animate-pulse">
    <div className="w-4 h-4 mt-1.5 rounded-full bg-stone-200 dark:bg-white/10 shrink-0" />
    <div className="flex-1 space-y-3 pb-10">
      <div className="h-4 w-1/3 rounded-full bg-stone-100 dark:bg-white/5" />
      <div className="h-3 w-1/2 rounded-full bg-stone-100 dark:bg-white/5" />
      <div className="h-3 w-full rounded-full bg-stone-100 dark:bg-white/5" />
      <div className="h-3 w-4/5 rounded-full bg-stone-100 dark:bg-white/5" />
    </div>
  </div>
);

const FALLBACK = [
  {
    _id: '1',
    role: 'Lead Interior Designer',
    company: 'TC Interior',
    period: '2020 – Present',
    location: 'Nagpur, Maharashtra',
    description: 'Leading end-to-end interior design projects for luxury residences and commercial spaces. Specialising in bespoke furniture curation, space planning, and project management.',
    highlights: ['50+ residential projects completed', 'Managed teams of up to 12 contractors', 'Delivered projects on time and within budget'],
  },
  {
    _id: '2',
    role: 'Senior Interior Consultant',
    company: 'Design Studio',
    period: '2017 – 2020',
    location: 'Mumbai, Maharashtra',
    description: 'Provided high-end interior consultancy for HNI clients. Developed detailed design briefs, mood boards, and material specifications for premium projects.',
    highlights: ['Worked with 100+ clients', 'Developed signature material palette', 'Won Best Interior Design 2019 award'],
  },
  {
    _id: '3',
    role: 'Interior Designer',
    company: 'Creative Spaces',
    period: '2014 – 2017',
    location: 'Pune, Maharashtra',
    description: 'Executed residential and commercial interior design projects from concept through installation. Gained deep expertise in space optimisation and material sourcing.',
    highlights: ['Completed 30+ projects', 'Built strong vendor network', 'Mastered AutoCAD and 3D visualisation'],
  },
];

export default function ExperiencePage() {
  const { data, isLoading } = useExperience();
  usePageTracking();

  const items = Array.isArray(data) && data.length > 0 ? data : (!isLoading ? FALLBACK : []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      <SEO title="Our Experience" description="Over a decade of expertise in luxury interior design, furniture curation, and commercial space planning across India." />
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#b8860b 1px,transparent 1px),linear-gradient(90deg,#b8860b 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-200/40 dark:bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full text-amber-600 dark:text-amber-300 text-sm mb-6">
            <FiBriefcase size={14} /> Our Journey
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            <span className="text-stone-900 dark:text-white">Years of</span>{' '}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">Excellence</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-500 dark:text-stone-400 text-lg max-w-xl mx-auto">
            A decade of transforming spaces into stories — from luxury homes to landmark commercial interiors.
          </motion.p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: '10+', label: 'Years Experience' },
            { num: '200+', label: 'Projects Completed' },
            { num: '150+', label: 'Happy Clients' },
            { num: '15+', label: 'Awards Won' },
          ].map((s, i) => (
            <div key={i} className="text-center p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{s.num}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-10 flex items-center gap-3">
          <FiBriefcase className="text-amber-600" /> Professional Timeline
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-gradient-to-b from-amber-400 via-amber-300 to-transparent dark:from-amber-600 dark:via-amber-700" />

          <div className="space-y-0">
            {isLoading
              ? [1,2,3].map(i => <SkeletonItem key={i} />)
              : items.map((item, i) => (
                <motion.div key={item._id || i}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-6 group">
                  {/* Dot */}
                  <div className="relative mt-1.5 shrink-0">
                    <div className="w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 border-4 border-stone-50 dark:border-stone-950 group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-12">
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 group-hover:border-amber-300 dark:group-hover:border-amber-600/40 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-300">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-stone-900 dark:text-white">{item.role || item.title}</h3>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {item.period || item.duration}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1">{item.company || item.organisation}</p>
                      {item.location && <p className="text-xs text-stone-400 mb-3">📍 {item.location}</p>}
                      {item.description && <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-4">{item.description}</p>}
                      {item.highlights?.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.highlights.map((h, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-stone-500 dark:text-stone-400">
                              <FiAward size={12} className="text-amber-500 mt-0.5 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 text-center">
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-900/20">
            Work With Us <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
