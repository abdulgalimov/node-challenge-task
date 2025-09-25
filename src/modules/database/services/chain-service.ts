import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ChainEntity } from "../entities";
import { ChainData } from "../../../types";

@Injectable()
export class ChainService {
  public constructor(
    @InjectRepository(ChainEntity)
    private readonly tokenRepository: Repository<ChainEntity>
  ) {}

  public async createList(dataList: ChainData[]) {
    await this.tokenRepository.save(dataList);
  }
}
