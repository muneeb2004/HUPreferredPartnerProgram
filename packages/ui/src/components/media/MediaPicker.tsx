import * as React from "react";
import { Button } from "../ui/button";
import { MediaPreview } from "./MediaPreview";

export interface MediaAsset {
  id: string;
  url: string;
  altText?: string;
  mimeType: string;
}

export interface MediaPickerProps {
  value?: string;
  onChange: (id: string) => void;
  onUpload?: (file: File) => Promise<MediaAsset>;
  accept?: string;
  className?: string;
}

export function MediaPicker({ value, onChange, onUpload, accept = "image/*", className }: MediaPickerProps) {
  const [asset, setAsset] = React.useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // In a real implementation, you might fetch the asset details here if `value` is provided
  // and `asset` is null.
  React.useEffect(() => {
    if (!value) setAsset(null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    try {
      setIsUploading(true);
      const newAsset = await onUpload(file);
      setAsset(newAsset);
      onChange(newAsset.id);
    } catch (error) {
      console.error("Failed to upload media:", error);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      {asset || value ? (
        <div className="relative rounded-md border p-2">
          {asset ? (
            <MediaPreview asset={asset} className="h-32 w-32 object-cover rounded-md" />
          ) : (
            <div className="h-32 w-32 flex items-center justify-center bg-secondary rounded-md text-sm text-muted-foreground">
              Media Selected (ID: {value})
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Change"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setAsset(null);
                onChange("");
              }}
              disabled={isUploading}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={!onUpload || isUploading}
        >
          {isUploading ? "Uploading..." : "Select Media"}
        </Button>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
