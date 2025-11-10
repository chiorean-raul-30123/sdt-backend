package com.example.sdt.web;

import com.example.sdt.domain.Courier;
import com.example.sdt.repo.CourierRepository;
import com.example.sdt.web.dto.CourierDto;
import com.example.sdt.web.dto.CourierPatchDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/couriers")
public class CourierController {

    private final CourierRepository courierRepo;

    public CourierController(CourierRepository courierRepo) {
        this.courierRepo = courierRepo;
    }
// ----------- MAGNIFICELE OPERATII CRUD ----------------------
    // --- CREATE ---
    @PostMapping
    public ResponseEntity<CourierDto> create(@Valid @RequestBody CourierDto dto) {
        courierRepo.findByEmail(dto.getEmail())
                .ifPresent(c -> { throw new IllegalArgumentException("Email already used"); });

        Courier c = new Courier();
        c.setName(dto.getName());
        c.setEmail(dto.getEmail());
        c.setLastLat(dto.getLastLat());
        c.setLastLng(dto.getLastLng());

        if (dto.getManagerId() != null) {
            Courier mgr = courierRepo.findById(dto.getManagerId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found"));
            c.setManager(mgr);
        }

        Courier saved = courierRepo.save(c);

        CourierDto out = toDto(saved);
        return ResponseEntity.created(URI.create("/api/couriers/" + saved.getId())).body(out);
    }

    // --- READ all---

    @GetMapping
    public Page<CourierDto> list(Pageable pageable) {
        return courierRepo.findAll(pageable).map(this::toDto);
    }

    // --- READ one ---

    @GetMapping("/{id}")
    public CourierDto get(@PathVariable Long id) {
        return courierRepo.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Courier not found"));
    }

    // --- UPDATE (parțial) ---

    @PutMapping("/{id}")
    public CourierDto update(@PathVariable Long id, @Valid @RequestBody CourierDto dto) {
        Courier c = courierRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Courier not found"));

        if (dto.getName() != null) c.setName(dto.getName());
        if (dto.getEmail() != null) {
            courierRepo.findByEmail(dto.getEmail())
                    .filter(other -> !other.getId().equals(id))
                    .ifPresent(other -> { throw new IllegalArgumentException("Email already used"); });
            c.setEmail(dto.getEmail());
        }
        c.setLastLat(dto.getLastLat());
        c.setLastLng(dto.getLastLng());

        if (dto.getManagerId() != null) {
            Courier mgr = courierRepo.findById(dto.getManagerId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found"));
            c.setManager(mgr);
        } else {
            c.setManager(null);
        }

        return toDto(courierRepo.save(c));
    }

    @PatchMapping("/{id}")
    @Transactional
    public CourierDto patch(@PathVariable Long id, @Valid @RequestBody CourierPatchDto body) {
        Courier c = courierRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Courier not found"));

        if (body.name != null) c.setName(body.name.trim());
        if (body.getEmail() != null) {
            courierRepo.findByEmail(body.getEmail())
                    .filter(other -> !other.getId().equals(id))
                    .ifPresent(other -> { throw new IllegalArgumentException("Email already used"); });
            c.setEmail(body.getEmail());
        }
        if (body.getManagerId() != null) {
            Courier mgr = courierRepo.findById(body.getManagerId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found"));
            c.setManager(mgr);
        } else {
            c.setManager(null);
        }
        if (body.lastLat != null) c.setLastLat(body.lastLat);
        if (body.lastLng != null) c.setLastLng(body.lastLng);

        c = courierRepo.save(c);
        return toDto(c);
    }

    // ---DELETE---

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!courierRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courierRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---MAPPING SIMPLU---
    private CourierDto toDto(Courier c) {
        CourierDto d = new CourierDto();
        d.setId(c.getId());
        d.setName(c.getName());
        d.setEmail(c.getEmail());
        d.setLastLat(c.getLastLat());
        d.setLastLng(c.getLastLng());
        d.setManagerId(c.getManager() == null ? null : c.getManager().getId());
        return d;
    }
}
