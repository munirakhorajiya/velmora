import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: 'Order & Shipping Status',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Your message has been received', {
        description: 'A client concierge advisor will respond within 24 business hours.',
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        topic: 'Order & Shipping Status',
        message: '',
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="text-[11px] tracking-[0.14em] uppercase text-[#8C827A] mb-8">
        <a href="/" className="hover:text-[#141414] transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-[#141414]">Contact & Concierge</span>
      </nav>

      {/* Editorial Hero */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] font-semibold tracking-[0.28em] text-[#8C6D37] uppercase block mb-3">
          Client Care
        </span>
        <h1 className="font-serif text-3xl md:text-5xl tracking-[0.14em] uppercase font-normal text-[#141414] mb-6">
          Contact Velmora
        </h1>
        <p className="text-[14px] text-[#666666] leading-relaxed tracking-[0.02em]">
          Our concierge specialists are at your service for product advice, order queries, bespoke monogramming, and private styling consultations.
        </p>
      </section>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Concierge Details */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h2 className="font-serif text-2xl tracking-[0.08em] uppercase text-[#141414] mb-3">
              Concierge Direct
            </h2>
            <p className="text-[13px] text-[#767676] tracking-[0.02em]">
              Available Monday to Friday, 9:00am – 5:30pm (NZST).
            </p>
          </div>

          <div className="space-y-6 text-[13px]">
            <div className="flex items-start space-x-4 p-5 bg-white border border-[#ECEAE5]">
              <Mail className="text-[#8C6D37] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[11px] tracking-[0.16em] uppercase text-[#141414] mb-1">
                  Client Services
                </h4>
                <a href="mailto:concierge@velmora.com" className="text-[#666666] hover:text-[#141414] transition-colors block">
                  concierge@velmora.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white border border-[#ECEAE5]">
              <Phone className="text-[#8C6D37] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[11px] tracking-[0.16em] uppercase text-[#141414] mb-1">
                  Telephone & WhatsApp
                </h4>
                <a href="tel:+6492165427" className="text-[#666666] hover:text-[#141414] transition-colors block">
                  +64 9 216 5427
                </a>
                <p className="text-[11px] text-[#8C827A] mt-1">International toll-free assistance</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white border border-[#ECEAE5]">
              <MapPin className="text-[#8C6D37] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[11px] tracking-[0.16em] uppercase text-[#141414] mb-1">
                  Flagship Headquarters & Atelier
                </h4>
                <address className="not-italic text-[#666666] leading-relaxed">
                  Velmora Atelier<br />
                  16 Te Ara Tāhuhu Walkway, Britomart<br />
                  Auckland 1010, New Zealand
                </address>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 bg-white border border-[#ECEAE5]">
              <Clock className="text-[#8C6D37] mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[11px] tracking-[0.16em] uppercase text-[#141414] mb-1">
                  Atelier Hours
                </h4>
                <p className="text-[#666666]">
                  Mon – Fri: 9:00am – 6:00pm<br />
                  Saturday: 10:00am – 5:00pm<br />
                  Sunday: Private Consultations by Appointment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#ECEAE5] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif text-2xl tracking-[0.08em] uppercase text-[#141414] mb-2">
              Send an Enquiry
            </h2>
            <p className="text-[13px] text-[#767676] mb-8">
              Please complete the details below. Our senior client advisors will review your request personally.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#141414] mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#DCD9D1] px-4 py-3 text-[13px] text-[#141414] focus:outline-none focus:border-[#8C6D37]"
                    placeholder="Eleanor"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#141414] mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#DCD9D1] px-4 py-3 text-[13px] text-[#141414] focus:outline-none focus:border-[#8C6D37]"
                    placeholder="Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#141414] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#DCD9D1] px-4 py-3 text-[13px] text-[#141414] focus:outline-none focus:border-[#8C6D37]"
                  placeholder="eleanor.vance@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#141414] mb-2">
                  Enquiry Topic
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#DCD9D1] px-4 py-3 text-[13px] text-[#141414] focus:outline-none focus:border-[#8C6D37]"
                >
                  <option>Order & Shipping Status</option>
                  <option>Product Sizing & Material Inquiries</option>
                  <option>Atelier Repairs & Leather Rejuvenation</option>
                  <option>Velmora Club Loyalty Privileges</option>
                  <option>Styling & Personal Shopping</option>
                  <option>Bespoke Monogramming Commission</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-[#141414] mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#DCD9D1] px-4 py-3 text-[13px] text-[#141414] focus:outline-none focus:border-[#8C6D37]"
                  placeholder="How may our concierge assist your commission?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#141414] hover:bg-[#8C6D37] text-white py-4 text-[12px] font-semibold tracking-[0.18em] uppercase transition-colors flex items-center justify-center space-x-2"
              >
                <span>{submitting ? 'Transmitting...' : 'Submit Concierge Enquiry'}</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
