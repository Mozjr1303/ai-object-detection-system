export interface DetectionSummaryRow {
  object: string;
  confidence: number;
  max_confidence?: number;
  count: number;
  total_frame_detections?: number;
}

export interface BoundingBoxDetection {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface DetectionRecord {
  id: string;
  media_type: 'image' | 'video';
  filename: string;
  output_filename: string;
  output_url: string;
  download_url: string;
  confidence_threshold: number;
  total_objects: number;
  summary: DetectionSummaryRow[];
  processing_time_ms: number;
  timestamp: string;
  detections?: BoundingBoxDetection[];
  width?: number;
  height?: number;
  model?: string;
  total_frame_detections?: number;
  peak_objects_in_frame?: number;
  processed_frames?: number;
  total_frames?: number;
  fps?: number;
}

export interface DashboardStats {
  total_images_processed: number;
  total_videos_processed: number;
  total_objects_detected: number;
  most_frequent_objects: Array<{ object: string; count: number }>;
  recent_history: DetectionRecord[];
}

export interface VideoJobStatus {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  processed_frames: number;
  total_frames: number;
  result: DetectionRecord | null;
  error: string | null;
}

export interface HealthStatus {
  status: string;
  model: string;
  classes_count: number;
}
