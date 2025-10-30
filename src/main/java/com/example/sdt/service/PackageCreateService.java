package com.example.sdt.service;

import com.example.sdt.repo.CourierRepository;
import com.example.sdt.repo.PackageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PackageCreateService {
    private final PackageRepository packageRepo;


    public PackageCreateService(PackageRepository packageRepo) {
        this.packageRepo = packageRepo;
    }

    public String generateUniqueTrackingCode() {
        for (int i = 0; i < 20; i++) {
            String candidate = generateTrackingCode();
            if (!packageRepo.existsByTrackingCode(candidate)) {
                return candidate;
            }
        }

        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Could not generate unique tracking code");
    }

    public String generateTrackingCode() {
        // RO + 10 cifre
        long n = (long) Math.floor(Math.random() * 1_000_000_0000L); // 0..9999999999
        String digits = String.format("%010d", n);
        return "RO" + digits;
    }
}
