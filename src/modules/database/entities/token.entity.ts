import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TokenData } from "../../../types";

@Entity("tokens")
export class TokenEntity implements TokenData {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "bytea" })
  address: Buffer;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: "smallint", default: 0 })
  decimals: number;

  @Column({ default: false, name: "is_native" })
  isNative: boolean;

  @Column({ type: "uuid", name: "chain_id" })
  chainId: string;

  @Column({ default: false, name: "is_protected" })
  isProtected: boolean;

  @Column({ nullable: true, name: "last_update_author" })
  lastUpdateAuthor: string;

  @Column({ default: 0 })
  priority: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;

  // Denormalized logo data (intentional anti-pattern)
  @Column({ name: "logo_id", type: "uuid" })
  logo_Id: string;

  @Column({ name: "logo_token_id", type: "uuid", nullable: true })
  logo_TokenId: string;

  @Column({ name: "logo_big_relative_path" })
  logo_BigRelativePath: string;

  @Column({ name: "logo_small_relative_path" })
  logo_SmallRelativePath: string;

  @Column({ name: "logo_thumb_relative_path" })
  logo_ThumbRelativePath: string;

  @Column({
    type: "decimal",
    precision: 28,
    scale: 0,
    default: 0,
    transformer: {
      to: (value: bigint) => value.toString(),
      from: (value: string) => BigInt(value),
    },
  })
  price: bigint;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "last_price_update",
  })
  lastPriceUpdate: Date;
}
