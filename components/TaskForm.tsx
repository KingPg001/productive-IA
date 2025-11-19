
import React, { useState } from 'react';
import { TaskCategory, TaskPriority } from '../types';
import { Plus, Loader2, Sparkles, X, Tag as TagIcon } from 'lucide-react';
import { estimateTaskPoints } from '../services/geminiService';

interface TaskFormProps {
  onAddTask: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.STUDY);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const handleAddTag = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let points = 20; // Default base points
    let isAiScored = false;

    if (useAI) {
      setIsEstimating(true);
      try {
        points = await estimateTaskPoints(title, '', priority, tags);
        isAiScored = true;
      } catch (err) {
        console.error("AI fail", err);
      } finally {
        setIsEstimating(false);
      }
    } else {
      // Manual simple logic
      if (priority === TaskPriority.HIGH) points = 50;
      if (priority === TaskPriority.CRITICAL) points = 80;
    }

    onAddTask({
      title,
      category,
      priority,
      dueDate: dueDate || new Date().toISOString(),
      points,
      tags,
      isAiScored,
      completed: false,
      completedAt: undefined
    });

    setTitle('');
    setDueDate('');
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 shadow-lg backdrop-blur-sm">
      <div className="space-y-4">
        
        {/* Top Row: Title */}
        <div>
          <label className="block text-xs text-slate-400 font-medium mb-1">Activity Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Math Chapter 5 Review or 5km Run"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Middle Row: Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/3">
             <label className="block text-xs text-slate-400 font-medium mb-1">Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:ring-2 focus:ring-accent-500 outline-none"
            >
              {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-xs text-slate-400 font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:ring-2 focus:ring-accent-500 outline-none"
            >
              {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/3">
             <label className="block text-xs text-slate-400 font-medium mb-1">Deadline</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:ring-2 focus:ring-accent-500 outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Tags Input Section */}
        <div>
          <label className="block text-xs text-slate-400 font-medium mb-1">Custom Tags (Press Enter)</label>
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-700 rounded-lg focus-within:ring-2 focus-within:ring-accent-500 focus-within:border-transparent">
            <TagIcon className="w-4 h-4 text-slate-500 ml-2" />
            <input 
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags like 'Chemistry', 'Cardio', 'Leg Day'..."
              className="flex-1 bg-transparent text-sm text-white px-2 py-1.5 outline-none placeholder:text-slate-600"
            />
            <button
              type="button" 
              onClick={handleAddTag}
              className="p-1 hover:bg-slate-700 rounded mr-1"
            >
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-slate-700 text-slate-200 border border-slate-600">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Row */}
        <div className="flex items-center gap-2 pt-2">
           <button
            type="button"
            onClick={() => setUseAI(!useAI)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors text-sm ${useAI ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}
            title={useAI ? "AI Scoring Enabled" : "AI Scoring Disabled"}
          >
            <Sparkles className="w-4 h-4" />
            {useAI ? 'AI Scoring On' : 'Manual Scoring'}
          </button>

          <button
            type="submit"
            disabled={!title.trim() || isEstimating}
            className="flex-1 flex items-center justify-center bg-accent-600 hover:bg-accent-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEstimating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            <span className="ml-2">Add Activity</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
