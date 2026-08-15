package com.genai.capstone.controller;

import com.genai.capstone.dto.*;
import com.genai.capstone.entity.Status;
import com.genai.capstone.security.UserPrincipal;
import com.genai.capstone.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Endpoints for managing capstone project submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    @Operation(summary = "Get paginated submissions", description = "Search, filter, sort, and paginate capstone submissions")
    public ResponseEntity<ApiResponse<PagedResponse<SubmissionResponseDto>>> getAllSubmissions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Boolean reasoningIncluded,
            @RequestParam(required = false) Long reviewerId,
            @RequestParam(required = false) Long internId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        PagedResponse<SubmissionResponseDto> response = submissionService.getAllSubmissions(
                search, status, reasoningIncluded, reviewerId, internId, page, size, sortBy, sortDir, currentUser
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get submission by ID", description = "Retrieves submission details for specified ID")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> getSubmissionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SubmissionResponseDto dto = submissionService.getSubmissionById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create capstone submission", description = "Create a new submission (Starts in NOT_REVIEWED status)")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> createSubmission(
            @Valid @RequestBody SubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SubmissionResponseDto created = submissionService.createSubmission(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Submission created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update submission", description = "Update project details (Resets status from NEEDS_REVISION to NOT_REVIEWED)")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SubmissionResponseDto updated = submissionService.updateSubmission(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete submission", description = "Permanently deletes a submission (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteSubmission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        submissionService.deleteSubmission(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Submission deleted successfully", null));
    }

    @GetMapping("/export")
    @Operation(summary = "Export submissions as CSV", description = "Generates a CSV file containing all filtered submissions")
    public ResponseEntity<InputStreamResource> exportSubmissions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Boolean reasoningIncluded,
            @RequestParam(required = false) Long reviewerId,
            @RequestParam(required = false) Long internId) {

        ByteArrayInputStream in = submissionService.exportSubmissionsToCsv(
                search, status, reasoningIncluded, reviewerId, internId
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=capstone_submissions.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }
}
