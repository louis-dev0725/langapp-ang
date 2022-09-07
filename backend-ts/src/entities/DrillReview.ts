import { Drill } from 'src/drills/drills.interfaces';
import { Entity, Column, PrimaryColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class DrillReview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
  })
  userWordId: number;

  @Column({
    type: 'timestamptz',
  })
  date: Date;

  @Column({
    type: 'int4',
  })
  answer: number = 0;

  @Column({
    type: 'int4',
  })
  oldInterval: number = 0;

  @Column({
    type: 'float4',
  })
  oldEaseFactor: number = 0;

  @Column({
    type: 'int4',
  })
  newInterval: number = 0;

  @Column({
    type: 'float4',
  })
  newEaseFactor: number = 0;

  @Column({
    type: 'jsonb',
  })
  drills: Drill[] = [];
}
