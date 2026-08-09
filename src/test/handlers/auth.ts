import { http, HttpResponse } from "msw";

const encodeTokenPart = (value: object) =>
  btoa(JSON.stringify(value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

const createToken = (role: string) =>
  `${encodeTokenPart({ alg: "none", typ: "JWT" })}.${encodeTokenPart({
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  })}.signature`;

export const adminToken = createToken("admin");
export const viewerToken = createToken("viewer");

export const authRequests = {
  logins: [] as Array<{ username: string; password: string }>,
};

export const resetAuthMockData = () => {
  authRequests.logins = [];
};

export const authHandlers = [
  http.post("*/auth/login", async ({ request }) => {
    const credentials = (await request.json()) as {
      username: string;
      password: string;
    };
    authRequests.logins.push(credentials);

    if (credentials.password !== "secret") {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      accessToken:
        credentials.username === "viewer" ? viewerToken : adminToken,
    });
  }),
];
