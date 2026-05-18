import { Hono } from "hono";

const APP_BUNDLE_ID = process.env.APP_BUNDLE_ID ?? "app.farmei.mobile";
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID ?? "TEAMID";
const ANDROID_SHA256 = process.env.ANDROID_SHA256_CERT_FINGERPRINT ?? "";

// Apple App Site Association — habilita Universal Links iOS para farmei.app/invite/*
// Servir EXATAMENTE em https://farmei.app/.well-known/apple-app-site-association
// Content-Type: application/json, SEM extensão .json no path.
function aasaPayload() {
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${APPLE_TEAM_ID}.${APP_BUNDLE_ID}`,
          paths: ["/invite/*"]
        }
      ]
    }
  };
}

// Android Asset Links — habilita Android App Links para farmei.app/invite/*
// Servir em https://farmei.app/.well-known/assetlinks.json
function assetLinksPayload() {
  const fingerprints = ANDROID_SHA256
    ? ANDROID_SHA256.split(",").map((value) => value.trim()).filter((value) => value.length > 0)
    : [];

  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: APP_BUNDLE_ID,
        sha256_cert_fingerprints: fingerprints
      }
    }
  ];
}

export const wellKnownRouter = new Hono()
  .get("/apple-app-site-association", (c) =>
    c.json(aasaPayload(), 200, { "Content-Type": "application/json" })
  )
  .get("/assetlinks.json", (c) =>
    c.json(assetLinksPayload(), 200, { "Content-Type": "application/json" })
  );
