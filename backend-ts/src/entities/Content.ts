import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("content_pkey", ["id"], { unique: true })
@Entity("content", { schema: "public" })
export class Content {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("smallint", { name: "type" })
  type: number;

  @Column("character varying", {
    name: "sourceLink",
    nullable: true,
    length: 255,
  })
  sourceLink: string | null;

  @Column("text", { name: "text" })
  text: string;

  @Column("smallint", { name: "status", default: () => "0" })
  status: number;

  @Column("integer", { name: "length" })
  length: number;

  @Column("smallint", { name: "level" })
  level: number;

  @Column("smallint", { name: "deleted", default: () => "0" })
  deleted: number;

  @Column("jsonb", { name: "tagsJson", default: {} })
  tagsJson: object;

  @Column("jsonb", { name: "dataJson", default: {} })
  dataJson: any;

  @Column("character varying", {
    name: "format",
    length: 255,
    default: () => "'text'",
  })
  format: string;

  @Column("text", { name: "cleanText", nullable: true })
  cleanText: string | null;
}
