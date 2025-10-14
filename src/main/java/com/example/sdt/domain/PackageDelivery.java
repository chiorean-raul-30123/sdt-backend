package com.example.sdt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "packages", indexes = {
        @Index(name = "ix_packages_tracking_code", columnList = "tracking_code", unique = true),
        @Index(name = "ix_packages_status", columnList = "status")
})
public class PackageDelivery {

    //---VARIABILELE INITIALE

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "tracking_code", nullable = false, unique = true, length = 40)
    private String trackingCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PackageStatus status = PackageStatus.NEW;

    private Double weightKg;

    @NotBlank
    @Column(nullable = false)
    private String pickupAddress;

    @NotBlank
    @Column(nullable = false)
    private String deliveryAddress;


    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id")
    private Courier courier;

    private Instant assignedAt;
    private Instant deliveredAt;

    // ---CONSTRUCTORI---
    public PackageDelivery() {}


    // ---GETTERI+SETTERI
    public Long getId() { return id; }
    public String getTrackingCode() { return trackingCode; }
    public PackageStatus getStatus() { return status; }
    public Double getWeightKg() { return weightKg; }
    public String getPickupAddress() { return pickupAddress; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public Courier getCourier() { return courier; }
    public Instant getAssignedAt() { return assignedAt; }
    public Instant getDeliveredAt() { return deliveredAt; }

    public void setId(Long id) { this.id = id; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }
    public void setStatus(PackageStatus status) { this.status = status; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setCourier(Courier courier) { this.courier = courier; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
    public void setDeliveredAt(Instant deliveredAt) { this.deliveredAt = deliveredAt; }
}
