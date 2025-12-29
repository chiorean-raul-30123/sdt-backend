package com.example.sdt.repo;

import com.example.sdt.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    boolean existsByEmail(String email);
    Optional<Customer> findFirstByEmailIgnoreCase(String email);
}
