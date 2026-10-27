import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Eye, Keyboard, HelpCircle, Send } from 'lucide-react';
import { Language } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const AccessibilityPage: React.FC<{ onNavigate: (path: string) => void; language: Language }> = ({ onNavigate }) => {
  const [altRequestSent, setAltRequestSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [format, setFormat] = useState('large_print');

  const handleAltSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setAltRequestSent(true);
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[{ label: "Accessibility Statement" }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1B5E3A] text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>WCAG 2.1 AA Compliance Standard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0B1B2B]">
            Accessibility Statement & Inclusivity Commitment
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            Conforms to Guidelines for Indian Government Websites (GIGW 3.0) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>

          <div className="space-y-6 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                1. Technical Accessibility Implementations
              </h2>
              <ul className="space-y-2 list-disc list-inside text-slate-600 pl-2">
                <li><strong>Keyboard Navigation:</strong> All interactive buttons, modals, dropdowns, and form steps are fully navigable via <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px]">Tab</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px]">Enter</kbd>, and <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px]">Esc</kbd>.</li>
                <li><strong>Visible Focus Rings:</strong> High-contrast 2px solid emerald outlines on all focused elements.</li>
                <li><strong>Screen Reader Semantic Tree:</strong> Proper ARIA roles, live status regions, and descriptive labels on all buttons.</li>
                <li><strong>Reduced Motion Support:</strong> The CSS engine honors `prefers-reduced-motion: reduce` by dampening animations.</li>
                <li><strong>Bilingual Vernacular:</strong> Instant toggling between English and Hindi (Devanagari) across all navigation and modules.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading mb-1.5">
                2. Known Technical Limitations & Mitigations
              </h2>
              <p>
                Certain third-party map tiles rendered via OpenStreetMap raster imagery do not contain programmatic screen reader vector overlays. To maintain full accessibility, all map pins are simultaneously accompanied by accessible, sortable HTML data tables containing identical information.
              </p>
            </div>

            {/* Alternate format request */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Request Alternate Accessible Formats
              </h3>
              <p className="text-xs text-slate-600">
                If you encounter any accessibility barrier or require proposal documentation in audio or braille-ready text:
              </p>

              {altRequestSent ? (
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
                  Thank you! Your alternate format request has been logged. Our accessibility desk will respond within 3 business days.
                </div>
              ) : (
                <form onSubmit={handleAltSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                      required
                    />
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value)}
                      className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="large_print">Large Print (24pt PDF)</option>
                      <option value="audio_transcription">Audio Summary Readout</option>
                      <option value="plain_text">High-Contrast Plain Text</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B5E3A] hover:bg-[#154b2e] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Submit Format Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
