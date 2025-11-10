package com.example.sdt.web.dto;

import com.example.sdt.domain.PackageStatus;

import java.time.Instant;

public class PackageDto {
    private Long id;
    private String trackingCode;
    private PackageStatus status;
    private Double weightKg;
    private String pickupAddress;
    private String deliveryAddress;

    private Long courierId;       // poate fi null
    private Instant assignedAt;   // poate fi null
    private Instant deliveredAt;
    private Long senderCustomerId;

    //   --- Cosntructori---

    public PackageDto() {}

    // --- GETTERI + SETTERI

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public PackageStatus getStatus() { return status; }
    public void setStatus(PackageStatus status) { this.status = status; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Long getCourierId() { return courierId; }
    public void setCourierId(Long courierId) { this.courierId = courierId; }

    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }

    public Instant getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(Instant deliveredAt) { this.deliveredAt = deliveredAt; }

    public Long getSenderCustomerId() { return senderCustomerId; }
    public void setSenderCustomerId(Long senderCustomerId) { this.senderCustomerId = senderCustomerId; }
}
