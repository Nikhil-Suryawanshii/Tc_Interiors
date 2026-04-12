// TC Interior — About Page
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiHome, FiHeart } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useTestimonials } from '@hooks/useQueries';
import { usePageTracking } from '@hooks/useAnalytics';
import { SectionReveal, CountUp } from '@components/common/AnimationKit';

const VALUES = [
  { icon: '🎨', title: 'Design Excellence', desc: 'Every project is crafted with meticulous attention to detail and aesthetic precision.' },
  { icon: '🤝', title: 'Client First', desc: 'We listen deeply to understand your vision and bring it to life beyond expectations.' },
  { icon: '🌿', title: 'Sustainable Materials', desc: 'We source eco-friendly, sustainable materials without compromising on quality.' },
  { icon: '⏱️', title: 'On-Time Delivery', desc: 'We respect your time and ensure every project is completed within the agreed timeline.' },
];

const TEAM = [
  { name: 'Rahul Sharma', role: 'Founder & Lead Designer', emoji: '👨‍🎨' },
  { name: 'Priya Mehta', role: 'Interior Architect', emoji: '👩‍💼' },
  { name: 'Arjun Patel', role: 'Furniture Specialist', emoji: '🪑' },
];

export default function AboutPage() {
  const { data: testimonials = [] } = useTestimonials();
  usePageTracking();

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO title="About Us" description="Learn about TC Interior — our story, values, and team behind your dream spaces." />
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-stone-900 to-amber-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop")', backgroundSize:'cover', backgroundPosition:'center' }}/>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-amber-400/30 rounded-full text-amber-300 text-sm mb-6">
            🏠 About TC Interior
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}
            className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Crafting Spaces,<br/>Creating Stories
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="text-xl text-stone-300 max-w-2xl mx-auto">
            For over a decade, TC Interior has been transforming houses into homes with premium furniture and bespoke design solutions.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500','Happy Clients'],['12','Years Experience'],['1000','Projects Done'],['50','Design Awards']].map(([n,l])=>(
            <div key={l}>
              <div className="text-4xl font-black text-amber-300"><CountUp to={parseInt(n)} suffix="+" /></div>
              <div className="text-sm text-amber-200 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <SectionReveal direction="left">
            <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Story</div>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-6">Where Passion Meets Design</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              TC Interior was born from a simple belief: every space deserves to be beautiful, functional, and uniquely yours. Founded in 2012, we started as a small furniture workshop and grew into a full-service interior design studio.
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Today, we work with homeowners, architects, and commercial clients across India, delivering premium furniture and end-to-end interior solutions that reflect each client's personality and lifestyle.
            </p>
          </SectionReveal>
          <SectionReveal direction="right">
            <div className="aspect-square bg-stone-100 dark:bg-stone-800 rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop" alt="TC Interior Studio" className="w-full h-full object-cover"/>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">What Drives Us</div>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white">Our Core Values</h2>
          </SectionReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} whileHover={{ y:-6 }}
                className="bg-white dark:bg-stone-800 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 shadow-sm text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionReveal className="text-center mb-16">
            <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">The People</div>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white">Meet Our Team</h2>
          </SectionReveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="text-center bg-white dark:bg-stone-800 rounded-2xl p-8 border border-stone-200 dark:border-stone-700 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-4xl mx-auto mb-4">{member.emoji}</div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-amber-900 text-white">
          <div className="max-w-5xl mx-auto">
            <SectionReveal className="text-center mb-16">
              <div className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-3">Client Stories</div>
              <h2 className="text-4xl font-black">What Our Clients Say</h2>
            </SectionReveal>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(0,4).map((t, i) => (
                <motion.div key={t._id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className="bg-white/10 rounded-2xl p-6 border border-white/10">
                  <p className="text-stone-200 italic mb-4">"{t.quote}"</p>
                  <div className="font-bold">{t.name}</div>
                  {t.role && <div className="text-amber-300 text-sm">{t.role}{t.company ? ` · ${t.company}` : ''}</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
