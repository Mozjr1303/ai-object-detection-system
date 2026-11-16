import {
  ExternalLink,
  FolderGit2,
  Github,
  Globe,
  Linkedin,
  Mail,
  Terminal,
  Twitter,
  User,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config';

export function ContactPage() {
  const resources = [
    {
      title: 'GitHub Repository',
      description: 'Complete source code for backend, frontend, portfolio, and docs.',
      url: PORTFOLIO_CONFIG.githubUrl,
      label: 'View Repository',
      icon: Github,
    },
    {
      title: 'Live Object Detection Application',
      description: 'Interactive YOLO11 image & video detection dashboard.',
      url: PORTFOLIO_CONFIG.liveAppUrl,
      label: 'Open Application',
      icon: Terminal,
    },
    {
      title: 'Live Portfolio Website',
      description: 'Three-page project showcase hosted on GitHub Pages.',
      url: PORTFOLIO_CONFIG.portfolioUrl,
      label: 'Visit Portfolio',
      icon: Globe,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300">
          Contact &amp; Project Links
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Developer &amp; Project Resources
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          Access the source repository, deployed portfolio, and live object detection
          application, or get in touch regarding this project.
        </p>
      </header>

      {/* Developer & Project Summary */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 md:col-span-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {PORTFOLIO_CONFIG.developerName}
              </h2>
              <p className="text-xs text-cyan-300">{PORTFOLIO_CONFIG.developerRole}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <a
              href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>{PORTFOLIO_CONFIG.contactEmail}</span>
            </a>

            <div className="flex gap-2.5">
              <a
                href={PORTFOLIO_CONFIG.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={PORTFOLIO_CONFIG.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                <Twitter className="h-4 w-4" />
                <span>X / Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 md:col-span-7">
          <h2 className="text-lg font-bold text-white">Project Summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The <strong className="text-white">{PORTFOLIO_CONFIG.projectName}</strong> is an
            academic and production-ready computer vision application powered by Ultralytics
            YOLO11, OpenCV, FastAPI, and React. It supports multi-object image and video
            detection, confidence threshold adjustment, class filtering, analytics tracking, and
            one-click download of annotated outputs.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
            {['YOLO11', 'Python 3.11', 'FastAPI', 'OpenCV', 'React 19', 'TypeScript'].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Project Resources */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Project Resources</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {resources.map((res) => {
            const Icon = res.icon;
            return (
              <a
                key={res.title}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 transition hover:border-cyan-500/50 hover:bg-slate-900"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white group-hover:text-cyan-300">
                    {res.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {res.description}
                  </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <span>{res.label}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
