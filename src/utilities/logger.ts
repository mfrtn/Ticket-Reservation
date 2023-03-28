import * as fs from "fs";

export function accessLogger(log: string) {
  if (!fs.existsSync(global.__logdir)) {
    fs.mkdirSync(global.__logdir);
  }

  fs.appendFile(global.__logdir + "access.log", log, (err) => {
    if (err) {
      throw err;
    }
  });
}
