package com.genai.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EvaluationResponseDto {
    private Long id;
    private Long submissionId;
    private Long rubricItemId;
    private String itemKey;
    private String itemName;
    private Integer sectionCode;
    private String sectionName;
    private String decision;
    private String reasoning;
    private String reviewerComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
