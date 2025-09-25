import { z } from "zod";

export const KafkaConfig = z.object({
  clientId: z.string(),
  brokers: z.array(z.string()),
  topicName: z.string(),
});

export type KafkaConfig = z.infer<typeof KafkaConfig>;

export const DbConfig = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

export type DbConfig = z.infer<typeof DbConfig>;

export const AppConfig = z.object({
  kafka: KafkaConfig,
  db: DbConfig,
});

export type AppConfig = z.infer<typeof AppConfig>;
