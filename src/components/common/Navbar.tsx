import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Globe,
  AlertTriangle,
  ChevronDown,
  User,
  ShieldCheck,
  Droplets,
  Scale,
  Footprints,
  Sun,
  Trash2,
  FileText,
  Sparkles,
  BarChart3,
  Award,
  Layers
} from 'lucide-react';
import { Language, AuthUser } from '../../types';
import { en } from '../../locales/en';
import { hi } from '../../locales/hi';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  language: Language;
  onLanguageToggle: () => void;
  onOpenSearch: () => void;
  authUser: AuthUser | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  language,
  onLanguageToggle,
  onOpenSearch,
  authUser,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const t = language === 'hi' ? hi : en;

  // Global key listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const navLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.dashboard, path: "/dashboard" },
    { label: t.nav.schemes, path: "/schemes" },
    { label: t.nav.youth, path: "/youth" },
    { label: t.nav.about, path: "/about" }
  ];

  const moduleItems = [
    { label: t.nav.flood, path: "/flood", icon: Droplets, color: "text-blue-600" },
    { label: t.nav.ration, path: "/ration", icon: Scale, color: "text-amber-600" },
    { label: t.nav.roads, path: "/roads", icon: Footprints, color: "text-emerald-700" },
    { label: t.nav.lighting, path: "/lighting", icon: Sun, color: "text-yellow-600" },
    { label: t.nav.sanitation, path: "/sanitation", icon: Trash2, color: "text-teal-600" },
    { label: t.nav.grievances, path: "/grievances", icon: FileText, color: "text-red-600" }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setModulesDropdownOpen(false);
  };

  return (
    <>
      {/* Skip to main content link for WCAG keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1B5E3A] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        {t.nav.skipToContent}
      </a>

      {/* Top Advisory Banner */}
      <div className="bg-[#0F2A4A] text-white text-[11px] py-1 px-4 border-b border-blue-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF9933] text-[#0B1B2B] text-[10px] font-bold px-1.5 py-0.2 rounded font-sans uppercase">
              MY Bharat Proposal
            </span>
            <span className="text-slate-200">
              Proposed Rural Civic Technology & Digital Social Innovation Concept
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline text-[10px]">
              Toll-Free Emergency Helpline Integration: <strong className="text-white">1077 (Disaster) / 1912 (Power)</strong>
            </span>
            <button
              type="button"
              onClick={onLanguageToggle}
              className="flex items-center gap-1 hover:text-white transition-colors focus:ring-1 focus:ring-amber-400 rounded px-1"
              aria-label={`Toggle language to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe className="w-3 h-3 text-[#FF9933]" />
              <span className="font-semibold text-white">{t.nav.language}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-[#1B5E3A] rounded-lg p-1"
                aria-label="GRAM Sathi 360 Home"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B5E3A] to-[#0F2A4A] flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-600/20 group-hover:scale-105 transition-transform">
                  <span className="font-heading font-extrabold text-base tracking-tighter">GS</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1B2B] tracking-tight group-hover:text-[#1B5E3A] transition-colors">
                      GRAM Sathi 360°
                    </span>
                    <span className="text-[10px] font-bold text-[#1B5E3A] bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-300">
                      PILOT
                    </span>
                  </div>
                  <p className="text-[10px] text-[#5A6B7B] hidden sm:block font-medium">
                    Smart Rural Development & Citizen Redressal
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => handleNavClick(link.path)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:ring-2 focus:ring-[#1B5E3A] ${
                      isActive
                        ? "text-[#1B5E3A] bg-emerald-50 border border-emerald-200/60"
                        : "text-[#0B1B2B] hover:text-[#1B5E3A] hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* Modules Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModulesDropdownOpen(!modulesDropdownOpen)}
                  onBlur={() => setTimeout(() => setModulesDropdownOpen(false), 200)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors ${
                    modulesDropdownOpen || ['/flood', '/ration', '/roads', '/lighting', '/sanitation', '/grievances'].some(p => currentPath.startsWith(p))
                      ? "text-[#1B5E3A] bg-emerald-50"
                      : "text-[#0B1B2B] hover:text-[#1B5E3A] hover:bg-slate-50"
                  }`}
                  aria-expanded={modulesDropdownOpen}
                  aria-haspopup="true"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t.nav.modules}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modulesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {modulesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      7 Integrated Civic Modules
                    </div>
                    {moduleItems.map((m) => {
                      const Icon = m.icon;
                      const isActive = currentPath.startsWith(m.path);
                      return (
                        <button
                          key={m.path}
                          type="button"
                          onClick={() => handleNavClick(m.path)}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                            isActive ? 'text-[#1B5E3A] bg-emerald-50/60' : 'text-[#0B1B2B]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${m.color}`} />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-slate-50/70 transition-colors focus:ring-2 focus:ring-[#1B5E3A]"
                aria-label="Open search dialog"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Primary Action CTA: Report an Issue */}
              <button
                type="button"
                onClick={() => handleNavClick('/grievances/report')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B5E3A] hover:bg-[#154b2e] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#1B5E3A]"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>{t.nav.reportIssueBtn}</span>
              </button>

              {/* Auth / Demo Sign In Button */}
              {authUser ? (
                <div className="relative flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                    title={`Logged in as ${authUser.name} (${authUser.role}) - Click to sign out`}
                  >
                    <User className="w-4 h-4 text-[#1B5E3A]" />
                    <span className="hidden md:inline max-w-[80px] truncate">{authUser.name}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavClick('/auth/login')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.nav.signIn}</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#0B1B2B] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1B5E3A]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-3">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => handleNavClick('/grievances/report')}
                className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-[#1B5E3A] text-white text-xs font-bold text-center"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Report Issue</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('/grievances/track')}
                className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-50 text-[#1B5E3A] border border-emerald-200 text-xs font-bold text-center"
              >
                <FileText className="w-4 h-4" />
                <span>Track ID</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Navigation</div>
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                    currentPath === link.path ? 'bg-emerald-50 text-[#1B5E3A]' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Civic Modules</div>
              {moduleItems.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.path}
                    type="button"
                    onClick={() => handleNavClick(m.path)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                  >
                    <Icon className={`w-4 h-4 ${m.color}`} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onLanguageToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 font-bold text-[#0B1B2B]"
              >
                <Globe className="w-4 h-4 text-[#FF9933]" />
                <span>Switch to {t.nav.language}</span>
              </button>
              {!authUser ? (
                <button
                  type="button"
                  onClick={() => handleNavClick('/auth/login')}
                  className="px-3 py-1.5 rounded-lg bg-[#0F2A4A] text-white font-bold"
                >
                  Sign In (Demo)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
