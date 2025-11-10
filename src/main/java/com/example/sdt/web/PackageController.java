package com.example.sdt.web;

import com.example.sdt.domain.Courier;
import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.domain.PackageStatus;
import com.example.sdt.repo.CourierRepository;
import com.example.sdt.repo.CustomerRepository;
import com.example.sdt.repo.PackageRepository;
import com.example.sdt.web.dto.PackageCreateDto;
import com.example.sdt.web.dto.PackageDto;
import com.example.sdt.service.PackageCreateService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.net.URI;
import java.time.Instant;


@RestController
@RequestMapping("/api")
public class PackageController {
    private final PackageRepository packageRepo;
    private final CourierRepository courierRepo;
    private final PackageCreateService packageCreateService;
    private final CustomerRepository customerRepo;

    public PackageController(PackageRepository packageRepo, CourierRepository courierRepo, PackageCreateService packageCreateService, CustomerRepository customerRepo) {
        this.packageRepo = packageRepo;
        this.courierRepo = courierRepo;
        this.packageCreateService = packageCreateService;
        this.customerRepo = customerRepo;
    }

    // --- CREATE PACKAGE ---

    @PostMapping("/packages")
    public ResponseEntity<PackageDto> create(@Valid @RequestBody PackageCreateDto dto) {
        var sender = customerRepo.findById(dto.senderCustomerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sender customer not found"));

        PackageDelivery p = new PackageDelivery();
        p.setPickupAddress(dto.getPickupAddress());
        p.setDeliveryAddress(dto.getDeliveryAddress());
        p.setWeightKg(dto.getWeightKg());
        p.setSender(sender);


        String tracking = packageCreateService.generateUniqueTrackingCode();
        p.setTrackingCode(tracking);


        if (dto.courierId != null) {
            Courier c = courierRepo.findById(dto.courierId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Courier not found"));
            p.setCourier(c);
            p.setStatus(PackageStatus.PENDING);
            p.setAssignedAt(Instant.now());
        } else {
            p.setStatus(PackageStatus.NEW);
        }

        p = packageRepo.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(p));
    }

    @PostMapping("/customers/{customerId}/packages")
    public ResponseEntity<PackageDto> createForCustomer(@PathVariable Long customerId,
                                                        @Valid @RequestBody PackageCreateDto dto) {
        dto.senderCustomerId = customerId;
        return create(dto);
    }

    // --- GET BY ID (util pentru testare) ---

    @GetMapping("/packages/{id}")
    public PackageDto get(@PathVariable Long id) {
        PackageDelivery p = packageRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));
        return toDto(p);
    }
    @GetMapping("/customers/{customerId}/packages")
    public Page<PackageDto> listByCustomer(@PathVariable Long customerId, Pageable pageable) {
        if (!customerRepo.existsById(customerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        return packageRepo.findBySenderId(customerId, pageable).map(this::toDto);
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
    public Page<PackageDto> listByCourier(@PathVariable Long courierId, Pageable pageable) {
        if (!courierRepo.existsById(courierId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier not found");
        }
        return packageRepo.findByCourierId(courierId,pageable).map(this::toDto);
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
        d.setSenderCustomerId(p.getSender() == null ? null : p.getSender().getId());
        return d;
    }
}
