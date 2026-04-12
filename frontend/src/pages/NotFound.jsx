// frontend/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { useSettings } from '@contexts/SiteSettingsContext';

export default function NotFound() {
  const { navLinks } = useSettings();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060612] text-slate-900 dark:text-white flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none" style={{backgroundImage:'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
      <div className="relative z-10 text-center max-w-lg mx-auto space-y-8">
        <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{duration:0.7,ease:[0.16,1,0.3,1]}}>
          <span className="text-[10rem] leading-none font-black bg-gradient-to-br from-indigo-600 via-violet-500 to-cyan-500 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent select-none">404</span>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2}} className="space-y-3">
          <h1 className="text-2xl font-black">Page not found</h1>
          <p className="text-slate-500 leading-relaxed">This page doesn't exist or has been moved.</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.35}} className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/25"><FiHome size={16}/> Go Home</Link>
          <button onClick={()=>window.history.back()} className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold rounded-xl transition-all shadow-sm"><FiArrowLeft size={16}/> Go Back</button>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.6,delay:0.5}} className="pt-4 border-t border-slate-200 dark:border-white/10">
          <p className="text-slate-400 text-sm mb-4">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {navLinks.map(({label,path})=>(
              <Link key={path} to={path} className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 text-sm font-medium rounded-xl transition-all">{label}</Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
