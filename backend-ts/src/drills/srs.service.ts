import { Injectable } from '@nestjs/common';
import { mean, sum } from 'lodash';
import { DrillReview } from 'src/entities/DrillReview';
import { UserDictionary } from 'src/entities/UserDictionary';
import { UserDictionaryRepository } from 'src/entities/UserDictionaryRepository';
import { Drill, UserDictionaryDrillCard } from './drills.interfaces';

export enum CardAnswer {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
}

@Injectable()
export class SrsService {
  protected hardFactorForced = 1.2;
  protected easyFactorAdditional = 1.3;
  protected allFactorAdditional = 1;
  protected maxInterval = 99999;
  protected minEaseFactor = 1.3;

  protected defaultEaseFactor = 2.5;
  protected defaultCardInterval = 1;

  constructor(private userDictionaryRepository: UserDictionaryRepository) {}

  async processDrillGroup(userWord: UserDictionary, drillsGroup: Drill[]) {
    const firstCard = drillsGroup[0];
    const onlyWithAnswers = drillsGroup.filter((d) => d.isAnsweredCorrectly !== null);
    const totalPoints = sum(onlyWithAnswers.map((d) => d.trackPoints));
    const correctPoints = sum(onlyWithAnswers.filter((d) => d.isAnsweredCorrectly).map((d) => d.trackPoints));
    const correctPercent = (correctPoints / totalPoints) * 100;
    const averageAnswerTime = mean(onlyWithAnswers.map((d) => d.answerDuration));

    // Easy: correct (or no answer) for first card + >95% overall correct answers + average answer time <10 sec
    const cardAnswer = firstCard.isAnsweredCorrectly !== false && correctPercent > 95 && averageAnswerTime < 10000 ? CardAnswer.EASY : correctPercent > 80 ? CardAnswer.GOOD : correctPercent > 40 ? CardAnswer.HARD : CardAnswer.AGAIN;
    // console.log(userWord.id, cardAnswer);

    const review = await this.processAnswer(userWord, cardAnswer);

    let promises = [];
    promises.push(this.userDictionaryRepository.save(userWord));
    review.drills = drillsGroup;
    promises.push(review.save());

    await Promise.all(promises);
  }

  async processAnswer(userWord: UserDictionary, answer: number) {
    if (!userWord.drill_card) {
      userWord.drill_card = {};
    }
    const card = userWord.drill_card;

    if (!card.easeFactor) {
      card.easeFactor = this.defaultEaseFactor;
    }
    if (!card.interval) {
      card.interval = this.defaultCardInterval;
    }
    if (!card.countAnswers) {
      card.countAnswers = 0;
    }
    if (!card.consecutiveCorrectAnswers) {
      card.consecutiveCorrectAnswers = 0;
    }

    const review = new DrillReview();
    review.userWordId = userWord.id;
    review.date = new Date();
    review.answer = answer;
    review.oldInterval = card.interval;
    review.oldEaseFactor = card.easeFactor;

    card.countAnswers++;
    if (answer === CardAnswer.AGAIN) {
      card.consecutiveCorrectAnswers = 0;
    } else {
      card.consecutiveCorrectAnswers++;
    }

    card.interval = this.calculateInterval(card, answer);
    review.newInterval = card.interval;
    card.due = this.addDays(new Date(), card.interval).getTime() - 8 * 60 * 60 * 1000; // 8 hours earlier
    userWord.drill_due = new Date(card.due);

    card.easeFactor = this.calculateFactor(card, answer);
    review.newEaseFactor = card.easeFactor;

    userWord.drill_card = card;

    return review;
  }

  protected calculateFactor(card: UserDictionaryDrillCard, answer: number) {
    if (answer === CardAnswer.AGAIN) {
      return this.defaultEaseFactor;
    } else if (answer === CardAnswer.HARD) {
      return Math.max(this.minEaseFactor, card.easeFactor - 0.15);
    } else if (answer === CardAnswer.GOOD) {
      return Math.max(this.minEaseFactor, card.easeFactor);
    } else if (answer === CardAnswer.EASY) {
      return Math.max(this.minEaseFactor, card.easeFactor + 0.15);
    }

    return card.easeFactor;
  }

  protected calculateInterval(card: UserDictionaryDrillCard, answer: number, fuzz = true) {
    if (answer === CardAnswer.AGAIN) {
      return 1;
    }

    if (answer === CardAnswer.GOOD && card.consecutiveCorrectAnswers === 1) {
      return 1;
    }

    const delay = card.due ? this.diffDays(new Date(), new Date(card.due)) : 0;
    if (delay >= 0) {
      const intervalHard = this.constrainedInterval(card.interval * this.hardFactorForced, card.interval, fuzz);
      if (answer === CardAnswer.HARD) {
        return intervalHard;
      }

      const intervalGood = this.constrainedInterval((card.interval + delay / 2) * card.easeFactor, intervalHard, fuzz);
      if (answer === CardAnswer.GOOD) {
        return intervalGood;
      }

      const intervalEasy = this.constrainedInterval((card.interval + delay) * card.easeFactor * this.easyFactorAdditional, intervalGood, fuzz);
      if (answer === CardAnswer.EASY) {
        return intervalEasy;
      }
    } else {
      const elapsed = card.interval + delay;

      let easyBonus = 1;
      let minNewIntervalFactor = 1;
      let factor = 1;

      if (answer === CardAnswer.HARD) {
        factor = this.hardFactorForced;
        minNewIntervalFactor = factor / 2;
      } else if (answer === CardAnswer.GOOD) {
        factor = card.easeFactor;
      } else if (answer === CardAnswer.EASY) {
        factor = card.easeFactor;
        easyBonus = this.easyFactorAdditional - (this.easyFactorAdditional - 1) / 2;
      }

      let interval = Math.max(elapsed * factor, 1);
      interval = Math.max(card.interval * minNewIntervalFactor, interval) * easyBonus;
      interval = this.constrainedInterval(interval, 0, false);
      return interval;
    }
  }

  protected fuzzedInterval(interval: number) {
    let fuzz: number;
    if (interval < 2) {
      return this.randomInt(1, 1);
    } else if (interval === 2) {
      return this.randomInt(2, 3);
    } else if (interval < 7) {
      fuzz = Math.floor(interval * 0.25);
    } else if (interval < 30) {
      fuzz = Math.max(2, Math.floor(interval * 0.15));
    } else {
      fuzz = Math.max(4, Math.floor(interval * 0.05));
    }
    fuzz = Math.max(fuzz, 1);

    return this.randomInt(interval - fuzz, interval + fuzz);
  }

  protected constrainedInterval(interval: number, prev: number, fuzz: boolean) {
    interval = Math.floor(interval * this.allFactorAdditional);

    if (fuzz) {
      interval = this.fuzzedInterval(interval);
    }

    interval = Math.max(interval, prev + 1, 1);
    interval = Math.min(interval, this.maxInterval);

    return Math.floor(interval);
  }

  addDays(dateA: Date, numDays: number) {
    const date = new Date(dateA);
    date.setDate(date.getDate() + numDays);

    return date;
  }

  diffDays(dateA: Date, dateB: Date) {
    const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), 0, 0, 0, 0);
    const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), 0, 0, 0, 0);

    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
