import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent implements OnInit {

  @Input() status: boolean;

  @Output() onAddReport = new EventEmitter();
  @Output() closeModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  createModal() {

  }

}
