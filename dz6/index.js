const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = http.createServer((request, response) => {
  if (request.method === "GET") {
    const filePath = path.join(__dirname, "index.html");
    readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
  } else if (request.method === "POST") {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      response.writeHead(200, { "Content-Type": "json" });
      response.end(data);
    });
  } else {
    response.statusCode = 405;
    response.end();
  }
});

let countUsers = 0;

const io = new Server(app);

io.on("connection", function (client) {
  const userName = `User[${crypto
    .randomBytes(new Date().getSeconds() * new Date().getMinutes())
    .toString("hex")
    .slice(0, 3)}]`;
  countUsers++;

  client.on("disconnect", () => {
    io.sockets.emit("SERVER_MSG", () => {
      countUsers--;
      return {
        msg: `${userName}: has been disconnected.`,
        countUsers: countUsers,
      };
    });
  });

  client.emit("SERVER_MSG", {
    msg: "You have successfully logged in to the chat",
    countUsers: countUsers,
  });

  client.broadcast.emit("SERVER_MSG", {
    msg: `${userName}: has been connected.`,
    countUsers: countUsers,
  });

  client.on("CLIENT_MSG", (data) => {
    io.sockets.emit("SERVER_MSG", {
      msg: `${userName}: ${data.msg}`,
      countUsers: countUsers,
    });
  });
});

app.listen(4000, "localhost");
