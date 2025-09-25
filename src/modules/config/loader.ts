/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppConfig, DbConfig, KafkaConfig } from "../../types";

export function loadKafkaConfig(): KafkaConfig {
  return KafkaConfig.parse({
    clientId: process.env.KAFKA_CLIENT_ID!,
    brokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",")
      : [],
    topicName: process.env.KAFKA_TOPIC_NAME!,
  } satisfies KafkaConfig);
}

export function loadDbConfig(): DbConfig {
  return DbConfig.parse({
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  } satisfies DbConfig);
}

export function loadConfig(): AppConfig {
  return AppConfig.parse({
    kafka: loadKafkaConfig(),
    db: loadDbConfig(),
  } satisfies AppConfig);
}
