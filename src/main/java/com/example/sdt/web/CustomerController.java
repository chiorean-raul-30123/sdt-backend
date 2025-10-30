package com.example.sdt.web;

import com.example.sdt.domain.Customer;
import com.example.sdt.repo.CustomerRepository;
import com.example.sdt.web.dto.CustomerCreateDto;
import com.example.sdt.web.dto.CustomerDto;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("api/customers")
public class CustomerController {

    private final CustomerRepository customerRepo;

    public CustomerController(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }
    // CREATE
    @PostMapping
    public ResponseEntity<CustomerDto> create(@Valid @RequestBody CustomerCreateDto dto) {
        if (dto.email != null && !dto.email.isBlank() && customerRepo.existsByEmail(dto.email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Customer c = new Customer();
        c.setType(dto.type);
        c.setName(dto.name);
        c.setContactPerson(dto.contactPerson);
        c.setEmail(dto.email);
        c.setPhone(dto.phone);
        c.setDefaultPickupAddress(dto.defaultPickupAddress);
        c.setDefaultDeliveryAddress(dto.defaultDeliveryAddress);

        c = customerRepo.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(c));
    }

    // GET by id
    @GetMapping("/{id}")
    public CustomerDto get(@PathVariable Long id) {
        Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        return toDto(c);
    }

    @GetMapping
    public Page<CustomerDto> list(Pageable pageable) {
        return customerRepo.findAll(pageable).map(this::toDto);
    }


    // UPDATE
    @PutMapping("/{id}")
    public CustomerDto update(@PathVariable Long id, @Valid @RequestBody CustomerDto dto) {
        Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        if (dto.getEmail() != null && !dto.getEmail().isBlank()
                && !dto.getEmail().equalsIgnoreCase(c.getEmail())
                && customerRepo.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (dto.getCustomerType() != null) c.setType(dto.getCustomerType());
        c.setName(dto.getName());
        c.setContactPerson(dto.getContactPerson());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setDefaultPickupAddress(dto.getDefaultPickupAddress());
        c.setDefaultDeliveryAddress(dto.getDefaultDeliveryAddress());

        c = customerRepo.save(c);
        return toDto(c);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!customerRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        customerRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // helpers
    private CustomerDto toDto(Customer c) {
        CustomerDto d = new CustomerDto();
        d.setId(c.getId());
        d.setCustomerType(c.getCustomerType());
        d.setName(c.getName());
        d.setContactPerson(c.getContactPerson());
        d.setEmail(c.getEmail());
        d.setPhone(c.getPhone());
        d.setDefaultPickupAddress(c.getDefaultPickupAddress());
        d.setDefaultDeliveryAddress(c.getDefaultDeliveryAddress());
        d.setCreatedAt(c.getCreatedAt());
        return d;
    }

    private Sort toSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) return Sort.by("createdAt").descending();
        String[] p = sortParam.split(",");
        String field = p[0];
        boolean desc = p.length > 1 && "desc".equalsIgnoreCase(p[1]);
        return desc ? Sort.by(field).descending() : Sort.by(field).ascending();
    }
}
