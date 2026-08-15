package com.genai.capstone.controller;

import com.genai.capstone.dto.*;
import com.genai.capstone.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for dynamic aggregated statistics and metrics from MySQL")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary metrics", description = "Returns dynamic real-time totals, status counts, and recent submissions from MySQL")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummary() {
        DashboardSummaryDto summary = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/status-distribution")
    @Operation(summary = "Get submission status distribution", description = "Returns breakdown of submissions by status (NOT_REVIEWED, NEEDS_REVISION, APPROVED)")
    public ResponseEntity<ApiResponse<List<StatusDistributionDto>>> getStatusDistribution() {
        List<StatusDistributionDto> distribution = dashboardService.getStatusDistribution();
        return ResponseEntity.ok(ApiResponse.success(distribution));
    }

    @GetMapping("/reasoning-summary")
    @Operation(summary = "Get reasoning inclusion summary", description = "Returns count and percentage of submissions with reasoning included vs missing")
    public ResponseEntity<ApiResponse<ReasoningSummaryDto>> getReasoningSummary() {
        ReasoningSummaryDto summary = dashboardService.getReasoningSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/domain-distribution")
    @Operation(summary = "Get domain distribution", description = "Returns breakdown of submissions by project domain")
    public ResponseEntity<ApiResponse<List<DomainDistributionDto>>> getDomainDistribution() {
        List<DomainDistributionDto> distribution = dashboardService.getDomainDistribution();
        return ResponseEntity.ok(ApiResponse.success(distribution));
    }
}
