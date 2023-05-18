export default function (data) {
  for (let item of Object.values(data)) {
    if (item == undefined || item == null || item === "") {
      return false;
    }
  }
  return data;
}
