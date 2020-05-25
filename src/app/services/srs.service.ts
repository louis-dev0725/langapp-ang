import { Injectable } from '@angular/core';

import { Card, CardReview } from '@app/interfaces/common.interface';


@Injectable({
  providedIn: 'root'
})
export class SrsService {
  protected hardFactorForced = 1.2;
  protected easyFactorAdditional = 1.3;
  protected allFactorAdditional = 1;
  protected maxInterval = 99999;
  protected minEaseFactor = 1.3;

  protected defaultEaseFactor = 2.5;
  protected defaultCardInterval = 1;

  cardAnswer = {
    AGAIN: 1,
    HARD: 2,
    GOOD: 3,
    EASY: 4
  };

  cardStatus = {
    New: 0,
    Learning: 1,
    Review: 2,
    Relearning: 3
  };

  processAnswer(card: Card, answer: number) {
    const review: CardReview = {
      answer: 0,
      date: undefined,
      newEaseFactor: 0,
      newInterval: 0,
      oldEaseFactor: 0,
      oldInterval: 0
    };

    review.date = new Date();
    review.answer = answer;
    review.oldInterval = card.interval;
    review.oldEaseFactor = card.easeFactor;

    if (answer === this.cardAnswer.AGAIN) {
      card.consecutiveCorrectAnswers = 0;
    } else {
      card.consecutiveCorrectAnswers++;
    }

    if (!card.easeFactor) {
      card.easeFactor = this.defaultEaseFactor;
    }
    if (!card.interval) {
      card.interval = this.defaultCardInterval;
    }

    card.interval = this.calculateInterval(card, answer);
    review.newInterval = card.interval;
    card.due = this.addDays(new Date(), card.interval);

    card.easeFactor = this.calculateFactor(card, answer);
    review.newEaseFactor = card.easeFactor;

    card.reviews.push(review);

    return card;
  }

  protected calculateCardStatus(card: Card, answer: number) {
    if (card.consecutiveCorrectAnswers > 1) {
      return this.cardStatus.Review;
    } else if (card.status === this.cardStatus.Review || card.status === this.cardStatus.Relearning) {
      return this.cardStatus.Relearning;
    } else {
      return this.cardStatus.Learning;
    }
  }

  protected calculateFactor(card: Card, answer: number) {
    if (answer === this.cardAnswer.AGAIN) {
      return this.defaultEaseFactor;
    } else if (answer === this.cardAnswer.HARD) {
      return Math.max(this.minEaseFactor, card.easeFactor - 0.15);
    } else if (answer === this.cardAnswer.GOOD) {
      return Math.max(this.minEaseFactor, card.easeFactor);
    } else if (answer === this.cardAnswer.EASY) {
      return Math.max(this.minEaseFactor, card.easeFactor + 0.15);
    }

    return card.easeFactor;
  }

  protected calculateInterval(card: Card, answer: number, fuzz = true) {
    if (answer === this.cardAnswer.AGAIN) {
      return 1;
    }

    if (answer === this.cardAnswer.GOOD && card.consecutiveCorrectAnswers === 1) {
      return 1;
    }

    const delay = card.due ? this.diffDays(new Date(), card.due) : 0;
    if (delay >= 0) {
      const intervalHard = this.constrainedInterval(card.interval * this.hardFactorForced, card.interval, fuzz);
      if (answer === this.cardAnswer.HARD) {
        return intervalHard;
      }

      const intervalGood = this.constrainedInterval((card.interval + delay / 2) * card.easeFactor, intervalHard,
        fuzz);
      if (answer === this.cardAnswer.GOOD) {
        return intervalGood;
      }

      const intervalEasy = this.constrainedInterval((card.interval + delay) * card.easeFactor *
        this.easyFactorAdditional, intervalGood, fuzz);
      if (answer === this.cardAnswer.EASY) {
        return intervalEasy;
      }
    } else {
      const elapsed = card.interval + delay;

      let easyBonus = 1;
      let minNewIntervalFactor = 1;
      let factor = 1;

      if (answer === this.cardAnswer.HARD) {
        factor = this.hardFactorForced;
        minNewIntervalFactor = factor / 2;
      } else if (answer === this.cardAnswer.GOOD) {
        factor = card.easeFactor;
      } else if (answer === this.cardAnswer.EASY) {
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

  addDays (dateA: Date, numDays: number) {
    const date = new Date(dateA);
    date.setDate(date.getDate() + numDays);

    return date;
  }

  subtractDays (dateA: Date, numDays: number) {
    const date = new Date(dateA);
    date.setDate(date.getDate() - numDays);

    return date;
  }

  diffDays (dateA: Date, dateB: Date) {
    const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), 0, 0, 0, 0);
    const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), 0, 0, 0, 0);

    return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
