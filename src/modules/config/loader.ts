/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppConfig, DbConfig, KafkaConfig } from "../../types";
import { Value } from "@sinclair/typebox/value";

export function loadKafkaConfig(): KafkaConfig {
  return Value.Parse(KafkaConfig, {
    clientId: process.env.KAFKA_CLIENT_ID!,
    brokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",")
      : [],
    topicName: process.env.KAFKA_TOPIC_NAME!,
  } satisfies KafkaConfig);
}

export function loadDbConfig(): DbConfig {
  return Value.Parse(DbConfig, {
    connectionUrl: process.env.DATABASE_URL!,
  } satisfies DbConfig);
}

export function loadConfig(): AppConfig {
  return Value.Parse(AppConfig, {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    kafka: loadKafkaConfig(),
    db: loadDbConfig(),
  } satisfies AppConfig);
}
