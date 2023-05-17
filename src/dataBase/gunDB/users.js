import { getContracts } from "./contracts";
import Gun from "./index";
import validation from "@/helpers/validation";
export function getUsers() {
  let users = [];
  // Gun.get("DB_Users").get("0").put({
  //   id: 0,
  //   addressWallet: "0xca3ebc3568a171f5a7101b1936fd70fd71398c21",
  //   fullName: "Фомин Алексей Вадимович",
  //   email: "lekha.fomin@test.ru",
  //   numberPhone: "+7-955-666-78-78",
  //   role: "Admin",
  //   startTimeWork:
  //     "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   paymentOnHour: "1000",
  // });

  // Gun.get("DB_Users").get("1").put({
  //   id: 1,
  //   addressWallet: "0xca3ebc3568a171f5a7101b1936fd70fd71398c276",
  //   fullName: "Ивано Сергей Сергеевич",
  //   email: "sergey.fomin@test.ru",
  //   numberPhone: "+7-955-333-78-78",
  //   role: "Admin",
  //   startTimeWork:
  //     "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   paymentOnHour: "1000",
  // });

  Gun.get("DB_Users").map((data) => {
    if (data != null) {
      users.push(data);
    }
  });
  return users;
}

export function getUser(userId) {
  let user;
  Gun.get("DB_Users")
    .get(userId.toString())
    .on((data) => {
      user = data;
    });
  return user;
}

export function putUser(userData) {
  userData = validation(userData);
  if (!userData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Users").get(userData.id.toString()).put({
      id: userData.id,
      addressWallet: userData.addressWallet,
      fullName: userData.fullName,
      email: userData.email,
      numberPhone: userData.numberPhone,
      role: userData.role,
      startTimeWork: userData.startTimeWork,
      paymentOnHour: userData.paymentOnHour,
    });
    return "Данные пользователя обновлены";
  }
}

export function createUser(userData) {
  const users = getUsers();
  userData.id = users.length;
  userData = validation(userData);
  if (!userData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Users").get(users.length.toString()).put({
      id: userData.id,
      addressWallet: userData.addressWallet,
      fullName: userData.fullName,
      email: userData.email,
      numberPhone: userData.numberPhone,
      role: userData.role,
      startTimeWork: userData.startTimeWork,
      paymentOnHour: userData.paymentOnHour,
    });
    return "Пользователь создан";
  }
}

export function deleteUser(userId) {
  Gun.get("DB_Users").get(userId).put(null);
  return "Пользователь удален";
}

export function getUserInContracts(userId) {
  let user = getUser(userId);
  const contracts = getContracts(userId);
  let userInContracts = Object.assign(user, { contracts: contracts });
  return userInContracts;
}
