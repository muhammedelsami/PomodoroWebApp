import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './useLocalStorage';
import { todayKey } from '../utils/time';

const PRESETS = {
  focus: { duration: 25 * 60 },
  shortBreak: { duration: 5 * 60 },
  longBreak: { duration: 15 * 60 },
};

export const usePomodoro = () => {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState('focus');
  const [remainingSeconds, setRemainingSeconds] = useState(PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyGoal, setDailyGoal] = useLocalStorage('daily-goal', 8);
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [statsByDay, setStatsByDay] = useLocalStorage('stats-by-day', {});
  const [sessionHistory, setSessionHistory] = useLocalStorage('session-history', []);

  const today = todayKey();
  const todayStats = statsByDay[today] ?? {
    completedPomodoros: 0,
    completedTasks: 0,
    focusedSeconds: 0,
  };

  const updateTodayStats = useCallback(
    (updater) => {
      setStatsByDay((prev) => {
        const currentDayStats = prev[today] ?? {
          completedPomodoros: 0,
          completedTasks: 0,
          focusedSeconds: 0,
        };
        return {
          ...prev,
          [today]: updater(currentDayStats),
        };
      });
    },
    [setStatsByDay, today],
  );

  const switchMode = useCallback((mode) => {
    setSelectedMode(mode);
    setRemainingSeconds(PRESETS[mode].duration);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
      if (selectedMode === 'focus') {
        updateTodayStats((stats) => ({
          ...stats,
          focusedSeconds: stats.focusedSeconds + 1,
        }));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, selectedMode, updateTodayStats]);

  useEffect(() => {
    if (remainingSeconds > 0) {
      return;
    }

    setIsRunning(false);
    if (selectedMode === 'focus') {
      updateTodayStats((stats) => ({
        ...stats,
        completedPomodoros: stats.completedPomodoros + 1,
      }));
    }

    setSessionHistory((prev) => [
      {
        id: Date.now(),
        mode: selectedMode,
        completedAt: new Date().toISOString(),
      },
      ...prev.slice(0, 14),
    ]);

    toast.success(selectedMode === 'focus' ? t('toastFocusDone') : t('toastBreakDone'));
    if (selectedMode === 'focus') {
      switchMode('shortBreak');
    } else {
      switchMode('focus');
    }
  }, [remainingSeconds, selectedMode, setSessionHistory, switchMode, t, updateTodayStats]);

  const progress = useMemo(() => {
    const total = PRESETS[selectedMode].duration;
    return remainingSeconds / total;
  }, [remainingSeconds, selectedMode]);

  const toggleRunning = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setRemainingSeconds(PRESETS[selectedMode].duration);
    setIsRunning(false);
  };

  const addTask = (title) => {
    setTasks((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        completed: false,
        pomodoros: 1,
      },
      ...prev,
    ]);
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );

    const selectedTask = tasks.find((task) => task.id === taskId);
    if (selectedTask && !selectedTask.completed) {
      updateTodayStats((stats) => ({
        ...stats,
        completedTasks: stats.completedTasks + 1,
      }));
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return {
    isRunning,
    selectedMode,
    remainingSeconds,
    progress,
    tasks,
    dailyGoal,
    todayStats,
    sessionHistory,
    setDailyGoal,
    switchMode,
    toggleRunning,
    resetTimer,
    addTask,
    toggleTask,
    deleteTask,
  };
};
