import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';
import { DictionaryType, DictionaryWord } from './DictionaryWord';

@Injectable()
export class DictionaryWordRepository extends Repository<DictionaryWord> {
  constructor(dataSource: DataSource) {
    super(DictionaryWord, dataSource.createEntityManager());
  }

  async findByExactQueries(type: DictionaryType, queries: string[]) {
    if (queries.length == 0) {
      return [];
    }
    return await this.createQueryBuilder('words').where('type = :type AND query && ARRAY[:...queries]', { type, queries }).getMany();
  }
}
