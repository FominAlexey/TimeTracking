import Gun from "./index";
import validation from "@/helpers/validation";

export function getTimes(userId) {
  let times = [];
  // Gun.get("DB_Times").get("0").put({
  //   id: 0,
  //   idUser: 0,
  //   idContract: 0,
  //   remainTime: "10",
  //   startDate: "Wed May 20 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   isCheckManager: true,
  // });

  // Gun.get("DB_Times").get("1").put({
  //   id: 1,
  //   idUser: 1,
  //   idContract: 1,
  //   remainTime: "8",
  //   startDate: "Wed May 20 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   isCheckManager: true,
  // });

  Gun.get("DB_Times").map((data) => {
    if (data != null) {
      times.push(data);
    }
  });

  times = [...new Set(times)];

  const timesFilter = times.filter((val) => {
    return val.idUser == userId;
  });

  return timesFilter;
}

export function getTime(timeId) {
  let time;
  Gun.get("DB_Times")
    .get(timeId.toString())
    .on((data) => {
      time = data;
    });
  return time;
}

export function putTime(timeData) {
  timeData = validation(timeData);
  if (!timeData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Contract").get(timeData.id.toString()).put({
      id: timeData.id,
      idContract: timeData.idContract,
      remainTime: timeData.RemainTime,
      startDate: timeData.startDate,
      endDate: timeData.endDate,
      isCheckManager: timeData.isCheckManager,
    });
    return "Данные времени обновлены";
  }
}
