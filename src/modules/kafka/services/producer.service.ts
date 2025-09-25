import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { TokenPriceUpdateMessage } from "../types";
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
    } catch (error) {
      this.logger.error("Error disconnecting from Kafka", error.stack);
    }
  }

  private async connect(): Promise<void> {
    await this.producer.connect();
    this.logger.log("Connected to Kafka");
  }

  async sendPriceUpdateMessage(
    message: TokenPriceUpdateMessage
  ): Promise<void> {
    try {
      // Validate the message with Zod schema
      TokenPriceUpdateMessage.parse(message);

      const value = JSON.stringify(message);

      this.producer.send({
        topic: this.topic,
        messages: [
          {
            key: message.tokenId,
            value,
          },
        ],
      });

      this.logger.log(`Sent message to Kafka: ${value}`);
      return;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
    }
  }
}
