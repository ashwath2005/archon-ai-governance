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
public class DashboardSummaryDto {
    private long totalSubmissions;
    private long notReviewed;
    private long needsRevision;
    private long approved;
    private long reasoningIncluded;
    private long reasoningMissing;
    private double approvalRate;
    private double reasoningRate;
    private List<SubmissionResponseDto> recentSubmissions;
}
