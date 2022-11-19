import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  template: '',
})
export class SvgIconComponent implements OnInit, OnChanges {
  @Input() icon: any;
  @Input() width: number | string;
  @Input() height: number | string;

  constructor(private domSanitizer: DomSanitizer, private elRef: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.elRef.nativeElement) {
        this.elRef.nativeElement.innerHTML = this.icon.body;
        if (this.elRef.nativeElement.children[0]) {
          let svg = this.elRef.nativeElement.children[0];

          svg.setAttribute('width', this.width);
          svg.setAttribute('height', this.height);
        }
      }
    }
  }
}
