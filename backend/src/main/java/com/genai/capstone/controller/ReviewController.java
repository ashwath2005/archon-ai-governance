package com.genai.capstone.controller;

import com.genai.capstone.dto.ApiResponse;
import com.genai.capstone.dto.ReviewHistoryDto;
import com.genai.capstone.dto.ReviewRequest;
import com.genai.capstone.dto.SubmissionResponseDto;
import com.genai.capstone.security.UserPrincipal;
import com.genai.capstone.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions/{id}")
@RequiredArgsConstructor
@Tag(name = "Review Workflow", description = "Endpoints for reviewing submissions and tracking review audit history")
public class ReviewController {

    private final ReviewService reviewService;

    @PutMapping("/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEWER')")
    @Operation(summary = "Review submission", description = "Update status (APPROVED / NEEDS_REVISION) and record reviewer feedback")
    public ResponseEntity<ApiResponse<SubmissionResponseDto>> reviewSubmission(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SubmissionResponseDto updated = reviewService.reviewSubmission(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", updated));
    }

    @GetMapping("/review-history")
    @Operation(summary = "Get review history", description = "Retrieves the complete audit trail of status changes and reviewer comments")
    public ResponseEntity<ApiResponse<List<ReviewHistoryDto>>> getReviewHistory(@PathVariable Long id) {
        List<ReviewHistoryDto> history = reviewService.getReviewHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
