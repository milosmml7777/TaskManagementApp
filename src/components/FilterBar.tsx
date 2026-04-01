import { TASK_CATEGORIES } from '../utils/constants';

type FilterBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <label className="field-group">
      <span className="field-label">Category</span>
      <select
        className="text-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="All">All categories</option>
        {TASK_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}
