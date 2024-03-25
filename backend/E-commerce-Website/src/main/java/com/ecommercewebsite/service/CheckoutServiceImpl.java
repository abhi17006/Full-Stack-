package com.ecommercewebsite.service;

import com.ecommercewebsite.dao.CustomerRepository;
import com.ecommercewebsite.dto.Purchase;
import com.ecommercewebsite.dto.PurchaseResponse;
import com.ecommercewebsite.entity.Customer;
import com.ecommercewebsite.entity.Order;
import com.ecommercewebsite.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    //@Autowired//use when we have multiple constructors
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
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

    private String generateOrderTrackingNumber() {
        //generate a random UUID number
        //

        return UUID.randomUUID().toString();
    }
}
