import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  //update with https url using ENviroments
  private purchaseUrl = environment['luv2shopApiUrl'] + '/checkout/purchase';

  // private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
