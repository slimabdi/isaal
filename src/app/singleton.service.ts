import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SingletonService {

  currentPage = {}
  posts = {}
  postsPages = {}

  current_screen_width;
  current_screen_height;
  
  //screen sizes:
  SCREEN_4K = 3800
  SCREEN_2K = 2500
  SCREEN_FULL_HD = 1900
  SCREEN_HD = 1200
  SCREEN_MEDIUM = 760
  SCREEN_TABLET = 570
  SCREEN_PHONE = 320

  constructor() {
    this.current_screen_width = window.innerWidth;
    this.current_screen_height = window.innerHeight;
    document.documentElement.style.setProperty("--current_screen_width", this.current_screen_width+'px');
    document.documentElement.style.setProperty("--current_screen_height", this.current_screen_height+'px');
  }

 

  getWindowSize(){
    let innerWidth = window.innerWidth;

    if(innerWidth >= this.SCREEN_FULL_HD)
    {
      return {
        'dialog': {
          x: '1200px', 
          y: '800px'
        },
        'benchmark_table_row_height': 50
      }
    }
    else if(innerWidth < this.SCREEN_FULL_HD && innerWidth >= this.SCREEN_HD)
    {
      return {
        'dialog': {
          x: '850px', 
          y: '650px'
        },
        'benchmark_table_row_height': 70
      }
    }
    else if(innerWidth < this.SCREEN_HD && innerWidth >= this.SCREEN_TABLET)
    {
      return {
        'dialog': {
          x: '600px', 
          y: '400px'
        },
        'benchmark_table_row_height': 70
      }
    }
    else if(innerWidth < this.SCREEN_TABLET && innerWidth >= this.SCREEN_PHONE)
    {
      return {
        'dialog': {
          x: '250px', 
          y: '300px'
        },
        'benchmark_table_row_height': 70
      }
    }
      
  }

  reset(){
    this.currentPage = {}
    this.posts = {}
    this.postsPages = {}
  }
  
}
