import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useState } from "react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    // Simulate sending
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">Have questions or feedback? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <BorderAnimatedContainer>
              <div className="p-6 bg-slate-800/50 rounded-2xl h-full space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-slate-200 mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <MailIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Email Us</p>
                        <p className="text-sm text-slate-500 mt-1">support@chatify.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <PhoneIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Call Us</p>
                        <p className="text-sm text-slate-500 mt-1">8081756656</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Location</p>
                        <p className="text-sm text-slate-500 mt-1">Manipal University Jaipur<br />Jaipur, Rajasthan 303007</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BorderAnimatedContainer>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <BorderAnimatedContainer>
              <div className="p-8 bg-slate-800/50 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="auth-input-label">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="auth-input-label">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Message</label>
                    <textarea
                      rows="6"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button type="submit" className="auth-btn flex items-center justify-center gap-2">
                    <span>Send Message</span>
                    <SendIcon className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </BorderAnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
