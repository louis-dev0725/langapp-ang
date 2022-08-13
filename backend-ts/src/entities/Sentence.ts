import { Entity, Column, PrimaryColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Sentence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  hash: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'jsonb',
    default: '{}',
  })
  translations: Record<string, string>;

  @Column({
    type: 'boolean',
    default: false,
  })
  needTranslation: boolean;
}
