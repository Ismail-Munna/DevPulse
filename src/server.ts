import app from "./app";
import config from "./config";
import { initdb } from "./db";

const main = async () => {
  await initdb();

  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();