import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { JapaneseKanjiData } from "./JapaneseKanjiData";
import { JapaneseWordData } from "./JapaneseWordData";

export enum DictionaryType {
    JapaneseWords = 1,
    JapaneseKanji = 2,
}

@Index("dictionary_word_pkey", ["id"], { unique: true })
@Index("dictionary_word_pgroonga_index", ["query"], {})
@Entity("dictionary_word", { schema: "public" })
export class DictionaryWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
      type: 'int2',
      default: 0
  })
  type: DictionaryType;

  @Column({
      type: "text",
      array: true,
      default: 'ARRAY[]'
  })
  query: string[];

  @Column({
      type: "jsonb",
      default: '{}'
  })
  data: JapaneseWordData | JapaneseKanjiData;
}
