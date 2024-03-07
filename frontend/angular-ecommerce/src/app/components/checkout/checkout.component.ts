import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { every } from 'rxjs';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFromGroup!: FormGroup;

  totalPrice: number=0;
  totalQuantity: number= 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private formDataService: FormDataService
    ){}

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

    //populate credit card months
    const startMonth: number = new Date().getMonth() +1; //get current month JS months start with 0

    console.log("startMonth: "+ startMonth);
    this.formDataService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrived credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    //populate credit card years
    this.formDataService.getCreditCardYears().subscribe(
      data => {
        console.log("retrived credit card Years: "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
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

  //handleMonthsAndYears for user selected Year
  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFromGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.exipreYear);

    //if current year is selected year then start with current year

    let startMonth: number=0;
    //currentYear is not selected year then show month from 1
    if(currentYear !== selectedYear){
      startMonth = 1;
    }
    
    // if(currentYear !== selectedYear){
    //   startMonth = new Date().getMonth() + 1; //show only
    // }
    // else{
    //   startMonth = 1;
    // }

    this.formDataService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("retrived credit card months: "+ JSON.stringify(data));
          this.creditCardMonths = data;
        }
    )
  }
}
