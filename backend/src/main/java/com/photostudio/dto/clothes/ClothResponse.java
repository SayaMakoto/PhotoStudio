package com.photostudio.dto.clothes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClothResponse {

    private Long id;
    private String type;
    private String name;
    private String size;
    private String gender;
    private String color;
    private String description;
    private Double price;
    private String status;
}
