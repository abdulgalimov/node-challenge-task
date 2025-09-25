import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TokenPriceUpdateService } from "./services/token-price-update.service";
import { MockPriceService } from "./services/mock-price.service";
import { KafkaProducerService } from "./kafka/kafka-producer.service";
import { TokenSeeder } from "./data/token.seeder";
import { DatabaseModule } from "./modules/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    TokenPriceUpdateService,
    MockPriceService,
    KafkaProducerService,
    TokenSeeder,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly tokenSeeder: TokenSeeder,
    private readonly tokenPriceUpdateService: TokenPriceUpdateService
  ) {}

  async onModuleInit() {
    try {
      // Seed initial data
      await this.tokenSeeder.seed();

      // Start price update service
      this.tokenPriceUpdateService.start();
    } catch (error) {
      console.error("Failed to initialize application:", error);
    }
  }
}
