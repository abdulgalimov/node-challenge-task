import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { CommonLogger, createSwagger } from "./utils";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const logger = new CommonLogger("bootstrap");
  logger.log("Starting Token Price Service...");

  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });
    const configService = app.get(ConfigService);

    createSwagger(app);

    const port = configService.getOrThrow<number>("port");

    setupGracefulShutdown({ app });

    await app.listen(port);

    logger.log(`Service is running on port ${port}`);
  } catch (error: unknown) {
    // Bug: Not handling exceptions properly
    logger.error(`bootstrap error`, {
      error,
    });
  }
}
bootstrap().catch(console.error);
