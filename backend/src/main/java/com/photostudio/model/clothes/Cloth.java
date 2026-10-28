package com.photostudio.model.clothes;

import com.photostudio.model.users.UserGender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "clothes")
@Getter
@Setter
@NoArgsConstructor
public class Cloth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ClothType type;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "size", length = 255)
    private String size;

    // Dùng lại enum Male/Female của bảng users
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private UserGender gender;

    @Column(name = "color", length = 255)
    private String color;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "price", nullable = false)
    private Double price = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClothStatus status = ClothStatus.available;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
