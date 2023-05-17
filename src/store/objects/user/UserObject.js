export default class UserObject {
  id = null;
  addressWallet = null;
  fullName = null;
  email = null;
  role = null;
  numberPhone = null;
  startTimeWork = null;
  paymentOnHour = null;

  constructor(user = null) {
    if (user) {
      this.id = user.id;
      this.addressWallet = user.addressWallet;
      this.fullName = user.fullName;
      this.email = user.email;
      this.role = user.role;
      this.numberPhone = user.numberPhone;
      this.startTimeWork = user.startTimeWork;
      this.paymentOnHour = user.paymentOnHour;
    }
  }

  toNewUser() {
    return {
      id: this.id,
      addressWallet: this.addressWallet,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      numberPhone: this.numberPhone,
      startTimeWork: new Date().toString(),
      paymentOnHour: this.paymentOnHour,
    };
  }

  toRequest() {
    return {
      id: this.id,
      addressWallet: this.addressWallet,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      numberPhone: this.numberPhone,
      startTimeWork: this.startTimeWork,
      paymentOnHour: this.paymentOnHour,
    };
  }

  toDummyResponse() {
    return {
      id: this.id,
      addressWallet: this.addressWallet,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      numberPhone: this.numberPhone,
      startTimeWork: this.startTimeWork,
      paymentOnHour: this.paymentOnHour,
    };
  }
}
