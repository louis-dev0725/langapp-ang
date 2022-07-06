import { Injectable } from '@nestjs/common';
import { DictionaryType } from 'src/entities/DictionaryWord';
import { DictionaryWordRepository } from 'src/entities/DictionaryWordRepository';
import { JapaneseKanji } from 'src/entities/JapaneseKanji';
import { JapaneseWord } from 'src/entities/JapaneseWord';
import { Furigana, Reading as JapaneseWordReading } from 'src/entities/JapaneseWordData';
import { Reading as JapaneseKanjiReading } from 'src/entities/JapaneseKanjiData';
import { User } from 'src/entities/User';
import { UserDictionaryRepository } from 'src/entities/UserDictionaryRepository';
import { convertKatakanaToHiragana, extractKanji } from 'src/japanese.utils';
import { In } from 'typeorm';
import { Drill, KanjiCardInfo, TrainingAnswer, TrainingCards, TrainingQuestionCard, WordInfo } from './drills.interfaces';
import { encode as htmlEncode } from 'html-entities';
import { UserDictionary } from 'src/entities/UserDictionary';
import { sample, shuffle, uniq } from 'lodash';

@Injectable()
export class DrillsGenerator {
  user: User;
  userWords: UserDictionary[];
  words: JapaneseWord[];
  exampleWords: JapaneseWord[];
  cards: TrainingCards = {};
  drills: Drill[] = [];

  userKanjis: UserDictionary[];
  kanjis: JapaneseKanji[];

  constructor(private userDictionaryRepository: UserDictionaryRepository, private dictionaryWordRepository: DictionaryWordRepository) {}

