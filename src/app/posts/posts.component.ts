import { Component, OnInit, Inject, OnChanges, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts = []
  postsPages = {}
  date

  constructor(private dialogref: MatDialogRef<PostsComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private singleton: SingletonService
            ) { }

  ngOnInit() {
    this.date = this.data[0];
    
    if(this.singleton.posts[this.date]){
      
      Object.keys(this.singleton.posts[this.date]).forEach(post => {
        console.log('posts_list:', Object.values(this.singleton.posts[this.date][post])[0]);
        this.posts.push(Object.values(this.singleton.posts[this.date][post])[0])
      })
    }

    this.postsPages = this.singleton.postsPages;

  }

}
