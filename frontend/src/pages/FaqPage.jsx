import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

const faqs = [
  {
    question: "What is Chatify?",
    answer: "Chatify is a real-time messaging platform designed to provide a secure, fast, and intuitive communication experience for individuals and teams."
  },
  {
    question: "Is Chatify free to use?",
    answer: "Yes, our core messaging features are completely free. We also offer premium plans with advanced administrative and customization features for businesses."
  },
  {
    question: "How secure are my messages?",
    answer: "Security is our top priority. All messages are encrypted in transit and at rest using industry-standard protocols. We never share your personal data with third parties."
  },
  {
    question: "Can I use Chatify on multiple devices?",
    answer: "Absolutely! Chatify is fully responsive and works seamlessly across desktops, tablets, and smartphones. Your messages are automatically synced."
  },
  {
    question: "How do I reset my password?",
    answer: "You can request a password reset from the Login page by clicking on the 'Forgot Password' link and instructions will be sent to your registered email address."
  },
  {
    question: "How do I delete my account?",
    answer: "If you wish to delete your account, you can find the option in your Profile settings. Please note that account deletion is permanent and all associated data will be removed."
  }
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">Find answers to common questions about Chatify.</p>
        </div>

        <BorderAnimatedContainer>
          <div className="p-6 md:p-10 bg-slate-800/50 rounded-2xl">
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="faq-accordion-item">
                    <button
                      className="faq-accordion-btn"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-[15px] pr-8">{faq.question}</span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                      />
                    </button>
                    
                    <div 
                      className="grid transition-all duration-300 ease-in-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="faq-accordion-content leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 text-center pt-8 border-t border-slate-700/50">
              <p className="text-slate-400 mb-4">Still have questions?</p>
              <a href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default FaqPage;
