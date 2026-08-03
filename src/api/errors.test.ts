import { describe, expect, test } from "vitest";
import { ApiError, normalizeApiError } from "./errors";

const createHttpError = (
  status: number,
  data: unknown,
  headers?: HeadersInit,
) =>
  Object.assign(new Error(`Request failed with status ${status}`), {
    name: "HTTPError",
    response: new Response(null, { status, headers }),
    data,
  });

describe("normalizeApiError", () => {
  test("preserves backend error messages and response data", () => {
    const data = {
      statusCode: 422,
      message: "Name is required, Floor must be a number",
      timestamp: "2026-08-03T12:00:00.000Z",
      path: "/api/v1/locations",
    };
    const error = normalizeApiError(createHttpError(422, data));

    expect(error).toMatchObject({
      name: "ApiError",
      kind: "http",
      status: 422,
      message: "Name is required, Floor must be a number",
      retryable: false,
      data,
    });
  });

  test("preserves server messages and captures rate-limit timing", () => {
    const serverError = normalizeApiError(
      createHttpError(503, { message: "Database password rejected" }),
    );
    const rateLimitError = normalizeApiError(
      createHttpError(429, null, { "retry-after": "12" }),
    );

    expect(serverError.message).toBe("Database password rejected");
    expect(serverError.retryable).toBe(true);
    expect(rateLimitError.retryAfterMs).toBe(12_000);
  });

  test("normalizes network failures and does not wrap normalized errors twice", () => {
    const networkFailure = Object.assign(new Error("Failed to fetch"), {
      name: "NetworkError",
    });
    const networkError = normalizeApiError(networkFailure);

    expect(networkError).toMatchObject({
      kind: "network",
      retryable: true,
      message: "Failed to fetch",
    });
    expect(normalizeApiError(networkError)).toBe(networkError);
    expect(networkError).toBeInstanceOf(ApiError);
  });
});
