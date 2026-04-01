type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="field-group">
      <span className="field-label">Search tasks</span>
      <input
        className="text-input"
        type="search"
        placeholder="Search title or description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
