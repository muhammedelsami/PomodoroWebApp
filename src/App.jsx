import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import TasksPanel from './components/TasksPanel';
import TimerPanel from './components/TimerPanel';
import { usePomodoro } from './hooks/usePomodoro';

function App() {
  const { i18n } = useTranslation();
  const {
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
  } = usePomodoro();

  useEffect(() => {
    const isArabic = i18n.language === 'ar';
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-3 py-4 text-[var(--color-text)] transition-colors duration-300 sm:px-4 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <Header dailyGoal={dailyGoal} onGoalChange={setDailyGoal} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="space-y-4 lg:col-span-8 lg:space-y-5">
            <TimerPanel
              selectedMode={selectedMode}
              remainingSeconds={remainingSeconds}
              progress={progress}
              isRunning={isRunning}
              onModeChange={switchMode}
              onToggleRunning={toggleRunning}
              onReset={resetTimer}
            />
            <TasksPanel tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
          </div>
          <div className="lg:col-span-4">
            <StatsPanel todayStats={todayStats} dailyGoal={dailyGoal} sessionHistory={sessionHistory} />
          </div>
        </div>
        <Toaster position={i18n.language === 'ar' ? 'bottom-left' : 'bottom-right'} />
      </div>
    </div>
  );
}

export default App;
