import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export type AnyModule = new (...args: unknown[]) => unknown;

export function createSwagger(app: INestApplication, modules: AnyModule[]) {
  const documentBuilder = new DocumentBuilder()
    .setTitle("Token price updater")
    .setVersion("1.0");

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [...modules],
  });

  const path = `swagger`;
  SwaggerModule.setup(path, app, document, {
    customSiteTitle: "Token price updater - Swagger",
    explorer: false,
  });

  return document;
}
