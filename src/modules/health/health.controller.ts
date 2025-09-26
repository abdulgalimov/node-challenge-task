import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from "@nestjs/common";
import { HealthService } from "./health.service";
import { ApiResponse } from "@nestjs/swagger";

@Controller("health")
export class HealthController {
  public constructor(
    @Inject(HealthService) private readonly healthService: HealthService
  ) {}

  @Get("live")
  @ApiResponse({
    status: 200,
    description: "Liveness check",
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "ok",
        },
      },
    },
  })
  public liveness() {
    return { status: "ok" };
  }

  @Get("ready")
  @ApiResponse({
    status: 200,
    description: "Readiness check - service is ready",
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "ok",
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: "Readiness check - service not ready",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "error" },
      },
    },
  })
  public async readiness() {
    const isReady = await this.healthService.isReady();

    if (!isReady) {
      throw new ServiceUnavailableException({ status: "error" });
    }

    return { status: "ok" };
  }
}
