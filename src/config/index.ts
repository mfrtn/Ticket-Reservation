import * as dotenv from "dotenv";
dotenv.config();

class Config {
  public PORT: Number;
  public APP_NAME: string;
  public PAYIR_TOKEN: string;

  constructor() {
    this.APP_NAME = process.env.APP_NAME
      ? process.env.APP_NAME
      : "Starter ExpressTS";
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
    this.PAYIR_TOKEN = process.env.PAYIR_TOKEN
      ? process.env.PAYIR_TOKEN
      : "test";
  }
}

const config = new Config();

export default config;
