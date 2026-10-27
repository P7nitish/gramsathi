import React, { useState, useEffect } from 'react';
import { Language, AuthUser } from './types';
import { getStoredLanguage, setStoredLanguage, getStoredAuthUser, setStoredAuthUser } from './utils/storage';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalSearch } from './components/common/GlobalSearch';

// Pages
import { HomePage } from './pages/HomePage';
import { FloodPage } from './pages/FloodPage';
import { RationPage } from './pages/RationPage';
import { RoadsPage } from './pages/RoadsPage';
import { LightingPage } from './pages/LightingPage';
import { SanitationPage } from './pages/SanitationPage';
import { GrievancesPage } from './pages/GrievancesPage';
import { GrievanceReportPage } from './pages/GrievanceReportPage';
import { GrievanceTrackPage } from './pages/GrievanceTrackPage';
import { YouthPage } from './pages/YouthPage';
import { SchemesPage } from './pages/SchemesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [language, setLanguage] = useState<Language>('en');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize path from window.location and listen to popstate
  useEffect(() => {
    setLanguage(getStoredLanguage());
    setAuthUser(getStoredAuthUser());

    const updatePathFromLocation = () => {
      const path = window.location.pathname || '/';
      const search = window.location.search || '';
      setCurrentPath(path + search);
    };

    updatePathFromLocation();
    window.addEventListener('popstate', updatePathFromLocation);
    return () => window.removeEventListener('popstate', updatePathFromLocation);
  }, []);

  // Navigation handler
  const handleNavigate = (pathWithSearch: string) => {
    setCurrentPath(pathWithSearch);
    window.history.pushState({}, '', pathWithSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language toggle
  const handleLanguageToggle = () => {
    const nextLang: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    setStoredLanguage(nextLang);
  };

  // Sign out
  const handleSignOut = () => {
    setAuthUser(null);
    setStoredAuthUser(null);
  };

  // Extract base route and query parameters
  const [routePath, queryString] = currentPath.split('?');
  const queryParams = new URLSearchParams(queryString || '');
  const grievanceQueryId = queryParams.get('id') || '';
  const villageQueryId = queryParams.get('village') || 'all';

  // Render appropriate view based on route
  const renderCurrentView = () => {
    switch (routePath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} language={language} />;
      case '/flood':
        return <FloodPage onNavigate={handleNavigate} language={language} />;
      case '/ration':
        return <RationPage onNavigate={handleNavigate} language={language} />;
      case '/roads':
        return <RoadsPage onNavigate={handleNavigate} language={language} />;
      case '/lighting':
        return <LightingPage onNavigate={handleNavigate} language={language} />;
      case '/sanitation':
        return <SanitationPage onNavigate={handleNavigate} language={language} />;
      case '/grievances':
        return <GrievancesPage onNavigate={handleNavigate} language={language} />;
      case '/grievances/report':
        return <GrievanceReportPage onNavigate={handleNavigate} language={language} />;
      case '/grievances/track':
        return (
          <GrievanceTrackPage
            onNavigate={handleNavigate}
            language={language}
            initialQueryId={grievanceQueryId}
          />
        );
      case '/youth':
        return <YouthPage onNavigate={handleNavigate} language={language} />;
      case '/schemes':
        return <SchemesPage onNavigate={handleNavigate} language={language} />;
      case '/dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            language={language}
            initialVillageId={villageQueryId}
          />
        );
      case '/about':
        return <AboutPage onNavigate={handleNavigate} language={language} />;
      case '/privacy':
        return <PrivacyPage onNavigate={handleNavigate} language={language} />;
      case '/accessibility':
        return <AccessibilityPage onNavigate={handleNavigate} language={language} />;
      case '/terms':
        return <TermsPage onNavigate={handleNavigate} language={language} />;
      case '/auth/login':
        return (
          <LoginPage
            onNavigate={handleNavigate}
            language={language}
            onLoginSuccess={setAuthUser}
          />
        );
      case '/auth/register':
        return (
          <RegisterPage
            onNavigate={handleNavigate}
            language={language}
            onLoginSuccess={setAuthUser}
          />
        );
      default:
        // Fallback to Home if unknown route
        return <HomePage onNavigate={handleNavigate} language={language} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC] text-[#0B1B2B]">
      {/* Sticky Header with Navigation, Search & Language Toggle */}
      <Navbar
        currentPath={routePath}
        onNavigate={handleNavigate}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        onOpenSearch={() => setSearchOpen(true)}
        authUser={authUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Region */}
      <main id="main-content" className="flex-1 focus:outline-hidden">
        {renderCurrentView()}
      </main>

      {/* Global ⌘K Search Modal */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Footer with Mandatory Proposal Disclaimer */}
      <Footer onNavigate={handleNavigate} language={language} />
    </div>
  );
}
