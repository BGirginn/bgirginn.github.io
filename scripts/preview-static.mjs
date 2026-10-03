import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import {
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const buildDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../out",
);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
};

function isInside(root, path) {
  const location = relative(root, path);
  return (
    !isAbsolute(location) &&
    location !== ".." &&
    !location.startsWith(`..${sep}`)
  );
}

export async function createPreviewServer(directory = buildDirectory) {
  const root = await realpath(directory);
  await stat(resolve(root, "index.html"));

  return createServer(async (request, response) => {
    // Export rebuilds replace hashed assets. A cached HTML document can reference
    // deleted CSS/JS, so this local preview must never cache any build response.
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const fail = (status, message) => {
      response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(request.method === "HEAD" ? undefined : message);
    };
    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      fail(405, "Method not allowed");
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      fail(400, "Invalid URL");
      return;
    }
    if (pathname.includes("\0")) {
      fail(400, "Invalid path");
      return;
    }
    let file = resolve(root, `.${pathname}`);
    if (!isInside(root, file)) {
      fail(403, "Forbidden");
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      file = await realpath(file);
      if (!isInside(root, file)) {
        fail(403, "Forbidden");
        return;
      }
      const content = await readFile(file);
      response.writeHead(200, {
        "Content-Type":
          contentTypes[extname(file)] ?? "application/octet-stream",
        "Content-Length": content.length,
      });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch (error) {
      if (["ENOENT", "ENOTDIR"].includes(error.code))
        fail(404, "File not found");
      else {
        console.error("Static preview read failed:", error);
        fail(500, "Preview could not read the build file");
      }
    }
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const port = Number(process.env.PREVIEW_PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PREVIEW_PORT");
  const server = await createPreviewServer();
  server.on("error", (error) => {
    console.error("Preview server failed:", error.message);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Static preview (cache disabled): http://127.0.0.1:${port}/`);
  });
}
