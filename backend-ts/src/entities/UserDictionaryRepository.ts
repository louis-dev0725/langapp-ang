import { EntityRepository, Repository } from 'typeorm';
import { UserDictionary } from './UserDictionary';

@EntityRepository(UserDictionary)
export class UserDictionaryRepository extends Repository<UserDictionary> {}
