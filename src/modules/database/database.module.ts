import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChainEntity, TokenEntity } from "./entities";
import { ChainService, TokenService } from "./services";
import { ConfigService } from "@nestjs/config";
import { DbConfig } from "../../types";

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
          entities: [TokenEntity, ChainEntity],
          migrations: [__dirname + "/migrations/*.{js,ts}"],
          migrationsRun: true, // Run migrations automatically
          synchronize: false, // Disabled when using migrations
        };
      },
    }),
    TypeOrmModule.forFeature([TokenEntity, ChainEntity]),
  ],
  providers: [TokenService, ChainService],
  exports: [TokenService, ChainService],
})
@Global()
export class DatabaseModule {}
