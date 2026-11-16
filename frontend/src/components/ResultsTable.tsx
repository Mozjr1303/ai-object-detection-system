import { Layers } from 'lucide-react';
import type { DetectionSummaryRow } from '../types';

interface ResultsTableProps {
  summary: DetectionSummaryRow[];
  totalObjects: number;
  title?: string;
}

export function ResultsTable({
  summary,
  totalObjects,
  title = 'Detection Results',
}: ResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-cyan-300">
          {totalObjects} {totalObjects === 1 ? 'object' : 'objects'}
        </span>
      </div>

      {summary.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-slate-400">
          No objects matched the current confidence threshold and class filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800/80 bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Object</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
                <th className="px-5 py-3 text-right font-medium">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {summary.map((row) => (
                <tr key={row.object} className="transition hover:bg-slate-800/30">
                  <td className="px-5 py-3 font-medium capitalize text-slate-100">
                    {row.object}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${Math.min(100, row.confidence)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-cyan-300">
                        {row.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-white">
                    {row.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
