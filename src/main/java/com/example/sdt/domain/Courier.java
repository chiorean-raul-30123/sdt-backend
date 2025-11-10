package com.example.sdt.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(
        name = "couriers",
        uniqueConstraints = { @UniqueConstraint(name = "uk_couriers_email", columnNames = "email") }
)
public class Courier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    //un curier poate avea un "manager" care e tot curier (poate fi null)
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Courier manager;


    private Double lastLat;
    private Double lastLng;


    public Courier() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Courier getManager() { return manager; }
    public void setManager(Courier manager) { this.manager = manager; }

    public Double getLastLat() { return lastLat; }
    public void setLastLat(Double lastLat) { this.lastLat = lastLat; }

    public Double getLastLng() { return lastLng; }
    public void setLastLng(Double lastLng) { this.lastLng = lastLng; }

}
