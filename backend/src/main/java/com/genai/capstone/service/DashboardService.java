package com.genai.capstone.service;

import com.genai.capstone.dto.*;
import com.genai.capstone.entity.Status;
import com.genai.capstone.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionService submissionService;

    @Transactional(readOnly = true)
    public DashboardSummaryDto getSummary() {
        long total = submissionRepository.count();
        long notReviewed = submissionRepository.countByStatus(Status.NOT_REVIEWED);
        long needsRevision = submissionRepository.countByStatus(Status.NEEDS_REVISION);
        long approved = submissionRepository.countByStatus(Status.APPROVED);
        long reasoningIncluded = submissionRepository.countByReasoningIncluded(true);
        long reasoningMissing = submissionRepository.countByReasoningIncluded(false);

        double approvalRate = total > 0 ? (double) approved / total * 100.0 : 0.0;
        double reasoningRate = total > 0 ? (double) reasoningIncluded / total * 100.0 : 0.0;

        List<SubmissionResponseDto> recentSubmissions = submissionRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(submissionService::mapToDto)
                .collect(Collectors.toList());

        return DashboardSummaryDto.builder()
                .totalSubmissions(total)
                .notReviewed(notReviewed)
                .needsRevision(needsRevision)
                .approved(approved)
                .reasoningIncluded(reasoningIncluded)
                .reasoningMissing(reasoningMissing)
                .approvalRate(Math.round(approvalRate * 10.0) / 10.0)
                .reasoningRate(Math.round(reasoningRate * 10.0) / 10.0)
                .recentSubmissions(recentSubmissions)
                .build();
    }

    @Transactional(readOnly = true)
    public List<StatusDistributionDto> getStatusDistribution() {
        long total = submissionRepository.count();
        List<Object[]> statusCounts = submissionRepository.countSubmissionsByStatusGroup();

        List<StatusDistributionDto> result = new ArrayList<>();
        for (Object[] row : statusCounts) {
            Status status = (Status) row[0];
            Long count = (Long) row[1];
            double pct = total > 0 ? (double) count / total * 100.0 : 0.0;
            result.add(StatusDistributionDto.builder()
                    .status(status.name())
                    .count(count)
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .build());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public ReasoningSummaryDto getReasoningSummary() {
        long total = submissionRepository.count();
        long included = submissionRepository.countByReasoningIncluded(true);
        long missing = submissionRepository.countByReasoningIncluded(false);

        double incPct = total > 0 ? (double) included / total * 100.0 : 0.0;
        double missPct = total > 0 ? (double) missing / total * 100.0 : 0.0;

        return ReasoningSummaryDto.builder()
                .includedCount(included)
                .missingCount(missing)
                .includedPercentage(Math.round(incPct * 10.0) / 10.0)
                .missingPercentage(Math.round(missPct * 10.0) / 10.0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DomainDistributionDto> getDomainDistribution() {
        List<Object[]> domainCounts = submissionRepository.countSubmissionsByDomain();
        List<DomainDistributionDto> result = new ArrayList<>();
        for (Object[] row : domainCounts) {
            String domain = (String) row[0];
            Long count = (Long) row[1];
            result.add(DomainDistributionDto.builder()
                    .domain(domain)
                    .count(count)
                    .build());
        }
        return result;
    }
}
