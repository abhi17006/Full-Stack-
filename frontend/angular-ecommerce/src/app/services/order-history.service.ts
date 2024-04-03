import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  //update with https url from envirmonments
  private orderUrl = environment['luv2shopApiUrl'] + '/orders';

  // private orderUrl = 'http://localhost:8443/api/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{
   
    //set url for customer email method
    const OrderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(OrderHistoryUrl);
  }

}

interface GetResponseOrderHistory{
  //unwrap the JSON from Spring Data Rest _embedded entry
  _embedded:{
    orders: OrderHistory[];
  }
}
