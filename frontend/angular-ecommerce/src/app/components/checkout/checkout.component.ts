import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { every } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFromGroup!: FormGroup;

  totalPrice: number=0;
  totalQuantity: number= 0;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipcode: [''],
        country: [''],
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipcode: [''],
        country: [''],
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        exipreMonth: [''],
        exipreYear: ['']
      }),
    });
  }

  onSubmit(){
    console.log("values: ");
    console.log(this.checkoutFromGroup.get('customer')?.value);
  }

  //checkBox method
  copyShippingAddToBillingAdd(event:any) {
    //if checkbox is checked then copy shiiping address to billing address
    if(event.target.checked){
      this.checkoutFromGroup.controls['billingAddress']
                .setValue(this.checkoutFromGroup.controls['shippingAddress'].value);
    }else{
      //reset data to empty
      this.checkoutFromGroup.controls['billingAddress'].reset();
    }
  }
}
