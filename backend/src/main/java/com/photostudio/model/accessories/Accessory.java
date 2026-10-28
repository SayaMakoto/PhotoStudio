package com.photostudio.model.accessories;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "accessories")
@Getter
@Setter
@NoArgsConstructor
public class Accessory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AccessoryType type;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    @Column(name = "price", nullable = false)
    private Double price = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccessoryStatus status = AccessoryStatus.available;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
