import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //use Subject to publish events in our code
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); //changing subject to BehavioralSubject initial value =0
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //assign session storage object
  //storage: Storage = sessionStorage;
  
  //assign local storage object
  storage: Storage = localStorage;

  constructor() { 
    //read data from storage
    /*
    read JSON string from cartItems and convert into Object
    */
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if(data != null){
      this.cartItems = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  persistCartItems(){
    //set the item with 'cartItems' and value this.cartItems convert object into JSON string
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

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

    //call persist method
    this.persistCartItems();

    //debugging prupose
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantiry: ${totalQuantityValue}`);
    console.log('---------')
  }

  decrementItemCartQty(theCartItem: CartItem){
    //decrement quantity
    theCartItem.quanity--;

    //check item is 0 or not
    if(theCartItem.quanity === 0){
      this.remove(theCartItem); //call remove method
    }else{
      this.computeCartTotals();
    }
  }
  //remove method
  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    //if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);//remove item 1 from curr index

      this.computeCartTotals();
    }
  }

  
}
