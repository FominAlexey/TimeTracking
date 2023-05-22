export default class ContractObject {
  id = null;
  idContract = null;
  idUser = null;
  remainTime = null;
  startDate = null;
  endDate = null;
  urlContract = null;
  isCheckManager = null;

  constructor(time = null) {
    if (time) {
      this.id = time.id;
      this.idContract = time.idContract;
      this.idUser = time.idUser;
      this.remainTime = time.remainTime;
      this.startDate = time.startDate;
      this.endDate = time.endDate;
      this.urlContract = "http://localhost:8080/Contract?idContract=" + this.idContract;
      this.isCheckManager = time.isCheckManager;
    }
  }
}
