import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Side: Visual Experience */}
      <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(192,193,255,0.08),transparent_50%)]">
        {/* Decorative Glow Background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
        
        {/* Brand Logo */}
        <div className="z-10">
          <Link to="/" className="font-h2 text-h2 font-bold text-primary tracking-tight">Audit.ai</Link>
        </div>
        
        {/* Benefit Card */}
        <div className="z-10 max-w-md">
          <div className="ai-gradient-border glass-card p-8 rounded-lg dual-border">
            <div className="flex items-center gap-stack-sm mb-stack-md text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-label-caps text-label-caps uppercase">AI Spend Audit</span>
            </div>
            <h2 className="font-h1 text-h1 text-on-surface mb-stack-md leading-tight">
              Save <span className="text-secondary">$12,400</span>/year on AI costs.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
              Our autonomous audit engine identifies redundant subscriptions and optimizes token usage across your entire infrastructure.
            </p>
            <div className="flex items-center gap-stack-sm text-secondary bg-secondary/10 w-fit px-3 py-1 rounded-full border border-secondary/20">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-caps text-label-caps">+14.2% Monthly Efficiency</span>
            </div>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="z-10 flex gap-gutter">
          <span className="font-body-sm text-body-sm text-on-surface-variant/60">© 2024 Audit.ai Financial Operations. All rights reserved.</span>
        </div>
        
        {/* Background Image Integration */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <img alt="Abstract data nodes" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARMkhHWbDwbrFllxxEKATsnEk_2ndx-f1L9vwdhUkLn4xTnXvSbUAaPBGGrpHfMb67HGxClve0fZXZRIownjmeU_mF5C1y5P4RWxnFFHKgguvkeup2eMl04QHhZaxEysO3Pn_CnK4KL1a1tejS-O50IDAH2cdtkDur-NLXaK1supSSszobMfZOtaPLhI1CrvPTXK-5JcSB5RUtlQ7_katH2dmm5DW8D3XPGld4tx4D-YhgY5ONWor1402Sb2qtr1fFOKzQZVBVbTlr"/>
        </div>
      </section>

      {/* Right Side: Authentication Form */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-container-padding bg-background relative">
        <div className="w-full max-w-[400px] flex flex-col gap-section-gap">
          {/* Header */}
          <div className="flex flex-col gap-stack-sm text-center lg:text-left">
            <h1 className="font-h1 text-h1 text-on-surface">Welcome back</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Log in to manage your financial audits.</p>
          </div>
          
          {error && <div className="bg-error/20 text-error p-4 rounded-lg text-sm border border-error/20">{error}</div>}

          {/* Auth Container */}
          <div className="flex flex-col gap-gutter">
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-stack-md">
              <button className="glass-card flex items-center justify-center gap-stack-sm py-stack-md rounded-lg hover:bg-white/5 transition-colors group">
                <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors">account_circle</span>
                <span className="font-body-sm text-body-sm font-semibold">Google</span>
              </button>
              <button className="glass-card flex items-center justify-center gap-stack-sm py-stack-md rounded-lg hover:bg-white/5 transition-colors group">
                <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors">terminal</span>
                <span className="font-body-sm text-body-sm font-semibold">GitHub</span>
              </button>
            </div>
            
            {/* Separator */}
            <div className="flex items-center gap-stack-md py-stack-md">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Or continue with email</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            {/* Inputs */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Work Email</label>
                <input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  placeholder="name@company.ai" 
                  className="bg-[#0A0A0A] border border-white/10 text-on-surface rounded-lg px-stack-md py-stack-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-on-surface-variant/30" 
                />
              </div>
              <div className="flex flex-col gap-stack-sm">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
                  <a className="font-label-caps text-label-caps text-primary hover:text-primary-fixed-dim transition-colors" href="#">Forgot password?</a>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  placeholder="••••••••" 
                  className="bg-[#0A0A0A] border border-white/10 text-on-surface rounded-lg px-stack-md py-stack-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-on-surface-variant/30" 
                />
              </div>
              {/* CTA Button */}
              <button 
                type="submit" 
                className="mt-stack-md bg-primary text-on-primary py-stack-md rounded-lg font-h3 text-h3 font-bold hover:bg-primary-container transition-all active:scale-[0.98] active:opacity-80"
              >
                Sign In
              </button>
            </form>
          </div>
          
          {/* Footer Toggle */}
          <div className="text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline decoration-primary/40 underline-offset-4">Sign up for free</Link>
            </p>
          </div>
        </div>
        
        {/* Support Floating Link */}
        <div className="absolute top-container-padding right-container-padding z-50">
          <Link to="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-stack-sm glass-card px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-[18px]">home</span>
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
