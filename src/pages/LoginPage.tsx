import React, { useState } from 'react';
import { User, Lock, ShieldCheck, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { setStoredAuthUser } from '../utils/storage';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  language: Language;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('evaluator@mybharat.gov.in');
  const [password, setPassword] = useState('demo1234');
  const [role, setRole] = useState<'citizen' | 'youth_volunteer' | 'panchayat_admin' | 'nodal_officer'>('nodal_officer');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const demoUser: AuthUser = {
        name: role === 'nodal_officer' ? "BDO Sitapur (Nodal Officer)" : role === 'youth_volunteer' ? "Aakash Tripathi (Gram Sathi)" : "Ramesh Kumar (Citizen)",
        email: email.trim(),
        role,
        villageId: "VIL-01",
        token: `demo-jwt-token-${Date.now()}`
      };

      setStoredAuthUser(demoUser);
      onLoginSuccess(demoUser);
      setLoading(false);
      onNavigate('/dashboard');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Sign In (Demo)" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1B5E3A] flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-heading text-[#0B1B2B]">
              Demo Role Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Select an evaluator role to preview privileged administrative dashboards
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>Preloaded Credentials:</strong> No real passwords required. Click Sign In to inspect role-based views.
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demo Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
              >
                <option value="nodal_officer">Ministry / Nodal Officer (Full Admin)</option>
                <option value="youth_volunteer">MY Bharat Youth Sathi (Volunteer)</option>
                <option value="citizen">Gram Resident (Citizen)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1B5E3A]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1B5E3A] hover:bg-[#154b2e] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating Session...' : 'Sign In as Selected Role'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>New volunteer? </span>
            <button
              type="button"
              onClick={() => onNavigate('/auth/register')}
              className="text-[#1B5E3A] font-bold hover:underline"
            >
              Create demo volunteer account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
