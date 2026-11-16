import {
  Camera,
  CheckCircle2,
  Cpu,
  Layers,
  Lightbulb,
  Target,
  Wrench,
} from 'lucide-react';

const detectionSteps = [
  'User uploads an image or video.',
  'The backend receives the file.',
  'The YOLO model analyses the image or video frames.',
  'The model identifies objects.',
  'Bounding boxes and labels are generated.',
  'Results are returned to the frontend.',
  'The user views and downloads the results.',
];

const challenges = [
  {
    challenge: 'Browser Video Playback Compatibility',
    solution:
      'Configured OpenCV VideoWriter to prioritize H.264 (avc1) with automatic mp4v fallback and proper Content-Type headers so processed videos stream directly in HTML5 players.',
  },
  {
    challenge: 'Long-Running Video Requests Timing Out',
    solution:
      'Implemented asynchronous background job processing in FastAPI with a polling progress endpoint, allowing the React UI to render a live frame-by-frame progress bar.',
  },
  {
    challenge: 'Noisy Low-Confidence Predictions',
    solution:
      'Added interactive confidence threshold controls (5%–95%) and dynamic COCO class filtering so users can focus exclusively on relevant objects.',
  },
];

const baseAsset = import.meta.env.BASE_URL;

export function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-3xl space-y-4">
        <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300">
          Technical Documentation &amp; Architecture
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          About the AI Object Detection System
        </h1>
        <p className="text-base leading-relaxed text-slate-300">
          An end-to-end computer vision system designed to bridge state-of-the-art deep
          learning inference with an intuitive, production-grade analytics dashboard.
        </p>
      </header>

      {/* Background, Problem Statement, Objectives */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Project Background</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Modern industries—from traffic monitoring and retail analytics to smart security—rely
            on automated visual inspection. This project demonstrates how single-stage neural
            networks can be deployed as an accessible web service for real-time object
            identification.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Target className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Problem Statement</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Manual inspection of images and video footage is slow, error-prone, and difficult to
            scale. Furthermore, command-line AI scripts are inaccessible to non-technical users
            who need immediate visual feedback, object counts, and exportable results.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-white">Project Objectives</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Detect and label multiple objects in images and videos.</li>
            <li>• Draw bounding boxes with confidence percentages.</li>
            <li>• Count detected objects and track history in a dashboard.</li>
            <li>• Provide threshold tuning, class filtering, and media downloads.</li>
          </ul>
        </div>
      </section>

      {/* How Object Detection & YOLO Work */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Cpu className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">How YOLO Works</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              <strong className="text-white">YOLO (You Only Look Once)</strong> is a
              single-stage object detection architecture. Unlike older two-stage detectors that
              first propose regions and then classify each region separately, YOLO divides the
              input frame into a spatial grid and predicts bounding box coordinates and class
              probabilities in a single forward pass through a convolutional neural network.
            </p>
            <p className="text-sm leading-relaxed text-slate-300">
              Using <strong className="text-white">Ultralytics YOLO11</strong> pre-trained on
              the 80-class COCO dataset, the engine achieves fast inference speeds suitable for
              both high-resolution images and frame-by-frame video processing.
            </p>
          </div>

          {/* 7-Step Detection Process */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">7-Step Detection Pipeline</h3>
            <ol className="space-y-2.5">
              {detectionSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* System Architecture & Key Features */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Layers className="h-5 w-5" />
            <h2 className="text-xl font-bold text-white">System Architecture</h2>
          </div>
          <div className="mt-4 space-y-3 font-mono text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <span className="text-cyan-400">Frontend (React + TypeScript + Tailwind)</span>
              <p className="mt-1 font-sans text-xs text-slate-400">
                Handles file uploads, confidence sliders, class filters, polling video job
                progress, and rendering annotated media + results tables.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <span className="text-blue-400">REST API (FastAPI + Uvicorn)</span>
              <p className="mt-1 font-sans text-xs text-slate-400">
                Validates media formats, manages background video jobs, persists detection
                history, and serves processed files via HTTP.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <span className="text-emerald-400">AI Engine (YOLO11 + OpenCV + PyTorch)</span>
              <p className="mt-1 font-sans text-xs text-slate-400">
                Executes neural inference, applies class/confidence filters, draws bounding box
                overlays, and computes per-class statistics.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Wrench className="h-5 w-5" />
            <h2 className="text-xl font-bold text-white">Challenges &amp; Solutions</h2>
          </div>
          <div className="mt-4 space-y-4">
            {challenges.map((item) => (
              <div
                key={item.challenge}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{item.challenge}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Screenshots */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Working Application Screenshots</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <img
              src={`${baseAsset}screenshots/dashboard-overview.png`}
              alt="AI Object Detection Dashboard Overview"
              className="aspect-video w-full object-cover object-top"
            />
            <figcaption className="border-t border-slate-800/80 px-4 py-3 text-xs text-slate-300">
              Analytics Dashboard showing processed counts, top detected classes, and history.
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <img
              src={`${baseAsset}screenshots/image-detection.png`}
              alt="YOLO11 Image Detection with Bounding Boxes"
              className="aspect-video w-full object-cover object-top"
            />
            <figcaption className="border-t border-slate-800/80 px-4 py-3 text-xs text-slate-300">
              Real-time YOLO11 image detection with bounding boxes, confidence scores, and
              structured results table.
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
