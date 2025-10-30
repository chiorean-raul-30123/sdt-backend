package com.example.sdt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import java.time.Instant;

@Entity
@Table(
        name = "customer",
        indexes = {
                @Index(name = "ix_customer_email", columnList = "email")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_customer_external_id", columnNames = {"external_id"})
        }
)
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column
    @Enumerated(EnumType.STRING)
    private CustomerType customerType = CustomerType.PERSON;

    @Column(nullable = false)
    private String name;

    @Column
    @Email
    private String email;

    @Column
    private String contactPerson;

    @Column
    private String phone;

    @Column
    private String defaultPickupAddress;

    @Column
    private String defaultDeliveryAddress;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();


    // ------ Getteri+SETTEri


    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        this.Id = id;
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

    public void setType(CustomerType type) {
        this.customerType = type;
    }
}
