import { Optional, Static, Type } from "@sinclair/typebox";

export const KafkaConfig = Type.Object({
  clientId: Type.String(),
  brokers: Type.Array(Type.String()),
  topicName: Type.String(),
  retry: Type.Object({
    maxRetryTime: Type.Number(),
    initialRetryTime: Type.Number(),
    factor: Type.Number(),
    multiplier: Type.Number(),
    retries: Type.Number(),
  }),
});

export type KafkaConfig = Static<typeof KafkaConfig>;

export const DbConfig = Type.Object({
  connectionUrl: Type.String(),
});

export type DbConfig = Static<typeof DbConfig>;

export const LogConfig = Type.Object({
  level: Type.String(),
  lokiUrl: Optional(Type.String()),
});

export type LogConfig = Static<typeof LogConfig>;

export const AppConfig = Type.Object({
  port: Type.Number(),
  kafka: KafkaConfig,
  db: DbConfig,
  log: LogConfig,
});

export type AppConfig = Static<typeof AppConfig>;
