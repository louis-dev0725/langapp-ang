import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
})
export class ProgressCircleComponent implements OnInit {
  @Input() color = '#00c853';
  @Input() bgColor = '#e6e6e6';
  @Input() percent = 100;
  @Input() size = 100;
  @Input() styleClass = '';

  constructor() {}

  ngOnInit(): void {}
}
