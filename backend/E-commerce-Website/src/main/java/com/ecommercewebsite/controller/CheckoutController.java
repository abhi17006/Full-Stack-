package com.ecommercewebsite.controller;

import com.ecommercewebsite.dto.PaymentInfo;
import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;
import com.ecommercewebsite.service.CheckoutService;
import com.stripe.model.PaymentIntent;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;


@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    //setup logger
    private Logger logger = Logger.getLogger(getClass().getName());
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
        //logger.info("paymentInfo.amount : "+paymentInfo.getAmount());
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);

        String paymentstr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentstr, HttpStatus.OK);
    }
}
