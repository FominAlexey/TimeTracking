export default class ContractObject {
  id = null;
  nameContract = null;
  idUser = null;
  startDate = null;
  endDate = null;
  allTimeWork = null;
  allRemainTime = null;
  isCheckManager = null;
  isCheckAdmin = null;
  isPayment = null;
  descriptionContract = null;
  paymentOnHour = null;

  constructor(contract = null) {
    if (contract) {
      this.id = contract.id;
      this.nameContract = contract.nameContract;
      this.idUser = contract.idUser;
      this.startDate = contract.startDate;
      this.endDate = contract.endDate;
      this.allTimeWork = contract.allTimeWork;
      this.allRemainTime = contract.allRemainTime;
      this.isCheckManager = contract.isCheckManager;
      this.isCheckAdmin = contract.isCheckAdmin;
      this.isPayment = contract.isPayment;
      this.descriptionContract = contract.descriptionContract;
      this.paymentOnHour = contract.paymentOnHour;
    }
  }

  toNewContract(userId) {
    return {
      id: this.id,
      nameContract: this.nameContract,
      idUser: userId,
      startDate: this.startDate.toString(),
      endDate: this.endDate.toString(),
      allTimeWork: this.allTimeWork,
      allRemainTime: this.allTimeWork,
      isCheckManager: false,
      isCheckAdmin: false,
      isPayment: false,
      descriptionContract: this.descriptionContract,
      paymentOnHour: this.paymentOnHour,
    };
  }
}
