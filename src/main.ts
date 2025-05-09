(global as any).crypto = require("crypto");

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads",
  });

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://tunnel.botpress.cloud/9ff7cc14-b8ca-419b-a08a-bea289e8a7be",
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT!);
}
bootstrap();
