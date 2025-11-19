import React from 'react';
import { Task, TaskPriority, TaskCategory } from '../types';
import { CheckCircle2, Circle, Trash2, Clock, Calendar, Sparkles, Dumbbell, BookOpen, HelpCircle, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  [TaskPriority.LOW]: 'text-slate-400 border-slate-700',
  [TaskPriority.MEDIUM]: 'text-blue-400 border-blue-900/50',
  [TaskPriority.HIGH]: 'text-orange-400 border-orange-900/50',
  [TaskPriority.CRITICAL]: 'text-red-500 border-red-900/50 animate-pulse-slow',
};

const CategoryIcon = ({ category }: { category: TaskCategory }) => {
  switch (category) {
    case TaskCategory.STUDY: return <BookOpen className="w-3 h-3" />;
    case TaskCategory.EXERCISE: return <Dumbbell className="w-3 h-3" />;
    default: return <HelpCircle className="w-3 h-3" />;
  }
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
        <p className="text-slate-500">No tasks found for this filter.</p>
      </div>
    );
  }

  // Helper to determine status
  const getTaskStatus = (task: Task) => {
    if (task.completed) return null;
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (due < now) return 'overdue';
    if (diffHours < 24) return 'soon';
    return 'future';
  };

  // Sort: Pending first, then Overdue, then Priority, then Date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const now = new Date().getTime();
    const aOverdue = new Date(a.dueDate).getTime() < now;
    const bOverdue = new Date(b.dueDate).getTime() < now;
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const priorityWeight = { [TaskPriority.CRITICAL]: 4, [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => {
        const status = getTaskStatus(task);
        const isOverdue = status === 'overdue';
        const isDueSoon = status === 'soon';

        return (
          <div 
            key={task.id}
            className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/50 rounded-xl border transition-all hover:border-slate-600 hover:shadow-md 
              ${task.completed ? 'opacity-60 border-slate-800 bg-slate-900/30' : isOverdue ? 'border-red-900/50 bg-red-900/5' : 'border-slate-700'}
            `}
          >
            <div className="flex items-start gap-4 mb-3 sm:mb-0">
              <button 
                onClick={() => onToggle(task.id)}
                className={`mt-1 transition-colors ${task.completed ? 'text-green-500' : 'text-slate-500 hover:text-accent-500'}`}
              >
                {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium text-lg ${task.completed ? 'text-slate-500 line-through decoration-2 decoration-slate-600' : 'text-slate-100'}`}>
                    {task.title}
                  </h3>
                  {isOverdue && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
                      <AlertCircle className="w-3 h-3" /> Overdue
                    </span>
                  )}
                  {isDueSoon && (
                     <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                      <Clock className="w-3 h-3" /> Due Soon
                    </span>
                  )}
                </div>
                
                {/* Tags Row */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 mb-1">
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded border border-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${priorityColors[task.priority]} bg-opacity-10 bg-slate-900`}>
                    {task.priority}
                  </span>
                  
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${task.category === TaskCategory.STUDY ? 'text-indigo-400 border-indigo-900/50' : 'text-emerald-400 border-emerald-900/50'} bg-opacity-10 bg-slate-900`}>
                    <CategoryIcon category={task.category} />
                    {task.category}
                  </span>

                  {task.dueDate && (
                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : ''}`}>
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString()} 
                      <Clock className="w-3 h-3 ml-1" />
                      {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 ml-10 sm:ml-0">
              <div className="flex items-center gap-1 text-accent-400 font-bold text-sm bg-accent-500/10 px-2 py-1 rounded-md">
                {task.isAiScored && <Sparkles className="w-3 h-3 text-yellow-400" />}
                +{task.points} XP
              </div>
              
              <button 
                onClick={() => onDelete(task.id)}
                className="sm:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                aria-label="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;