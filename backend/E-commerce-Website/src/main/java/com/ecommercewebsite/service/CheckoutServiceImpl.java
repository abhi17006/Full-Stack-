package com.ecommercewebsite.service;

import com.ecommercewebsite.dao.CustomerRepository;
import com.ecommercewebsite.dto.PaymentInfo;
import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;
import com.ecommercewebsite.entity.Customer;
import com.ecommercewebsite.entity.Order;
import com.ecommercewebsite.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    //@Autowired//use when we have multiple constructors
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.secretKey}") String secretKey ) //import from application.properties
    {
        this.customerRepository = customerRepository;
        //initialize stripe api with secret key
        Stripe.apiKey = secretKey;
    }



    @Override
    @Transactional
    //save order into DataBase
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item) );

        //populate and set order with billingAddress and ShippingAddress
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //check id customer already exists
        String theEMail = customer.getEmail();

        //find current customer from customer Table
        Customer customerFromDB = customerRepository.findByEmail(theEMail);
        if(customerFromDB != null){
            //found then assign
            customer = customerFromDB;
        }
        customer.add(order);

        //save toDB
        customerRepository.save(customer);
        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    //implement PaymentIntent method
    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) {

        //method types list
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        //map of amount, currency, methodtypes
        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        try {
            return PaymentIntent.create(params);
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateOrderTrackingNumber() {
        //generate a random UUID number
        //

        return UUID.randomUUID().toString();
    }
}
