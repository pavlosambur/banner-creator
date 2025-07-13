"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "@/lib/cropImage";
import imageCompression from "browser-image-compression";

export default function ImageDropZone() {
  const [image, setImage] = useState<string | null>(null);

  const [crop1, setCrop1] = useState({ x: 0, y: 0 });
  const [zoom1, setZoom1] = useState(1);
  const [croppedAreaPixels1, setCroppedAreaPixels1] = useState<any>(null);

  const [crop2, setCrop2] = useState({ x: 0, y: 0 });
  const [zoom2, setZoom2] = useState(1);
  const [croppedAreaPixels2, setCroppedAreaPixels2] = useState<any>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const compressImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    const blob = await response.blob();

    // Перетворюємо blob на file
    const file = new File([blob], "image.png", { type: "image/png" });

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.75,
      useWebWorker: true,
      fileType: "image/png",
    });

    return compressed;
  };

  const showCropped = async () => {
    if (!image) return;

    // 1. Читаємо текст із буфера
    let clipboardText = "";
    try {
      clipboardText = await navigator.clipboard.readText();
    } catch (err) {
      console.warn("Не вдалося прочитати з буфера:", err);
    }

    // 2. Готуємо кропнуті PNG
    const cropped1Url = await getCroppedImg(image, croppedAreaPixels1, "banner-800x256", {
      width: 1600,
      height: 512,
      format: "image/png",
    });

    const cropped2Url = await getCroppedImg(image, croppedAreaPixels2, "banner-500x256", {
      width: 1000,
      height: 512,
      format: "image/png",
    });

    const compressedBlob1 = await compressImage(cropped1Url);
    const compressedBlob2 = await compressImage(cropped2Url);

    // 3. Сформуємо імена з буфера
    const safeText = clipboardText
      .trim()
      .replaceAll(/\s+/g, "_")
      .replaceAll(/[^\w\-]/g, "");
    const filename1 = `1600_${safeText || "banner1"}.png`;
    const filename2 = `1000_${safeText || "banner2"}.png`;

    // 4. Скачуємо
    const link1 = document.createElement("a");
    link1.download = filename1;
    link1.href = URL.createObjectURL(compressedBlob1);
    link1.click();

    const link2 = document.createElement("a");
    link2.download = filename2;
    link2.href = URL.createObjectURL(compressedBlob2);
    link2.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-4xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-12 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 cursor-pointer"
      >
        <label className="w-full h-full flex items-center justify-center cursor-pointer">
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          {image ? <span>Зображення завантажено 👇</span> : <span>Перетягни сюди зображення або клікни</span>}
        </label>
      </div>

      {image && (
        <>
          {/* Crop 1 */}
          <div className="w-full h-[300px] relative rounded-md overflow-hidden border shadow-sm">
            <Cropper
              image={image}
              crop={crop1}
              zoom={zoom1}
              aspect={800 / 256}
              onCropChange={setCrop1}
              onZoomChange={setZoom1}
              onCropComplete={(_, cropped) => setCroppedAreaPixels1(cropped)}
            />
          </div>
          <div className="w-full mt-2 flex items-center gap-3 text-sm text-gray-700">
            <label className="w-24 shrink-0">Масштаб (1):</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom1}
              onChange={(e) => setZoom1(Number(e.target.value))}
              className="flex-grow accent-green-600"
            />
            <span className="w-10 text-end text-gray-500">{zoom1.toFixed(1)}x</span>
          </div>

          {/* Crop 2 */}
          <div className="w-full h-[300px] relative rounded-md overflow-hidden border shadow-sm">
            <Cropper
              image={image}
              crop={crop2}
              zoom={zoom2}
              aspect={500 / 256}
              onCropChange={setCrop2}
              onZoomChange={setZoom2}
              onCropComplete={(_, cropped) => setCroppedAreaPixels2(cropped)}
            />
          </div>
          <div className="w-full mt-2 flex items-center gap-3 text-sm text-gray-700">
            <label className="w-24 shrink-0">Масштаб (2):</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom2}
              onChange={(e) => setZoom2(Number(e.target.value))}
              className="flex-grow accent-green-600"
            />
            <span className="w-10 text-end text-gray-500">{zoom2.toFixed(1)}x</span>
          </div>

          <button
            onClick={showCropped}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
          >
            Завантажити PNG
          </button>
        </>
      )}
    </div>
  );
}
