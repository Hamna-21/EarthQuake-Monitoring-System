import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

export type SearchSuggestion = {
  id: string;
  group: 'Pages' | 'Earthquakes' | 'Locations' | 'Recent searches';
  label: string;
  detail?: string;
};

type Props = {
  value: string;
  suggestions: SearchSuggestion[];
  onChange: (value: string) => void;
  onClear: () => void;
  onOpen: (suggestion: SearchSuggestion) => void;
  onSubmit: () => void;
};

/** Renders or coordinates dashboard search for this frontend module. */
export default function DashboardSearch({ value, suggestions, onChange, onClear, onOpen, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const grouped = useMemo(() => ['Pages', 'Earthquakes', 'Locations', 'Recent searches']
    .map((group) => [group, suggestions.filter((item) => item.group === group)] as const)
    .filter(([, items]) => items.length), [suggestions]);
  const hasQuery = value.trim().length > 0;

  useEffect(() => setActive(0), [value]);

  const choose = (item = suggestions[active]) => {
    if (!item) return onSubmit();
    onOpen(item);
    setOpen(false);
  };

  return (
    <div className="dashboard-search">
      <label className="dashboard-search__field">
        <Search className="h-4 w-4 text-cyan-200" />
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(event) => { onChange(event.target.value); setOpen(true); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0))); }
            if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            if (event.key === 'Enter') { event.preventDefault(); choose(); }
            if (event.key === 'Escape') { event.preventDefault(); onClear(); setOpen(false); }
          }}
          placeholder="Search earthquakes, pages, countries"
          className="dashboard-search__input"
          aria-label="Global dashboard search"
          role="combobox"
          aria-expanded={open}
        />
        {hasQuery && <button type="button" onClick={onClear} className="dashboard-search__clear" aria-label="Clear dashboard search">
          <X className="h-3.5 w-3.5" />
        </button>}
      </label>

      {open && hasQuery && <div className="dashboard-search__results">
        {suggestions.length ? grouped.map(([group, items]) => (
          <div key={group} className="dashboard-search__group">
            <p className="dashboard-search__group-title">{group}</p>
            {items.map((item) => {
              const index = suggestions.findIndex((candidate) => candidate.id === item.id);
              return (
                <button key={item.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item)} className={`dashboard-search__result ${active === index ? 'dashboard-search__result--active' : ''}`}>
                  <span className="block text-sm font-black">{item.label}</span>
                  {item.detail && <span className="block truncate text-xs font-semibold text-slate-400">{item.detail}</span>}
                </button>
              );
            })}
          </div>
        )) : <p className="dashboard-search__empty">No matching results found.</p>}
      </div>}
    </div>
  );
}
/** Provides the global dashboard search input and suggestion interactions. */
