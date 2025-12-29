package com.example.sdt.repo;

import com.example.sdt.domain.Courier;
import com.example.sdt.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourierRepository extends JpaRepository<Courier, Long> {
    Optional<Courier> findByEmail(String email);

}