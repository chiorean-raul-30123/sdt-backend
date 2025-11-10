package com.example.sdt.web.dto;

import com.example.sdt.domain.CustomerType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CustomerCreateDto {
    public CustomerType type = CustomerType.PERSON;

    @NotBlank
    @Size(max = 160)
    public String name;

    @Size(max = 160)
    public String contactPerson;

    @Email
    @Size(max = 160)
    public String email;

    @Size(max = 40)
    public String phone;

    @Size(max = 255)
    public String defaultPickupAddress;

    @Size(max = 255)
    public String defaultDeliveryAddress;
}
