package com.example.sdt.security;

import com.example.sdt.domain.Customer;
import com.example.sdt.repo.CourierRepository;
import com.example.sdt.repo.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final CourierRepository courierRepo;
    private final CustomerRepository customerRepo;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtService jwt,
                          CourierRepository courierRepo, CustomerRepository customerRepo) {
        this.userRepo = userRepo; this.encoder = encoder; this.jwt = jwt;
        this.courierRepo = courierRepo; this.customerRepo = customerRepo;
    }

    public record RegisterRequest(
            String email,
            String password,
            String name,
            String phone,
            String pickupAddress,
            String deliveryAddress,
            String contactPerson
    ) {}

    public record LoginRequest(String email, String password) {}

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest body) {
        String email = Objects.toString(body.email(), "").trim().toLowerCase();
        String pass  = Objects.toString(body.password(), "");
        if (email.isBlank() || pass.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message","Email & password required"));
        }
        if (userRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Email already registered"));
        }

        var courierOpt = courierRepo.findByEmail(email);
        Role role;
        Long courierId = null, customerId = null;

        if (courierOpt.isPresent()) {
            role = Role.COURIER;
            courierId = courierOpt.get().getId();
        } else {
            Customer existingCustomer = customerRepo.findFirstByEmailIgnoreCase(email).orElse(null);
            if (existingCustomer == null) {
                Customer c = new Customer();
                c.setName(Objects.toString(body.name(), "").trim());
                c.setEmail(email);
                c.setPhone(Objects.toString(body.phone(), "").trim());
                c.setDefaultPickupAddress(Objects.toString(body.pickupAddress(), "").trim());
                c.setDefaultDeliveryAddress(Objects.toString(body.deliveryAddress(), "").trim());
                c.setContactPerson(Objects.toString(body.contactPerson(), "").trim());
                existingCustomer = customerRepo.save(c);
            }
            role = Role.CUSTOMER;
            customerId = existingCustomer.getId();
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(pass));
        user.setRole(role);
        user.setCourierId(courierId);
        user.setCustomerId(customerId);
        userRepo.save(user);

        var response = new java.util.HashMap<String, Object>();
        response.put("token", jwt.generate(email, Map.of("role", role.name()), 24 * 3600_000L));
        response.put("role", role.name());
        response.put("courierId", courierId);
        response.put("customerId", customerId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body) {
        var user = userRepo.findByEmail(Objects.toString(body.email(),"").trim().toLowerCase()).orElse(null);
        if (user == null || !encoder.matches(body.password(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Invalid credentials"));
        }

        var claims = new java.util.HashMap<String, Object>();
        claims.put("role", user.getRole().name());
        if (user.getCourierId() != null)  claims.put("courierId", user.getCourierId());
        if (user.getCustomerId() != null) claims.put("customerId", user.getCustomerId());

        String token = jwt.generate(user.getEmail(), claims, 24 * 3600_000L);

        var response = new java.util.HashMap<String, Object>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("courierId", user.getCourierId());
        response.put("customerId", user.getCustomerId());

        return ResponseEntity.ok(response);
    }
}
