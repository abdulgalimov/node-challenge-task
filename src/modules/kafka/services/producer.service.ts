import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { Kafka, Message, Producer } from "kafkajs";
import { ConfigService } from "@nestjs/config";
import { Value } from "@sinclair/typebox/value";

import {
  TokenPriceUpdateMessage,
  TokenPriceUpdateMessageCreate,
} from "../types";
import { CommonLogger } from "../../../utils";
import { KafkaConfig } from "../../config";

@Injectable()
export class ProducerService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new CommonLogger(ProducerService.name);
  private readonly producer: Producer;
  private readonly topic: string;

  private isConnected = false;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const kafkaConfig = configService.getOrThrow<KafkaConfig>("kafka");
    const { clientId, brokers, topicName } = kafkaConfig;

    const kafka = new Kafka({
      clientId,
      brokers,
    });

    this.producer = kafka.producer();
    this.topic = topicName;
  }

  public async onApplicationBootstrap() {
    await this.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    try {
      this.isConnected = false;

      await this.producer.disconnect();

      this.logger.log("Disconnected from Kafka");
    } catch (error: unknown) {
      this.logger.error("Error disconnecting from Kafka", {
        error,
      });
    }
  }

  private async connect(): Promise<void> {
    await this.producer.connect();

    this.isConnected = true;

    this.logger.log("Connected to Kafka");
  }

  public isReady() {
    return this.isConnected;
  }

  public async sendBatch(messages: TokenPriceUpdateMessageCreate[]) {
    const now = new Date();

    const topicMessages = messages
      .map((message) => this.parseMessage(message, now))
      .filter((m) => m !== null);

    await this.producer.sendBatch({
      topicMessages: [
        {
          topic: this.topic,
          messages: topicMessages,
        },
      ],
    });
  }

  private parseMessage(
    createMessage: TokenPriceUpdateMessageCreate,
    timestamp: Date
  ): Message | null {
    const message: TokenPriceUpdateMessage = {
      ...createMessage,
      timestamp,
    };

    Value.Parse(TokenPriceUpdateMessage, message);

    return {
      key: message.tokenId,
      value: JSON.stringify(message),
    };
  }
}
