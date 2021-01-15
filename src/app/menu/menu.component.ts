import { Component, Inject, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service'
import { flyInOut, expand } from '../animations/app.animation'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'], 
  host: {
      '[@flyInOut]': 'true',
        'style' : 'display : block'
  },
  animations: [
    flyInOut(), expand()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  ///baseU: string = 'http://localhost:3000/';
  errMsg : string;


  constructor(private dishService : DishService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
      .subscribe((dishes) => this.dishes = dishes,
      errmess => this.errMsg = <any>errmess)
  }


}
