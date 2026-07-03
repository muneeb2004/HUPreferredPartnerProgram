import * as React from "react";
import { MediaAsset } from "./MediaPicker";

export interface MediaPreviewProps {
  asset: MediaAsset;
  className?: string;
  fallback?: React.ReactNode;
}

export function MediaPreview({ asset, className = "", fallback }: MediaPreviewProps) {
  if (!asset.url) {
    return fallback ? <>{fallback}</> : null;
  }

  const isVideo = asset.mimeType?.startsWith("video/");
  const isImage = asset.mimeType?.startsWith("image/");

  if (isVideo) {
    return (
      <video
        src={asset.url}
        className={className}
        controls
        playsInline
      />
    );
  }

  if (isImage) {
    return (
      <img
        src={asset.url}
        alt={asset.altText || "Media preview"}
        className={className}
        loading="lazy"
      />
    );
  }

  // Fallback for document or other types
  return (
    <div className={`flex items-center justify-center bg-secondary text-secondary-foreground rounded-md p-4 ${className}`}>
      <span className="text-sm">Document: {asset.altText || asset.id}</span>
    </div>
  );
}
