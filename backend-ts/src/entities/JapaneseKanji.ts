import { DictionaryType, DictionaryWord } from "./DictionaryWord";
import { JapaneseKanjiData } from "./JapaneseKanjiData";

export class JapaneseKanji extends DictionaryWord {
    data: JapaneseKanjiData;

    static sInstance(o : DictionaryWord) : o is JapaneseKanji {
        return o.type == DictionaryType.JapaneseKanji;
    }
}