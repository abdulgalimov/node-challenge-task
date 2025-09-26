import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";

async function bootstrap() {
  const logger = new Logger("Main");
  logger.log("Starting Token Price Service...");

  try {
    const app = await NestFactory.create(AppModule);

    setupGracefulShutdown({ app });

    await app.listen(3000);
    logger.log("Service is running on port 3000");
  } catch (error: unknown) {
    // Bug: Not handling exceptions properly
    logger.error(`Error`, {
      error,
    });
  }
}
bootstrap().catch(console.error);
