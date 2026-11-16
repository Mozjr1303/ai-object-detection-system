import {
  AlertCircle,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Scan,
  Sliders,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { detectImage, resolveApiUrl } from '../api';
import type { DetectionRecord } from '../types';
import { ClassFilter } from './ClassFilter';
import { ResultsTable } from './ResultsTable';

interface ImageDetectorProps {
  availableClasses: string[];
  onDetectionComplete: () => void;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function ImageDetector({
  availableClasses,
  onDetectionComplete,
}: ImageDetectorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0.25);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionRecord | null>(null);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      setError('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }
    setError(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDetect = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await detectImage(selectedFile, confidence, selectedClasses);
      setResult(data);
      onDetectionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Upload Row */}
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
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              {selectedFile ? selectedFile.name : 'Upload an Image for Detection'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Drag & drop or click to browse · Supports JPG, JPEG, PNG, WEBP
            </p>
            {selectedFile && (
              <span className="mt-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                {(selectedFile.size / 1024).toFixed(1)} KB ready
              </span>
            )}
          </div>
        </div>

        {/* Parameters Card */}
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
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
                <span>5% (More results)</span>
                <span>95% (Strict)</span>
              </div>
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
              disabled={!selectedFile || loading}
              onClick={handleDetect}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Running YOLO...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  <span>Detect Objects</span>
                </>
              )}
            </button>

            {(selectedFile || result) && (
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

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview & Processed Output */}
      {(previewUrl || result) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Original Preview */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span>Original Image</span>
              </div>
              {selectedFile && (
                <span className="font-mono text-xs text-slate-400">{selectedFile.name}</span>
              )}
            </div>
            <div className="flex min-h-[280px] items-center justify-center bg-slate-950/60 p-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="max-h-[420px] w-auto rounded-lg object-contain"
                />
              )}
            </div>
          </div>

          {/* Processed Output */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Processed Output</span>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">
                    {result.processing_time_ms} ms
                  </span>
                  <a
                    href={resolveApiUrl(result.download_url)}
                    download={result.output_filename}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/40 transition hover:bg-cyan-500/25"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Image</span>
                  </a>
                </div>
              )}
            </div>
            <div className="flex min-h-[280px] items-center justify-center bg-slate-950/60 p-4">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  <p className="text-sm">Analyzing image with YOLO11...</p>
                </div>
              ) : result ? (
                <img
                  src={resolveApiUrl(result.output_url)}
                  alt="Annotated detection output"
                  className="max-h-[420px] w-auto rounded-lg object-contain"
                />
              ) : (
                <p className="text-sm text-slate-500">
                  Click <strong className="text-slate-300">Detect Objects</strong> to view bounding boxes
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Structured Results Table */}
      {result && (
        <ResultsTable
          summary={result.summary}
          totalObjects={result.total_objects}
          title={`Detection Results · ${result.total_objects} Objects Found`}
        />
      )}
    </div>
  );
}
