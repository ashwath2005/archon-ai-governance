package com.genai.capstone.controller;

import com.genai.capstone.dto.ApiResponse;
import com.genai.capstone.dto.BulkEvaluationRequest;
import com.genai.capstone.dto.EvaluationResponseDto;
import com.genai.capstone.service.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions/{submissionId}/evaluations")
@RequiredArgsConstructor
@Tag(name = "Evaluations", description = "Endpoints for managing rubric item evaluations and Decision + Reason checks")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    @Operation(summary = "Get evaluations for submission", description = "Retrieves all saved rubric item decisions and reasoning for a submission")
    public ResponseEntity<ApiResponse<List<EvaluationResponseDto>>> getEvaluations(@PathVariable Long submissionId) {
        List<EvaluationResponseDto> evaluations = evaluationService.getEvaluationsForSubmission(submissionId);
        return ResponseEntity.ok(ApiResponse.success(evaluations));
    }

    @PostMapping
    @Operation(summary = "Save rubric evaluations", description = "Saves decisions and mandatory reasoning for rubric items")
    public ResponseEntity<ApiResponse<List<EvaluationResponseDto>>> saveEvaluations(
            @PathVariable Long submissionId,
            @Valid @RequestBody BulkEvaluationRequest request) {
        List<EvaluationResponseDto> saved = evaluationService.saveBulkEvaluations(submissionId, request);
        return ResponseEntity.ok(ApiResponse.success("Evaluations saved successfully", saved));
    }
}