  async getList(user: User) {
    this.user = user;

    this.userWords = await this.userDictionaryRepository.find({
      where: {
        user_id: user.id,
        type: DictionaryType.JapaneseWords,
      },
    });
    if (this.userWords.length == 0) {
      return { cards: {}, drills: [] };
    }

    this.words = <JapaneseWord[]>await this.dictionaryWordRepository.find({
      where: {
        id: In(this.userWords.map((w) => w.dictionary_word_id)),
      },
    });
    if (this.words.length != this.userWords.length) {
      console.log('Warning: this.words.length != this.userWords.length');
    }

    // TODO: add "usedKanji" to this.words dictionary (and/or user dictionary)
    const extractedKanji = this.userWords.flatMap((w) => extractKanji(w.original_word));
    this.userKanjis = await this.userDictionaryRepository.find({
      where: {
        user_id: user.id,
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
    this.exampleWords = <JapaneseWord[]>await this.dictionaryWordRepository.find({
      where: {
        id: In(exampleWordIds),
      },
    });

    for (const userWord of this.userWords) {
      const currentWord = this.words.find((w) => w.id == userWord.dictionary_word_id);
      if (!currentWord) {
        console.log(`Skip user word #${userWord.id}: no word in dictionary with such id`);
        continue;
      }
      const currentExtractedKanji = extractKanji(userWord.original_word);
      const currentUserKanjis = currentExtractedKanji.map((extractedKanji) =>
        this.userKanjis.find((k) => k.original_word == extractedKanji),
      );
      if (uniq(currentExtractedKanji).length != currentUserKanjis.length) {
        console.log(`Skip user word #${userWord.id}: unable to find all kanji (currentExtractedKanji.length != currentUserKanjis.length)`);
        continue;
      }
      const currentKanjis = currentExtractedKanji.map((extractedKanji) => this.kanjis.find((k) => k.query[0] == extractedKanji)); // filter inside map to save sorting
      for (const [i, userKanji] of currentUserKanjis.entries()) {
        const currentKanji = currentKanjis[i];
        if (!currentKanji) {
          console.log(`Skip user kanji ${userKanji.id}: no kanji in dictionary with such id`);
          continue;
        }
        if (this.addToCards(this.generateKanjiInfo(currentKanji, userKanji))) {
          for (const [fI, fV] of currentWord.data.readings[0].furigana.entries()) {
            if (fV.ruby == currentKanji.query[0]) {
              this.addToCards(this.generateSelectFuriganaForOneKanji(currentWord, currentKanji, fI, userKanji));
            }
          }
        }
      }
      this.addToCards(this.generateWordInfo(currentWord, userWord, this.kanjis));
      this.addToCards(this.generateSelectFuriganaForWholeWord(currentWord, userWord));
      this.addToCards(this.generateTypeFuriganaForWholeWord(currentWord, userWord));
      this.addToCards(this.generateSelectTranslationForWord(currentWord, userWord));
      this.addToCards(this.generateSelectWordForTranslation(currentWord, userWord));
      this.addToCards(this.generateSelectWordForAudio(currentWord, userWord));
      this.addToCards(this.generateSelectWordForSentence(currentWord, userWord));
      this.addToCards(this.generateSelectWordForSentenceVideo(currentWord, userWord));
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

  addToCards(card: WordInfo | KanjiCardInfo | TrainingQuestionCard) {
    if (!this.cards[card.cardId]) {
      this.cards[card.cardId] = card;
      this.drills.push({
        card: card.cardId,
        isFinished: false,
        isAnsweredCorrectly: null,
        answerStartTime: null,
        answerEndTime: null,
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

  filterMeaningsForUser(word: JapaneseWord | JapaneseKanji) {
    // TODO: rebuild dictionary with 2 letter lang codes
    let userLanguages = this.user.languages.flatMap((l) => (l == 'en' ? ['eng', 'en'] : l == 'ru' ? ['ru', 'rus'] : l));

    let meanings = word.data.meanings.filter((m) => userLanguages.indexOf(m.lang) !== -1);
    if (meanings.length == 0) {
      userLanguages.push('eng', 'en');
      meanings = word.data.meanings.filter((m) => userLanguages.indexOf(m.lang) !== -1);
    }

    return meanings.sort((a, b) => {
      return userLanguages.indexOf(a.lang) - userLanguages.indexOf(b.lang);
    });
  }

  filterReadingsByType(kanji: JapaneseKanji, type: 'kun' | 'on') {
    return kanji.data.readings
      .filter((r) => r.type == type)
      .map((reading) => ({
        type: reading.type,
        value: reading.value,
        frequencyPercent: reading.frequencyPercent,
        frequencyPmw: reading.frequencyPmw,
        exampleWords: reading.exampleWords.map((item) => {
          let word = this.exampleWords.find((ew) => ew.id == item.wordId);
          if (!word) {
            return null;
          }
          return {
            wordId: item.wordId,
            frequencyRank: word.data.frequencyRank,
            frequencyPmw: word.data.frequencyPmw,
            infoCard: `wordInfo_${item.wordId}`,
            furiganaHtml: this.furiganaToHtml(word?.data?.readings?.[0]?.furigana),
            meanings: this.filterMeaningsForUser(word),
            countExampleSentencesToShow: 3,
            exampleSentences: [
              {
                sentenceId: 93545,
                value: '便りがないのは良い知らせ。',
                furiganaHtml: '<ruby>便<rt>たよ</rt>りがないのは<rt></rt>良<rt>よ</rt>い<rt></rt>知<rt>し</rt>らせ。</ruby>',
                translationHtml: 'No <span class="word-highlight">news</span> is good news.',
                audioUrls: ['/assets/test-audio.mp3?sentence-93545'],
              },
            ],
            audioUrls: ['/assets/test-audio.mp3?word-3266529'],
          };
        }),
      }));
  }

  generateSelectFuriganaForOneKanji(
    word: JapaneseWord,
    kanji: JapaneseKanji,
    furiganaPosition: number,
    userWord: UserDictionary,
  ): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectFuriganaForOneKanji',
      cardId: `selectFuriganaForOneKanji_${word.id}_${furiganaPosition}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        questionHtml: this.furiganaToHtml(word.data.readings[0].furigana, furiganaPosition),
        answers: this.generateAnswersForKanji(kanji, word, furiganaPosition),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
    };
  }

  generateAnswersForKanji(kanji: JapaneseKanji, word: JapaneseWord, furiganaPosition: number) {
    let correctAnswer = word.data.readings[0].furigana[furiganaPosition].rt;
    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true });
    let shuffledList = shuffle(this.kanjis);

    // TODO: load additional kanjis besides user kanjis

    // Readings from same kanji
    let reading = sample(kanji.data.readings.filter((r) => !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r))));
    if (reading) {
      answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading) });
    }

    // Readings with same okurigana (for example "こわ.い" for "つよ.い")
    let nextPosition = word.data.readings[0].furigana[furiganaPosition + 1];
    if (nextPosition && nextPosition.rt == '') {
      for (let randomKanji of shuffledList) {
        let readings = randomKanji.data.readings.filter(
          (r) => r.value.split('.')?.[1] == nextPosition.ruby && !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r)),
        );
        if (readings.length > 0) {
          reading = sample(readings);
          answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading) });
          break;
        }
      }
    }

    // Readings from other kanji
    for (let randomKanji of shuffledList) {
      let readings = randomKanji.data.readings.filter(
        (r) => (r.frequencyPercent || 1) > 0.2 && !answers.some((a) => a.contentHtml == this.formatKanjiReadingForAnswer(r)),
      );
      if (readings.length > 0) {
        reading = sample(readings);
        answers.push({ contentHtml: this.formatKanjiReadingForAnswer(reading) });
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

  generateSelectFuriganaForWholeWord(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectFuriganaForWholeWord',
      cardId: `selectFuriganaForWholeWord_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      question: {
        type: 'select',
        questionHtml: this.furiganaToHtml(word.data.readings[0].furigana, -1),
        answers: this.generateAnswersForWordReading(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
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
        questionHtml: this.furiganaToHtml(word.data.readings[0].furigana, -1),
        buttons: shuffle(word.data.readings[0].furigana.flatMap((r) => (r.rt == '' ? r.ruby : r.rt).split(''))),
        correctAnswers: [word.data.readings[0].furigana.map((r) => (r.rt == '' ? r.ruby : r.rt)).join('')],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
    };
  }

  generateAnswersForWordReading(word: JapaneseWord) {
    let wordFurigana = word.data.readings[0].furigana;
    let correctAnswer = this.formatWordFuriganaForAnswerReading(wordFurigana);
    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true });
    let shuffledList = shuffle(this.words);

    // If word has okurigana then it should match
    let lastPosition = wordFurigana[wordFurigana.length - 1];
    let wordOkurigana = lastPosition && lastPosition.rt ? lastPosition.ruby : null;

    for (let randomWord of shuffledList) {
      let reading = randomWord.data.readings[0];
      if (wordOkurigana == null || reading.furigana[reading.furigana.length - 1].ruby) {
        let formattedAnswer = this.formatWordFuriganaForAnswerReading(reading.furigana);
        if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
          answers.push({ contentHtml: formattedAnswer });
        }
      }
      if (answers.length == 5) {
        break;
      }
    }

    // TODO: load additional words if needed

    return shuffle(answers);
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
        questionHtml: this.furiganaToHtml(word.data.readings[0].furigana),
        showAudio: true,
        answers: this.generateAnswersForWordMeaning(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
    };
  }

  generateAnswersForWordMeaning(word: JapaneseWord) {
    let correctAnswer = this.filterMeaningsForUser(word)
      .map((v) => v.value)
      .join(', ');

    const answers: TrainingAnswer[] = [];
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true });

    let shuffledList = shuffle(this.words);

    for (let randomWord of shuffledList) {
      let formattedAnswer = this.filterMeaningsForUser(randomWord)
        .map((v) => v.value)
        .join(', ');

      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer });
      }

      if (answers.length == 5) {
        break;
      }
    }

    // TODO: load additional words if needed

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
        questionHtml: this.filterMeaningsForUser(word)
          .map((v) => v.value)
          .join(', '),
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
    };
  }

