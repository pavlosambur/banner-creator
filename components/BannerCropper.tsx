import Cropper from "react-easy-crop";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BannerCropperProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
}

export default function BannerCropper({
  image,
  crop,
  zoom,
  aspect,
  onCropChange,
  onZoomChange,
  onCropComplete,
}: BannerCropperProps) {
  return (
    <div className="w-full h-[300px] relative rounded-xl overflow-hidden border border-card bg-card shadow-sm">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}
