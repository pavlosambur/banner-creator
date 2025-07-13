"use client";
import BannerCropper from "@/components/BannerCropper";
import DropZone from "@/components/DropZone";
import ScaleSlider from "@/components/ScaleSlider";
import getCroppedImg from "@/lib/cropImage";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function BannerCreator() {
  const [image, setImage] = useState<string | null>(null);
  const [crop1, setCrop1] = useState({ x: 0, y: 0 });
  const [zoom1, setZoom1] = useState(1);
  const [croppedAreaPixels1, setCroppedAreaPixels1] = useState<any>(null);
  const [crop2, setCrop2] = useState({ x: 0, y: 0 });
  const [zoom2, setZoom2] = useState(1);
  const [croppedAreaPixels2, setCroppedAreaPixels2] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const img = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    let quality = 1;
    let step = 0.05;
    const maxSizeBytes = 750 * 1024;
    const minQuality = 0.1;
    let resultBlob: Blob | null = null;
    let attempt = 0;
    while (true) {
      resultBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      });
      if (!resultBlob) throw new Error("Failed to create blob");
      if (resultBlob.size <= maxSizeBytes || quality <= minQuality) break;
      quality -= step;
      if (quality < minQuality) quality = minQuality;
      attempt++;
      if (attempt > 20) break;
    }
    return resultBlob;
  };

  const showCropped = async () => {
    if (!image || isProcessing) return;
    setIsProcessing(true);
    let clipboardText = "";
    try {
      clipboardText = await navigator.clipboard.readText();
    } catch {}
    const cropped1Url = await getCroppedImg(image, croppedAreaPixels1, "banner-800x256", {
      width: 1600,
      height: 512,
      format: "image/jpeg",
    });
    const cropped2Url = await getCroppedImg(image, croppedAreaPixels2, "banner-500x256", {
      width: 1000,
      height: 512,
      format: "image/jpeg",
    });
    const compressedBlob1 = await compressImage(cropped1Url);
    const compressedBlob2 = await compressImage(cropped2Url);
    const safeText = clipboardText
      .trim()
      .replaceAll(/\s+/g, "_")
      .replaceAll(/[^\w\-]/g, "");
    const filename1 = `1600_${safeText || "banner1"}.jpg`;
    const filename2 = `1000_${safeText || "banner2"}.jpg`;
    const link1 = document.createElement("a");
    link1.download = filename1;
    link1.href = URL.createObjectURL(compressedBlob1);
    link1.click();
    const link2 = document.createElement("a");
    link2.download = filename2;
    link2.href = URL.createObjectURL(compressedBlob2);
    link2.click();
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-4xl mx-auto">
      <DropZone onFile={handleFile} imageLoaded={!!image} />
      {image && (
        <>
          <BannerCropper
            image={image}
            crop={crop1}
            zoom={zoom1}
            aspect={800 / 256}
            onCropChange={setCrop1}
            onZoomChange={setZoom1}
            onCropComplete={(_, cropped) => setCroppedAreaPixels1(cropped)}
          />
          <ScaleSlider label="Масштаб:" value={zoom1} onChange={setZoom1} />
          <BannerCropper
            image={image}
            crop={crop2}
            zoom={zoom2}
            aspect={500 / 256}
            onCropChange={setCrop2}
            onZoomChange={setZoom2}
            onCropComplete={(_, cropped) => setCroppedAreaPixels2(cropped)}
          />
          <ScaleSlider label="Масштаб:" value={zoom2} onChange={setZoom2} />
          <Button onClick={showCropped} className="mt-6 px-6 py-2" disabled={isProcessing}>
            {isProcessing ? "Завантаження..." : "Завантажити JPEG"}
          </Button>
        </>
      )}
    </div>
  );
}
// Видалити папку components/ImageDropZone після перевірки, що все працює через нові імпорти!
