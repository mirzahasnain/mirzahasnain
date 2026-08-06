"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { createLogger } from "@/utils/logger";
import { TiButton } from "@/components/ui/ti";
import { application } from "@/config/application";

const log = createLogger("ErrorBoundary");

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "Unexpected error",
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    log.error("Unhandled UI error", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  private retry = () => {
    this.setState({ hasError: false, message: "" });
  };

  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center text-[var(--nb-text)]"
      >
        <h1 className="text-xl font-semibold">
          {this.props.fallbackTitle ?? "Something went wrong"}
        </h1>
        <p className="text-sm text-[var(--nb-muted)]">{this.state.message}</p>
        <p className="text-xs text-[var(--nb-faint)]">{application.disclaimer}</p>
        <TiButton variant="primary" onClick={this.retry}>
          Try again
        </TiButton>
      </div>
    );
  }
}
