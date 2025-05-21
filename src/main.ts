(global as any).crypto = require("crypto");

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "fs";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("COCO world API")
    .setDescription("COCO world 백엔드 API 문서입니다.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync("./swaggerFile", JSON.stringify(document, null, 2));
  SwaggerModule.setup("api", app, document);

  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads",
  });

  app.enableCors({
    origin: ["http://localhost:3000", "http://34.236.72.45"],
    credentials: true,
  });

  await app.listen(process.env.PORT!);
}
bootstrap();
