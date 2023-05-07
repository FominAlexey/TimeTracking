const monthTitle = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export default {
  convertDate(d) {
    const date = d.getDate().toString().padStart(2, "0");

    const month = d.getMonth();

    const year = d.getFullYear();

    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    const s = d.getSeconds().toString().padStart(2, "0");

    return `${h}:${m}:${s}, ${date} ${monthTitle[month]} ${year}`;
  },
};
