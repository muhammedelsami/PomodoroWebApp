import { LanguageIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/useTheme';

const Header = ({ dailyGoal, onGoalChange }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);

  const handleLanguageChange = (selectedLanguage) => {
    i18n.changeLanguage(selectedLanguage);
    window.localStorage.setItem('language', selectedLanguage);
    setIsLanguageMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="panel overflow-hidden p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="chip mb-3 inline-flex bg-[var(--color-primary)]/15 text-[var(--color-primary)]">v2 Dashboard</span>
          <h1 className="text-2xl font-bold leading-tight text-[var(--color-primary)] sm:text-3xl">{t('appName')}</h1>
          <p className="mt-1 text-sm opacity-80">{t('appSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              className="btn btn-secondary inline-flex items-center gap-2"
              onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
              aria-label={t('language')}
              aria-expanded={isLanguageMenuOpen}
            >
              <LanguageIcon className="h-5 w-5" />
              <span className="text-sm">{i18n.language.toUpperCase()}</span>
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute end-0 z-20 mt-2 w-40 rounded-2xl border border-[var(--color-border)] bg-[var(--color-input)] p-2 shadow-xl">
                <button
                  type="button"
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    i18n.language === 'tr' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-background)]/60'
                  }`}
                  onClick={() => handleLanguageChange('tr')}
                >
                  Türkçe
                </button>
                <button
                  type="button"
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    i18n.language === 'en' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-background)]/60'
                  }`}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    i18n.language === 'ar' ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-background)]/60'
                  }`}
                  onClick={() => handleLanguageChange('ar')}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-secondary inline-flex items-center"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? t('themeToggleLight') : t('themeToggleDark')}
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/35 p-3 sm:grid-cols-3 sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-70">{t('dailyGoal')}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="24"
              value={dailyGoal}
              onChange={(event) => onGoalChange(Number(event.target.value))}
              className="input w-24 min-w-0"
            />
            <span className="muted">{t('goals')}</span>
          </div>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-70">{t('language')}</span>
          <p className="muted py-2">{i18n.language.toUpperCase()}</p>
        </label>
        <div className="hidden sm:block" />
      </div>
    </header>
  );
};

export default Header;
