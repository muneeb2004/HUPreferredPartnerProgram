"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught provider boundary error:", error, errorInfo);
  }

  public render(): JSX.Element {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-display font-semibold">Client Runtime Error</h2>
            <p className="text-muted-foreground">The application encountered an unexpected client-side error.</p>
            <button
              className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium"
              onClick={(): void => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
