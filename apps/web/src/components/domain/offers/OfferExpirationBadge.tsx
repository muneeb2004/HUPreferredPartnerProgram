import * as React from "react";

export function OfferExpirationBadge({ date }: { date: string }): JSX.Element {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
      Expires: {date}
    </span>
  );
}
