import { config } from "dotenv";
import { createApp } from "./utils/createApp";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing";

import "./database/index";
import routes from "./routes";

import chalk from "chalk";
import services from "./services";

config();

const PORT = process.env.PORT || 8008;

async function main() {
  try {
    const app = createApp();

    const date = new Date();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const milliseconds = date.getMilliseconds();

    app.listen(PORT, () =>
      console.log(
        `${chalk.gray(`${hours}:${minutes}:${milliseconds}`)} ${chalk.blue(
          "INFO"
        )} ${chalk.gray(
          "root:index.ts"
        )} Listening to requests on port: ${PORT}`
      )
    );

    app.use("/", routes);

    app.use(
      "/api/uploadthing",
      createUploadthingExpressHandler({
        router: uploadRouter,
      })
    );

    services();
  } catch (err) {
    console.error(err);
  }
}

main();
