package com.example.sdt.web;

import com.example.sdt.domain.Courier;
import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.domain.PackageStatus;
import com.example.sdt.repo.CourierRepository;
import com.example.sdt.repo.PackageRepository;
import com.example.sdt.web.dto.PackageCreateDto;
import com.example.sdt.web.dto.PackageDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.time.Instant;
import java.util.List;
@RestController
@RequestMapping("/api")
public class PackageController {
    private final PackageRepository packageRepo;
    private final CourierRepository courierRepo;

    public PackageController(PackageRepository packageRepo, CourierRepository courierRepo) {
        this.packageRepo = packageRepo;
        this.courierRepo = courierRepo;
    }

    // --- CREATE PACKAGE ---

    @PostMapping("/packages")
    public ResponseEntity<PackageDto> create(@Valid @RequestBody PackageCreateDto dto) {
        packageRepo.findByTrackingCode(dto.getTrackingCode()).ifPresent(p -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tracking code already exists");
        });

        PackageDelivery p = new PackageDelivery();
        p.setTrackingCode(dto.getTrackingCode());
        p.setPickupAddress(dto.getPickupAddress());
        p.setDeliveryAddress(dto.getDeliveryAddress());
        p.setWeightKg(dto.getWeightKg());
        p.setStatus(PackageStatus.NEW);

        PackageDelivery saved = packageRepo.save(p);
        PackageDto out = toDto(saved);
        return ResponseEntity.created(URI.create("/api/packages/" + saved.getId())).body(out);
    }

    // --- GET BY ID (util pentru testare) ---

    @GetMapping("/packages/{id}")
    public PackageDto get(@PathVariable Long id) {
        PackageDelivery p = packageRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
        return toDto(p);
    }

    // --- ASSIGN PACKAGE TO COURIER ---

    @PostMapping("/packages/{id}/assign")
    @Transactional
    public PackageDto assign(@PathVariable Long id, @RequestParam Long courierId) {
        PackageDelivery p = packageRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        Courier c = courierRepo.findById(courierId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier not found"));

        if (p.getStatus() == PackageStatus.DELIVERED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Package already delivered");
        }

        p.setStatus(PackageStatus.PENDING);
        p.setCourier(c);
        p.setAssignedAt(Instant.now());

        return toDto(p);
    }

    // --- DELIVER PACKAGE ---
    @PostMapping("/packages/{id}/deliver")
    @Transactional
    public PackageDto deliver(@PathVariable Long id) {
        PackageDelivery p = packageRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        if (p.getStatus() == PackageStatus.DELIVERED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Package already delivered");
        }
        if (p.getStatus() != PackageStatus.PENDING) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Package must be PENDING to be delivered");
        }

        p.setStatus(PackageStatus.DELIVERED);
        p.setDeliveredAt(Instant.now());

        return toDto(p);
    }

    // --- LIST PACKAGES FOR A COURIER ---

    @GetMapping("/couriers/{courierId}/packages")
    public List<PackageDto> listByCourier(@PathVariable Long courierId) {
        if (!courierRepo.existsById(courierId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier not found");
        }
        return packageRepo.findByCourierId(courierId).stream().map(this::toDto).toList();
    }

    // --- helper: mapare entitate -> DTO ---

    private PackageDto toDto(PackageDelivery p) {
        PackageDto d = new PackageDto();
        d.setId(p.getId());
        d.setTrackingCode(p.getTrackingCode());
        d.setStatus(p.getStatus());
        d.setWeightKg(p.getWeightKg());
        d.setPickupAddress(p.getPickupAddress());
        d.setDeliveryAddress(p.getDeliveryAddress());
        d.setCourierId(p.getCourier() == null ? null : p.getCourier().getId());
        d.setAssignedAt(p.getAssignedAt());
        d.setDeliveredAt(p.getDeliveredAt());
        return d;
    }
}
