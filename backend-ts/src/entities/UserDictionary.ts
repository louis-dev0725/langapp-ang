import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DictionaryType } from './DictionaryWord';

@Entity('user_dictionary', { schema: 'public' })
export class UserDictionary {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('int')
  user_id: number;

  @Column('int')
  type: DictionaryType;

  @Column('int')
  dictionary_word_id: number;

  @Column('character varying')
  original_word: string;

  @Column('character varying')
  translate_word: string;

  @Column('character varying')
  date: string;

  @Column('text')
  context: string;

  @Column('character varying')
  url: string;

  @Column('int')
  success_training: number;

  @Column('int')
  number_training: number;

  @Column('character varying')
  workout_progress_card: string;

  @Column('character varying')
  workout_progress_word_translate: string;

  @Column('int')
  mnemonic_id: number;
}
