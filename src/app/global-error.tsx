"use client";

import * as Sentry from "@sentry/nextjs";
import type Error from "next/error";
import { type ReactNode, useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <h2>A fatal error occurred! Crash data has been sent.</h2>
        <button
          onClick={() => {
            reset();
          }}
          type="button"
        >
          Refresh page
        </button>
      </body>
    </html>
  );
}
