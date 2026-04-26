import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";
import { readGpuData, saveGpuRecord } from "./gpu-data.mjs";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

export function resolvePath(urlPath, serverRoot = root) {
  const cleanPath = urlPath === "/" ? "/index.html" : decodeURIComponent(urlPath);
  const normalized = normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  return join(serverRoot, normalized);
}

export function createRequestHandler({ root: serverRoot = root } = {}) {
  return async function handleRequest(req, res) {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApiRequest(req, res, url, serverRoot);
        return;
      }

      const filePath = resolvePath(url.pathname, serverRoot);
      const body = await readFile(filePath);
      res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  };
}

async function handleApiRequest(req, res, url, serverRoot) {
  if (req.method === "GET" && url.pathname === "/api/gpus") {
    sendJson(res, 200, { gpus: await readGpuData(serverRoot) });
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/gpus/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/gpus/".length));
    try {
      const record = await readJsonBody(req);
      const gpu = await saveGpuRecord(id, record, serverRoot);
      sendJson(res, 200, { gpu });
    } catch (error) {
      sendJson(res, error.statusCode || 400, { errors: error.errors || [error.message] });
    }
    return;
  }

  sendJson(res, 404, { errors: ["API route not found"] });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        const error = new Error("Invalid JSON body");
        error.errors = ["Invalid JSON body"];
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer(createRequestHandler({ root }));
  server.listen(port, () => {
    console.log(`GPU ladder server running at http://localhost:${port}`);
  });
}
