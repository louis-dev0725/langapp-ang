import { EntityRepository, Repository } from "typeorm";
import { DictionaryType, DictionaryWord } from "./DictionaryWord";

@EntityRepository(DictionaryWord)
export class DictionaryWordRepository extends Repository<DictionaryWord> {
    async findByExactQueries(type: DictionaryType, queries: string[]) {
        if (queries.length == 0) {
            return [];
        }
        return await this.createQueryBuilder("words").where("type = :type AND query && ARRAY[:...queries]", { type, queries }).getMany();
    }
}