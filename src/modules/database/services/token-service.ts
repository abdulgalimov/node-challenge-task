import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { TokenEntity } from "../entities";
import { TokenData } from "../../../types";

@Injectable()
export class TokenService {
  public constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>
  ) {}

  public count(): Promise<number> {
    return this.tokenRepository.count();
  }

  public getAll(): Promise<TokenData[]> {
    return this.tokenRepository.find();
  }

  public async createList(dataList: TokenData[]) {
    await this.tokenRepository.save(dataList);
  }

  public async updatePrice(
    id: string,
    price: bigint
  ): Promise<TokenData | null> {
    await this.tokenRepository.update(
      {
        id,
      },
      {
        price,
        lastPriceUpdate: new Date(),
      }
    );

    return await this.tokenRepository.findOne({
      where: {
        id,
      },
    });
  }
}
