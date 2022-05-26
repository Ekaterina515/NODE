// Отсчёт даты идёт НЕ в режиме реального времени,
// время нарочно ускорено, чтобы более наглядно увидеть
// работу программы.

const EventEmitter = require("events");

const eventEmitter = new EventEmitter();
const arguments = process.argv.slice(2);
let dates = {};

eventEmitter.on("end", console.log);

setInterval(() => {
  const newDates = {};

  Object.keys(dates).map((date) => {
    const ms = dates[date] - 1000 * 60 * 60;
    let text = `Дата ${date} наступила.`;

    if (ms) {
      newDates[date] = ms;
      text = `[${date}] ${msToDate(ms)}`;
    }

    eventEmitter.emit("end", text);
  });

  dates = newDates;
}, 1000);

const msToDate = (ms) => {
  const hour = 1000 * 60 * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  const years = Math.floor(ms / year);
  ms -= years * year;
  const months = Math.floor(ms / month);
  ms -= months * month;
  const days = Math.floor(ms / day);
  ms -= days * day;
  const hours = Math.floor(ms / hour);

  return `\nЧасов:   | ${hours}\nДней:    | ${days}\nМесяцев: | ${months}\nЛет:     | ${years}`;
};

for (const argument of arguments) {
  const date = argument.split("-");

  const countDate = new Date(Date.UTC(date[3], date[2] - 1, date[1], date[0]));
  const now = new Date();
  const nowUTC = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours()
  );

  const ms = countDate - nowUTC;
  console.log(countDate.toISOString());
  const formattedDate = countDate
    .toISOString()
    .replace("T", " ")
    .replace("Z", "")
    .replace(".000", "");
  dates[formattedDate] = ms;
}
