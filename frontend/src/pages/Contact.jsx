// TC Interior — Contact Page
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiLinkedin, FiSend } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { contactAPI } from '@services/api';
import { usePageTracking } from '@hooks/useAnalytics';
import { useSettings } from '@contexts/SiteSettingsContext';
import { SectionReveal } from '@components/common/AnimationKit';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  usePageTracking();

  const handleSubmit = async (e) => {
    e.preventDefault(); setSending(true);
    try {
      await contactAPI.submit(form);
      setSent(true); toast.success("Message sent! We'll be in touch soon.");
    } catch { toast.error('Failed to send. Please try again.'); }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO title="Contact Us" description="Get in touch with TC Interior for a free consultation, product enquiries, or design services." />
      <Nav />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-stone-900 to-amber-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-3">Let's Talk</div>
            <h1 className="text-5xl font-black mb-4">Get In Touch</h1>
            <p className="text-stone-300 text-lg">Ready to transform your space? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <SectionReveal direction="left">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6">Contact Information</h2>
              {[
                settings.phone     && { icon:<FiPhone/>, label:'Phone', value:settings.phone, href:`tel:${settings.phone}` },
                settings.contactEmail && { icon:<FiMail/>, label:'Email', value:settings.contactEmail, href:`mailto:${settings.contactEmail}` },
                settings.location  && { icon:<FiMapPin/>, label:'Location', value:settings.location, href:null },
              ].filter(Boolean).map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider mb-0.5">{item.label}</div>
                    {item.href
                      ? <a href={item.href} className="font-semibold text-stone-900 dark:text-white hover:text-amber-700 transition-colors">{item.value}</a>
                      : <p className="font-semibold text-stone-900 dark:text-white">{item.value}</p>}
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="flex gap-3 pt-2">
                {settings.social?.instagram && <a href={`https://instagram.com/${settings.social.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-center text-stone-500 hover:text-amber-700 hover:border-amber-400 transition-all"><FiInstagram size={16}/></a>}
                {settings.social?.facebook && <a href={`https://facebook.com/${settings.social.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-center text-stone-500 hover:text-amber-700 hover:border-amber-400 transition-all"><FiFacebook size={16}/></a>}
                {settings.social?.linkedin && <a href={`https://linkedin.com/company/${settings.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-center text-stone-500 hover:text-amber-700 hover:border-amber-400 transition-all"><FiLinkedin size={16}/></a>}
              </div>
            </SectionReveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 border border-stone-200 dark:border-stone-700 shadow-sm">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-3">Message Sent!</h3>
                  <p className="text-stone-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[['Name *','name','text',true],['Email *','email','email',true]].map(([l,k,t,r])=>(
                      <div key={k}><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{l}</label>
                        <input type={t} required={r} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"/></div>
                    ))}
                  </div>
                  {[['Phone','phone','tel'],['Subject','subject','text']].map(([l,k,t])=>(
                    <div key={k}><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{l}</label>
                      <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"/></div>
                  ))}
                  <div><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea rows={5} required value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us about your project, space, requirements..."
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 resize-none"/></div>
                  <motion.button type="submit" disabled={sending} whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                    className="w-full py-4 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    <FiSend size={16}/>{sending ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
