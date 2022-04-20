//Напишите программу для вывода в консоль простых чисел, чтобы они попадали в указанный
//диапазон включительно. При этом числа должны окрашиваться в цвета по принципу светофора:
//● первое число выводится зелёным цветом;
//● второе — жёлтым;
//● третье — красным.

//1. Если простых чисел в диапазоне нет, нужно, чтобы программа сообщила об этом в терминале красным цветом.

//2. Если аргумент, переданный при запуске, не считается числом — сообщите об этом ошибкой и завершите программу.

const colors = require("colors/safe");

let count = 1;
const from = Number(process.argv[2]);
const to = Number(process.argv[3]);
let primeNumbers = [];

if (isNaN(from) || isNaN(to)) {
  throw new Error("Введите число");
}

const isPrime = (number) => {
  if (number < 2) return false;

  for (let i = 2; i <= number / 2; i++) {
    if (number % i === 0) return false;
  }
  return true;
};

for (let number = from; number <= to; number++) {
  let colorer = colors.green;

  if (!isPrime(number)) {
    continue;
  }

  primeNumbers.push(number);
  if (count % 2 === 0) {
    colorer = colors.yellow;
    count += 1;
  } else if (count % 3 === 0) {
    colorer = colors.red;
    count = 1;
  } else {
    count += 1;
  }
  console.log(colorer(number));
}

if (primeNumbers.length === 0) {
  console.log(colors.red("Простых чисел не найдено!"));
}
