package com.ecommercewebsite.dto;

import com.ecommercewebsite.entity.Address;
import com.ecommercewebsite.entity.Customer;
import com.ecommercewebsite.entity.Order;
import com.ecommercewebsite.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
