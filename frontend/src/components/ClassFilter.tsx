import { Filter, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ClassFilterProps {
  availableClasses: string[];
  selectedClasses: string[];
  onChange: (classes: string[]) => void;
}

export function ClassFilter({
  availableClasses,
  selectedClasses,
  onChange,
}: ClassFilterProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableClasses.slice(0, 24);
    return availableClasses.filter((cls) => cls.toLowerCase().includes(q)).slice(0, 24);
  }, [availableClasses, query]);

  const toggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      onChange(selectedClasses.filter((c) => c !== cls));
    } else {
      onChange([...selectedClasses, cls]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          <span>Class Filter (Optional)</span>
        </label>
        {selectedClasses.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Clear ({selectedClasses.length})
          </button>
        )}
      </div>

      {/* Selected tags */}
      {selectedClasses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedClasses.map((cls) => (
            <span
              key={cls}
              className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-2.5 py-0.5 text-xs font-medium capitalize text-cyan-200"
            >
              {cls}
              <button
                type="button"
                onClick={() => toggleClass(cls)}
                className="rounded-full p-0.5 hover:bg-cyan-500/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search & dropdown */}
      <div className="relative">
        <div className="flex items-center rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 focus-within:border-cyan-500/60">
          <Search className="mr-2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder={
              availableClasses.length > 0
                ? 'Filter classes (e.g. person, car, dog)...'
                : 'Loading classes...'
            }
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Done
            </button>
          )}
        </div>

        {open && availableClasses.length > 0 && (
          <div className="absolute z-20 mt-1.5 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-700/90 bg-slate-900 p-2 shadow-2xl">
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((cls) => {
                const selected = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={`rounded-lg px-2.5 py-1 text-xs capitalize transition ${
                      selected
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cls}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-2 py-1 text-xs text-slate-400">No matching classes.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
