import * as express from "express";

import config from "../config";
import apiRouter from "../routes";
import { errorHandler, logRequest } from "../middlewares";

const router = express.Router();

class ExpressLoader {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    // this.app.use("/api", router);

    apiRouter(this.app);

    this.app.use(errorHandler);

    this.app.use(logRequest);
    this.app.use(this.pathNotFound);
  }

  pathNotFound(req: express.Request, res: express.Response): express.Response {
    return res.status(404).json({
      error: {
        status: true,
        code: 404,
        message: "This API path deos not exist",
      },
    });
  }

  run(): void {
    this.app.listen(config.PORT, () => {
      console.log(
        `${config.APP_NAME} app server is running on port ${config.PORT}`
      );
    });
  }
}

export default ExpressLoader;
