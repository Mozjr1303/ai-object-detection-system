import { ArrowRight, Film, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { clearHistory, fetchClasses, fetchHealth, fetchStats } from './api';
import { HistoryPanel } from './components/HistoryPanel';
import { ImageDetector } from './components/ImageDetector';
import { Navbar, type ActiveTab } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { VideoDetector } from './components/VideoDetector';
import type { DashboardStats, HealthStatus } from './types';

const EMPTY_STATS: DashboardStats = {
  total_images_processed: 0,
  total_videos_processed: 0,
  total_objects_detected: 0,
  most_frequent_objects: [],
  recent_history: [],
};

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  const refreshAll = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([fetchHealth(), fetchStats()]);
      setHealth(h);
      setStats(s);
    } catch {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    refreshAll();
    fetchClasses()
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [refreshAll]);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      await refreshAll();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} health={health} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/30 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Real-Time YOLO11 Computer Vision Engine</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Multi-Object Detection &amp; Analytics Dashboard
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Upload high-resolution images or video streams to identify, localize, and
                    count objects with confidence scoring, class filtering, and annotated media
                    downloads.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('image')}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Detect in Image</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
                  >
                    <Film className="h-4 w-4" />
                    <span>Detect in Video</span>
                  </button>
                </div>
              </div>
            </section>

            <StatsCards stats={stats} />
            <HistoryPanel stats={stats} onClearHistory={handleClearHistory} />
          </div>
        )}

        {activeTab === 'image' && (
          <ImageDetector availableClasses={classes} onDetectionComplete={refreshAll} />
        )}

        {activeTab === 'video' && (
          <VideoDetector availableClasses={classes} onDetectionComplete={refreshAll} />
        )}
      </main>
    </div>
  );
}

export default App;
