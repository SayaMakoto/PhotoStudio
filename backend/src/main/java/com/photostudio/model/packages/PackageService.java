package com.photostudio.model.packages;

import com.photostudio.model.services.StudioService;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "package_services")
@Getter
@Setter
@NoArgsConstructor
public class PackageService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private StudioService service;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    public Long getPackageId() { return packageEntity != null ? packageEntity.getId() : null; }
    public Long getServiceId() { return service != null ? service.getId() : null; }
}
