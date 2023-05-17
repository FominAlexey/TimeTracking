import Gun from "./index";
//import validation from "@/helpers/validation";

export function getContracts(userId) {
  let contracts = [];
  // Gun.get("DB_Contracts").get("0").put({
  //   id: 0,
  //   nameContract: "Проверка",
  //   idUser: "0",
  //   startDate:
  //     "Wed May 20 2023 21: 51: 34 GMT + 0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21: 51: 34 GMT + 0300(Москва, стандартное время)",
  //   allTimeWork: "100",
  //   allRemainTime: "50",
  //   isCheckManager: false,
  //   isCheckAdmin: false,
  //   isPayment: false,
  //   descriptionContract: "Проверка контрактов",
  //   paymentOnHour: "700",
  // });

  // Gun.get("DB_Contracts").get("1").put({
  //   id: 1,
  //   nameContract: "Проверка",
  //   idUser: "1",
  //   startDate:
  //     "Wed May 20 2023 21: 51: 34 GMT + 0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21: 51: 34 GMT + 0300(Москва, стандартное время)",
  //   allTimeWork: "100",
  //   allRemainTime: "50",
  //   isCheckManager: false,
  //   isCheckAdmin: false,
  //   isPayment: false,
  //   descriptionContract: "Проверка контрактов",
  //   paymentOnHour: "700",
  // });

  Gun.get("DB_Contracts").map((data) => {
    if (data != null) {
      contracts.push(data);
    }
  });

  const contractsFilter = contracts.filter((val) => {
    return val.idUser == userId;
  });

  return contractsFilter;
}
