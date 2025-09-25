import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenEntity } from "./entities";
import { TokenService } from "./services";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "tokens",
      entities: [TokenEntity],
      migrations: [__dirname + "/migrations/*.{js,ts}"],
      migrationsRun: true, // Run migrations automatically
      synchronize: false, // Disabled when using migrations
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
@Global()
export class DatabaseModule {}
