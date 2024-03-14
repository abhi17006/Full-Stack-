package com.ecommercewebsite.service;

import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
