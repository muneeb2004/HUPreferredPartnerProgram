import { AlertCircle } from "lucide-react";

export function DataTableError({ message = "Failed to load data." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border border-border bg-surface-card">
      <AlertCircle className="w-10 h-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {message}
      </p>
    </div>
  );
}
