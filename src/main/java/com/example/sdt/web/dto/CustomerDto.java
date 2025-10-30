package com.example.sdt.web.dto;

import com.example.sdt.domain.CustomerType;
import java.time.Instant;

public class CustomerDto {
    private Long Id;
    private CustomerType customerType;
    private String name;
    private String email;
    private String contactPerson;
    private String phone;
    private String defaultPickupAddress;
    private String defaultDeliveryAddress;
    private Instant createdAt = Instant.now();

    //  -----GETTERI+SETTERI-------

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDefaultPickupAddress() {
        return defaultPickupAddress;
    }

    public void setDefaultPickupAddress(String defaultPickupAddress) {
        this.defaultPickupAddress = defaultPickupAddress;
    }

    public String getDefaultDeliveryAddress() {
        return defaultDeliveryAddress;
    }

    public void setDefaultDeliveryAddress(String defaultDeliveryAddress) {
        this.defaultDeliveryAddress = defaultDeliveryAddress;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
