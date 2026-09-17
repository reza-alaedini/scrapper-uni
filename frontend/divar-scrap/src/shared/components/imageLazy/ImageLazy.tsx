import React, { useState } from "react";
import styles from "./css/styles.module.css";
import { assetsUrl } from "@/config/url";

interface FadeInImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  pointerEvent?: boolean;
  type: "scale" | "fade";
  className?: string;
  needAssetUrl?: boolean;
}

const ImageLazy: React.FC<FadeInImageProps> = ({
  src,
  alt,
  pointerEvent = false,
  type,
  className,
  needAssetUrl = true,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const getClassName = () => {
    const baseClass = type === "fade" ? styles.image : styles.imageScale;
    const loadedClass = loaded
      ? type === "fade"
        ? styles.loaded
        : styles.scale
      : "";
    return `${baseClass} ${loadedClass}`;
  };

  if (!src || src === "undefined") return null;

  return (
    <img
      src={needAssetUrl ? `${assetsUrl}${src}` : src}
      // src={src}
      alt={alt}
      className={`${getClassName()} ${className}`}
      onLoad={handleImageLoad}
      style={{ pointerEvents: pointerEvent ? "auto" : "none" }}
      {...props}
    />
  );
};

export default ImageLazy;
