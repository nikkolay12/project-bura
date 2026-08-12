const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const portArg = process.argv.find((argument) => argument.startsWith("--port="));
const port = Number(portArg?.split("=")[1] || process.env.PORT || 8788);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, requestedPath));
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": types[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`5 Card Bura prototype: http://127.0.0.1:${port}/`);
});
