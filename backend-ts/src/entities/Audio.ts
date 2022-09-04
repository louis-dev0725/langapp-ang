import { Entity, Column, PrimaryColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Audio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  lang: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'text',
  })
  voice: string;

  @Column({
    type: 'text',
  })
  file: string;

  @Column({
    type: 'timestamp',
    default: '2000-01-01 00:00:00',
  })
  addedDateTime: Date;

  @Column({
    type: 'jsonb',
    default: '{}',
  })
  data: any;
}
