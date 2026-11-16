import { ArrowRight, Camera, CheckCircle2, Cpu, Layers, Lightbulb, Target, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-white pt-14 pb-12">
        <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
            02 · TECHNICAL DOCUMENTATION &amp; ARCHITECTURE
          </span>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            About the Project
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[#383e45]">
            An end-to-end computer vision system designed to bridge state-of-the-art deep
            learning inference with an intuitive, production-grade analytics dashboard.
          </p>
        </div>
      </section>

      {/* Background, Problem Statement, Objectives */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Lightbulb className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Project Background
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Modern industries—from traffic monitoring and retail analytics to smart
              security—rely on automated visual inspection. This project demonstrates how
              single-stage neural networks can be deployed as an accessible web service for
              real-time object identification.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Target className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Problem Statement
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Manual inspection of images and video footage is slow, error-prone, and difficult
              to scale. Furthermore, command-line AI scripts are inaccessible to non-technical
              users who need immediate visual feedback, object counts, and exportable results.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                Project Objectives
              </h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Detect and label multiple objects in images and videos.</li>
              <li>• Draw bounding boxes with confidence percentages.</li>
              <li>• Count detected objects and track history in a dashboard.</li>
              <li>• Provide threshold tuning, class filtering, and media downloads.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How YOLO Works + 7-Step Pipeline */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-4">
            <div className="border-t-2 border-blue-600 pt-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
                METHODOLOGY · YOLO11
              </span>
            </div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900">
              <Cpu className="h-5 w-5 text-blue-600" />
              <span>How YOLO Works</span>
            </h2>
            <p className="text-sm leading-relaxed text-[#383e45]">
              <strong className="text-slate-900">YOLO (You Only Look Once)</strong> is a
              single-stage object detection architecture. Unlike older two-stage detectors that
              first propose regions and then classify each region separately, YOLO divides the
              input frame into a spatial grid and predicts bounding box coordinates and class
              probabilities in a single forward pass through a convolutional neural network.
            </p>
            <p className="text-sm leading-relaxed text-[#383e45]">
              Using <strong className="text-slate-900">Ultralytics YOLO11</strong> pre-trained
              on the 80-class COCO dataset, the engine achieves fast inference speeds suitable
              for both high-resolution images and frame-by-frame video processing.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">
              7-Step Detection Pipeline
            </h3>
            <ol className="space-y-2">
              {detectionSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-600 font-mono text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* System Architecture & Challenges */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Layers className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold text-slate-900">
                System Architecture
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-mono text-xs font-bold text-blue-700">
                  Frontend (React + TypeScript + Tailwind)
                </span>
                <p className="mt-1 text-xs text-slate-600">
                  Handles file uploads, confidence sliders, class filters, polling video job
                  progress, and rendering annotated media + results tables.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-mono text-xs font-bold text-blue-700">
                  REST API (FastAPI + Uvicorn)
                </span>
                <p className="mt-1 text-xs text-slate-600">
                  Validates media formats, manages background video jobs, persists detection
                  history, and serves processed files via HTTP.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-mono text-xs font-bold text-blue-700">
                  AI Engine (YOLO11 + OpenCV + PyTorch)
                </span>
                <p className="mt-1 text-xs text-slate-600">
                  Executes neural inference, applies class/confidence filters, draws bounding
                  box overlays, and computes per-class statistics.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Wrench className="h-5 w-5" />
              <h2 className="font-display text-xl font-bold text-slate-900">
                Challenges &amp; Solutions
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {challenges.map((item) => (
                <div
                  key={item.challenge}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {item.challenge}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Working Application Screenshots */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Working Application Screenshots
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={`${baseAsset}screenshots/dashboard-overview.png`}
                alt="AI Object Detection Dashboard Overview"
                className="aspect-video w-full object-cover object-top"
              />
              <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                Analytics Dashboard showing processed counts, top detected classes, and history.
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={`${baseAsset}screenshots/image-detection.png`}
                alt="YOLO11 Image Detection with Bounding Boxes"
                className="aspect-video w-full object-cover object-top"
              />
              <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                Real-time YOLO11 image detection with bounding boxes, confidence scores, and
                structured results table.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Next Page */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/contact"
            className="group flex items-center justify-between border-t border-blue-500 pt-8"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-blue-600">
                Next page · 03
              </span>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 sm:text-3xl">
                Contact &amp; Project Links
              </h3>
            </div>
            <ArrowRight className="h-10 w-10 text-slate-900 transition-transform group-hover:translate-x-2 group-hover:text-blue-600 sm:h-12 sm:w-12" />
          </Link>
        </div>
      </section>
    </div>
  );
}
