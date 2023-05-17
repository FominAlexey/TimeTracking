export default function (data) {
  console.log("🚀 ~ file: validation.js:2 ~ data:", data)
  for (let item of Object.values(data)) {
    if (item == undefined || item == null || item === "") {
      return false;
    }
  }
  return data;
}
