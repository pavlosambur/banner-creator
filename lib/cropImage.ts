interface CropParams {
  width: number;
  height: number;
  format?: "image/png" | "image/jpeg";
}

export default function getCroppedImg(
  imageSrc: string,
  crop: any,
  fileName: string,
  options: CropParams
): Promise<string> {
  const { width: targetWidth, height: targetHeight, format = "image/png" } = options;

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      // Завжди масштабуємо crop під targetWidth x targetHeight
      const cropW = crop.width;
      const cropH = crop.height;
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        cropW,
        cropH,
        0,
        0,
        targetWidth,
        targetHeight
      );
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, format);
    };
  });
}
