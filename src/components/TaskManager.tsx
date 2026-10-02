import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MicroTask, TaskCategory } from '../types';
import { TaskModal } from './TaskModal';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  DollarSign,
  Filter,
  CheckCircle2,
  Sparkles,
  Search,
  Layers,
  ArrowRight,
  Tag,
  X,
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { tasks, addRandomTask, createCustomTask } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTask, setActiveTask] = useState<MicroTask | null>(null);

  // Custom task form state
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customReward, setCustomReward] = useState<number>(2.50);
  const [customCategory, setCustomCategory] = useState<TaskCategory>('app_install');
  const [customSponsor, setCustomSponsor] = useState<string>('');

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customDesc) return;

    createCustomTask({
      title: customTitle,
      description: customDesc,
      category: customCategory,
      reward: Number(customReward) || 1.5,
      estimatedMinutes: 3,
      difficulty: 'Easy',
      sponsor: customSponsor || 'Independent Research Partner',
      remainingSlots: 25,
      tags: [customCategory.replace('_', ' ').toUpperCase(), 'Community'],
      questions: [
        {
          id: 'q1',
          question: `How would you rate your experience with ${customTitle}?`,
          type: 'radio',
          options: ['Outstanding and recommended', 'Good but room for refinement', 'Neutral', 'Poor'],
        },
        {
          id: 'q2',
          question: 'What specific feature or improvement would make this most valuable to you?',
          type: 'text',
          options: [],
        },
      ],
    });

    setCustomTitle('');
    setCustomDesc('');
    setCustomSponsor('');
    setIsCreatingCustom(false);
  };

  const categories = [
    { id: 'all', label: 'All Tasks' },
    { id: 'survey', label: 'Surveys' },
    { id: 'app_install', label: 'App Install' },
    { id: 'watch', label: 'Watch' },
    { id: 'feedback', label: 'UI Feedback' },
    { id: 'testing', label: 'Testing' },
    { id: 'search', label: 'Search' },
    { id: 'brand', label: 'Brand Polls' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesTag = !selectedTag || (task.tags && task.tags.includes(selectedTag));
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesTag && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const availableEarnings = tasks
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + t.reward, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Verified Tasks & Research Quests</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
              Live Sponsor Bids
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Complete high-paying market research surveys, app installs, video evaluations, and brand verification tasks to earn real withdrawable USD.
          </p>
        </div>

        {/* Action Buttons: Add Random Task & Custom Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={addRandomTask}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Random Sponsor Task</span>
          </button>

          <button
            onClick={() => setIsCreatingCustom(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create Custom Task</span>
          </button>
        </div>
      </div>

      {/* Task Summary Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available In Pool</p>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${availableEarnings.toFixed(2)} USD
            </p>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-500/40" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Completed</p>
            <p className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
              {completedCount} / {tasks.length}
            </p>
          </div>
          <CheckSquare className="w-6 h-6 text-blue-500/40" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average Reward</p>
            <p className="text-xl font-bold font-mono text-slate-200 mt-1 tabular-nums">
              ${(tasks.reduce((sum, t) => sum + t.reward, 0) / (tasks.length || 1)).toFixed(2)}
            </p>
          </div>
          <Layers className="w-6 h-6 text-purple-500/40" />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => {
            const count = tasks.filter((t) => cat.id === 'all' || t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTag(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-slate-900 text-emerald-400 font-bold' : 'bg-slate-950/60 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {/* Active tag indicator if filtered */}
      {selectedTag && (
        <div className="flex items-center gap-2 text-xs bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800">
          <Tag className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Filtering by Tag:</span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-mono font-bold">
            #{selectedTag}
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-auto text-slate-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center space-y-3">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No tasks match your criteria</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your category filter or click "Add Random Sponsor Task" to discover new reward opportunities.
            </p>
            <button
              onClick={addRandomTask}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Random Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'border-slate-800/60 opacity-70 bg-slate-900/40'
                  : 'border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-300 font-medium">{task.sponsor}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-blue-400 uppercase tracking-wide font-mono text-[11px] font-semibold">
                    {task.category.replace('_', ' ')}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>~{task.estimatedMinutes} min</span>
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-500">{task.remainingSlots} slots remaining</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {task.title}
                    {task.completed && (
                      <span className="text-xs text-emerald-400 font-normal flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed & Credited
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                </div>

                {/* Tag Badges */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {task.tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                          selectedTag === t
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Reward and Action button */}
              <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">Reward</span>
                  <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                    +${task.reward.toFixed(2)} USD
                  </span>
                </div>

                <div>
                  {task.completed ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
                    >
                      Already Claimed
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTask(task)}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/20 whitespace-nowrap"
                    >
                      <span>Start & Earn</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Task Creation Modal */}
      {isCreatingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Create New Sponsor Task</span>
              </h3>
              <button
                onClick={() => setIsCreatingCustom(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Mobile App Onboarding Evaluation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Sponsor / Organization</label>
                <input
                  type="text"
                  value={customSponsor}
                  onChange={(e) => setCustomSponsor(e.target.value)}
                  placeholder="e.g., Global Consumer Analytics Corp."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-slate-700"
                  >
                    <option value="app_install">App Install</option>
                    <option value="survey">Survey</option>
                    <option value="watch">Watch</option>
                    <option value="feedback">UI Feedback</option>
                    <option value="testing">App Testing</option>
                    <option value="search">Search Verification</option>
                    <option value="brand">Brand Poll</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Reward Amount (USD)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.50"
                    max="10.00"
                    value={customReward}
                    onChange={(e) => setCustomReward(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description & Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Detail what respondents need to test or evaluate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Publish Task to Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal Runner */}
      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  );
};
