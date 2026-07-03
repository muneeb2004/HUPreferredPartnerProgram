import * as React from "react";
import { MediaAsset, MediaPickerProps } from "./MediaPicker";
import { MediaPicker } from "./MediaPicker";

// MediaSelector can be a wrapper over MediaPicker that also supports selecting from an existing gallery.
// For now, it delegates to MediaPicker but could be extended to show a modal with a grid of MediaAssets.

export interface MediaSelectorProps extends MediaPickerProps {
  onSelectExisting?: () => Promise<MediaAsset | null>;
}

export function MediaSelector({ onSelectExisting, ...props }: MediaSelectorProps) {
  // In the future, we could add a "Choose from Library" button alongside the standard picker
  return (
    <div className="flex flex-col gap-2">
      <MediaPicker {...props} />
      {onSelectExisting && !props.value && (
        <button
          type="button"
          onClick={async () => {
            const asset = await onSelectExisting();
            if (asset) {
              props.onChange(asset.id);
            }
          }}
          className="text-sm text-blue-600 hover:underline self-start"
        >
          Choose from library
        </button>
      )}
    </div>
  );
}
