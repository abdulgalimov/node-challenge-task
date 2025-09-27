import * as winston from "winston";
import type * as Transport from "winston-transport";
import LokiTransport from "winston-loki";

import { loadLogConfig } from "../modules";
import { JSONBigIntStringify } from "./json-bigint";

const logConfig = loadLogConfig();

function createLokiTransport() {
  const { lokiUrl, level } = logConfig;

  if (!lokiUrl) {
    throw new Error("Loki config does not exist!");
  }

  return new LokiTransport({
    host: lokiUrl,
    labels: { app: "token-price" },
    json: true,
    interval: 5,
    batching: true,
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  });
}

export class CommonLogger {
  private logger: winston.Logger;

  public constructor(name?: string) {
    const transports: Transport[] = [];

    if (logConfig.lokiUrl) {
      transports.push(createLokiTransport());
    }

    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => {
            const { timestamp, level, service, message, ...otherData } = info;
            const otherStr =
              Object.keys(otherData).length > 0
                ? JSONBigIntStringify(otherData, 2)
                : "";

            const timestampStr = String(timestamp);
            const serviceStr = String(service);
            const messageStr = String(message);

            return `${timestampStr} - [${level}] [${serviceStr}] ${messageStr} ${otherStr}`;
          })
        ),
      })
    );

    this.logger = winston.createLogger({
      level: logConfig.level,
      defaultMeta: { service: name ?? "" },
      transports,
    });
  }

  public log(message: string, meta?: unknown) {
    this.logger.log("debug", message, this.formatMeta(meta));
  }

  public error(message: string, meta?: unknown) {
    this.logger.log("error", message, this.formatMeta(meta));
  }

  public warn(message: string, meta?: unknown) {
    this.logger.log("warn", message, this.formatMeta(meta));
  }

  private formatMeta(meta?: unknown): unknown | undefined {
    if (!meta) {
      return undefined;
    }
    if (typeof meta !== "object") {
      return { meta };
    }

    if (meta instanceof Error) {
      return meta;
    }

    let formattedMeta = meta;
    if ("message" in meta) {
      const { message, ...otherMeta } = meta;
      formattedMeta = { ...otherMeta };
      (formattedMeta as Record<string, unknown>)["@message"] = message;
    }

    const entries = Object.entries(formattedMeta);
    const errorEntry = entries.find(([_k, v]) => v instanceof Error);
    if (!errorEntry) {
      return formattedMeta;
    }
    const error = errorEntry[1] as Record<string, unknown>;

    entries.forEach(([k, v]) => {
      if (v !== error) {
        error[k] = v;
      }
    });

    return error;
  }
}
