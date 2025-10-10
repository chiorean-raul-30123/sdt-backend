package com.example.sdt.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CourierDto{
    private Long id;

    @NotBlank
    private String name;

    @Email @NotBlank
    private String email;

    private Long managerId;

    private Double lastLat;
    private Double lastLng;

    //  ---CONSTRUCTOR---
    public CourierDto() {}

    //  ---GETTERI+SETTERI

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }
    public Double getLastLat() { return lastLat; }
    public void setLastLat(Double lastLat) { this.lastLat = lastLat; }
    public Double getLastLng() { return lastLng; }
    public void setLastLng(Double lastLng) { this.lastLng = lastLng; }
}