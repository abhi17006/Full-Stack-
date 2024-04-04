package com.ecommercewebsite.service;

import com.ecommercewebsite.dto.PaymentInfo;
import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo);
}
