package com.photostudio.model.packages;

import com.photostudio.model.clothes.Cloth;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "package_clothes", uniqueConstraints = @UniqueConstraint(
        name = "uk_package_cloth", columnNames = {"package_id", "cloth_id"}))
@Getter
@Setter
@NoArgsConstructor
public class PackageCloth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cloth_id", nullable = false)
    private Cloth cloth;

    @Column(nullable = false)
    private Integer quantity = 1;
}
