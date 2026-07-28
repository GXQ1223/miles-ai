import type { ImageKey } from "@/lib/content/images";
import { imageUrl } from "@/lib/content/images";

export function ImageCard({
  imageKey,
  width,
  height,
  className,
  alt = "",
}: {
  imageKey: ImageKey;
  width: number;
  height: number;
  className?: string;
  alt?: string;
}) {
  return (
    <div className={["imgcard", className].filter(Boolean).join(" ")}>
      <img src={imageUrl(imageKey, width, height)} alt={alt} />
    </div>
  );
}
