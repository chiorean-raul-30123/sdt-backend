package com.example.sdt.repo;

import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.domain.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageRepository extends JpaRepository<PackageDelivery, Long> {
    List<PackageDelivery> findByCourierId(Long courierId);
    List<PackageDelivery> findByStatus(PackageStatus status);
}