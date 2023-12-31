import { Injectable, Logger } from '@nestjs/common';
import { DictionaryType, DictionaryWord } from 'src/entities/DictionaryWord';
import { DictionaryWordRepository } from 'src/entities/DictionaryWordRepository';
import { JapaneseKanji } from 'src/entities/JapaneseKanji';
import { JapaneseWord } from 'src/entities/JapaneseWord';
import { Furigana, Meaning as JapaneseWordMeaning, Reading as JapaneseWordReading } from 'src/entities/JapaneseWordData';
import { Meaning as JapaneseKanjiMeaning, Reading as JapaneseKanjiReading } from 'src/entities/JapaneseKanjiData';
import { User } from 'src/entities/User';
import { convertHiraganaToKatakana, convertKatakanaToHiragana, extractKanji } from 'src/japanese.utils';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { Drill, KanjiInfoCard, TrainingAnswer, TrainingCards, TrainingExampleSentence, TrainingMeaning, TrainingQuestionCard, WordInfoCard } from './drills.interfaces';
import { encode as htmlEncode } from 'html-entities';
import { UserDictionary } from 'src/entities/UserDictionary';
import { add, Dictionary, keyBy, max, orderBy, sample, shuffle, uniq } from 'lodash';
import { Sentence } from 'src/entities/Sentence';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DrillsGenerator {
  private readonly logger = new Logger(DrillsGenerator.name, { timestamp: true });

  user: User;
  userWords: UserDictionary[];
  words: JapaneseWord[];
  static additionalWords: JapaneseWord[];

  exampleWordsArray: JapaneseWord[];
  exampleWords: Dictionary<JapaneseWord>;
  cards: TrainingCards = {};
  drills: Drill[] = [];

  userKanjis: UserDictionary[];
  kanjis: JapaneseKanji[];
  exampleSentences: Dictionary<Sentence>;

  isTestMode = true;

  constructor(
    @InjectRepository(UserDictionary)
    private userDictionaryRepository: Repository<UserDictionary>,
    private dictionaryWordRepository: DictionaryWordRepository,
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {
    this.loadAdditionalWords();
  }

  async loadAdditionalWords() {
    if (!DrillsGenerator.additionalWords) {
      this.logger.log('Load additional words');
      DrillsGenerator.additionalWords = <JapaneseWord[]>await this.dictionaryWordRepository.createQueryBuilder().where(`"type" = 1 and (data->>'frequencyRank')::float < 14 and (data->>'frequencyRank')::float > 13`).getMany();
      this.logger.log('Loaded additional words');
    }
  }

  async prepareForUser(user: User) {
    await this.loadAdditionalWords();

    this.user = user;
  }

  async getOne(cardId: string) {
    let [cardType, wordId] = cardId.split('_', 2);

    if (!cardType || ['wordInfo', 'kanjiInfo'].indexOf(cardType) === -1 || !wordId) {
      throw new Error('Wrong cardId.');
    }

    const word = await this.dictionaryWordRepository.findOne({ where: { id: Number(wordId) } });
    let kanjis: JapaneseKanji[];

    if (cardType == 'wordInfo') {
      const extractedKanji = extractKanji(word.data?.readings?.[0]?.kanji);
      this.words = [<JapaneseWord>word];
      this.kanjis = <JapaneseKanji[]>await this.dictionaryWordRepository.findByExactQueries(DictionaryType.JapaneseKanji, extractedKanji);
      kanjis = extractedKanji.map((extractedKanji) => this.kanjis.find((k) => k.query[0] == extractedKanji));
    } else if (cardType == 'kanjiInfo') {
      this.words = [];
      this.kanjis = [<JapaneseKanji>word];
    }

    let exampleWordIds = this.kanjis.map((k) => k.data.readings.map((r) => r.exampleWords.map((w) => w.wordId))).flat(2);
    this.exampleWordsArray = <JapaneseWord[]>await this.dictionaryWordRepository.findByIds(exampleWordIds);
    this.exampleWords = keyBy(this.exampleWordsArray, (w) => w.id);

    await this.loadSentences();

    if (cardType == 'wordInfo') {
      return this.generateWordInfo(<JapaneseWord>word, null, kanjis);
    } else if (cardType == 'kanjiInfo') {
      return this.generateKanjiInfo(<JapaneseKanji>word, null);
    }
  }

  async getList() {
    await this.loadWords();

    if (this.userWords.length == 0) {
      return { cards: {}, drills: [] };
    }

    await this.loadKanji();
    await this.loadSentences();

    for (const userWord of this.userWords) {
      const currentWord = this.words.find((w) => w.id == userWord.dictionary_word_id);
      if (!currentWord) {
        console.log(`Skip user word #${userWord.id}: no word in dictionary with such id`);
        continue;
      }
      const currentExtractedKanji = extractKanji(userWord.original_word);
      const currentUserKanjis = currentExtractedKanji.map((extractedKanji) => this.userKanjis.find((k) => k.original_word == extractedKanji));
      if (uniq(currentExtractedKanji).length != currentUserKanjis.length) {
        console.log(`Skip user word #${userWord.id}: unable to find all kanji (currentExtractedKanji.length != currentUserKanjis.length)`);
        continue;
      }

      const currentKanjis = currentExtractedKanji.map((extractedKanji) => this.kanjis.find((k) => k.query[0] == extractedKanji)); // filter inside map to save sorting

      if (this.isTestMode) {
        // this.addToCards(this.generateSelectWordForSentence(currentWord, userWord, this.formatExampleSentencesForWord(currentWord)[1]));
        // continue;
      }

      for (const [i, userKanji] of currentUserKanjis.entries()) {
        const currentKanji = currentKanjis[i];
        if (!currentKanji) {
          console.log(`Skip user kanji ${userKanji.id}: no kanji in dictionary with such id`);
          continue;
        }

        if (this.addToCards(this.generateKanjiInfo(currentKanji, userKanji), null, 0)) {
          for (const [fI, fV] of currentWord.data.readings[0].furigana.entries()) {
            if (fV.ruby == currentKanji.query[0]) {
              this.addToCards(this.generateSelectFuriganaForOneKanji(currentWord, currentKanji, fI, userKanji), currentKanji.id);
            }
          }
        }
      }

      this.addToCards(this.generateWordInfo(currentWord, userWord, currentKanjis), null, 0);
      this.addToCards(this.generateSelectFuriganaForWholeWord(currentWord, userWord));
      this.addToCards(this.generateTypeFuriganaForWholeWord(currentWord, userWord));
      this.addToCards(this.generateSelectTranslationForWord(currentWord, userWord));
      this.addToCards(this.generateSelectWordForTranslation(currentWord, userWord));

      this.addToCards(this.generateSelectWordForAudio(currentWord, userWord));

      let meanings = this.filterMeaningsForUser(currentWord, false, true).meanings;
      for (let meaning of meanings) {
        if (!meaning.isOther) {
          let exampleSentences = shuffle(meaning.exampleSentences);
          let added = 0;
          for (let currentSentence of exampleSentences) {
            if (currentSentence.furiganaHtml.indexOf('<em>') !== -1) {
              this.addToCards(this.generateSelectWordForSentence(currentWord, userWord, currentSentence));
              added++;
            }
            if (added >= 3) {
              break;
            }
          }
        }
      }

      // this.addToCards(this.generateSelectWordForSentenceVideo(currentWord, userWord));
      this.addToCards(this.generateSelectAudioForWord(currentWord, userWord));
    }

    return {
      cards: this.cards,
      drills: this.drills,
      userWords: this.userWords,
      words: this.words,
      kanjis: this.kanjis,
    };
  }

  private async loadKanji() {
    // TODO: add "usedKanji" to this.words dictionary (and/or user dictionary)

    const extractedKanji = this.userWords.flatMap((w) => extractKanji(w.original_word));
    this.userKanjis = await this.userDictionaryRepository.find({
      where: {
        user_id: this.user.id,
        original_word: In(extractedKanji),
        type: DictionaryType.JapaneseKanji,
      },
    });

    this.kanjis = <JapaneseKanji[]>await this.dictionaryWordRepository.find({
      where: {
        id: In(this.userKanjis.map((w) => w.dictionary_word_id)),
      },
    });
    if (this.kanjis.length != this.userKanjis.length) {
      console.log('Warning: this.kanjis.length != this.userKanji.length');
    }

    let exampleWordIds = this.kanjis.map((k) => k.data.readings.map((r) => r.exampleWords.map((w) => w.wordId))).flat(2);
    this.exampleWordsArray = <JapaneseWord[]>await this.dictionaryWordRepository.findByIds(exampleWordIds);
    this.exampleWords = keyBy(this.exampleWordsArray, (w) => w.id);
  }

  private async loadWords() {
    this.userWords = await this.userDictionaryRepository.find({
      where: {
        user_id: this.user.id,
        type: DictionaryType.JapaneseWords,
        drill_due: LessThanOrEqual(new Date()),
      },
      order: {
        // id: 'ASC',
        drill_due: 'ASC',
      },
      take: 10,
    });
    console.log(`Loaded ${this.userWords.length} words`);

    this.words = <JapaneseWord[]>await this.dictionaryWordRepository.find({
      where: {
        id: In(this.userWords.map((w) => w.dictionary_word_id)),
      },
    });
    if (this.words.length != this.userWords.length) {
      console.log('Warning: this.words.length != this.userWords.length');
    }
  }

  private async loadSentences() {
    let exampleSentencesIds = [];

    for (let word of [...this.words, ...this.exampleWordsArray]) {
      for (let meaning of word.data.meanings) {
        if (meaning.exampleSentenceIds) {
          exampleSentencesIds.push(...meaning.exampleSentenceIds);
        }
      }
    }

    this.exampleSentences = keyBy(await this.sentenceRepository.findByIds(exampleSentencesIds), (s) => s.id);
  }

  getAudioUrls(text: string) {
    return ['/api/audio?q=' + encodeURIComponent(Buffer.from(text).toString('base64'))];
  }

  getAudioUrlsForWord(word: JapaneseWord) {
    const reading = word?.data?.readings?.[0]?.kana;
    const value = word?.data?.readings?.[0]?.kanji || word?.data?.readings?.[0]?.kana;
    return this.getAudioUrls(`<phoneme type="ruby" ph="${reading.replace(/"/, '')}">${value.replace(/"/, '')}</phoneme> `);
  }

  getAudioUrlForSentence(sentenceText: string, clozeMode = false) {
    if (clozeMode) {
      sentenceText = sentenceText.replace(/<em>([^<]*?)<\/em>/g, '。 ');
      sentenceText = sentenceText.replace(/<(?!break)[^>]*>/gm, '');
      console.log('cloze', sentenceText);
      sentenceText = `<speak>${sentenceText}</speak>`;
    } else {
      // It's trusted HTML, so we use simple regexp to remove it
      sentenceText = sentenceText.replace(/<[^>]*>/gm, '');
    }
    return this.getAudioUrls(sentenceText);
  }

  addToCards(card: WordInfoCard | KanjiInfoCard | TrainingQuestionCard, trackBy = null, trackPoints = 1) {
    if (!this.cards[card.cardId]) {
      this.cards[card.cardId] = card;
      this.drills.push({
        card: card.cardId,
        isFinished: false,
        isAnsweredCorrectly: null,
        answerStartTime: null,
        answerEndTime: null,
        answerDuration: null,
        trackBy: trackBy || card.wordId,
        trackPoints: trackPoints,
      });
      return true;
    } else {
      return false;
    }
  }

  furiganaToHtml(furigana: Furigana[], clozePosition = null, rubyClass = null) {
    let html = '';
    html += `<ruby${rubyClass ? ` class="${rubyClass}"` : ''}>`;
    for (let [i, f] of furigana.entries()) {
      html += htmlEncode(f.ruby);
      if (clozePosition !== null && (clozePosition == i || clozePosition == -1)) {
        html += '<rt class="question-highlight">?</rt>';
      } else {
        html += '<rt>' + (htmlEncode(f.rt) || '') + '</rt>';
      }
    }
    html += '</ruby>';

    return html;
  }

  filterMeaningsForUser(word: JapaneseWord | JapaneseKanji, forWordInfoCard = false, forSentenceDrills = false) {
    // TODO: cache it inside class as it used several times
    let userLanguages = this.user.languages;

    let fullMeanings = (<JapaneseWord>word).data.meanings.filter((m) => userLanguages.indexOf(m.lang) !== -1 && (!m.isOther || forWordInfoCard));
    if (fullMeanings.length == 0) {
      userLanguages.push('eng', 'en');
      fullMeanings = (<JapaneseWord>word).data.meanings.filter((m) => userLanguages.indexOf(m.lang) !== -1 && (!m.isOther || forWordInfoCard));
    }

    fullMeanings.sort((a: any, b: any) => {
      return userLanguages.indexOf(a.lang) - userLanguages.indexOf(b.lang);
    });

    let probabilitySoFar = 0;
    let countMeaningsToShow = fullMeanings.length;
    let threshold = forWordInfoCard ? 0.99 : 0.8;
    let otherIndex = null;
    for (let [i, meaning] of fullMeanings.entries()) {
      if (probabilitySoFar > threshold || (!forWordInfoCard && i > 3 && (!meaning.probabilityOverall || meaning.probabilityOverall < 0.2))) {
        countMeaningsToShow = i;
        break;
      }
      if (otherIndex === null && meaning.isOther) {
        otherIndex = i;
      }
      probabilitySoFar += meaning.probabilityOverall || 0;
    }

    // Move other meaning to the end of the list (if it shows in the list before clicking "more")
    if (forWordInfoCard && otherIndex !== null && otherIndex <= countMeaningsToShow - 1) {
      let otherItem = fullMeanings[otherIndex];
      fullMeanings.splice(otherIndex, 1);
      fullMeanings.splice(countMeaningsToShow - 1, 0, otherItem);
    }

    if (!forWordInfoCard) {
      fullMeanings = fullMeanings.slice(0, countMeaningsToShow);
    }

    let meanings: TrainingMeaning[] = fullMeanings.map((m) => ({
      lang: m.lang,
      value: m.value,
      probabilityInList: Math.floor(m.probabilityInList * 100),
      probabilityOverall: Math.floor(m.probabilityOverall * 100),
      frequencyPmw: m.frequencyPmw,
      exampleSentences: forWordInfoCard || forSentenceDrills ? this.formatExampleSentences(m.exampleSentenceIds) : null,
      countExampleSentencesToShow: forWordInfoCard || forSentenceDrills ? 3 : 0,
      isOther: m.isOther || false,
    }));

    return { meanings, countMeaningsToShow };
  }

  filterReadingsByType(kanji: JapaneseKanji, type: 'kun' | 'on') {
    return kanji.data.readings
      .filter((r) => r.type == type)
      .map((reading) => ({
        type: reading.type,
        value: reading.value,
        frequencyPercent: reading.frequencyPercent,
        frequencyPmw: reading.frequencyPmw,
        countExampleWordsToShow: 3,
        exampleWords: reading.exampleWords.map((item) => {
          let word = this.exampleWords[item.wordId];
          if (!word) {
            console.log(`Unable to find example word ${item.wordId} for kanji ${kanji.id}`);
            return null;
          }
          return {
            wordId: item.wordId,
            frequencyRank: Math.min(100, Math.round(word.data?.frequencyRank * 10)),
            frequencyPmw: word.data.frequencyPmw,
            infoCard: `wordInfo_${item.wordId}`,
            value: word?.data?.readings?.[0]?.kanji || word?.data?.readings?.[0]?.kana,
            furiganaHtml: this.furiganaToHtml(word?.data?.readings?.[0]?.furigana),
            meanings: this.filterMeaningsForUser(word).meanings,
            countExampleSentencesToShow: 1,
            exampleSentences: this.formatExampleSentencesForWord(word),
            audioUrls: this.getAudioUrlsForWord(word),
          };
        }),
      }));
  }

  generateSelectFuriganaForOneKanji(word: JapaneseWord, kanji: JapaneseKanji, furiganaPosition: number, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectFuriganaForOneKanji',
      cardId: `selectFuriganaForOneKanji_${word.id}_${furiganaPosition}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana, furiganaPosition),
        answers: this.generateAnswersForKanji(kanji, word, furiganaPosition),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateAnswersForKanji(kanji: JapaneseKanji, word: JapaneseWord, furiganaPosition: number) {
    let correctAnswer = word.data.readings[0].furigana[furiganaPosition].rt;
    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true, useBigFont: true });
    let shuffledList = shuffle(this.kanjis);

    // TODO: load additional kanjis besides user kanjis

    // Readings from same kanji
    let reading = sample(kanji.data.readings.filter((r) => !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r))));
    if (reading) {
      answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading), useBigFont: true });
    }

    // Readings with same okurigana (for example "こわ.い" for "つよ.い")
    let nextPosition = word.data.readings[0].furigana[furiganaPosition + 1];
    if (nextPosition && nextPosition.rt == '') {
      for (let randomKanji of shuffledList) {
        let readings = randomKanji.data.readings.filter((r) => r.value.split('.')?.[1] == nextPosition.ruby && !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r)));
        if (readings.length > 0) {
          reading = sample(readings);
          answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading), useBigFont: true });
          break;
        }
      }
    }

    // Readings from other kanji
    for (let randomKanji of shuffledList) {
      let readings = randomKanji.data.readings.filter((r) => (r.frequencyPercent || 1) > 0.2 /*&& r.value.indexOf('.') === -1*/ && !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r)));
      if (readings.length > 0) {
        reading = sample(readings);
        answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading), useBigFont: true });
      }
      if (answers.length == 5) {
        break;
      }
    }

    return shuffle(answers);
  }

  formatKanjiReadingForAnswer(reading: JapaneseKanjiReading) {
    return convertKatakanaToHiragana(reading.value.replace(/\..*/, '').replace('-', '')); // For example replace "つよ.い" to "つよ" and
  }

  formatExampleSentencesForWord(word: JapaneseWord) {
    let meanings = this.filterMeaningsForUser(word, true).meanings;
    let maxLength = max(meanings.map((m) => m?.exampleSentences?.length));
    let exampleSentences: TrainingExampleSentence[] = [];
    for (let step = 0; step < maxLength; step++) {
      for (let meaningI = 0; meaningI < meanings.length; meaningI++) {
        if (meanings[meaningI]?.exampleSentences?.[step]) {
          exampleSentences.push(meanings[meaningI].exampleSentences[step]);
        }
      }
    }

    return exampleSentences;
  }

  formatExampleSentences(exampleSentences: number[]): TrainingExampleSentence[] {
    if (!exampleSentences) {
      return [];
    }
    return exampleSentences
      .map((sentenceId) => {
        if (!sentenceId) {
          return null;
        }
        let sentence = this.exampleSentences[sentenceId];
        if (!sentence) {
          //console.log(`Unable to find sentence #${sentenceId}`);
          return null;
        }
        let translationHtml = null;
        for (let lang of this.user.languages) {
          translationHtml = sentence.translations[lang];
          if (translationHtml) {
            break;
          }
        }
        if (!translationHtml && sentence.translations['en']) {
          translationHtml = sentence.translations['en'];
        }
        if (sentence && translationHtml) {
          return {
            sentenceId: sentence.id,
            value: sentence.text,
            furiganaHtml: sentence.text, // TODO: furigana
            translationHtml: translationHtml,
            audioUrls: this.getAudioUrlForSentence(sentence.text),
          };
        }
      })
      .filter((ex) => ex);
  }

  generateSelectFuriganaForWholeWord(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectFuriganaForWholeWord',
      cardId: `selectFuriganaForWholeWord_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana, -1),
        answers: this.generateAnswersForWordReading(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateTypeFuriganaForWholeWord(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'typeFuriganaForWholeWord',
      cardId: `typeFuriganaForWholeWord_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'type',
        furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana, -1),
        buttons: shuffle(word.data.readings[0].furigana.flatMap((r) => (r.rt == '' ? r.ruby : r.rt).split(''))),
        correctAnswers: [word.data.readings[0].furigana.map((r) => (r.rt == '' ? r.ruby : r.rt)).join('')],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateAnswersForWordReading(word: JapaneseWord) {
    let wordFurigana = word.data.readings[0].furigana;
    let correctAnswer = this.formatWordFuriganaForAnswerReading(wordFurigana);
    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true, useBigFont: true });

    for (let randomWord of this.getSimilarRandomWords(word)) {
      let furigana = randomWord.data.readings[0].furigana;
      let formattedAnswer = this.formatWordFuriganaForAnswerReading(furigana);
      // Do not add duplicate answers
      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer, useBigFont: true });
      }
      if (answers.length == 5) {
        break;
      }
    }

    if (answers.length < 5) {
      console.log(new Error(`Less than 5 answers for word ${word.id}`).stack);
    }

    return shuffle(answers);
  }

  getOkuriganaForWord(word: JapaneseWord) {
    let wordFurigana = word.data.readings[0].furigana;
    let lastPosition = wordFurigana[wordFurigana.length - 1];
    let wordOkurigana = lastPosition && lastPosition.rt == '' ? lastPosition.ruby : '';

    return wordOkurigana;
  }

  formatWordFuriganaForAnswerReading(furigana: Furigana[]) {
    return furigana.map((f) => (f.rt == '' ? f.ruby : f.rt)).join(' ');
  }

  generateSelectTranslationForWord(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectTranslationForWord',
      cardId: `selectTranslationForWord_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
        showAudio: true,
        answers: this.generateAnswersForWordMeaning(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateAnswersForWordMeaning(word: JapaneseWord) {
    let correctAnswer = this.filterMeaningsForUser(word)
      .meanings.map((v) => v.value)
      .join(', ');

    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true });

    for (let randomWord of this.getSimilarRandomWords(word)) {
      let formattedAnswer = this.filterMeaningsForUser(randomWord)
        .meanings.map((v) => v.value)
        .join(', ');

      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer });
      }

      if (answers.length == 5) {
        break;
      }
    }

    if (answers.length < 5) {
      console.log(new Error(`Less than 5 answers for word ${word.id}`).stack);
    }

    return shuffle(answers);
  }

  generateSelectWordForTranslation(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectWordForTranslation',
      cardId: `selectWordForTranslation_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        meanings: this.filterMeaningsForUser(word).meanings,
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateAnswersForWordWriting(word: JapaneseWord, forAudio = false) {
    let answers: TrainingAnswer[] = [];
    let closedAnswers: TrainingAnswer[] = [];

    let correctAnswer = this.furiganaToHtml(word.data.readings[0].furigana, null, forAudio ? null : 'gray-furigana');
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true, useBigFont: true });

    if (forAudio) {
      let closedCorrentAnswer = this.formatWordFuriganaForAnswerKanji(word.data.readings[0].furigana);
      closedAnswers.push({ contentHtml: closedCorrentAnswer, isCorrectAnswer: true, useBigFont: true });
    }

    for (let randomWord of this.getSimilarRandomWords(word)) {
      let formattedAnswer = this.furiganaToHtml(randomWord.data.readings[0].furigana, null, forAudio ? null : 'gray-furigana');

      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer, useBigFont: true });
        if (forAudio) {
          closedAnswers.push({ contentHtml: this.formatWordFuriganaForAnswerKanji(randomWord.data.readings[0].furigana), useBigFont: true });
        }
      }

      if (answers.length == 5) {
        break;
      }
    }

    if (answers.length < 5) {
      console.log(new Error(`Less than 5 answers for word ${word.id}`).stack);
    }

    if (forAudio) {
      const shuffled = shuffle([...answers.keys()]);
      answers = shuffled.map((i) => answers[i]);
      closedAnswers = shuffled.map((i) => closedAnswers[i]);

      return [closedAnswers, answers];
    } else {
      return [shuffle(answers)];
    }
  }

  formatWordFuriganaForAnswerKanji(furigana: Furigana[]) {
    return furigana.map((f) => f.ruby).join('');
  }

  generateSelectWordForAudio(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    const [closedAnswers, answers] = this.generateAnswersForWordWriting(word, true);
    return {
      cardType: 'selectWordForAudio',
      cardId: `selectWordForAudio_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        isAudioQuestion: true,
        showBigAudio: true,
        answers: closedAnswers,
        openAnswers: answers,
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateSelectWordForSentence(word: JapaneseWord, userWord: UserDictionary, sentence: TrainingExampleSentence): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectWordForSentence',
      cardId: `selectWordForSentence_${word.id}_${sentence.sentenceId}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      // TODO: real sentences
      question: {
        type: 'select',
        isAudioQuestion: true,
        questionHtml: sentence.furiganaHtml.replace(/<em>([^<]*?)<\/em>/g, '<span class="question-blank-box"></span><rt></rt>'),
        // audioUrls: this.getAudioUrlForSentence(sentence.value, true),
        audioUrls: this.getAudioUrlForSentence(sentence.value),
        sentence: {
          sentenceId: 94376,
          furiganaHtml: sentence.furiganaHtml,
          translationHtml: sentence.translationHtml,
          audioUrls: this.getAudioUrlForSentence(sentence.value),
        },
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateSelectWordForSentenceVideo(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectWordForSentenceVideo',
      cardId: `selectWordForSentenceVideo_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        isAudioQuestion: true,
        questionHtml: '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><div class="question-blank-box"></div>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
        sentence: {
          sentenceId: 94376,
          value: '携帯電話は便利ですが、ちゃんとマナーを守って使ってほしいです。',
          furiganaHtml: '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><span class="word-highlight">便利</span>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
          translationHtml: 'Cell phones are <span class="word-highlight">convenient</span>, but I want them to be used responsibly. More text for example.',
          videoUrls: ['/assets/test-video.mp3?sentence-94376'],
        },
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  generateSelectAudioForWord(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectAudioForWord',
      cardId: `selectAudioForWord_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'selectAudio',
        isAudioQuestion: true,
        furiganaHtml: this.formatWordFuriganaForAnswerKanji(word.data.readings[0].furigana),
        ...this.generateAnswersForWordAudio(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word).meanings,
      mnemonic: null,
      audioUrls: this.getAudioUrlsForWord(word),
    };
  }

  *getSimilarRandomWords(word: JapaneseWord) {
    let wordFurigana = word.data.readings[0].furigana;
    let wordOkurigana = this.getOkuriganaForWord(word);
    for (let words of [this.words, DrillsGenerator.additionalWords]) {
      let shuffledList = shuffle(words);
      for (let randomWord of shuffledList) {
        // TODO: пропускать слова с одинаковыми/похожими значениями (если есть пересечение в значениях)

        let furigana = randomWord.data.readings[0].furigana;
        // Okurigana should match; count of parts in furigana should match
        if (wordOkurigana == this.getOkuriganaForWord(randomWord) && wordFurigana.length == furigana.length) {
          yield randomWord;
        }
      }
    }

    // TODO: load additional words if needed
  }

  generateAnswersForWordAudio(word: JapaneseWord) {
    let openAnswers: TrainingAnswer[] = [];

    let correctAnswer = this.furiganaToHtml(word.data.readings[0].furigana, null, 'gray-furigana');
    openAnswers.push({ contentHtml: correctAnswer, isCorrectAnswer: true, audioUrls: this.getAudioUrlsForWord(word), useBigFont: true });

    for (let randomWord of this.getSimilarRandomWords(word)) {
      let formattedAnswer = this.furiganaToHtml(randomWord.data.readings[0].furigana, null, 'gray-furigana');

      if (!openAnswers.some((a) => a.contentHtml == formattedAnswer)) {
        openAnswers.push({ contentHtml: formattedAnswer, audioUrls: this.getAudioUrlsForWord(randomWord), isCorrectAnswer: false, useBigFont: true });
      }

      if (openAnswers.length == 5) {
        break;
      }
    }

    if (openAnswers.length < 5) {
      console.log(new Error(`Less than 5 answers for word ${word.id}`).stack);
    }

    openAnswers = shuffle(openAnswers);
    openAnswers.map((a, i) => (a.numberAudioUrl = this.getAudioUrls(String(i + 1))[0]));

    let answers = openAnswers.map((a) => ({ audioUrls: a.audioUrls, numberAudioUrl: a.numberAudioUrl, isCorrectAnswer: a.isCorrectAnswer }));

    return { openAnswers, answers };
  }

  generateKanjiInfo(kanji: JapaneseKanji, userKanji: UserDictionary): KanjiInfoCard & Record<string, any> {
    return {
      cardType: 'kanjiInfo',
      cardId: `kanjiInfo_${kanji.id}`,
      wordId: kanji.id,
      frequencyRank: Math.min(100, Math.round(kanji.data.frequencyRank * 10)),
      value: kanji.query[0],
      meanings: this.filterMeaningsForUser(kanji).meanings.slice(0, 1),
      mnemonic: null,
      kunReadings: this.filterReadingsByType(kanji, 'kun'),
      onReadings: this.filterReadingsByType(kanji, 'on'),
    };
  }

  // Possible optimization: write index of the used reading in the database record for the word (along with the kanji ids)
  getReadingsUsedInWord(word: JapaneseWord) {
    const usedReadings: Record<string, string[]> = {};
    const furigana = word.data.readings[0].furigana;
    for (let [fI, fV] of furigana.entries()) {
      if (fV.rt != '') {
        let nextPosition = furigana?.[fI + 1]?.rt === '' ? '.' + furigana?.[fI + 1]?.ruby : '';
        if (!usedReadings[fV.ruby]) {
          usedReadings[fV.ruby] = [];
        }
        usedReadings[fV.ruby].push(convertHiraganaToKatakana(fV.rt + nextPosition));
      }
    }

    return usedReadings;
  }

  generateWordInfo(word: JapaneseWord, userWord: UserDictionary, kanjis: JapaneseKanji[]): WordInfoCard {
    const usedReadings = this.getReadingsUsedInWord(word);

    return {
      cardType: 'wordInfo',
      cardId: `wordInfo_${word.id}`,
      wordId: word.id,
      frequencyRank: Math.min(100, Math.round(word.data?.frequencyRank * 10)),
      value: word.data?.readings?.[0]?.kanji,
      furiganaHtml: this.furiganaToHtml(word.data?.readings?.[0]?.furigana),
      ...this.filterMeaningsForUser(word, true),
      kanji: kanjis.map((kanji, i) => ({
        wordId: kanji.id,
        value: kanji.query[0],
        readings: kanji.data.readings.map((r) => ({ type: r.type, value: r.value, frequencyPercent: r.frequencyPercent, isCurrent: usedReadings?.[kanji.query[0]]?.indexOf(convertHiraganaToKatakana(r.value)) !== -1 })).sort((a, b) => b.frequencyPercent - a.frequencyPercent),
        meanings: this.filterMeaningsForUser(kanji).meanings.slice(0, 1),
        infoCard: `kanjiInfo_${kanji.id}`,
      })),
      audioUrls: this.getAudioUrlsForWord(word),
      mnemonic: null,
      /*mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },*/
    };
  }
}
