package com.example.sdt.repo;

import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.domain.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

public interface PackageRepository extends JpaRepository<PackageDelivery, Long> {
    Page<PackageDelivery> findByCourierId(Long courierId, Pageable pageable);
    List<PackageDelivery> findByStatus(PackageStatus status);
    Optional<PackageDelivery> findByTrackingCode(String trackingCode);
    boolean existsByTrackingCode(String trackingCode);
    Page<PackageDelivery> findBySenderId(Long senderId, Pageable pageable);
    long countBySenderId(Long senderId);
}