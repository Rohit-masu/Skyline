"use client";

import { useEffect, useRef, useState } from "react";
import type { PropertiesResponse } from "@/types/property";
import { PAGE_SIZE } from "@/lib/schema/query";

interface Failure {
  key: string;
  message: string;
}

/**
 * Results for one canonical query string (`queryKey`, from serializeQuery).
 * - The server-rendered query is used as is: no fetch on first load.
 * - Results are kept per query, so Back/Forward to an earlier filter is instant.
 * - A new query aborts the previous request; a request id also drops any late response.
 * Loading is derived (no data and no failure for this key), so no setState runs inside the effect body.
 */
export function useListingResults(queryKey: string, initialKey: string, initialData: PropertiesResponse) {
  const [resultsByKey, setResultsByKey] = useState<Record<string, PropertiesResponse>>({
    [initialKey]: initialData,
  });
  const [failure, setFailure] = useState<Failure | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const latestRequestId = useRef(0);

  const data = resultsByKey[queryKey];
  const hasData = data !== undefined;

  useEffect(() => {
    if (hasData) return;

    const requestId = ++latestRequestId.current;
    const controller = new AbortController();
    const params = new URLSearchParams(queryKey);
    params.set("limit", String(PAGE_SIZE));

    fetch(`/api/properties?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        const body: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            body && typeof body === "object" && "error" in body && typeof body.error === "string"
              ? body.error
              : `The server answered with status ${response.status}.`;
          throw new Error(message);
        }
        return body as PropertiesResponse;
      })
      .then((result) => {
        if (requestId !== latestRequestId.current) return;
        setResultsByKey((previous) => ({ ...previous, [queryKey]: result }));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || requestId !== latestRequestId.current) return;
        const message = error instanceof Error ? error.message : "Could not load homes.";
        setFailure({ key: queryKey, message });
      });

    return () => controller.abort();
  }, [queryKey, hasData, retryCount]);

  const error = !hasData && failure?.key === queryKey ? failure.message : null;

  return {
    data,
    error,
    isLoading: !hasData && error === null,
    retry: () => {
      setFailure(null);
      setRetryCount((count) => count + 1);
    },
  };
}
