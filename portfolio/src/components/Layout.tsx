import { Github, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { PORTFOLIO_CONFIG } from '../config';

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: '/', num: '01', label: 'Project Overview' },
  { to: '/about', num: '02', label: 'About the Project' },
  { to: '/contact', num: '03', label: 'Contact & Links' },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#383e45]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 font-display text-sm font-black tracking-tight text-white">
              OD
            </div>
            <div className="leading-tight">
              <span className="block font-display text-sm font-bold text-slate-900">
                {PORTFOLIO_CONFIG.projectName}
              </span>
              <span className="block font-mono text-[10px] tracking-wide text-slate-500">
                YOLO11 · Computer Vision
              </span>
            </div>
          </NavLink>

          {/* Desktop Numbered Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3.5 py-2 font-display text-xs font-semibold transition ${
                    isActive
                      ? 'border border-blue-200 bg-blue-50/70 text-blue-700'
                      : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {link.num}
                    </span>
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action (GitHub only — Launch App removed) */}
          <div className="hidden items-center md:flex">
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-md border border-slate-200 p-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 font-display text-sm font-semibold ${
                      isActive
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="font-mono text-xs text-blue-600">{link.num}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-md border border-slate-200 py-2 font-display text-xs font-bold text-slate-800"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Dark Editorial Footer */}
      <footer className="border-t border-slate-800 bg-[#111827] text-slate-400">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Project
              </p>
              <p className="font-display text-base font-bold text-white">
                {PORTFOLIO_CONFIG.projectName}
              </p>
              <p className="text-xs leading-relaxed text-slate-400">
                Full-stack computer vision application powered by Ultralytics YOLO11, OpenCV,
                FastAPI, and React. Built by {PORTFOLIO_CONFIG.developerName}.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Pages
              </p>
              <ul className="space-y-1.5 text-xs">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-blue-400 transition hover:text-blue-300"
                    >
                      {link.num} · {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Repository &amp; Resources
              </p>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href={PORTFOLIO_CONFIG.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href={PORTFOLIO_CONFIG.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    Live Portfolio (GitHub Pages)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} {PORTFOLIO_CONFIG.projectName}. Academic &amp;
            Engineering Portfolio.
          </div>
        </div>
      </footer>
    </div>
  );
}
