import * as dotenv from "dotenv";
dotenv.config();

class Config {
  public PORT: Number;
  public APP_NAME: string;

  constructor() {
    this.APP_NAME = process.env.APP_NAME
      ? process.env.APP_NAME
      : "Starter ExpressTS";
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
  }
}

export default Config;
