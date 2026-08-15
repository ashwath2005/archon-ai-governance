package com.genai.capstone.service;

import com.genai.capstone.dto.ReviewHistoryDto;
import com.genai.capstone.dto.ReviewRequest;
import com.genai.capstone.dto.SubmissionResponseDto;
import com.genai.capstone.entity.ReviewHistory;
import com.genai.capstone.entity.Role;
import com.genai.capstone.entity.Status;
import com.genai.capstone.entity.Submission;
import com.genai.capstone.entity.User;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.exception.ResourceNotFoundException;
import com.genai.capstone.exception.UnauthorizedException;
import com.genai.capstone.repository.ReviewHistoryRepository;
import com.genai.capstone.repository.SubmissionRepository;
import com.genai.capstone.repository.UserRepository;
import com.genai.capstone.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final SubmissionRepository submissionRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;
    private final UserRepository userRepository;
    private final SubmissionService submissionService;

    @Transactional
    public SubmissionResponseDto reviewSubmission(Long submissionId, ReviewRequest request, UserPrincipal currentUser) {
        if (currentUser.getRole() == Role.INTERN) {
            throw new UnauthorizedException("Interns are not authorized to perform reviews");
        }

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        User reviewer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Status previousStatus = submission.getStatus();
        Status newStatus = request.getStatus();

        // Rule 4: Cannot approve if reasoning is missing
        if (newStatus == Status.APPROVED && !request.isReasoningIncluded()) {
            throw new BadRequestException("Submission cannot be APPROVED if reasoning is missing. Mark status as NEEDS_REVISION.");
        }

        submission.setStatus(newStatus);
        submission.setReasoningIncluded(request.isReasoningIncluded());
        submission.setReviewerNotes(request.getReviewerNotes());
        submission.setReviewedBy(reviewer);
        submission.setReviewedAt(LocalDateTime.now());

        Submission updated = submissionRepository.save(submission);

        // Rule 5: Log review history
        ReviewHistory history = ReviewHistory.builder()
                .submission(updated)
                .reviewer(reviewer)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .comments(request.getComments() != null ? request.getComments() : request.getReviewerNotes())
                .build();

        reviewHistoryRepository.save(history);

        return submissionService.mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<ReviewHistoryDto> getReviewHistory(Long submissionId) {
        if (!submissionRepository.existsById(submissionId)) {
            throw new ResourceNotFoundException("Submission", "id", submissionId);
        }

        return reviewHistoryRepository.findBySubmissionIdOrderByCreatedAtDesc(submissionId).stream()
                .map(history -> ReviewHistoryDto.builder()
                        .id(history.getId())
                        .submissionId(history.getSubmission().getId())
                        .reviewerId(history.getReviewer().getId())
                        .reviewerName(history.getReviewer().getName())
                        .previousStatus(history.getPreviousStatus())
                        .newStatus(history.getNewStatus())
                        .comments(history.getComments())
                        .createdAt(history.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
