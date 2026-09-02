import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function unauthorizedResponse(message = "Unauthorized") {
  return new Response(JSON.stringify({ detail: message }), {
    status: 401,
    statusText: "Unauthorized",
    headers: { "Content-Type": "application/json" },
  });
}

function createWindow(pathname: string, search = "") {
  return {
    location: {
      origin: "http://localhost:3000",
      pathname,
      search,
      replace: vi.fn(),
    },
    dispatchEvent: vi.fn(),
  };
}

describe("HTTP 401 handling", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("redirects an admin request to admin login and preserves the current URL", async () => {
    const windowMock = createWindow("/admin/bookings/booking-1", "?view=day");
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(unauthorizedResponse()));
    const { get } = await import("./http");

    await expect(get("/api/admin/bookings/booking-1")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });

    expect(windowMock.location.replace).toHaveBeenCalledOnce();
    const loginUrl = new URL(windowMock.location.replace.mock.calls[0][0]);
    expect(loginUrl.pathname).toBe("/admin/login");
    expect(loginUrl.searchParams.get("callbackUrl")).toBe(
      "/admin/bookings/booking-1?view=day",
    );
    expect(windowMock.dispatchEvent).not.toHaveBeenCalled();
  });

  it("redirects a client request to client login", async () => {
    const windowMock = createWindow("/client/account");
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(unauthorizedResponse()));
    const { get } = await import("./http");

    await expect(get("/api/user/profile")).rejects.toMatchObject({
      status: 401,
    });

    const loginUrl = new URL(windowMock.location.replace.mock.calls[0][0]);
    expect(loginUrl.pathname).toBe("/client/login");
    expect(loginUrl.searchParams.get("callbackUrl")).toBe("/client/account");
  });

  it("does not redirect when the login endpoint itself returns 401", async () => {
    const windowMock = createWindow("/admin/login");
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(unauthorizedResponse()));
    const { post } = await import("./http");

    await expect(
      post("/api/admin/user/login", {
        email: "admin@example.com",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({ status: 401 });

    expect(windowMock.location.replace).not.toHaveBeenCalled();
    expect(windowMock.dispatchEvent).toHaveBeenCalledOnce();
  });

  it("supports disabling automatic unauthorized redirects per request", async () => {
    const windowMock = createWindow("/admin/bookings");
    vi.stubGlobal("window", windowMock);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(unauthorizedResponse()));
    const { get } = await import("./http");

    await expect(
      get("/api/admin/bookings", { redirectOnUnauthorized: false }),
    ).rejects.toMatchObject({ status: 401 });

    expect(windowMock.location.replace).not.toHaveBeenCalled();
    expect(windowMock.dispatchEvent).toHaveBeenCalledOnce();
  });
});
