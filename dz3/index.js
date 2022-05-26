//необходимо загрузить файл access.log в данную директорию

const fs = require("fs");

const searchedLogs = ["89.123.1.41", "34.48.240.111"];

const readStream = fs.createReadStream("./access.log", "utf8");
readStream.on("data", (chunk) => {
  searchedLogs.map((log) => {
    chunk.split("\n").map((line) => {
      if (line.indexOf(log) !== -1) {
        console.log(line);

        fs.writeFile(
          `${log}_requests.log`,
          `${line}\n`,
          { flag: "a" },
          (error) => (error ? console.log(error) : null)
        );
      }
    });
  });
});

readStream.on("end", () => console.log("File reading finished"));
readStream.on("error", (error) => console.log(error));
