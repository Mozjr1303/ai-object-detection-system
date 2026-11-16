import { ExternalLink, Github, Menu, ScanSearch, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { PORTFOLIO_CONFIG } from '../config';

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About the Project' },
  { to: '/contact', label: 'Contact & Links' },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#060b16] text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <ScanSearch className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-white">
                {PORTFOLIO_CONFIG.projectName}
              </span>
              <span className="block font-mono text-[10px] text-cyan-400">
                YOLO11 · OpenCV · FastAPI
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden items-center gap-2.5 md:flex">
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_CONFIG.liveAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500"
            >
              <span>Launch App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-slate-800 p-2 text-slate-300 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2 border-t border-slate-800 pt-3">
                <a
                  href={PORTFOLIO_CONFIG.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-200"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={PORTFOLIO_CONFIG.liveAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-xs font-semibold text-white"
                >
                  <span>Launch App</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {PORTFOLIO_CONFIG.projectName} · Built by{' '}
            <span className="text-slate-200">{PORTFOLIO_CONFIG.developerName}</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              GitHub Repository
            </a>
            <a
              href={PORTFOLIO_CONFIG.liveAppUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              Live Application
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
