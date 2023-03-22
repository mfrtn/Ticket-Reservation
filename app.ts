import { ExpressLoader } from "./src/loaders/";
import { db } from "./src/database";

async function connectionCheck() {
  await db.$connect();
}

(function main() {
  connectionCheck()
    .then(async () => {
      console.log("Database is connected");
      const app = new ExpressLoader();
      app.run();
    })
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
    });
})();
