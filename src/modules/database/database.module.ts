import { Global, Module, OnApplicationShutdown } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChainEntity, TokenEntity } from "./entities";
import { ChainService, TokenService } from "./services";
import { ConfigService } from "@nestjs/config";
import { DbConfig } from "../../types";
import { DataSource } from "typeorm";

const entities = [TokenEntity, ChainEntity];

const services = [TokenService, ChainService];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const dbConfig = configService.getOrThrow<DbConfig>("db");
        const { host, port, username, password, database } = dbConfig;

        return {
          type: "postgres",
          host,
          port,
          username,
          password,
          database,
          entities,
          migrations: [__dirname + "/migrations/*.{js,ts}"],
          migrationsRun: true, // Run migrations automatically
          synchronize: false, // Disabled when using migrations
        };
      },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...services],
  exports: [...services],
})
@Global()
export class DatabaseModule implements OnApplicationShutdown {
  constructor(private dataSource: DataSource) {} // Inject DataSource

  async onApplicationShutdown() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
