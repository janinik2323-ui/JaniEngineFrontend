const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
    let ext = path.extname(filePath);

    let contentType = "text/html";
    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "application/javascript";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("404 - File Not Found");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

server.listen(3000, () => {
    console.log("Frontend running on http://localhost:3000");
});
