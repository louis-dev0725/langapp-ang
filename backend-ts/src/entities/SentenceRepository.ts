import { EntityRepository, Repository } from 'typeorm';
import { Sentence } from './Sentence';

@EntityRepository(Sentence)
export class SentenceRepository extends Repository<Sentence> {}
