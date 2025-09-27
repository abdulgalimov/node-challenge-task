import { Static, Type } from "@sinclair/typebox";

export const KafkaConfig = Type.Object({
  clientId: Type.String(),
  brokers: Type.Array(Type.String()),
  topicName: Type.String(),
});

export type KafkaConfig = Static<typeof KafkaConfig>;

export const DbConfig = Type.Object({
  connectionUrl: Type.String(),
});

export type DbConfig = Static<typeof DbConfig>;

export const AppConfig = Type.Object({
  port: Type.Number(),
  kafka: KafkaConfig,
  db: DbConfig,
});

export type AppConfig = Static<typeof AppConfig>;
