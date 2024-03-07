import { Injectable } from '@angular/core';
import { Observable, map, of, retry } from 'rxjs';
import { Country } from '../common/country';
import { HttpClient } from '@angular/common/http';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl='http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

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

  //create getCountries method
  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      //access embedded from interface which has response from URL
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{

    //search url find by country code
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
