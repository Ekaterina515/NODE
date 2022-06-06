const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};

const openDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, dirPath), (err, files) => {
      if (err) {
        reject("Unable to scan directory: " + err);
      }
      resolve(files);
    });
  });
};

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "GET") {
      const url = request.url;
      if (url.indexOf("favicon.ico") !== -1) {
        response.end();
      }
      const fullPath = path.join(__dirname, url);
      if (isFile(fullPath)) {
        const readStream = fs.createReadStream(fullPath, "utf-8");
        readStream.pipe(response);
      } else {
        response.write(`<h1>Path: ${url}</h1>`);

        const inDirectory = await openDirectory(url);
        if (typeof inDirectory === "object") {
          inDirectory.map((fileOrFolder) => {
            response.write(`
              <ol>
                <li><a href='http://localhost:${port}${
              url === "/" ? "" : url
            }/${fileOrFolder}'>${fileOrFolder}</a></li>
              </ol>
            `);
          });
          response.end();
        } else {
          response.write(`<span>${inDirectory}</span>`);
          response.end();
        }
      }
    }
  } catch (error) {
    response.end();
  }
});

server.listen(port);
