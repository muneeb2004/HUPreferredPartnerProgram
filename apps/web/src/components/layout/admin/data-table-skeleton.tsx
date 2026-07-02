import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hu-partner/ui";

import type * as React from "react";

export function DataTableSkeleton({ columns = 4, rows = 5 }: { columns?: number; rows?: number }): React.JSX.Element {
  return (
    <div className="rounded-md border border-border bg-surface-card">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i): React.JSX.Element => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex): React.JSX.Element => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex): React.JSX.Element => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
