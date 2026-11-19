import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
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
import { useEffect, useRef, useState } from 'react';

interface SummaryRow {
  object: string;
  confidence: number;
  count: number;
}

const BOX_COLORS = [
  '#2563eb', // blue-600
  '#0284c7', // sky-600
  '#4f46e5', // indigo-600
  '#059669', // emerald-600
  '#0891b2', // cyan-600
  '#7c3aed', // violet-600
];

const baseAsset = import.meta.env.BASE_URL;

const SAMPLES = [
  { id: 'bus', label: 'Sample 1: Street & Bus', src: `${baseAsset}samples/bus.jpg` },
  { id: 'zidane', label: 'Sample 2: People & Ties', src: `${baseAsset}samples/zidane.jpg` },
];

export function LiveDemoSection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const modelPromiseRef = useRef<Promise<cocoSsd.ObjectDetection> | null>(null);

  const [imageSrc, setImageSrc] = useState<string>(SAMPLES[0].src);
  const [imageLabel, setImageLabel] = useState<string>(SAMPLES[0].label);
  const [confidence, setConfidence] = useState<number>(0.35);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string | null>('Warming up in-browser AI model...');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [totalObjects, setTotalObjects] = useState<number>(0);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState<boolean>(false);

  const ensureModelLoaded = async (): Promise<cocoSsd.ObjectDetection> => {
    if (modelRef.current) return modelRef.current;
    if (!modelPromiseRef.current) {
      modelPromiseRef.current = cocoSsd
        .load({ base: 'lite_mobilenet_v2' })
        .then((loaded) => {
          modelRef.current = loaded;
          setModelReady(true);
          setStatusText(null);
          return loaded;
        })
        .catch((err) => {
          modelPromiseRef.current = null;
          throw err;
        });
    }
    return modelPromiseRef.current;
  };

  // Preload the COCO-SSD model on mount so detection is instant when clicked
  useEffect(() => {
    ensureModelLoaded().catch(() => {
      setStatusText(null);
    });
  }, []);

  // Draw the base image onto the canvas whenever imageSrc changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
    };
    img.onerror = () => {
      setError('Could not load the selected image.');
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const handleSelectSample = (sample: (typeof SAMPLES)[number]) => {
    setError(null);
    setHasRun(false);
    setSummary([]);
    setTotalObjects(0);
    setInferenceMs(null);
    setImageSrc(sample.src);
    setImageLabel(sample.label);
  };

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      setError('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }
    setError(null);
    setHasRun(false);
    setSummary([]);
    setTotalObjects(0);
    setInferenceMs(null);
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
    setImageLabel(file.name);
  };

  const handleDetect = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(null);

    try {
      if (!modelRef.current) {
        setStatusText('Loading in-browser AI model (COCO-SSD)...');
      }
      const model = await ensureModelLoaded();

      setStatusText('Running object detection...');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for detection.'));
        img.src = imageSrc;
      });

      const start = performance.now();
      const predictions = await model.detect(img, 30, confidence);
      const elapsed = Math.round(performance.now() - start);

      // Draw image and bounding boxes on canvas
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const lineWidth = Math.max(2, Math.round(Math.max(canvas.width, canvas.height) / 300));
        const fontSize = Math.max(13, Math.round(Math.max(canvas.width, canvas.height) / 48));
        ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;

        const colorMap = new Map<string, string>();

        predictions.forEach((pred) => {
          if (!colorMap.has(pred.class)) {
            colorMap.set(pred.class, BOX_COLORS[colorMap.size % BOX_COLORS.length]);
          }
          const color = colorMap.get(pred.class)!;
          const [x, y, w, h] = pred.bbox;

          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.strokeRect(x, y, w, h);

          const label = `${pred.class} ${(pred.score * 100).toFixed(1)}%`;
          const textMetrics = ctx.measureText(label);
          const padX = 8;
          const pillH = fontSize + 10;
          const pillW = textMetrics.width + padX * 2;
          const pillY = Math.max(0, y - pillH);

          ctx.fillStyle = color;
          ctx.fillRect(x, pillY, pillW, pillH);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, x + padX, pillY + fontSize + 1);
        });
      }

      // Aggregate structured summary
      const grouped = new Map<string, number[]>();
      predictions.forEach((p) => {
        const list = grouped.get(p.class) ?? [];
        list.push(p.score * 100);
        grouped.set(p.class, list);
      });

      const rows: SummaryRow[] = Array.from(grouped.entries())
        .map(([object, scores]) => ({
          object,
          confidence: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
          count: scores.length,
        }))
        .sort((a, b) => b.count - a.count || b.confidence - a.confidence);

      setSummary(rows);
      setTotalObjects(predictions.length);
      setInferenceMs(elapsed);
      setHasRun(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Object detection failed.');
    } finally {
      setLoading(false);
      setStatusText(null);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'detected-objects.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleReset = () => {
    handleSelectSample(SAMPLES[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="working-example" className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Editorial Rail */}
          <div className="space-y-4 lg:col-span-4">
            <div className="border-t-2 border-blue-600 pt-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600">
                1 · LIVE WORKING EXAMPLE
              </span>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                Try Object Detection in Your Browser
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Select a sample image or upload your own photo to run real neural-network
              object detection directly in the browser using TensorFlow.js &amp; COCO-SSD.
            </p>

            {/* Sample & Upload Controls */}
            <div className="space-y-2.5 pt-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Choose Input Image
              </p>
              <div className="flex flex-col gap-2">
                {SAMPLES.map((sample) => {
                  const active = imageSrc === sample.src;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-left font-display text-xs font-semibold transition ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <ImageIcon className="h-4 w-4 shrink-0" />
                      <span>{sample.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-left font-display text-xs font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
                >
                  <Upload className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Upload JPG, PNG, or WEBP</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-display text-xs font-bold text-slate-800">
                  <Sliders className="h-3.5 w-3.5 text-blue-600" />
                  <span>Confidence Threshold</span>
                </label>
                <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="mt-2.5 w-full accent-blue-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={handleDetect}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-display text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4" />
                    <span>Detect Objects</span>
                  </>
                )}
              </button>

              {hasRun && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2.5 font-display text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {statusText ? (
              <p className="font-mono text-xs text-blue-600">{statusText}</p>
            ) : modelReady ? (
              <p className="font-mono text-xs text-emerald-700">✓ AI model loaded and ready</p>
            ) : null}
          </div>

          {/* Right Canvas & Results */}
          <div className="space-y-5 lg:col-span-8">
            {error && (
              <div className="flex items-center gap-2.5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  {hasRun ? (
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="font-display text-xs font-bold text-slate-900">
                    {imageLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {inferenceMs !== null && (
                    <span className="font-mono text-xs text-slate-500">
                      {totalObjects} objects · {inferenceMs} ms
                    </span>
                  )}
                  {hasRun && (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 font-display text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Image</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex min-h-[300px] items-center justify-center bg-slate-100 p-4">
                <canvas
                  ref={canvasRef}
                  className="max-h-[440px] max-w-full rounded border border-slate-200 bg-white object-contain shadow-sm"
                />
              </div>
            </div>

            {/* Structured Detection Results Table */}
            {hasRun && (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Detection Results
                  </h3>
                  <span className="rounded bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                    {totalObjects} detected
                  </span>
                </div>

                {summary.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">
                    No objects detected above {Math.round(confidence * 100)}% confidence.
                  </p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Object</th>
                        <th className="px-4 py-2.5">Confidence</th>
                        <th className="px-4 py-2.5 text-right">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.map((row) => (
                        <tr key={row.object}>
                          <td className="px-4 py-2.5 font-display font-semibold capitalize text-slate-900">
                            {row.object}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs font-semibold text-blue-700">
                            {row.confidence.toFixed(1)}%
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                            {row.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
