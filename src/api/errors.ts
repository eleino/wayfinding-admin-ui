import { isHTTPError, isNetworkError, isTimeoutError } from "ky";

export type ApiErrorKind =
  | "cancelled"
  | "http"
  | "network"
  | "timeout"
  | "unknown";

interface ApiErrorOptions {
  kind: ApiErrorKind;
  status?: number;
  retryable?: boolean;
  retryAfterMs?: number;
  data?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly retryable: boolean;
  readonly retryAfterMs?: number;
  readonly data?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.kind = options.kind;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
    this.retryAfterMs = options.retryAfterMs;
    this.data = options.data;
  }
}

/**
 * Extracts the backend error message from the response data.
 * @param data The response data from the backend.
 * @returns The backend error message if available, otherwise undefined.
 */
const getBackendMessage = (data: unknown) => {
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return undefined;
  }

  return typeof data.message === "string" ? data.message : undefined;
};

/**
 * Converts a "Retry-After" header value to milliseconds.
 * @param value The "Retry-After" header value.
 * @returns The number of milliseconds to wait before retrying, or undefined if the value is invalid.
 */
const getRetryAfterMs = (value: string | null) => {
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);

  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
};

/**
 * Determines if a given HTTP status code indicates a retryable error.
 * @param status The HTTP status code.
 * @returns True if the status indicates a retryable error, false otherwise.
 * Retryable status codes include 408, 425, 429, 502, 503, and 504.
 */
const isRetryableStatus = (status: number) =>
  [408, 425, 429, 502, 503, 504].includes(status);

/**
 * Normalizes an error into an ApiError instance.
 * @param error The error to normalize.
 * @returns The normalized ApiError instance.
 */
export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (isHTTPError(error)) {
    const { status, headers } = error.response;
    return new ApiError(getBackendMessage(error.data) ?? error.message, {
      kind: "http",
      status,
      retryable: isRetryableStatus(status),
      retryAfterMs: getRetryAfterMs(headers.get("retry-after")),
      data: error.data,
      cause: error,
    });
  }

  if (isTimeoutError(error)) {
    return new ApiError(error.message, {
      kind: "timeout",
      retryable: true,
      cause: error,
    });
  }

  if (isNetworkError(error)) {
    return new ApiError(error.message, {
      kind: "network",
      retryable: true,
      cause: error,
    });
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new ApiError(error.message, { kind: "cancelled", cause: error });
  }

  return new ApiError(
    error instanceof Error ? error.message : "Unknown error",
    { kind: "unknown", cause: error },
  );
};
