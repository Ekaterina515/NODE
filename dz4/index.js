const fs = require("fs");
const readline = require("readline");
const inquirer = require("inquirer");
const path = require("path");

let fullPath = null;

const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};

const openFile = (fullPath) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Укажите паттерн или строку для поиска совпадений: ",
      function (str) {
        const readStream = fs.createReadStream(fullPath, "utf8");

        readStream.on("data", (chunk) => {
          const regExp = new RegExp(str);

          chunk.split("\n").map((line) => {
            if (line.search(regExp) !== -1) {
              console.log(line);
              fs.writeFile(
                `found_in_file.log`,
                `${line}\n`,
                { flag: "a" },
                (error) => (error ? console.log(error) : null)
              );
            }
          });
        });

        readStream.on("end", () => {
          console.log("File reading finished");
          rl.close();
          resolve();
        });
        readStream.on("error", (error) => {
          console.log(error);
          rl.close();
          reject();
        });
      }
    );
  });
};

const openDirectory = async (fullPath) => {
  const list = fs.readdirSync(fullPath);
  if (list.length === 0) {
    console.log("Папка полностью пуста.");
    process.exit(0);
  }
  await inquirer
    .prompt([
      {
        name: "fileName",
        type: "list",
        message: "Выберите файл или папку:",
        choices: list,
      },
    ])
    .then(async (answer) => {
      const newPath = path.join(fullPath, answer.fileName);
      if (isFile(newPath)) {
        await openFile(newPath);
      } else {
        await openDirectory(newPath);
      }
    });
};

const goToPath = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Укажите путь: ", function (inputedPath) {
      rl.close();
      resolve(path.join(__dirname, inputedPath));
    });
  });
};

const run = async () => {
  fullPath = await goToPath();
  if (isFile(fullPath)) {
    await openFile(fullPath);
  } else {
    await openDirectory(fullPath);
  }
};

run();
