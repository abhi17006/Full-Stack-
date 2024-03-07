import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data : number[] = [];

    //build an array for "Month" dropdown list
    // -start at current month, loop unti;

    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    
    //wrap object as an observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data : number[] = [];

    //build an array for "Year" dropdown list
    // -start at current year, loop until

    //get current Year from Data()
    const startYear : number = new Date().getFullYear();
    const endYear: number = startYear + 10; //shows next 10 years

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    
    //wrap object as an observable
    return of(data);
  }
}
