import {
  ArrowRight,
  Boxes,
  Cpu,
  Download,
  ExternalLink,
  Film,
  Github,
  Image as ImageIcon,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_CONFIG } from '../config';

const highlights = [
  {
    title: 'Multi-Object Image Detection',
    description:
      'Detects and classifies multiple objects simultaneously in JPG, PNG, and WEBP images with crisp bounding boxes and confidence percentages.',
    icon: ImageIcon,
  },
  {
    title: 'Frame-by-Frame Video Analysis',
    description:
      'Processes MP4, AVI, and MOV videos frame by frame with live progress tracking and downloadable annotated MP4 output.',
    icon: Film,
  },
  {
    title: 'Confidence & Class Controls',
    description:
      'Adjust detection sensitivity in real time and filter predictions by specific COCO object classes.',
    icon: Sliders,
  },
  {
    title: 'Structured Analytics & Export',
    description:
      'Aggregates object counts, average confidence scores, and processing history into an interactive dashboard.',
    icon: Download,
  },
];

const techStack = [
  { name: 'YOLO11 (Ultralytics)', category: 'Deep Learning' },
  { name: 'Python 3.11+', category: 'Core Runtime' },
  { name: 'OpenCV & NumPy', category: 'Computer Vision' },
  { name: 'PyTorch', category: 'Neural Inference' },
  { name: 'FastAPI', category: 'REST API' },
  { name: 'React & TypeScript', category: 'Frontend UI' },
  { name: 'Tailwind CSS', category: 'Design System' },
  { name: 'Vite', category: 'Build Tooling' },
];

export function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/70 bg-gradient-to-b from-slate-900/50 via-[#060b16] to-[#060b16] pt-14 pb-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[680px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Object Detection System</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-[1.12]">
              Intelligent Object Detection Powered by{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              A full-stack computer vision platform built with YOLO11, OpenCV, FastAPI, and
              React. Upload images or videos to automatically identify, localize, and count
              multiple objects in real time.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href={PORTFOLIO_CONFIG.liveAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500"
              >
                <span>Open Live Application</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
              >
                <Github className="h-4 w-4" />
                <span>View on GitHub</span>
              </a>

              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                <span>Explore Architecture</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Object Detection Visual */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/40">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs">
                <span className="font-mono text-cyan-300">yolo11n.pt · inference_preview</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                  48.2 ms
                </span>
              </div>

              {/* Simulated Street Scene with Bounding Boxes */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgb(56 189 248 / 0.35) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Box 1: Person */}
                <div className="absolute top-8 left-6 h-36 w-24 rounded border-2 border-cyan-400 bg-cyan-400/5">
                  <span className="absolute -top-6 left-0 rounded bg-cyan-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-950">
                    person 96.5%
                  </span>
                </div>

                {/* Box 2: Car */}
                <div className="absolute right-6 bottom-10 h-28 w-44 rounded border-2 border-blue-400 bg-blue-400/5">
                  <span className="absolute -top-6 left-0 rounded bg-blue-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-950">
                    car 92.3%
                  </span>
                </div>

                {/* Box 3: Bicycle */}
                <div className="absolute bottom-8 left-24 h-20 w-24 rounded border-2 border-emerald-400 bg-emerald-400/5">
                  <span className="absolute -top-6 left-0 rounded bg-emerald-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-950">
                    bicycle 89.1%
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="rounded-lg bg-slate-950/70 p-2">
                  <span className="block text-slate-400">Objects</span>
                  <span className="font-bold text-white">3</span>
                </div>
                <div className="rounded-lg bg-slate-950/70 p-2">
                  <span className="block text-slate-400">Avg Conf</span>
                  <span className="font-bold text-cyan-300">92.6%</span>
                </div>
                <div className="rounded-lg bg-slate-950/70 p-2">
                  <span className="block text-slate-400">Classes</span>
                  <span className="font-bold text-white">80 COCO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Computer Vision & Object Detection */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Cpu className="h-4 w-4" />
                <span>Computer Vision Foundation</span>
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                What is Object Detection?
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base lg:col-span-7">
              Computer vision enables machines to interpret and understand visual data from the
              world around them. Unlike simple image classification—which assigns a single label
              to an entire image—<strong className="text-white">object detection</strong>{' '}
              both <span className="text-cyan-300">localizes</span> each object with a precise
              bounding box and <span className="text-cyan-300">classifies</span> its category
              alongside a confidence probability, enabling automated counting, tracking, and
              visual analytics across images and video streams.
            </p>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Project Highlights</h2>
          <p className="mt-2 text-sm text-slate-400">
            Engineered for accuracy, responsiveness, and seamless visual inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 transition hover:border-cyan-500/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technologies Used */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Technologies Used</h2>
            <p className="mt-1 text-sm text-slate-400">
              Modern AI inference paired with a type-safe web stack.
            </p>
          </div>
          <Boxes className="hidden h-7 w-7 text-cyan-400 sm:block" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:border-slate-700"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400">
                {tech.category}
              </span>
              <p className="mt-1 text-sm font-semibold text-white">{tech.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
