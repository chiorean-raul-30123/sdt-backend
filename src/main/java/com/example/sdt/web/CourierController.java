package com.example.sdt.web;

import com.example.sdt.domain.Courier;
import com.example.sdt.repo.CourierRepository;
import com.example.sdt.web.dto.CourierDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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
        // prevenim dubluri pe email
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
    public List<CourierDto> list() {
        return courierRepo.findAll().stream().map(this::toDto).toList();
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
            // dacă email se schimbă, verifică unicitatea
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
