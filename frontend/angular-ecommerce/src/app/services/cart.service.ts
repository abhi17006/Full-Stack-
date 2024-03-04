import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //use Subject to publish events in our code
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }

  addToCart(theCartItem: CartItem){

    //check is item is already present in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined ; //type of CartItem or undefined

    if(this.cartItems.length > 0){
    //find the item in the cart based on the item id
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }


      //using array.find() method
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    
      //check if found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(existingCartItem instanceof CartItem){
      //increment the quanity
      existingCartItem.quanity++;

    }else{
      //add item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quanity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quanity;
    }

    //publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //debugging prupose
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantiry: ${totalQuantityValue}`);
    console.log('---------')
  }
}
