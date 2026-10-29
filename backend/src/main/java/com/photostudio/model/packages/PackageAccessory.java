package com.photostudio.model.packages;

import com.photostudio.model.accessories.Accessory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "package_accessories", uniqueConstraints = @UniqueConstraint(
        name = "uk_package_accessory", columnNames = {"package_id", "accessory_id"}))
@Getter
@Setter
@NoArgsConstructor
public class PackageAccessory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accessory_id", nullable = false)
    private Accessory accessory;

    @Column(nullable = false)
    private Integer quantity = 1;
}
