import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying')
  name: string;

  @Column('character varying')
  company: string;

  @Column('character varying')
  telephone: string;

  @Column('character varying')
  email: string;

  @Column('character varying')
  passwordHash: string;

  @Column('character varying')
  balance: string;

  @Column('character varying')
  balancePartner: string;

  @Column('character varying')
  paidUntilDateTime: string;

  @Column('character varying')
  registerIp: string;

  @Column('character varying')
  lastLoginIp: string;

  @Column('character varying')
  updatedDateTime: string;

  @Column('text')
  comment: string;

  @Column('character varying')
  resetPasswordToken: string;

  @Column('character varying')
  passwordChangedDateTime: string;

  @Column('smallint')
  isServicePaused: number;

  @Column('int')
  invitedByUserId: number;

  @Column('smallint')
  isPartner: number;

  @Column('smallint')
  enablePartnerPayments: number;

  @Column('character varying')
  partnerPercent: string;

  @Column('character varying')
  partnerEarned: string;

  @Column('character varying')
  wmr: string;

  @Column('jsonb', { name: 'dataJson', default: {} })
  dataJson: any;

  @Column('character varying')
  timezone: string;

  @Column('character varying')
  language: string;

  @Column('character varying')
  currency: string;

  @Column('character varying')
  frozeEnablePartnerPayments: string;

  @Column('character varying')
  languages: string[];
}
