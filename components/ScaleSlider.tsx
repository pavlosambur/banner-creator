import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ScaleSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function ScaleSlider({ label, value, onChange }: ScaleSliderProps) {
  return (
    <div className="w-1/3 mt-2 mb-4 flex items-center gap-3 text-sm">
      <Label className="shrink-0 text-foreground">{label}</Label>
      <Slider min={1} max={3} step={0.01} value={[value]} onValueChange={([v]) => onChange(v)} className="flex-grow" />
      <span className="w-10 text-end text-muted-foreground">{value.toFixed(1)}x</span>
    </div>
  );
}
