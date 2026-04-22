import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TasksPanel = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [draftTask, setDraftTask] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draftTask.trim()) return;
    onAddTask(draftTask);
    setDraftTask('');
  };

  return (
    <section className="panel p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="panel-title">{t('tasks')}</h2>
        <span className="chip bg-[var(--color-primary)]/15 text-[var(--color-primary)]">{tasks.length} {t('records')}</span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={draftTask}
          onChange={(event) => setDraftTask(event.target.value)}
          className="input"
          placeholder={t('newTaskPlaceholder')}
        />
        <button type="submit" className="btn btn-primary sm:w-auto">
          {t('addTask')}
        </button>
      </form>

      <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/35 px-3 py-2.5"
          >
            <button type="button" className="btn btn-secondary !px-2 !py-2" onClick={() => onToggleTask(task.id)}>
              <CheckIcon className="h-4 w-4" />
            </button>
            <p className={`flex-1 text-sm font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</p>
            <button type="button" className="btn btn-secondary !px-2 !py-2" onClick={() => onDeleteTask(task.id)}>
              <TrashIcon className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TasksPanel;
