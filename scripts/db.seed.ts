import { createDbClient } from "../src/modules";
import {
  ChainService,
  loadDbConfig,
  LogoService,
  TokenService,
} from "../src/modules";
import { ChainInsert, TokenInsert } from "../src/modules/db/entities";
import { ChainNames, LogoInfo } from "../src/types";
import { CommonLogger } from "../src/utils";

const logger = new CommonLogger("db:seed");

const dbConfig = loadDbConfig();

const drizzleClient = createDbClient(dbConfig);

const chainService = new ChainService(drizzleClient);
const tokenService = new TokenService(drizzleClient);
const logoService = new LogoService(drizzleClient);

async function seedChains(): Promise<void> {
  const count = await chainService.count();
  if (count > 0) {
    logger.log("Chains data already seeded, skipping...");
    return;
  }

  logger.log("Seeding chains data...");

  const chainEthereum: ChainInsert = {
    name: "Ethereum",
    isEnabled: true,
  };
  const chainBitcoin: ChainInsert = {
    name: "Bitcoin",
    isEnabled: true,
  };
  const chainSolana: ChainInsert = {
    name: "Solana",
    isEnabled: true,
  };
  const chains = [chainEthereum, chainBitcoin, chainSolana];

  await chainService.createList(chains);

  logger.log("Seeding chains data complete...");
}

async function seedTokens() {
  const count = await tokenService.count();
  if (count > 0) {
    logger.log("Tokens data already seeded, skipping...");
    return;
  }

  logger.log("Seeding tokens data...");

  const [ethereumChain, bitcoinChain, solanaChain] = await Promise.all([
    chainService.findByName(ChainNames.Ethereum),
    chainService.findByName(ChainNames.Bitcoin),
    chainService.findByName(ChainNames.Solana),
  ]);
  if (!ethereumChain || !bitcoinChain || !solanaChain) {
    throw new Error("Could not find chain");
  }

  const tokenDataList = await Promise.all([
    createTokenInsert(
      {
        address: "111",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        isNative: true,
        isProtected: true,
        lastUpdateAuthor: "Seeder",
        priority: 1,
        price: 300000n,
        lastPriceUpdate: new Date(),
      },
      ChainNames.Ethereum,
      {
        bigRelativePath: "images/eth_big.png",
        smallRelativePath: "images/eth_small.png",
        thumbRelativePath: "images/eth_thumb.png",
      }
    ),
    createTokenInsert(
      {
        address: "222",
        symbol: "BTC",
        name: "Bitcoin",
        decimals: 8,
        isNative: true,
        isProtected: true,
        lastUpdateAuthor: "Seeder",
        priority: 2,
        price: 4500000n,
        lastPriceUpdate: new Date(),
      },
      ChainNames.Bitcoin,
      {
        bigRelativePath: "images/btc_big.png",
        smallRelativePath: "images/btc_small.png",
        thumbRelativePath: "images/btc_thumb.png",
      }
    ),
    createTokenInsert(
      {
        address: "333",
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
        isNative: true,
        isProtected: true,
        lastUpdateAuthor: "Seeder",
        priority: 3,
        price: 15000n,
        lastPriceUpdate: new Date(),
      },
      ChainNames.Solana,
      {
        bigRelativePath: "images/sol_big.png",
        smallRelativePath: "images/sol_small.png",
        thumbRelativePath: "images/sol_thumb.png",
      }
    ),
  ]);

  await tokenService.createList(tokenDataList);
}

async function createTokenInsert(
  data: Omit<TokenInsert, "chainId" | "logoId">,
  chainName: ChainNames,
  logoInfo: LogoInfo
): Promise<TokenInsert> {
  const chain = await chainService.findByName(chainName);
  if (!chain) {
    throw new Error("Could not find chain");
  }

  const logo = await logoService.get(logoInfo);

  return {
    ...data,
    chainId: chain.id,
    logoId: logo.id,
  };
}

async function seedData() {
  await seedChains();

  await seedTokens();
}

seedData().catch(console.error);
