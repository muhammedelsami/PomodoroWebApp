import { useState, useEffect } from 'react';
import { BellIcon, PauseIcon, PlayIcon, ChartBarIcon, CheckIcon, SwatchIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from './contexts/ThemeContext';

import CircularCountdown from './components/CircularCountdown';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

function App() {
  const { theme, changeTheme, themes, isDarkMode, toggleDarkMode } = useTheme();
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [stats, setStats] = useState({
    completedPomodoros: 0,
    totalWorkTime: 0,
    completedTasks: 0
  });

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        if (isWorkTime) {
          setStats(prev => ({ ...prev, totalWorkTime: prev.totalWorkTime + 1 }));
        }
      }, 1000);
    } else if (time === 0) {
      const notification = new Audio('/notification.mp3');
      notification.play();
      if (Notification.permission === 'granted') {
        new Notification(isWorkTime ? 'Break Time!' : 'Back to Work!', {
          body: `${isWorkTime ? 'Take a break!' : 'Time to focus!'}`
        });
      }
      toast.success(`${isWorkTime ? 'Break time!' : 'Work time!'} 🎉`);
      if (isWorkTime) {
        setStats(prev => ({ ...prev, completedPomodoros: prev.completedPomodoros + 1 }));
      }
      setIsWorkTime(!isWorkTime);
      setTime(isWorkTime ? breakDuration * 60 : workDuration * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isWorkTime, workDuration, breakDuration]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = () => setIsRunning(!isRunning);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === 'work') {
      setWorkDuration(value);
      if (isWorkTime) setTime(value * 60);
    } else {
      setBreakDuration(value);
      if (!isWorkTime) setTime(value * 60);
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) {
          setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1 }));
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] p-4 md:p-8 transition-colors duration-200" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="btn btn-secondary inline-flex items-center gap-2"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[var(--color-input)] border border-[var(--color-border)] rounded-xl shadow-lg p-6 md:p-8" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-border)' }}>
            <h1 className="text-4xl font-bold text-center mb-8 text-[var(--color-primary)]">Pomodoro Timer</h1>
            
            <div className="text-center mb-8 flex flex-col items-center gap-4">
              <div className="relative inline-block">
                <CircularCountdown progress={time / (isWorkTime ? workDuration * 60 : breakDuration * 60)} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-mono">{formatTime(time)}</div>
                </div>
              </div>
              <button
                onClick={toggleTimer}
                className="btn btn-primary inline-flex items-center"
              >
                {isRunning ? (
                  <>
                    <PauseIcon className="h-5 w-5 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5 mr-2" /> Start
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Work Duration (min)</label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => handleDurationChange(e, 'work')}
                  className="input w-full"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Break Duration (min)</label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => handleDurationChange(e, 'break')}
                  className="input w-full"
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <div className="text-center text-sm" style={{ color: 'var(--color-text)' }}>
              {isWorkTime ? 'Work Time' : 'Break Time'}
            </div>
          </div>

          <div className="bg-[var(--color-input)] border border-[var(--color-border)] rounded-xl shadow-lg p-6 md:p-8" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5 text-[var(--color-secondary)]" />
                <span className="text-sm font-medium">Stats</span>
              </div>
            </div>

            <form onSubmit={addTask} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task"
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-secondary">
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2 mb-8">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center p-3 rounded-lg ${task.completed ? 'bg-[var(--color-taskBg)]' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  style={{ backgroundColor: task.completed ? 'var(--color-taskBg)' : 'transparent' }}
                >
                  <div className={`flex-1 ${task.completed ? 'line-through text-[var(--color-taskCompleted)]' : 'text-[var(--color-taskText)]'}`}>
                    {task.text}
                  </div>
                  {task.completed && <CheckIcon className="h-5 w-5 text-[var(--color-secondary)]" />}
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <h3 className="text-lg font-semibold mb-3">Today's Progress</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.completedPomodoros}</div>
                  <div className="text-sm text-[var(--color-taskCompleted)]">Completed Pomodoros</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-secondary)]">
                    {Math.floor(stats.totalWorkTime / 60)}
                  </div>
                  <div className="text-sm text-[var(--color-taskCompleted)]">Total Work Time (min)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--color-secondary)]">{stats.completedTasks}</div>
                  <div className="text-sm text-[var(--color-taskCompleted)]">Completed Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

export default App;
