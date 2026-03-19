import { ShieldCheckIcon, ZapIcon, MessageSquareIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">About Chatify</h1>
          <p className="page-subtitle">Connecting people in real-time with secure and seamless messaging.</p>
        </div>

        <BorderAnimatedContainer>
          <div className="p-8 md:p-12 bg-slate-800/50 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Our Mission</h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  At Chatify, we believe communication should be completely frictionless. 
                  Our mission is to provide a platform where people can connect anytime, 
                  anywhere, with best-in-class security and lighting-fast message delivery.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Built for modern teams and communities, we're constantly innovating to 
                  bring you the most intuitive chat experience possible.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-t-cyan-500">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">10k+</div>
                  <div className="text-sm text-slate-400">Active Users</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-t-purple-500">
                  <div className="text-3xl font-bold text-purple-400 mb-1">50M+</div>
                  <div className="text-sm text-slate-400">Messages Sent</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-t-pink-500">
                  <div className="text-3xl font-bold text-pink-400 mb-1">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-t-emerald-500">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">24/7</div>
                  <div className="text-sm text-slate-400">Support</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-12">
              <h2 className="text-2xl font-bold text-center text-slate-200 mb-12">Why Choose Chatify?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                    <ZapIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Real-time Speed</h3>
                  <p className="text-sm text-slate-400">Lightning-fast message delivery built on reliable WebSocket technology.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Secure & Private</h3>
                  <p className="text-sm text-slate-400">Your data is safe with our industry-standard security measures.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquareIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-200 mb-2">Intuitive Design</h3>
                  <p className="text-sm text-slate-400">A beautiful, clean interface that makes chatting a joy.</p>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default AboutPage;
