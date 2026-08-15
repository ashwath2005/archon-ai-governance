package com.genai.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RubricSectionDto {
    private Long id;
    private Integer sectionCode;
    private String sectionName;
    private String description;
    private Integer displayOrder;
    private boolean active;
    private List<RubricItemDto> items;
}
