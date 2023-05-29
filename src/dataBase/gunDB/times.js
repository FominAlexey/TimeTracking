import Gun from "./index";
import validation from "@/helpers/validation";

export function getTimes(userId, all = false) {
  let times = [];
  // Gun.get("DB_Times").get("0").put({
  //   id: 0,
  //   idContract: 0,
  //   idUser: 0,
  //   remainTime: 10,
  //   startDate: "Wed May 10 2023 11:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   isCheckManager: true,
  // });

  // Gun.get("DB_Times").get("1").put({
  //   id: 1,
  //   idContract: 1,
  //   idUser: 1,
  //   remainTime: 12,
  //   startDate: "Wed May 20 2023 11:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 20 2023 23:51:34 GMT+0300(Москва, стандартное время)",
  //   isCheckManager: true,
  // });

  Gun.get("DB_Times").map((data) => {
    if (data != null) {
      times.push(data);
    }
  });

  times = [...new Set(times)];

  if (!all) {
    const timesFilter = times.filter((val) => val.idUser == userId);
    return timesFilter;
  }

  return times;
}

export function getTimesInContract(contractId) {
  let times = [];

  Gun.get("DB_Times").map((data) => {
    if (data != null) {
      times.push(data);
    }
  });

  times = [...new Set(times)];

  const timesFilter = times.filter((val) => val.idContract == contractId);
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
    Gun.get("DB_Times").get(timeData.id.toString()).put({
      id: timeData.id,
      idContract: timeData.idContract,
      idUser: timeData.idUser,
      remainTime: timeData.remainTime,
      startDate: timeData.startDate,
      endDate: timeData.endDate,
      isCheckManager: timeData.isCheckManager,
    });
    return "Данные времени обновлены";
  }
}

export function createTime(timeData) {
  const times = getTimes("", true);
  timeData.id = times.length;
  timeData = {
    id: timeData.id,
    idContract: timeData.idContract,
    idUser: timeData.idUser,
    remainTime: 0,
    startDate: timeData.startDate,
    endDate: timeData.endDate,
    isCheckManager: false,
  };
  timeData = validation(timeData);
  if (!timeData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Times").get(timeData.id.toString()).put(timeData);
    return { text: "Добавлено новое, незаконченное время", id: timeData.id};
  }
}
