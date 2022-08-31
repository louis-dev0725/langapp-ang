import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TrainingQuestionCard } from '@app/interfaces/common.interface';
import { AudioService } from '@app/services/audio.service';
import { CardsService } from '../cards/cards.service';

@Component({
  selector: 'app-type-word-with-buttons',
  templateUrl: './type-word-with-buttons.component.html',
  styleUrls: ['./type-word-with-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeWordWithButtonsComponent implements OnInit {
  @Input()
  card: TrainingQuestionCard;

  usedButtons: number[] = [];
  enteredAnswerArray = [];
  activeInputIndex = 0;
  isInComposeMode = false;
  isFocused = false;
  @ViewChild('input', { static: true })
  inputEl: ElementRef;

  _isAnswered: boolean;

  get isAnswered() {
    return this._isAnswered;
  }
  @Output()
  isAnsweredChange = new EventEmitter<boolean>();
  @Input() set isAnswered(newValue: boolean) {
    this._isAnswered = newValue;
    this.isAnsweredChange.emit(newValue);
  }

  _isAnsweredCorrectly: boolean;
  get isAnsweredCorrectly() {
    return this._isAnsweredCorrectly;
  }
  @Output()
  isAnsweredCorrectlyChange = new EventEmitter<boolean>();
  @Input() set isAnsweredCorrectly(newValue: boolean) {
    this._isAnsweredCorrectly = newValue;
    this.isAnsweredCorrectlyChange.emit(newValue);
  }

  _enteredAnswer: string;
  get enteredAnswer() {
    return this._enteredAnswer;
  }
  @Output()
  enteredAnswerChange = new EventEmitter<string>();
  @Input() set enteredAnswer(newValue: string) {
    this._enteredAnswer = newValue;
    this.enteredAnswerChange.emit(newValue);
  }

  constructor(private cardsService: CardsService, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {}

  typeFromButton(index: number, value: string) {
    let el = <HTMLInputElement>this.inputEl.nativeElement;
    this.usedButtons[index] = el.value.length;
    el.value += value;
    el.focus();
    this.checkInput();
    this.updateUsedButtons();
  }

  onFocus(event: Event) {
    this.isFocused = true;
    this.checkInput();
  }

  onBlur(event: Event) {
    this.isFocused = false;
    this.checkInput();
  }

  onInput(event: Event) {
    this.checkInput();
    this.updateUsedButtons();
  }

  checkInput() {
    let letters = (<HTMLInputElement>this.inputEl?.nativeElement)?.value?.split('') ?? '';
    this.activeInputIndex = -1;
    let expectedLength = this.card.question.buttons.length;
    for (let i = 0; i < expectedLength; i++) {
      this.enteredAnswerArray[i] = letters[i] ?? '';
      if (this.isFocused && this.activeInputIndex == -1 && (!letters[i] || i == expectedLength - 1)) {
        // If previous letter is not finished (when using IME)
        if (this.isInComposeMode && letters[i - 1] && this.removeKana(letters[i - 1])) {
          this.activeInputIndex = i - 1;
        } else {
          this.activeInputIndex = i;
        }
      }
    }
    this.enteredAnswer = this.enteredAnswerArray.join('');
    this.cd.markForCheck();
    this.submitIfNeed();
  }

  updateUsedButtons() {
    if (this.usedButtons.filter((b) => b != null).length != this.enteredAnswer.length) {
      let letters = this.enteredAnswer.split('');
      let newUsedButtons = [];
      for (let [i, currentLetter] of this.card.question.buttons.entries()) {
        if (this.usedButtons[i] != null && letters[this.usedButtons[i]] == currentLetter) {
          newUsedButtons[i] = this.usedButtons[i];
        }
      }

      for (let [i, currentLetter] of this.card.question.buttons.entries()) {
        if (this.usedButtons[i] == null) {
          let index = letters.findIndex((letterValue, letterIndex) => letterValue == currentLetter && newUsedButtons.indexOf(letterIndex) == -1);
          if (index != -1) {
            newUsedButtons[i] = index;
          }
        }
      }

      this.usedButtons = newUsedButtons;
      this.cd.markForCheck();
    }
  }

  onBeforeInput(event: InputEvent) {
    if (!this.isInComposeMode && event.data && this.enteredAnswer && this.enteredAnswer.length + event.data?.length > this.card.question?.buttons?.length) {
      event.preventDefault();
    }
  }

  removeKana(text: string): string {
    const kanaRegexp = /[\u3040-\u309F\u30A0-\u30FF]/g;
    return text.replace(kanaRegexp, '');
  }

  onCompositionStart(event: CompositionEvent) {
    this.isInComposeMode = true;
  }

  onCompositionEnd(event: CompositionEvent) {
    this.isInComposeMode = false;
    this.submitIfNeed();
  }

  submitIfNeed() {
    if (!this.isInComposeMode && this.card.question?.buttons) {
      if (this.enteredAnswer.length === this.card.question.buttons.length && this.removeKana(this.enteredAnswer).length == 0) {
        this.isAnswered = true;
        this.isAnsweredCorrectly = this.card.question.correctAnswers.indexOf(this.enteredAnswer) !== -1;
        this.cardsService.answerCard(this.isAnsweredCorrectly);
        this.cd.markForCheck();
      }
    }
  }
}
