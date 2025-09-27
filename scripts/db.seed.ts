import {
  ChainService,
  createDbClient,
  loadDbConfig,
  LogoService,
  TokenService,
  ChainInsert,
  TokenInsert,
} from "../src/modules";
import { ChainNames } from "../src/enums";
import { CommonLogger } from "../src/utils";
import { LogoInfo } from "./types";

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
        address: "address_1",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        isNative: true,
        isProtected: true,
        priority: 1,
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
        address: "address_2",
        symbol: "BTC",
        name: "Bitcoin",
        decimals: 8,
        isNative: true,
        isProtected: true,
        priority: 2,
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
        address: "address_3",
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
        isNative: true,
        isProtected: true,
        priority: 3,
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
    priceId: null,
  };
}

async function seedManyMore() {
  const chain = await chainService.findByName(ChainNames.Ethereum);
  if (!chain) {
    throw new Error("Could not find chain");
  }

  const logo = await logoService.get({
    bigRelativePath: "images/eth_big.png",
    smallRelativePath: "images/eth_small.png",
    thumbRelativePath: "images/eth_thumb.png",
  });

  for (let k = 0; k < 10; k += 1) {
    const tokensInsert: TokenInsert[] = [];
    const count = await tokenService.count();

    for (let i = 0; i < 100_000; i += 1) {
      const index = count + i + 1;

      tokensInsert.push({
        address: `address_${index}`,
        symbol: `ETH${index}`,
        name: `Ethereum_${index}`,
        decimals: 18,
        isNative: true,
        isProtected: true,
        priority: 1,
        chainId: chain.id,
        logoId: logo.id,
      });
    }

    await tokenService.createList(tokensInsert);
  }
}

async function seedData() {
  await seedChains();

  const seedMore = process.argv[2] === "--more";

  if (seedMore) {
    await seedManyMore();
  } else {
    await seedTokens();
  }
}

seedData().catch(console.error);
