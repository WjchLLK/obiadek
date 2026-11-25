// Run only against an isolated local application and its local Supabase stack.
import { randomUUID } from "node:crypto";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4321";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const ANON_KEY = process.env.ANON_KEY;

function requireLocal(value, name) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a local HTTP URL`);
  }
  if (
    url.protocol !== "http:" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${name} must be a local HTTP origin`);
  }
  return url.origin;
}

requireLocal(BASE_URL, "BASE_URL");
requireLocal(SUPABASE_URL, "SUPABASE_URL");
if (!SERVICE_ROLE_KEY || !ANON_KEY) throw new Error("Local SERVICE_ROLE_KEY and ANON_KEY are required");

const email = `smoke-${randomUUID()}@example.com`;
const password = "Smoke-Test-Passw0rd!";
const jar = new Map();
const secondJar = new Map();

function cookieHeader(cookies) {
  return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function storeCookies(response, cookies) {
  for (const raw of response.headers.getSetCookie()) {
    const [pair, ...attrs] = raw.split(";");
    const [name, ...rest] = pair.split("=");
    const expired = attrs.some((a) => /max-age=0/i.test(a.trim()));
    if (expired) cookies.delete(name.trim());
    else cookies.set(name.trim(), rest.join("="));
  }
}

async function request(path, { method = "GET", form, cookies = jar } = {}) {
  const response = await fetch(BASE_URL + path, {
    method,
    redirect: "manual",
    headers: {
      Cookie: cookieHeader(cookies),
      Origin: BASE_URL,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  storeCookies(response, cookies);
  return { status: response.status, location: response.headers.get("location") ?? "" };
}

function expireSession(cookies) {
  const parts = [...cookies.keys()]
    .filter((name) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!parts.length) throw new Error("Second client has no session cookie");
  const encoded = parts.map((name) => cookies.get(name)).join("");
  if (!encoded.startsWith("base64-")) throw new Error("Unexpected session cookie format");
  const session = JSON.parse(Buffer.from(encoded.slice(7), "base64url").toString("utf8"));
  session.expires_at = 1;
  const updated = `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`;
  for (const name of parts) cookies.delete(name);
  const base = parts[0].replace(/\.\d+$/, "");
  const chunkSize = 3180;
  if (updated.length <= chunkSize) cookies.set(base, updated);
  else {
    for (let i = 0; i < updated.length; i += chunkSize) {
      cookies.set(`${base}.${i / chunkSize}`, updated.slice(i, i + chunkSize));
    }
  }
}

async function rejectSignup(target) {
  const candidate = `smoke-${randomUUID()}@example.com`;
  try {
    const response =
      target === "app"
        ? await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            redirect: "manual",
            headers: { Origin: BASE_URL, "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email: candidate, password }).toString(),
          })
        : await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: "POST",
            headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ email: candidate, password }),
          });
    const body = target === "supabase" ? await response.json() : null;
    return {
      status: target === "supabase" && body.error_code !== "signup_disabled" ? 0 : response.status,
      location: "",
    };
  } finally {
    await verifyNoSignup(candidate);
  }
}

async function verifyNoSignup(candidate) {
  for (let page = 1; ; page++) {
    const list = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=100`, {
      headers: adminHeaders,
    });
    if (!list.ok) throw new Error("Cannot verify signup did not create a user");
    const { users } = await list.json();
    const unexpected = users.find((user) => user.email === candidate);
    if (unexpected) {
      const deleted = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(unexpected.id)}`, {
        method: "DELETE",
        headers: adminHeaders,
      });
      if (!deleted.ok) throw new Error("Unexpected signup account cleanup failed");
      throw new Error("Signup created an unexpected user");
    }
    if (users.length < 100) break;
  }
}

const steps = [
  ["application signup is unavailable", () => rejectSignup("app"), { status: 404 }],
  ["public Supabase signup is disabled", () => rejectSignup("supabase"), { status: 422 }],
  ["home renders", () => request("/"), { status: 200 }],
  ["dashboard redirects anonymous user", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
  [
    "signin rejects wrong password",
    () => request("/api/auth/signin", { method: "POST", form: { email, password: "wrong" } }),
    { status: 302, location: "/auth/signin?error=" },
  ],
  ["wrong password does not grant access", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
  [
    "signin accepts correct password",
    () => request("/api/auth/signin", { method: "POST", form: { email, password } }),
    { status: 302, location: "/" },
  ],
  ["dashboard renders for signed-in user", () => request("/dashboard"), { status: 200 }],
  [
    "second client signs in with the same account",
    () => request("/api/auth/signin", { method: "POST", form: { email, password }, cookies: secondJar }),
    { status: 302, location: "/" },
  ],
  ["second client can access dashboard", () => request("/dashboard", { cookies: secondJar }), { status: 200 }],
  ["signout clears session", () => request("/api/auth/signout", { method: "POST" }), { status: 302, location: "/" }],
  ["dashboard redirects after signout", () => request("/dashboard"), { status: 302, location: "/auth/signin" }],
  ["second client remains signed in", () => request("/dashboard", { cookies: secondJar }), { status: 200 }],
  [
    "second client can refresh its session",
    async () => {
      expireSession(secondJar);
      const before = cookieHeader(secondJar);
      const result = await request("/dashboard", { cookies: secondJar });
      return cookieHeader(secondJar) === before ? { status: 0, location: "" } : result;
    },
    { status: 200 },
  ],
];

const adminHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};
const created = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
  method: "POST",
  headers: adminHeaders,
  body: JSON.stringify({ email, password, email_confirm: true }),
});
if (!created.ok) throw new Error(`Local account setup failed (${created.status})`);
const { id } = await created.json();
if (typeof id !== "string") throw new Error("Local account setup did not return an ID");

let failed = 0;
try {
  for (const [name, run, expected] of steps) {
    const actual = await run();
    const ok =
      actual.status === expected.status &&
      (expected.location === undefined || actual.location.startsWith(expected.location));
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  -> ${actual.status} ${actual.location}`);
    if (!ok) {
      failed++;
      console.log(`      expected ${expected.status} ${expected.location ?? ""}`);
    }
  }
} finally {
  const deleted = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: adminHeaders,
  });
  if (!deleted.ok) {
    console.error(`Local account cleanup failed (${deleted.status})`);
    failed++;
  }
}

console.log(failed ? `\n${failed} step(s) failed` : "\nAll smoke steps passed");
process.exitCode = failed ? 1 : 0;
