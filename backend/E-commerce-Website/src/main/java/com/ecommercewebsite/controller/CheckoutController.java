package com.ecommercewebsite.controller;

import com.ecommercewebsite.dto.PaymentInfo;
import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;
import com.ecommercewebsite.service.CheckoutService;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo){

        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);

        String paymentstr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentstr, HttpStatus.OK);
    }
}
