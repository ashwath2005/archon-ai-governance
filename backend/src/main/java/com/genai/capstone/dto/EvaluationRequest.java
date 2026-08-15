package com.genai.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluationRequest {

    @NotNull(message = "Rubric item ID is required")
    private Long rubricItemId;

    @NotBlank(message = "Decision is required")
    private String decision;

    private String reasoning;

    private String reviewerComment;
}
