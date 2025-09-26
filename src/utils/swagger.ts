import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HealthModule } from "../modules";
import { INestApplication } from "@nestjs/common";

export function createSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle("Token price updater")
    .setVersion("1.0");

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [HealthModule],
  });

  const path = `swagger`;
  SwaggerModule.setup(path, app, document, {
    customSiteTitle: "Token price updater - Swagger",
    explorer: false,
  });

  return document;
}
