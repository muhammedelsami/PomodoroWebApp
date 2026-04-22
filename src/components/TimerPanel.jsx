import { ArrowPathIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import CircularCountdown from './CircularCountdown';
import { formatTime } from '../utils/time';

const modeButtons = [{ id: 'focus' }, { id: 'shortBreak' }, { id: 'longBreak' }];

const TimerPanel = ({
  selectedMode,
  remainingSeconds,
  progress,
  isRunning,
  onModeChange,
  onToggleRunning,
  onReset,
}) => {
  const { t } = useTranslation();

  return (
    <section className="panel p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="panel-title">{t('modes.focus')} Timer</h2>
        <span className="chip bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]">{t(`modes.${selectedMode}`)}</span>
      </div>
      <div className="mb-7 flex flex-wrap items-center gap-2">
        {modeButtons.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`btn ${selectedMode === mode.id ? 'btn-primary' : 'btn-secondary opacity-70'} text-sm`}
            onClick={() => onModeChange(mode.id)}
          >
            {t(`modes.${mode.id}`)}
          </button>
        ))}
      </div>

      <div className="mb-8 flex justify-center">
        <div className="relative rounded-full bg-[var(--color-background)]/40 p-2 sm:p-4">
          <CircularCountdown progress={progress} size={240} strokeWidth={11} />
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-mono font-semibold tracking-wider sm:text-6xl">
            {formatTime(remainingSeconds)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <button type="button" className="btn btn-primary inline-flex min-w-32 items-center justify-center gap-2" onClick={onToggleRunning}>
          {isRunning ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          {isRunning ? t('pause') : t('start')}
        </button>
        <button type="button" className="btn btn-secondary inline-flex min-w-32 items-center justify-center gap-2" onClick={onReset}>
          <ArrowPathIcon className="h-5 w-5" />
          {t('reset')}
        </button>
      </div>
    </section>
  );
};

export default TimerPanel;
