import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';



@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, private phttpservice : ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + 'dishes').
    pipe(catchError(this.phttpservice.handleError));
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id).
    pipe(catchError(this.phttpservice.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.phttpservice.handleError));
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)));
  }

  putDish(dish : Dish) : Observable<Dish>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    }
    return this.http.put<Dish>(baseURL + 'dishes/' + dish.id, dish, httpOptions)
            .pipe(catchError(this.phttpservice.handleError))
  }
}
