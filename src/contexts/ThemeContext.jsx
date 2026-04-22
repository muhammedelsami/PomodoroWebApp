import { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextValue';

const THEME = 'red';
const THEMES = {
  red: {
    light: {
      primary: '#FF4F4F',
      secondary: '#4F9DA6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      input: '#F3F4F6',
      inputBorder: '#E5E7EB',
      inputText: '#1F2937',
      inputPlaceholder: '#9CA3AF',
      taskBg: '#F9FAFB',
      taskText: '#374151',
      taskCompleted: '#9CA3AF',
    },
    dark: {
      primary: '#FF6B6B',
      secondary: '#66B2B2',
      background: '#1F2937',
      text: '#F3F4F6',
      border: '#374151',
      input: '#374151',
      inputBorder: '#4B5563',
      inputText: '#F9FAFB',
      inputPlaceholder: '#9CA3AF',
      taskBg: '#111827',
      taskText: '#D1D5DB',
      taskCompleted: '#6B7280',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const updateThemeColors = useCallback((darkMode) => {
    const mode = darkMode ? 'dark' : 'light';
    const colors = THEMES[THEME][mode];
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-background', colors.background);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-border', colors.border);
    document.documentElement.style.setProperty('--color-input', colors.input);
    document.documentElement.style.setProperty('--color-input-border', colors.inputBorder);
    document.documentElement.style.setProperty('--color-input-text', colors.inputText);
    document.documentElement.style.setProperty('--color-input-placeholder', colors.inputPlaceholder);
    document.documentElement.style.setProperty('--color-task-bg', colors.taskBg);
    document.documentElement.style.setProperty('--color-task-text', colors.taskText);
    document.documentElement.style.setProperty('--color-task-completed', colors.taskCompleted);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  useEffect(() => {
    updateThemeColors(isDarkMode);
  }, [isDarkMode, updateThemeColors]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};