  generateAnswersForWordWriting(word: JapaneseWord, forAudio = false) {
    let answers: TrainingAnswer[] = [];
    let closedAnswers: TrainingAnswer[] = [];

    let correctAnswer = this.furiganaToHtml(word.data.readings[0].furigana, null, forAudio ? null : 'gray-furigana');
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true });

    if (forAudio) {
      let closedCorrentAnswer = this.formatWordFuriganaForAnswerKanji(word.data.readings[0].furigana);
      closedAnswers.push({ contentHtml: closedCorrentAnswer, isCorrectAnswer: true });
    }

    let shuffledList = shuffle(this.words);

    // TODO: пропускать слова с одинаковыми/похожими значениями (если есть пересечение в значениях)

    for (let randomWord of shuffledList) {
      let formattedAnswer = this.furiganaToHtml(randomWord.data.readings[0].furigana, null, forAudio ? null : 'gray-furigana');

      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer });
        if (forAudio) {
          closedAnswers.push({ contentHtml: this.formatWordFuriganaForAnswerKanji(randomWord.data.readings[0].furigana) });
        }
      }

      if (answers.length == 5) {
        break;
      }
    }

    // TODO: load additional words if needed

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
    return furigana.map((f) => f.ruby).join(' ');
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
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
    };
  }

  generateSelectWordForSentence(word: JapaneseWord, userWord: UserDictionary): TrainingQuestionCard & Record<string, any> {
    return {
      cardType: 'selectWordForSentence',
      cardId: `selectWordForSentence_${word.id}`,
      wordId: word.id,
      infoCard: `wordInfo_${word.id}`,
      // TODO: real sentences
      question: {
        type: 'select',
        isAudioQuestion: true,
        questionHtml:
          '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><div class="question-blank-box"></div>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
        sentence: {
          sentenceId: 94376,
          value: '携帯電話は便利ですが、ちゃんとマナーを守って使ってほしいです。',
          furiganaHtml:
            '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><span class="word-highlight">便利</span>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
          translationHtml:
            'Cell phones are <span class="word-highlight">convenient</span>, but I want them to be used responsibly. More text for example.',
          audioUrls: ['/assets/test-audio.mp3?sentence-94376'],
        },
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
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
        questionHtml:
          '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><div class="question-blank-box"></div>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
        sentence: {
          sentenceId: 94376,
          value: '携帯電話は便利ですが、ちゃんとマナーを守って使ってほしいです。',
          furiganaHtml:
            '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><span class="word-highlight">便利</span>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
          translationHtml:
            'Cell phones are <span class="word-highlight">convenient</span>, but I want them to be used responsibly. More text for example.',
          videoUrls: ['/assets/test-video.mp3?sentence-94376'],
        },
        answers: this.generateAnswersForWordWriting(word)[0],
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
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
        questionHtml: this.formatWordFuriganaForAnswerKanji(word.data.readings[0].furigana),
        answers: this.generateAnswersForWordAudio(word),
      },
      furiganaHtml: this.furiganaToHtml(word.data.readings[0].furigana),
      meanings: this.filterMeaningsForUser(word),
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
    };
  }

  generateAnswersForWordAudio(word: JapaneseWord) {
    let answers: TrainingAnswer[] = [];

    let correctAnswer = this.furiganaToHtml(word.data.readings[0].furigana, null, 'gray-furigana');
    answers.push({ contentHtml: correctAnswer, isCorrectAnswer: true, audioUrls: ['/assets/test-audio.mp3?selectAudioForWord'] });

    let shuffledList = shuffle(this.words);

    // TODO: real audio

    // TODO: пропускать слова с одинаковыми/похожими значениями (если есть пересечение в значениях)

    for (let randomWord of shuffledList) {
      let formattedAnswer = this.furiganaToHtml(randomWord.data.readings[0].furigana, null, 'gray-furigana');

      if (!answers.some((a) => a.contentHtml == formattedAnswer)) {
        answers.push({ contentHtml: formattedAnswer, audioUrls: ['/assets/test-audio.mp3?selectAudioForWord'] });
      }

      if (answers.length == 5) {
        break;
      }
    }

    // TODO: load additional words if needed

    return shuffle(answers);
  }

  generateKanjiInfo(kanji: JapaneseKanji, userKanji: UserDictionary): KanjiCardInfo & Record<string, any> {
    return {
      cardType: 'kanjiInfo',
      cardId: `kanjiInfo_${kanji.id}`,
      wordId: kanji.id,
      frequencyRank: Math.max(100, kanji.data.frequencyRank * 100),
      value: kanji.query[0],
      meanings: this.filterMeaningsForUser(kanji),
      mnemonic: {
        imageUrl: '/assets/test-image.png?kanji-3157554',
      },
      kunReadings: this.filterReadingsByType(kanji, 'kun'),
      onReadings: this.filterReadingsByType(kanji, 'on'),
    };
  }

  generateWordInfo(word: JapaneseWord, userWord: UserDictionary, kanjis: JapaneseKanji[]): WordInfo {
    return {
      cardType: 'wordInfo',
      cardId: `wordInfo_${word.id}`,
      wordId: word.id,
      frequencyRank: Math.max(100, word.data?.frequencyRank * 10),
      value: word.data?.readings?.[0]?.kanji,
      furiganaHtml: this.furiganaToHtml(word.data?.readings?.[0]?.furigana),
      meanings: this.filterMeaningsForUser(word),
      countExampleSentencesToShow: 3,
      // TODO: example sentences
      exampleSentences: [
        {
          sentenceId: 94375,
          value: '我が家は便利なところにある。',
          furiganaHtml:
            '<ruby>我<rt>わ</rt>が<rt></rt>家<rt>や</rt>は<rt></rt><span class="word-highlight">便利</span><rt></rt>なところにある。<rt></rt></ruby>',
          translationHtml: 'Our house is <span class="word-highlight">conveniently</span> located.',
          audioUrls: ['/assets/test-audio.mp3?sentence-94375'],
        },
        {
          sentenceId: 94376,
          value: '携帯電話は便利ですが、ちゃんとマナーを守って使ってほしいです。',
          furiganaHtml:
            '<ruby>携帯電話<rt>けいたいでんわ</rt>は<rt></rt><span class="word-highlight">便利</span>ですが、ちゃんとマナーを<rt></rt>守<rt>まも</rt>って使<rt>つか</rt>ってほしいです。<rt></rt></ruby>',
          translationHtml:
            'Cell phones are <span class="word-highlight">convenient</span>, but I want them to be used responsibly. More text for example.',
          audioUrls: [],
        },
        {
          sentenceId: 94377,
          value: '我が家は便利なところにある。',
          furiganaHtml:
            '<ruby>我<rt>わ</rt>が<rt></rt>家<rt>や</rt>は<rt></rt><span class="word-highlight">便利</span><rt></rt>なところにある。 (3)<rt></rt></ruby>',
          translationHtml: 'Our house is <span class="word-highlight">conveniently</span> located (3).',
          audioUrls: ['/assets/test-audio.mp3?sentence-94377'],
        },
        {
          sentenceId: 94377,
          value: '我が家は便利なところにある。',
          furiganaHtml:
            '<ruby>我<rt>わ</rt>が<rt></rt>家<rt>や</rt>は<rt></rt><span class="word-highlight">便利</span><rt></rt>なところにある。 (4)<rt></rt></ruby>',
          translationHtml: 'Our house is <span class="word-highlight">conveniently</span> located (4).',
          audioUrls: ['/assets/test-audio.mp3?sentence-94377'],
        },
        {
          sentenceId: 94377,
          value: '我が家は便利なところにある。',
          furiganaHtml:
            '<ruby>我<rt>わ</rt>が<rt></rt>家<rt>や</rt>は<rt></rt><span class="word-highlight">便利</span><rt></rt>なところにある。 (5)<rt></rt></ruby>',
          translationHtml: 'Our house is <span class="word-highlight">conveniently</span> located (5).',
          audioUrls: ['/assets/test-audio.mp3?sentence-94377'],
        },
      ],
      kanji: this.kanjis.map((kanji) => ({
        wordId: kanji.id,
        value: kanji.query[0],
        readings: kanji.data.readings
          .map((r) => ({ type: r.type, value: r.value, frequencyPercent: r.frequencyPercent }))
          .sort((a, b) => b.frequencyPercent - a.frequencyPercent),
        meanings: this.filterMeaningsForUser(kanji),
        infoCard: `kanjiInfo_${kanji.id}`,
      })),
      // TODO: audioUrls
      audioUrls: ['/assets/test-audio.mp3?word-3236529'],
      // TODO: mnemonic
      mnemonic: {
        imageUrl: '/assets/test-image.png?word-3236529',
      },
    };
  }
}
