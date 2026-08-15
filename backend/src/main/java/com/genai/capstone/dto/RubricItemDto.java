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
public class RubricItemDto {
    private Long id;
    private Long sectionId;
    private String itemKey;
    private String itemName;
    private String description;
    private List<String> options;
    private boolean required;
    private Integer displayOrder;
}
