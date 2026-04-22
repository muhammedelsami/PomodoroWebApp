import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { formatMinutes } from '../utils/time';

const StatsPanel = ({ todayStats, dailyGoal, sessionHistory }) => {
  const { t } = useTranslation();
  const goalProgress = Math.min((todayStats.completedPomodoros / dailyGoal) * 100, 100);

  return (
    <section className="panel h-full p-4 sm:p-6">
      <h2 className="panel-title mb-4">{t('statsTitle')}</h2>
      <div className="mb-5 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/35 p-3">
          <p className="text-2xl font-bold text-[var(--color-primary)]">{todayStats.completedPomodoros}</p>
          <p className="text-xs opacity-70">{t('completedPomodoros')}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/35 p-3">
          <p className="text-2xl font-bold text-[var(--color-secondary)]">{todayStats.completedTasks}</p>
          <p className="text-xs opacity-70">{t('completedTasks')}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/35 p-3">
          <p className="text-2xl font-bold text-[var(--color-secondary)]">
            {formatMinutes(todayStats.focusedSeconds)}
          </p>
          <p className="text-xs opacity-70">{t('focusMinutes')}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>{t('dailyGoalProgress')}</span>
          <span>%{Math.round(goalProgress)}</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-300/40">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide opacity-70">{t('recentSessions')}</h3>
        <div className="space-y-2">
          {sessionHistory.slice(0, 5).map((session) => (
            <div key={session.id} className="flex justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/35 px-3 py-2 text-sm">
              <span>{t(`modes.${session.mode}`)}</span>
              <span className="opacity-70">{format(new Date(session.completedAt), 'HH:mm')}</span>
            </div>
          ))}
          {sessionHistory.length === 0 && <p className="text-sm opacity-70">{t('noSessions')}</p>}
        </div>
      </div>
    </section>
  );
};

export default StatsPanel;
