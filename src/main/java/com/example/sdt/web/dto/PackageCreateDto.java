package com.example.sdt.web.dto;

import jakarta.validation.constraints.NotBlank;

public class PackageCreateDto {
    @NotBlank
    private String trackingCode;

    @NotBlank
    private String pickupAddress;

    @NotBlank
    private String deliveryAddress;

    private Double weightKg;

    //  ---CONSTRUCTOR---

    public PackageCreateDto() {}

    //  ---GETTERI+SETTERI

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
}
