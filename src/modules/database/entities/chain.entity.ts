import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChainData } from "../../../types/chain";

@Entity("chains")
export class ChainEntity implements ChainData {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "defi_id", type: "decimal" })
  deId: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "is_enabled", default: true })
  isEnabled: boolean;
}
