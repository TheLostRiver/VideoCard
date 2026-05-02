import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";
import { readGpuData, saveGpuRecord } from "./gpu-data.mjs";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";
import { createHardwareQueryService } from "../src/application/hardware-query-service.js";
import { createHardwareMutationService } from "../src/application/hardware-mutation-service.js";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
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
  if (req.method === "GET" && url.pathname === "/api/hardware/categories") {
    try {
      const repo = createJsonHardwareRepository({ root: serverRoot });
      const service = createHardwareQueryService(repo);
      const categories = await repo.listCategories();
      sendJson(res, 200, { categories });
    } catch (error) {
      sendJson(res, 500, { errors: [error.message] });
    }
    return;
  }

  const hardwareItemsMatch = url.pathname.match(/^\/api\/hardware\/([^/]+)\/items(?:\/(.*))?$/);
  if (req.method === "GET" && hardwareItemsMatch) {
    const categoryId = decodeURIComponent(hardwareItemsMatch[1]);
    const itemId = hardwareItemsMatch[2] ? decodeURIComponent(hardwareItemsMatch[2]) : null;
    try {
      const repo = createJsonHardwareRepository({ root: serverRoot });
      const service = createHardwareQueryService(repo);
      const category = await repo.getCategory(categoryId);
      if (!category) {
        sendJson(res, 404, { errors: [`category not found: ${categoryId}`] });
        return;
      }
      if (itemId) {
        const detail = await service.getDetailViewModel(itemId);
        if (!detail) {
          sendJson(res, 404, { errors: [`item not found: ${itemId}`] });
          return;
        }
        sendJson(res, 200, { detail });
      } else {
        const list = await service.getListViewModel(categoryId);
        sendJson(res, 200, list);
      }
    } catch (error) {
      sendJson(res, 500, { errors: [error.message] });
    }
    return;
  }

  const adminHardwareCreateMatch = url.pathname.match(/^\/api\/admin\/hardware\/([^/]+)\/items$/);
  if (req.method === "POST" && adminHardwareCreateMatch) {
    const categoryId = decodeURIComponent(adminHardwareCreateMatch[1]);
    try {
      const repo = createJsonHardwareRepository({ root: serverRoot });
      const mutationService = createHardwareMutationService(repo);
      const queryService = createHardwareQueryService(repo);
      const category = await repo.getCategory(categoryId);
      if (!category) {
        sendJson(res, 404, { errors: [`category not found: ${categoryId}`] });
        return;
      }
      const detail = await readJsonBody(req);
      if (!detail?.item?.id) {
        sendJson(res, 400, { errors: ["detail.item.id is required"] });
        return;
      }
      await mutationService.saveItemDetail(detail, { upsert: true });
      const saved = await queryService.getDetailViewModel(detail.item.id);
      sendJson(res, 201, { detail: saved });
    } catch (error) {
      sendJson(res, error.statusCode || 400, { errors: error.errors || [error.message] });
    }
    return;
  }

  const adminHardwareMatch = url.pathname.match(/^\/api\/admin\/hardware\/([^/]+)\/items\/(.+)$/);
  if (req.method === "PUT" && adminHardwareMatch) {
    const categoryId = decodeURIComponent(adminHardwareMatch[1]);
    const itemId = decodeURIComponent(adminHardwareMatch[2]);
    try {
      const repo = createJsonHardwareRepository({ root: serverRoot });
      const mutationService = createHardwareMutationService(repo);
      const queryService = createHardwareQueryService(repo);
      const category = await repo.getCategory(categoryId);
      if (!category) {
        sendJson(res, 404, { errors: [`category not found: ${categoryId}`] });
        return;
      }
      const detail = await readJsonBody(req);
      await mutationService.saveItemDetail(detail);
      const saved = await queryService.getDetailViewModel(itemId);
      sendJson(res, 200, { detail: saved });
    } catch (error) {
      sendJson(res, error.statusCode || 400, { errors: error.errors || [error.message] });
    }
    return;
  }

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
