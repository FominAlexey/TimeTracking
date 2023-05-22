import Gun from "./index";
import validation from "@/helpers/validation";

export function getContracts(userId, all = false) {
  let contracts = [];
  // Gun.get("DB_Contracts").get("0").put({
  //   id: 0,
  //   nameContract: "Проверка",
  //   idUser: "0",
  //   startDate: "Wed May 20 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   allTimeWork: "100",
  //   allRemainTime: "50",
  //   isCheckManager: true,
  //   isCheckAdmin: false,
  //   isPayment: false,
  //   descriptionContract: "Проверка контрактов",
  //   paymentOnHour: "700",
  // });

  // Gun.get("DB_Contracts").get("1").put({
  //   id: 1,
  //   nameContract: "Проверка",
  //   idUser: "1",
  //   startDate: "Wed May 20 2023 21:51:34 GMT+0300(Москва, стандартное время)",
  //   endDate: "Wed May 10 2023 21:51:34 GMT+0300(Москва, стандартное время)",
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

  contracts = [...new Set(contracts)];
  if (!all) {
    const contractsFilter = contracts.filter((val) => val.idUser == userId);
    return contractsFilter;
  }
  return contracts
}

export function getContract(contractId) {
  let contract;
  Gun.get("DB_Contracts")
    .get(contractId.toString())
    .on((data) => {
      contract = data;
    });
  return contract;
}

export function putContract(contractData) {
  contractData = validation(contractData);
  if (!contractData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Contracts").get(contractData.id.toString()).put({
      id: contractData.id,
      nameContract: contractData.nameContract,
      idUser: contractData.idUser,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      allTimeWork: contractData.allTimeWork,
      allRemainTime: contractData.allRemainTime,
      isCheckManager: contractData.isCheckManager,
      isCheckAdmin: contractData.isCheckAdmin,
      isPayment: contractData.isPayment,
      descriptionContract: contractData.descriptionContract,
      paymentOnHour: contractData.paymentOnHour,
    });
    return "Данные контракта обновлены";
  }
}

export function createContract(contractData) {
  const contracts = getContracts('', true);
  contractData.id = contracts.length;
  contractData = validation(contractData);
  if (!contractData) {
    return "Ошибка. Не все поля заполнены";
  } else {
    Gun.get("DB_Contracts").get(contractData.id.toString()).put({
      id: contractData.id,
      nameContract: contractData.nameContract,
      idUser: contractData.idUser,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      allTimeWork: contractData.allTimeWork,
      allRemainTime: contractData.allRemainTime,
      isCheckManager: contractData.isCheckManager,
      isCheckAdmin: contractData.isCheckAdmin,
      isPayment: contractData.isPayment,
      descriptionContract: contractData.descriptionContract,
      paymentOnHour: contractData.paymentOnHour,
    });
    return "Контракт добавлен";
  }
}
