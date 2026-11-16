import {
  Activity,
  ExternalLink,
  Film,
  Github,
  Image as ImageIcon,
  LayoutDashboard,
  ScanSearch,
} from 'lucide-react';
import { APP_CONFIG } from '../config';
import type { HealthStatus } from '../types';

export type ActiveTab = 'dashboard' | 'image' | 'video';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  health: HealthStatus | null;
}

export function Navbar({ activeTab, onTabChange, health }: NavbarProps) {
  const navItems: Array<{ id: ActiveTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'image', label: 'Image Detection', icon: ImageIcon },
    { id: 'video', label: 'Video Detection', icon: Film },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <ScanSearch className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                AI Object Detection
              </h1>
              <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-cyan-300 sm:inline-block">
                YOLO11
              </span>
            </div>
            <p className="text-xs text-slate-400">Computer Vision Analytics Suite</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="order-3 flex w-full items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-900/70 p-1 lg:order-2 lg:w-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all sm:text-sm lg:flex-initial ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-sm ring-1 ring-cyan-500/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status & External Links */}
        <div className="order-2 flex items-center gap-2.5 lg:order-3">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
              health
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden font-mono sm:inline">
              {health ? `${health.model} Ready` : 'API Offline'}
            </span>
          </div>

          <a
            href={APP_CONFIG.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <span>Portfolio</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href={APP_CONFIG.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 p-1.5 text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
