package com.example.sdt.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PackageCreateDto {


    @NotBlank
    private String pickupAddress;

    @NotBlank
    private String deliveryAddress;

    private Double weightKg;

    public Long courierId;
    @NotNull
    public Long senderCustomerId;

    //  ---CONSTRUCTOR---

    public PackageCreateDto() {}

    //  ---GETTERI+SETTERI


    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public Long getCourierId() {
        return courierId;
    }

    public void setCourierId(Long courierId) {
        this.courierId = courierId;
    }

    public Long getSenderCustomerId() {
        return senderCustomerId;
    }

    public void setSenderCustomerId(Long senderCustomerId) {
        this.senderCustomerId = senderCustomerId;
    }
}
