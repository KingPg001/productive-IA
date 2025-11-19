import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Task, UserStats, DailyPerformance } from '../types';

interface StatsDashboardProps {
  tasks: Task[];
  dailyHistory: DailyPerformance[];
  userStats: UserStats;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks, dailyHistory, userStats }) => {
  
  // Prepare Data for Category Pie Chart
  const categoryDataMap = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categoryDataMap).map(key => ({
    name: key,
    value: categoryDataMap[key]
  }));

  // Prepare Data for Weekly Activity
  // We just take the last 7 items from dailyHistory
  const weeklyData = dailyHistory.slice(-7);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
      
      {/* Main Score Card */}
      <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 flex flex-wrap items-center justify-between shadow-lg">
         <div>
            <h2 className="text-2xl font-bold text-white mb-1">Performance Overview</h2>
            <p className="text-slate-400 text-sm">Track your journey to productivity mastery.</p>
         </div>
         <div className="flex gap-8 mt-4 lg:mt-0">
            <div className="text-center">
               <p className="text-3xl font-bold text-accent-400">{userStats.tasksCompleted}</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider">Total Tasks</p>
            </div>
            <div className="text-center">
               <p className="text-3xl font-bold text-green-400">{userStats.completionRate || 0}%</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider">Rate</p>
            </div>
            <div className="text-center">
               <p className="text-3xl font-bold text-purple-400">{userStats.totalPoints}</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider">Total XP</p>
            </div>
         </div>
      </div>

      {/* Weekly Points Chart */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 shadow-sm h-80">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 px-2">Weekly XP Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#818cf8' }}
              cursor={{fill: '#334155', opacity: 0.4}}
            />
            <Bar dataKey="pointsEarned" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 shadow-sm h-80">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 px-2">Task Categories</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-slate-300 ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard;