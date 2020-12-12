import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("dictionary_word_pkey", ["id"], { unique: true })
@Index("dictionary_word_pgroonga_index", ["query"], {})
@Entity("dictionary_word", { schema: "public" })
export class DictionaryWord {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("smallint", { name: "dictionary", default: () => "0" })
  dictionary: number;

  @Column("integer", { name: "idInDictionary", default: () => "0" })
  idInDictionary: number;

  @Column("text", { name: "query", array: true, default: () => "ARRAY[]" })
  query: string[];

  @Column("jsonb", { name: "sourceData", default: {} })
  sourceData: object;
}
