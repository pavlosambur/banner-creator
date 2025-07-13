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
  const { width, height, format = "image/png" } = options;

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, format);
    };
  });
}
