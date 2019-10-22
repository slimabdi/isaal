import { Directive, ElementRef, Input, Renderer2, OnInit, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[reportGrid]'
})
export class ReportGridDirective implements AfterViewInit {

  @Input() x:string;
  @Input() y:string;
  @Input() cols:string;
  @Input() rows:string;

  constructor(private el: ElementRef, private render: Renderer2) { }


  ngAfterViewInit(){

    this.render.setStyle(this.el.nativeElement, 'top', `${parseInt(this.y)*90}px`);
    this.render.setStyle(this.el.nativeElement, 'left', `${parseInt(this.x)*90}px`);
    this.render.setStyle(this.el.nativeElement, 'width', `${parseInt(this.cols)*85}px`);
    this.render.setStyle(this.el.nativeElement, 'height', `${parseInt(this.rows)*85}px`);
    // this.render.setStyle(this.el.nativeElement, 'margin', `10px`);
  }

}

//srcX / srcY / dstX / dstY