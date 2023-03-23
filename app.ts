import { ExpressLoader } from "./src/loaders/";
import { db } from "./src/database";

global.__basedir = process.cwd() + "/public/images/";

async function connectionCheck(): Promise<void> {
  await db.$connect();
}

(function main(): void {
  connectionCheck()
    .then(async (): Promise<void> => {
      console.log("Database is connected");
      const app = new ExpressLoader();
      app.run();
    })
    .catch(async (e): Promise<void> => {
      console.error(e);
      await db.$disconnect();
    });
})();
