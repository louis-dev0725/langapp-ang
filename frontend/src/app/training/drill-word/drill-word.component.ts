import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingQuestionCard } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';

@Component({
  selector: 'app-drill-word',
  templateUrl: './drill-word.component.html',
  styleUrls: ['./drill-word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillWordComponent implements OnInit {
  @Input() card: TrainingQuestionCard;
  @Input() isAnswered: boolean = false;

  icons = {
    editIcon,
  };

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  playAudio(source: string) {
    const audio = new Audio();
    audio.src = source;
    audio.load();
    audio.play();
  }

  goToInfoCard(route: string) {
    const [card, id] = route.split('_');
    this.router.navigate(['training', card === 'wordInfo' ? 'word-info' : 'kanji-info', id]);
  }
}
