import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiMessageCircle } from 'react-icons/fi';
import { bookConsultation } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const { settings } = useSettings();
  const contact = settings.contact || {};
  const social  = settings.social  || {};

  const [form, setForm]     = useState({ name:'', email:'', phone:'', serviceType:'', projectType:'', budget:'', location:'', message:'' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await bookConsultation(form);
      toast.success('Thank you! We will contact you within 24 hours.');
      setForm({ name:'', email:'', phone:'', serviceType:'', projectType:'', budget:'', location:'', message:'' });
    } catch { toast.error('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Talk to Us</span>
          <h1>Contact & Consultation</h1>
          <p>Let's start a conversation about your space</p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* LEFT INFO */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Whether you're planning a full renovation, need design advice, or want to browse our furniture collection — we're here to help.</p>

          <div className="info-items">
            {contact.address && (
              <div className="info-item">
                <FiMapPin size={18}/>
                <div><strong>Studio Address</strong><p>{contact.address}</p></div>
              </div>
            )}
            {contact.phone && (
              <div className="info-item">
                <FiPhone size={18}/>
                <div>
                  <strong>Phone</strong>
                  <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                  {contact.phone2 && <p><a href={`tel:${contact.phone2}`}>{contact.phone2}</a></p>}
                </div>
              </div>
            )}
            {contact.email && (
              <div className="info-item">
                <FiMail size={18}/>
                <div>
                  <strong>Email</strong>
                  <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                  {contact.email2 && <p><a href={`mailto:${contact.email2}`}>{contact.email2}</a></p>}
                </div>
              </div>
            )}
            {(contact.hoursWeekday || contact.hoursWeekend) && (
              <div className="info-item">
                <FiClock size={18}/>
                <div>
                  <strong>Studio Hours</strong>
                  {contact.hoursWeekday && <p>{contact.hoursWeekday}</p>}
                  {contact.hoursWeekend && <p>{contact.hoursWeekend}</p>}
                </div>
              </div>
            )}
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="whatsapp-btn">
                <FiMessageCircle size={16}/> Chat on WhatsApp
              </a>
            )}
          </div>

          {/* Map embed */}
          {contact.mapUrl && (
            <div className="map-embed">
              <iframe src={contact.mapUrl} title="Location" allowFullScreen loading="lazy" />
            </div>
          )}
        </div>

        {/* RIGHT FORM */}
        <form className="consultation-form" onSubmit={handleSubmit}>
          <h2>Book a Free Consultation</h2>
          <p>Fill in the form and our design team will reach out within 24 hours.</p>
          <div className="form-grid" style={{marginTop:'1.5rem'}}>
            <div className="form-group"><label>Your Name *</label><input name="name" value={form.name} onChange={handleChange} required/></div>
            <div className="form-group"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required/></div>
            <div className="form-group"><label>Phone *</label><input name="phone" value={form.phone} onChange={handleChange} required/></div>
            <div className="form-group"><label>Service Type</label>
              <select name="serviceType" value={form.serviceType} onChange={handleChange}>
                <option value="">Select Service</option>
                {['Interior Design','Space Consultation','3D Visualization','Project Execution','Furniture Selection','Vastu Consultation'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Project Type</label>
              <select name="projectType" value={form.projectType} onChange={handleChange}>
                <option value="">Select Type</option>
                {['Apartment','Villa','Commercial','Office','Retail','Hospitality'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Budget Range</label>
              <select name="budget" value={form.budget} onChange={handleChange}>
                <option value="">Select Budget</option>
                {['Under ₹5 Lakh','₹5–15 Lakh','₹15–30 Lakh','₹30–60 Lakh','₹60 Lakh+'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Project Location</label><input name="location" placeholder="City, State" value={form.location} onChange={handleChange}/></div>
            <div className="form-group full"><label>Your Message</label>
              <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your project, timeline, or any specific requirements..."/>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'0.5rem'}} disabled={loading}>
            {loading ? 'Sending...' : 'Book Free Consultation'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
