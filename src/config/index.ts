import * as dotenv from "dotenv";
dotenv.config();

class Config {
  public PORT: Number;
  public APP_NAME: string;
  public PAYIR_TOKEN: string;
  public QUERY_EXPIRE_TIME: number;
  public ORDER_CANCEL_PERIOD: number;
  public TICKET_REMAINING_TIME: number;

  constructor() {
    this.APP_NAME = process.env.APP_NAME
      ? process.env.APP_NAME
      : "Starter ExpressTS";
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
    this.PAYIR_TOKEN = process.env.PAYIR_TOKEN
      ? process.env.PAYIR_TOKEN
      : "test";
    this.QUERY_EXPIRE_TIME = process.env.QUERY_EXPIRE_TIME
      ? parseInt(process.env.QUERY_EXPIRE_TIME)
      : 300;
    this.ORDER_CANCEL_PERIOD = process.env.ORDER_CANCEL_PERIOD
      ? parseInt(process.env.ORDER_CANCEL_PERIOD)
      : 3600;
    this.TICKET_REMAINING_TIME = process.env.TICKET_REMAINING_TIME
      ? parseInt(process.env.TICKET_REMAINING_TIME)
      : 3600;
  }
}

const config = new Config();

export default config;
