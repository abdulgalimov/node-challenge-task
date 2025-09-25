import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChainData } from "../../../types";

@Entity("chains")
export class ChainEntity implements ChainData {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "defi_id", type: "decimal" })
  defiId!: number;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "is_enabled", default: true })
  isEnabled!: boolean;
}
