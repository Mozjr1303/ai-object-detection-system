import { Boxes, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import type { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const topObject = stats.most_frequent_objects[0];

  const cards = [
    {
      label: 'Images Processed',
      value: stats.total_images_processed,
      sub: 'JPG, PNG, WEBP analyses',
      icon: ImageIcon,
      accent: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
    },
    {
      label: 'Objects Detected',
      value: stats.total_objects_detected,
      sub: 'Cumulative YOLO predictions',
      icon: Boxes,
      accent: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    },
    {
      label: 'Videos Processed',
      value: stats.total_videos_processed,
      sub: 'Frame-by-frame MP4/AVI/MOV',
      icon: Film,
      accent: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20',
    },
    {
      label: 'Top Detected Class',
      value: topObject ? topObject.object : '—',
      sub: topObject ? `${topObject.count} total detections` : 'Run a detection to populate',
      icon: Sparkles,
      accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 font-mono text-2xl font-bold capitalize text-white sm:text-3xl">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${card.accent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
