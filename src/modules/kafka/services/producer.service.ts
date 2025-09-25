import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { Kafka, Message, Producer } from "kafkajs";
import {
  TokenPriceUpdateMessage,
  TokenPriceUpdateMessageCreate,
} from "../types";
import { ConfigService } from "@nestjs/config";
import { KafkaConfig } from "../../../types";

@Injectable()
export class ProducerService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(ProducerService.name);
  private readonly producer: Producer;
  private readonly topic: string;

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

    this.logger.log("Connected to Kafka");
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

    try {
      TokenPriceUpdateMessage.parse(message);

      return {
        key: message.tokenId,
        value: JSON.stringify(message),
      };
    } catch (error: unknown) {
      this.logger.error(`Error parse message`, {
        message,
        error,
      });

      return null;
    }
  }
}
