package com.photostudio.model.packages;

import com.photostudio.model.backgrounds.Background;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "package_backgrounds")
@Getter
@Setter
@NoArgsConstructor
public class PackageBackground {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "background_id", nullable = false)
    private Background background;

    public Long getPackageId() {
        return packageEntity != null ? packageEntity.getId() : null;
    }

    public Long getBackgroundId() {
        return background != null ? background.getId() : null;
    }
}
