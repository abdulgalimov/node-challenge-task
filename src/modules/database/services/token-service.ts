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

  public find(): Promise<TokenData[]> {
    return this.tokenRepository.find();
  }

  public async createList(dataList: TokenData[]) {
    await this.tokenRepository.save(dataList);
  }

  public async create(data: TokenData) {
    await this.tokenRepository.save(data);
  }
}
