import { SORT_OPTIONS } from '../utils/constants';
import type { SortOption } from '../utils/types';

type SortControlsProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <label className="field-group">
      <span className="field-label">Sort by</span>
      <select
        className="text-input"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
