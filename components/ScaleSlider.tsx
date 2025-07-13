interface ScaleSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function ScaleSlider({ label, value, onChange }: ScaleSliderProps) {
  return (
    <div className="w-full mt-2 flex items-center gap-3 text-sm text-gray-700">
      <label className="w-24 shrink-0">{label}</label>
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-grow accent-green-600"
      />
      <span className="w-10 text-end text-gray-500">{value.toFixed(1)}x</span>
    </div>
  );
}
