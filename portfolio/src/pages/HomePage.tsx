import { ArrowRight, Cpu, Download, Film, Github, Image as ImageIcon, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LiveDemoSection } from '../components/LiveDemoSection';
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
      'Adjust detection sensitivity in real time (5%–95%) and filter predictions by specific 80-class COCO object categories.',
    icon: Sliders,
  },
  {
    title: 'Structured Analytics & Export',
    description:
      'Aggregates object counts, average confidence scores, and recent detection history into a clean analytics dashboard.',
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
    <div>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white pt-14 pb-18">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                COMPUTER VISION · YOLO11
              </span>
              <span className="rounded border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-blue-700">
                DETECTION READY
              </span>
            </div>

            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:leading-[1.06]">
              Intelligent Object Detection Powered by{' '}
              <span className="text-blue-600">Artificial Intelligence</span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-[#383e45]">
              An end-to-end computer vision platform built with{' '}
              <strong className="font-semibold text-slate-900">YOLO11</strong>,{' '}
              <strong className="font-semibold text-slate-900">OpenCV</strong>,{' '}
              <strong className="font-semibold text-slate-900">FastAPI</strong>, and{' '}
              <strong className="font-semibold text-slate-900">React</strong>. Upload images
              or videos to automatically identify, localize, and count multiple objects with
              bounding boxes and confidence scores.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-display text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span>About the project</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={PORTFOLIO_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 font-display text-xs font-bold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Object Detection Visual */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                <span className="font-mono font-semibold text-blue-700">
                  yolo11n.pt · inference_preview
                </span>
                <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-800">
                  48.2 ms
                </span>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.45) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Box 1: Person */}
                <div className="absolute top-8 left-6 h-36 w-24 rounded border-2 border-blue-600 bg-blue-500/5">
                  <span className="absolute -top-6 left-0 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    person 96.5%
                  </span>
                </div>

                {/* Box 2: Car */}
                <div className="absolute right-6 bottom-10 h-28 w-44 rounded border-2 border-indigo-600 bg-indigo-500/5">
                  <span className="absolute -top-6 left-0 rounded bg-indigo-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    car 92.3%
                  </span>
                </div>

                {/* Box 3: Bicycle */}
                <div className="absolute bottom-8 left-24 h-20 w-24 rounded border-2 border-sky-600 bg-sky-500/5">
                  <span className="absolute -top-6 left-0 rounded bg-sky-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    bicycle 89.1%
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <span className="block text-slate-500">Objects</span>
                  <span className="font-bold text-slate-900">3</span>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <span className="block text-slate-500">Avg Conf</span>
                  <span className="font-bold text-blue-700">92.6%</span>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-2">
                  <span className="block text-slate-500">Classes</span>
                  <span className="font-bold text-slate-900">80 COCO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Live Working Example */}
      <LiveDemoSection />

      {/* Section 2: The Project in One Minute */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="border-t-2 border-blue-600 pt-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  2 · THE PROJECT
                </span>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-8">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                What is Computer Vision &amp; Object Detection?
              </h2>
              <p className="text-base leading-relaxed text-[#383e45]">
                Computer vision enables machines to interpret and understand visual data from the
                world around them. Unlike simple image classification—which assigns a single
                label to an entire image—<strong className="text-slate-900">object detection</strong>{' '}
                both <span className="font-semibold text-blue-700">localizes</span> each object
                with a precise bounding box and{' '}
                <span className="font-semibold text-blue-700">classifies</span> its category
                alongside a confidence probability, enabling automated counting, tracking, and
                visual analytics across images and video streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Project Highlights */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="border-t-2 border-blue-600 pt-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  3 · CAPABILITIES
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                  Project Highlights
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Technologies Used */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="border-t-2 border-blue-600 pt-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
                  4 · TECH STACK
                </span>
                <h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <span>Technologies Used</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300"
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                    {tech.category}
                  </span>
                  <p className="mt-1 font-display text-sm font-bold text-slate-900">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Next Page Band */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/about"
            className="group flex items-center justify-between border-t border-blue-500 pt-8"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-blue-600">
                Next page · 02
              </span>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 sm:text-3xl">
                About the Project
              </h3>
            </div>
            <ArrowRight className="h-10 w-10 text-slate-900 transition-transform group-hover:translate-x-2 group-hover:text-blue-600 sm:h-12 sm:w-12" />
          </Link>
        </div>
      </section>
    </div>
  );
}
