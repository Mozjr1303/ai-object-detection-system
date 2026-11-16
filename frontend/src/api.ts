import { APP_CONFIG } from './config';
import type {
  DashboardStats,
  DetectionRecord,
  HealthStatus,
  VideoJobStatus,
} from './types';

const base = APP_CONFIG.apiBaseUrl;

export function resolveApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${base}${path}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) {
        message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(resolveApiUrl('/api/health'));
  return handleResponse<HealthStatus>(res);
}

export async function fetchClasses(): Promise<string[]> {
  const res = await fetch(resolveApiUrl('/api/classes'));
  const data = await handleResponse<{ classes: string[] }>(res);
  return data.classes;
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(resolveApiUrl('/api/stats'));
  return handleResponse<DashboardStats>(res);
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(resolveApiUrl('/api/history'), { method: 'DELETE' });
  await handleResponse<{ status: string }>(res);
}

export async function detectImage(
  file: File,
  confidence: number,
  selectedClasses: string[],
): Promise<DetectionRecord> {
  const form = new FormData();
  form.append('file', file);
  form.append('confidence', confidence.toFixed(2));
  if (selectedClasses.length > 0) {
    form.append('classes', selectedClasses.join(','));
  }

  const res = await fetch(resolveApiUrl('/api/detect/image'), {
    method: 'POST',
    body: form,
  });
  return handleResponse<DetectionRecord>(res);
}

export async function startVideoDetection(
  file: File,
  confidence: number,
  selectedClasses: string[],
): Promise<{ job_id: string; status: string }> {
  const form = new FormData();
  form.append('file', file);
  form.append('confidence', confidence.toFixed(2));
  if (selectedClasses.length > 0) {
    form.append('classes', selectedClasses.join(','));
  }

  const res = await fetch(resolveApiUrl('/api/detect/video'), {
    method: 'POST',
    body: form,
  });
  return handleResponse<{ job_id: string; status: string }>(res);
}

export async function fetchVideoJob(jobId: string): Promise<VideoJobStatus> {
  const res = await fetch(resolveApiUrl(`/api/jobs/${jobId}`));
  return handleResponse<VideoJobStatus>(res);
}
