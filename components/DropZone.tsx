import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TEXT = {
  imageLoaded: "Image loaded 👇",
  dropPrompt: "Drop an image here or click to choose one",
} as const;

interface DropZoneProps {
  onFile: (file: File) => void;
  imageLoaded: boolean;
}

export default function DropZone({ onFile, imageLoaded }: DropZoneProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFile(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full h-12 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 cursor-pointer mb-4"
    >
      <Label className="w-full h-full flex items-center justify-center cursor-pointer">
        <Input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        {imageLoaded ? <span>{TEXT.imageLoaded}</span> : <span>{TEXT.dropPrompt}</span>}
      </Label>
    </div>
  );
}
