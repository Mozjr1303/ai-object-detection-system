import { BarChart3, Clock, Film, Image as ImageIcon, Trash2 } from 'lucide-react';
import type { DashboardStats } from '../types';

interface HistoryPanelProps {
  stats: DashboardStats;
  onClearHistory: () => void;
}

export function HistoryPanel({ stats, onClearHistory }: HistoryPanelProps) {
  const maxFreq = stats.most_frequent_objects[0]?.count || 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Most Frequent Objects */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Most Frequently Detected Objects</h3>
        </div>

        {stats.most_frequent_objects.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No detection analytics yet. Process an image or video to view class distribution.
          </p>
        ) : (
          <div className="space-y-3.5">
            {stats.most_frequent_objects.map((item) => {
              const pct = Math.round((item.count / maxFreq) * 100);
              return (
                <div key={item.object} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-slate-200">{item.object}</span>
                    <span className="font-mono text-cyan-300">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Detection History */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Recent Detection History</h3>
          </div>
          {stats.recent_history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700/80 px-2.5 py-1 text-xs text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {stats.recent_history.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            History is empty. Processed images and videos will appear here.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {stats.recent_history.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm transition hover:bg-slate-800/25"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      entry.media_type === 'image'
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                        : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {entry.media_type === 'image' ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <Film className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="max-w-[200px] truncate font-medium text-slate-100 sm:max-w-xs">
                      {entry.filename}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400">
                      Conf ≥ {entry.confidence_threshold}% · {entry.processing_time_ms} ms
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 font-mono text-xs text-cyan-300">
                    {entry.total_objects} objects
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
