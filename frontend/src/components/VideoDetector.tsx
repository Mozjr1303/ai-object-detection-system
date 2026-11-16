import {
  AlertCircle,
  CheckCircle2,
  Download,
  Film,
  Loader2,
  RotateCcw,
  Scan,
  Sliders,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fetchVideoJob, resolveApiUrl, startVideoDetection } from '../api';
import type { DetectionRecord, VideoJobStatus } from '../types';
import { ClassFilter } from './ClassFilter';
import { ResultsTable } from './ResultsTable';

interface VideoDetectorProps {
  availableClasses: string[];
  onDetectionComplete: () => void;
}

const ACCEPTED_VIDEO_EXTS = ['.mp4', '.avi', '.mov'];

export function VideoDetector({
  availableClasses,
  onDetectionComplete,
}: VideoDetectorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confidence, setConfidence] = useState<number>(0.25);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [job, setJob] = useState<VideoJobStatus | null>(null);
  const [result, setResult] = useState<DetectionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isProcessing = submitting || job?.status === 'processing';

  useEffect(() => {
    if (!job || job.status !== 'processing') return;

    const timer = window.setInterval(async () => {
      try {
        const updated = await fetchVideoJob(job.job_id);
        setJob(updated);
        if (updated.status === 'completed' && updated.result) {
          setResult(updated.result);
          onDetectionComplete();
        } else if (updated.status === 'failed') {
          setError(updated.error || 'Video processing failed.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lost connection while polling video job.');
      }
    }, 600);

    return () => window.clearInterval(timer);
  }, [job, onDetectionComplete]);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_VIDEO_EXTS.includes(ext)) {
      setError('Unsupported video format. Please upload an MP4, AVI, or MOV file.');
      return;
    }
    setError(null);
    setResult(null);
    setJob(null);
    setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setJob(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDetect = async () => {
    if (!selectedFile) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const started = await startVideoDetection(selectedFile, confidence, selectedClasses);
      setJob({
        job_id: started.job_id,
        status: 'processing',
        progress: 0,
        processed_frames: 0,
        total_frames: 0,
        result: null,
        error: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start video detection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Upload Zone */}
        <div className="lg:col-span-7">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-900/50 p-6 text-center transition hover:border-cyan-500/60 hover:bg-slate-900/80"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.avi,.mov"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              {selectedFile ? selectedFile.name : 'Upload a Video for Frame-by-Frame Detection'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Drag & drop or click to browse · Supports MP4, AVI, MOV
            </p>
            {selectedFile && (
              <span className="mt-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB ready
              </span>
            )}
          </div>
        </div>

        {/* Parameters */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-5">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Confidence Threshold</span>
                </label>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-300">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.05}
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="mt-2.5 w-full accent-cyan-400"
              />
            </div>

            <ClassFilter
              availableClasses={availableClasses}
              selectedClasses={selectedClasses}
              onChange={setSelectedClasses}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!selectedFile || isProcessing}
              onClick={handleDetect}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Video...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  <span>Process Video</span>
                </>
              )}
            </button>

            {(selectedFile || result) && !isProcessing && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {job && job.status === 'processing' && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-cyan-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing video frame by frame...
            </span>
            <span className="font-mono text-xs text-slate-300">
              {job.total_frames > 0
                ? `Frame ${job.processed_frames} / ${job.total_frames} (${job.progress}%)`
                : 'Initializing...'}
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.max(4, job.progress)}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Player & Results */}
      {result && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 px-5 py-3.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Annotated Video Output</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  {result.processed_frames} frames · {result.fps} FPS · {result.processing_time_ms} ms
                </span>
                <a
                  href={resolveApiUrl(result.download_url)}
                  download={result.output_filename}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/40 transition hover:bg-cyan-500/25"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Processed Video</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-950/80 p-4">
              <video
                src={resolveApiUrl(result.output_url)}
                controls
                className="max-h-[460px] w-full max-w-3xl rounded-lg"
              />
            </div>
          </div>

          <ResultsTable
            summary={result.summary}
            totalObjects={result.total_objects}
            title={`Video Detection Summary · Peak ${result.peak_objects_in_frame ?? 0} Objects/Frame`}
          />
        </div>
      )}

      {!result && !isProcessing && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 px-5 py-4 text-xs text-slate-400">
          <Film className="h-4 w-4 shrink-0 text-indigo-400" />
          <span>
            Each frame is analyzed sequentially by YOLO11. The structured table reports peak
            simultaneous object counts and average confidence across all frames.
          </span>
        </div>
      )}
    </div>
  );
}
