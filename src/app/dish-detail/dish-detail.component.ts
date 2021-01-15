import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

import { DishService } from '../services/dish.service';
import { visibility, flyInOut, expand } from '../animations/app.animation'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
      'style' : 'display : block;'
},
  animations: [visibility(), flyInOut(), expand()]
})
export class DishDetailComponent implements OnInit {

  //baseU: string = 'http://localhost:3000/';
  commentForm: FormGroup;

  date = new Date();
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMsg : string;
  dishCopy : Dish
  visibility = 'shown';


  comment: Comment;
  formErrors = {
    'author': '',
    'comment':''
  };

  validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.'
    },
    'comment':{
      'required': 'Comment is required'
    },
  };

  @ViewChild('cform') commentFormDirective;

  constructor(private fb : FormBuilder,
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') private BaseURL) {

     this.createForm()
     }

     createForm(){
       this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2)] ],
        comment: ['', [Validators.required] ],
        rating: [5]
       })
       this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

        this.onValueChanged();
     }
     onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    onComment() {
      this.comment = this.commentForm.value;
      this.comment.date=''+new Date();
      console.log(this.comment);
      let id=this.route.snapshot.params['id'];
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5,

      });
      this.dishservice.getDish(id).subscribe(dish=>this.dish=dish);
      this.dish.comments.push(this.comment);
      this.dishservice.putDish(this.dishCopy).subscribe( dish => {
        this.dish = dish;
        this.dishCopy = dish;
      }, errmess => {this.errMsg = <any>errmess; this.dish = null; this.dishCopy = null})
      this.commentFormDirective.resetForm();
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
         errmess => this.errMsg = <any>errmess);
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }

}
