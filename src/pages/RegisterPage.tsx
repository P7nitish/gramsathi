import React, { useState } from 'react';
import { UserPlus, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SensitiveDataNotice } from '../components/common/SensitiveDataNotice';
import { setStoredAuthUser } from '../utils/storage';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  language: Language;
  onLoginSuccess: (user: AuthUser) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'citizen' | 'youth_volunteer'>('youth_volunteer');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newUser: AuthUser = {
      name: name.trim(),
      email: email.trim() || `${phone.trim()}@demo.local`,
      role,
      token: `demo-jwt-${Date.now()}`
    };

    setStoredAuthUser(newUser);
    onLoginSuccess(newUser);
    onNavigate('/dashboard');
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Register (Demo)" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-heading text-[#0B1B2B]">
              Create Demo Account
            </h1>
            <p className="text-xs text-slate-500">
              Enroll as a citizen or youth volunteer on the demonstration platform
            </p>
          </div>

          <SensitiveDataNotice compact />

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Mohit Rawat"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role on Platform
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
              >
                <option value="youth_volunteer">MY Bharat Youth Sathi (Volunteer)</option>
                <option value="citizen">Gram Panchayat Resident (Citizen)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. mohit@example.org"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Create Demo Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('/auth/login')}
              className="text-[#1B5E3A] font-bold hover:underline"
            >
              Sign in with demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
