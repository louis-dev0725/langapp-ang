import { DictionaryType, DictionaryWord } from "./DictionaryWord";
import { JapaneseWordData } from "./JapaneseWordData";

export class JapaneseWord extends DictionaryWord {
    data: JapaneseWordData;

    static sInstance(o : DictionaryWord) : o is JapaneseWord {
        return o.type == DictionaryType.JapaneseWords;
    }
}