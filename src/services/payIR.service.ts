import axios from "axios";
import { PaymentI } from "../interfaces";
import config from "../config";

class PayIRService implements PaymentI {
  api: string;
  private sendEndPoint: string;
  private verifyEndPoint: string;

  constructor() {
    this.api = config.PAYIR_TOKEN;
    this.sendEndPoint = "https://pay.ir/pg/send";
    this.verifyEndPoint = "https://pay.ir/pg/verify";
  }

  async send(amount: number, callbackURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof amount !== "number" || amount <= 10000)
        reject({
          message:
            "Transaction's amount must be a number and equal/greater than 10000",
        });
      else if (typeof callbackURL !== "string" || callbackURL.length < 5)
        reject({ message: "Callback (redirect) URL must be a string." });
      else if (callbackURL.slice(0, 4) != "http")
        reject({ message: "Callback URL must start with http/https" });
      axios
        .post(this.sendEndPoint, {
          api: this.api,
          amount,
          redirect: callbackURL,
        })
        .then((data) => {
          {
            resolve({
              ...data.data,
              gatewayUrl: `https://pay.ir/pg/${data.data.token}`,
            });
          }
        })
        .catch((e) => {
          reject(e.response.data);
        });
    });
  }

  async verify(token: string): Promise<any> {
    let bankTransId = (Math.random() + 1).toString(36).substring(1);

    let result = {
      status: 1,
      bankTransId,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(this.verifyEndPoint, { api: this.api, token })
        .then((data) => {
          resolve(result);
        })
        .catch((e) => reject(e));
    });
  }

  async fakeVerify(token: string): Promise<any> {
    let bankTransId = Math.floor(10000000000 + Math.random() * 90000000000);
    let result = {
      status: 1,
      bankTransId,
    };

    return new Promise((resolve, reject) => {
      resolve(result);
    });
  }
}

export default PayIRService;
