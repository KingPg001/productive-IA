import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsDashboard from './components/StatsDashboard';
import AIInsight from './components/AIInsight';
import ExamCountdown from './components/ExamCountdown';
import NotificationBanner from './components/NotificationBanner';
import { Task, UserStats, DailyPerformance, TaskCategory } from './types';
import { Filter, Search, BarChart2 } from 'lucide-react';

// Mock initial data
const INITIAL_STATS: UserStats = {
  totalPoints: 0,
  level: 1,
  tasksCompleted: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completionRate: 0
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [dailyHistory, setDailyHistory] = useState<DailyPerformance[]>(() => {
     const saved = localStorage.getItem('dailyHistory');
     return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('dailyHistory', JSON.stringify(dailyHistory));
  }, [dailyHistory]);

  const addTask = (taskData: Task) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      
      const isCompleting = !t.completed;
      
      // Update Stats immediately
      updateStats(isCompleting, t.points);
      
      return {
        ...t,
        completed: isCompleting,
        completedAt: isCompleting ? new Date().toISOString() : undefined
      };
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateStats = (isCompleting: boolean, points: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setUserStats(prev => {
      const newTotalPoints = isCompleting ? prev.totalPoints + points : Math.max(0, prev.totalPoints - points);
      const newTasksCompleted = isCompleting ? prev.tasksCompleted + 1 : Math.max(0, prev.tasksCompleted - 1);
      
      // Calculate streak logic (simplified)
      let streak = prev.currentStreak;
      if (isCompleting && prev.lastActiveDate !== today) {
         streak += 1;
      }
      
      const totalTasks = tasks.length; // Approximation
      const rate = totalTasks > 0 ? Math.round((newTasksCompleted / totalTasks) * 100) : 0;

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: Math.floor(newTotalPoints / 500) + 1,
        tasksCompleted: newTasksCompleted,
        currentStreak: streak || 1,
        lastActiveDate: today,
        completionRate: rate
      };
    });

    setDailyHistory(prev => {
        const existingEntryIndex = prev.findIndex(d => d.date === today);
        const newHistory = [...prev];
        
        if (existingEntryIndex >= 0) {
            newHistory[existingEntryIndex].pointsEarned += isCompleting ? points : -points;
            newHistory[existingEntryIndex].tasksCompleted += isCompleting ? 1 : -1;
        } else {
            newHistory.push({
                date: today,
                pointsEarned: isCompleting ? points : 0,
                tasksCompleted: isCompleting ? 1 : 0
            });
        }
        return newHistory;
    });
  };

  // Recalculate completion rate based on current list view
  useEffect(() => {
     const total = tasks.length;
     const completed = tasks.filter(t => t.completed).length;
     const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
     setUserStats(prev => ({...prev, completionRate: rate}));
  }, [tasks]);

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filterCategory === 'ALL' || task.category === filterCategory;
    
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      task.title.toLowerCase().includes(lowerQuery) || 
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));

    return matchesCategory && matchesSearch;
  });

  // Derived State for Notifications and Exam
  const now = new Date();
  const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length;
  const dueSoonCount = tasks.filter(t => !t.completed && new Date(t.dueDate) > now && (new Date(t.dueDate).getTime() - now.getTime() < 24 * 60 * 60 * 1000)).length;
  
  // Find nearest upcoming exam (Task with tag 'Exam' or in category 'Study' with 'exam' in title/tags)
  const nextExam = tasks
    .filter(t => !t.completed && new Date(t.dueDate) > now && t.tags.some(tag => tag.toLowerCase().includes('exam')))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Header 
        stats={userStats} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        
        {activeTab === 'analytics' && (
           <div className="animate-fade-in">
             <AIInsight tasks={tasks} stats={userStats} />
             <StatsDashboard tasks={tasks} dailyHistory={dailyHistory} userStats={userStats} />
           </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             
             {/* Main Content Area (Left/Center) */}
             <div className="lg:col-span-8">
                
                {/* Top Widgets Row - Side by Side on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="col-span-1">
                     <NotificationBanner overdueCount={overdueCount} dueSoonCount={dueSoonCount} />
                  </div>
                  <div className="col-span-1">
                     {nextExam && <ExamCountdown targetDate={nextExam.dueDate} title={nextExam.title} />}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                     Today's Focus
                     <span className="text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                       {tasks.filter(t => !t.completed).length} Pending
                     </span>
                   </h2>
                </div>
                
                <TaskForm onAddTask={addTask} />

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 flex-1 bg-slate-950/50 border border-slate-800/50 rounded-lg px-3 py-2 focus-within:border-accent-500 transition-colors">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search activities..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
                    <Filter className="w-4 h-4 text-slate-500 mr-2 hidden sm:block" />
                    {['ALL', TaskCategory.STUDY, TaskCategory.EXERCISE, TaskCategory.OTHER].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                          filterCategory === cat 
                            ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        {cat === 'ALL' ? 'All' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
             </div>

             {/* Sidebar (Right) */}
             <div className="hidden lg:block lg:col-span-4 space-y-6">
                 <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sticky top-24">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-accent-500" />
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                          <span className="text-slate-400 text-sm">XP Gained Today</span>
                          <span className="text-accent-400 font-mono font-bold">
                             +{dailyHistory.find(d => d.date === new Date().toISOString().split('T')[0])?.pointsEarned || 0}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                            <div className="text-xs text-slate-500 mb-1">Study Tasks</div>
                            <div className="text-indigo-400 font-mono font-bold text-xl">
                               {tasks.filter(t => t.category === TaskCategory.STUDY && !t.completed).length}
                            </div>
                          </div>
                          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                            <div className="text-xs text-slate-500 mb-1">Workouts</div>
                            <div className="text-emerald-400 font-mono font-bold text-xl">
                               {tasks.filter(t => t.category === TaskCategory.EXERCISE && !t.completed).length}
                            </div>
                          </div>
                       </div>

                       {(overdueCount > 0 || dueSoonCount > 0) && (
                         <div className="pt-4 border-t border-slate-800/50 space-y-2">
                            {overdueCount > 0 && (
                               <div className="flex justify-between text-xs text-red-300 bg-red-900/20 px-3 py-2 rounded">
                                  <span>Overdue</span>
                                  <span className="font-bold">{overdueCount}</span>
                               </div>
                            )}
                            {dueSoonCount > 0 && (
                               <div className="flex justify-between text-xs text-amber-300 bg-amber-900/20 px-3 py-2 rounded">
                                  <span>Due Soon</span>
                                  <span className="font-bold">{dueSoonCount}</span>
                               </div>
                            )}
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={() => setActiveTab('analytics')} 
                      className="w-full mt-6 py-2 text-xs font-semibold text-center text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      View Full Report
                    </button>
                 </div>
             </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;