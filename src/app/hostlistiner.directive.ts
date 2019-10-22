import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';
import {Configuration} from "./configuration"
@Directive({
  selector: '[appHostlistiner]',
})
export class HostlistinerDirective {

  constructor(public configuration :Configuration , private el: ElementRef, private renderer: Renderer) { }


  @HostListener('mouseover') onMouseOver() {
   this.configuration.filname.found = false;
   this.configuration.pagname.found = true;
  }
/* 
  @HostListener('click') onClick() {
    window.alert('Host Element Clicked');
  } */

  @HostListener('mouseleave') onMouseLeave() {
    if(this.configuration.url !=''){
      this.configuration.filname.found = false;
      this.configuration.pagname.found = true ;
      this.configuration.nameicone.found = true
    }
    else{
      this.configuration.filname.found = true;
      this.configuration.pagname.found = false ;
      this.configuration.nameicone.found = false;
    }

  }


  ChangeBgColor(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'color', color);
  }


}
