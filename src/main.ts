import { NestFactory } from "@nestjs/core";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { ConfigService } from "@nestjs/config";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { CommonLogger, createSwagger } from "./utils";

async function bootstrap() {
  const logger = new CommonLogger("bootstrap");
  logger.log("Starting Token Price Service...");

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        logger,
      }
    );

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
