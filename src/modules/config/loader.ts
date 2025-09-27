/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Value } from "@sinclair/typebox/value";

import { AppConfig, DbConfig, KafkaConfig, LogConfig } from "./types";

function getNumber<
  D extends number | null,
  R = D extends number ? number : number | null
>(key: string, defaultValue: D): R {
  if (key in process.env) {
    return parseFloat(process.env[key]!) as R;
  }

  return (defaultValue !== null ? defaultValue : null) as R;
}

export function loadKafkaConfig(): KafkaConfig {
  return Value.Parse(KafkaConfig, {
    clientId: process.env.KAFKA_CLIENT_ID!,
    brokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",")
      : [],
    topicName: process.env.KAFKA_TOPIC_NAME!,

    retry: {
      maxRetryTime: getNumber("KAFKA_MAX_RETRY_TIME", 30000),
      initialRetryTime: getNumber("KAFKA_INITIAL_RETRY_TIME", 300),
      factor: getNumber("KAFKA_INITIAL_RETRY_TIME", 0.2),
      multiplier: getNumber("KAFKA_INITIAL_RETRY_TIME", 2),
      retries: getNumber("KAFKA_RETRIES", 5),
    },
  } satisfies KafkaConfig);
}

export function loadDbConfig(): DbConfig {
  return Value.Parse(DbConfig, {
    connectionUrl: process.env.DATABASE_URL!,
  } satisfies DbConfig);
}

export function loadLogConfig(): LogConfig {
  return Value.Parse(LogConfig, {
    level: process.env.LOG_LEVEL!,
    lokiUrl: process.env.LOG_LOKI_URL,
  } satisfies LogConfig);
}

export function loadConfig(): AppConfig {
  return Value.Parse(AppConfig, {
    port: getNumber("PORT", 3000),
    kafka: loadKafkaConfig(),
    db: loadDbConfig(),
    log: loadLogConfig(),
  } satisfies AppConfig);
}
