package com.example.sdt.repo;

import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.domain.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackageRepository extends JpaRepository<PackageDelivery, Long> {
    List<PackageDelivery> findByCourierId(Long courierId);
    List<PackageDelivery> findByStatus(PackageStatus status);
    Optional<PackageDelivery> findByTrackingCode(String trackingCode);
}