import { ExternalLink, FolderGit2, Github, Globe, Linkedin, Mail, Twitter, User } from 'lucide-react';
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
      title: 'Live Portfolio Website',
      description: 'Three-page project showcase hosted on GitHub Pages.',
      url: PORTFOLIO_CONFIG.portfolioUrl,
      label: 'Visit Portfolio',
      icon: Globe,
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-white pt-14 pb-12">
        <div className="mx-auto max-w-5xl space-y-3 px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
            03 · DEVELOPER &amp; RESOURCES
          </span>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Contact &amp; Project Links
          </h1>
          <p className="max-w-2xl text-lg text-[#383e45]">
            Access the source repository and deployed portfolio website, or reach out
            regarding this computer vision project.
          </p>
        </div>
      </section>

      {/* Developer & Project Summary */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {PORTFOLIO_CONFIG.developerName}
                </h2>
                <p className="text-xs font-medium text-blue-600">
                  {PORTFOLIO_CONFIG.developerRole}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={`mailto:${PORTFOLIO_CONFIG.contactEmail}`}
                className="flex items-center gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <span>{PORTFOLIO_CONFIG.contactEmail}</span>
              </a>

              <div className="flex gap-2.5">
                <a
                  href={PORTFOLIO_CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-2.5 font-display text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={PORTFOLIO_CONFIG.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-2.5 font-display text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                >
                  <Twitter className="h-4 w-4" />
                  <span>X / Twitter</span>
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 md:col-span-7">
            <h2 className="font-display text-lg font-bold text-slate-900">Project Summary</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              The <strong className="text-slate-900">{PORTFOLIO_CONFIG.projectName}</strong>{' '}
              is an academic and production-ready computer vision application powered by
              Ultralytics YOLO11, OpenCV, FastAPI, and React. It supports multi-object image
              and video detection, confidence threshold adjustment, class filtering, analytics
              tracking, and one-click download of annotated outputs.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
              {['YOLO11', 'Python 3.11', 'FastAPI', 'OpenCV', 'React 19', 'TypeScript'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Resources */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-blue-600" />
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Project Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {resources.map((res) => {
              const Icon = res.icon;
              return (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-sm"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-slate-900 group-hover:text-blue-600">
                      {res.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {res.description}
                    </p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 font-display text-xs font-bold text-blue-600">
                    <span>{res.label}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
