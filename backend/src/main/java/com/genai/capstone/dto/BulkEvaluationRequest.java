package com.genai.capstone.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BulkEvaluationRequest {

    @NotEmpty(message = "Evaluations list cannot be empty")
    @Valid
    private List<EvaluationRequest> evaluations;
}
