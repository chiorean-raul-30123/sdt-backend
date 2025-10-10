package com.example.sdt.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PackageCreateDto {
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}\\d{10}$", message = "trackingCode must be like RO1234567890")
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
